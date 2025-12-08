using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibMetaJade.Network
{
    /// <summary>
    /// 社交路由器 - 基于社交关系的六度查找
    /// </summary>
    public class SocialRouter
    {
private readonly Dictionary<string, SocialUserInfo> _userCache = new();
  private const int MaxSocialDegrees = 6;// 六度分隔

        /// <summary>
     /// 查找两个用户之间的社交路径（BFS算法）
   /// </summary>
        public async Task<SocialPath?> FindSocialPathAsync(string fromUserID, string toUserID)
        {
            if (fromUserID == toUserID)
  return new SocialPath { UserIDs = new() { fromUserID } };

            // 广度优先搜索
       var visited = new HashSet<string>();
       var queue = new Queue<(string userID, List<string> path, List<SocialRelationType> relations)>();
   queue.Enqueue((fromUserID, new List<string> { fromUserID }, new List<SocialRelationType>()));
visited.Add(fromUserID);

   int currentDegree = 0;
            
    while (queue.Count > 0 && currentDegree <= MaxSocialDegrees)
            {
          var levelSize = queue.Count;
       
       for (int i = 0; i < levelSize; i++)
         {
      var (currentUserID, path, relationTypes) = queue.Dequeue();
                
         // 获取当前用户的社交关系
       var relations = await GetSocialRelationsAsync(currentUserID);
  
       foreach (var relation in relations)
      {
        if (relation.TargetUserID == toUserID)
       {
         // 找到目标用户
    var finalPath = new List<string>(path) { relation.TargetUserID };
        var finalRelations = new List<SocialRelationType>(relationTypes) { relation.RelationType };
     return await BuildSocialPathAsync(finalPath, finalRelations);
    }

             if (!visited.Contains(relation.TargetUserID))
              {
     visited.Add(relation.TargetUserID);
              var newPath = new List<string>(path) { relation.TargetUserID };
       var newRelations = new List<SocialRelationType>(relationTypes) { relation.RelationType };
          queue.Enqueue((relation.TargetUserID, newPath, newRelations));
}
   }
       }
     
       currentDegree++;
    }

    return null;  // 未找到路径（超过6度）
        }

        /// <summary>
 /// 计算社交信任评分
    /// </summary>
        public async Task<double> CalculateSocialTrustAsync(string userID, int degrees)
        {
       var user = await GetUserInfoAsync(userID);
      if (user == null) return 0.0;

     // 基础信任分（0.0-0.4）
   double baseTrust = Math.Min(0.4, user.ReputationPoints * 0.0001);
       
         // 认证加成（0.0-0.2）
      double verificationBonus = user.IsVerified ? 0.2 : 0.0;
 
       // 影响力加成（0.0-0.15）
   double influencerBonus = user.IsInfluencer ? 0.15 : 0.0;
         
  // 活跃度加成（0.0-0.15）
 var daysSinceActive = (DateTimeOffset.UtcNow - user.LastActiveAt).TotalDays;
            double activityBonus = Math.Max(0, 0.15 - daysSinceActive * 0.01);
  
       // 社交连接度加成（0.0-0.1）
   double connectivityBonus = Math.Min(0.1, user.FriendsCount * 0.001);
 
      // 度数衰减（每度减少10%）
     double degreePenalty = Math.Pow(0.9, degrees);

       return (baseTrust + verificationBonus + influencerBonus + activityBonus + connectivityBonus) * degreePenalty;
 }

  /// <summary>
   /// 查找可信的社交路径（优先选择高信任度用户）
        /// </summary>
   public async Task<SocialPath?> FindTrustedSocialPathAsync(string fromUserID, string toUserID, double minTrustScore = 0.6)
        {
       var allPaths = await FindAllSocialPathsAsync(fromUserID, toUserID, maxDegrees: 4);
       
       if (allPaths == null || allPaths.Count == 0)
       return null;

       // 过滤并排序路径
       var trustedPaths = allPaths
       .Where(p => p.AverageSocialTrust >= minTrustScore)
             .OrderByDescending(p => p.AverageSocialTrust)
        .ThenBy(p => p.Degrees)
         .ToList();

   return trustedPaths.FirstOrDefault();
        }

 /// <summary>
        /// 查找所有可能的社交路径（限制深度）
        /// </summary>
        private async Task<List<SocialPath>> FindAllSocialPathsAsync(string fromUserID, string toUserID, int maxDegrees)
        {
        var allPaths = new List<SocialPath>();
var visited = new HashSet<string>();
    var currentPath = new List<string> { fromUserID };
      var currentRelations = new List<SocialRelationType>();

            await DFSFindPathsAsync(fromUserID, toUserID, currentPath, currentRelations, visited, allPaths, maxDegrees, 0);
            
 return allPaths;
        }

        private async Task DFSFindPathsAsync(
       string currentUserID,
  string targetUserID,
   List<string> currentPath,
            List<SocialRelationType> currentRelations,
     HashSet<string> visited,
            List<SocialPath> allPaths,
       int maxDegrees,
    int currentDegree)
        {
 if (currentDegree > maxDegrees) return;
if (currentUserID == targetUserID)
   {
  allPaths.Add(await BuildSocialPathAsync(currentPath, currentRelations));
        return;
  }

            visited.Add(currentUserID);

            var relations = await GetSocialRelationsAsync(currentUserID);
       foreach (var relation in relations)
    {
       if (!visited.Contains(relation.TargetUserID))
       {
       currentPath.Add(relation.TargetUserID);
  currentRelations.Add(relation.RelationType);
       
    await DFSFindPathsAsync(
            relation.TargetUserID, 
        targetUserID, 
     currentPath, 
               currentRelations, 
    visited, 
     allPaths, 
   maxDegrees, 
         currentDegree + 1);
    
     currentPath.RemoveAt(currentPath.Count - 1);
     currentRelations.RemoveAt(currentRelations.Count - 1);
         }
   }

            visited.Remove(currentUserID);
}

        /// <summary>
        /// 优化社交网络拓扑
 /// </summary>
 public async Task OptimizeSocialTopologyAsync()
        {
       var allUsers = _userCache.Values.ToList();
   
       // 识别影响力用户（粉丝数 > 平均值 * 5）
       var avgFollowers = allUsers.Average(u => u.FollowersCount);
   var influencers = allUsers
           .Where(u => u.FollowersCount > avgFollowers * 5 && u.SocialTrustScore > 0.8)
     .OrderByDescending(u => u.FollowersCount)
    .Take(20)
    .ToList();

    // 为孤立用户推荐关注影响力用户
     var isolatedUsers = allUsers
           .Where(u => u.FriendsCount < 5 && u.FollowingCount < 10)
     .ToList();

       foreach (var user in isolatedUsers)
            {
    // 推荐3个相关影响力用户
     var recommendations = influencers
       .Where(inf => !user.Relations.Any(r => r.TargetUserID == inf.UserID))
         .Take(3)
   .ToList();

                // 这里实际应该生成推荐，而不是直接添加关系
       // 仅作为示例展示逻辑
      }

            await Task.CompletedTask;
      }

     /// <summary>
        /// 获取用户信息（带缓存）
        /// </summary>
        private async Task<SocialUserInfo?> GetUserInfoAsync(string userID)
        {
    if (_userCache.TryGetValue(userID, out var cached))
            return cached;

  // 模拟实现：实际应从数据库或社交网络API获取
       var user = new SocialUserInfo
         {
       UserID = userID,
            Username = $"User_{userID[..8]}",
                NodeCID = $"bafk{GetDeterministicInt(userID, 1000, 9999):D4}node{GetDeterministicInt(userID, 0, 9999):D4}",
                Relations = GenerateSocialRelations(userID),
    FriendsCount = GetDeterministicInt(userID, 5, 500),
 FollowersCount = GetDeterministicInt(userID, 10, 10000),
       FollowingCount = GetDeterministicInt(userID, 10, 1000),
      SocialTrustScore = 0.5 + GetDeterministicDouble(userID) * 0.5,
        ReputationPoints = GetDeterministicInt(userID, 100, 10000),
           PostsCount = GetDeterministicInt(userID, 10, 1000),
    LikesReceived = GetDeterministicInt(userID, 50, 50000),
       SharesReceived = GetDeterministicInt(userID, 10, 5000),
       CreatedAt = DateTimeOffset.UtcNow.AddDays(-GetDeterministicInt(userID, 30, 1800)),
    LastActiveAt = DateTimeOffset.UtcNow.AddHours(-GetDeterministicInt(userID, 1, 72)),
  IsVerified = GetDeterministicDouble(userID) > 0.7,
     IsInfluencer = GetDeterministicDouble(userID) > 0.85
  };

            _userCache[userID] = user;
  return await Task.FromResult(user);
        }

        /// <summary>
  /// 获取用户的社交关系
 /// </summary>
      private async Task<List<SocialRelation>> GetSocialRelationsAsync(string userID)
      {
            var user = await GetUserInfoAsync(userID);
   return user?.Relations ?? new List<SocialRelation>();
  }

        /// <summary>
/// 构建社交路径对象
    /// </summary>
        private async Task<SocialPath> BuildSocialPathAsync(List<string> userPath, List<SocialRelationType> relationTypes)
        {
            double totalTrust = 0;
  double totalIntimacy = 0;
int totalInteractions = 0;
      bool hasInfluencer = false;
        bool allVerified = true;

         for (int i = 0; i < userPath.Count; i++)
{
         var user = await GetUserInfoAsync(userPath[i]);
           if (user != null)
          {
       var trustScore = await CalculateSocialTrustAsync(userPath[i], i);
      totalTrust += trustScore;
         
       if (user.IsInfluencer) hasInfluencer = true;
                if (!user.IsVerified) allVerified = false;

if (i < relationTypes.Count && i < userPath.Count - 1)
      {
    var relation = user.Relations.FirstOrDefault(r => r.TargetUserID == userPath[i + 1]);
  if (relation != null)
       {
      totalIntimacy += relation.Intimacy;
        totalInteractions += relation.InteractionCount;
       }
         }
  }
   }

        return new SocialPath
     {
        UserIDs = userPath,
   AverageSocialTrust = totalTrust / userPath.Count,
      TotalIntimacy = totalIntimacy,
       RelationTypes = relationTypes,
        HasInfluencer = hasInfluencer,
     AllVerifiedUsers = allVerified,
       TotalInteractions = totalInteractions
   };
   }

        /// <summary>
        /// 生成社交关系（模拟实现）
   /// </summary>
   private List<SocialRelation> GenerateSocialRelations(string baseUserID)
        {
      var relations = new List<SocialRelation>();
    var hash = GetDeterministicInt(baseUserID, 0, int.MaxValue);
      
            // 生成3-15个社交关系
            var relationCount = (hash % 13) + 3;
      
          for (int i = 0; i < relationCount; i++)
   {
                var targetUserID = $"user_{(hash + i * 12345) % 100000:D5}";
  var relationType = (SocialRelationType)((hash + i) % 3);  // Friend, Follower, Following
     
       relations.Add(new SocialRelation
            {
    TargetUserID = targetUserID,
        RelationType = relationType,
          Intimacy = GetDeterministicDouble($"{baseUserID}_{i}"),
      EstablishedAt = DateTimeOffset.UtcNow.AddDays(-GetDeterministicInt($"{baseUserID}_{i}", 1, 365)),
          InteractionCount = GetDeterministicInt($"{baseUserID}_{i}", 5, 500),
   LastInteraction = DateTimeOffset.UtcNow.AddHours(-GetDeterministicInt($"{baseUserID}_{i}", 1, 168))
        });
}
            
return relations;
        }

        /// <summary>
   /// 确定性随机数生成
        /// </summary>
  private int GetDeterministicInt(string seed, int min, int max)
        {
 var hash = seed.GetHashCode();
  if (hash < 0) hash = -hash;
     return min + (hash % (max - min));
        }

        private double GetDeterministicDouble(string seed)
  {
         var hash = seed.GetHashCode();
if (hash < 0) hash = -hash;
    return (hash % 10000) / 10000.0;
 }

        /// <summary>
      /// 清理缓存
  /// </summary>
   public void ClearCache()
   {
          _userCache.Clear();
   }
    }
}
