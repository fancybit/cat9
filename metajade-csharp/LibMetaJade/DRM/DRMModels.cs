using System;
using System.Collections.Generic;

namespace LibMetaJade.DRM
{
    /// <summary>
    /// 游戏所有权类型
    /// </summary>
    public enum OwnershipType
    {
        Purchased,      // 已购买（永久）
        Subscription,// 订阅制
        Trial,      // 试玩版
        Free, // 免费游戏
        Family,   // 家庭共享
        Refunded // 已退款（失效）
    }

    /// <summary>
    /// 游戏启动状态
    /// </summary>
    public enum GameLaunchStatus
    {
        Success,             // 启动成功
        NotOwned,          // 未拥有
        NotAuthenticated,       // 未认证
        Offline,  // 离线模式（需验证）
        Expired,// 订阅过期
        Suspended,  // 账户暂停
        RegionLocked, // 区域锁定
        ClientNotRunning,       // 客户端未运行
        LicenseRevoked,  // 许可证已撤销
        MaxDevicesExceeded    // 超出设备数量限制
    }

    /// <summary>
    /// DRM 验证模式
    /// </summary>
    public enum DRMMode
    {
        AlwaysOnline,   // 始终在线验证
        Offline, // 离线模式（定期验证）
        Hybrid          // 混合模式
    }

    /// <summary>
    /// 游戏许可证
    /// </summary>
    public class GameLicense
    {
        public string LicenseID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string GameID { get; set; } = string.Empty;
        public string GameName { get; set; } = string.Empty;

        // 所有权信息
        public OwnershipType OwnershipType { get; set; }
        public DateTimeOffset PurchaseDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }  // 订阅/试玩过期时间

        // 许可证状态
        public bool IsActive { get; set; } = true;
        public bool IsRevoked { get; set; }
        public string? RevocationReason { get; set; }

        // 设备绑定
        public List<string> AuthorizedDevices { get; set; } = new();
        public int MaxDevices { get; set; } = 5;  // 最多5台设备

        // 区域限制
        public List<string> AllowedRegions { get; set; } = new();  // 空=全球
        public List<string> BlockedRegions { get; set; } = new();

        // 家庭共享
        public bool AllowFamilySharing { get; set; }
        public string? FamilyGroupID { get; set; }

        // DRM 配置
        public DRMMode DRMMode { get; set; } = DRMMode.Hybrid;
        public int OfflineGracePeriodHours { get; set; } = 72;  // 离线宽限期72小时

        // 验证信息
        public DateTimeOffset LastVerified { get; set; }
        public string? LicenseSignature { get; set; }
        public string? EncryptedKey { get; set; }

        // IPFS 备份
        public string? LicenseCID { get; set; }
        public int BackupHops { get; set; } = 3;
    }

    /// <summary>
    /// 游戏会话
    /// </summary>
    public class GameSession
    {
        public string SessionID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string GameID { get; set; } = string.Empty;
        public string DeviceID { get; set; } = string.Empty;

        // 会话状态
        public bool IsActive { get; set; } = true;
        public DateTimeOffset StartTime { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? EndTime { get; set; }
        public TimeSpan PlayTime => EndTime.HasValue
            ? EndTime.Value - StartTime
            : DateTimeOffset.UtcNow - StartTime;

        // 验证信息
        public string SessionToken { get; set; } = string.Empty;
        public DateTimeOffset LastHeartbeat { get; set; }
        public int HeartbeatIntervalSeconds { get; set; } = 60;  // 60秒心跳

        // 客户端信息
        public bool ClientRunning { get; set; } = true;
        public string? ClientVersion { get; set; }
        public string? GameVersion { get; set; }

        // 会话统计
        public int SaveCount { get; set; }
        public int AchievementCount { get; set; }
        public Dictionary<string, object> SessionData { get; set; } = new();
    }

    /// <summary>
    /// 设备信息
    /// </summary>
    public class DeviceInfo
    {
        public string DeviceID { get; set; } = Guid.NewGuid().ToString();
        public string DeviceName { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;

        // 设备识别
        public string? HardwareID { get; set; }  // 硬件指纹
        public string? MACAddress { get; set; }
        public string? CPUSerial { get; set; }
        public string? DiskSerial { get; set; }

        // 设备信息
        public string Platform { get; set; } = string.Empty;  // Windows, macOS, Linux
        public string OSVersion { get; set; } = string.Empty;
        public string? IPAddress { get; set; }
        public string? Region { get; set; }

        // 授权状态
        public bool IsAuthorized { get; set; } = true;
        public DateTimeOffset AuthorizedAt { get; set; }
        public DateTimeOffset LastActive { get; set; }

        // 信任评分
        public double TrustScore { get; set; } = 1.0;
        public int LoginCount { get; set; }
        public int SuspiciousActivityCount { get; set; }
    }

    /// <summary>
    /// DRM 验证请求
    /// </summary>
    public class DRMVerificationRequest
    {
        public string UserID { get; set; } = string.Empty;
        public string GameID { get; set; } = string.Empty;
        public string DeviceID { get; set; } = string.Empty;

        // 客户端信息
        public bool ClientRunning { get; set; }
        public string? ClientVersion { get; set; }
        public string? ClientProcessID { get; set; }

        // 验证数据
        public string? LicenseSignature { get; set; }
        public string? SessionToken { get; set; }
        public bool IsOffline { get; set; }

        // 时间戳
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
        public string? Nonce { get; set; }  // 防重放攻击
    }

    /// <summary>
    /// DRM 验证响应
    /// </summary>
    public class DRMVerificationResponse
    {
        public GameLaunchStatus Status { get; set; }
        public bool Allowed { get; set; }
        public string? Message { get; set; }
        public string? ErrorCode { get; set; }

        // 会话信息
        public string? SessionToken { get; set; }
        public string? GameExecutable { get; set; }
        public string? DecryptionKey { get; set; }  // 游戏解密密钥

        // 下次验证时间
        public DateTimeOffset NextVerification { get; set; }
        public int HeartbeatInterval { get; set; } = 60;

        // 许可证信息
        public GameLicense? License { get; set; }

        // 时间戳
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
        public string? Signature { get; set; }
    }

    /// <summary>
    /// 反作弊检测
    /// </summary>
    public class AntiCheatDetection
    {
        public string DetectionID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string GameID { get; set; } = string.Empty;
        public string SessionID { get; set; } = string.Empty;

        // 检测类型
        public string DetectionType { get; set; } = string.Empty;  // Memory, Process, File, Network
        public string Description { get; set; } = string.Empty;
        public int SeverityLevel { get; set; }  // 1-10

        // 检测结果
        public bool IsSuspicious { get; set; }
        public bool IsConfirmed { get; set; }
        public string? Evidence { get; set; }

        // 处理
        public string? Action { get; set; }  // Warning, Suspend, Ban
        public DateTimeOffset DetectedAt { get; set; } = DateTimeOffset.UtcNow;
        public bool IsResolved { get; set; }
    }

    /// <summary>
    /// 游戏启动参数
    /// </summary>
    public class GameLaunchParameters
    {
        public string GameID { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
        public string SessionToken { get; set; } = string.Empty;

        // 启动配置
        public string? GameExecutable { get; set; }
        public List<string> LaunchArguments { get; set; } = new();
        public Dictionary<string, string> Environment { get; set; } = new();

        // DRM 参数
        public string? DecryptionKey { get; set; }
        public string? ActivationCode { get; set; }

        // 客户端通信
        public string? IPCEndpoint { get; set; }  // 客户端进程间通信端点
        public int HeartbeatPort { get; set; }
    }

    /// <summary>
    /// 心跳包
    /// </summary>
    public class Heartbeat
    {
        public string SessionID { get; set; } = string.Empty;
        public string SessionToken { get; set; } = string.Empty;
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        // 游戏状态
        public bool GameRunning { get; set; } = true;
        public bool ClientRunning { get; set; } = true;
        public string? GameProcessID { get; set; }
        public string? ClientProcessID { get; set; }

        // 完整性检查
        public string? GameHashChecksum { get; set; }
        public bool IntegrityValid { get; set; } = true;

        // 性能数据（可选）
        public double? FPS { get; set; }
        public long? MemoryUsage { get; set; }
    }

    /// <summary>
    /// DRM 统计数据
    /// </summary>
    public class DRMStatistics
    {
        public string GameID { get; set; } = string.Empty;

        // 许可证统计
        public int TotalLicenses { get; set; }
        public int ActiveLicenses { get; set; }
        public int RevokedLicenses { get; set; }

        // 会话统计
        public int ActiveSessions { get; set; }
        public int TotalSessions { get; set; }
        public TimeSpan TotalPlayTime { get; set; }
        public TimeSpan AverageSessionDuration { get; set; }

        // 设备统计
        public int UniqueDevices { get; set; }
        public int AuthorizedDevices { get; set; }

        // 违规统计
        public int TotalViolations { get; set; }
        public int SuspendedAccounts { get; set; }
        public int BannedAccounts { get; set; }

        // 区域统计
        public Dictionary<string, int> RegionalDistribution { get; set; } = new();

        // 更新时间
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// 客户端状态
    /// </summary>
    public class ClientStatus
    {
        public bool IsRunning { get; set; }
        public string? Version { get; set; }
        public string? ProcessID { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset LastHeartbeat { get; set; }

        // 客户端功能
        public bool DRMEnabled { get; set; } = true;
        public bool AntiCheatEnabled { get; set; } = true;
        public bool CloudSaveEnabled { get; set; } = true;

        // 连接状态
        public bool IsOnline { get; set; }
        public string? IPAddress { get; set; }
        public int ActiveGames { get; set; }
    }
}
