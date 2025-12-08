using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibMetaJade.Network
{
    /// <summary>
    /// 路由策略
    /// </summary>
    public enum RoutingStrategy
    {
        PhysicalOnly,      // 仅物理路由（最快）
        SocialOnly,    // 仅社交路由（最可信）
        HybridBalanced,    // 混合平衡（综合考虑）
        AdaptiveOptimal  // 自适应最优（根据场景选择）
    }

    /// <summary>
    /// 混合路径结果
    /// </summary>
    public class HybridRoutePath
    {
        public RoutePath? PhysicalPath { get; set; }
        public SocialPath? SocialPath { get; set; }
     public RoutingStrategy UsedStrategy { get; set; }
 
        public int TotalHops => PhysicalPath?.Hops ?? SocialPath?.Degrees ?? 0;
 public double TotalTrust { get; set; }
        public double EstimatedLatency { get; set; }
   
        public string PathDescription { get; set; } = string.Empty;
        public bool IsTrusted { get; set; }
        public bool IsFast { get; set; }
    }

    /// <summary>
    /// 双层路由器 - 整合物理路由和社交路由
    /// </summary>
    public class DualLayerRouter
    {
        private readonly SixDegreeRouter _physicalRouter;
        private readonly SocialRouter _socialRouter;
        private readonly Dictionary<string, HybridNodeInfo> _hybridCache = new();

    public DualLayerRouter()
        {
  _physicalRouter = new SixDegreeRouter();
      _socialRouter = new SocialRouter();
        }

     public DualLayerRouter(SixDegreeRouter physicalRouter, SocialRouter socialRouter)
  {
  _physicalRouter = physicalRouter;
            _socialRouter = socialRouter;
        }

        /// <summary>
        /// 查找混合路径（根据策略自动选择最优路径）
  /// </summary>
        public async Task<HybridRoutePath?> FindHybridPathAsync(
            string fromIdentifier, 
          string toIdentifier, 
   RoutingStrategy strategy = RoutingStrategy.AdaptiveOptimal,
bool requireTrust = false)
     {
            // 判断标识符类型（CID 还是 UserID）
          bool fromIsCID = IsCIDFormat(fromIdentifier);
     bool toIsCID = IsCIDFormat(toIdentifier);

    // 根据策略选择路径
    return strategy switch
         {
          RoutingStrategy.PhysicalOnly => await FindPhysicalOnlyPathAsync(fromIdentifier, toIdentifier, fromIsCID, toIsCID),
                RoutingStrategy.SocialOnly => await FindSocialOnlyPathAsync(fromIdentifier, toIdentifier, fromIsCID, toIsCID),
    RoutingStrategy.HybridBalanced => await FindBalancedHybridPathAsync(fromIdentifier, toIdentifier, fromIsCID, toIsCID, requireTrust),
       RoutingStrategy.AdaptiveOptimal => await FindAdaptiveOptimalPathAsync(fromIdentifier, toIdentifier, fromIsCID, toIsCID, requireTrust),
    _ => null
            };
        }

        /// <summary>
        /// 仅物理路径（最快）
        /// </summary>
  private async Task<HybridRoutePath?> FindPhysicalOnlyPathAsync(
        string from, string to, bool fromIsCID, bool toIsCID)
     {
            var fromCID = fromIsCID ? from : await GetCIDForUserAsync(from);
        var toCID = toIsCID ? to : await GetCIDForUserAsync(to);

 if (string.IsNullOrEmpty(fromCID) || string.IsNullOrEmpty(toCID))
          return null;

          var physicalPath = await _physicalRouter.FindShortestPathAsync(fromCID, toCID);

            if (physicalPath == null)
          return null;

            return new HybridRoutePath
            {
          PhysicalPath = physicalPath,
      UsedStrategy = RoutingStrategy.PhysicalOnly,
      TotalTrust = physicalPath.TotalTrustScore,
  EstimatedLatency = physicalPath.AverageLatency,
             PathDescription = $"物理路径 ({physicalPath.Hops} 跳)",
      IsFast = true,
          IsTrusted = physicalPath.TotalTrustScore > 0.6
         };
      }

        /// <summary>
        /// 仅社交路径（最可信）
        /// </summary>
  private async Task<HybridRoutePath?> FindSocialOnlyPathAsync(
            string from, string to, bool fromIsCID, bool toIsCID)
        {
            var fromUserID = fromIsCID ? await GetUserIDForCIDAsync(from) : from;
            var toUserID = toIsCID ? await GetUserIDForCIDAsync(to) : to;

            if (string.IsNullOrEmpty(fromUserID) || string.IsNullOrEmpty(toUserID))
  return null;

            var socialPath = await _socialRouter.FindTrustedSocialPathAsync(fromUserID, toUserID);

            if (socialPath == null)
                return null;

            return new HybridRoutePath
        {
 SocialPath = socialPath,
      UsedStrategy = RoutingStrategy.SocialOnly,
   TotalTrust = socialPath.AverageSocialTrust,
     EstimatedLatency = socialPath.Degrees * 100,  // 社交路径延迟较高
     PathDescription = $"社交路径 ({socialPath.Degrees} 度){(socialPath.HasInfluencer ? ", 含影响力用户" : "")}",
     IsFast = false,
      IsTrusted = socialPath.AverageSocialTrust > 0.7
            };
        }

        /// <summary>
        /// 平衡混合路径（综合考虑速度和信任）
        /// </summary>
        private async Task<HybridRoutePath?> FindBalancedHybridPathAsync(
            string from, string to, bool fromIsCID, bool toIsCID, bool requireTrust)
        {
// 并行查找两种路径
   var physicalTask = FindPhysicalOnlyPathAsync(from, to, fromIsCID, toIsCID);
            var socialTask = FindSocialOnlyPathAsync(from, to, fromIsCID, toIsCID);

            await Task.WhenAll(physicalTask, socialTask);

          var physicalResult = await physicalTask;
    var socialResult = await socialTask;

            // 如果只有一种路径可用
     if (physicalResult == null) return socialResult;
   if (socialResult == null) return physicalResult;

     // 综合评分：速度 40% + 信任度 60%
double physicalScore = (1.0 / (physicalResult.EstimatedLatency / 100)) * 0.4 + physicalResult.TotalTrust * 0.6;
            double socialScore = (1.0 / (socialResult.EstimatedLatency / 100)) * 0.4 + socialResult.TotalTrust * 0.6;

       // 如果要求高信任度，优先选择社交路径
 if (requireTrust && socialResult.TotalTrust > physicalResult.TotalTrust + 0.1)
        return socialResult;

          // 选择综合评分更高的路径
 var selectedResult = physicalScore >= socialScore ? physicalResult : socialResult;
        selectedResult.UsedStrategy = RoutingStrategy.HybridBalanced;
       return selectedResult;
        }

        /// <summary>
        /// 自适应最优路径（根据场景智能选择）
  /// </summary>
  private async Task<HybridRoutePath?> FindAdaptiveOptimalPathAsync(
   string from, string to, bool fromIsCID, bool toIsCID, bool requireTrust)
  {
   // 并行查找两种路径
            var physicalTask = FindPhysicalOnlyPathAsync(from, to, fromIsCID, toIsCID);
            var socialTask = FindSocialOnlyPathAsync(from, to, fromIsCID, toIsCID);

    await Task.WhenAll(physicalTask, socialTask);

 var physicalResult = await physicalTask;
  var socialResult = await socialTask;

     // 场景1：高安全需求（版权、账户转移等）
            if (requireTrust)
            {
         // 优先选择高信任度的社交路径
     if (socialResult != null && socialResult.TotalTrust > 0.75)
          {
  socialResult.UsedStrategy = RoutingStrategy.AdaptiveOptimal;
             socialResult.PathDescription += " (高信任场景)";
     return socialResult;
     }
  }

        // 场景2：快速传输需求（数据同步、区块广播）
   if (physicalResult != null && physicalResult.EstimatedLatency < 200)
         {
      physicalResult.UsedStrategy = RoutingStrategy.AdaptiveOptimal;
    physicalResult.PathDescription += " (快速传输)";
  return physicalResult;
     }

 // 场景3：平衡选择
    return await FindBalancedHybridPathAsync(from, to, fromIsCID, toIsCID, requireTrust);
    }
        
        /// <summary>
        /// 根据 UserID 获取对应的节点 CID（公开方法）
   /// </summary>
        public async Task<string?> GetCIDForUserAsync(string userID)
    {
 // 从混合缓存查找
 var hybridNode = _hybridCache.Values.FirstOrDefault(n => n.UserID == userID);
    if (hybridNode != null)
         return hybridNode.CID;

            // 模拟查询：实际应从数据库或P2P网络查询
 var hash = userID.GetHashCode();
        if (hash < 0) hash = -hash;
   var nodeNum = hash % 10000;
        return await Task.FromResult($"bafk{nodeNum:D4}node{nodeNum:D4}");
        }

    /// <summary>
        /// 根据节点 CID 获取关联的 UserID
        /// </summary>
        private async Task<string?> GetUserIDForCIDAsync(string cid)
        {
    // 从混合缓存查找
  if (_hybridCache.TryGetValue(cid, out var hybridNode))
         return hybridNode.UserID;

            // 模拟查询：实际应从数据库查询
    var match = System.Text.RegularExpressions.Regex.Match(cid, @"bafk(\d{4})node(\d{4})");
    if (match.Success && int.TryParse(match.Groups[1].Value, out var num))
  {
                return await Task.FromResult($"user_{num:D5}");
            }

      return null;
      }

        /// <summary>
        /// 判断是否为 CID 格式
        /// </summary>
        private bool IsCIDFormat(string identifier)
        {
         return identifier.StartsWith("bafk");
        }

      /// <summary>
        /// 注册混合节点（建立 UserID 和 CID 的映射）
  /// </summary>
        public void RegisterHybridNode(HybridNodeInfo node)
        {
            if (!string.IsNullOrEmpty(node.CID))
          {
      _hybridCache[node.CID] = node;
     }
        }

   /// <summary>
        /// 获取路径统计信息
        /// </summary>
 public async Task<Dictionary<string, object>> GetPathStatisticsAsync(string from, string to)
   {
        var physicalPath = await FindPhysicalOnlyPathAsync(from, to, IsCIDFormat(from), IsCIDFormat(to));
   var socialPath = await FindSocialOnlyPathAsync(from, to, IsCIDFormat(from), IsCIDFormat(to));

    return new Dictionary<string, object>
            {
     ["physical_hops"] = physicalPath?.TotalHops ?? -1,
    ["physical_trust"] = physicalPath?.TotalTrust ?? 0,
      ["physical_latency"] = physicalPath?.EstimatedLatency ?? 0,
   ["social_degrees"] = socialPath?.TotalHops ?? -1,
           ["social_trust"] = socialPath?.TotalTrust ?? 0,
       ["social_has_influencer"] = socialPath?.SocialPath?.HasInfluencer ?? false,
    ["social_all_verified"] = socialPath?.SocialPath?.AllVerifiedUsers ?? false,
        ["both_available"] = physicalPath != null && socialPath != null
      };
        }

        /// <summary>
  /// 清理缓存
        /// </summary>
   public void ClearCache()
        {
      _physicalRouter.ClearCache();
 _socialRouter.ClearCache();
          _hybridCache.Clear();
        }
    }
}
