using System;
using System.Collections.Generic;

namespace LibMetaJade.Network
{
    /// <summary>
  /// 混合节点信息 - 同时包含 P2P 物理连接和 SNS 社交关系
    /// </summary>
  public class HybridNodeInfo
    {
   // === P2P 物理层 ===
        public string CID { get; set; } = string.Empty;
        public List<string> ConnectedNodes { get; set; } = new();  // P2P 网络物理连接
        public double NetworkTrustScore { get; set; }  // 网络信任度（基于交易历史）
        public DateTimeOffset LastActive { get; set; }
        public int TransactionCount { get; set; }
        
        // === SNS 社交层 ===
  public string? UserID { get; set; }              // 关联的社交用户ID
        public string? Username { get; set; }     // 用户名
      public List<SocialRelation> SocialRelations { get; set; } = new();  // 社交关系
        public double SocialTrustScore { get; set; }         // 社交信任度
        public int ReputationPoints { get; set; }        // 声望值
      
        // === 混合特征 ===
  public bool IsHybridNode => !string.IsNullOrEmpty(UserID);  // 是否为混合节点
 public double HybridTrustScore => CalculateHybridTrust();    // 综合信任度
  
        /// <summary>
  /// 计算综合信任度（网络信任 + 社交信任）
        /// </summary>
     private double CalculateHybridTrust()
        {
            if (!IsHybridNode)
 return NetworkTrustScore;  // 纯P2P节点只有网络信任度
   
            // 混合节点：70% 网络信任 + 30% 社交信任
       return NetworkTrustScore * 0.7 + SocialTrustScore * 0.3;
   }
   
        /// <summary>
        /// 获取所有相关节点（物理连接 + 社交关系映射）
 /// </summary>
        public List<string> GetAllRelatedCIDs()
        {
   var allCIDs = new HashSet<string>(ConnectedNodes);
            
 // 将社交关系映射到P2P节点CID（如果存在）
            foreach (var relation in SocialRelations)
            {
        // 这里需要查询社交用户关联的节点CID
      // 实际实现中应该从缓存或数据库查询
         // 示例：allCIDs.Add(GetCIDForUser(relation.TargetUserID));
      }
            
            return new List<string>(allCIDs);
 }
    }
}
