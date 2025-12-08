using System;
using System.Threading.Tasks;
using LibMetaJade.Economy;

namespace LibMetaJade.Examples
{
  /// <summary>
    /// 玄玉币经济系统示例
    /// </summary>
    public static class EconomyExamples
  {
        /// <summary>
        /// 运行所有经济系统示例
   /// </summary>
    public static async Task RunAllExamplesAsync()
        {
            Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║     玄玉区块网络 - 玄玉币经济系统示例        ║");
            Console.WriteLine("╚════════════════════════════════════════════════════════════════╝\n");

            await Example1_BasicEconomyAsync();
        Console.WriteLine("\n" + new string('=', 70) + "\n");

         await Example2_CurrencyExchangeAsync();
            Console.WriteLine("\n" + new string('=', 70) + "\n");

          await Example3_GameEconomyAsync();
            Console.WriteLine("\n" + new string('=', 70) + "\n");

       await Example4_GameMarketplaceAsync();
            Console.WriteLine("\n" + new string('=', 70) + "\n");

            await Example5_P2PTradingAsync();
     }

        /// <summary>
        /// 示例1：基础玄玉币操作
  /// </summary>
        private static async Task Example1_BasicEconomyAsync()
    {
        Console.WriteLine("=== 示例1：基础玄玉币操作 ===\n");

    var economyService = new MetaJadeEconomyService();

            // 创建用户账户
            Console.WriteLine("【创建账户】");
 var alice = await economyService.CreateAccountAsync("alice", AccountType.Personal);
 var bob = await economyService.CreateAccountAsync("bob", AccountType.Personal);

   Console.WriteLine($"  Alice 账户ID: {alice.AccountID}");
      Console.WriteLine($"  Alice 余额: {alice.Balance} 玄玉币（含新用户奖励10币）");
            Console.WriteLine($"  Bob 账户ID: {bob.AccountID}");
      Console.WriteLine($"  Bob 余额: {bob.Balance} 玄玉币");

            // 充值（人民币 → 玄玉币，1:1）
        Console.WriteLine($"\n【充值】Alice 充值 100 元人民币");
            await economyService.ExchangeAsync(
      alice.AccountID,
                amount: 100m,
       targetCurrency: CurrencyType.CNY,
     isDeposit: true
            );

            var aliceBalance = await economyService.GetBalanceAsync(alice.AccountID);
            Console.WriteLine($"  ? 充值成功");
            Console.WriteLine($"  Alice 新余额: {aliceBalance} 玄玉币");

            // 转账
            Console.WriteLine($"\n【转账】Alice → Bob: 50 玄玉币");
            var transaction = await economyService.TransferAsync(
                alice.AccountID,
     bob.AccountID,
    amount: 50m,
        description: "转账测试"
        );

            Console.WriteLine($"  ? 转账成功");
            Console.WriteLine($"    交易ID: {transaction.TransactionID}");
    Console.WriteLine($"    交易哈希: {transaction.Hash}");
     Console.WriteLine($"    Alice 余额: {await economyService.GetBalanceAsync(alice.AccountID)} 玄玉币");
            Console.WriteLine($"    Bob 余额: {await economyService.GetBalanceAsync(bob.AccountID)} 玄玉币");

            // 提现（玄玉币 → 人民币，1:1，扣除1%手续费）
        Console.WriteLine($"\n【提现】Bob 提现 30 玄玉币到人民币");
   var withdrawal = await economyService.ExchangeAsync(
              bob.AccountID,
                amount: 30m,
              targetCurrency: CurrencyType.CNY,
        isDeposit: false
       );

          Console.WriteLine($"  ? 提现成功");
            Console.WriteLine($"    手续费: {withdrawal.Fee} 玄玉币（1%）");
          Console.WriteLine($" 实际到账: {30m - withdrawal.Fee} 人民币");
            Console.WriteLine($"    Bob 余额: {await economyService.GetBalanceAsync(bob.AccountID)} 玄玉币");

// 查看交易历史
            Console.WriteLine($"\n【交易历史】Alice 的交易记录:");
     var history = await economyService.GetTransactionHistoryAsync(alice.AccountID);
            foreach (var tx in history.Take(3))
       {
                Console.WriteLine($"  ? [{tx.Type}] {tx.Amount} 玄玉币 - {tx.Description ?? "无描述"}");
      Console.WriteLine($"    时间: {tx.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            }
 }

     /// <summary>
        /// 示例2：货币兑换（遵循官方外汇价格）
        /// </summary>
        private static async Task Example2_CurrencyExchangeAsync()
        {
 Console.WriteLine("=== 示例2：货币兑换（遵循官方外汇价格） ===\n");

            var economyService = new MetaJadeEconomyService();

            Console.WriteLine("【官方汇率表】玄玉币与各国货币兑换率");
         Console.WriteLine(new string('-', 70));
        Console.WriteLine($"{"货币",-15} {"汇率",-20} {"说明",-30}");
         Console.WriteLine(new string('-', 70));

    var currencies = new[] 
         {
      CurrencyType.CNY,
         CurrencyType.USD,
          CurrencyType.EUR,
        CurrencyType.JPY,
    CurrencyType.KRW,
                CurrencyType.GBP
       };

            foreach (var currency in currencies)
       {
 var rate = await economyService.GetExchangeRateAsync(CurrencyType.XuanYu, currency);
     var explanation = currency switch
     {
        CurrencyType.CNY => "人民币1:1兑换",
          CurrencyType.USD => "参考美元官方汇率",
         CurrencyType.EUR => "参考欧元官方汇率",
      CurrencyType.JPY => "参考日元官方汇率",
    CurrencyType.KRW => "参考韩元官方汇率",
            CurrencyType.GBP => "参考英镑官方汇率",
       _ => "其他货币"
     };
     Console.WriteLine($"{currency,-15} 1 玄玉币 = {rate.Rate,-8:F2} {currency,-5} {explanation,-30}");
            }
    Console.WriteLine(new string('-', 70));

  // 兑换示例
       Console.WriteLine($"\n【兑换示例】");
 var user = await economyService.CreateAccountAsync("trader", AccountType.Personal);

  // 充值100人民币
   await economyService.ExchangeAsync(user.AccountID, 100m, CurrencyType.CNY, isDeposit: true);
            Console.WriteLine($"  充值: 100 CNY → 100 玄玉币（1:1）");

          // 提现到美元
            var usdRate = await economyService.GetExchangeRateAsync(CurrencyType.XuanYu, CurrencyType.USD);
            Console.WriteLine($"\n  提现: 50 玄玉币 → USD");
      Console.WriteLine($"    汇率: 1 玄玉币 = {usdRate.Rate} USD");
    Console.WriteLine($"    应得: {50m * usdRate.Rate:F2} USD");
  Console.WriteLine($"    手续费: {50m * 0.01m} 玄玉币（1%）");
     Console.WriteLine($"    实际到账: {(50m - 50m * 0.01m) * usdRate.Rate:F2} USD");

          // 提现到日元
        var jpyRate = await economyService.GetExchangeRateAsync(CurrencyType.XuanYu, CurrencyType.JPY);
            Console.WriteLine($"\n  提现: 30 玄玉币 → JPY");
  Console.WriteLine($"    汇率: 1 玄玉币 = {jpyRate.Rate} JPY");
            Console.WriteLine($"    应得: {30m * jpyRate.Rate:F2} JPY");
       Console.WriteLine($" 手续费: {30m * 0.01m} 玄玉币（1%）");
       Console.WriteLine($"    实际到账: {(30m - 30m * 0.01m) * jpyRate.Rate:F2} JPY");
        }

  /// <summary>
   /// 示例3：游戏经济系统（开发者接口）
        /// </summary>
        private static async Task Example3_GameEconomyAsync()
     {
     Console.WriteLine("=== 示例3：游戏经济系统（开发者接口） ===\n");

   var economyService = new MetaJadeEconomyService();
     var gameService = new GameEconomyService(economyService);

        // 1. 注册游戏
            Console.WriteLine("【注册游戏】");
            var gameConfig = await gameService.RegisterGameAsync(
   gameID: "fantasy_rpg",
        gameName: "幻想RPG",
                developerID: "dev_studio_001",
         customCurrencyName: "金币",
        customCurrencyRate: 10m  // 10金币 = 1玄玉币
     );

     Console.WriteLine($"  游戏ID: {gameConfig.GameID}");
  Console.WriteLine($"  游戏名称: {gameConfig.GameName}");
      Console.WriteLine($"  自定义货币: {gameConfig.CustomCurrencyName}");
            Console.WriteLine($"  兑换率: 10 {gameConfig.CustomCurrencyName} = 1 玄玉币");
      Console.WriteLine($"  开发者分成: {gameConfig.DeveloperRevenueShare:P}");
   Console.WriteLine($"  平台分成: {gameConfig.PlatformRevenueShare:P}");

            // 2. 创建游戏物品
            Console.WriteLine($"\n【创建游戏物品】");
            var items = new[]
 {
     await gameService.CreateGameItemAsync(
       "fantasy_rpg", "传说之剑", 10m, "武器", "传说", isTradable: true),
    await gameService.CreateGameItemAsync(
   "fantasy_rpg", "魔法药水", 0.5m, "消耗品", "普通", isTradable: true),
       await gameService.CreateGameItemAsync(
        "fantasy_rpg", "龙鳞铠甲", 5m, "装备", "稀有", isTradable: true)
 };

    foreach (var item in items)
      {
       Console.WriteLine($"  ? {item.ItemName}");
        Console.WriteLine($"    类型: {item.ItemType} | 稀有度: {item.Rarity}");
      Console.WriteLine($"    价格: {item.PriceInXuanYu} 玄玉币 = {item.PriceInCustomCurrency} {gameConfig.CustomCurrencyName}");
      Console.WriteLine($"    可交易: {(item.IsTradable ? "是" : "否")}");
       }

            // 3. 玩家购买物品
         Console.WriteLine($"\n【玩家购买物品】");
      var player = await economyService.CreateAccountAsync("player_001", AccountType.Personal);
          
     // 充值
       await economyService.ExchangeAsync(player.AccountID, 100m, CurrencyType.CNY, isDeposit: true);
         Console.WriteLine($"  玩家充值: 100 人民币 → 100 玄玉币");

  // 购买传说之剑
            var purchaseTx = await gameService.PurchaseItemAsync(
    "player_001",
 "fantasy_rpg",
          items[0].ItemID,
           quantity: 1
  );

    Console.WriteLine($"\n  ? 购买成功: {items[0].ItemName}");
       Console.WriteLine($"    支付: {items[0].PriceInXuanYu} 玄玉币");
     Console.WriteLine($"    交易ID: {purchaseTx.TransactionID}");

      // 查看库存
    var inventory = await gameService.GetPlayerInventoryAsync("player_001", "fantasy_rpg");
   Console.WriteLine($"\n  玩家库存:");
 foreach (var invItem in inventory!.Items)
            {
                var itemInfo = await gameService.GetGameItemAsync(invItem.ItemID);
 Console.WriteLine($"    ? {itemInfo!.ItemName} x{invItem.Quantity}");
   }

    // 4. 游戏奖励玩家
   Console.WriteLine($"\n【游戏奖励】");
            var rewardTx = await gameService.RewardPlayerAsync(
   "fantasy_rpg",
       "player_001",
  amountInXuanYu: 5m,
                reason: "完成主线任务"
            );

 Console.WriteLine($"  ? 奖励发放成功");
        Console.WriteLine($"    奖励金额: {rewardTx.Amount} 玄玉币");
       Console.WriteLine($"    奖励原因: {rewardTx.Description}");

            // 5. 游戏统计
     Console.WriteLine($"\n【游戏经济统计】");
            var stats = await gameService.GetGameStatisticsAsync("fantasy_rpg");
            Console.WriteLine($"  总交易数: {stats.TotalTransactions}");
            Console.WriteLine($"  交易总额: {stats.TotalTransactionVolume} 玄玉币");
Console.WriteLine($"  开发者收益: {stats.DeveloperRevenue} 玄玉币");
            Console.WriteLine($"  平台收益: {stats.PlatformRevenue} 玄玉币");
        }

        /// <summary>
        /// 示例4：游戏市场（物品交易市场）
     /// </summary>
        private static async Task Example4_GameMarketplaceAsync()
        {
            Console.WriteLine("=== 示例4：游戏市场（物品交易市场） ===\n");

            var economyService = new MetaJadeEconomyService();
   var gameService = new GameEconomyService(economyService);

            // 准备环境
        await gameService.RegisterGameAsync("mmorpg", "大型多人在线RPG", "dev_002");
  var sword = await gameService.CreateGameItemAsync("mmorpg", "屠龙刀", 20m, "武器", "史诗");

  // 创建两个玩家
  var seller = await economyService.CreateAccountAsync("seller_001", AccountType.Personal);
    var buyer = await economyService.CreateAccountAsync("buyer_001", AccountType.Personal);

          // 充值
 await economyService.ExchangeAsync(seller.AccountID, 100m, CurrencyType.CNY, true);
            await economyService.ExchangeAsync(buyer.AccountID, 100m, CurrencyType.CNY, true);

            // 卖家购买物品
            await gameService.PurchaseItemAsync("seller_001", "mmorpg", sword.ItemID, 2);

            Console.WriteLine("【创建市场订单】");
      Console.WriteLine($"  卖家: seller_001");
            Console.WriteLine($"  物品: {sword.ItemName}");
    Console.WriteLine($"  数量: 1");
       Console.WriteLine($"  单价: 25 玄玉币（高于商店价格20币）");

  // 创建市场订单
    var order = await gameService.CreateMarketOrderAsync(
    sellerUserID: "seller_001",
     gameID: "mmorpg",
 itemID: sword.ItemID,
      quantity: 1,
    pricePerUnit: 25m,
     expiryHours: 24
     );

            Console.WriteLine($"\n  ? 订单创建成功");
            Console.WriteLine($"    订单ID: {order.OrderID}");
   Console.WriteLine($"    总价: {order.TotalPrice} 玄玉币");
        Console.WriteLine($"    过期时间: {order.ExpiresAt:yyyy-MM-dd HH:mm}");

    // 查看市场
    Console.WriteLine($"\n【市场物品列表】");
    var marketOrders = await gameService.GetMarketOrdersAsync("mmorpg", OrderStatus.Active);
 foreach (var o in marketOrders)
            {
 var item = await gameService.GetGameItemAsync(o.ItemID);
     Console.WriteLine($"  ? {item!.ItemName} x{o.Quantity}");
    Console.WriteLine($"    卖家: {o.SellerUserID}");
             Console.WriteLine($"    单价: {o.PricePerUnit} 玄玉币");
       Console.WriteLine($"    总价: {o.TotalPrice} 玄玉币");
      }

            // 买家购买
            Console.WriteLine($"\n【购买市场订单】");
            Console.WriteLine($"  买家: buyer_001");
     var buyTx = await gameService.PurchaseMarketOrderAsync("buyer_001", order.OrderID);

            Console.WriteLine($"  ? 购买成功");
    Console.WriteLine($"    交易ID: {buyTx.TransactionID}");
        Console.WriteLine($"    支付: {buyTx.Amount} 玄玉币");
     Console.WriteLine($"    手续费: {buyTx.Fee} 玄玉币");

         // 查看双方库存
            var sellerInv = await gameService.GetPlayerInventoryAsync("seller_001", "mmorpg");
     var buyerInv = await gameService.GetPlayerInventoryAsync("buyer_001", "mmorpg");

   Console.WriteLine($"\n  卖家库存: {sellerInv!.Items.FirstOrDefault()?.Quantity ?? 0} 件");
            Console.WriteLine($"  买家库存: {buyerInv!.Items.Count} 件");
        }

  /// <summary>
    /// 示例5：玩家间P2P交易
        /// </summary>
     private static async Task Example5_P2PTradingAsync()
 {
            Console.WriteLine("=== 示例5：玩家间P2P交易 ===\n");

  var economyService = new MetaJadeEconomyService();
            var gameService = new GameEconomyService(economyService);

            // 准备环境
   await gameService.RegisterGameAsync("card_game", "卡牌大师", "dev_003");
      var rareCard = await gameService.CreateGameItemAsync(
    "card_game", "传说卡牌·凤凰", 15m, "卡牌", "传说", isTradable: true
            );

            // 创建玩家
       var player1 = await economyService.CreateAccountAsync("player_alice", AccountType.Personal);
        var player2 = await economyService.CreateAccountAsync("player_bob", AccountType.Personal);

            // 充值
         await economyService.ExchangeAsync(player1.AccountID, 100m, CurrencyType.CNY, true);
    await economyService.ExchangeAsync(player2.AccountID, 100m, CurrencyType.CNY, true);

            // Alice购买卡牌
        await gameService.PurchaseItemAsync("player_alice", "card_game", rareCard.ItemID);

  Console.WriteLine("【P2P交易场景】");
            Console.WriteLine($"  Alice 拥有: {rareCard.ItemName}");
        Console.WriteLine($"  Bob 想要购买");
       Console.WriteLine($"  协商价格: 20 玄玉币（高于商店价15币）");

    // 执行P2P交易
 var tradeTx = await gameService.TradeItemAsync(
        sellerUserID: "player_alice",
         buyerUserID: "player_bob",
  gameID: "card_game",
        itemID: rareCard.ItemID,
    quantity: 1,
        priceInXuanYu: 20m
);

            Console.WriteLine($"\n  ? 交易完成");
          Console.WriteLine($"    交易ID: {tradeTx.TransactionID}");
            Console.WriteLine($"    成交价: {tradeTx.Amount} 玄玉币");
            Console.WriteLine($"    手续费: {tradeTx.Fee} 玄玉币（1%）");

   // 查看库存
            var aliceInv = await gameService.GetPlayerInventoryAsync("player_alice", "card_game");
    var bobInv = await gameService.GetPlayerInventoryAsync("player_bob", "card_game");

            Console.WriteLine($"\n  Alice 库存: {aliceInv?.Items.Count ?? 0} 件");
            Console.WriteLine($"  Bob 库存: {bobInv?.Items.Count ?? 0} 件");

            var bobItem = bobInv?.Items.FirstOrDefault();
            if (bobItem != null)
   {
                var item = await gameService.GetGameItemAsync(bobItem.ItemID);
   Console.WriteLine($"    ? {item!.ItemName} x{bobItem.Quantity}");
            }

            // 账户余额
    var aliceBalance = await economyService.GetBalanceAsync(
           (await economyService.GetUserAccountsAsync("player_alice"))
     .First(a => a.GameID == "card_game").AccountID
 );
         var bobBalance = await economyService.GetBalanceAsync(
         (await economyService.GetUserAccountsAsync("player_bob"))
       .First(a => a.GameID == "card_game").AccountID
      );

         Console.WriteLine($"\n  Alice 游戏账户余额: {aliceBalance} 玄玉币（+20币收入）");
      Console.WriteLine($"  Bob 游戏账户余额: {bobBalance} 玄玉币（-20币支出）");

            Console.WriteLine($"\n  ?? 优势:");
            Console.WriteLine($"    ? 玩家自由定价（市场经济）");
     Console.WriteLine($"    ? 平台收取1%手续费（低成本）");
        Console.WriteLine($"    ? 基于玄玉币结算（安全可靠）");
            Console.WriteLine($"    ? 支持跨游戏交易（统一货币）");
  }
    }
}
