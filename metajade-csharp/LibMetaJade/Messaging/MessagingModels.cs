using System;
using System.Collections.Generic;

namespace LibMetaJade.Messaging
{
    /// <summary>
    /// 消息类型
    /// </summary>
    public enum MessageType
    {
        Text,           // 文本消息
   Image,        // 图片消息
        File,           // 文件消息
     Voice,          // 语音消息
        Video,          // 视频消息
        SystemNotice,   // 系统通知
    Transaction     // 交易消息
    }

    /// <summary>
    /// 消息状态
    /// </summary>
    public enum MessageStatus
    {
        Draft,       // 草稿
        Sending,        // 发送中
        Sent,  // 已发送
        Delivered,// 已送达
      Read,       // 已读
        Failed,       // 发送失败
        Deleted         // 已删除
    }

    /// <summary>
    /// 消息优先级
    /// </summary>
    public enum MessagePriority
    {
        Low, // 低优先级
        Normal,         // 普通
        High,           // 高优先级
    Urgent          // 紧急
    }

    /// <summary>
    /// 消息实体
    /// </summary>
    public class Message
    {
    public string MessageID { get; set; } = Guid.NewGuid().ToString();
        public string SenderUserID { get; set; } = string.Empty;
     public string ReceiverUserID { get; set; } = string.Empty;
        
   // 消息内容
 public MessageType Type { get; set; }
        public string Content { get; set; } = string.Empty;
public string? ContentCID { get; set; }  // IPFS CID（大内容）
    
        // 消息元数据
        public MessagePriority Priority { get; set; } = MessagePriority.Normal;
        public MessageStatus Status { get; set; } = MessageStatus.Draft;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? SentAt { get; set; }
    public DateTimeOffset? DeliveredAt { get; set; }
 public DateTimeOffset? ReadAt { get; set; }
        
   // 加密相关
        public bool IsEncrypted { get; set; }
     public string? EncryptionKey { get; set; }

        // 备份相关
        public List<string> BackupNodeCIDs { get; set; } = new();  // 备份节点列表
public int BackupHops { get; set; } = 3;  // 备份跳数 (1-6)
     
        // 附加信息
        public Dictionary<string, string> Metadata { get; set; } = new();
   public bool IsStarred { get; set; }
 public bool IsArchived { get; set; }
        
        // 回复引用
        public string? ReplyToMessageID { get; set; }
        public string? ThreadID { get; set; }
    }

    /// <summary>
    /// 消息会话（聊天对话）
    /// </summary>
    public class Conversation
    {
        public string ConversationID { get; set; } = Guid.NewGuid().ToString();
 public List<string> ParticipantUserIDs { get; set; } = new();
  public bool IsGroupChat { get; set; }
   public string? GroupName { get; set; }
        public string? GroupAvatarCID { get; set; }
        
   // 最后一条消息
     public string? LastMessageID { get; set; }
 public string? LastMessagePreview { get; set; }
        public DateTimeOffset? LastMessageTime { get; set; }
        
    // 未读消息数
        public Dictionary<string, int> UnreadCounts { get; set; } = new();  // UserID -> Count
        
 // 会话设置
        public bool IsMuted { get; set; }
        public bool IsPinned { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? LastActiveAt { get; set; }
        
        // IPFS 备份
        public string? ConversationCID { get; set; }  // 会话数据的 IPFS CID
        public List<string> MessageHistoryCIDs { get; set; } = new();  // 聊天记录分片 CID
    }

    /// <summary>
    /// 消息邮箱（收件箱/发件箱）
    /// </summary>
    public class Mailbox
    {
        public string UserID { get; set; } = string.Empty;
      public string NodeCID { get; set; } = string.Empty;  // 关联的 P2P 节点
        
      // 收件箱
        public List<Message> InboxMessages { get; set; } = new();
public int TotalInboxCount { get; set; }
        public int UnreadCount { get; set; }
        
   // 发件箱
        public List<Message> SentMessages { get; set; } = new();
        public int TotalSentCount { get; set; }
        
        // 草稿箱
     public List<Message> DraftMessages { get; set; } = new();
     
        // 星标消息
 public List<Message> StarredMessages { get; set; } = new();
        
        // 归档消息
        public List<Message> ArchivedMessages { get; set; } = new();
        
    // 会话列表
        public List<Conversation> Conversations { get; set; } = new();
      
        // IPFS 存储配置
    public MailboxStorageConfig StorageConfig { get; set; } = new();
        
        // 统计信息
   public DateTimeOffset LastSyncTime { get; set; }
   public long TotalStorageSize { get; set; }
    }

    /// <summary>
    /// 邮箱存储配置
    /// </summary>
    public class MailboxStorageConfig
    {
        public string MailboxCID { get; set; } = string.Empty;  // 邮箱数据的主 CID
        
        // 备份策略
  public int DefaultBackupHops { get; set; } = 3;  // 默认备份跳数 (1-6)
        public bool EnableAutoBackup { get; set; } = true;
 public int BackupIntervalMinutes { get; set; } = 60;
     
        // 数据分片策略
     public bool EnableSharding { get; set; } = true;
        public int MessagesPerShard { get; set; } = 100;  // 每个分片存储的消息数
        
        // 加密配置
      public bool EnableEncryption { get; set; } = true;
        public string? PublicKey { get; set; }
        public string? PrivateKeyEncrypted { get; set; }
      
        // 缓存配置
        public bool EnableLocalCache { get; set; } = true;
        public int MaxLocalCacheSize { get; set; } = 100 * 1024 * 1024;  // 100MB
        
    // 清理策略
        public int RetentionDays { get; set; } = 365;  // 保留天数
        public bool AutoDeleteOldMessages { get; set; } = false;
    }

    /// <summary>
    /// 消息备份信息
    /// </summary>
    public class MessageBackupInfo
    {
 public string MessageID { get; set; } = string.Empty;
     public string PrimaryStorageCID { get; set; } = string.Empty;
 
        // 备份节点列表（按 SNS 连接）
      public List<BackupNode> BackupNodes { get; set; } = new();
        
        public int BackupHops { get; set; }
        public DateTimeOffset LastBackupTime { get; set; }
     public bool IsFullyReplicated { get; set; }
     public double ReplicationRatio { get; set; }  // 备份完成率
    }

    /// <summary>
    /// 备份节点
    /// </summary>
    public class BackupNode
    {
        public string NodeCID { get; set; } = string.Empty;
        public string? UserID { get; set; }  // 关联的用户ID（如果有）
        public int HopDistance { get; set; }  // 跳数距离
        public string BackupDataCID { get; set; } = string.Empty;
        public DateTimeOffset BackupTime { get; set; }
        public bool IsHealthy { get; set; } = true;
   public double TrustScore { get; set; }
    }

    /// <summary>
/// 消息查询条件
    /// </summary>
    public class MessageQuery
    {
        public string? UserID { get; set; }
        public string? ConversationID { get; set; }
        public MessageType? Type { get; set; }
        public MessageStatus? Status { get; set; }
      public MessagePriority? Priority { get; set; }

        public DateTimeOffset? StartDate { get; set; }
     public DateTimeOffset? EndDate { get; set; }
        
 public string? SearchKeyword { get; set; }
        public bool? IsStarred { get; set; }
        public bool? IsArchived { get; set; }

        public int PageSize { get; set; } = 50;
        public int PageIndex { get; set; } = 0;
        
        public string SortBy { get; set; } = "CreatedAt";  // CreatedAt, Priority, Status
public bool SortDescending { get; set; } = true;
    }

    /// <summary>
    /// 消息同步状态
    /// </summary>
    public class MessageSyncStatus
    {
     public string UserID { get; set; } = string.Empty;
        public DateTimeOffset LastSyncTime { get; set; }
    public int PendingUploadCount { get; set; }
  public int PendingDownloadCount { get; set; }
        public List<string> FailedMessageIDs { get; set; } = new();
        public bool IsSyncing { get; set; }
      public double SyncProgress { get; set; }  // 0.0-1.0
    }
}
