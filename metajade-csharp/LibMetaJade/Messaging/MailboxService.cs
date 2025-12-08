using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using LibMetaJade.Network;
using LibMetaJade.Storage;

namespace LibMetaJade.Messaging
{
    /// <summary>
    /// 消息邮箱服务 - 支持 IPFS 持久化和 SNS 连接备份
    /// </summary>
    public class MailboxService
    {
    private readonly DualLayerRouter _router;
     private readonly AdaptiveChunkingStrategy _chunking;
        private readonly Dictionary<string, Mailbox> _mailboxCache = new();
      
        // 模拟 IPFS 存储（实际应集成真实 IPFS 客户端）
        private readonly Dictionary<string, byte[]> _ipfsStorage = new();
        
        public MailboxService(DualLayerRouter router, AdaptiveChunkingStrategy chunking)
 {
            _router = router;
         _chunking = chunking;
  }

        /// <summary>
        /// 获取用户邮箱
        /// </summary>
        public async Task<Mailbox> GetMailboxAsync(string userID)
        {
            // 从缓存获取
            if (_mailboxCache.TryGetValue(userID, out var cached))
       return cached;

            // 从 IPFS 加载
         var mailbox = await LoadMailboxFromIPFSAsync(userID);
            
        if (mailbox == null)
            {
      // 创建新邮箱
       mailbox = new Mailbox
    {
         UserID = userID,
       NodeCID = await GetNodeCIDForUserAsync(userID),
  LastSyncTime = DateTimeOffset.UtcNow
                };
            }

      _mailboxCache[userID] = mailbox;
         return mailbox;
        }

        /// <summary>
        /// 发送消息
 /// </summary>
        public async Task<Message> SendMessageAsync(
    string senderUserID,
            string receiverUserID,
     string content,
            MessageType type = MessageType.Text,
            MessagePriority priority = MessagePriority.Normal,
      int backupHops = 3)
      {
            // 创建消息
            var message = new Message
            {
       SenderUserID = senderUserID,
      ReceiverUserID = receiverUserID,
       Content = content,
    Type = type,
    Priority = priority,
         BackupHops = Math.Clamp(backupHops, 1, 6),  // 限制在 1-6 跳
 Status = MessageStatus.Sending,
            CreatedAt = DateTimeOffset.UtcNow
      };

            // 加密消息内容
   if (await ShouldEncryptMessageAsync(senderUserID, receiverUserID))
            {
  message.IsEncrypted = true;
 message.Content = await EncryptContentAsync(content, receiverUserID);
  }

            // 存储消息到 IPFS
     var messageCID = await StoreMessageToIPFSAsync(message);
     message.ContentCID = messageCID;

       // 查找 SNS 路径用于备份
            var socialPath = await _router.FindHybridPathAsync(
      senderUserID,
         receiverUserID,
   RoutingStrategy.SocialOnly
      );

            // 根据 SNS 连接创建备份
       if (socialPath?.SocialPath != null)
            {
     message.BackupNodeCIDs = await CreateBackupNodesAsync(
          message,
    socialPath.SocialPath,
     backupHops
        );
   }

            // 更新发件箱
   var senderMailbox = await GetMailboxAsync(senderUserID);
   senderMailbox.SentMessages.Add(message);
            senderMailbox.TotalSentCount++;

  // 更新收件箱
         var receiverMailbox = await GetMailboxAsync(receiverUserID);
     receiverMailbox.InboxMessages.Add(message);
      receiverMailbox.TotalInboxCount++;
     receiverMailbox.UnreadCount++;

            // 更新消息状态
            message.Status = MessageStatus.Sent;
         message.SentAt = DateTimeOffset.UtcNow;

 // 同步到 IPFS
         await SyncMailboxToIPFSAsync(senderMailbox);
            await SyncMailboxToIPFSAsync(receiverMailbox);

    // 通知接收方
            await NotifyNewMessageAsync(receiverUserID, message);

            return message;
        }

        /// <summary>
        /// 获取收件箱消息
        /// </summary>
        public async Task<List<Message>> GetInboxMessagesAsync(
            string userID,
            MessageQuery? query = null)
        {
       var mailbox = await GetMailboxAsync(userID);
            var messages = mailbox.InboxMessages.AsQueryable();

            // 应用查询条件
    if (query != null)
            {
        if (query.Type.HasValue)
           messages = messages.Where(m => m.Type == query.Type.Value);

            if (query.Status.HasValue)
        messages = messages.Where(m => m.Status == query.Status.Value);

          if (query.Priority.HasValue)
   messages = messages.Where(m => m.Priority == query.Priority.Value);

    if (query.StartDate.HasValue)
   messages = messages.Where(m => m.CreatedAt >= query.StartDate.Value);

 if (query.EndDate.HasValue)
    messages = messages.Where(m => m.CreatedAt <= query.EndDate.Value);

       if (!string.IsNullOrEmpty(query.SearchKeyword))
    messages = messages.Where(m => m.Content.Contains(query.SearchKeyword));

      if (query.IsStarred.HasValue)
           messages = messages.Where(m => m.IsStarred == query.IsStarred.Value);

      if (query.IsArchived.HasValue)
          messages = messages.Where(m => m.IsArchived == query.IsArchived.Value);

      // 排序
      messages = query.SortBy switch
       {
        "Priority" => query.SortDescending 
        ? messages.OrderByDescending(m => m.Priority) 
           : messages.OrderBy(m => m.Priority),
       "Status" => query.SortDescending 
               ? messages.OrderByDescending(m => m.Status) 
         : messages.OrderBy(m => m.Status),
  _ => query.SortDescending 
 ? messages.OrderByDescending(m => m.CreatedAt) 
                : messages.OrderBy(m => m.CreatedAt)
        };

    // 分页
          messages = messages.Skip(query.PageIndex * query.PageSize).Take(query.PageSize);
            }

            return await Task.FromResult(messages.ToList());
        }

        /// <summary>
        /// 标记消息为已读
        /// </summary>
        public async Task MarkAsReadAsync(string userID, string messageID)
  {
 var mailbox = await GetMailboxAsync(userID);
    var message = mailbox.InboxMessages.FirstOrDefault(m => m.MessageID == messageID);

      if (message != null && message.Status != MessageStatus.Read)
            {
         message.Status = MessageStatus.Read;
        message.ReadAt = DateTimeOffset.UtcNow;
      mailbox.UnreadCount = Math.Max(0, mailbox.UnreadCount - 1);

  await SyncMailboxToIPFSAsync(mailbox);
     }
    }

        /// <summary>
        /// 创建或获取会话
  /// </summary>
  public async Task<Conversation> GetOrCreateConversationAsync(
      string userID,
    List<string> participantUserIDs,
            bool isGroupChat = false,
         string? groupName = null)
        {
          var mailbox = await GetMailboxAsync(userID);

            // 查找现有会话
       var conversation = mailbox.Conversations.FirstOrDefault(c =>
       c.ParticipantUserIDs.OrderBy(id => id).SequenceEqual(participantUserIDs.OrderBy(id => id))
            );

if (conversation != null)
      return conversation;

         // 创建新会话
            conversation = new Conversation
    {
       ParticipantUserIDs = participantUserIDs,
IsGroupChat = isGroupChat,
  GroupName = groupName,
       CreatedAt = DateTimeOffset.UtcNow,
         LastActiveAt = DateTimeOffset.UtcNow
            };

  // 初始化未读计数
         foreach (var participantID in participantUserIDs)
 {
   conversation.UnreadCounts[participantID] = 0;
            }

            mailbox.Conversations.Add(conversation);
            await SyncMailboxToIPFSAsync(mailbox);

  return conversation;
  }

        /// <summary>
  /// 获取会话消息历史
        /// </summary>
        public async Task<List<Message>> GetConversationHistoryAsync(
            string conversationID,
            int pageSize = 50,
  int pageIndex = 0)
        {
  // 从 IPFS 加载会话历史
 var historyCIDs = await GetConversationHistoryCIDsAsync(conversationID);
        
     var messages = new List<Message>();
       foreach (var cid in historyCIDs.Skip(pageIndex * pageSize).Take(pageSize))
            {
   var message = await LoadMessageFromIPFSAsync(cid);
          if (message != null)
             messages.Add(message);
    }

return messages;
        }

   /// <summary>
        /// 根据 SNS 连接创建消息备份节点
        /// </summary>
    private async Task<List<string>> CreateBackupNodesAsync(
   Message message,
  SocialPath socialPath,
    int backupHops)
    {
       var backupNodes = new List<string>();
      var visitedUsers = new HashSet<string>();

     // 从社交路径中选择备份节点
            for (int i = 0; i < Math.Min(backupHops, socialPath.UserIDs.Count); i++)
    {
       var userID = socialPath.UserIDs[i];
    
         if (visitedUsers.Contains(userID))
       continue;

     visitedUsers.Add(userID);

                // 获取用户的节点 CID
      var nodeCID = await GetNodeCIDForUserAsync(userID);
          
      if (!string.IsNullOrEmpty(nodeCID))
      {
       // 备份消息到该节点
   var backupCID = await BackupMessageToNodeAsync(message, nodeCID);
          backupNodes.Add(backupCID);
      }
          }

   return backupNodes;
      }

        /// <summary>
        /// 存储消息到 IPFS
        /// </summary>
        private async Task<string> StoreMessageToIPFSAsync(Message message)
        {
          // 序列化消息
    var json = JsonSerializer.Serialize(message);
       var data = Encoding.UTF8.GetBytes(json);

            // 计算 CID（模拟）
   var cid = $"bafk{Guid.NewGuid():N}";

 // 存储到 IPFS（模拟）
    _ipfsStorage[cid] = data;

     return await Task.FromResult(cid);
        }

        /// <summary>
        /// 从 IPFS 加载消息
        /// </summary>
    private async Task<Message?> LoadMessageFromIPFSAsync(string cid)
        {
 if (!_ipfsStorage.TryGetValue(cid, out var data))
             return null;

       var json = Encoding.UTF8.GetString(data);
    var message = JsonSerializer.Deserialize<Message>(json);

     return await Task.FromResult(message);
    }

        /// <summary>
        /// 同步邮箱到 IPFS
        /// </summary>
        private async Task SyncMailboxToIPFSAsync(Mailbox mailbox)
        {
            // 序列化邮箱数据
 var json = JsonSerializer.Serialize(mailbox);
          var data = Encoding.UTF8.GetBytes(json);

        // 根据大小决定是否分片
            var fileSize = data.Length;
      var shouldShard = fileSize > 1024 * 1024;  // 大于 1MB 分片

            if (shouldShard && mailbox.StorageConfig.EnableSharding)
     {
      // 分片存储
          await ShardAndStoreAsync(mailbox, data);
      }
    else
            {
                // 直接存储
       var cid = await StoreDataToIPFSAsync(data);
     mailbox.StorageConfig.MailboxCID = cid;
      }

  mailbox.LastSyncTime = DateTimeOffset.UtcNow;
    mailbox.TotalStorageSize = fileSize;
        }

   /// <summary>
  /// 从 IPFS 加载邮箱
        /// </summary>
    private async Task<Mailbox?> LoadMailboxFromIPFSAsync(string userID)
        {
       // 查找用户的邮箱 CID（模拟）
            var mailboxCID = await GetMailboxCIDForUserAsync(userID);
          
     if (string.IsNullOrEmpty(mailboxCID))
                return null;

         if (!_ipfsStorage.TryGetValue(mailboxCID, out var data))
         return null;

      var json = Encoding.UTF8.GetString(data);
      var mailbox = JsonSerializer.Deserialize<Mailbox>(json);

            return mailbox;
        }

  /// <summary>
        /// 分片存储大型邮箱数据
   /// </summary>
        private async Task ShardAndStoreAsync(Mailbox mailbox, byte[] data)
        {
   var messagesPerShard = mailbox.StorageConfig.MessagesPerShard;
   var shardCIDs = new List<string>();

            // 按消息数量分片
     for (int i = 0; i < mailbox.InboxMessages.Count; i += messagesPerShard)
       {
     var shard = mailbox.InboxMessages.Skip(i).Take(messagesPerShard).ToList();
  var shardJson = JsonSerializer.Serialize(shard);
    var shardData = Encoding.UTF8.GetBytes(shardJson);
       
                var shardCID = await StoreDataToIPFSAsync(shardData);
   shardCIDs.Add(shardCID);
    }

   mailbox.StorageConfig.MailboxCID = string.Join(",", shardCIDs);
     }

        /// <summary>
     /// 备份消息到指定节点
        /// </summary>
        private async Task<string> BackupMessageToNodeAsync(Message message, string nodeCID)
        {
            // 序列化消息
            var json = JsonSerializer.Serialize(message);
          var data = Encoding.UTF8.GetBytes(json);

            // 存储到目标节点（模拟）
 var backupCID = $"backup_{nodeCID}_{message.MessageID}";
    _ipfsStorage[backupCID] = data;

            return await Task.FromResult(backupCID);
 }

  /// <summary>
     /// 存储数据到 IPFS
     /// </summary>
        private async Task<string> StoreDataToIPFSAsync(byte[] data)
        {
            var cid = $"bafk{Guid.NewGuid():N}";
  _ipfsStorage[cid] = data;
          return await Task.FromResult(cid);
        }

    /// <summary>
  /// 判断是否需要加密消息
        /// </summary>
   private async Task<bool> ShouldEncryptMessageAsync(string senderUserID, string receiverUserID)
  {
            // 默认加密所有私密消息
   return await Task.FromResult(true);
        }

        /// <summary>
      /// 加密消息内容
    /// </summary>
    private async Task<string> EncryptContentAsync(string content, string receiverUserID)
        {
    // 模拟加密（实际应使用接收方的公钥加密）
          var encrypted = Convert.ToBase64String(Encoding.UTF8.GetBytes(content));
            return await Task.FromResult($"encrypted_{encrypted}");
        }

        /// <summary>
 /// 解密消息内容
    /// </summary>
        private async Task<string> DecryptContentAsync(string encryptedContent, string userID)
      {
        // 模拟解密（实际应使用用户的私钥解密）
     if (encryptedContent.StartsWith("encrypted_"))
      {
            var base64 = encryptedContent.Substring("encrypted_".Length);
 var bytes = Convert.FromBase64String(base64);
                return await Task.FromResult(Encoding.UTF8.GetString(bytes));
      }
            return await Task.FromResult(encryptedContent);
  }

   /// <summary>
        /// 通知用户新消息
  /// </summary>
        private async Task NotifyNewMessageAsync(string userID, Message message)
        {
     // 实际应发送推送通知或 WebSocket 消息
      await Task.CompletedTask;
        }

        /// <summary>
   /// 获取用户的节点 CID
      /// </summary>
        private async Task<string> GetNodeCIDForUserAsync(string userID)
        {
     // 从路由器获取 CID
    var cid = await _router.GetCIDForUserAsync(userID);
            return cid ?? $"bafk{userID.GetHashCode():X8}node";
        }

      /// <summary>
        /// 获取用户的邮箱 CID
        /// </summary>
        private async Task<string?> GetMailboxCIDForUserAsync(string userID)
        {
      // 从用户配置或索引中查找
       return await Task.FromResult<string?>(null);
        }

        /// <summary>
        /// 获取会话历史 CID 列表
        /// </summary>
    private async Task<List<string>> GetConversationHistoryCIDsAsync(string conversationID)
        {
            // 从 IPFS 加载会话的消息 CID 列表
     return await Task.FromResult(new List<string>());
        }

        /// <summary>
        /// 获取消息同步状态
      /// </summary>
        public async Task<MessageSyncStatus> GetSyncStatusAsync(string userID)
        {
            var mailbox = await GetMailboxAsync(userID);

            var status = new MessageSyncStatus
            {
       UserID = userID,
      LastSyncTime = mailbox.LastSyncTime,
         PendingUploadCount = mailbox.SentMessages.Count(m => 
      m.Status == MessageStatus.Sending || m.Status == MessageStatus.Failed),
       PendingDownloadCount = 0,  // 需要从远程检查
       IsSyncing = false,
      SyncProgress = 1.0
   };

       return status;
        }

        /// <summary>
        /// 清理缓存
 /// </summary>
     public void ClearCache()
    {
            _mailboxCache.Clear();
        }
    }
}
