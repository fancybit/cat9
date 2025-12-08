using System;
using System.Collections.Generic;
using System.Linq;

namespace LibMetaJade.Network
{
    /// <summary>
    /// 社交信任计算器 - 基于多维度指标计算社交信任度
/// </summary>
    public class SocialTrustCalculator
    {
        /// <summary>
      /// 计算用户的综合社交信任度
        /// </summary>
        public double CalculateComprehensiveTrust(SocialUserInfo user)
    {
    double accountAgeTrust = CalculateAccountAgeTrust(user);
     double reputationTrust = CalculateReputationTrust(user);
       double activityTrust = CalculateActivityTrust(user);
       double connectivityTrust = CalculateConnectivityTrust(user);
            double contentTrust = CalculateContentTrust(user);
            double verificationTrust = CalculateVerificationTrust(user);

            // 加权平均
       return accountAgeTrust * 0.10 +
        reputationTrust * 0.25 +
       activityTrust * 0.15 +
      connectivityTrust * 0.15 +
      contentTrust * 0.20 +
    verificationTrust * 0.15;
        }

        /// <summary>
  /// 计算账号年龄信任度
        /// </summary>
   private double CalculateAccountAgeTrust(SocialUserInfo user)
        {
 var accountAge = (DateTimeOffset.UtcNow - user.CreatedAt).TotalDays;
         
            if (accountAge < 30) return 0.3;
 if (accountAge < 180) return 0.3 + (accountAge - 30) / 150 * 0.3;
       if (accountAge < 730) return 0.6 + (accountAge - 180) / 550 * 0.3;
            return 0.9;
     }

        /// <summary>
/// 计算声望信任度
 /// </summary>
        private double CalculateReputationTrust(SocialUserInfo user)
        {
            return Math.Min(1.0, user.ReputationPoints / 10000.0);
        }

  /// <summary>
        /// 计算活跃度信任度
    /// </summary>
      private double CalculateActivityTrust(SocialUserInfo user)
        {
            var hoursSinceActive = (DateTimeOffset.UtcNow - user.LastActiveAt).TotalHours;
      
       if (hoursSinceActive < 1) return 1.0;
            if (hoursSinceActive < 24) return 0.8;
       if (hoursSinceActive < 168) return 0.6;
      return Math.Max(0.2, 0.6 - (hoursSinceActive - 168) / 720 * 0.4);
     }

   /// <summary>
   /// 计算连接度信任度
    /// </summary>
        private double CalculateConnectivityTrust(SocialUserInfo user)
        {
    if (user.FriendsCount < 5) return 0.3;
     if (user.FriendsCount > 1000) return 0.6;
            return 0.3 + Math.Min(0.7, user.FriendsCount / 500.0 * 0.7);
        }

        /// <summary>
   /// 计算内容信任度
  /// </summary>
        private double CalculateContentTrust(SocialUserInfo user)
        {
    double engagementRate = user.PostsCount > 0 
          ? (double)(user.LikesReceived + user.SharesReceived) / user.PostsCount 
  : 0;
            return Math.Min(1.0, engagementRate / 100.0);
     }

   /// <summary>
        /// 计算验证状态信任度
        /// </summary>
        private double CalculateVerificationTrust(SocialUserInfo user)
        {
  double trust = 0.5;
            if (user.IsVerified) trust += 0.3;
            if (user.IsInfluencer) trust += 0.2;
   return Math.Min(1.0, trust);
        }

        /// <summary>
        /// 计算两个用户之间的关系亲密度
     /// </summary>
        public double CalculateIntimacy(SocialUserInfo user1, SocialUserInfo user2)
        {
       var relation1 = user1.Relations.FirstOrDefault(r => r.TargetUserID == user2.UserID);
            var relation2 = user2.Relations.FirstOrDefault(r => r.TargetUserID == user1.UserID);

    if (relation1 == null && relation2 == null) return 0.0;

      // 双向好友
            if (relation1?.RelationType == SocialRelationType.Friend && 
       relation2?.RelationType == SocialRelationType.Friend)
        {
        var avgIntimacy = ((relation1?.Intimacy ?? 0) + (relation2?.Intimacy ?? 0)) / 2;
          var avgInteractions = ((relation1?.InteractionCount ?? 0) + (relation2?.InteractionCount ?? 0)) / 2;
            return avgIntimacy * Math.Min(1.2, 1.0 + avgInteractions / 1000.0);
 }

var singleRelation = relation1 ?? relation2;
            return (singleRelation?.Intimacy ?? 0) * 0.7;
        }

        /// <summary>
        /// 计算社交路径的总体信任度
     /// </summary>
      public double CalculatePathTrust(SocialPath path, Dictionary<string, SocialUserInfo> userCache)
        {
            if (path.UserIDs.Count == 0) return 0.0;

            double totalTrust = 0;
            double totalIntimacy = 0;
     int validSteps = 0;

          for (int i = 0; i < path.UserIDs.Count; i++)
{
   if (userCache.TryGetValue(path.UserIDs[i], out var user))
             {
      totalTrust += CalculateComprehensiveTrust(user);
     
 if (i < path.UserIDs.Count - 1 && userCache.TryGetValue(path.UserIDs[i + 1], out var nextUser))
       {
             totalIntimacy += CalculateIntimacy(user, nextUser);
              validSteps++;
     }
        }
            }

          double avgUserTrust = totalTrust / path.UserIDs.Count;
         double avgIntimacy = validSteps > 0 ? totalIntimacy / validSteps : 0;
      return avgUserTrust * 0.7 + avgIntimacy * 0.3;
        }

        /// <summary>
        /// 评估路径的可信度等级
        /// </summary>
   public string EvaluatePathTrustLevel(double trustScore)
   {
    return trustScore switch
    {
                >= 0.9 => "极高可信（Excellent）",
         >= 0.75 => "高可信（Good）",
   >= 0.6 => "中等可信（Fair）",
 >= 0.4 => "较低可信（Low）",
         _ => "不可信（Untrusted）"
       };
        }

        /// <summary>
        /// 推荐信任增强策略
        /// </summary>
 public List<string> RecommendTrustEnhancement(SocialUserInfo user)
   {
   var recommendations = new List<string>();
            
            if (!user.IsVerified)
    recommendations.Add("建议进行身份认证，可提升 30% 信任度");

        if (user.FriendsCount < 10)
            recommendations.Add("建议添加更多好友关系，当前好友数较少");
            
            var daysSinceActive = (DateTimeOffset.UtcNow - user.LastActiveAt).TotalDays;
         if (daysSinceActive > 7)
     recommendations.Add($"建议提高活跃度，已 {daysSinceActive:F0} 天未活跃");

   if (user.ReputationPoints < 1000)
      recommendations.Add("建议提升声望值，可通过高质量内容和互动获得");

      if (user.PostsCount > 0)
            {
           double engagementRate = (double)(user.LikesReceived + user.SharesReceived) / user.PostsCount;
     if (engagementRate < 10)
        recommendations.Add("建议提高内容质量，当前参与度较低");
   }

      return recommendations;
      }
    }
}
