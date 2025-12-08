using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibMetaJade.Economy
{
    /// <summary>
    /// 玄玉币经济服务 - 核心服务
    /// </summary>
    public class MetaJadeEconomyService
    {
        private readonly Dictionary<string, MetaJadeAccount> _accounts = new();
  private readonly Dictionary<string, Transaction> _transactions = new();
        private readonly Dictionary<CurrencyType, ExchangeRate> _exchangeRates = new();
        private readonly Dictionary<string, GameEconomyConfig> _gameConfigs = new();
    
        // 系统账户
        private const string SYSTEM_ACCOUNT_ID = "system_reserve";
        private const string PLATFORM_ACCOUNT_ID = "platform_revenue";

        public MetaJadeEconomyService()
        {
   InitializeExchangeRates();
        InitializeSystemAccounts();
        }

        /// <summary>
        /// 初始化官方汇率（与人民币1:1，其他遵循官方外汇价格）
      /// </summary>
        private void InitializeExchangeRates()
        {
          // 玄玉币 : 人民币 = 1:1
        _exchangeRates[CurrencyType.CNY] = new ExchangeRate
 {
     FromCurrency = CurrencyType.XuanYu,
       ToCurrency = CurrencyType.CNY,
    Rate = 1.0m,
             Source = "Official",
 MinRate = 1.0m,
   MaxRate = 1.0m,
      AverageRate = 1.0m
         };

            // 其他货币汇率（基于2024年1月官方外汇参考价）
        _exchangeRates[CurrencyType.USD] = new ExchangeRate
            {
  FromCurrency = CurrencyType.XuanYu,
        ToCurrency = CurrencyType.USD,
Rate = 0.14m,  // 1 XuanYu ≈ 0.14 USD (1 USD ≈ 7.2 CNY)
    Source = "Official"
            };

      _exchangeRates[CurrencyType.EUR] = new ExchangeRate
 {
          FromCurrency = CurrencyType.XuanYu,
   ToCurrency = CurrencyType.EUR,
        Rate = 0.13m,  // 1 XuanYu ≈ 0.13 EUR (1 EUR ≈ 7.8 CNY)
Source = "Official"
   };

            _exchangeRates[CurrencyType.JPY] = new ExchangeRate
  {
        FromCurrency = CurrencyType.XuanYu,
        ToCurrency = CurrencyType.JPY,
  Rate = 20.5m,  // 1 XuanYu ≈ 20.5 JPY (1 CNY ≈ 20.5 JPY)
         Source = "Official"
         };

        _exchangeRates[CurrencyType.KRW] = new ExchangeRate
            {
       FromCurrency = CurrencyType.XuanYu,
         ToCurrency = CurrencyType.KRW,
    Rate = 190m,  // 1 XuanYu ≈ 190 KRW (1 CNY ≈ 190 KRW)
     Source = "Official"
    };

        _exchangeRates[CurrencyType.GBP] = new ExchangeRate
      {
       FromCurrency = CurrencyType.XuanYu,
         ToCurrency = CurrencyType.GBP,
          Rate = 0.11m,  // 1 XuanYu ≈ 0.11 GBP (1 GBP ≈ 9.1 CNY)
          Source = "Official"
            };
     }

        /// <summary>
     /// 初始化系统账户
        /// </summary>
        private void InitializeSystemAccounts()
     {
     // 系统储备账户
          _accounts[SYSTEM_ACCOUNT_ID] = new MetaJadeAccount
            {
      AccountID = SYSTEM_ACCOUNT_ID,
        UserID = "system",
        AccountType = AccountType.System,
     Balance = 1000000000m,  // 10亿玄玉币储备
       IsLocked = false
            };

     // 平台收益账户
         _accounts[PLATFORM_ACCOUNT_ID] = new MetaJadeAccount
     {
      AccountID = PLATFORM_ACCOUNT_ID,
           UserID = "platform",
          AccountType = AccountType.System,
          Balance = 0m
      };
        }

        /// <summary>
     /// 创建账户
      /// </summary>
   public async Task<MetaJadeAccount> CreateAccountAsync(
       string userID,
            AccountType accountType = AccountType.Personal,
            string? gameID = null)
     {
     var account = new MetaJadeAccount
     {
                UserID = userID,
           AccountType = accountType,
       GameID = gameID,
      Balance = 0m,
      CreatedAt = DateTimeOffset.UtcNow,
            LastActivityAt = DateTimeOffset.UtcNow
            };

            _accounts[account.AccountID] = account;

            // 新用户奖励（可选）
if (accountType == AccountType.Personal)
        {
   await RewardNewUserAsync(account.AccountID, 10m);  // 赠送10玄玉币
          }

  return await Task.FromResult(account);
        }

        /// <summary>
        /// 获取账户
        /// </summary>
        public async Task<MetaJadeAccount?> GetAccountAsync(string accountID)
{
            return await Task.FromResult(
       _accounts.TryGetValue(accountID, out var account) ? account : null
            );
  }

   /// <summary>
        /// 获取用户的所有账户
      /// </summary>
        public async Task<List<MetaJadeAccount>> GetUserAccountsAsync(string userID)
 {
var accounts = _accounts.Values
         .Where(a => a.UserID == userID)
        .ToList();

      return await Task.FromResult(accounts);
  }

        /// <summary>
     /// 转账（玄玉币 → 玄玉币）
        /// </summary>
     public async Task<Transaction> TransferAsync(
            string fromAccountID,
            string toAccountID,
    decimal amount,
       string? description = null)
        {
   // 验证账户
    var fromAccount = await GetAccountAsync(fromAccountID);
    var toAccount = await GetAccountAsync(toAccountID);

   if (fromAccount == null || toAccount == null)
        throw new InvalidOperationException("账户不存在");

 if (fromAccount.IsLocked || toAccount.IsLocked)
                throw new InvalidOperationException("账户已锁定");

   if (fromAccount.AvailableBalance < amount)
 throw new InvalidOperationException("余额不足");

// 创建交易
          var transaction = new Transaction
            {
     Type = TransactionType.Transfer,
     FromAccountID = fromAccountID,
                ToAccountID = toAccountID,
    FromUserID = fromAccount.UserID,
  ToUserID = toAccount.UserID,
 Amount = amount,
 Currency = CurrencyType.XuanYu,
          Fee = 0m,  // 玄玉币内部转账免手续费
  Description = description,
                Status = TransactionStatus.Processing
      };

         // 执行转账
            fromAccount.Balance -= amount;
   fromAccount.TotalSent += amount;
      fromAccount.LastActivityAt = DateTimeOffset.UtcNow;

   toAccount.Balance += amount;
   toAccount.TotalReceived += amount;
            toAccount.LastActivityAt = DateTimeOffset.UtcNow;

            // 更新交易状态
   transaction.Status = TransactionStatus.Completed;
         transaction.CompletedAt = DateTimeOffset.UtcNow;

      // 生成交易哈希和签名
       transaction.Hash = GenerateTransactionHash(transaction);
            transaction.Signature = SignTransaction(transaction);

            _transactions[transaction.TransactionID] = transaction;

            return transaction;
        }

        /// <summary>
        /// 兑换货币（玄玉币 ? 法币）
        /// </summary>
   public async Task<Transaction> ExchangeAsync(
            string accountID,
 decimal amount,
            CurrencyType targetCurrency,
          bool isDeposit = true)  // true: 充值（法币→玄玉币），false: 提现（玄玉币→法币）
        {
      var account = await GetAccountAsync(accountID);
    if (account == null)
        throw new InvalidOperationException("账户不存在");

 // 获取汇率
var exchangeRate = await GetExchangeRateAsync(CurrencyType.XuanYu, targetCurrency);

            Transaction transaction;

     if (isDeposit)
            {
   // 充值：法币 → 玄玉币
      var xuanYuAmount = targetCurrency == CurrencyType.CNY
     ? amount  // 人民币1:1
         : amount / exchangeRate.Rate;

                transaction = new Transaction
    {
    Type = TransactionType.Deposit,
       FromAccountID = SYSTEM_ACCOUNT_ID,
            ToAccountID = accountID,
    ToUserID = account.UserID,
    Amount = xuanYuAmount,
  Currency = CurrencyType.XuanYu,
      ExchangeRate = exchangeRate.Rate,
          Status = TransactionStatus.Processing
      };

       // 增加余额
    account.Balance += xuanYuAmount;
          account.TotalReceived += xuanYuAmount;
            }
  else
      {
            // 提现：玄玉币 → 法币
          if (account.AvailableBalance < amount)
       throw new InvalidOperationException("余额不足");

    var targetAmount = targetCurrency == CurrencyType.CNY
       ? amount  // 人民币1:1
 : amount * exchangeRate.Rate;

// 计算手续费（1%）
    var fee = amount * 0.01m;

       transaction = new Transaction
        {
         Type = TransactionType.Withdrawal,
           FromAccountID = accountID,
   ToAccountID = SYSTEM_ACCOUNT_ID,
  FromUserID = account.UserID,
   Amount = amount,
         Fee = fee,
          Currency = CurrencyType.XuanYu,
          ExchangeRate = exchangeRate.Rate,
        Status = TransactionStatus.Processing
     };

     // 扣除余额
            account.Balance -= (amount + fee);
   account.TotalSent += amount;

          // 手续费转入平台
var platformAccount = _accounts[PLATFORM_ACCOUNT_ID];
         platformAccount.Balance += fee;
          }

            transaction.Status = TransactionStatus.Completed;
      transaction.CompletedAt = DateTimeOffset.UtcNow;
      transaction.Hash = GenerateTransactionHash(transaction);

            account.LastActivityAt = DateTimeOffset.UtcNow;
            _transactions[transaction.TransactionID] = transaction;

     return transaction;
        }

        /// <summary>
     /// 获取汇率
        /// </summary>
        public async Task<ExchangeRate> GetExchangeRateAsync(
 CurrencyType fromCurrency,
       CurrencyType toCurrency)
        {
            if (fromCurrency == toCurrency)
    {
      return new ExchangeRate
         {
   FromCurrency = fromCurrency,
          ToCurrency = toCurrency,
  Rate = 1.0m
        };
  }

 if (_exchangeRates.TryGetValue(toCurrency, out var rate))
            {
         return await Task.FromResult(rate);
      }

            throw new InvalidOperationException($"不支持的货币类型: {toCurrency}");
        }

        /// <summary>
        /// 更新汇率（根据官方外汇价格）
  /// </summary>
 public async Task UpdateExchangeRateAsync(
            CurrencyType currency,
      decimal newRate,
    string source = "Official")
        {
   if (!_exchangeRates.TryGetValue(currency, out var exchangeRate))
            {
       exchangeRate = new ExchangeRate
 {
     FromCurrency = CurrencyType.XuanYu,
          ToCurrency = currency
  };
     _exchangeRates[currency] = exchangeRate;
            }

    // 记录历史
            exchangeRate.History.Add(new RateHistory
            {
                Rate = exchangeRate.Rate,
   Timestamp = DateTimeOffset.UtcNow
            });

     // 更新汇率
          exchangeRate.Rate = newRate;
 exchangeRate.Source = source;
     exchangeRate.UpdatedAt = DateTimeOffset.UtcNow;

            // 计算汇率范围
       if (exchangeRate.History.Count > 0)
       {
  exchangeRate.MinRate = exchangeRate.History.Min(h => h.Rate);
      exchangeRate.MaxRate = exchangeRate.History.Max(h => h.Rate);
  exchangeRate.AverageRate = exchangeRate.History.Average(h => h.Rate);
   }

      await Task.CompletedTask;
}

   /// <summary>
        /// 奖励新用户
        /// </summary>
        private async Task RewardNewUserAsync(string accountID, decimal amount)
{
            var systemAccount = _accounts[SYSTEM_ACCOUNT_ID];
         var userAccount = _accounts[accountID];

     var transaction = new Transaction
     {
    Type = TransactionType.Reward,
   FromAccountID = SYSTEM_ACCOUNT_ID,
      ToAccountID = accountID,
     ToUserID = userAccount.UserID,
       Amount = amount,
       Description = "新用户注册奖励",
     Status = TransactionStatus.Completed,
   CompletedAt = DateTimeOffset.UtcNow
      };

      systemAccount.Balance -= amount;
          userAccount.Balance += amount;
        userAccount.TotalReceived += amount;

            _transactions[transaction.TransactionID] = transaction;

      await Task.CompletedTask;
        }

        /// <summary>
        /// 获取交易记录
        /// </summary>
        public async Task<List<Transaction>> GetTransactionHistoryAsync(
            string accountID,
      int pageSize = 50,
     int pageIndex = 0)
        {
            var transactions = _transactions.Values
             .Where(t => t.FromAccountID == accountID || t.ToAccountID == accountID)
.OrderByDescending(t => t.CreatedAt)
    .Skip(pageIndex * pageSize)
             .Take(pageSize)
     .ToList();

            return await Task.FromResult(transactions);
 }

  /// <summary>
        /// 获取账户余额
        /// </summary>
     public async Task<decimal> GetBalanceAsync(string accountID)
   {
  var account = await GetAccountAsync(accountID);
        return account?.Balance ?? 0m;
        }

    /// <summary>
        /// 冻结余额（用于交易担保）
        /// </summary>
public async Task<bool> FreezeBalanceAsync(string accountID, decimal amount)
        {
       var account = await GetAccountAsync(accountID);
       if (account == null || account.AvailableBalance < amount)
 return false;

 account.FrozenBalance += amount;
       return true;
   }

        /// <summary>
   /// 解冻余额
        /// </summary>
    public async Task<bool> UnfreezeBalanceAsync(string accountID, decimal amount)
    {
            var account = await GetAccountAsync(accountID);
            if (account == null || account.FrozenBalance < amount)
     return false;

     account.FrozenBalance -= amount;
     return true;
     }

        /// <summary>
        /// 生成交易哈希
        /// </summary>
        private string GenerateTransactionHash(Transaction transaction)
        {
          var data = $"{transaction.TransactionID}{transaction.FromAccountID}{transaction.ToAccountID}{transaction.Amount}{transaction.CreatedAt}";
        return $"hash_{data.GetHashCode():X16}";
    }

        /// <summary>
        /// 签名交易
        /// </summary>
        private string SignTransaction(Transaction transaction)
    {
      return $"sig_{transaction.Hash}_{Guid.NewGuid():N}";
        }

        /// <summary>
        /// 验证交易签名
     /// </summary>
        public async Task<bool> VerifyTransactionAsync(string transactionID)
        {
            if (!_transactions.TryGetValue(transactionID, out var transaction))
    return false;

         // 验证哈希
            var expectedHash = GenerateTransactionHash(transaction);
    return await Task.FromResult(transaction.Hash == expectedHash);
   }

        /// <summary>
        /// 获取经济统计
        /// </summary>
        public async Task<Dictionary<string, object>> GetEconomyStatisticsAsync()
{
       var stats = new Dictionary<string, object>
 {
         ["total_accounts"] = _accounts.Count,
    ["total_balance"] = _accounts.Values.Sum(a => a.Balance),
         ["total_transactions"] = _transactions.Count,
    ["total_transaction_volume"] = _transactions.Values
              .Where(t => t.Status == TransactionStatus.Completed)
           .Sum(t => t.Amount),
       ["active_accounts"] = _accounts.Values
        .Count(a => a.LastActivityAt > DateTimeOffset.UtcNow.AddDays(-30)),
      ["average_balance"] = _accounts.Values.Average(a => a.Balance),
       ["platform_revenue"] = _accounts[PLATFORM_ACCOUNT_ID].Balance
        };

         return await Task.FromResult(stats);
        }

        /// <summary>
        /// 清理缓存
        /// </summary>
      public void ClearCache()
  {
            // 保留系统账户
       var systemAccounts = _accounts
                .Where(kv => kv.Value.AccountType == AccountType.System)
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            _accounts.Clear();
    foreach (var (key, value) in systemAccounts)
            {
           _accounts[key] = value;
       }
        }
    }
}
