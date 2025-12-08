using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LibMetaJade.DRM
{
    /// <summary>
    /// JadeClient 游戏启动器服务
  /// </summary>
    public class GameLauncherService
    {
        private readonly DRMService _drmService;
        private readonly Dictionary<string, Process> _runningGames = new();
        private readonly Dictionary<string, CancellationTokenSource> _heartbeatTasks = new();
    private string? _currentUserID;

        public GameLauncherService(DRMService drmService)
    {
   _drmService = drmService;
      }

     /// <summary>
      /// 客户端启动时初始化
        /// </summary>
    public async Task InitializeAsync(string userID, string clientVersion)
        {
         _currentUserID = userID;
            await _drmService.RegisterClientAsync(userID, clientVersion);
     }

    /// <summary>
        /// 客户端关闭时清理
        /// </summary>
    public async Task ShutdownAsync()
     {
 if (_currentUserID != null)
        {
            // 停止所有游戏
   foreach (var gameID in _runningGames.Keys.ToList())
             {
          await StopGameAsync(gameID);
        }

         // 注销客户端
       await _drmService.UnregisterClientAsync(_currentUserID);
            }
        }

     /// <summary>
        /// 启动游戏（核心方法）
        /// </summary>
        public async Task<(bool success, string message, Process? process)> LaunchGameAsync(
      string gameID,
            string gameName,
       string? gameExecutablePath = null)
        {
            if (_currentUserID == null)
        {
    return (false, "用户未登录", null);
            }

            // 1. 检查游戏是否已在运行
            if (_runningGames.ContainsKey(gameID))
       {
       return (false, "游戏已在运行中", null);
            }

            // 2. 生成设备ID
         var deviceID = GetDeviceID();

            // 3. DRM 验证
       var verificationRequest = new DRMVerificationRequest
     {
      UserID = _currentUserID,
                GameID = gameID,
        DeviceID = deviceID,
    ClientRunning = true,
       ClientVersion = "1.0.0",
                ClientProcessID = Process.GetCurrentProcess().Id.ToString(),
    Timestamp = DateTimeOffset.UtcNow,
        Nonce = Guid.NewGuid().ToString("N")
            };

   var verificationResponse = await _drmService.VerifyGameLaunchAsync(verificationRequest);

if (!verificationResponse.Allowed)
            {
       return (false, verificationResponse.Message ?? "验证失败", null);
            }

    // 4. 启动游戏进程
      Process? gameProcess = null;
            if (!string.IsNullOrEmpty(gameExecutablePath))
{
                try
         {
         var startInfo = new ProcessStartInfo
       {
         FileName = gameExecutablePath,
       UseShellExecute = true,
       Arguments = $"--session-token {verificationResponse.SessionToken} --drm-key {verificationResponse.DecryptionKey}"
       };

   gameProcess = Process.Start(startInfo);
           
    if (gameProcess != null)
          {
               _runningGames[gameID] = gameProcess;

  // 监听游戏进程退出
     gameProcess.EnableRaisingEvents = true;
   gameProcess.Exited += async (sender, args) =>
     {
    await OnGameExitedAsync(gameID);
           };
          }
                }
    catch (Exception ex)
       {
            return (false, $"启动游戏失败: {ex.Message}", null);
  }
     }

          // 5. 启动心跳任务
         var cts = new CancellationTokenSource();
     _heartbeatTasks[gameID] = cts;
  _ = StartHeartbeatAsync(gameID, verificationResponse.SessionToken!, cts.Token);

  return (true, "游戏启动成功", gameProcess);
        }

        /// <summary>
        /// 停止游戏
 /// </summary>
    public async Task<bool> StopGameAsync(string gameID)
        {
            // 停止心跳
    if (_heartbeatTasks.TryGetValue(gameID, out var cts))
            {
     cts.Cancel();
       _heartbeatTasks.Remove(gameID);
      }

     // 关闭游戏进程
            if (_runningGames.TryGetValue(gameID, out var process))
       {
  try
                {
if (!process.HasExited)
          {
         process.Kill();
    }
       }
      catch
  {
       // Ignore
         }
   finally
    {
       _runningGames.Remove(gameID);
        }
   }

 return await Task.FromResult(true);
   }

      /// <summary>
        /// 获取正在运行的游戏
        /// </summary>
 public async Task<List<string>> GetRunningGamesAsync()
        {
   return await Task.FromResult(_runningGames.Keys.ToList());
        }

        /// <summary>
 /// 检查游戏是否在运行
 /// </summary>
        public bool IsGameRunning(string gameID)
{
            if (_runningGames.TryGetValue(gameID, out var process))
          {
       return !process.HasExited;
            }
  return false;
        }

     /// <summary>
  /// 心跳任务（保持游戏会话）
 /// </summary>
        private async Task StartHeartbeatAsync(string gameID, string sessionToken, CancellationToken cancellationToken)
    {
            var sessionID = ExtractSessionID(sessionToken);
         var interval = TimeSpan.FromSeconds(60);

            while (!cancellationToken.IsCancellationRequested)
          {
                try
         {
    var heartbeat = new Heartbeat
   {
         SessionID = sessionID,
         SessionToken = sessionToken,
     Timestamp = DateTimeOffset.UtcNow,
      GameRunning = IsGameRunning(gameID),
    ClientRunning = true,
      GameProcessID = _runningGames.TryGetValue(gameID, out var p) ? p.Id.ToString() : null,
              ClientProcessID = Process.GetCurrentProcess().Id.ToString(),
            IntegrityValid = true
              };

         var success = await _drmService.ProcessHeartbeatAsync(heartbeat);

             if (!success)
 {
               // 心跳失败，停止游戏
          await StopGameAsync(gameID);
       break;
         }

   await Task.Delay(interval, cancellationToken);
      }
   catch (OperationCanceledException)
 {
       break;
     }
                catch (Exception)
                {
             // Log error
        }
        }
     }

        /// <summary>
        /// 游戏退出事件处理
        /// </summary>
        private async Task OnGameExitedAsync(string gameID)
        {
       await StopGameAsync(gameID);
 }

        /// <summary>
   /// 获取设备ID
        /// </summary>
        private string GetDeviceID()
        {
    // 简化版：实际应该使用硬件指纹
         return $"device_{Environment.MachineName}_{Environment.UserName}".GetHashCode().ToString("X");
        }

   /// <summary>
      /// 从 Token 提取 SessionID
  /// </summary>
        private string ExtractSessionID(string sessionToken)
        {
      // 简化版：实际应该解析 Token
     return sessionToken.Split('_')[1];
        }
  }

    /// <summary>
    /// 游戏库管理服务
    /// </summary>
    public class GameLibraryService
    {
        private readonly DRMService _drmService;

        public GameLibraryService(DRMService drmService)
        {
            _drmService = drmService;
   }

     /// <summary>
 /// 获取用户游戏库
        /// </summary>
public async Task<List<GameLicense>> GetUserLibraryAsync(string userID)
        {
   return await _drmService.GetUserLibraryAsync(userID);
    }

        /// <summary>
        /// 检查是否拥有游戏
        /// </summary>
   public async Task<bool> OwnsGameAsync(string userID, string gameID)
    {
     var library = await GetUserLibraryAsync(userID);
            return library.Any(l => l.GameID == gameID && l.IsActive && !l.IsRevoked);
        }

        /// <summary>
        /// 获取游戏信息
        /// </summary>
        public async Task<GameLicense?> GetGameLicenseAsync(string userID, string gameID)
  {
            var library = await GetUserLibraryAsync(userID);
            return library.FirstOrDefault(l => l.GameID == gameID);
        }

        /// <summary>
 /// 购买游戏
 /// </summary>
        public async Task<GameLicense> PurchaseGameAsync(
     string userID,
    string gameID,
            string gameName,
         OwnershipType ownershipType = OwnershipType.Purchased)
      {
            return await _drmService.PurchaseGameAsync(userID, gameID, gameName, ownershipType);
        }

        /// <summary>
        /// 获取游戏统计
  /// </summary>
     public async Task<DRMStatistics> GetGameStatisticsAsync(string gameID)
   {
            return await _drmService.GetStatisticsAsync(gameID);
        }
    }

    /// <summary>
    /// 反作弊监控服务
    /// </summary>
    public class AntiCheatService
    {
      private readonly List<AntiCheatDetection> _detections = new();

        /// <summary>
        /// 检测可疑进程
 /// </summary>
      public async Task<List<AntiCheatDetection>> ScanProcessesAsync(string userID, string gameID, string sessionID)
        {
         var detections = new List<AntiCheatDetection>();

    // 扫描常见作弊工具进程
    var suspiciousProcesses = new[]
   {
     "cheatengine",
  "artmoney",
                "gameguardian",
        "memoryhacker",
       "trainer"
  };

 var processes = Process.GetProcesses();
   foreach (var process in processes)
{
           try
     {
        var processName = process.ProcessName.ToLower();
        if (suspiciousProcesses.Any(s => processName.Contains(s)))
        {
           var detection = new AntiCheatDetection
        {
   UserID = userID,
            GameID = gameID,
             SessionID = sessionID,
       DetectionType = "Process",
              Description = $"检测到可疑进程: {process.ProcessName}",
 SeverityLevel = 8,
IsSuspicious = true,
      Action = "Warning"
 };

      detections.Add(detection);
 _detections.Add(detection);
         }
 }
             catch
     {
        // Ignore
   }
 }

    return await Task.FromResult(detections);
        }

        /// <summary>
        /// 获取检测历史
        /// </summary>
        public async Task<List<AntiCheatDetection>> GetDetectionHistoryAsync(string userID)
        {
         var history = _detections
   .Where(d => d.UserID == userID)
    .OrderByDescending(d => d.DetectedAt)
  .ToList();

     return await Task.FromResult(history);
        }
    }
}
