using System;
using System.Collections.Generic;

namespace LibMetaJade.Network
{
    /// <summary>
    /// 社交关系类型
    /// </summary>
    public enum SocialRelationType
    {
        Friend,   // 好友
        Follower,      // 关注者
        Following,     // 正在关注
        Blocked,       // 已屏蔽
        Trusted    // 信任用户
    }

    /// <summary>
    /// 社交关系信息
    /// </summary>
    public class SocialRelation
    {
        public string TargetUserID { get; set; } = string.Empty;
        public SocialRelationType RelationType { get; set; }
        public double Intimacy { get; set; }  // 亲密度 (0.0-1.0)
        public DateTimeOffset EstablishedAt { get; set; }
        public int InteractionCount { get; set; }  // 互动次数
        public DateTimeOffset LastInteraction { get; set; }
    }

    /// <summary>
    /// 社交用户信息
    /// </summary>
    public class SocialUserInfo
    {
        public string UserID { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? NodeCID { get; set; }  // 关联的 P2P 节点 CID

        // 社交关系
        public List<SocialRelation> Relations { get; set; } = new();

        // 社交统计
        public int FriendsCount { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }

        // 社交信任度
        public double SocialTrustScore { get; set; }  // 基于社交行为的信任度
        public int ReputationPoints { get; set; }      // 声望值

        // 内容统计
        public int PostsCount { get; set; }
        public int LikesReceived { get; set; }
        public int SharesReceived { get; set; }

        // 账号信息
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset LastActiveAt { get; set; }
        public bool IsVerified { get; set; }
        public bool IsInfluencer { get; set; }
    }

    /// <summary>
    /// 社交路径
    /// </summary>
    public class SocialPath
    {
        public List<string> UserIDs { get; set; } = new();
        public int Degrees => UserIDs.Count - 1;  // 度数（跳数）
        public double AverageSocialTrust { get; set; }
        public double TotalIntimacy { get; set; }
        public List<SocialRelationType> RelationTypes { get; set; } = new();

        // 路径特征
        public bool HasInfluencer { get; set; }
        public bool AllVerifiedUsers { get; set; }
        public int TotalInteractions { get; set; }
    }
}
