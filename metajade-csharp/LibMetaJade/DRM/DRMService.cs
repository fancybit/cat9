using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LibMetaJade.DRM
{
    /// <summary>
    /// DRM 服务 - 游戏版权保护核心服务（类似 Steam）
/// </summary>
    public class DRMService
  {
        private readonly Dictionary<string, GameLicense> _licenses = new();
        private readonly Dictionary<string, GameSession> _activeSessions = new();
   private readonly Dictionary<string, DeviceInfo> _devices = new();
        private readonly Dictionary<string, ClientStatus> _clientStatuses = new();
      private readonly HashSet<string> _usedNonces = new();
   
        // 客户端进程ID（模拟）
   private string? _clientProcessID;

        public DRMService()
        {
 // 模拟客户端启动
        _clientProcessID = Process.GetCurrentProcess().Id.ToString();
      }

  /// <summary>
        /// 购买游戏（创建许可证）
   /// </summary>
    public async Task<GameLicense> PurchaseGameAsync(
            string userID,
  string gameID,
         string gameName,
OwnershipType ownershipType = OwnershipType.Purchased,
            DateTimeOffset? expiryDate = null)
        {
     var license = new GameLicense
       {
     UserID = userID,
      GameID = gameID,
             GameName = gameName,
    OwnershipType = ownershipType,
             PurchaseDate = DateTimeOffset.UtcNow,
      ExpiryDate = expiryDate,
       IsActive = true,
    LastVerified = DateTimeOffset.UtcNow,
     DRMMode = DRMMode.Hybrid
            };

       // 生成许可证签名
  license.LicenseSignature = GenerateLicenseSignature(license);
   license.EncryptedKey = GenerateEncryptedKey(license);

            _licenses[license.LicenseID] = license;

        return await Task.FromResult(license);
      }

        /// <summary>
        /// 验证游戏启动（核心DRM验证）
        /// </summary>
 public async Task<DRMVerificationResponse> VerifyGameLaunchAsync(DRMVerificationRequest request)
        {
 // 1. 检查客户端是否运行
            if (!request.ClientRunning)
       {
                return CreateErrorResponse(
       GameLaunchStatus.ClientNotRunning,
   "必须启动 JadeClient 客户端才能运行游戏"
                );
  }

 // 2. 检查客户端进程
     var clientStatus = GetClientStatus(request.UserID);
        if (clientStatus == null || !clientStatus.IsRunning)
            {
    return CreateErrorResponse(
          GameLaunchStatus.ClientNotRunning,
       "JadeClient 客户端未运行或已关闭"
        );
   }

    // 3. 验证防重放攻击
 if (!string.IsNullOrEmpty(request.Nonce))
            {
           if (_usedNonces.Contains(request.Nonce))
           {
       return CreateErrorResponse(
 GameLaunchStatus.NotAuthenticated,
     "检测到重放攻击"
       );
      }
     _usedNonces.Add(request.Nonce);
            }

            // 4. 查找许可证
     var license = _licenses.Values.FirstOrDefault(l =>
        l.UserID == request.UserID &&
                l.GameID == request.GameID &&
     l.IsActive
            );

     if (license == null)
            {
           return CreateErrorResponse(
        GameLaunchStatus.NotOwned,
            "您未拥有此游戏，请先购买"
       );
            }

    // 5. 验证许可证状态
       if (license.IsRevoked)
          {
            return CreateErrorResponse(
        GameLaunchStatus.LicenseRevoked,
           $"许可证已被撤销: {license.RevocationReason}"
                );
 }

     // 6. 验证订阅/试玩有效期
  if (license.ExpiryDate.HasValue && license.ExpiryDate.Value < DateTimeOffset.UtcNow)
          {
                return CreateErrorResponse(
            GameLaunchStatus.Expired,
     license.OwnershipType == OwnershipType.Subscription
           ? "订阅已过期，请续订"
                : "试玩期已结束，请购买完整版"
    );
            }

         // 7. 验证设备授权
         var deviceValidation = await ValidateDeviceAsync(request.UserID, request.DeviceID, license);
      if (!deviceValidation.success)
  {
                return CreateErrorResponse(
          GameLaunchStatus.MaxDevicesExceeded,
     deviceValidation.message
    );
 }

      // 8. 验证区域锁定
         if (!await ValidateRegionAsync(request.DeviceID, license))
 {
        return CreateErrorResponse(
    GameLaunchStatus.RegionLocked,
         "此游戏在您所在的地区不可用"
         );
          }

        // 9. 离线模式验证
 if (request.IsOffline)
      {
            var offlineValid = await ValidateOfflineModeAsync(license);
if (!offlineValid)
             {
        return CreateErrorResponse(
       GameLaunchStatus.Offline,
          $"离线模式验证失败，请在{license.OfflineGracePeriodHours}小时内联网验证"
   );
          }
    }

   // 10. 创建游戏会话
         var session = await CreateGameSessionAsync(
         request.UserID,
            request.GameID,
                request.DeviceID,
      request.ClientVersion
            );

    // 11. 更新许可证验证时间
  license.LastVerified = DateTimeOffset.UtcNow;

     // 12. 返回成功响应
            return new DRMVerificationResponse
   {
         Status = GameLaunchStatus.Success,
      Allowed = true,
       Message = "验证通过，游戏启动中...",
     SessionToken = session.SessionToken,
        DecryptionKey = license.EncryptedKey,
      NextVerification = DateTimeOffset.UtcNow.AddMinutes(5),
           HeartbeatInterval = 60,
License = license,
       Timestamp = DateTimeOffset.UtcNow,
           Signature = GenerateResponseSignature(session.SessionToken)
            };
        }

        /// <summary>
    /// 创建游戏会话
        /// </summary>
        private async Task<GameSession> CreateGameSessionAsync(
            string userID,
        string gameID,
        string deviceID,
        string? clientVersion)
        {
            var session = new GameSession
            {
                UserID = userID,
      GameID = gameID,
            DeviceID = deviceID,
         SessionToken = GenerateSessionToken(),
   StartTime = DateTimeOffset.UtcNow,
    LastHeartbeat = DateTimeOffset.UtcNow,
    ClientRunning = true,
        ClientVersion = clientVersion
            };

            _activeSessions[session.SessionID] = session;

            return await Task.FromResult(session);
        }

        /// <summary>
        /// 处理心跳包（保持游戏运行）
        /// </summary>
        public async Task<bool> ProcessHeartbeatAsync(Heartbeat heartbeat)
    {
    if (!_activeSessions.TryGetValue(heartbeat.SessionID, out var session))
            {
      return false;
            }

            // 验证 Token
   if (session.SessionToken != heartbeat.SessionToken)
      {
     return false;
 }

          // 检查客户端是否运行
         if (!heartbeat.ClientRunning)
 {
// 客户端关闭，终止游戏会话
 await EndGameSessionAsync(session.SessionID, "客户端已关闭");
          return false;
  }

         // 完整性检查
            if (!heartbeat.IntegrityValid)
{
     await EndGameSessionAsync(session.SessionID, "游戏文件完整性验证失败");
     return false;
            }

  // 更新心跳
            session.LastHeartbeat = DateTimeOffset.UtcNow;
       session.ClientRunning = heartbeat.ClientRunning;
            session.GameVersion = heartbeat.GameProcessID;

    return await Task.FromResult(true);
        }

        /// <summary>
  /// 结束游戏会话
        /// </summary>
        public async Task EndGameSessionAsync(string sessionID, string? reason = null)
        {
       if (_activeSessions.TryGetValue(sessionID, out var session))
            {
             session.IsActive = false;
              session.EndTime = DateTimeOffset.UtcNow;
          _activeSessions.Remove(sessionID);
     }

   await Task.CompletedTask;
        }

        /// <summary>
        /// 监控会话（检测客户端异常关闭）
  /// </summary>
        public async Task MonitorSessionsAsync()
 {
            var timeout = TimeSpan.FromSeconds(120); // 2分钟无心跳视为超时

            var expiredSessions = _activeSessions.Values
    .Where(s => DateTimeOffset.UtcNow - s.LastHeartbeat > timeout)
                .ToList();

            foreach (var session in expiredSessions)
            {
      await EndGameSessionAsync(session.SessionID, "心跳超时");
            }
        }

        /// <summary>
        /// 验证设备授权
        /// </summary>
        private async Task<(bool success, string message)> ValidateDeviceAsync(
 string userID,
   string deviceID,
       GameLicense license)
        {
            // 获取或创建设备信息
          if (!_devices.TryGetValue(deviceID, out var device))
     {
  device = new DeviceInfo
    {
  DeviceID = deviceID,
    UserID = userID,
 Platform = GetCurrentPlatform(),
 AuthorizedAt = DateTimeOffset.UtcNow
       };
           _devices[deviceID] = device;
    }

    // 检查设备是否已授权
            if (!license.AuthorizedDevices.Contains(deviceID))
         {
 // 检查是否超出设备数量限制
       if (license.AuthorizedDevices.Count >= license.MaxDevices)
 {
 return (false, $"已达到最大设备数量限制（{license.MaxDevices}台）。请在设置中移除旧设备。");
        }

                // 自动授权设备
   license.AuthorizedDevices.Add(deviceID);
            }

            device.LastActive = DateTimeOffset.UtcNow;
 device.LoginCount++;

        return await Task.FromResult((true, "设备验证通过"));
  }

        /// <summary>
        /// 验证区域锁定
        /// </summary>
        private async Task<bool> ValidateRegionAsync(string deviceID, GameLicense license)
        {
            // 如果没有区域限制，允许全球访问
      if (license.AllowedRegions.Count == 0 && license.BlockedRegions.Count == 0)
     {
      return await Task.FromResult(true);
  }

 if (_devices.TryGetValue(deviceID, out var device))
          {
     var region = device.Region ?? "Unknown";

                // 检查黑名单
           if (license.BlockedRegions.Contains(region))
                {
    return false;
        }

          // 检查白名单
         if (license.AllowedRegions.Count > 0 && !license.AllowedRegions.Contains(region))
    {
          return false;
   }
       }

         return await Task.FromResult(true);
        }

        /// <summary>
  /// 验证离线模式
      /// </summary>
        private async Task<bool> ValidateOfflineModeAsync(GameLicense license)
        {
   if (license.DRMMode == DRMMode.AlwaysOnline)
       {
                return false; // 强制在线模式
     }

            var gracePeriod = TimeSpan.FromHours(license.OfflineGracePeriodHours);
      var timeSinceLastVerification = DateTimeOffset.UtcNow - license.LastVerified;

  return await Task.FromResult(timeSinceLastVerification < gracePeriod);
        }

     /// <summary>
   /// 注册客户端
     /// </summary>
   public async Task RegisterClientAsync(string userID, string clientVersion)
      {
            var status = new ClientStatus
     {
           IsRunning = true,
       Version = clientVersion,
ProcessID = _clientProcessID,
    StartTime = DateTimeOffset.UtcNow,
          LastHeartbeat = DateTimeOffset.UtcNow,
        IsOnline = true
   };

        _clientStatuses[userID] = status;

            await Task.CompletedTask;
        }

        /// <summary>
   /// 注销客户端
        /// </summary>
        public async Task UnregisterClientAsync(string userID)
        {
 if (_clientStatuses.TryGetValue(userID, out var status))
   {
   status.IsRunning = false;
         }

  // 终止所有活跃会话
            var userSessions = _activeSessions.Values
.Where(s => s.UserID == userID)
    .ToList();

            foreach (var session in userSessions)
 {
      await EndGameSessionAsync(session.SessionID, "客户端已关闭");
            }
        }

        /// <summary>
      /// 获取客户端状态
  /// </summary>
        public ClientStatus? GetClientStatus(string userID)
        {
            return _clientStatuses.TryGetValue(userID, out var status) ? status : null;
   }

      /// <summary>
 /// 获取用户的游戏库
        /// </summary>
      public async Task<List<GameLicense>> GetUserLibraryAsync(string userID)
        {
            var licenses = _licenses.Values
    .Where(l => l.UserID == userID && l.IsActive && !l.IsRevoked)
      .ToList();

      return await Task.FromResult(licenses);
        }

        /// <summary>
        /// 获取活跃会话
        /// </summary>
        public async Task<List<GameSession>> GetActiveSessionsAsync(string userID)
        {
  var sessions = _activeSessions.Values
      .Where(s => s.UserID == userID && s.IsActive)
     .ToList();

          return await Task.FromResult(sessions);
        }

        /// <summary>
        /// 撤销许可证
        /// </summary>
        public async Task<bool> RevokeLicenseAsync(string licenseID, string reason)
        {
            if (_licenses.TryGetValue(licenseID, out var license))
      {
     license.IsRevoked = true;
     license.RevocationReason = reason;
            license.IsActive = false;

           // 终止所有相关会话
                var sessions = _activeSessions.Values
  .Where(s => s.UserID == license.UserID && s.GameID == license.GameID)
     .ToList();

foreach (var session in sessions)
          {
         await EndGameSessionAsync(session.SessionID, "许可证已撤销");
        }

 return true;
            }

  return false;
 }

        /// <summary>
        /// 获取DRM统计
        /// </summary>
        public async Task<DRMStatistics> GetStatisticsAsync(string gameID)
        {
 var gameLicenses = _licenses.Values.Where(l => l.GameID == gameID).ToList();
         var gameSessions = _activeSessions.Values.Where(s => s.GameID == gameID).ToList();

     var stats = new DRMStatistics
        {
      GameID = gameID,
  TotalLicenses = gameLicenses.Count,
    ActiveLicenses = gameLicenses.Count(l => l.IsActive && !l.IsRevoked),
    RevokedLicenses = gameLicenses.Count(l => l.IsRevoked),
       ActiveSessions = gameSessions.Count(s => s.IsActive),
    TotalSessions = gameSessions.Count,
        TotalPlayTime = TimeSpan.FromSeconds(gameSessions.Sum(s => s.PlayTime.TotalSeconds)),
AverageSessionDuration = gameSessions.Count > 0
 ? TimeSpan.FromSeconds(gameSessions.Average(s => s.PlayTime.TotalSeconds))
         : TimeSpan.Zero,
       UniqueDevices = _devices.Count,
         AuthorizedDevices = _devices.Count(d => d.Value.IsAuthorized)
            };

      return await Task.FromResult(stats);
        }

  // === 辅助方法 ===

        private DRMVerificationResponse CreateErrorResponse(GameLaunchStatus status, string message)
        {
    return new DRMVerificationResponse
   {
  Status = status,
        Allowed = false,
        Message = message,
            ErrorCode = status.ToString(),
         Timestamp = DateTimeOffset.UtcNow
            };
        }

        private string GenerateLicenseSignature(GameLicense license)
        {
        var data = $"{license.UserID}{license.GameID}{license.PurchaseDate:O}{license.LicenseID}";
   using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(data));
     return Convert.ToBase64String(hash);
      }

        private string GenerateEncryptedKey(GameLicense license)
        {
var key = $"{license.GameID}_{license.UserID}_{Guid.NewGuid():N}";
 return Convert.ToBase64String(Encoding.UTF8.GetBytes(key));
        }

 private string GenerateSessionToken()
        {
  return $"session_{Guid.NewGuid():N}_{DateTimeOffset.UtcNow.Ticks}";
        }

   private string GenerateResponseSignature(string sessionToken)
        {
     using var sha = SHA256.Create();
            var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(sessionToken));
            return Convert.ToBase64String(hash);
        }

        private string GetCurrentPlatform()
        {
            if (OperatingSystem.IsWindows()) return "Windows";
         if (OperatingSystem.IsMacOS()) return "macOS";
            if (OperatingSystem.IsLinux()) return "Linux";
        if (OperatingSystem.IsAndroid()) return "Android";
      if (OperatingSystem.IsIOS()) return "iOS";
   return "Unknown";
        }

        /// <summary>
        /// 清理缓存
     /// </summary>
        public void ClearCache()
        {
            _activeSessions.Clear();
  _usedNonces.Clear();
    }
    }
}
