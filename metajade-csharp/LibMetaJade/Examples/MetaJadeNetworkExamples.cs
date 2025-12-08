using System;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Consensus;
using LibMetaJade.Domain;
using LibMetaJade.Network;
using LibMetaJade.Storage;

namespace LibMetaJade.Examples
{
    /// <summary>
    /// 玄玉区块网络核心功能示例
    /// 演示动态共识深度、六度路由、自适应分块等核心特性
    /// </summary>
    public class MetaJadeNetworkExamples
    {
        /// <summary>
        /// 示例1：创建不同优先级的交易区块
        /// </summary>
        public static async Task Example1_CreateTransactionBlocksAsync()
        {
            Console.WriteLine("=== 示例1：动态共识深度演示 ===\n");

   // 场景1：普通游戏道具交易（低价值）
            var lowValueContext = new TransactionContext
      {
Amount = 50,
     Sensitivity = DataSensitivity.Normal,
            CurrentNetworkLoad = 0.3,
    TransactionType = "game_item",
            ParticipantTrustScore = 0.8
        };

            var lowValueBlock = MetaJadeBlock.CreateWithContext(
                Encoding.UTF8.GetBytes("普通游戏道具：生命药水 x10"),
                lowValueContext
            );

            Console.WriteLine($"低价值交易: {lowValueBlock.GetBlockInfo()}");

            // 场景2：高价值虚拟商品交易
            var highValueContext = new TransactionContext
            {
           Amount = 15000,
Sensitivity = DataSensitivity.Sensitive,
       CurrentNetworkLoad = 0.5,
    TransactionType = "rare_item",
    ParticipantTrustScore = 0.6,
     IsFirstTransaction = true
 };

 var highValueBlock = MetaJadeBlock.CreateWithContext(
           Encoding.UTF8.GetBytes("稀有游戏道具：传说武器"),
       highValueContext
     );

      Console.WriteLine($"高价值交易: {highValueBlock.GetBlockInfo()}");

       // 场景3：游戏版权确权（核心资产）
            var copyrightContext = new TransactionContext
            {
              Amount = 0, // 版权价值无法直接量化
  Sensitivity = DataSensitivity.Critical,
           CurrentNetworkLoad = 0.4,
        TransactionType = "copyright",
          ParticipantTrustScore = 0.9
   };

            var copyrightBlock = MetaJadeBlock.CreateWithContext(
   Encoding.UTF8.GetBytes("游戏版权：《星际征途》核心源代码"),
     copyrightContext
            );

            Console.WriteLine($"版权交易: {copyrightBlock.GetBlockInfo()}");

  // 验证共识深度
 var depthManager = new DynamicConsensusDepthManager();
  
 Console.WriteLine("\n--- 共识验证 ---");
            var lowResult = await depthManager.ValidateWithDepthAsync(lowValueBlock, lowValueBlock.ConsensusDepth);
       Console.WriteLine($"低价值交易验证: {lowResult.Details}");

    var highResult = await depthManager.ValidateWithDepthAsync(highValueBlock, highValueBlock.ConsensusDepth);
            Console.WriteLine($"高价值交易验证: {highResult.Details}");

            var copyrightResult = await depthManager.ValidateWithDepthAsync(copyrightBlock, copyrightBlock.ConsensusDepth);
          Console.WriteLine($"版权交易验证: {copyrightResult.Details}\n");
  }

    /// <summary>
        /// 示例2：六度原理路由
    /// </summary>
   public static async Task Example2_SixDegreeRoutingAsync()
        {
       Console.WriteLine("=== 示例2：六度原理路由 ===\n");

      var router = new SixDegreeRouter();

 // 模拟节点CID
            var nodeA = "bafk1234abcd5678efgh";
   var nodeB = "bafk9876zyxw5432vuts";

            // 查找最短路径
  var path = await router.FindShortestPathAsync(nodeA, nodeB);

    if (path != null)
            {
        Console.WriteLine($"从节点 {nodeA} 到 {nodeB}:");
         Console.WriteLine($"路径跳数: {path.Hops}");
    Console.WriteLine($"平均信任评分: {path.TotalTrustScore:F2}");
   Console.WriteLine($"预估延迟: {path.AverageLatency}ms");
             Console.WriteLine($"路径: {string.Join(" -> ", path.NodeCIDs.Select(c => c[..8] + "..."))}\n");
         }

    // 计算节点信任度
     var trustScore = await router.CalculateTrustScoreAsync(nodeA, 0);
            Console.WriteLine($"节点 {nodeA[..8]}... 的信任评分: {trustScore:F2}");

            // 优化网络拓扑
   Console.WriteLine("\n执行网络拓扑优化...");
            await router.OptimizeNodeTopologyAsync();
            Console.WriteLine("优化完成：低连接度节点已连接到超级节点\n");
        }

        /// <summary>
   /// 示例3：IPFS自适应分块
        /// </summary>
        public static void Example3_AdaptiveChunking()
        {
          Console.WriteLine("=== 示例3：IPFS自适应分块策略 ===\n");

            var chunking = new AdaptiveChunkingStrategy();

         // 测试不同大小的文件
            long[] fileSizes = {
        500 * 1024,        // 500KB 小文件
     5 * 1024 * 1024,      // 5MB 中等文件
    150 * 1024 * 1024,    // 150MB 大文件
          2L * 1024 * 1024 * 1024 // 2GB 超大文件
            };

    foreach (var size in fileSizes)
   {
                var strategy = chunking.GetStrategyDescription(size);
   Console.WriteLine(strategy);
          }
  Console.WriteLine();
}

        /// <summary>
        /// 示例4：完整的游戏道具交易流程
        /// </summary>
      public static async Task Example4_CompleteGameItemTransactionAsync()
        {
     Console.WriteLine("=== 示例4：完整的游戏道具交易流程 ===\n");

  // 1. 买家和卖家信息
       var buyerCid = "bafk1111buyer0000";
            var sellerCid = "bafk2222seller0000";

 // 2. 创建虚拟商品数据
   var itemData = new
         {
      ItemId = "legendary_sword_001",
    ItemName = "屠龙刀",
  Level = 99,
      Attributes = new { Attack = 999, Defense = 500 },
             Owner = sellerCid,
       Price = 8888.88m
    };

            var itemJson = System.Text.Json.JsonSerializer.Serialize(itemData);
            var itemBytes = Encoding.UTF8.GetBytes(itemJson);

  // 3. 构建交易上下文
      var context = new TransactionContext
   {
           Amount = itemData.Price,
       Sensitivity = DataSensitivity.Sensitive,
    CurrentNetworkLoad = await new DefaultNetworkMetricsProvider().GetNetworkLoadAsync(),
        TransactionType = "virtual_goods",
    ParticipantTrustScore = 0.75,
    IsFirstTransaction = false
         };

        Console.WriteLine($"交易金额: ?{context.Amount}");
     Console.WriteLine($"交易优先级: {context.Priority}");
Console.WriteLine($"网络负载: {context.CurrentNetworkLoad:P1}\n");

            // 4. 创建交易区块
            var transactionBlock = MetaJadeBlock.CreateWithContext(
            itemBytes,
         context,
       relations: new[] { sellerCid, buyerCid } // 关联买卖双方
            );

  Console.WriteLine($"区块已创建: {transactionBlock.GetBlockInfo()}\n");

            // 5. 查找买卖双方之间的路由
            var router = new SixDegreeRouter();
            var routePath = await router.FindShortestPathAsync(sellerCid, buyerCid);

       if (routePath != null)
            {
   Console.WriteLine($"交易路由: {routePath.Hops} 跳");
        Console.WriteLine($"路径信任度: {routePath.TotalTrustScore:F2}\n");
            }

        // 6. 执行共识验证
       var depthManager = new DynamicConsensusDepthManager();
 var consensusResult = await depthManager.ValidateWithDepthAsync(
            transactionBlock,
   transactionBlock.ConsensusDepth
      );

            Console.WriteLine("--- 共识验证结果 ---");
       Console.WriteLine($"共识状态: {(consensusResult.IsConsensusReached ? "? 达成" : "? 失败")}");
            Console.WriteLine($"参与节点: {consensusResult.ParticipatingNodes}");
            Console.WriteLine($"验证通过率: {consensusResult.ApprovalRatio:P1}");
            Console.WriteLine($"验证耗时: {consensusResult.ElapsedMilliseconds}ms");

// 7. 序列化与反序列化测试
  var serialized = transactionBlock.ToBytes();
            Console.WriteLine($"\n序列化大小: {serialized.Length} bytes");

 var deserialized = MetaJadeBlock.FromBytes(serialized);
        Console.WriteLine($"反序列化成功，CID匹配: {deserialized.CID == transactionBlock.CID}");
            Console.WriteLine($"哈希验证: {deserialized.VerifyHash()}\n");
        }

        /// <summary>
        /// 运行所有示例
        /// </summary>
public static async Task RunAllExamplesAsync()
        {
  Console.WriteLine("╔════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║          玄玉区块网络 (MetaJade Network)       ║");
 Console.WriteLine("║    动态共识深度 + 六度原理 + IPFS 自适应分块    ║");
          Console.WriteLine("╚════════════════════════════════════════════════════════════╝\n");

         await Example1_CreateTransactionBlocksAsync();
       await Example2_SixDegreeRoutingAsync();
     Example3_AdaptiveChunking();
            await Example4_CompleteGameItemTransactionAsync();

         Console.WriteLine("╔════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║           所有示例运行完毕                 ║");
          Console.WriteLine("╚════════════════════════════════════════════════════════════╝");
        }
    }
}
