using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibMetaJade.Network;

namespace LibMetaJade.Messaging
{
    /// <summary>
    /// 消息备份管理器 - 基于 SNS 连接的分布式备份
    /// </summary>
    public class MessageBackupManager
    {
  private readonly DualLayerRouter _router;
   private readonly SocialRouter _socialRouter;
        private readonly Dictionary<string, MessageBackupInfo> _backupCache = new();

 public MessageBackupManager(DualLayerRouter router, SocialRouter socialRouter)
      {
       _router = router;
      _socialRouter = socialRouter;
        }

      /// <summary>
        /// 创建消息备份（根据 SNS 连接）
      /// </summary>
        public async Task<MessageBackupInfo> CreateBackupAsync(
     Message message,
       string senderUserID,
         string receiverUserID,
  int backupHops = 3)
  {
  backupHops = Math.Clamp(backupHops, 1, 6);  // 限制在 1-6 跳

     var backupInfo = new MessageBackupInfo
      {
       MessageID = message.MessageID,
       PrimaryStorageCID = message.ContentCID ?? string.Empty,
       BackupHops = backupHops,
       LastBackupTime = DateTimeOffset.UtcNow
 };

  // 查找 SNS 社交路径
     var socialPath = await _socialRouter.FindSocialPathAsync(senderUserID, receiverUserID);

            if (socialPath != null)
         {
     // 基于社交路径创建备份节点
       backupInfo.BackupNodes = await SelectBackupNodesFromPathAsync(
   socialPath,
  backupHops,
   message
      );
       }
    else
            {
       // 降级到物理路径
    var physicalPath = await _router.FindHybridPathAsync(
     senderUserID,
      receiverUserID,
          RoutingStrategy.PhysicalOnly
   );

         if (physicalPath?.PhysicalPath != null)
         {
   backupInfo.BackupNodes = await SelectBackupNodesFromPhysicalPathAsync(
    physicalPath.PhysicalPath,
         backupHops,
     message
      );
         }
       }

        // 计算备份完成率
       backupInfo.IsFullyReplicated = backupInfo.BackupNodes.Count >= backupHops;
       backupInfo.ReplicationRatio = backupHops > 0 
  ? (double)backupInfo.BackupNodes.Count / backupHops 
     : 1.0;

        _backupCache[message.MessageID] = backupInfo;
       return backupInfo;
 }

        /// <summary>
  /// 从社交路径选择备份节点
/// </summary>
        private async Task<List<BackupNode>> SelectBackupNodesFromPathAsync(
  SocialPath socialPath,
     int backupHops,
Message message)
        {
       var backupNodes = new List<BackupNode>();
   var selectedUserIDs = new HashSet<string>();

  // 优先选择高信任度的用户
 var sortedUsers = socialPath.UserIDs
       .Select((userID, index) => new { UserID = userID, Index = index })
          .OrderBy(x => x.Index)  // 按路径顺序
  .Take(backupHops * 2)  // 多选一些候选
         .ToList();

  foreach (var user in sortedUsers)
      {
     if (backupNodes.Count >= backupHops)
      break;

   if (selectedUserIDs.Contains(user.UserID))
       continue;

   // 获取用户的社交信任度
   var trustScore = await _socialRouter.CalculateSocialTrustAsync(user.UserID, user.Index);

  // 获取用户关联的节点 CID
var nodeCID = await GetNodeCIDForUserAsync(user.UserID);

   if (string.IsNullOrEmpty(nodeCID))
     continue;

       // 创建备份节点
    var backupNode = new BackupNode
     {
      NodeCID = nodeCID,
         UserID = user.UserID,
  HopDistance = user.Index + 1,
     BackupDataCID = $"backup_{nodeCID}_{message.MessageID}",
        BackupTime = DateTimeOffset.UtcNow,
  IsHealthy = true,
TrustScore = trustScore
      };

       backupNodes.Add(backupNode);
 selectedUserIDs.Add(user.UserID);
      }

 // 按信任度排序
            backupNodes = backupNodes.OrderByDescending(n => n.TrustScore).ToList();

      return backupNodes;
        }

        /// <summary>
/// 从物理路径选择备份节点
  /// </summary>
    private async Task<List<BackupNode>> SelectBackupNodesFromPhysicalPathAsync(
    RoutePath physicalPath,
    int backupHops,
     Message message)
  {
      var backupNodes = new List<BackupNode>();

            // 从物理路径选择节点
        for (int i = 0; i < Math.Min(backupHops, physicalPath.NodeCIDs.Count); i++)
   {
  var nodeCID = physicalPath.NodeCIDs[i];

        // 计算节点信任度
    var trustScore = await CalculateNodeTrustAsync(nodeCID, i);

       var backupNode = new BackupNode
   {
   NodeCID = nodeCID,
   UserID = null,  // 物理节点可能没有关联用户
  HopDistance = i + 1,
     BackupDataCID = $"backup_{nodeCID}_{message.MessageID}",
      BackupTime = DateTimeOffset.UtcNow,
    IsHealthy = true,
       TrustScore = trustScore
            };

     backupNodes.Add(backupNode);
            }

  return backupNodes;
     }

     /// <summary>
        /// 验证备份完整性
        /// </summary>
   public async Task<bool> VerifyBackupIntegrityAsync(string messageID)
 {
     if (!_backupCache.TryGetValue(messageID, out var backupInfo))
      return false;

            int healthyNodes = 0;

     foreach (var node in backupInfo.BackupNodes)
            {
   // 检查节点健康状态
    var isHealthy = await CheckNodeHealthAsync(node.NodeCID);
       
    if (isHealthy)
     {
       healthyNodes++;
      node.IsHealthy = true;
      }
    else
     {
  node.IsHealthy = false;
   }
   }

       // 至少一半节点健康即认为备份完整
     var minHealthyNodes = Math.Max(1, backupInfo.BackupHops / 2);
            return healthyNodes >= minHealthyNodes;
   }

 /// <summary>
   /// 恢复消息（从备份节点）
    /// </summary>
        public async Task<Message?> RestoreMessageAsync(string messageID)
  {
   if (!_backupCache.TryGetValue(messageID, out var backupInfo))
          return null;

          // 按信任度和健康状态排序备份节点
       var sortedNodes = backupInfo.BackupNodes
   .Where(n => n.IsHealthy)
  .OrderByDescending(n => n.TrustScore)
       .ThenBy(n => n.HopDistance)
    .ToList();

     foreach (var node in sortedNodes)
   {
      try
   {
       // 尝试从节点恢复消息
     var message = await LoadMessageFromNodeAsync(node.BackupDataCID);
          if (message != null)
     return message;
     }
       catch
         {
    // 标记节点不健康
         node.IsHealthy = false;
     }
}

         return null;
   }

  /// <summary>
   /// 调整备份跳数（动态扩展或收缩）
        /// </summary>
  public async Task<MessageBackupInfo> AdjustBackupHopsAsync(
    string messageID,
       int newBackupHops,
       Message message)
   {
     newBackupHops = Math.Clamp(newBackupHops, 1, 6);

     if (!_backupCache.TryGetValue(messageID, out var backupInfo))
            {
       throw new InvalidOperationException($"Backup info not found for message {messageID}");
       }

       var currentHops = backupInfo.BackupHops;

       if (newBackupHops > currentHops)
       {
                // 扩展备份：添加更多备份节点
       var additionalHops = newBackupHops - currentHops;
      var socialPath = await _socialRouter.FindSocialPathAsync(
              message.SenderUserID,
     message.ReceiverUserID
   );

    if (socialPath != null)
          {
        var newNodes = await SelectBackupNodesFromPathAsync(
       socialPath,
     additionalHops,
     message
              );

            // 排除已存在的节点
     var existingNodeCIDs = new HashSet<string>(
  backupInfo.BackupNodes.Select(n => n.NodeCID)
   );

            var uniqueNewNodes = newNodes
      .Where(n => !existingNodeCIDs.Contains(n.NodeCID))
             .ToList();

     backupInfo.BackupNodes.AddRange(uniqueNewNodes);
    }
            }
       else if (newBackupHops < currentHops)
  {
       // 收缩备份：移除部分备份节点（保留高信任度节点）
       backupInfo.BackupNodes = backupInfo.BackupNodes
.OrderByDescending(n => n.TrustScore)
        .Take(newBackupHops)
          .ToList();
          }

backupInfo.BackupHops = newBackupHops;
     backupInfo.LastBackupTime = DateTimeOffset.UtcNow;
     backupInfo.IsFullyReplicated = backupInfo.BackupNodes.Count >= newBackupHops;
   backupInfo.ReplicationRatio = newBackupHops > 0 
     ? (double)backupInfo.BackupNodes.Count / newBackupHops 
  : 1.0;

            return backupInfo;
 }

   /// <summary>
        /// 获取备份统计信息
        /// </summary>
     public async Task<Dictionary<string, object>> GetBackupStatisticsAsync(string userID)
        {
            var userBackups = _backupCache.Values
      .Where(b => b.PrimaryStorageCID.Contains(userID))
       .ToList();

            var stats = new Dictionary<string, object>
            {
     ["total_backups"] = userBackups.Count,
     ["fully_replicated"] = userBackups.Count(b => b.IsFullyReplicated),
 ["average_replication_ratio"] = userBackups.Any() 
      ? userBackups.Average(b => b.ReplicationRatio) 
      : 0.0,
       ["average_backup_hops"] = userBackups.Any() 
     ? userBackups.Average(b => b.BackupHops) 
     : 0.0,
 ["total_backup_nodes"] = userBackups.Sum(b => b.BackupNodes.Count),
       ["healthy_nodes"] = userBackups.Sum(b => b.BackupNodes.Count(n => n.IsHealthy)),
       ["backup_distribution"] = CalculateBackupDistribution(userBackups)
      };

            return await Task.FromResult(stats);
        }

   /// <summary>
        /// 计算备份分布（按跳数）
        /// </summary>
        private Dictionary<int, int> CalculateBackupDistribution(List<MessageBackupInfo> backups)
  {
 var distribution = new Dictionary<int, int>();

     foreach (var backup in backups)
      {
    foreach (var node in backup.BackupNodes)
       {
         if (!distribution.ContainsKey(node.HopDistance))
           distribution[node.HopDistance] = 0;

      distribution[node.HopDistance]++;
         }
            }

    return distribution;
        }

   /// <summary>
   /// 自动备份策略推荐
/// </summary>
     public async Task<int> RecommendBackupHopsAsync(Message message)
  {
   // 根据消息重要性和优先级推荐备份跳数

         var baseHops = message.Priority switch
       {
       MessagePriority.Urgent => 6,
       MessagePriority.High => 4,
       MessagePriority.Normal => 3,
  MessagePriority.Low => 2,
             _ => 3
         };

     // 根据消息类型调整
     var typeAdjustment = message.Type switch
       {
           MessageType.Transaction => 2,  // 交易消息增加备份
    MessageType.File => 1,
  MessageType.SystemNotice => 1,
       _ => 0
       };

  var recommendedHops = baseHops + typeAdjustment;
   return await Task.FromResult(Math.Clamp(recommendedHops, 1, 6));
    }

        /// <summary>
 /// 清理过期备份
        /// </summary>
        public async Task CleanupExpiredBackupsAsync(int retentionDays = 365)
     {
       var expiryDate = DateTimeOffset.UtcNow.AddDays(-retentionDays);
 var expiredBackups = _backupCache.Values
       .Where(b => b.LastBackupTime < expiryDate)
       .ToList();

          foreach (var backup in expiredBackups)
     {
  _backupCache.Remove(backup.MessageID);
  }

      await Task.CompletedTask;
  }

   /// <summary>
     /// 计算节点信任度
        /// </summary>
        private async Task<double> CalculateNodeTrustAsync(string nodeCID, int hopDistance)
        {
       // 基础信任度
    double baseTrust = 0.7;

 // 距离衰减
  double distancePenalty = Math.Pow(0.9, hopDistance);

  return await Task.FromResult(baseTrust * distancePenalty);
     }

   /// <summary>
        /// 检查节点健康状态
        /// </summary>
      private async Task<bool> CheckNodeHealthAsync(string nodeCID)
  {
 // 模拟健康检查（实际应 ping 节点或检查最近活跃时间）
  return await Task.FromResult(true);
   }

     /// <summary>
        /// 从节点加载消息
        /// </summary>
   private async Task<Message?> LoadMessageFromNodeAsync(string backupCID)
      {
     // 模拟从备份节点加载（实际应从 IPFS 或 P2P 网络加载）
   return await Task.FromResult<Message?>(null);
        }

        /// <summary>
   /// 获取用户的节点 CID
     /// </summary>
        private async Task<string?> GetNodeCIDForUserAsync(string userID)
        {
       return await _router.GetCIDForUserAsync(userID);
      }

        /// <summary>
        /// 清理缓存
  /// </summary>
        public void ClearCache()
  {
   _backupCache.Clear();
        }
    }
}
