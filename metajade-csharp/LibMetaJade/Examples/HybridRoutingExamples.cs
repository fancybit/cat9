using System;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Network;

namespace LibMetaJade.Examples
{
    /// <summary>
    /// 混合路由示例 - 演示P2P物理路由和SNS社交路由的混合使用
    /// </summary>
    public static class HybridRoutingExamples
    {
  /// <summary>
      /// 运行所有混合路由示例
        /// </summary>
        public static async Task RunAllExamplesAsync()
        {
  Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
   Console.WriteLine("║     玄玉区块网络 - 混合路由示例         ║");
     Console.WriteLine("╚════════════════════════════════════════════════════════════════╝\n");

  await Example1_BasicHybridRoutingAsync();
      Console.WriteLine("\n" + new string('=', 70) + "\n");
  
            await Example2_SocialTrustCalculationAsync();
     Console.WriteLine("\n" + new string('=', 70) + "\n");
 
            await Example3_AdaptiveRoutingAsync();
         Console.WriteLine("\n" + new string('=', 70) + "\n");
          
      await Example4_PathComparisonAsync();
       }

        /// <summary>
 /// 示例1：基础混合路由
        /// </summary>
        private static async Task Example1_BasicHybridRoutingAsync()
{
     Console.WriteLine("=== 示例1：基础混合路由 ===\n");

     var router = new DualLayerRouter();

 // 场景1：仅物理路由（最快）
       Console.WriteLine("【场景1：快速数据传输 - 仅物理路由】");
         var physicalResult = await router.FindHybridPathAsync(
      "bafk1111node0001",
     "bafk9999node9999",
       RoutingStrategy.PhysicalOnly
 );

     if (physicalResult != null)
     {
      Console.WriteLine($"  路径类型: {physicalResult.UsedStrategy}");
  Console.WriteLine($"  跳数: {physicalResult.TotalHops}");
    Console.WriteLine($"  信任度: {physicalResult.TotalTrust:F2}");
    Console.WriteLine($"  预估延迟: {physicalResult.EstimatedLatency:F0}ms");
    Console.WriteLine($"  描述: {physicalResult.PathDescription}");
          }

          Console.WriteLine();

      // 场景2：仅社交路由（最可信）
       Console.WriteLine("【场景2：版权确权 - 仅社交路由】");
     var socialResult = await router.FindHybridPathAsync(
    "user_00123",
      "user_09876",
   RoutingStrategy.SocialOnly
   );

            if (socialResult != null)
       {
       Console.WriteLine($"  路径类型: {socialResult.UsedStrategy}");
    Console.WriteLine($"  社交度数: {socialResult.TotalHops}");
          Console.WriteLine($"  信任度: {socialResult.TotalTrust:F2}");
       Console.WriteLine($"  描述: {socialResult.PathDescription}");
   }

   Console.WriteLine();

  // 场景3：混合平衡路由
         Console.WriteLine("【场景3：虚拟商品交易 - 混合平衡路由】");
    var balancedResult = await router.FindHybridPathAsync(
       "bafk2222node0002",
    "bafk8888node8888",
    RoutingStrategy.HybridBalanced,
     requireTrust: true
   );

            if (balancedResult != null)
        {
       Console.WriteLine($"  路径类型: {balancedResult.UsedStrategy}");
    Console.WriteLine($"  跳数: {balancedResult.TotalHops}");
    Console.WriteLine($"  信任度: {balancedResult.TotalTrust:F2}");
             Console.WriteLine($"  描述: {balancedResult.PathDescription}");
                Console.WriteLine($"  是否可信: {(balancedResult.IsTrusted ? "?" : "?")}");
      Console.WriteLine($"  是否快速: {(balancedResult.IsFast ? "?" : "?")}");
       }
 }

        /// <summary>
        /// 示例2：社交信任度计算
   /// </summary>
        private static async Task Example2_SocialTrustCalculationAsync()
 {
     Console.WriteLine("=== 示例2：社交信任度计算 ===\n");

       var calculator = new SocialTrustCalculator();

      // 创建测试用户
 var user1 = new SocialUserInfo
      {
       UserID = "user_00001",
     Username = "资深用户Alice",
         CreatedAt = DateTimeOffset.UtcNow.AddDays(-500),  // 账号已存在500天
  LastActiveAt = DateTimeOffset.UtcNow.AddHours(-2),
      FriendsCount = 150,
     FollowersCount = 500,
FollowingCount = 200,
   ReputationPoints = 5000,
       PostsCount = 300,
            LikesReceived = 15000,
  SharesReceived = 3000,
           IsVerified = true,
       IsInfluencer = false
            };

     var user2 = new SocialUserInfo
       {
       UserID = "user_00002",
        Username = "新手用户Bob",
      CreatedAt = DateTimeOffset.UtcNow.AddDays(-15),  // 新注册15天
       LastActiveAt = DateTimeOffset.UtcNow.AddDays(-5),
 FriendsCount = 8,
       FollowersCount = 10,
           FollowingCount = 20,
   ReputationPoints = 200,
     PostsCount = 10,
    LikesReceived = 50,
       SharesReceived = 5,
                IsVerified = false,
       IsInfluencer = false
    };

       var user3 = new SocialUserInfo
            {
       UserID = "user_00003",
         Username = "影响力用户Carol",
        CreatedAt = DateTimeOffset.UtcNow.AddDays(-800),
LastActiveAt = DateTimeOffset.UtcNow.AddMinutes(-30),
     FriendsCount = 800,
  FollowersCount = 50000,
       FollowingCount = 300,
     ReputationPoints = 15000,
    PostsCount = 1200,
       LikesReceived = 500000,
     SharesReceived = 100000,
     IsVerified = true,
  IsInfluencer = true
      };

       // 计算信任度
      var trust1 = calculator.CalculateComprehensiveTrust(user1);
       var trust2 = calculator.CalculateComprehensiveTrust(user2);
var trust3 = calculator.CalculateComprehensiveTrust(user3);

 Console.WriteLine($"【{user1.Username}】");
      Console.WriteLine($"  综合信任度: {trust1:F2} - {calculator.EvaluatePathTrustLevel(trust1)}");
Console.WriteLine($"  账号年龄: {(DateTimeOffset.UtcNow - user1.CreatedAt).TotalDays:F0} 天");
   Console.WriteLine($"  声望值: {user1.ReputationPoints}");
   Console.WriteLine($"  好友数: {user1.FriendsCount}");
  Console.WriteLine($"  认证状态: {(user1.IsVerified ? "? 已认证" : "? 未认证")}");

            Console.WriteLine();

        Console.WriteLine($"【{user2.Username}】");
 Console.WriteLine($"  综合信任度: {trust2:F2} - {calculator.EvaluatePathTrustLevel(trust2)}");
  Console.WriteLine($"  账号年龄: {(DateTimeOffset.UtcNow - user2.CreatedAt).TotalDays:F0} 天");
     Console.WriteLine($"  声望值: {user2.ReputationPoints}");
    Console.WriteLine($"  好友数: {user2.FriendsCount}");
          Console.WriteLine($"  认证状态: {(user2.IsVerified ? "? 已认证" : "? 未认证")}");
      Console.WriteLine($"  信任增强建议:");
   var recommendations = calculator.RecommendTrustEnhancement(user2);
 foreach (var rec in recommendations)
  {
Console.WriteLine($"    ? {rec}");
        }

         Console.WriteLine();

            Console.WriteLine($"【{user3.Username}】");
         Console.WriteLine($"  综合信任度: {trust3:F2} - {calculator.EvaluatePathTrustLevel(trust3)}");
  Console.WriteLine($"  账号年龄: {(DateTimeOffset.UtcNow - user3.CreatedAt).TotalDays:F0} 天");
Console.WriteLine($"  声望值: {user3.ReputationPoints}");
      Console.WriteLine($"  粉丝数: {user3.FollowersCount}");
     Console.WriteLine($"  影响力用户: {(user3.IsInfluencer ? "?" : "?")}");

     await Task.CompletedTask;
}

        /// <summary>
        /// 示例3：自适应路由策略
 /// </summary>
        private static async Task Example3_AdaptiveRoutingAsync()
{
     Console.WriteLine("=== 示例3：自适应路由策略 ===\n");

  var router = new DualLayerRouter();

      // 场景1：区块同步（需要快速传输）
       Console.WriteLine("【场景1：区块同步 - 自适应选择物理路径】");
     var syncResult = await router.FindHybridPathAsync(
           "bafk3333node0003",
"bafk7777node7777",
    RoutingStrategy.AdaptiveOptimal,
       requireTrust: false  // 不要求高信任
   );

 if (syncResult != null)
    {
       Console.WriteLine($"  自动选择: {syncResult.UsedStrategy}");
     Console.WriteLine($"  原因: 快速数据传输，优先物理路径");
       Console.WriteLine($"  延迟: {syncResult.EstimatedLatency:F0}ms");
       Console.WriteLine($"  跳数: {syncResult.TotalHops}");
            }

       Console.WriteLine();

// 场景2：版权转让（需要高信任）
  Console.WriteLine("【场景2：版权转让 - 自适应选择社交路径】");
   var copyrightResult = await router.FindHybridPathAsync(
    "user_00500",
    "user_05000",
    RoutingStrategy.AdaptiveOptimal,
       requireTrust: true  // 要求高信任
      );

     if (copyrightResult != null)
{
       Console.WriteLine($"  自动选择: {copyrightResult.UsedStrategy}");
 Console.WriteLine($"  原因: 高安全需求，优先社交路径");
     Console.WriteLine($"  信任度: {copyrightResult.TotalTrust:F2}");
 Console.WriteLine($"  社交度数: {copyrightResult.TotalHops}");
     }
 }

   /// <summary>
        /// 示例4：路径对比分析
   /// </summary>
     private static async Task Example4_PathComparisonAsync()
        {
        Console.WriteLine("=== 示例4：路径对比分析 ===\n");

       var router = new DualLayerRouter();

       // 获取路径统计
       var stats = await router.GetPathStatisticsAsync("bafk4444node0004", "bafk6666node6666");

 Console.WriteLine("【路径统计对比】");
   Console.WriteLine($"  物理路径:");
  Console.WriteLine($"    跳数: {stats["physical_hops"]}");
  Console.WriteLine($"    信任度: {stats["physical_trust"]:F2}");
 Console.WriteLine($"  延迟: {stats["physical_latency"]:F0}ms");
 
     Console.WriteLine($"\n  社交路径:");
  Console.WriteLine($"    度数: {stats["social_degrees"]}");
   Console.WriteLine($"    信任度: {stats["social_trust"]:F2}");
        Console.WriteLine($"    含影响力用户: {((bool)stats["social_has_influencer"] ? "?" : "?")}");
     Console.WriteLine($"    全部认证用户: {((bool)stats["social_all_verified"] ? "?" : "?")}");

      Console.WriteLine($"\n  路径可用性: {((bool)stats["both_available"] ? "? 双路径可用" : "? 仅单路径可用")}");

   Console.WriteLine("\n【推荐策略】");
    if ((bool)stats["both_available"])
   {
        double physicalTrust = Convert.ToDouble(stats["physical_trust"]);
  double socialTrust = Convert.ToDouble(stats["social_trust"]);
     double physicalLatency = Convert.ToDouble(stats["physical_latency"]);

          if (physicalTrust > 0.7 && physicalLatency < 200)
     {
    Console.WriteLine("  ? 推荐使用物理路径（高信任 + 低延迟）");
     }
        else if (socialTrust > 0.8)
       {
      Console.WriteLine("  ? 推荐使用社交路径（极高信任度）");
      }
  else
    {
         Console.WriteLine("  ? 推荐使用混合平衡路径（综合权衡）");
     }
   }
        }
    }
}
