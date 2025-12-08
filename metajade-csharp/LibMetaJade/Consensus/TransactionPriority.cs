using System;

namespace LibMetaJade.Consensus
{
    /// <summary>
    /// 交易优先级等级，影响共识深度
    /// </summary>
    public enum TransactionPriority
    {
        /// <summary>普通交易，共识深度1-2层，动员30%-50%节点</summary>
        Low = 1,

        /// <summary>中等交易，共识深度2-3层，动员50%-60%节点</summary>
        Medium = 2,

        /// <summary>高价值交易，共识深度3-5层，动员60%-80%节点</summary>
        High = 3,

        /// <summary>核心资产交易，共识深度5层+，动员80%-100%节点</summary>
        Critical = 4
    }

    /// <summary>
    /// 数据敏感度等级
    /// </summary>
    public enum DataSensitivity
    {
        /// <summary>公开数据，如游戏排行榜</summary>
        Public = 0,

        /// <summary>普通数据，如游戏进度</summary>
        Normal = 1,

        /// <summary>敏感数据，如支付信息</summary>
        Sensitive = 2,

        /// <summary>核心隐私数据，如身份证明</summary>
        Critical = 3
    }

    /// <summary>
    /// 交易上下文信息，用于计算优先级和共识深度
    /// </summary>
    public class TransactionContext
    {
        /// <summary>交易金额（虚拟商品价值等）</summary>
        public decimal Amount { get; set; }

        /// <summary>数据敏感度</summary>
        public DataSensitivity Sensitivity { get; set; }

        /// <summary>当前网络负载（0.0-1.0）</summary>
        public double CurrentNetworkLoad { get; set; }

        /// <summary>交易类型（如：游戏道具、版权、账户转移等）</summary>
        public string TransactionType { get; set; } = "general";

        /// <summary>交易参与方的信任评级（0.0-1.0）</summary>
        public double ParticipantTrustScore { get; set; } = 0.5;

        /// <summary>是否为首次交易</summary>
        public bool IsFirstTransaction { get; set; }

        /// <summary>
        /// 根据上下文自动计算交易优先级
        /// </summary>
        public TransactionPriority Priority => CalculatePriority();

        private TransactionPriority CalculatePriority()
        {
            int score = 0;

            // 金额评分（0-3分）
            score += Amount switch
            {
                >= 10000 => 3,  // 高价值虚拟商品
                >= 1000 => 2,   // 中等价值
                >= 100 => 1,    // 低价值
                _ => 0
            };

            // 敏感度评分（0-3分）
            score += (int)Sensitivity;

            // 网络负载调整（负载高时降低优先级以保证吞吐量）
            if (CurrentNetworkLoad > 0.8 && score > 1)
                score -= 1;

            // 信任度调整（低信任用户提升验证等级）
            if (ParticipantTrustScore < 0.3)
                score += 1;

            // 首次交易提升验证等级
            if (IsFirstTransaction)
                score += 1;

            // 特殊交易类型
            if (TransactionType == "copyright" || TransactionType == "account_transfer")
                score += 2;

            // 映射到优先级（0-3 -> Low, 4-5 -> Medium, 6-7 -> High, 8+ -> Critical）
            return score switch
            {
                >= 8 => TransactionPriority.Critical,
                >= 6 => TransactionPriority.High,
                >= 4 => TransactionPriority.Medium,
                _ => TransactionPriority.Low
            };
        }

        /// <summary>
        /// 获取推荐的最小共识节点参与比例
        /// </summary>
        public double GetRecommendedNodeParticipationRatio()
        {
            return Priority switch
            {
                TransactionPriority.Critical => 0.8,  // 80%-100%
                TransactionPriority.High => 0.6,      // 60%-80%
                TransactionPriority.Medium => 0.5,  // 50%-60%
                TransactionPriority.Low => 0.3,   // 30%-50%
                _ => 0.3
            };
        }
    }
}
