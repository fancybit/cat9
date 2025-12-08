using System;
using System.Threading.Tasks;
using LibMetaJade.Messaging;
using LibMetaJade.Network;
using LibMetaJade.Storage;

namespace LibMetaJade.Examples
{
    /// <summary>
    /// 消息邮箱示例 - 演示基于 IPFS 的消息系统和 SNS 备份
 /// </summary>
    public static class MessagingExamples
    {
        /// <summary>
 /// 运行所有消息示例
        /// </summary>
        public static async Task RunAllExamplesAsync()
 {
  Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
       Console.WriteLine("║     玄玉区块网络 - 消息邮箱示例        ║");
   Console.WriteLine("╚════════════════════════════════════════════════════════════════╝\n");

await Example1_BasicMessagingAsync();
     Console.WriteLine("\n" + new string('=', 70) + "\n");

   await Example2_GroupChatAsync();
Console.WriteLine("\n" + new string('=', 70) + "\n");

     await Example3_MessageBackupAsync();
     Console.WriteLine("\n" + new string('=', 70) + "\n");

       await Example4_BackupStrategyAsync();
      }

        /// <summary>
        /// 示例1：基础消息发送与接收
   /// </summary>
private static async Task Example1_BasicMessagingAsync()
   {
    Console.WriteLine("=== 示例1：基础消息发送与接收 ===\n");

      // 初始化服务
            var router = new DualLayerRouter();
       var chunking = new AdaptiveChunkingStrategy();
  var mailboxService = new MailboxService(router, chunking);

     // 场景：Alice 给 Bob 发送消息
 var alice = "user_00001";
   var bob = "user_00002";

   Console.WriteLine($"【发送消息】");
       Console.WriteLine($"  发送方: {alice}");
       Console.WriteLine($"  接收方: {bob}");

 // 发送普通文本消息（3跳备份）
       var message1 = await mailboxService.SendMessageAsync(
      alice, bob,
  "Hello Bob! 这是一条测试消息。",
   MessageType.Text,
       MessagePriority.Normal,
  backupHops: 3
  );

            Console.WriteLine($"\n  ? 消息已发送");
  Console.WriteLine($"  消息ID: {message1.MessageID}");
  Console.WriteLine($"    状态: {message1.Status}");
 Console.WriteLine($"    IPFS CID: {message1.ContentCID}");
        Console.WriteLine($" 备份节点: {message1.BackupNodeCIDs.Count} 个");
        Console.WriteLine($"    备份跳数: {message1.BackupHops}");

      // 发送高优先级消息（6跳备份）
   var message2 = await mailboxService.SendMessageAsync(
    alice, bob,
 "重要通知：请查收附件文档！",
  MessageType.Text,
    MessagePriority.Urgent,
       backupHops: 6
  );

   Console.WriteLine($"\n  ? 紧急消息已发送");
     Console.WriteLine($"    优先级: {message2.Priority}");
       Console.WriteLine($"    备份跳数: {message2.BackupHops}");

 // 获取 Bob 的收件箱
 Console.WriteLine($"\n【接收方收件箱】");
       var bobMailbox = await mailboxService.GetMailboxAsync(bob);
     Console.WriteLine($"  收件箱: {bobMailbox.TotalInboxCount} 条消息");
 Console.WriteLine($"  未读: {bobMailbox.UnreadCount} 条");

    // 查看收件箱消息
       var inboxMessages = await mailboxService.GetInboxMessagesAsync(bob);
     Console.WriteLine($"\n  收件箱消息列表:");
     foreach (var msg in inboxMessages.Take(2))
  {
      Console.WriteLine($"    [{msg.Status}] {msg.Type} - {msg.Content.Substring(0, Math.Min(30, msg.Content.Length))}...");
      Console.WriteLine($"     发送时间: {msg.CreatedAt:yyyy-MM-dd HH:mm}");
       }

   // 标记为已读
       await mailboxService.MarkAsReadAsync(bob, message1.MessageID);
         Console.WriteLine($"\n  ? 消息已标记为已读");
        }

        /// <summary>
     /// 示例2：群组聊天
        /// </summary>
    private static async Task Example2_GroupChatAsync()
  {
       Console.WriteLine("=== 示例2：群组聊天 ===\n");

     var router = new DualLayerRouter();
       var chunking = new AdaptiveChunkingStrategy();
     var mailboxService = new MailboxService(router, chunking);

  // 创建群组
   var alice = "user_00001";
       var bob = "user_00002";
      var carol = "user_00003";
     var participants = new List<string> { alice, bob, carol };

     Console.WriteLine($"【创建群组】");
   Console.WriteLine($"  参与者: {string.Join(", ", participants)}");

   var conversation = await mailboxService.GetOrCreateConversationAsync(
      alice,
    participants,
      isGroupChat: true,
     groupName: "项目讨论组"
  );

         Console.WriteLine($"\n  ? 群组已创建");
  Console.WriteLine($"    会话ID: {conversation.ConversationID}");
       Console.WriteLine($"    群组名称: {conversation.GroupName}");
       Console.WriteLine($"  成员数: {conversation.ParticipantUserIDs.Count}");

       // Alice 在群组发送消息
       var groupMessage = await mailboxService.SendMessageAsync(
     alice, bob,  // 注意：实际应支持群组消息
       "大家好！我们来讨论一下新功能。",
  MessageType.Text,
MessagePriority.Normal,
   backupHops: 4
       );

  Console.WriteLine($"\n  ? 群组消息已发送");
        Console.WriteLine($"    消息内容: {groupMessage.Content}");
       Console.WriteLine($"    备份策略: {groupMessage.BackupHops} 跳（适合群组消息）");

     // 查看会话历史
       Console.WriteLine($"\n【会话历史】");
       var history = await mailboxService.GetConversationHistoryAsync(
      conversation.ConversationID,
       pageSize: 10
     );
 Console.WriteLine($"  历史消息: {history.Count} 条");
     }

        /// <summary>
  /// 示例3：消息备份与恢复
        /// </summary>
private static async Task Example3_MessageBackupAsync()
        {
     Console.WriteLine("=== 示例3：消息备份与恢复 ===\n");

var router = new DualLayerRouter();
    var socialRouter = new SocialRouter();
      var backupManager = new MessageBackupManager(router, socialRouter);

   // 创建测试消息
            var message = new Message
  {
    MessageID = Guid.NewGuid().ToString(),
     SenderUserID = "user_00001",
ReceiverUserID = "user_00005",
     Content = "这是一条重要消息，需要多重备份。",
 Type = MessageType.Text,
Priority = MessagePriority.High,
   ContentCID = "bafk1234567890abcdef"
       };

       Console.WriteLine($"【创建消息备份】");
       Console.WriteLine($"  消息ID: {message.MessageID}");
       Console.WriteLine($"  发送方: {message.SenderUserID}");
Console.WriteLine($"  接收方: {message.ReceiverUserID}");

            // 创建备份（基于 SNS 连接）
   Console.WriteLine($"\n  正在创建备份（基于社交关系）...");
      var backupInfo = await backupManager.CreateBackupAsync(
       message,
   message.SenderUserID,
            message.ReceiverUserID,
backupHops: 4
  );

            Console.WriteLine($"\n  ? 备份已创建");
            Console.WriteLine($"    主存储 CID: {backupInfo.PrimaryStorageCID}");
  Console.WriteLine($"    备份节点数: {backupInfo.BackupNodes.Count}");
       Console.WriteLine($"    备份跳数: {backupInfo.BackupHops}");
     Console.WriteLine($"  备份完成率: {backupInfo.ReplicationRatio:P}");
  Console.WriteLine($"    完全备份: {(backupInfo.IsFullyReplicated ? "?" : "?")}");

    Console.WriteLine($"\n  备份节点详情:");
     foreach (var node in backupInfo.BackupNodes.Take(3))
       {
    Console.WriteLine($"    ? 节点: {node.NodeCID}");
      Console.WriteLine($"      用户: {node.UserID ?? "N/A"}");
 Console.WriteLine($"      跳数: {node.HopDistance}");
      Console.WriteLine($"      信任度: {node.TrustScore:F2}");
       Console.WriteLine($" 健康: {(node.IsHealthy ? "?" : "?")}");
   }

            // 验证备份完整性
   Console.WriteLine($"\n【验证备份完整性】");
     var isValid = await backupManager.VerifyBackupIntegrityAsync(message.MessageID);
          Console.WriteLine($"  备份完整性: {(isValid ? "? 通过" : "? 失败")}");

// 模拟恢复消息
 Console.WriteLine($"\n【恢复消息】");
         Console.WriteLine($"  正在从备份节点恢复消息...");
var restored = await backupManager.RestoreMessageAsync(message.MessageID);
     Console.WriteLine($"  恢复结果: {(restored != null ? "? 成功" : "? 失败")}");
        }

   /// <summary>
        /// 示例4：智能备份策略
        /// </summary>
        private static async Task Example4_BackupStrategyAsync()
        {
   Console.WriteLine("=== 示例4：智能备份策略 ===\n");

            var router = new DualLayerRouter();
    var socialRouter = new SocialRouter();
       var backupManager = new MessageBackupManager(router, socialRouter);

            // 不同类型消息的备份策略
   var messages = new[]
 {
       new Message 
  { 
  Type = MessageType.Text, 
      Priority = MessagePriority.Low,
   Content = "普通文本消息"
    },
     new Message 
   { 
   Type = MessageType.File, 
  Priority = MessagePriority.Normal,
  Content = "文件传输"
 },
    new Message 
   { 
     Type = MessageType.Transaction, 
  Priority = MessagePriority.High,
      Content = "交易记录"
   },
    new Message 
      { 
      Type = MessageType.Text, 
   Priority = MessagePriority.Urgent,
     Content = "紧急通知"
     }
      };

Console.WriteLine("【智能备份策略推荐】");
            Console.WriteLine(new string('-', 70));
     Console.WriteLine($"{"消息类型",-15} {"优先级",-12} {"推荐跳数",-10} {"说明",-30}");
            Console.WriteLine(new string('-', 70));

foreach (var msg in messages)
{
       var recommendedHops = await backupManager.RecommendBackupHopsAsync(msg);
       var explanation = GetBackupExplanation(msg.Type, msg.Priority, recommendedHops);

    Console.WriteLine($"{msg.Type,-15} {msg.Priority,-12} {recommendedHops,-10} {explanation,-30}");
       }
            Console.WriteLine(new string('-', 70));

// 动态调整备份跳数
    Console.WriteLine($"\n【动态调整备份跳数】");
   var testMessage = new Message
       {
MessageID = Guid.NewGuid().ToString(),
  SenderUserID = "user_00001",
     ReceiverUserID = "user_00002",
       Type = MessageType.Text,
       Priority = MessagePriority.Normal
     };

    // 初始备份（3跳）
     var backupInfo = await backupManager.CreateBackupAsync(
      testMessage, 
    testMessage.SenderUserID,
       testMessage.ReceiverUserID,
     backupHops: 3
);
  Console.WriteLine($"  初始备份: {backupInfo.BackupHops} 跳，{backupInfo.BackupNodes.Count} 个节点");

// 扩展备份（增加到 5跳）
   Console.WriteLine($"\n  扩展备份到 5 跳...");
       var expandedBackup = await backupManager.AdjustBackupHopsAsync(
      testMessage.MessageID,
     5,
       testMessage
 );
         Console.WriteLine($"  ? 备份已扩展: {expandedBackup.BackupHops} 跳，{expandedBackup.BackupNodes.Count} 个节点");

// 收缩备份（减少到 2跳）
  Console.WriteLine($"\n  收缩备份到 2 跳...");
      var shrunkBackup = await backupManager.AdjustBackupHopsAsync(
     testMessage.MessageID,
  2,
testMessage
  );
    Console.WriteLine($"? 备份已收缩: {shrunkBackup.BackupHops} 跳，{shrunkBackup.BackupNodes.Count} 个节点");
    Console.WriteLine($"    （保留了高信任度节点）");

     // 备份统计
     Console.WriteLine($"\n【备份统计】");
       var stats = await backupManager.GetBackupStatisticsAsync("user_00001");
    Console.WriteLine($"  总备份数: {stats["total_backups"]}");
     Console.WriteLine($"  完全备份: {stats["fully_replicated"]}");
  Console.WriteLine($"  平均备份完成率: {stats["average_replication_ratio"]:P}");
Console.WriteLine($"  平均备份跳数: {stats["average_backup_hops"]:F1}");
    Console.WriteLine($"  总备份节点: {stats["total_backup_nodes"]}");
Console.WriteLine($"  健康节点: {stats["healthy_nodes"]}");

       if (stats["backup_distribution"] is Dictionary<int, int> distribution)
     {
     Console.WriteLine($"\n  备份分布（按跳数）:");
    foreach (var (hops, count) in distribution.OrderBy(kv => kv.Key))
      {
       Console.WriteLine($"    {hops} 跳: {count} 个节点");
       }
       }
    }

   private static string GetBackupExplanation(MessageType type, MessagePriority priority, int hops)
        {
       return (type, priority, hops) switch
        {
     (MessageType.Text, MessagePriority.Low, _) => "轻量备份",
 (MessageType.Text, MessagePriority.Normal, _) => "标准备份",
  (MessageType.File, _, _) => "文件需要额外备份",
       (MessageType.Transaction, _, _) => "交易记录高冗余",
     (MessageType.Text, MessagePriority.Urgent, _) => "紧急消息最大化备份",
     _ => "自动策略"
   };
 }
    }
}
