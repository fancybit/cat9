using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LibMetaJade.Consensus;
using LibMetaJade.Domain;

namespace LibMetaJade.Monitoring
{
    /// <summary>
    /// 性能指标
    /// </summary>
    public class PerformanceMetrics
    {
 /// <summary>总交易数</summary>
 public long TotalTransactions { get; set; }

        /// <summary>成功交易数</summary>
     public long SuccessfulTransactions { get; set; }

        /// <summary>失败交易数</summary>
        public long FailedTransactions { get; set; }

        /// <summary>平均交易确认时间（毫秒）</summary>
    public double AverageConfirmationTime { get; set; }

        /// <summary>平均共识深度</summary>
        public double AverageConsensusDepth { get; set; }

        /// <summary>平均参与节点数</summary>
        public double AverageParticipatingNodes { get; set; }

  /// <summary>网络平均负载</summary>
        public double AverageNetworkLoad { get; set; }

        /// <summary>每秒交易数（TPS）</summary>
        public double TransactionsPerSecond { get; set; }

      /// <summary>总数据量（字节）</summary>
        public long TotalDataSize { get; set; }

    /// <summary>各优先级交易统计</summary>
        public Dictionary<TransactionPriority, long> TransactionsByPriority { get; set; } = new();

      /// <summary>统计时间范围</summary>
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
    }

    /// <summary>
    /// 交易记录
    /// </summary>
    public class TransactionRecord
    {
    public string TransactionId { get; set; } = string.Empty;
    public TransactionPriority Priority { get; set; }
        public int ConsensusDepth { get; set; }
        public int ParticipatingNodes { get; set; }
   public double NetworkLoad { get; set; }
        public long ConfirmationTime { get; set; } // 毫秒
        public bool Success { get; set; }
        public long DataSize { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }

    /// <summary>
    /// 网络健康状态
    /// </summary>
    public class NetworkHealthStatus
    {
        /// <summary>总节点数</summary>
        public int TotalNodes { get; set; }

 /// <summary>活跃节点数</summary>
    public int ActiveNodes { get; set; }

        /// <summary>平均节点信任评分</summary>
      public double AverageTrustScore { get; set; }

        /// <summary>网络连通性（0.0-1.0）</summary>
   public double NetworkConnectivity { get; set; }

        /// <summary>平均路由跳数</summary>
        public double AverageRoutingHops { get; set; }

        /// <summary>网络负载</summary>
        public double CurrentLoad { get; set; }

        /// <summary>共识效率（0.0-1.0）</summary>
        public double ConsensusEfficiency { get; set; }

      /// <summary>检测时间</summary>
        public DateTimeOffset CheckTime { get; set; } = DateTimeOffset.UtcNow;

        /// <summary>健康等级</summary>
        public HealthLevel Level => CalculateHealthLevel();

        private HealthLevel CalculateHealthLevel()
        {
   var score = (ActiveNodes / (double)Math.Max(1, TotalNodes) * 0.3) +
       (AverageTrustScore * 0.2) +
            (NetworkConnectivity * 0.2) +
            (ConsensusEfficiency * 0.3);

         return score switch
      {
  >= 0.8 => HealthLevel.Excellent,
      >= 0.6 => HealthLevel.Good,
    >= 0.4 => HealthLevel.Fair,
      >= 0.2 => HealthLevel.Poor,
  _ => HealthLevel.Critical
    };
        }
    }

    /// <summary>
    /// 健康等级
    /// </summary>
    public enum HealthLevel
    {
        Critical,
        Poor,
        Fair,
        Good,
        Excellent
    }

    /// <summary>
    /// 性能监控与统计系统
    /// </summary>
  public class PerformanceMonitor
    {
        private readonly ConcurrentBag<TransactionRecord> _transactions = new();
   private readonly ConcurrentDictionary<TransactionPriority, long> _priorityCounters = new();
        private readonly DateTimeOffset _startTime = DateTimeOffset.UtcNow;
        private long _totalDataSize = 0;

        /// <summary>
        /// 记录交易
        /// </summary>
      public void RecordTransaction(MetaJadeBlock block, long confirmationTimeMs, bool success)
    {
      var record = new TransactionRecord
     {
  TransactionId = block.CID,
                Priority = block.TransactionPriority,
    ConsensusDepth = block.ConsensusDepth,
 ParticipatingNodes = block.ConsensusNodesCount,
      NetworkLoad = block.NetworkLoadSnapshot,
       ConfirmationTime = confirmationTimeMs,
     Success = success,
        DataSize = block.PayloadBytes.Length,
          Timestamp = block.Timestamp
        };

         _transactions.Add(record);
         _priorityCounters.AddOrUpdate(block.TransactionPriority, 1, (_, count) => count + 1);
            Interlocked.Add(ref _totalDataSize, block.PayloadBytes.Length);
      }

   /// <summary>
      /// 获取性能指标
        /// </summary>
  public PerformanceMetrics GetMetrics()
        {
       var transactions = _transactions.ToList();
  var now = DateTimeOffset.UtcNow;
   var duration = (now - _startTime).TotalSeconds;

            var successful = transactions.Where(t => t.Success).ToList();

   return new PerformanceMetrics
 {
    TotalTransactions = transactions.Count,
     SuccessfulTransactions = successful.Count,
                FailedTransactions = transactions.Count - successful.Count,
    AverageConfirmationTime = successful.Any() ? successful.Average(t => t.ConfirmationTime) : 0,
       AverageConsensusDepth = successful.Any() ? successful.Average(t => t.ConsensusDepth) : 0,
         AverageParticipatingNodes = successful.Any() ? successful.Average(t => t.ParticipatingNodes) : 0,
    AverageNetworkLoad = successful.Any() ? successful.Average(t => t.NetworkLoad) : 0,
TransactionsPerSecond = duration > 0 ? transactions.Count / duration : 0,
            TotalDataSize = _totalDataSize,
      TransactionsByPriority = _priorityCounters.ToDictionary(kvp => kvp.Key, kvp => kvp.Value),
       StartTime = _startTime,
                EndTime = now
            };
        }

   /// <summary>
   /// 获取最近N条交易记录
        /// </summary>
   public List<TransactionRecord> GetRecentTransactions(int count = 100)
        {
  return _transactions
 .OrderByDescending(t => t.Timestamp)
    .Take(count)
            .ToList();
   }

        /// <summary>
    /// 获取指定优先级的交易统计
        /// </summary>
        public PerformanceMetrics GetMetricsByPriority(TransactionPriority priority)
 {
            var transactions = _transactions.Where(t => t.Priority == priority).ToList();
   var successful = transactions.Where(t => t.Success).ToList();

    return new PerformanceMetrics
            {
                TotalTransactions = transactions.Count,
     SuccessfulTransactions = successful.Count,
         FailedTransactions = transactions.Count - successful.Count,
        AverageConfirmationTime = successful.Any() ? successful.Average(t => t.ConfirmationTime) : 0,
        AverageConsensusDepth = successful.Any() ? successful.Average(t => t.ConsensusDepth) : 0,
                AverageParticipatingNodes = successful.Any() ? successful.Average(t => t.ParticipatingNodes) : 0,
     TotalDataSize = transactions.Sum(t => t.DataSize),
    StartTime = _startTime,
     EndTime = DateTimeOffset.UtcNow
            };
        }

 /// <summary>
        /// 清除统计数据
  /// </summary>
        public void Clear()
        {
            _transactions.Clear();
            _priorityCounters.Clear();
       Interlocked.Exchange(ref _totalDataSize, 0);
    }

 /// <summary>
    /// 生成性能报告
        /// </summary>
        public string GenerateReport()
    {
   var metrics = GetMetrics();
 var report = new System.Text.StringBuilder();

            report.AppendLine("╔══════════════════════════════════════════════════════════╗");
 report.AppendLine("║          玄玉区块网络 - 性能监控报告             ║");
          report.AppendLine("╚══════════════════════════════════════════════════════════╝");
            report.AppendLine();

            report.AppendLine("=== 交易统计 ===");
      report.AppendLine($"总交易数: {metrics.TotalTransactions}");
    report.AppendLine($"成功: {metrics.SuccessfulTransactions} ({metrics.SuccessfulTransactions * 100.0 / Math.Max(1, metrics.TotalTransactions):F1}%)");
            report.AppendLine($"失败: {metrics.FailedTransactions} ({metrics.FailedTransactions * 100.0 / Math.Max(1, metrics.TotalTransactions):F1}%)");
       report.AppendLine($"TPS (每秒交易数): {metrics.TransactionsPerSecond:F2}");
        report.AppendLine();

   report.AppendLine("=== 共识性能 ===");
report.AppendLine($"平均确认时间: {metrics.AverageConfirmationTime:F2} ms");
            report.AppendLine($"平均共识深度: {metrics.AverageConsensusDepth:F2} 层");
     report.AppendLine($"平均参与节点: {metrics.AverageParticipatingNodes:F0} 个");
            report.AppendLine($"平均网络负载: {metrics.AverageNetworkLoad:P1}");
 report.AppendLine();

report.AppendLine("=== 优先级分布 ===");
            foreach (var priority in Enum.GetValues<TransactionPriority>())
       {
     if (metrics.TransactionsByPriority.TryGetValue(priority, out var count))
                {
   var percentage = count * 100.0 / Math.Max(1, metrics.TotalTransactions);
         report.AppendLine($"{priority}: {count} ({percentage:F1}%)");
        }
            }
     report.AppendLine();

            report.AppendLine("=== 数据统计 ===");
  report.AppendLine($"总数据量: {FormatBytes(metrics.TotalDataSize)}");
            report.AppendLine($"平均区块大小: {(metrics.TotalTransactions > 0 ? FormatBytes(metrics.TotalDataSize / metrics.TotalTransactions) : "N/A")}");
         report.AppendLine();

            report.AppendLine($"统计时间: {metrics.StartTime:yyyy-MM-dd HH:mm:ss} ~ {metrics.EndTime:yyyy-MM-dd HH:mm:ss}");
  report.AppendLine($"持续时间: {(metrics.EndTime - metrics.StartTime).TotalSeconds:F0} 秒");

            return report.ToString();
     }

        private static string FormatBytes(long bytes)
        {
     string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
         while (len >= 1024 && order < sizes.Length - 1)
            {
  order++;
  len /= 1024;
            }
            return $"{len:F2} {sizes[order]}";
  }
    }

    /// <summary>
    /// 网络健康监控器
    /// </summary>
    public class NetworkHealthMonitor
    {
        private readonly IConsensusDepthManager _consensusManager;
        private NetworkHealthStatus _lastStatus = new();

        public NetworkHealthMonitor(IConsensusDepthManager? consensusManager = null)
 {
     _consensusManager = consensusManager ?? new DynamicConsensusDepthManager();
        }

        /// <summary>
        /// 检查网络健康状态
        /// </summary>
 public async Task<NetworkHealthStatus> CheckHealthAsync()
        {
   var totalNodes = await GetTotalNodesAsync();
 var activeNodes = await GetActiveNodesAsync();
          var trustScore = await GetAverageTrustScoreAsync();
        var connectivity = await GetNetworkConnectivityAsync();
  var routingHops = await GetAverageRoutingHopsAsync();
            var load = await _consensusManager.GetCurrentNetworkLoadAsync();
         var efficiency = await GetConsensusEfficiencyAsync();

         _lastStatus = new NetworkHealthStatus
            {
      TotalNodes = totalNodes,
                ActiveNodes = activeNodes,
         AverageTrustScore = trustScore,
           NetworkConnectivity = connectivity,
      AverageRoutingHops = routingHops,
      CurrentLoad = load,
ConsensusEfficiency = efficiency,
    CheckTime = DateTimeOffset.UtcNow
            };

     return _lastStatus;
        }

        /// <summary>
        /// 获取最新健康状态
        /// </summary>
        public NetworkHealthStatus GetLastStatus() => _lastStatus;

        /// <summary>
        /// 生成健康报告
      /// </summary>
        public string GenerateHealthReport()
    {
          var status = _lastStatus;
      var report = new System.Text.StringBuilder();

     report.AppendLine("╔══════════════════════════════════════════════════════════╗");
            report.AppendLine("║          玄玉区块网络 - 网络健康报告        ║");
            report.AppendLine("╚══════════════════════════════════════════════════════════╝");
     report.AppendLine();

          var levelColor = status.Level switch
 {
  HealthLevel.Excellent => "?? 优秀",
                HealthLevel.Good => "?? 良好",
             HealthLevel.Fair => "?? 一般",
 HealthLevel.Poor => "?? 较差",
   HealthLevel.Critical => "? 危险",
 _ => "? 未知"
   };

         report.AppendLine($"健康等级: {levelColor}");
       report.AppendLine();

     report.AppendLine("=== 节点状态 ===");
     report.AppendLine($"总节点数: {status.TotalNodes}");
            report.AppendLine($"活跃节点: {status.ActiveNodes} ({status.ActiveNodes * 100.0 / Math.Max(1, status.TotalNodes):F1}%)");
 report.AppendLine($"平均信任评分: {status.AverageTrustScore:F2}");
            report.AppendLine();

            report.AppendLine("=== 网络性能 ===");
            report.AppendLine($"网络连通性: {status.NetworkConnectivity:P1}");
            report.AppendLine($"平均路由跳数: {status.AverageRoutingHops:F2}");
       report.AppendLine($"当前负载: {status.CurrentLoad:P1}");
    report.AppendLine($"共识效率: {status.ConsensusEfficiency:P1}");
       report.AppendLine();

            report.AppendLine($"检测时间: {status.CheckTime:yyyy-MM-dd HH:mm:ss}");

 return report.ToString();
    }

  // 以下为模拟实现，实际应从P2P网络获取
        private Task<int> GetTotalNodesAsync() => Task.FromResult(new Random().Next(200, 600));
  private Task<int> GetActiveNodesAsync() => Task.FromResult(new Random().Next(150, 500));
     private Task<double> GetAverageTrustScoreAsync() => Task.FromResult(0.6 + new Random().NextDouble() * 0.3);
private Task<double> GetNetworkConnectivityAsync() => Task.FromResult(0.7 + new Random().NextDouble() * 0.25);
        private Task<double> GetAverageRoutingHopsAsync() => Task.FromResult(2.0 + new Random().NextDouble() * 2.0);
        private Task<double> GetConsensusEfficiencyAsync() => Task.FromResult(0.65 + new Random().NextDouble() * 0.3);
    }
}
