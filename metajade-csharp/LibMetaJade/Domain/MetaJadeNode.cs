using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using LibMetaJade.P2P;

namespace LibMetaJade.Domain
{
    /// <summary>
    /// Represents an application level node (user) in the MetaJade network.
    /// Uses the P2P CID (content identifier) as the stable user id.
    /// Maintains friend list, chat history and transaction records in-memory.
    /// </summary>
    public class MetaJadeNode
    {
        private readonly IP2pService _p2p;
        private readonly object _sync = new();
        private readonly List<string> _friends = new();
        private readonly List<ChatMessage> _chatMessages = new();
        private readonly List<TransactionRecord> _transactions = new();

        /// <summary>
        /// Gets the CID that identifies this node (user id).
        /// </summary>
        public string UserCid { get; }

        public MetaJadeNode(string userCid, IP2pService p2pService)
        {
            UserCid = string.IsNullOrWhiteSpace(userCid) ? throw new ArgumentException("CID required", nameof(userCid)) : userCid;
            _p2p = p2pService ?? throw new ArgumentNullException(nameof(p2pService));
        }

        /// <summary>
        /// Adds a friend CID to the friend list.
        /// </summary>
        public Task<bool> AddFriendAsync(string friendCid, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(friendCid)) throw new ArgumentException("CID cannot be empty", nameof(friendCid));
            lock (_sync)
            {
                if (_friends.Contains(friendCid)) return Task.FromResult(false);
                _friends.Add(friendCid);
                return Task.FromResult(true);
            }
        }

        /// <summary>
        /// Adds a chat message (either incoming or outgoing).
        /// </summary>
        public Task<ChatMessage> AddChatMessageAsync(string fromCid, string toCid, string content, DateTimeOffset? timestamp = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(fromCid)) throw new ArgumentException("fromCid required", nameof(fromCid));
            if (string.IsNullOrWhiteSpace(toCid)) throw new ArgumentException("toCid required", nameof(toCid));
            if (content is null) throw new ArgumentNullException(nameof(content));
            var msg = new ChatMessage(fromCid, toCid, content, timestamp ?? DateTimeOffset.UtcNow);
            lock (_sync)
            {
                _chatMessages.Add(msg);
            }
            return Task.FromResult(msg);
        }

        /// <summary>
        /// Adds a transaction record (could represent token transfer or other on-chain action).
        /// </summary>
        public Task<TransactionRecord> AddTransactionAsync(string txId, string fromCid, string toCid, decimal amount, string? metadata = null, DateTimeOffset? timestamp = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(txId)) throw new ArgumentException("txId required", nameof(txId));
            if (string.IsNullOrWhiteSpace(fromCid)) throw new ArgumentException("fromCid required", nameof(fromCid));
            if (string.IsNullOrWhiteSpace(toCid)) throw new ArgumentException("toCid required", nameof(toCid));
            if (amount < 0) throw new ArgumentOutOfRangeException(nameof(amount));
            var record = new TransactionRecord(txId, fromCid, toCid, amount, metadata, timestamp ?? DateTimeOffset.UtcNow);
            lock (_sync)
            {
                _transactions.Add(record);
            }
            return Task.FromResult(record);
        }

        /// <summary>
        /// Returns a snapshot of current friends.
        /// </summary>
        public IReadOnlyList<string> GetFriends()
        {
            lock (_sync) return _friends.ToList();
        }

        /// <summary>
        /// Returns chat history, optionally filtered by a participant CID.
        /// </summary>
        public IReadOnlyList<ChatMessage> GetChatHistory(string? participantCid = null)
        {
            lock (_sync)
            {
                return participantCid is null
                ? _chatMessages.OrderBy(m => m.Timestamp).ToList()
                : _chatMessages.Where(m => m.FromCid == participantCid || m.ToCid == participantCid)
                .OrderBy(m => m.Timestamp)
                .ToList();
            }
        }

        /// <summary>
        /// Returns transactions optionally filtered by cid involvement.
        /// </summary>
        public IReadOnlyList<TransactionRecord> GetTransactions(string? participantCid = null)
        {
            lock (_sync)
            {
                return participantCid is null
                ? _transactions.OrderBy(t => t.Timestamp).ToList()
                : _transactions.Where(t => t.FromCid == participantCid || t.ToCid == participantCid)
                .OrderBy(t => t.Timestamp)
                .ToList();
            }
        }

        /// <summary>
        /// Serializes the node state to JSON (excluding runtime services).
        /// </summary>
        public string ToJson(JsonSerializerOptions? options = null)
        {
            var dto = new MetaJadeNodeDto(UserCid, GetFriends(), GetChatHistory(), GetTransactions());
            return JsonSerializer.Serialize(dto, options ?? DefaultJsonOptions);
        }

        /// <summary>
        /// Rehydrates a MetaJadeNode from JSON (friends, chats, transactions) with provided p2p service.
        /// </summary>
        public static MetaJadeNode FromJson(string json, IP2pService p2pService, JsonSerializerOptions? options = null)
        {
            var dto = JsonSerializer.Deserialize<MetaJadeNodeDto>(json, options ?? DefaultJsonOptions) ?? throw new InvalidOperationException("Invalid JSON");
            var node = new MetaJadeNode(dto.UserCid, p2pService);
            foreach (var f in dto.Friends) node._friends.Add(f);
            node._chatMessages.AddRange(dto.ChatMessages);
            node._transactions.AddRange(dto.Transactions);
            return node;
        }

        private static readonly JsonSerializerOptions DefaultJsonOptions = new(JsonSerializerDefaults.Web)
        {
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        #region DTO + Records
        private record MetaJadeNodeDto(string UserCid, IReadOnlyList<string> Friends, IReadOnlyList<ChatMessage> ChatMessages, IReadOnlyList<TransactionRecord> Transactions);
        public record ChatMessage(string FromCid, string ToCid, string Content, DateTimeOffset Timestamp);
        public record TransactionRecord(string TxId, string FromCid, string ToCid, decimal Amount, string? Metadata, DateTimeOffset Timestamp);
        #endregion
    }
}
