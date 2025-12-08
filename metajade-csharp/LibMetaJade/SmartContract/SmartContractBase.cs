using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LibMetaJade.Domain;
using LibMetaJade.Consensus;

namespace LibMetaJade.SmartContract
{
    /// <summary>
    /// 合约状态
    /// </summary>
    public enum ContractState
    {
        /// <summary>已创建，未激活</summary>
        Created,
        /// <summary>已激活，运行中</summary>
 Active,
        /// <summary>已完成</summary>
   Completed,
        /// <summary>已取消</summary>
   Cancelled,
        /// <summary>执行失败</summary>
        Failed
    }

    /// <summary>
    /// 合约类型
    /// </summary>
  public enum ContractType
    {
        /// <summary>版权确权合约</summary>
        Copyright,
      /// <summary>虚拟商品交易合约</summary>
        VirtualGoodsTrade,
        /// <summary>托管交易合约</summary>
        Escrow,
  /// <summary>多签名授权合约</summary>
        MultiSignature,
    /// <summary>自动分配收益合约</summary>
    RevenueSharing
    }

 /// <summary>
    /// 智能合约基类
    /// </summary>
    public abstract class SmartContract
    {
     /// <summary>合约ID（基于合约内容的CID）</summary>
        public string ContractId { get; set; } = string.Empty;

        /// <summary>合约创建者CID</summary>
        public string CreatorCid { get; protected set; } = string.Empty;

/// <summary>合约类型</summary>
        public ContractType Type { get; protected set; }

        /// <summary>合约状态</summary>
        public ContractState State { get; protected set; } = ContractState.Created;

        /// <summary>创建时间</summary>
   public DateTimeOffset CreatedAt { get; protected set; } = DateTimeOffset.UtcNow;

     /// <summary>激活时间</summary>
        public DateTimeOffset? ActivatedAt { get; protected set; }

     /// <summary>完成时间</summary>
        public DateTimeOffset? CompletedAt { get; protected set; }

        /// <summary>合约参与方（CID列表）</summary>
        public List<string> Participants { get; protected set; } = new();

   /// <summary>合约数据（JSON格式）</summary>
        public string ContractData { get; protected set; } = string.Empty;

/// <summary>执行日志</summary>
   public List<ContractExecutionLog> ExecutionLogs { get; protected set; } = new();

    /// <summary>
        /// 验证合约有效性
        /// </summary>
        public abstract Task<ValidationResult> ValidateAsync();

        /// <summary>
  /// 激活合约
        /// </summary>
        public virtual async Task<ExecutionResult> ActivateAsync()
        {
            if (State != ContractState.Created)
   return ExecutionResult.Failure("合约只能从Created状态激活");

      var validation = await ValidateAsync();
        if (!validation.IsValid)
   return ExecutionResult.Failure($"合约验证失败: {validation.ErrorMessage}");

    State = ContractState.Active;
     ActivatedAt = DateTimeOffset.UtcNow;
   
            LogExecution("Activated", "合约已激活");
return ExecutionResult.Success("合约激活成功");
   }

        /// <summary>
        /// 执行合约
        /// </summary>
     public abstract Task<ExecutionResult> ExecuteAsync(Dictionary<string, object> parameters);

 /// <summary>
        /// 取消合约
   /// </summary>
        public virtual Task<ExecutionResult> CancelAsync(string reason)
        {
            if (State == ContractState.Completed)
             return Task.FromResult(ExecutionResult.Failure("已完成的合约无法取消"));

    State = ContractState.Cancelled;
            LogExecution("Cancelled", reason);
            return Task.FromResult(ExecutionResult.Success("合约已取消"));
        }

        /// <summary>
        /// 记录执行日志
  /// </summary>
        protected void LogExecution(string action, string details)
{
          ExecutionLogs.Add(new ContractExecutionLog
     {
         Timestamp = DateTimeOffset.UtcNow,
          Action = action,
     Details = details,
     State = State
         });
    }

  /// <summary>
        /// 获取合约摘要
   /// </summary>
   public virtual string GetSummary()
        {
return $"Contract[{Type}] ID:{ContractId[..16]}... State:{State} Creator:{CreatorCid[..8]}... Participants:{Participants.Count}";
        }
    }

    /// <summary>
    /// 合约执行日志
    /// </summary>
 public class ContractExecutionLog
    {
        public DateTimeOffset Timestamp { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
     public ContractState State { get; set; }
    }

    /// <summary>
    /// 验证结果
    /// </summary>
  public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;

        public static ValidationResult Success() => new() { IsValid = true };
        public static ValidationResult Failure(string message) => new() { IsValid = false, ErrorMessage = message };
    }

    /// <summary>
 /// 执行结果
    /// </summary>
 public class ExecutionResult
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
     public Dictionary<string, object> Data { get; set; } = new();

        public static ExecutionResult Success(string message, Dictionary<string, object>? data = null)
        {
            return new ExecutionResult
        {
     IsSuccess = true,
       Message = message,
                Data = data ?? new()
       };
        }

        public static ExecutionResult Failure(string message)
        {
 return new ExecutionResult
         {
      IsSuccess = false,
                Message = message
};
        }
    }

    /// <summary>
    /// 智能合约管理器
    /// </summary>
    public class SmartContractManager
    {
     private readonly Dictionary<string, SmartContract> _contracts = new();
        private readonly Dictionary<string, List<MetaJadeBlock>> _contractBlocks = new();

        /// <summary>
      /// 部署合约（上链）
        /// </summary>
  public async Task<string> DeployContractAsync(SmartContract contract, TransactionContext context)
        {
            // 验证合约
       var validation = await contract.ValidateAsync();
  if (!validation.IsValid)
     throw new InvalidOperationException($"合约验证失败: {validation.ErrorMessage}");

       // 序列化合约数据
            var contractJson = System.Text.Json.JsonSerializer.Serialize(new
  {
     contract.Type,
  contract.CreatorCid,
   contract.Participants,
contract.ContractData,
            Timestamp = DateTimeOffset.UtcNow
          });

     var contractBytes = Encoding.UTF8.GetBytes(contractJson);

       // 创建区块
       var block = MetaJadeBlock.CreateWithContext(
contractBytes,
 context,
  relations: new[] { contract.CreatorCid }
            );

            // 生成合约ID（使用区块CID）
contract.ContractId = block.CID;

      // 存储合约
            _contracts[contract.ContractId] = contract;
     _contractBlocks[contract.ContractId] = new List<MetaJadeBlock> { block };

            return contract.ContractId;
        }

        /// <summary>
  /// 执行合约并记录到链上
        /// </summary>
        public async Task<ExecutionResult> ExecuteContractAsync(
          string contractId,
Dictionary<string, object> parameters,
            TransactionContext context)
        {
     if (!_contracts.TryGetValue(contractId, out var contract))
    return ExecutionResult.Failure("合约不存在");

       // 执行合约
        var result = await contract.ExecuteAsync(parameters);

     // 记录执行结果到链上
       if (result.IsSuccess)
            {
       var executionRecord = System.Text.Json.JsonSerializer.Serialize(new
      {
          ContractId = contractId,
       ExecutionTime = DateTimeOffset.UtcNow,
      Parameters = parameters,
       Result = result.Message,
    Data = result.Data
       });

                var recordBlock = MetaJadeBlock.CreateWithContext(
     Encoding.UTF8.GetBytes(executionRecord),
          context,
         relations: new[] { contractId }
      );

 _contractBlocks[contractId].Add(recordBlock);
            }

     return result;
        }

        /// <summary>
        /// 获取合约
        /// </summary>
        public SmartContract? GetContract(string contractId)
        {
         return _contracts.GetValueOrDefault(contractId);
     }

        /// <summary>
        /// 获取合约的所有区块记录
 /// </summary>
        public List<MetaJadeBlock> GetContractBlocks(string contractId)
        {
            return _contractBlocks.GetValueOrDefault(contractId) ?? new();
      }

        /// <summary>
        /// 获取所有活跃合约
        /// </summary>
    public List<SmartContract> GetActiveContracts()
        {
            return _contracts.Values
       .Where(c => c.State == ContractState.Active)
   .ToList();
   }
    }
}
