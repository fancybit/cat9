using System;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Consensus;
using LibMetaJade.Domain;
using LibMetaJade.Network;
using LibMetaJade.Storage;
using LibMetaJade.SmartContract;
using LibMetaJade.Monitoring;
using LibMetaJade.Examples;
using LibMetaJade.Economy;
using System.Collections.Generic;
using System.Text.Json;
using System.IO;
using System.Linq;

namespace MetaJade.ConsoleTest
{
    /// <summary>
    ///玄玉区块网络控制台测试程序
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            try
            {
                // 设置控制台编码
                Console.OutputEncoding = Encoding.UTF8;

                // 显示欢迎界面
                ShowWelcome();

                // 显示菜单并处理用户选择
                await RunInteractiveMenuAsync();
            }
            catch (Exception ex)
            {
                ShowError($"程序异常: {ex.Message}", ex);
            }
        }

        static void ShowWelcome()
        {
            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║          ║");
            Console.WriteLine("║  玄玉区块网络 (MetaJade Network)      ║");
            Console.WriteLine("║          控制台测试程序 v2.0     ║");
            Console.WriteLine("║    ║");
            Console.WriteLine("║  基于区块链、六度原理与IPFS的分布式网络       ║");
            Console.WriteLine("║  动态共识深度 + 智能合约 + 性能监控     ║");
            Console.WriteLine("║        ║");
            Console.WriteLine("╚════════════════════════════════════════════════════════════════╝");
            Console.ResetColor();
            Console.WriteLine();
        }

        static async Task RunInteractiveMenuAsync()
        {
            while (true)
            {
                ShowMainMenu();
                var choice = Console.ReadLine()?.Trim();

                Console.WriteLine();

                switch (choice)
                {
                    case "1":
                        await RunBasicExamplesAsync();
                        break;
                    case "2":
                        await RunAdvancedExamplesAsync();
                        break;
                    case "3":
                        await RunAllExamplesAsync();
                        break;
                    case "4":
                        await RunCustomTestAsync();
                        break;
                    case "5":
                        ShowAboutInfo();
                        break;
                    case "0":
                    case "exit":
                    case "quit":
                        Console.WriteLine("感谢使用玄玉区块网络！再见！");
                        return;
                    default:
                        ShowWarning("无效的选项，请重新选择");
                        break;
                }

                Console.WriteLine("\n按任意键继续...");
                Console.ReadKey();
            }
        }

        static void ShowMainMenu()
        {
            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("═══════════════════════════════════════════════════════");
            Console.WriteLine("    主菜单  ");
            Console.WriteLine("═══════════════════════════════════════════════════════");
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine("  [1] 基础功能演示");
            Console.WriteLine("      → 动态共识深度、六度路由、IPFS分块");
            Console.WriteLine();
            Console.WriteLine("  [2] 高级功能演示");
            Console.WriteLine("      → 智能合约、版权确权、虚拟商品交易、性能监控");
            Console.WriteLine();
            Console.WriteLine("  [3] 运行所有示例");
            Console.WriteLine("      → 完整功能演示（需要约5分钟）");
            Console.WriteLine();
            Console.WriteLine("  [4] 自定义测试");
            Console.WriteLine("      → 交互式测试单个功能");
            Console.WriteLine();
            Console.WriteLine("  [5] 关于");
            Console.WriteLine("      → 项目信息与技术架构");
            Console.WriteLine();
            Console.WriteLine("  [0] 退出");
            Console.WriteLine();
            Console.Write("请输入选项 (0-5): ");
        }

        static async Task RunBasicExamplesAsync()
        {
            Console.Clear();
            ShowSectionHeader("基础功能演示");

            try
            {
                await MetaJadeNetworkExamples.RunAllExamplesAsync();
                ShowSuccess("基础功能演示完成！");
            }
            catch (Exception ex)
            {
                ShowError("基础功能演示失败", ex);
            }
        }

        static async Task RunAdvancedExamplesAsync()
        {
            Console.Clear();
            ShowSectionHeader("高级功能演示");

            try
            {
                await AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync();
                ShowSuccess("高级功能演示完成！");
            }
            catch (Exception ex)
            {
                ShowError("高级功能演示失败", ex);
            }
        }

        static async Task RunAllExamplesAsync()
        {
            Console.Clear();
            ShowSectionHeader("运行所有示例");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("??  注意：完整演示大约需要5分钟时间");
            Console.Write("确认继续？(Y/N): ");
            Console.ResetColor();

            var confirm = Console.ReadLine()?.Trim().ToUpper();
            if (confirm != "Y" && confirm != "YES")
            {
                ShowWarning("已取消");
                return;
            }

            Console.WriteLine();

            try
            {
                // Phase 1: 基础功能
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("╔═══════════════════════════════════════════════════════╗");
                Console.WriteLine("║           Phase 1: 基础功能演示      ║");
                Console.WriteLine("╚═══════════════════════════════════════════════════════╝");
                Console.ResetColor();
                Console.WriteLine();

                await MetaJadeNetworkExamples.RunAllExamplesAsync();

                Console.WriteLine("\n" + new string('═', 60) + "\n");

                // Phase 2: 高级功能
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("╔═══════════════════════════════════════════════════════╗");
                Console.WriteLine("║         Phase 2: 高级功能演示     ║");
                Console.WriteLine("╚═══════════════════════════════════════════════════════╝");
                Console.ResetColor();
                Console.WriteLine();

                await AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync();

                ShowSuccess("所有示例运行完毕！");
            }
            catch (Exception ex)
            {
                ShowError("运行示例时发生错误", ex);
            }
        }

        static async Task RunCustomTestAsync()
        {
            Console.Clear();
            ShowSectionHeader("自定义测试");

            Console.WriteLine("请选择要执行的测试:");
            Console.WriteLine(" [1] 测试区块创建");
            Console.WriteLine(" [2] 测试共识深度");
            Console.WriteLine(" [3] 测试六度路由");
            Console.WriteLine(" [4] 测试IPFS分块");
            Console.WriteLine(" [5] 测试版权合约");
            Console.WriteLine(" [6] 测试虚拟商品交易");
            Console.WriteLine(" [7] 性能压力测试");
            Console.WriteLine(" [8] 游戏市场模拟：创建账户/项目并随机购买\n");
            Console.WriteLine(" [0] 返回");
            Console.WriteLine();
            Console.Write("请选择 (0-8): ");

            var choice = Console.ReadLine()?.Trim();
            Console.WriteLine();

            try
            {
                switch (choice)
                {
                    case "1":
                        await TestBlockCreationAsync();
                        break;
                    case "2":
                        await TestConsensusDepthAsync();
                        break;
                    case "3":
                        await TestSixDegreeRoutingAsync();
                        break;
                    case "4":
                        TestIPFSChunking();
                        break;
                    case "5":
                        await TestCopyrightContractAsync();
                        break;
                    case "6":
                        await TestVirtualGoodsTradeAsync();
                        break;
                    case "7":
                        await TestPerformanceAsync();
                        break;
                    case "8":
                        await TestGameMarketSimulationAsync();
                        break;
                    case "0":
                        return;
                    default:
                        ShowWarning("无效的选项");
                        break;
                }
            }
            catch (Exception ex)
            {
                ShowError("测试失败", ex);
            }
        }

        /// <summary>
        /// 创建并存储买家、开发者、游戏项目，模拟随机购买并存储为区块
        /// </summary>
        static async Task TestGameMarketSimulationAsync()
        {
            ShowSubHeader("游戏市场模拟：创建账户、项目并随机购买");

            var rnd = new Random();
            var chain = new List<MetaJadeBlock>();
            var storageDir = Path.Combine(Directory.GetCurrentDirectory(), "ConsoleChain");
            Directory.CreateDirectory(storageDir);

            // Create buyers
            var buyers = new List<MetaJadeAccount>();
            for (int i = 1; i <= 10; i++)
            {
                var acc = new MetaJadeAccount
                {
                    UserID = $"buyer_{i}",
                    AccountID = Guid.NewGuid().ToString(),
                    AccountType = AccountType.Personal,
                    Balance = 10000m
                };

                buyers.Add(acc);
                var json = JsonSerializer.Serialize(acc);
                var bytes = Encoding.UTF8.GetBytes(json);
                var ctx = new TransactionContext { Amount = 0, Sensitivity = DataSensitivity.Normal, CurrentNetworkLoad = 0.1, TransactionType = "account_create", ParticipantTrustScore = 0.5 };
                var blk = MetaJadeBlock.CreateWithContext(bytes, ctx, relations: new[] { acc.AccountID });
                chain.Add(blk);
                File.WriteAllBytes(Path.Combine(storageDir, blk.CID + ".blk"), blk.ToBytes());
            }

            // Create developers
            var devs = new List<MetaJadeAccount>();
            for (int i = 1; i <= 3; i++)
            {
                var acc = new MetaJadeAccount
                {
                    UserID = $"dev_{i}",
                    AccountID = Guid.NewGuid().ToString(),
                    AccountType = AccountType.Merchant,
                    Balance = 50000m
                };
                devs.Add(acc);
                var json = JsonSerializer.Serialize(acc);
                var bytes = Encoding.UTF8.GetBytes(json);
                var ctx = new TransactionContext { Amount = 0, Sensitivity = DataSensitivity.Normal, CurrentNetworkLoad = 0.1, TransactionType = "dev_account_create", ParticipantTrustScore = 0.7 };
                var blk = MetaJadeBlock.CreateWithContext(bytes, ctx, relations: new[] { acc.AccountID });
                chain.Add(blk);
                File.WriteAllBytes(Path.Combine(storageDir, blk.CID + ".blk"), blk.ToBytes());
            }

            // Create games
            var games = new List<GameEconomyConfig>();
            for (int i = 1; i <= 8; i++)
            {
                var dev = devs[rnd.Next(devs.Count)];
                var game = new GameEconomyConfig
                {
                    GameID = $"game_{i}",
                    GameName = $"Awesome Game #{i}",
                    DeveloperID = dev.UserID,
                    XuanYuExchangeRate = 1.0m,
                    TransactionFeeRate = 0.05m
                };
                games.Add(game);
                var json = JsonSerializer.Serialize(game);
                var bytes = Encoding.UTF8.GetBytes(json);
                var ctx = new TransactionContext { Amount = 0, Sensitivity = DataSensitivity.Normal, CurrentNetworkLoad = 0.1, TransactionType = "game_create", ParticipantTrustScore = 0.8 };
                var blk = MetaJadeBlock.CreateWithContext(bytes, ctx, relations: new[] { game.GameID, game.DeveloperID });
                chain.Add(blk);
                File.WriteAllBytes(Path.Combine(storageDir, blk.CID + ".blk"), blk.ToBytes());
            }

            // Simulate random purchases
            var transactions = new List<Transaction>();
            for (int i = 0; i < 50; i++)
            {
                var buyer = buyers[rnd.Next(buyers.Count)];
                var game = games[rnd.Next(games.Count)];
                var price = Math.Round((decimal)(rnd.NextDouble() * 100 + 1), 2);

                var tx = new Transaction
                {
                    TransactionID = Guid.NewGuid().ToString(),
                    Type = TransactionType.Purchase,
                    Status = TransactionStatus.Completed,
                    FromUserID = buyer.UserID,
                    ToUserID = game.DeveloperID,
                    FromAccountID = buyer.AccountID,
                    ToAccountID = game.GameID, // store game id as recipient for demo
                    Amount = price,
                    Currency = CurrencyType.XuanYu,
                    CreatedAt = DateTimeOffset.UtcNow
                };

                transactions.Add(tx);

                var txJson = JsonSerializer.Serialize(tx);
                var txBytes = Encoding.UTF8.GetBytes(txJson);
                var ctx = new TransactionContext { Amount = tx.Amount, Sensitivity = DataSensitivity.Sensitive, CurrentNetworkLoad = rnd.NextDouble(), TransactionType = "game_purchase", ParticipantTrustScore = 0.6 + rnd.NextDouble() * 0.4 };
                var blk = MetaJadeBlock.CreateWithContext(txBytes, ctx, relations: new[] { tx.FromUserID, tx.ToUserID, tx.TransactionID });
                chain.Add(blk);
                File.WriteAllBytes(Path.Combine(storageDir, blk.CID + ".blk"), blk.ToBytes());
            }

            // Display summary and queries
            Console.WriteLine($"Stored {chain.Count} blocks to folder: {storageDir}");

            var totalVolume = transactions.Sum(t => t.Amount);
            Console.WriteLine($"Total purchases: {transactions.Count}, Total volume: {totalVolume:C}");

            // Revenue per game (we used ToAccountID=game.GameID)
            var revenueByGame = transactions.GroupBy(t => t.ToAccountID).ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));
            Console.WriteLine("\nRevenue by game:");
            foreach (var g in games)
            {
                revenueByGame.TryGetValue(g.GameID, out var rev);
                Console.WriteLine($" {g.GameName} ({g.GameID}) - Revenue: {rev:C}");
            }

            // Top buyers
            var topBuyers = transactions.GroupBy(t => t.FromUserID).Select(g => new { User = g.Key, Total = g.Sum(t => t.Amount), Count = g.Count() }).OrderByDescending(x => x.Total).Take(5);
            Console.WriteLine("\nTop buyers:");
            foreach (var b in topBuyers)
            {
                Console.WriteLine($" {b.User} - Count: {b.Count}, Total: {b.Total:C}");
            }

            // List first5 stored block CIDs
            Console.WriteLine("\nSample stored blocks:");
            foreach (var blk in chain.Take(5))
            {
                Console.WriteLine($" CID: {blk.CID} - {blk.GetBlockInfo()}");
            }

            await Task.CompletedTask;
        }

        static async Task TestBlockCreationAsync()
        {
            ShowSubHeader("区块创建与验证测试");

            Console.Write("请输入区块数据: ");
            var input = Console.ReadLine() ?? "测试数据";
            var data = Encoding.UTF8.GetBytes(input);

            // 创建普通区块
            var block1 = MetaJadeBlock.Create(data);
            Console.WriteLine($"\n? 普通区块已创建:");
            Console.WriteLine($" CID: {block1.CID}");
            Console.WriteLine($" 哈希: {block1.GetHashHex()[..32]}...");
            Console.WriteLine($" 大小: {block1.PayloadBytes.Length} bytes");

            // 创建带上下文的区块
            Console.WriteLine("\n创建高优先级交易区块...");
            var context = new TransactionContext
            {
                Amount = 10000m,
                Sensitivity = DataSensitivity.Sensitive,
                CurrentNetworkLoad = 0.6,
                TransactionType = "test"
            };

            var block2 = MetaJadeBlock.CreateWithContext(data, context);
            Console.WriteLine($"\n? 高级区块已创建:");
            Console.WriteLine(block2.GetBlockInfo());

            // 验证哈希
            var isValid = block2.VerifyHash();
            Console.WriteLine($"\n?? 哈希验证: {(isValid ? "? 通过" : "? 失败")}");

            // 序列化测试
            var serialized = block2.ToBytes();
            var deserialized = MetaJadeBlock.FromBytes(serialized);
            var cidMatch = deserialized.CID == block2.CID;
            Console.WriteLine($"?? 序列化测试: {(cidMatch ? "? 通过" : "? 失败")}");

            await Task.CompletedTask;
        }

        static async Task TestConsensusDepthAsync()
        {
            ShowSubHeader("共识深度计算测试");

            var manager = new DynamicConsensusDepthManager();

            // 测试不同场景
            var scenarios = new[]
            {
 ("小额交易", 50m, DataSensitivity.Normal, "payment"),
 ("中等交易", 1000m, DataSensitivity.Normal, "virtual_goods"),
 ("高价值交易", 15000m, DataSensitivity.Sensitive, "rare_item"),
 ("版权确权", 0m, DataSensitivity.Critical, "copyright"),
 ("账户转移", 5000m, DataSensitivity.Critical, "account_transfer")
 };

            Console.WriteLine("场景测试:");
            Console.WriteLine(new string('-', 80));
            Console.WriteLine($"{"场景",-15} {"金额",-12} {"敏感度",-12} {"类型",-20} {"优先级",-10} {"深度",-6}");
            Console.WriteLine(new string('-', 80));

            foreach (var (name, amount, sensitivity, type) in scenarios)
            {
                var context = new TransactionContext
                {
                    Amount = amount,
                    Sensitivity = sensitivity,
                    CurrentNetworkLoad = 0.5,
                    TransactionType = type,
                    ParticipantTrustScore = 0.8
                };

                var depth = manager.CalculateOptimalDepth(context);

                Console.WriteLine($"{name,-15} {amount,-12:C} {sensitivity,-12} {type,-20} {context.Priority,-10} {depth,-6}");
            }

            Console.WriteLine(new string('-', 80));
            await Task.CompletedTask;
        }

        static async Task TestSixDegreeRoutingAsync()
        {
            ShowSubHeader("六度原理路由测试");

            var router = new SixDegreeRouter();

            Console.Write("输入起始节点CID (留空使用默认): ");
            var from = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(from))
                from = "bafk1111node0001";

            Console.Write("输入目标节点CID (留空使用默认): ");
            var to = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(to))
                to = "bafk9999node9999";

            Console.WriteLine($"\n?? 正在查找从 {from[..16]}... 到 {to[..16]}... 的路径...\n");

            var path = await router.FindShortestPathAsync(from, to);

            if (path != null)
            {
                Console.WriteLine("? 找到路径:");
                Console.WriteLine($" 跳数: {path.Hops}");
                Console.WriteLine($" 信任评分: {path.TotalTrustScore:F2}");
                Console.WriteLine($" 预估延迟: {path.AverageLatency}ms");
                Console.WriteLine($"\n 路径:");
                for (int i = 0; i < path.NodeCIDs.Count; i++)
                {
                    var prefix = i == 0 ? "起点" : i == path.NodeCIDs.Count - 1 ? "终点" : $"跳{i}";
                    Console.WriteLine($" [{prefix}] {path.NodeCIDs[i][..16]}...");
                }
            }
            else
            {
                Console.WriteLine("? 未找到路径（超过6度）");
            }

            Console.WriteLine("\n正在优化网络拓扑...");
            await router.OptimizeNodeTopologyAsync();
            Console.WriteLine("? 拓扑优化完成");
        }

        static void TestIPFSChunking()
        {
            ShowSubHeader("IPFS分块策略测试");

            var chunking = new AdaptiveChunkingStrategy();

            var fileSizes = new[]
            {
 ("小文件", 500L * 1024),
 ("中等文件", 5L * 1024 * 1024),
 ("大文件", 150L * 1024 * 1024),
 ("超大文件", 2L * 1024 * 1024 * 1024)
 };

            Console.WriteLine("文件大小分块策略:");
            Console.WriteLine(new string('-', 70));
            Console.WriteLine($"{"类型",-12} {"文件大小",-20} {"分块大小",-15} {"分块数量",-10}");
            Console.WriteLine(new string('-', 70));

            foreach (var (name, size) in fileSizes)
            {
                var chunkSize = chunking.CalculateOptimalChunkSize(size);
                var chunkCount = chunking.CalculateChunkCount(size);
                var sizeStr = FormatBytes(size);
                var chunkSizeStr = FormatBytes(chunkSize);

                Console.WriteLine($"{name,-12} {sizeStr,-20} {chunkSizeStr,-15} {chunkCount,-10}");
            }

            Console.WriteLine(new string('-', 70));
        }

        static async Task TestCopyrightContractAsync()
        {
            ShowSubHeader("版权合约测试");

            Console.Write("输入作品名称: ");
            var title = Console.ReadLine() ?? "测试作品";

            var copyright = new CopyrightInfo
            {
                Title = title,
                ContentType = "Game",
                AuthorCid = "bafk1111author0000",
                ContentCid = "bafk2222content0000",
                ContentHash = System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(title))
            };

            var contract = CopyrightContract.Create(copyright, copyright.AuthorCid);
            Console.WriteLine($"\n? 版权合约已创建: {contract.ContractId[..32]}...");

            var manager = new SmartContractManager();
            var context = new TransactionContext
            {
                Sensitivity = DataSensitivity.Critical,
                TransactionType = "copyright"
            };

            var contractId = await manager.DeployContractAsync(contract, context);
            Console.WriteLine($"? 合约已部署上链");

            await contract.ActivateAsync();
            Console.WriteLine($"? 合约已激活");

            Console.WriteLine($"\n?? {contract.GetSummary()}");
        }

        static async Task TestVirtualGoodsTradeAsync()
        {
            ShowSubHeader("虚拟商品交易测试");

            Console.Write("输入商品名称: ");
            var itemName = Console.ReadLine() ?? "测试道具";

            Console.Write("输入商品价格: ");
            var priceStr = Console.ReadLine();
            decimal price = decimal.TryParse(priceStr, out var p) ? p : 100m;

            var goods = new VirtualGoodsInfo
            {
                ItemName = itemName,
                ItemType = "Weapon",
                Rarity = "Rare",
                Level = 50
            };

            var contract = VirtualGoodsTradeContract.Create(
            goods,
            "bafk1111seller0000",
            "bafk2222buyer0000",
            price);

            Console.WriteLine($"\n? 交易合约已创建");

            var manager = new SmartContractManager();
            var context = new TransactionContext
            {
                Amount = price,
                Sensitivity = DataSensitivity.Sensitive,
                TransactionType = "virtual_goods"
            };

            await manager.DeployContractAsync(contract, context);
            await contract.ActivateAsync();

            Console.WriteLine($"? 合约已激活");
            Console.WriteLine($"\n?? {contract.GetSummary()}");
        }

        static async Task TestPerformanceAsync()
        {
            ShowSubHeader("性能压力测试");

            Console.Write("输入测试交易数量 (默认1000): ");
            var countStr = Console.ReadLine();
            int count = int.TryParse(countStr, out var c) ? c : 1000;

            var monitor = new PerformanceMonitor();
            var random = new Random();

            Console.WriteLine($"\n?? 开始测试 {count} 笔交易...\n");

            var startTime = DateTime.UtcNow;

            for (int i = 0; i < count; i++)
            {
                var context = new TransactionContext
                {
                    Amount = random.Next(10, 50000),
                    Sensitivity = (DataSensitivity)random.Next(0, 4),
                    CurrentNetworkLoad = random.NextDouble(),
                    TransactionType = "test"
                };

                var data = Encoding.UTF8.GetBytes($"Test {i}");
                var block = MetaJadeBlock.CreateWithContext(data, context);

                var confirmTime = random.Next(10, 200);
                await Task.Delay(1); // 模拟少量延迟

                var success = random.NextDouble() > 0.05;
                monitor.RecordTransaction(block, confirmTime, success);

                if ((i + 1) % (count / 10) == 0)
                {
                    var progress = (i + 1) * 100 / count;
                    Console.Write($"\r进度: {progress}% ({i + 1}/{count})");
                }
            }

            var endTime = DateTime.UtcNow;
            var duration = (endTime - startTime).TotalSeconds;

            Console.WriteLine($"\n\n? 测试完成！耗时: {duration:F2} 秒\n");
            Console.WriteLine(monitor.GenerateReport());
        }

        static void ShowAboutInfo()
        {
            Console.Clear();
            ShowSectionHeader("关于玄玉区块网络");

            Console.WriteLine("项目名称: 玄玉区块网络 (MetaJade Network)");
            Console.WriteLine("版本: 2.0");
            Console.WriteLine("目标框架: .NET 9.0");
            Console.WriteLine();
            Console.WriteLine("技术架构:");
            Console.WriteLine("  ? 区块链技术 - 去中心化、不可篡改");
            Console.WriteLine("  ? 六度原理 - O(logn)网络路由优化");
            Console.WriteLine("  ? IPFS - 分布式存储与内容寻址");
            Console.WriteLine("  ? 动态共识深度 - 自适应安全与效率平衡");
            Console.WriteLine("  ? 智能合约 - 自动化执行与托管");
            Console.WriteLine("  ? 性能监控 - 实时统计与健康检测");
            Console.WriteLine();
            Console.WriteLine("核心创新:");
            Console.WriteLine("  ? 动态互信共识深度调整机制");
            Console.WriteLine("  ? 时空复杂度从O(n?)降至O(logn)");
            Console.WriteLine("  ? 托管交易自动收益分配");
            Console.WriteLine("  ? 完整的版权保护体系");
            Console.WriteLine();
            Console.WriteLine("应用场景:");
            Console.WriteLine("  ?? 游戏发行与版权保护");
            Console.WriteLine("  ?? 虚拟商品交易市场");
            Console.WriteLine("  ?? 数字内容版权管理");
            Console.WriteLine("  ?? 自媒体社交网络");
            Console.WriteLine();
            Console.WriteLine("项目信息:");
            Console.WriteLine("  开发语言: C# 13.0");
            Console.WriteLine("  目标平台: Windows, macOS, Android, iOS");
            Console.WriteLine("  许可证: 开源");
        }

        // 辅助方法
        static void ShowSectionHeader(string title)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("╔" + new string('═', 58) + "╗");
            Console.WriteLine($"║  {title.PadRight(54)}  ║");
            Console.WriteLine("╚" + new string('═', 58) + "╝");
            Console.ResetColor();
            Console.WriteLine();
        }

        static void ShowSubHeader(string title)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"\n? {title}");
            Console.WriteLine(new string('─', 60));
            Console.ResetColor();
            Console.WriteLine();
        }

        static void ShowSuccess(string message)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"\n? {message}");
            Console.ResetColor();
        }

        static void ShowWarning(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"\n??  {message}");
            Console.ResetColor();
        }

        static void ShowError(string message, Exception? ex = null)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"\n? {message}");
            if (ex != null)
            {
                Console.WriteLine($" 详情: {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($" 内部错误: {ex.InnerException.Message}");
            }
            Console.ResetColor();
        }

        static string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:F2} {sizes[order]}";
        }
    }
}
