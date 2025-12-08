using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Consensus;
using LibMetaJade.Domain;
using LibMetaJade.SmartContract;
using LibMetaJade.Monitoring;

namespace LibMetaJade.Examples
{
    /// <summary>
    /// 玄玉区块网络高级功能示例
    /// </summary>
    public class AdvancedMetaJadeExamples
    {
        /// <summary>
        /// 示例1：版权确权完整流程
        /// </summary>
        public static async Task Example1_CopyrightRegistrationAsync()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║   示例1：游戏版权确权与授权流程         ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

            // 1. 创建版权信息
            var copyright = new CopyrightInfo
            {
                Title = "星际征途 - 3D太空探险游戏",
                ContentType = "Game",
                AuthorCid = "bafk1111author0000",
                Description = "一款史诗级太空探险游戏，包含完整源代码、3D模型和音效资源",
                ContentCid = "bafk2222content0000",
                ContentHash = System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes("GameContent")),
                LicenseType = "Exclusive Rights",
                Tags = new List<string> { "游戏", "3D", "科幻", "太空" },
                Metadata = new Dictionary<string, string>
                {
           { "Engine", "Unity" },
       { "Platform", "PC/Mobile" },
               { "Language", "C#" }
                }
            };

            Console.WriteLine($"📝 作品信息:");
            Console.WriteLine($"   标题: {copyright.Title}");
            Console.WriteLine($"   作者: {copyright.AuthorCid[..16]}...");
            Console.WriteLine($"   类型: {copyright.ContentType}");
            Console.WriteLine();

            // 2. 创建版权合约
            var contract = CopyrightContract.Create(copyright, copyright.AuthorCid);
            Console.WriteLine($"✅ 版权合约已创建: {contract.ContractId}");
            Console.WriteLine();

            // 3. 部署合约到链上
            var manager = new SmartContractManager();
            var context = new TransactionContext
            {
                Amount = 0,
                Sensitivity = DataSensitivity.Critical,
                CurrentNetworkLoad = 0.4,
                TransactionType = "copyright",
                ParticipantTrustScore = 0.9
            };

            var contractId = await manager.DeployContractAsync(contract, context);
            Console.WriteLine($"🔗 合约已部署上链，合约ID: {contractId[..32]}...");
            Console.WriteLine();

            // 4. 激活合约
            var activateResult = await contract.ActivateAsync();
            Console.WriteLine($"🎬 合约激活: {activateResult.Message}");
            Console.WriteLine();

            // 5. 授权许可给游戏发行商
            Console.WriteLine("--- 授权流程 ---");
            var licenseParams = new Dictionary<string, object>
       {
 { "action", "license" },
      { "licenseeTo", "bafk3333publisher0000" },
      { "licenseType", "Distribution License" },
      { "expiryDate", DateTimeOffset.UtcNow.AddYears(5) },
         { "fee", 50000m }
            };

            var licenseResult = await manager.ExecuteContractAsync(contractId, licenseParams, context);
            Console.WriteLine($"   结果: {licenseResult.Message}");
            Console.WriteLine($"   许可ID: {licenseResult.Data["licenseId"]}");
            Console.WriteLine();

            // 6. 版权转让
            Console.WriteLine("--- 版权转让流程 ---");
            var transferParams = new Dictionary<string, object>
        {
 { "action", "transfer" },
         { "fromOwner", copyright.AuthorCid },
 { "newOwner", "bafk4444newowner0000" },
        { "price", 1000000m }
            };

            var transferResult = await manager.ExecuteContractAsync(contractId, transferParams, context);
            Console.WriteLine($"   结果: {transferResult.Message}");
            Console.WriteLine($"   新所有者: {transferResult.Data["newOwner"]}");
            Console.WriteLine();

            Console.WriteLine($"📊 {contract.GetSummary()}");
            Console.WriteLine();
        }

        /// <summary>
        /// 示例2：虚拟商品交易流程
        /// </summary>
        public static async Task Example2_VirtualGoodsTradeAsync()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║       示例2：稀有游戏道具交易流程           ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

            // 1. 创建虚拟商品信息
            var goods = new VirtualGoodsInfo
            {
                ItemId = "legendary_sword_dragonslayer",
                ItemName = "屠龙宝刀",
                ItemType = "Weapon",
                Rarity = "Legendary",
                Level = 99,
                Attributes = new Dictionary<string, object>
      {
     { "Attack", 999 },
   { "Defense", 666 },
         { "Critical", 50 },
         { "DurabilityMax", 1000 }
  },
                ImageCid = "bafk5555image0000",
                DataCid = "bafk6666model0000",
                Description = "传说中的神兵利器，攻击力惊人",
                IsTradeable = true,
                IsLimited = true,
                TotalSupply = 100
            };

            var sellerCid = "bafk7777seller0000";
            var buyerCid = "bafk8888buyer0000";
            var copyrightHolderCid = "bafk9999copyright0000"; // 游戏原创作者
            var price = 18888.88m;

            Console.WriteLine($"🎮 商品信息:");
            Console.WriteLine($"   名称: {goods.ItemName}");
            Console.WriteLine($"   稀有度: {goods.Rarity}");
            Console.WriteLine($"   价格: ¥{price}");
            Console.WriteLine($"卖家: {sellerCid[..16]}...");
            Console.WriteLine($"   买家: {buyerCid[..16]}...");
            Console.WriteLine();

            // 2. 创建交易合约
            var contract = VirtualGoodsTradeContract.Create(
     goods, sellerCid, buyerCid, price, copyrightHolderCid);

            var manager = new SmartContractManager();
            var context = new TransactionContext
            {
                Amount = price,
                Sensitivity = DataSensitivity.Sensitive,
                CurrentNetworkLoad = 0.5,
                TransactionType = "virtual_goods",
                ParticipantTrustScore = 0.75
            };

            var contractId = await manager.DeployContractAsync(contract, context);
            Console.WriteLine($"📝 交易合约已创建: {contractId[..32]}...");
            Console.WriteLine();

            // 3. 激活合约
            await contract.ActivateAsync();
            Console.WriteLine("✅ 合约已激活");
            Console.WriteLine();

            // 4. 买家付款
            Console.WriteLine("--- 步骤1: 买家付款 ---");
            var payParams = new Dictionary<string, object>
  {
           { "action", "pay" },
       { "amount", price }
          };

            var payResult = await manager.ExecuteContractAsync(contractId, payParams, context);
            Console.WriteLine($"   💰 {payResult.Message}");
            Console.WriteLine($"   托管金额: ¥{payResult.Data["escrowAmount"]}");
            Console.WriteLine($"   截止时间: {payResult.Data["deadline"]}");
            Console.WriteLine();

            // 5. 卖家发货
            Console.WriteLine("--- 步骤2: 卖家发货 ---");
            var shipParams = new Dictionary<string, object>
            {
             { "action", "ship" },
       { "operator", sellerCid }
 };

            var shipResult = await manager.ExecuteContractAsync(contractId, shipParams, context);
            Console.WriteLine($"   📦 {shipResult.Message}");
            Console.WriteLine($"   新所有者: {shipResult.Data["newOwner"]}");
            Console.WriteLine();

            // 6. 买家确认收货
            Console.WriteLine("--- 步骤3: 买家确认收货 ---");
            var confirmParams = new Dictionary<string, object>
      {
            { "action", "confirm" },
    { "operator", buyerCid }
            };

            var confirmResult = await manager.ExecuteContractAsync(contractId, confirmParams, context);
            Console.WriteLine($"   ✅ {confirmResult.Message}");
            Console.WriteLine($"   卖家收益: ¥{confirmResult.Data["sellerRevenue"]}");
            Console.WriteLine($"   平台手续费: ¥{confirmResult.Data["platformFee"]}");
            Console.WriteLine($"   版权费: ¥{confirmResult.Data["copyrightFee"]} (支付给原创作者)");
            Console.WriteLine();

            Console.WriteLine($"📊 {contract.GetSummary()}");
            Console.WriteLine();
        }

        /// <summary>
        /// 示例3：性能监控演示
        /// </summary>
        public static async Task Example3_PerformanceMonitoringAsync()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║       示例3：网络性能监控与统计       ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

            var monitor = new PerformanceMonitor();
            var random = new Random();

            Console.WriteLine("🔄 模拟100笔交易...\n");

            // 模拟100笔交易
            for (int i = 0; i < 100; i++)
            {
                var priority = (TransactionPriority)(random.Next(1, 5));
                var context = new TransactionContext
                {
                    Amount = random.Next(10, 50000),
                    Sensitivity = (DataSensitivity)random.Next(0, 4),
                    CurrentNetworkLoad = random.NextDouble(),
                    TransactionType = "test",
                    ParticipantTrustScore = 0.5 + random.NextDouble() * 0.5
                };

                var data = Encoding.UTF8.GetBytes($"Transaction {i}");
                var block = MetaJadeBlock.CreateWithContext(data, context);

                // 模拟交易确认
                var sw = Stopwatch.StartNew();
                await Task.Delay(random.Next(10, 200)); // 模拟网络延迟
                sw.Stop();

                var success = random.NextDouble() > 0.05; // 95%成功率
                monitor.RecordTransaction(block, sw.ElapsedMilliseconds, success);

                if ((i + 1) % 20 == 0)
                    Console.Write($".");
            }

            Console.WriteLine(" 完成!\n");

            // 生成报告
            Console.WriteLine(monitor.GenerateReport());

            // 按优先级查看统计
            Console.WriteLine("=== 各优先级详细统计 ===");
            foreach (var priority in Enum.GetValues<TransactionPriority>())
            {
                var metrics = monitor.GetMetricsByPriority(priority);
                if (metrics.TotalTransactions > 0)
                {
                    Console.WriteLine($"\n{priority}:");
                    Console.WriteLine($"  交易数: {metrics.TotalTransactions}");
                    Console.WriteLine($"  平均确认时间: {metrics.AverageConfirmationTime:F2} ms");
                    Console.WriteLine($"  平均共识深度: {metrics.AverageConsensusDepth:F2} 层");
                }
            }
            Console.WriteLine();
        }

        /// <summary>
        /// 示例4：网络健康检测
        /// </summary>
        public static async Task Example4_NetworkHealthCheckAsync()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║       示例4：网络健康状态检测     ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

            var healthMonitor = new NetworkHealthMonitor();

            Console.WriteLine("🔍 正在检测网络健康状态...\n");

            var status = await healthMonitor.CheckHealthAsync();

            Console.WriteLine(healthMonitor.GenerateHealthReport());

            // 根据健康等级提供建议
            Console.WriteLine("=== 运维建议 ===");
            switch (status.Level)
            {
                case HealthLevel.Excellent:
                    Console.WriteLine("✅ 网络状态优秀，保持现状");
                    break;
                case HealthLevel.Good:
                    Console.WriteLine("🟢 网络状态良好，可考虑扩容节点");
                    break;
                case HealthLevel.Fair:
                    Console.WriteLine("🟡 网络状态一般，建议检查低信任节点");
                    break;
                case HealthLevel.Poor:
                    Console.WriteLine("🟠 网络状态较差，需要优化节点连接");
                    break;
                case HealthLevel.Critical:
                    Console.WriteLine("🔴 网络状态危险，立即检查网络故障");
                    break;
            }
            Console.WriteLine();
        }

        /// <summary>
        /// 运行所有高级示例
        /// </summary>
        public static async Task RunAllAdvancedExamplesAsync()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║     玄玉区块网络 - 高级功能演示 ║");
            Console.WriteLine("║   智能合约 + 性能监控 + 健康检测     ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

            await Example1_CopyrightRegistrationAsync();
            Console.WriteLine("\n" + new string('─', 60) + "\n");

            await Example2_VirtualGoodsTradeAsync();
            Console.WriteLine("\n" + new string('─', 60) + "\n");

            await Example3_PerformanceMonitoringAsync();
            Console.WriteLine("\n" + new string('─', 60) + "\n");

            await Example4_NetworkHealthCheckAsync();

            Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
            Console.WriteLine("║    所有高级示例运行完毕      ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════════╝");
        }
    }
}

