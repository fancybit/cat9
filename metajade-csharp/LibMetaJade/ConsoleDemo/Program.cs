using System;
using System.Threading.Tasks;
using LibMetaJade.Examples;

namespace LibMetaJade.ConsoleDemo
{
    /// <summary>
    /// 玄玉区块网络控制台演示程序
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            try
            {
                // 设置控制台编码以支持中文
                Console.OutputEncoding = System.Text.Encoding.UTF8;

                Console.WriteLine("╔══════════════════════════════════════════════════════════╗");
                Console.WriteLine("║        玄玉区块网络 (MetaJade Network)       ║");
                Console.WriteLine("║           完整功能演示程序      ║");
                Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

                Console.WriteLine("请选择演示内容:");
                Console.WriteLine("1. 基础功能演示（共识深度、六度路由、IPFS分块）");
                Console.WriteLine("2. 高级功能演示（智能合约、性能监控）");
                Console.WriteLine("3. 运行所有示例");
                Console.WriteLine("0. 退出");
                Console.Write("\n请输入选项 (0-3): ");

                var choice = Console.ReadLine();

                Console.WriteLine();

                switch (choice)
                {
                    case "1":
                        await MetaJadeNetworkExamples.RunAllExamplesAsync();
                        break;
                    case "2":
                        await AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync();
                        break;
                    case "3":
                        Console.WriteLine("=== 第一部分：基础功能 ===\n");
                        await MetaJadeNetworkExamples.RunAllExamplesAsync();
                        Console.WriteLine("\n\n" + new string('═', 60));
                        Console.WriteLine("=== 第二部分：高级功能 ===\n");
                        await AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync();
                        break;
                    case "0":
                        Console.WriteLine("感谢使用！再见！");
                        return;
                    default:
                        Console.WriteLine("无效的选项，请重新运行程序");
                        break;
                }

                Console.WriteLine("\n按任意键退出...");
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"\n发生错误: {ex.Message}");
                Console.WriteLine($"堆栈跟踪: {ex.StackTrace}");
                Console.ResetColor();
                Console.ReadKey();
            }
        }
    }
}
