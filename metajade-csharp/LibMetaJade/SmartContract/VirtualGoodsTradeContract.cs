using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibMetaJade.SmartContract
{
    /// <summary>
    /// 虚拟商品信息
    /// </summary>
    public class VirtualGoodsInfo
    {
   /// <summary>商品ID</summary>
        public string ItemId { get; set; } = string.Empty;

        /// <summary>商品名称</summary>
        public string ItemName { get; set; } = string.Empty;

        /// <summary>商品类型（游戏道具、皮肤、装备等）</summary>
        public string ItemType { get; set; } = string.Empty;

        /// <summary>稀有度</summary>
      public string Rarity { get; set; } = "Common";

        /// <summary>等级</summary>
    public int Level { get; set; }

        /// <summary>属性（JSON格式）</summary>
        public Dictionary<string, object> Attributes { get; set; } = new();

        /// <summary>商品图片CID</summary>
    public string ImageCid { get; set; } = string.Empty;

     /// <summary>商品数据CID（3D模型等）</summary>
        public string DataCid { get; set; } = string.Empty;

        /// <summary>描述</summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>是否可交易</summary>
public bool IsTradeable { get; set; } = true;

      /// <summary>是否限量</summary>
   public bool IsLimited { get; set; }

        /// <summary>发行总量</summary>
        public int? TotalSupply { get; set; }
  }

    /// <summary>
    /// 交易状态
    /// </summary>
  public enum TradeState
    {
  /// <summary>等待买家确认</summary>
        WaitingBuyer,
  /// <summary>买家已付款，等待卖家发货</summary>
 Paid,
     /// <summary>卖家已发货，等待买家确认</summary>
        Shipped,
        /// <summary>交易完成</summary>
        Completed,
     /// <summary>交易取消</summary>
    Cancelled,
        /// <summary>交易超时</summary>
        Timeout
  }

    /// <summary>
    /// 虚拟商品交易合约
    /// 实现托管交易、自动转移所有权、防止欺诈
    /// </summary>
    public class VirtualGoodsTradeContract : SmartContract
    {
        public VirtualGoodsInfo Goods { get; private set; } = new();

        /// <summary>卖家CID</summary>
public string SellerCid { get; private set; } = string.Empty;

        /// <summary>买家CID</summary>
        public string BuyerCid { get; private set; } = string.Empty;

 /// <summary>商品价格</summary>
        public decimal Price { get; private set; }

        /// <summary>交易状态</summary>
        public TradeState TradeState { get; private set; } = TradeState.WaitingBuyer;

        /// <summary>托管的资金</summary>
        public decimal EscrowAmount { get; private set; }

     /// <summary>交易手续费率</summary>
        public decimal FeeRate { get; private set; } = 0.025m; // 2.5%

        /// <summary>卖家收益</summary>
  public decimal SellerRevenue { get; private set; }

        /// <summary>平台手续费</summary>
        public decimal PlatformFee { get; private set; }

        /// <summary>版权方收益（如果适用）</summary>
        public decimal CopyrightFee { get; private set; }

        /// <summary>版权方CID（原创作者）</summary>
     public string? CopyrightHolderCid { get; private set; }

      /// <summary>版权分成比例</summary>
public decimal CopyrightShareRate { get; private set; } = 0.05m; // 5%

     /// <summary>交易超时时间（小时）</summary>
        public int TimeoutHours { get; private set; } = 72;

     /// <summary>交易截止时间</summary>
public DateTimeOffset? DeadlineAt { get; private set; }

        private VirtualGoodsTradeContract() { }

        /// <summary>
        /// 创建虚拟商品交易合约
        /// </summary>
        public static VirtualGoodsTradeContract Create(
   VirtualGoodsInfo goods,
 string sellerCid,
  string buyerCid,
   decimal price,
            string? copyrightHolderCid = null)
        {
var contract = new VirtualGoodsTradeContract
  {
     Type = ContractType.VirtualGoodsTrade,
   CreatorCid = sellerCid,
          Goods = goods,
     SellerCid = sellerCid,
     BuyerCid = buyerCid,
          Price = price,
      CopyrightHolderCid = copyrightHolderCid
 };

   contract.Participants.Add(sellerCid);
            contract.Participants.Add(buyerCid);
 if (!string.IsNullOrEmpty(copyrightHolderCid))
        contract.Participants.Add(copyrightHolderCid);

 contract.ContractData = System.Text.Json.JsonSerializer.Serialize(new
            {
    goods,
    sellerCid,
           buyerCid,
                price
            });

            return contract;
        }

        public override Task<ValidationResult> ValidateAsync()
        {
      if (string.IsNullOrEmpty(Goods.ItemId))
       return Task.FromResult(ValidationResult.Failure("商品ID不能为空"));

     if (string.IsNullOrEmpty(SellerCid))
         return Task.FromResult(ValidationResult.Failure("卖家CID不能为空"));

        if (string.IsNullOrEmpty(BuyerCid))
      return Task.FromResult(ValidationResult.Failure("买家CID不能为空"));

   if (Price <= 0)
          return Task.FromResult(ValidationResult.Failure("商品价格必须大于0"));

            if (!Goods.IsTradeable)
          return Task.FromResult(ValidationResult.Failure("该商品不可交易"));

            return Task.FromResult(ValidationResult.Success());
        }

        public override async Task<ExecutionResult> ExecuteAsync(Dictionary<string, object> parameters)
        {
       if (!parameters.TryGetValue("action", out var actionObj))
                return ExecutionResult.Failure("缺少action参数");

            var action = actionObj.ToString();

        return action switch
    {
   "pay" => await PayAsync(parameters),
"ship" => await ShipAsync(parameters),
     "confirm" => await ConfirmAsync(parameters),
        "cancel" => await CancelTradeAsync(parameters),
             _ => ExecutionResult.Failure($"不支持的操作: {action}")
   };
        }

     /// <summary>
        /// 买家付款（资金托管）
        /// </summary>
  private async Task<ExecutionResult> PayAsync(Dictionary<string, object> parameters)
    {
   if (TradeState != TradeState.WaitingBuyer)
                return ExecutionResult.Failure($"当前状态不允许付款: {TradeState}");

            if (!parameters.TryGetValue("amount", out var amountObj))
    return ExecutionResult.Failure("缺少amount参数");

        var amount = Convert.ToDecimal(amountObj);
        if (amount < Price)
            return ExecutionResult.Failure($"付款金额不足，需要 {Price}");

    // 资金托管
    EscrowAmount = amount;
       TradeState = TradeState.Paid;
            DeadlineAt = DateTimeOffset.UtcNow.AddHours(TimeoutHours);

 LogExecution("Pay", $"买家付款 {amount}，资金已托管");

            await Task.CompletedTask;
   return ExecutionResult.Success("付款成功，资金已托管", new Dictionary<string, object>
{
          { "escrowAmount", EscrowAmount },
  { "deadline", DeadlineAt }
            });
        }

     /// <summary>
        /// 卖家发货（转移商品所有权）
        /// </summary>
        private async Task<ExecutionResult> ShipAsync(Dictionary<string, object> parameters)
        {
       if (TradeState != TradeState.Paid)
   return ExecutionResult.Failure($"当前状态不允许发货: {TradeState}");

  if (!parameters.TryGetValue("operator", out var operatorObj))
            return ExecutionResult.Failure("缺少operator参数");

        var operatorCid = operatorObj.ToString()!;
       if (operatorCid != SellerCid)
  return ExecutionResult.Failure("只有卖家可以发货");

     // 转移商品所有权到买家
            TradeState = TradeState.Shipped;

       LogExecution("Ship", $"卖家已发货，商品所有权转移至买家");

         await Task.CompletedTask;
  return ExecutionResult.Success("发货成功", new Dictionary<string, object>
            {
             { "newOwner", BuyerCid },
         { "itemId", Goods.ItemId }
  });
        }

        /// <summary>
        /// 买家确认收货（释放托管资金）
        /// </summary>
        private async Task<ExecutionResult> ConfirmAsync(Dictionary<string, object> parameters)
        {
            if (TradeState != TradeState.Shipped)
                return ExecutionResult.Failure($"当前状态不允许确认: {TradeState}");

            if (!parameters.TryGetValue("operator", out var operatorObj))
                return ExecutionResult.Failure("缺少operator参数");

         var operatorCid = operatorObj.ToString()!;
        if (operatorCid != BuyerCid)
   return ExecutionResult.Failure("只有买家可以确认收货");

  // 计算分成
          PlatformFee = EscrowAmount * FeeRate;

  if (!string.IsNullOrEmpty(CopyrightHolderCid))
            {
    CopyrightFee = EscrowAmount * CopyrightShareRate;
  SellerRevenue = EscrowAmount - PlatformFee - CopyrightFee;
    }
            else
  {
                SellerRevenue = EscrowAmount - PlatformFee;
            }

            TradeState = TradeState.Completed;
  CompletedAt = DateTimeOffset.UtcNow;
            State = ContractState.Completed;

         LogExecution("Confirm", $"买家确认收货，卖家收益:{SellerRevenue} 平台手续费:{PlatformFee} 版权费:{CopyrightFee}");

        await Task.CompletedTask;
         return ExecutionResult.Success("交易完成", new Dictionary<string, object>
        {
      { "sellerRevenue", SellerRevenue },
           { "platformFee", PlatformFee },
            { "copyrightFee", CopyrightFee }
 });
        }

        /// <summary>
 /// 取消交易
        /// </summary>
  private async Task<ExecutionResult> CancelTradeAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("operator", out var operatorObj))
       return ExecutionResult.Failure("缺少operator参数");

   var operatorCid = operatorObj.ToString()!;

            // 根据状态判断是否可以取消
            var canCancel = TradeState switch
     {
  TradeState.WaitingBuyer => operatorCid == SellerCid || operatorCid == BuyerCid,
         TradeState.Paid => operatorCid == BuyerCid, // 付款后只有买家可以取消（退款）
     _ => false
    };

      if (!canCancel)
       return ExecutionResult.Failure("当前状态不允许取消交易");

    // 退款
    if (TradeState == TradeState.Paid && EscrowAmount > 0)
            {
             LogExecution("Refund", $"退款给买家: {EscrowAmount}");
}

    TradeState = TradeState.Cancelled;
    State = ContractState.Cancelled;

            LogExecution("Cancel", $"交易已取消，操作者: {operatorCid[..8]}...");

            await Task.CompletedTask;
        return ExecutionResult.Success("交易已取消");
        }

        public override string GetSummary()
        {
   return $"虚拟商品交易 [{Goods.ItemName}] 卖家:{SellerCid[..8]}... 买家:{BuyerCid[..8]}... 价格:{Price} 状态:{TradeState}";
        }
    }
}
