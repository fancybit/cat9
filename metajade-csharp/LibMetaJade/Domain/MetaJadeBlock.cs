using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using LibMetaJade.Protos;
using LibMetaJade.Consensus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace LibMetaJade.Domain
{
    // Non-generic convenience block for raw bytes payload
    public sealed class MetaJadeBlock : MetaJadeBlock<byte[]>
    {
        private MetaJadeBlock(MetaJadeBlock<byte[]> inner)
        {
            CID = inner.CID;
            Timestamp = inner.Timestamp;
            Hash = inner.Hash;
            PayloadBytes = inner.PayloadBytes;
            Payload = inner.Payload;
            _proto = inner.ToProto();
            ConsensusDepth = inner.ConsensusDepth;
            TransactionPriority = inner.TransactionPriority;
        }

        public static new MetaJadeBlock Create(byte[] payload, IEnumerable<string>? relations = null, DateTimeOffset? timestamp = null)
        {
            var inner = MetaJadeBlock<byte[]>.Create(payload, p => p, relations, timestamp);
            return new MetaJadeBlock(inner);
        }

        public static MetaJadeBlock CreateWithContext(
         byte[] payload,
                 TransactionContext context,
                 IEnumerable<string>? relations = null)
        {
            var inner = MetaJadeBlock<byte[]>.CreateWithContext(payload, p => p, context, relations);
            return new MetaJadeBlock(inner);
        }

        public static new MetaJadeBlock FromBytes(byte[] bytes)
        {
            var inner = MetaJadeBlock<byte[]>.FromBytes(bytes, b => b);
            return new MetaJadeBlock(inner);
        }
    }

    /// <summary>Generic MetaJade block wrapper carrying typed payload T.</summary>
    public class MetaJadeBlock<T>
    {
        internal ProtoMetaJadeBlock _proto = new();

        public string CID { get; protected set; } = string.Empty;
        public DateTimeOffset Timestamp { get; protected set; } = DateTimeOffset.UtcNow;
        public IReadOnlyList<string> RelationCIDList => _proto.RelationCids;
        public byte[] Hash { get; protected set; } = Array.Empty<byte>();
        public byte[] PayloadBytes { get; protected set; } = Array.Empty<byte>();
        public T? Payload { get; protected set; }

        /// <summary>共识深度（参与验证的节点层级）</summary>
        public int ConsensusDepth { get; protected set; } = 1;

        /// <summary>交易优先级</summary>
        public TransactionPriority TransactionPriority { get; protected set; } = TransactionPriority.Low;

        /// <summary>区块创建时的网络负载快照</summary>
        public double NetworkLoadSnapshot { get; protected set; }

        /// <summary>参与共识的节点数量</summary>
        public int ConsensusNodesCount { get; protected set; }

        protected MetaJadeBlock() { }

        public static MetaJadeBlock<T> Create(T payload, Func<T, byte[]> payloadSerializer, IEnumerable<string>? relations = null, DateTimeOffset? timestamp = null)
        {
            ArgumentNullException.ThrowIfNull(payloadSerializer);
            if (payload is null && default(T) is null)
                throw new ArgumentNullException(nameof(payload));

            var block = new MetaJadeBlock<T>();
            block.Payload = payload;
            block.PayloadBytes = payloadSerializer(payload) ?? Array.Empty<byte>();
            block.Timestamp = timestamp ?? DateTimeOffset.UtcNow;

            // 线程安全的哈希计算
            block.Hash = SHA256.HashData(block.PayloadBytes);

            // 基于内容哈希生成 CID
            block.CID = GenerateCid(block.Hash);

            block._proto = new ProtoMetaJadeBlock
            {
                Timestamp = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTimeOffset(block.Timestamp),
                Data = ByteString.CopyFrom(block.PayloadBytes),
                Hash = ByteString.CopyFrom(block.Hash)
            };
            if (relations != null) block._proto.RelationCids.AddRange(relations);
            return block;
        }

        /// <summary>
        /// 创建带交易上下文的区块（支持动态共识深度）
        /// </summary>
        public static MetaJadeBlock<T> CreateWithContext(
          T payload,
            Func<T, byte[]> payloadSerializer,
            TransactionContext context,
            IEnumerable<string>? relations = null)
        {
            var block = Create(payload, payloadSerializer, relations, context.Amount > 0 ? DateTimeOffset.UtcNow : null);

            // 设置交易优先级
            block.TransactionPriority = context.Priority;

            // 计算共识深度
            var depthManager = new DynamicConsensusDepthManager();
            block.ConsensusDepth = depthManager.CalculateOptimalDepth(context);

            // 记录网络负载快照
            block.NetworkLoadSnapshot = context.CurrentNetworkLoad;

            // 估算参与节点数
            block.ConsensusNodesCount = (int)(context.GetRecommendedNodeParticipationRatio() * 100);

            return block;
        }

        public static MetaJadeBlock<T> FromBytes(byte[] bytes, Func<byte[], T> payloadDeserializer)
        {
            ArgumentNullException.ThrowIfNull(bytes);
            ArgumentNullException.ThrowIfNull(payloadDeserializer);

            var block = new MetaJadeBlock<T>();
            try
            {
                block._proto = ProtoMetaJadeBlock.Parser.ParseFrom(bytes);
            }
            catch (InvalidProtocolBufferException ex)
            {
                throw new ArgumentException("Invalid protobuf data", nameof(bytes), ex);
            }

            block.Timestamp = block._proto.Timestamp?.ToDateTimeOffset() ?? DateTimeOffset.UtcNow;
            block.PayloadBytes = block._proto.Data?.ToByteArray() ?? Array.Empty<byte>();
            block.Payload = block.PayloadBytes.Length > 0 ? payloadDeserializer(block.PayloadBytes) : default;

            // 验证或重新计算哈希
            var storedHash = block._proto.Hash?.ToByteArray();
            var computedHash = SHA256.HashData(block.PayloadBytes);

            if (storedHash != null && storedHash.Length > 0)
            {
                if (!storedHash.SequenceEqual(computedHash))
                    throw new InvalidOperationException("Hash verification failed during deserialization");
                block.Hash = storedHash;
            }
            else
            {
                block.Hash = computedHash;
            }

            // 从哈希重新生成 CID
            block.CID = GenerateCid(block.Hash);

            return block;
        }

        public byte[] ToBytes() => _proto.ToByteArray();
        public ProtoMetaJadeBlock ToProto() => _proto;

        public bool VerifyHash()
        {
            var computed = SHA256.HashData(PayloadBytes);
            return computed.SequenceEqual(Hash);
        }

        public string GetHashHex() => Convert.ToHexString(Hash);

        /// <summary>
        /// 获取区块的详细信息（包含共识参数）
        /// </summary>
        public string GetBlockInfo()
        {
            return $"CID: {CID[..16]}..., " +
   $"Priority: {TransactionPriority}, " +
     $"ConsensusDepth: {ConsensusDepth}, " +
         $"Nodes: {ConsensusNodesCount}, " +
              $"NetworkLoad: {NetworkLoadSnapshot:P1}, " +
             $"Size: {PayloadBytes.Length} bytes";
        }

        /// <summary>
        /// 从哈希生成内容寻址的 CID（简化版）
        /// 实际生产环境应使用 IPFS CIDv1 标准（Multihash + Multibase）
        /// </summary>
        private static string GenerateCid(byte[] hash)
        {
            // 简化实现：使用 "bafk" 前缀 + base32 编码的哈希
            // 真实实现应该：bafk + base32(0x01 + 0x55 + sha256(data))
            var base32 = Convert.ToBase64String(hash)
                    .Replace("+", "")
               .Replace("/", "")
                 .Replace("=", "")
               .ToLowerInvariant();
            return $"bafk{base32}";
        }
    }
}
