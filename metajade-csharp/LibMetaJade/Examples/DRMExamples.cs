using System;
using System.Threading.Tasks;
using LibMetaJade.DRM;

namespace LibMetaJade.Examples
{
    /// <summary>
    /// DRM 游戏保护系统示例
    /// </summary>
    public static class DRMExamples
  {
        /// <summary>
        /// 运行所有示例
        /// </summary>
      public static async Task RunAllExamplesAsync()
 {
            Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
   Console.WriteLine("║   JadeClient 游戏DRM保护系统示例（类似Steam）║");
        Console.WriteLine("╚════════════════════════════════════════════════════════════════╝\n");

 await Example1_BasicDRMAsync();
        Console.WriteLine("\n" + new string('=', 70) + "\n");

            await Example2_GameLauncherAsync();
  Console.WriteLine("\n" + new string('=', 70) + "\n");

            await Example3_OfflineModeAsync();
            Console.WriteLine("\n" + new string('=', 70) + "\n");

       await Example4_DeviceAuthorizationAsync();
            Console.WriteLine("\n" + new string('=', 70) + "\n");

   await Example5_AntiCheatAsync();
        }

     /// <summary>
     /// 示例1：基础DRM验证
        /// </summary>
        private static async Task Example1_BasicDRMAsync()
        {
        Console.WriteLine("=== 示例1：基础DRM验证（客户端必须运行）===\n");

            var drmService = new DRMService();
            var userID = "player_001";
       var gameID = "rpg_adventure_001";

// 1. 购买游戏
     Console.WriteLine("【购买游戏】");
            var license = await drmService.PurchaseGameAsync(
         userID,
  gameID,
    "RPG冒险游戏",
    OwnershipType.Purchased
    );

      Console.WriteLine($"  ? 购买成功");
            Console.WriteLine($"    许可证ID: {license.LicenseID}");
  Console.WriteLine($"    游戏: {license.GameName}");
            Console.WriteLine($"    所有权: {license.OwnershipType}");

   // 2. 注册客户端（模拟JadeClient启动）
            Console.WriteLine($"\n【启动 JadeClient 客户端】");
 await drmService.RegisterClientAsync(userID, "1.0.0");
          var clientStatus = drmService.GetClientStatus(userID);
            Console.WriteLine($"  ? 客户端已启动");
    Console.WriteLine($"    版本: {clientStatus?.Version}");
       Console.WriteLine($"    进程ID: {clientStatus?.ProcessID}");

            // 3. 尝试启动游戏（客户端运行）
            Console.WriteLine($"\n【验证游戏启动】客户端运行中");
            var verificationRequest = new DRMVerificationRequest
            {
        UserID = userID,
    GameID = gameID,
       DeviceID = "device_001",
      ClientRunning = true,
    ClientVersion = "1.0.0",
 ClientProcessID = "12345"
  };

   var response = await drmService.VerifyGameLaunchAsync(verificationRequest);

            Console.WriteLine($"  验证结果: {response.Status}");
         Console.WriteLine($"  是否允许: {response.Allowed}");
    Console.WriteLine($"  消息: {response.Message}");

   if (response.Allowed)
            {
     Console.WriteLine($"  ? 游戏启动成功");
           Console.WriteLine($"    会话Token: {response.SessionToken}");
                Console.WriteLine($"    解密密钥: {response.DecryptionKey}");
    }

            // 4. 尝试启动游戏（客户端未运行）
      Console.WriteLine($"\n【验证游戏启动】客户端未运行");
            await drmService.UnregisterClientAsync(userID);

  verificationRequest.ClientRunning = false;
 var failedResponse = await drmService.VerifyGameLaunchAsync(verificationRequest);

         Console.WriteLine($"  验证结果: {failedResponse.Status}");
            Console.WriteLine($"是否允许: {failedResponse.Allowed}");
            Console.WriteLine($"  ? {failedResponse.Message}");

   Console.WriteLine($"\n  ?? 核心机制:");
   Console.WriteLine($"    ? 游戏启动前必须验证客户端是否运行");
            Console.WriteLine($"    ? 客户端关闭会自动终止所有游戏会话");
         Console.WriteLine($"    ? 类似Steam，必须通过客户端启动游戏");
        }

        /// <summary>
        /// 示例2：游戏启动器服务
   /// </summary>
        private static async Task Example2_GameLauncherAsync()
        {
      Console.WriteLine("=== 示例2：游戏启动器（完整流程）===\n");

       var drmService = new DRMService();
            var launcherService = new GameLauncherService(drmService);
            var userID = "player_002";
   var gameID = "fps_shooter_001";

            // 1. 购买游戏
         await drmService.PurchaseGameAsync(userID, gameID, "FPS射击游戏", OwnershipType.Purchased);

            // 2. 客户端初始化
       Console.WriteLine("【JadeClient 启动】");
            await launcherService.InitializeAsync(userID, "1.0.0");
            Console.WriteLine($"  ? 客户端初始化完成");

      // 3. 启动游戏
            Console.WriteLine($"\n【启动游戏】");
    var (success, message, process) = await launcherService.LaunchGameAsync(
     gameID,
           "FPS射击游戏",
       null // 实际环境需要提供游戏可执行文件路径
 );

      Console.WriteLine($"  启动结果: {(success ? "成功" : "失败")}");
      Console.WriteLine($"  消息: {message}");

       if (success)
          {
          Console.WriteLine($"  ? 游戏已启动");
Console.WriteLine($"    游戏ID: {gameID}");

       // 4. 查询运行中的游戏
     Console.WriteLine($"\n【运行中的游戏】");
                var runningGames = await launcherService.GetRunningGamesAsync();
       Console.WriteLine($"  运行中: {runningGames.Count} 个游戏");
     foreach (var game in runningGames)
        {
    Console.WriteLine($"    ? {game}");
         }

  // 5. 模拟心跳（游戏运行中）
    Console.WriteLine($"\n【心跳监控】");
           for (int i = 0; i < 3; i++)
                {
          await Task.Delay(1000);
        Console.WriteLine($"  ? 心跳 #{i + 1} - 客户端运行中，游戏正常");
  }

             // 6. 停止游戏
      Console.WriteLine($"\n【停止游戏】");
        await launcherService.StopGameAsync(gameID);
 Console.WriteLine($"  ? 游戏已停止");
  }

   // 7. 客户端关闭
      Console.WriteLine($"\n【关闭 JadeClient】");
        await launcherService.ShutdownAsync();
            Console.WriteLine($"  ? 客户端已关闭，所有游戏会话终止");
   }

        /// <summary>
    /// 示例3：离线模式
        /// </summary>
 private static async Task Example3_OfflineModeAsync()
      {
 Console.WriteLine("=== 示例3：离线模式（宽限期验证）===\n");

            var drmService = new DRMService();
            var userID = "player_003";
            var gameID = "strategy_game_001";

        // 1. 购买游戏
         var license = await drmService.PurchaseGameAsync(
       userID,
        gameID,
      "策略游戏",
                OwnershipType.Purchased
   );

            Console.WriteLine("【游戏许可证】");
     Console.WriteLine($"  DRM模式: {license.DRMMode}");
          Console.WriteLine($"离线宽限期: {license.OfflineGracePeriodHours} 小时");

 // 2. 在线验证
            await drmService.RegisterClientAsync(userID, "1.0.0");
            Console.WriteLine($"\n【在线验证】");

       var onlineRequest = new DRMVerificationRequest
  {
         UserID = userID,
   GameID = gameID,
       DeviceID = "device_001",
    ClientRunning = true,
IsOffline = false
         };

            var onlineResponse = await drmService.VerifyGameLaunchAsync(onlineRequest);
     Console.WriteLine($"  ? 在线验证通过");
      Console.WriteLine($"    最后验证: {license.LastVerified:yyyy-MM-dd HH:mm:ss}");

   // 3. 离线验证（在宽限期内）
   Console.WriteLine($"\n【离线验证】宽限期内");

            var offlineRequest = new DRMVerificationRequest
    {
UserID = userID,
       GameID = gameID,
       DeviceID = "device_001",
    ClientRunning = true,
                IsOffline = true
            };

            var offlineResponse = await drmService.VerifyGameLaunchAsync(offlineRequest);
         Console.WriteLine($"  ? 离线验证通过");
 Console.WriteLine($"    宽限期剩余: {license.OfflineGracePeriodHours} 小时");

     // 4. 模拟宽限期过期
            Console.WriteLine($"\n【离线验证】宽限期已过");
          license.LastVerified = DateTimeOffset.UtcNow.AddHours(-73); // 超过72小时

        var expiredResponse = await drmService.VerifyGameLaunchAsync(offlineRequest);
 Console.WriteLine($"  验证结果: {expiredResponse.Status}");
       Console.WriteLine($"  ? {expiredResponse.Message}");

     Console.WriteLine($"\n  ?? 离线模式:");
   Console.WriteLine($"    ? 在线时自动验证并更新时间戳");
    Console.WriteLine($"    ? 离线时检查宽限期（默认72小时）");
            Console.WriteLine($"    ? 超过宽限期需要联网重新验证");
        }

        /// <summary>
  /// 示例4：设备授权管理
        /// </summary>
    private static async Task Example4_DeviceAuthorizationAsync()
    {
 Console.WriteLine("=== 示例4：设备授权（最多5台设备）===\n");

            var drmService = new DRMService();
  var userID = "player_004";
    var gameID = "racing_game_001";

        // 1. 购买游戏
 var license = await drmService.PurchaseGameAsync(
         userID,
        gameID,
"竞速游戏",
    OwnershipType.Purchased
            );

    Console.WriteLine("【设备授权限制】");
            Console.WriteLine($"  最大设备数: {license.MaxDevices}");
      Console.WriteLine($"  当前设备数: {license.AuthorizedDevices.Count}");

            await drmService.RegisterClientAsync(userID, "1.0.0");

    // 2. 授权多个设备
 Console.WriteLine($"\n【授权设备】");
        for (int i = 1; i <= 6; i++)
          {
           var deviceID = $"device_{i:D3}";

    var request = new DRMVerificationRequest
    {
               UserID = userID,
    GameID = gameID,
        DeviceID = deviceID,
        ClientRunning = true
   };

     var response = await drmService.VerifyGameLaunchAsync(request);

       Console.WriteLine($"  设备 {i}: {deviceID}");
  Console.WriteLine($"    验证结果: {(response.Allowed ? "? 通过" : "? 拒绝")}");

             if (!response.Allowed)
             {
 Console.WriteLine($"    原因: {response.Message}");
         }
            }

            Console.WriteLine($"\n  已授权设备列表:");
 foreach (var device in license.AuthorizedDevices)
          {
         Console.WriteLine($"    ? {device}");
      }

            Console.WriteLine($"\n  ?? 设备管理:");
       Console.WriteLine($"    ? 最多授权5台设备");
 Console.WriteLine($"    ? 超出限制需要在设置中移除旧设备");
          Console.WriteLine($"    ? 类似Steam的家庭共享设备限制");
        }

      /// <summary>
        /// 示例5：反作弊监控
        /// </summary>
        private static async Task Example5_AntiCheatAsync()
  {
    Console.WriteLine("=== 示例5：反作弊监控 ===\n");

   var antiCheatService = new AntiCheatService();
            var userID = "player_005";
            var gameID = "moba_game_001";
   var sessionID = "session_12345";

     Console.WriteLine("【反作弊扫描】");
            Console.WriteLine($"  用户: {userID}");
            Console.WriteLine($"  游戏: {gameID}");

   // 扫描可疑进程
       var detections = await antiCheatService.ScanProcessesAsync(userID, gameID, sessionID);

            Console.WriteLine($"\n  扫描结果: {detections.Count} 个检测");

      if (detections.Count > 0)
    {
      Console.WriteLine($"\n  ? 检测到可疑活动:");
             foreach (var detection in detections)
    {
               Console.WriteLine($"    类型: {detection.DetectionType}");
           Console.WriteLine($"    描述: {detection.Description}");
         Console.WriteLine($"    严重程度: {detection.SeverityLevel}/10");
  Console.WriteLine($"    处理: {detection.Action}");
        Console.WriteLine();
          }
      }
            else
            {
Console.WriteLine($"  ? 未检测到可疑活动");
     }

            Console.WriteLine($"  ?? 反作弊功能:");
   Console.WriteLine($" ? 扫描常见作弊工具进程");
        Console.WriteLine($"    ? 内存完整性检查");
            Console.WriteLine($"    ? 文件修改检测");
         Console.WriteLine($"    ? 网络流量监控");
        }
    }
}
