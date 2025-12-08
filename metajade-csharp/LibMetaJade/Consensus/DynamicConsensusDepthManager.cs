using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibMetaJade.Domain;

namespace LibMetaJade.Consensus
{
    /// <summary>
    /// 共识深度配置
    /// </summary>
    public class ConsensusDepthConfig
    {
      /// <summary>最小共识深度（层级）</summary>
        public int MinDepth { get; set; } = 1;
        
        /// <summary>最大共识深度（层级）</summary>
        public int MaxDepth { get; set; } = 5;
        
        /// <summary>高价值交易阈值</summary>
        public decimal HighValueThreshold { get; set; } = 10000;
      
        /// <summary>网络负载阈值（超过此值降低共识深度）</summary>
  public double NetworkLoadThreshold { get; set; } = 0.8;
        
        /// <summary>每增加一层深度的验证节点数量增长率</summary>
      public double NodesPerDepthMultiplier { get; set; } = 1.5;
    }

    /// <summary>
    /// 共识结果
    /// </summary>
    public class ConsensusResult
    {
        /// <summary>是否达成共识</summary>
  public bool IsConsensusReached { get; set; }
        
        /// <summary>参与验证的节点数量</summary>
        public int ParticipatingNodes { get; set; }
        
        /// <summary>实际使用的共识深度</summary>
        public int ActualDepth { get; set; }
        
        /// <summary>共识耗时（毫秒）</summary>
   public long ElapsedMilliseconds { get; set; }
        
        /// <summary>验证通过的节点比例</summary>
        public double ApprovalRatio { get; set; }
 
        /// <summary>共识详情</summary>
        public string Details { get; set; } = string.Empty;
    }

    /// <summary>
    /// 动态互信共识深度管理器
    /// 核心创新：根据交易重要性、网络负载动态调整共识深度，实现安全与效率的自适应平衡
    /// </summary>
    public interface IConsensusDepthManager
    {
        /// <summary>
        /// 根据交易上下文计算最优共识深度
        /// </summary>
        int CalculateOptimalDepth(TransactionContext context);
        
      /// <summary>
        /// 使用指定深度验证区块
        /// </summary>
  Task<ConsensusResult> ValidateWithDepthAsync(MetaJadeBlock block, int depth);
    
   /// <summary>
        /// 获取当前网络负载
   /// </summary>
    Task<double> GetCurrentNetworkLoadAsync();
    }

 /// <summary>
    /// 动态共识深度管理器实现
    /// </summary>
    public class DynamicConsensusDepthManager : IConsensusDepthManager
    {
     private readonly ConsensusDepthConfig _config;
     private readonly INetworkMetricsProvider _metricsProvider;

        public DynamicConsensusDepthManager(
       ConsensusDepthConfig? config = null,
          INetworkMetricsProvider? metricsProvider = null)
        {
          _config = config ?? new ConsensusDepthConfig();
   _metricsProvider = metricsProvider ?? new DefaultNetworkMetricsProvider();
        }

        /// <summary>
        /// 计算最优共识深度（核心算法）
        /// </summary>
        public int CalculateOptimalDepth(TransactionContext context)
        {
            // 基础深度由交易优先级决定
       int baseDepth = context.Priority switch
       {
   TransactionPriority.Critical => _config.MaxDepth,      // 5层
          TransactionPriority.High => _config.MaxDepth - 1,      // 4层
       TransactionPriority.Medium => (_config.MaxDepth + _config.MinDepth) / 2, // 3层
    TransactionPriority.Low => _config.MinDepth + 1,       // 2层
       _ => _config.MinDepth
            };

        // 网络负载调整（负载高时降低深度）
if (context.CurrentNetworkLoad > _config.NetworkLoadThreshold)
    {
         int adjustment = (int)Math.Ceiling((context.CurrentNetworkLoad - _config.NetworkLoadThreshold) * 10);
 baseDepth = Math.Max(_config.MinDepth, baseDepth - adjustment);
            }

// 特殊场景调整
 if (context.TransactionType == "copyright" || context.TransactionType == "account_transfer")
   {
              baseDepth = Math.Min(_config.MaxDepth, baseDepth + 1);
    }

            // 首次交易额外验证
     if (context.IsFirstTransaction && baseDepth < _config.MaxDepth)
        {
       baseDepth += 1;
       }

   return Math.Clamp(baseDepth, _config.MinDepth, _config.MaxDepth);
      }

    /// <summary>
        /// 使用指定深度验证区块（模拟实现）
        /// </summary>
    public async Task<ConsensusResult> ValidateWithDepthAsync(MetaJadeBlock block, int depth)
        {
     var startTime = DateTime.UtcNow;
            
       // 计算需要参与验证的节点数量
   int totalNodes = await _metricsProvider.GetTotalActiveNodesAsync();
   int participatingNodes = CalculateParticipatingNodes(totalNodes, depth);

       // 模拟验证过程（实际应调用P2P网络）
          await Task.Delay(50 * depth); // 模拟网络延迟
         
         // 验证区块哈希
            bool hashValid = block.VerifyHash();
        
      // 模拟节点投票（实际应收集真实节点签名）
   double approvalRatio = hashValid ? 0.85 + (depth * 0.03) : 0.0;
    
            var result = new ConsensusResult
      {
     IsConsensusReached = hashValid && approvalRatio >= 0.67, // 2/3多数原则
   ParticipatingNodes = participatingNodes,
        ActualDepth = depth,
        ElapsedMilliseconds = (long)(DateTime.UtcNow - startTime).TotalMilliseconds,
          ApprovalRatio = approvalRatio,
    Details = $"Depth={depth}, Nodes={participatingNodes}, Approval={approvalRatio:P}"
 };

            return result;
     }

        /// <summary>
      /// 获取当前网络负载
        /// </summary>
        public async Task<double> GetCurrentNetworkLoadAsync()
   {
            return await _metricsProvider.GetNetworkLoadAsync();
        }

        /// <summary>
        /// 根据深度计算参与验证的节点数量
        /// </summary>
        private int CalculateParticipatingNodes(int totalNodes, int depth)
        {
     // 基础节点数（最少30%）
            double baseRatio = 0.3;
            
     // 每增加一层深度，参与节点数增加
       double ratio = Math.Min(1.0, baseRatio + (depth - 1) * 0.15);
            
            return (int)(totalNodes * ratio);
  }
    }

    /// <summary>
    /// 网络指标提供者接口
    /// </summary>
    public interface INetworkMetricsProvider
    {
        Task<int> GetTotalActiveNodesAsync();
      Task<double> GetNetworkLoadAsync();
        Task<double> GetAverageTransactionTimeAsync();
    }

    /// <summary>
    /// 默认网络指标提供者（用于开发测试）
    /// </summary>
    public class DefaultNetworkMetricsProvider : INetworkMetricsProvider
    {
        private readonly Random _random = new();

        public Task<int> GetTotalActiveNodesAsync()
        {
            // 模拟100-500个活跃节点
         return Task.FromResult(_random.Next(100, 500));
        }

        public Task<double> GetNetworkLoadAsync()
     {
            // 模拟网络负载 0.2-0.9
            return Task.FromResult(0.2 + _random.NextDouble() * 0.7);
   }

        public Task<double> GetAverageTransactionTimeAsync()
        {
            // 模拟平均交易时间 100-500ms
       return Task.FromResult(100 + _random.NextDouble() * 400);
 }
    }
}
