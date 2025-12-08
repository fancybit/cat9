using System;
using System.Collections.Generic;

namespace LibMetaJade.Economy
{
    /// <summary>
    /// 货币类型
    /// </summary>
    public enum CurrencyType
    {
        XuanYu,     // 玄玉币（基础货币）
        CNY,        // 人民币
        USD,        // 美元
        EUR,        // 欧元
        JPY,        // 日元
        KRW,        // 韩元
        GBP,        // 英镑
        Custom      // 自定义游戏货币
    }

    /// <summary>
    /// 交易类型
    /// </summary>
    public enum TransactionType
    {
        Transfer,       // 转账
        Purchase,       // 购买
        Reward,         // 奖励
        Refund,         // 退款
        Exchange,       // 兑换
        Mining,         // 挖矿
        Staking,        // 质押
        GameReward,     // 游戏奖励
        GamePurchase,   // 游戏内购买
        Withdrawal,     // 提现
        Deposit         // 充值
    }

    /// <summary>
    /// 交易状态
    /// </summary>
    public enum TransactionStatus
    {
        Pending,        // 待处理
        Processing,     // 处理中
        Completed,      // 已完成
        Failed,         // 失败
        Cancelled,      // 已取消
        Refunded        // 已退款
    }

    /// <summary>
    /// 账户类型
    /// </summary>
    public enum AccountType
    {
        Personal,   // 个人账户
        Game,       // 游戏账户
        Merchant,   // 商户账户
        System,     // 系统账户
        Escrow      // 托管账户
    }

    /// <summary>
    /// 玄玉币账户
    /// </summary>
    public class MetaJadeAccount
    {
        public string AccountID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public AccountType AccountType { get; set; } = AccountType.Personal;

        // 余额信息
        public decimal Balance { get; set; }  // 玄玉币余额
        public decimal FrozenBalance { get; set; }  // 冻结余额
        public decimal AvailableBalance => Balance - FrozenBalance;  // 可用余额

        // 账户元数据
        public string? GameID { get; set; }  // 关联的游戏ID（游戏账户）
        public string? MerchantID { get; set; }  // 商户ID（商户账户）
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset LastActivityAt { get; set; } = DateTimeOffset.UtcNow;

        // 安全设置
        public bool IsLocked { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public string? PublicKey { get; set; }  // 用于加密和签名

        // 统计信息
        public decimal TotalReceived { get; set; }
        public decimal TotalSent { get; set; }
        public int TransactionCount { get; set; }

        // IPFS 存储
        public string? AccountCID { get; set; }  // 账户数据的 IPFS CID
    }

    /// <summary>
    /// 交易记录
    /// </summary>
    public class Transaction
    {
        public string TransactionID { get; set; } = Guid.NewGuid().ToString();
        public TransactionType Type { get; set; }
        public TransactionStatus Status { get; set; } = TransactionStatus.Pending;

        // 交易双方
        public string FromAccountID { get; set; } = string.Empty;
        public string ToAccountID { get; set; } = string.Empty;
        public string FromUserID { get; set; } = string.Empty;
        public string ToUserID { get; set; } = string.Empty;

        // 金额信息
        public decimal Amount { get; set; }  // 玄玉币金额
        public CurrencyType Currency { get; set; } = CurrencyType.XuanYu;
        public decimal Fee { get; set; }  // 手续费
        public decimal ExchangeRate { get; set; } = 1.0m;  // 汇率

        // 交易元数据
        public string? Description { get; set; }
        public string? GameID { get; set; }  // 游戏内交易
        public string? OrderID { get; set; }  // 关联订单
        public Dictionary<string, string> Metadata { get; set; } = new();

        // 时间信息
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? CompletedAt { get; set; }
        public DateTimeOffset? ExpiresAt { get; set; }

        // 安全信息
        public string? Signature { get; set; }  // 交易签名
        public string? Hash { get; set; }  // 交易哈希
        public bool IsReversible { get; set; } = true;

        // IPFS 备份
        public string? TransactionCID { get; set; }  // 交易记录的 IPFS CID
        public int BackupHops { get; set; } = 3;  // SNS 备份跳数
        public List<string> BackupNodeCIDs { get; set; } = new();
    }

    /// <summary>
    /// 汇率信息
    /// </summary>
    public class ExchangeRate
    {
        public CurrencyType FromCurrency { get; set; }
        public CurrencyType ToCurrency { get; set; }
        public decimal Rate { get; set; }  // 汇率
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public string Source { get; set; } = "Official";  // 数据源：Official（官方）/ Market（市场）

        // 汇率范围
        public decimal MinRate { get; set; }
        public decimal MaxRate { get; set; }
        public decimal AverageRate { get; set; }

        // 汇率历史
        public List<RateHistory> History { get; set; } = new();
    }

    /// <summary>
    /// 汇率历史记录
    /// </summary>
    public class RateHistory
    {
        public decimal Rate { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }

    /// <summary>
    /// 游戏经济系统配置
    /// </summary>
    public class GameEconomyConfig
    {
        public string GameID { get; set; } = string.Empty;
        public string GameName { get; set; } = string.Empty;
        public string DeveloperID { get; set; } = string.Empty;

        // 自定义货币
        public string? CustomCurrencyName { get; set; }  // 例如：金币、钻石
        public string? CustomCurrencySymbol { get; set; }  // 例如：G、??
        public decimal XuanYuExchangeRate { get; set; } = 1.0m;  // 自定义货币兑换玄玉币汇率

        // 交易配置
        public decimal TransactionFeeRate { get; set; } = 0.01m;  // 交易手续费率（1%）
        public decimal MinTransactionAmount { get; set; } = 0.01m;
        public decimal MaxTransactionAmount { get; set; } = 100000m;
        public decimal DailyWithdrawalLimit { get; set; } = 10000m;

        // 游戏经济参数
        public bool EnableMining { get; set; }  // 是否启用挖矿
        public bool EnableStaking { get; set; }  // 是否启用质押
        public bool EnableP2PTrading { get; set; } = true;  // 是否启用玩家间交易
        public bool EnableMarketplace { get; set; } = true;  // 是否启用市场

        // 收益分配
        public decimal DeveloperRevenueShare { get; set; } = 0.70m;  // 开发者分成 70%
        public decimal PlatformRevenueShare { get; set; } = 0.30m;  // 平台分成 30%

        // 防作弊配置
        public bool EnableAntiCheat { get; set; } = true;
        public decimal MaxDailyRewardPerUser { get; set; } = 1000m;
        public int MaxTransactionsPerMinute { get; set; } = 10;

        // 创建时间
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// 游戏内物品
    /// </summary>
    public class GameItem
    {
        public string ItemID { get; set; } = Guid.NewGuid().ToString();
        public string GameID { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }

        // 价格信息
        public decimal PriceInXuanYu { get; set; }  // 玄玉币价格
        public decimal? PriceInCustomCurrency { get; set; }  // 游戏内货币价格

        // 物品属性
        public string ItemType { get; set; } = string.Empty;  // 类型：武器、装备、道具等
        public string Rarity { get; set; } = "Common";  // 稀有度
        public bool IsTradable { get; set; } = true;  // 是否可交易
        public bool IsConsumable { get; set; }  // 是否消耗品

        // NFT 属性（可选）
        public bool IsNFT { get; set; }
        public string? TokenID { get; set; }
        public string? MetadataCID { get; set; }  // IPFS 元数据

        // 统计信息
        public int TotalSupply { get; set; }
        public int CirculatingSupply { get; set; }
        public int SoldCount { get; set; }

        // 创建时间
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// 玩家库存
    /// </summary>
    public class PlayerInventory
    {
        public string InventoryID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string GameID { get; set; } = string.Empty;

        // 物品列表
        public List<InventoryItem> Items { get; set; } = new();

        // 货币余额
        public decimal XuanYuBalance { get; set; }
        public decimal CustomCurrencyBalance { get; set; }

        // IPFS 存储
        public string? InventoryCID { get; set; }
        public DateTimeOffset LastSyncedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// 库存物品
    /// </summary>
    public class InventoryItem
    {
        public string InventoryItemID { get; set; } = Guid.NewGuid().ToString();
        public string ItemID { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public DateTimeOffset AcquiredAt { get; set; } = DateTimeOffset.UtcNow;

        // NFT 信息（如果是 NFT）
        public string? TokenID { get; set; }
        public string? OwnershipProof { get; set; }

        // 物品状态
        public bool IsEquipped { get; set; }
        public bool IsLocked { get; set; }  // 锁定防止交易
        public Dictionary<string, object> CustomData { get; set; } = new();
    }

    /// <summary>
    /// 市场订单
    /// </summary>
    public class MarketOrder
    {
        public string OrderID { get; set; } = Guid.NewGuid().ToString();
        public string GameID { get; set; } = string.Empty;
        public string SellerUserID { get; set; } = string.Empty;
        public string? BuyerUserID { get; set; }

        // 订单内容
        public string ItemID { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice => PricePerUnit * Quantity;

        // 订单状态
        public OrderStatus Status { get; set; } = OrderStatus.Active;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? CompletedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }

        // 交易ID
        public string? TransactionID { get; set; }
    }

    /// <summary>
    /// 订单状态
    /// </summary>
    public enum OrderStatus
    {
        Active,         // 活跃
        Completed,      // 已完成
        Cancelled,      // 已取消
        Expired       // 已过期
    }

    /// <summary>
    /// 经济统计数据
    /// </summary>
    public class EconomyStatistics
    {
        public string GameID { get; set; } = string.Empty;

        // 货币统计
        public decimal TotalXuanYuInCirculation { get; set; }
        public decimal TotalCustomCurrencyInCirculation { get; set; }

        // 交易统计
        public int TotalTransactions { get; set; }
        public decimal TotalTransactionVolume { get; set; }
        public decimal AverageDailyVolume { get; set; }

        // 用户统计
        public int TotalAccounts { get; set; }
        public int ActiveAccounts { get; set; }
        public int NewAccountsToday { get; set; }

        // 市场统计
        public int ActiveMarketOrders { get; set; }
        public decimal TotalMarketVolume { get; set; }

        // 收入统计
        public decimal DeveloperRevenue { get; set; }
        public decimal PlatformRevenue { get; set; }

        // 更新时间
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// 提现请求
    /// </summary>
    public class WithdrawalRequest
    {
        public string RequestID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string AccountID { get; set; } = string.Empty;

        // 提现信息
        public decimal AmountInXuanYu { get; set; }
        public CurrencyType TargetCurrency { get; set; } = CurrencyType.CNY;
        public decimal AmountInTargetCurrency { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal Fee { get; set; }

        // 银行信息
        public string BankName { get; set; } = string.Empty;
        public string BankAccount { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;

        // 状态
        public WithdrawalStatus Status { get; set; } = WithdrawalStatus.Pending;
        public DateTimeOffset RequestedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? ProcessedAt { get; set; }
        public string? RejectReason { get; set; }

        // 审核信息
        public string? ApprovedBy { get; set; }
        public bool RequiresManualReview { get; set; }
    }

    /// <summary>
    /// 提现状态
    /// </summary>
    public enum WithdrawalStatus
    {
        Pending,    // 待处理
        Approved,   // 已批准
        Processing,     // 处理中
        Completed,      // 已完成
        Rejected,       // 已拒绝
        Failed     // 失败
    }

    /// <summary>
    /// 充值记录
    /// </summary>
    public class DepositRecord
    {
        public string DepositID { get; set; } = Guid.NewGuid().ToString();
        public string UserID { get; set; } = string.Empty;
        public string AccountID { get; set; } = string.Empty;

        // 充值信息
        public CurrencyType SourceCurrency { get; set; } = CurrencyType.CNY;
        public decimal AmountInSourceCurrency { get; set; }
        public decimal AmountInXuanYu { get; set; }
        public decimal ExchangeRate { get; set; }

        // 支付信息
        public string PaymentMethod { get; set; } = string.Empty;  // 支付宝、微信、银行卡等
        public string? PaymentTransactionID { get; set; }

        // 状态
        public DepositStatus Status { get; set; } = DepositStatus.Pending;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? CompletedAt { get; set; }
    }

    /// <summary>
    /// 充值状态
    /// </summary>
    public enum DepositStatus
    {
        Pending,        // 待处理
        Confirmed,      // 已确认
        Completed,      // 已完成
        Failed      // 失败
    }
}
