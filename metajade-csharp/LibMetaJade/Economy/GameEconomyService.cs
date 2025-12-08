using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibMetaJade.Economy
{
    /// <summary>
    /// 游戏经济系统服务 - 游戏开发者可调用的接口
    /// </summary>
    public class GameEconomyService
    {
  private readonly MetaJadeEconomyService _economyService;
        private readonly Dictionary<string, GameEconomyConfig> _gameConfigs = new();
      private readonly Dictionary<string, GameItem> _gameItems = new();
 private readonly Dictionary<string, PlayerInventory> _inventories = new();
        private readonly Dictionary<string, MarketOrder> _marketOrders = new();
    private readonly Dictionary<string, EconomyStatistics> _statistics = new();

        public GameEconomyService(MetaJadeEconomyService economyService)
 {
    _economyService = economyService;
        }

  /// <summary>
   /// 注册游戏经济系统
  /// </summary>
        public async Task<GameEconomyConfig> RegisterGameAsync(
 string gameID,
       string gameName,
   string developerID,
     string? customCurrencyName = null,
  decimal customCurrencyRate = 1.0m)
        {
       var config = new GameEconomyConfig
     {
    GameID = gameID,
       GameName = gameName,
   DeveloperID = developerID,
     CustomCurrencyName = customCurrencyName ?? $"{gameName}币",
  CustomCurrencySymbol = customCurrencyName?[0].ToString() ?? "G",
    XuanYuExchangeRate = customCurrencyRate,
   CreatedAt = DateTimeOffset.UtcNow,
     IsActive = true
      };

            _gameConfigs[gameID] = config;

            // 为游戏创建收益账户
await _economyService.CreateAccountAsync(
      developerID,
       AccountType.Merchant,
     gameID
            );

            // 初始化统计
     _statistics[gameID] = new EconomyStatistics { GameID = gameID };

            return await Task.FromResult(config);
      }

     /// <summary>
    /// 获取游戏配置
     /// </summary>
        public async Task<GameEconomyConfig?> GetGameConfigAsync(string gameID)
   {
 return await Task.FromResult(
         _gameConfigs.TryGetValue(gameID, out var config) ? config : null
  );
        }

        /// <summary>
     /// 创建游戏内物品
   /// </summary>
   public async Task<GameItem> CreateGameItemAsync(
     string gameID,
            string itemName,
    decimal priceInXuanYu,
   string itemType = "Item",
  string rarity = "Common",
      bool isTradable = true)
   {
 var config = await GetGameConfigAsync(gameID);
     if (config == null)
     throw new InvalidOperationException("游戏未注册");

   var item = new GameItem
            {
       GameID = gameID,
ItemName = itemName,
 PriceInXuanYu = priceInXuanYu,
    PriceInCustomCurrency = priceInXuanYu * config.XuanYuExchangeRate,
        ItemType = itemType,
     Rarity = rarity,
     IsTradable = isTradable,
    CreatedAt = DateTimeOffset.UtcNow
            };

          _gameItems[item.ItemID] = item;

       return item;
  }

        /// <summary>
   /// 获取游戏物品
    /// </summary>
        public async Task<GameItem?> GetGameItemAsync(string itemID)
     {
    return await Task.FromResult(
    _gameItems.TryGetValue(itemID, out var item) ? item : null
     );
        }

   /// <summary>
      /// 获取游戏的所有物品
   /// </summary>
 public async Task<List<GameItem>> GetGameItemsAsync(string gameID)
        {
var items = _gameItems.Values
    .Where(i => i.GameID == gameID)
         .ToList();

return await Task.FromResult(items);
        }

        /// <summary>
     /// 玩家购买物品（使用玄玉币）
        /// </summary>
        public async Task<Transaction> PurchaseItemAsync(
          string userID,
      string gameID,
      string itemID,
         int quantity = 1)
{
      var item = await GetGameItemAsync(itemID);
  if (item == null || item.GameID != gameID)
  throw new InvalidOperationException("物品不存在");

 var config = await GetGameConfigAsync(gameID);
      if (config == null)
        throw new InvalidOperationException("游戏未注册");

       // 获取玩家账户
    var userAccounts = await _economyService.GetUserAccountsAsync(userID);
       var playerAccount = userAccounts.FirstOrDefault(a => a.GameID == gameID);

     if (playerAccount == null)
  {
        // 创建游戏账户
     playerAccount = await _economyService.CreateAccountAsync(
        userID,
        AccountType.Game,
        gameID
     );
  }

     // 计算总价
   var totalPrice = item.PriceInXuanYu * quantity;
    var fee = totalPrice * config.TransactionFeeRate;
   var developerRevenue = totalPrice * config.DeveloperRevenueShare;
            var platformRevenue = totalPrice * config.PlatformRevenueShare;

       // 验证余额
var balance = await _economyService.GetBalanceAsync(playerAccount.AccountID);
    if (balance < totalPrice)
      throw new InvalidOperationException("玄玉币余额不足");

// 获取开发者账户
   var developerAccounts = await _economyService.GetUserAccountsAsync(config.DeveloperID);
       var developerAccount = developerAccounts.FirstOrDefault(a => a.GameID == gameID);

            if (developerAccount == null)
        throw new InvalidOperationException("开发者账户不存在");

            // 执行支付
        var transaction = await _economyService.TransferAsync(
     playerAccount.AccountID,
      developerAccount.AccountID,
    totalPrice,
           $"购买 {item.ItemName} x{quantity}"
       );

            transaction.Type = TransactionType.GamePurchase;
       transaction.GameID = gameID;

    // 添加物品到玩家库存
   await AddItemToInventoryAsync(userID, gameID, itemID, quantity);

// 更新物品统计
       item.SoldCount += quantity;
   item.CirculatingSupply += quantity;

    // 更新游戏统计
    var stats = _statistics[gameID];
       stats.TotalTransactions++;
            stats.TotalTransactionVolume += totalPrice;
 stats.DeveloperRevenue += developerRevenue;
   stats.PlatformRevenue += platformRevenue;

       return transaction;
        }

        /// <summary>
        /// 添加物品到玩家库存
  /// </summary>
        private async Task AddItemToInventoryAsync(
       string userID,
        string gameID,
       string itemID,
       int quantity)
  {
       var inventoryKey = $"{userID}_{gameID}";
       
       if (!_inventories.TryGetValue(inventoryKey, out var inventory))
            {
  inventory = new PlayerInventory
    {
       UserID = userID,
     GameID = gameID
    };
    _inventories[inventoryKey] = inventory;
      }

       // 查找已有物品
       var existingItem = inventory.Items.FirstOrDefault(i => i.ItemID == itemID);

if (existingItem != null)
      {
     existingItem.Quantity += quantity;
            }
        else
      {
    inventory.Items.Add(new InventoryItem
   {
       ItemID = itemID,
       Quantity = quantity,
   AcquiredAt = DateTimeOffset.UtcNow
 });
            }

 inventory.LastSyncedAt = DateTimeOffset.UtcNow;

    await Task.CompletedTask;
        }

     /// <summary>
/// 获取玩家库存
    /// </summary>
        public async Task<PlayerInventory?> GetPlayerInventoryAsync(
   string userID,
       string gameID)
        {
var inventoryKey = $"{userID}_{gameID}";
     return await Task.FromResult(
          _inventories.TryGetValue(inventoryKey, out var inventory) ? inventory : null
          );
        }

        /// <summary>
        /// 玩家间交易物品（P2P交易）
        /// </summary>
        public async Task<Transaction> TradeItemAsync(
string sellerUserID,
            string buyerUserID,
   string gameID,
string itemID,
        int quantity,
      decimal priceInXuanYu)
        {
 var config = await GetGameConfigAsync(gameID);
if (config == null)
      throw new InvalidOperationException("游戏未注册");

            if (!config.EnableP2PTrading)
         throw new InvalidOperationException("游戏不支持玩家间交易");

  var item = await GetGameItemAsync(itemID);
   if (item == null || !item.IsTradable)
    throw new InvalidOperationException("物品不可交易");

// 验证卖家库存
       var sellerInventory = await GetPlayerInventoryAsync(sellerUserID, gameID);
 var sellerItem = sellerInventory?.Items.FirstOrDefault(i => i.ItemID == itemID);

      if (sellerItem == null || sellerItem.Quantity < quantity)
            throw new InvalidOperationException("卖家物品数量不足");

   // 获取买家和卖家账户
 var buyerAccounts = await _economyService.GetUserAccountsAsync(buyerUserID);
            var buyerAccount = buyerAccounts.FirstOrDefault(a => a.GameID == gameID);

   var sellerAccounts = await _economyService.GetUserAccountsAsync(sellerUserID);
       var sellerAccount = sellerAccounts.FirstOrDefault(a => a.GameID == gameID);

         if (buyerAccount == null || sellerAccount == null)
       throw new InvalidOperationException("账户不存在");

        // 计算手续费
var fee = priceInXuanYu * config.TransactionFeeRate;
     var totalCost = priceInXuanYu + fee;

     // 执行支付
    var transaction = await _economyService.TransferAsync(
     buyerAccount.AccountID,
    sellerAccount.AccountID,
      priceInXuanYu,
                $"购买 {item.ItemName} x{quantity} (玩家交易)"
       );

      transaction.Type = TransactionType.Purchase;
 transaction.GameID = gameID;
 transaction.Fee = fee;

      // 转移物品
     sellerItem.Quantity -= quantity;
      if (sellerItem.Quantity == 0)
   {
      sellerInventory!.Items.Remove(sellerItem);
            }

            await AddItemToInventoryAsync(buyerUserID, gameID, itemID, quantity);

      return transaction;
   }

   /// <summary>
   /// 创建市场订单
     /// </summary>
    public async Task<MarketOrder> CreateMarketOrderAsync(
            string sellerUserID,
       string gameID,
       string itemID,
       int quantity,
     decimal pricePerUnit,
      int expiryHours = 24)
        {
var config = await GetGameConfigAsync(gameID);
       if (config == null)
         throw new InvalidOperationException("游戏未注册");

 if (!config.EnableMarketplace)
throw new InvalidOperationException("游戏不支持市场交易");

          var item = await GetGameItemAsync(itemID);
     if (item == null || !item.IsTradable)
    throw new InvalidOperationException("物品不可交易");

        // 验证库存
      var inventory = await GetPlayerInventoryAsync(sellerUserID, gameID);
    var inventoryItem = inventory?.Items.FirstOrDefault(i => i.ItemID == itemID);

            if (inventoryItem == null || inventoryItem.Quantity < quantity)
      throw new InvalidOperationException("物品数量不足");

            // 锁定物品（防止重复出售）
       inventoryItem.IsLocked = true;

   var order = new MarketOrder
          {
  GameID = gameID,
 SellerUserID = sellerUserID,
   ItemID = itemID,
      Quantity = quantity,
       PricePerUnit = pricePerUnit,
      Status = OrderStatus.Active,
         CreatedAt = DateTimeOffset.UtcNow,
 ExpiresAt = DateTimeOffset.UtcNow.AddHours(expiryHours)
   };

     _marketOrders[order.OrderID] = order;

       // 更新统计
            var stats = _statistics[gameID];
            stats.ActiveMarketOrders++;

       return await Task.FromResult(order);
        }

        /// <summary>
   /// 购买市场订单
        /// </summary>
    public async Task<Transaction> PurchaseMarketOrderAsync(
    string buyerUserID,
   string orderID)
     {
if (!_marketOrders.TryGetValue(orderID, out var order))
   throw new InvalidOperationException("订单不存在");

            if (order.Status != OrderStatus.Active)
       throw new InvalidOperationException("订单不可用");

     if (order.ExpiresAt < DateTimeOffset.UtcNow)
            {
         order.Status = OrderStatus.Expired;
      throw new InvalidOperationException("订单已过期");
          }

// 执行交易
       var transaction = await TradeItemAsync(
         order.SellerUserID,
 buyerUserID,
      order.GameID,
   order.ItemID,
    order.Quantity,
     order.TotalPrice
      );

   // 更新订单状态
          order.Status = OrderStatus.Completed;
       order.BuyerUserID = buyerUserID;
       order.CompletedAt = DateTimeOffset.UtcNow;
        order.TransactionID = transaction.TransactionID;

       // 解锁物品
        var inventory = await GetPlayerInventoryAsync(order.SellerUserID, order.GameID);
       var item = inventory?.Items.FirstOrDefault(i => i.ItemID == order.ItemID);
            if (item != null)
      item.IsLocked = false;

   // 更新统计
            var stats = _statistics[order.GameID];
    stats.ActiveMarketOrders--;
         stats.TotalMarketVolume += order.TotalPrice;

  return transaction;
 }

  /// <summary>
      /// 获取游戏市场订单
        /// </summary>
        public async Task<List<MarketOrder>> GetMarketOrdersAsync(
            string gameID,
    OrderStatus? status = null)
{
            var orders = _marketOrders.Values
   .Where(o => o.GameID == gameID)
    .Where(o => !status.HasValue || o.Status == status.Value)
    .OrderByDescending(o => o.CreatedAt)
       .ToList();

       return await Task.FromResult(orders);
        }

        /// <summary>
  /// 游戏奖励玩家（开发者发放奖励）
     /// </summary>
        public async Task<Transaction> RewardPlayerAsync(
     string gameID,
            string userID,
   decimal amountInXuanYu,
       string reason = "游戏奖励")
     {
            var config = await GetGameConfigAsync(gameID);
    if (config == null)
   throw new InvalidOperationException("游戏未注册");

       // 防作弊检查
     var todayRewards = await GetTodayRewardsAsync(gameID, userID);
       if (todayRewards + amountInXuanYu > config.MaxDailyRewardPerUser)
      throw new InvalidOperationException("超出每日奖励上限");

     // 获取开发者账户和玩家账户
       var developerAccounts = await _economyService.GetUserAccountsAsync(config.DeveloperID);
            var developerAccount = developerAccounts.FirstOrDefault(a => a.GameID == gameID);

     var playerAccounts = await _economyService.GetUserAccountsAsync(userID);
            var playerAccount = playerAccounts.FirstOrDefault(a => a.GameID == gameID);

   if (playerAccount == null)
 {
       playerAccount = await _economyService.CreateAccountAsync(
    userID,
          AccountType.Game,
        gameID
     );
  }

  if (developerAccount == null)
         throw new InvalidOperationException("开发者账户不存在");

     // 从开发者账户转账到玩家账户
  var transaction = await _economyService.TransferAsync(
      developerAccount.AccountID,
    playerAccount.AccountID,
amountInXuanYu,
      reason
      );

      transaction.Type = TransactionType.GameReward;
            transaction.GameID = gameID;

     return transaction;
    }

  /// <summary>
        /// 获取今日奖励总额
        /// </summary>
     private async Task<decimal> GetTodayRewardsAsync(string gameID, string userID)
   {
            var playerAccounts = await _economyService.GetUserAccountsAsync(userID);
    var playerAccount = playerAccounts.FirstOrDefault(a => a.GameID == gameID);

       if (playerAccount == null)
      return 0m;

       var today = DateTimeOffset.UtcNow.Date;
       var transactions = await _economyService.GetTransactionHistoryAsync(
         playerAccount.AccountID
   );

       var todayRewards = transactions
     .Where(t => t.Type == TransactionType.GameReward)
    .Where(t => t.CreatedAt.Date == today)
     .Sum(t => t.Amount);

       return todayRewards;
        }

        /// <summary>
  /// 玩家兑换游戏内货币
      /// </summary>
     public async Task<decimal> ExchangeToCustomCurrencyAsync(
  string userID,
  string gameID,
       decimal amountInXuanYu)
  {
     var config = await GetGameConfigAsync(gameID);
    if (config == null)
     throw new InvalidOperationException("游戏未注册");

     var playerAccounts = await _economyService.GetUserAccountsAsync(userID);
            var playerAccount = playerAccounts.FirstOrDefault(a => a.GameID == gameID);

    if (playerAccount == null)
       throw new InvalidOperationException("玩家账户不存在");

    // 扣除玄玉币
            var balance = await _economyService.GetBalanceAsync(playerAccount.AccountID);
if (balance < amountInXuanYu)
 throw new InvalidOperationException("玄玉币余额不足");

       // 兑换为游戏内货币
            var customAmount = amountInXuanYu * config.XuanYuExchangeRate;

       // 更新库存
  var inventoryKey = $"{userID}_{gameID}";
        if (!_inventories.TryGetValue(inventoryKey, out var inventory))
     {
inventory = new PlayerInventory
       {
       UserID = userID,
       GameID = gameID
        };
     _inventories[inventoryKey] = inventory;
            }

    inventory.XuanYuBalance -= amountInXuanYu;
       inventory.CustomCurrencyBalance += customAmount;

   return await Task.FromResult(customAmount);
 }

        /// <summary>
        /// 获取游戏经济统计
        /// </summary>
        public async Task<EconomyStatistics> GetGameStatisticsAsync(string gameID)
     {
   if (!_statistics.TryGetValue(gameID, out var stats))
   {
  stats = new EconomyStatistics { GameID = gameID };
       _statistics[gameID] = stats;
            }

 stats.UpdatedAt = DateTimeOffset.UtcNow;
       return await Task.FromResult(stats);
        }

   /// <summary>
   /// 更新游戏配置
        /// </summary>
        public async Task<GameEconomyConfig> UpdateGameConfigAsync(
   string gameID,
      Action<GameEconomyConfig> updateAction)
        {
     var config = await GetGameConfigAsync(gameID);
      if (config == null)
          throw new InvalidOperationException("游戏未注册");

      updateAction(config);

            return config;
   }

     /// <summary>
        /// 清理缓存
        /// </summary>
        public void ClearCache()
     {
       _gameConfigs.Clear();
       _gameItems.Clear();
   _inventories.Clear();
    _marketOrders.Clear();
          _statistics.Clear();
 }
    }
}
