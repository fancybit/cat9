#玄玉区块网络 (MetaJade Network) - 核心实现

## 概述

玄玉区块网络是一个融合**区块链**、**六度原理**、**IPFS**和**动态共识深度调整机制**的创新型分布式网络架构。本实现包含论文中提出的核心技术组件。

## 核心创新

###1. 动态互信共识深度调整机制 ??
- **自适应平衡**：根据交易重要性、网络负载自动调整共识深度
- **时空复杂度优化**：从传统区块链的 O(n?) 降至 O(logn)
- **安全-效率权衡**：高价值交易5 层深度，普通交易1-2 层深度

###2. 六度原理路由 ??
- **最短路径查找**：基于 BFS 算法，最多6 跳连接任意节点
- **信任评分系统**：综合交易历史、连接度、活跃度计算节点信任
- **网络拓扑优化**：自动识别超级节点并建立快捷连接
- **混合路由支持**：同时支持 P2P物理连接和 SNS 社交关系 ?
 - **双层架构**：物理路由层 + 社交路由层
 - **智能策略**：根据应用场景自动选择最优路径
 - **社交信任**：基于社交关系的多维度信任评估

###3. IPFS 自适应分块 ??
- **动态分块策略**：根据文件大小选择最优分块尺寸
- **存储效率优化**：冗余度从 n 倍降至 logn 倍
- **传输性能提升**：小文件不分块，大文件智能分割

## 架构组件

```
LibMetaJade/
├── Consensus/
│ ├── TransactionPriority.cs #交易优先级评估
│ └── DynamicConsensusDepthManager.cs # 动态共识深度管理
├── Network/
│ ├── SixDegreeRouter.cs # P2P物理路由器
│ ├── SocialModels.cs # ? 社交模型定义
│ ├── SocialRouter.cs # ? 社交路由器
│ ├── HybridNodeInfo.cs # ? 混合节点信息
│ ├── DualLayerRouter.cs # ? 双层路由器
│ └── SocialTrustCalculator.cs # ? 社交信任计算器
├── Storage/
│ └── AdaptiveChunkingStrategy.cs # IPFS 自适应分块
├── Domain/
│ ├── MetaJadeBlock.cs # 区块核心实现（已扩展）
│ └── ...
└── Examples/
 └── MetaJadeNetworkExamples.cs # 使用示例
```

## 快速开始

###1. 创建普通交易区块

```csharp
using LibMetaJade.Consensus;
using LibMetaJade.Domain;

// 定义交易上下文
var context = new TransactionContext
{
 Amount =100, //交易金额
 Sensitivity = DataSensitivity.Normal, // 数据敏感度
CurrentNetworkLoad =0.5, // 网络负载
 TransactionType = "game_item", //交易类型
 ParticipantTrustScore =0.8 //参与方信任度
};

// 创建区块
var block = MetaJadeBlock.CreateWithContext(
 Encoding.UTF8.GetBytes("游戏道具数据"),
 context
);

Console.WriteLine($"优先级: {block.TransactionPriority}"); // Low/Medium/High/Critical
Console.WriteLine($"共识深度: {block.ConsensusDepth} 层"); //1-5 层
Console.WriteLine($"参与节点: {block.ConsensusNodesCount}"); //30%-100%
```

###2. 动态共识验证

```csharp
using LibMetaJade.Consensus;

var depthManager = new DynamicConsensusDepthManager();

// 自动计算最优共识深度
int optimalDepth = depthManager.CalculateOptimalDepth(context);

// 执行共识验证
var result = await depthManager.ValidateWithDepthAsync(block, optimalDepth);

Console.WriteLine($"共识状态: {result.IsConsensusReached}");
Console.WriteLine($"参与节点: {result.ParticipatingNodes}");
Console.WriteLine($"验证通过率: {result.ApprovalRatio:P}");
Console.WriteLine($"耗时: {result.ElapsedMilliseconds}ms");
```

###3. 六度原理路由

```csharp
using LibMetaJade.Network;

// === P2P物理路由 ===
var physicalRouter = new SixDegreeRouter();

// 查找两个节点之间的最短路径
var path = await physicalRouter.FindShortestPathAsync(fromCid, toCid);

Console.WriteLine($"路径跳数: {path.Hops}"); // 通常 ≤6
Console.WriteLine($"信任评分: {path.TotalTrustScore:F2}");
Console.WriteLine($"预估延迟: {path.AverageLatency}ms");

// 优化网络拓扑
await physicalRouter.OptimizeNodeTopologyAsync();

// === SNS 社交路由 ? ===
var socialRouter = new SocialRouter();

// 查找社交关系路径
var socialPath = await socialRouter.FindSocialPathAsync(fromUserID, toUserID);

Console.WriteLine($"社交度数: {socialPath.Degrees}"); // 通常 ≤6
Console.WriteLine($"社交信任: {socialPath.AverageSocialTrust:F2}");
Console.WriteLine($"含影响力用户: {socialPath.HasInfluencer}");

// === 混合智能路由 ? ===
var dualRouter = new DualLayerRouter();

// 自动选择最优路径（物理或社交）
var hybridPath = await dualRouter.FindHybridPathAsync(
 fromIdentifier, // CID 或 UserID
 toIdentifier, // CID 或 UserID
 RoutingStrategy.AdaptiveOptimal, // 自适应策略
 requireTrust: true // 高信任需求
);

Console.WriteLine($"选择策略: {hybridPath.UsedStrategy}");
Console.WriteLine($"信任度: {hybridPath.TotalTrust:F2}");
Console.WriteLine($"是否可信: {hybridPath.IsTrusted}");
Console.WriteLine($"是否快速: {hybridPath.IsFast}");
```

###4. IPFS 自适应分块

```csharp
using LibMetaJade.Storage;

var chunking = new AdaptiveChunkingStrategy();

long fileSize =150 *1024 *1024; //150MB

int chunkSize = chunking.CalculateOptimalChunkSize(fileSize);
int chunkCount = chunking.CalculateChunkCount(fileSize);

Console.WriteLine($"推荐分块大小: {chunkSize /1024}KB");
Console.WriteLine($"分块数量: {chunkCount}");
```

##交易优先级与共识深度映射

|交易类型 | 金额范围 | 敏感度 | 优先级 | 共识深度 |参与节点比例 |
|----------|----------|--------|--------|----------|--------------|
| 普通道具 | <100 | Normal | Low |1-2 层 |30%-50% |
| 中等交易 |100-1000 | Normal | Medium |2-3 层 |50%-60% |
| 高价值商品 |1000-10000 | Sensitive | High |3-4 层 |60%-80% |
|版权/账户转移 | >10000 或特殊类型 | Critical | Critical |5 层 |80%-100% |

## 性能对比（相对于传统区块链）

| 指标 |传统区块链 |玄玉区块网络 | 提升 |
|------|-----------|--------------|------|
|交易确认时间复杂度 | O(n?) ~ O(2?) | O(logn) | **指数级优化** |
| 数据检索复杂度 | O(nlogn) | O(logn) | **线性级优化** |
| 空间复杂度 | O(n) | O(D×logn) | **对数级优化** |
| 节点连接路径长度 | O(n) | O(logn) | **对数级优化** |
| 安全-效率平衡 | 固定（60/100） | 动态可调（60-90/100） | **自适应** |

##运行完整示例

```bash
# 在项目根目录运行
dotnet run --project LibMetaJade

# 或在代码中调用
await LibMetaJade.Examples.MetaJadeNetworkExamples.RunAllExamplesAsync();
```

示例输出：
```
=== 示例1：动态共识深度演示 ===

低价值交易: CID: bafk3ryqy5zl3xa5..., Priority: Low, ConsensusDepth:2, Nodes:30, NetworkLoad:30.0%, Size:48 bytes
高价值交易: CID: bafklm4k7q2n8wz9..., Priority: High, ConsensusDepth:5, Nodes:60, NetworkLoad:50.0%, Size:33 bytes
版权交易: CID: bafkp9x3c6v2bmq4..., Priority: Critical, ConsensusDepth:5, Nodes:80, NetworkLoad:40.0%, Size:60 bytes

--- 共识验证 ---
低价值交易验证: Depth=2, Nodes=94, Approval=91.00%
高价值交易验证: Depth=5, Nodes=180, Approval=100.00%
版权交易验证: Depth=5, Nodes=228, Approval=100.00%
```

## 应用场景

###1. 游戏发行与虚拟商品交易 ??
- **版权保护**：游戏资源加密存储于 IPFS，版权信息上链确权
- **虚拟商品交易**：智能合约托管，交易溯源，二手市场规范
- **账号安全**：多因素认证 + 动态共识深度保障高风险操作

###2. 泛交易领域 ??
- **电商交易**：商品溯源、物流追踪、自动结算
- **知识产权交易**：版权确权、收益分配、侵权追溯
- **数字资产交易**：NFT、数字藏品、虚拟地产

###3. 自媒体社交网络 ??
- **内容版权**：原创内容上链确权，打击盗版
- **隐私保护**：用户数据加密存储，自主控制可见范围
- **社交信任**：基于六度原理的信任网络，内容审核

## 配置与扩展

### 自定义共识深度配置

```csharp
var config = new ConsensusDepthConfig
{
 MinDepth =1, // 最小共识深度
 MaxDepth =7, // 最大共识深度（扩展到7层）
 HighValueThreshold =50000, // 高价值交易阈值
 NetworkLoadThreshold =0.9, // 网络负载阈值
 NodesPerDepthMultiplier =1.8 // 节点增长率
};

var depthManager = new DynamicConsensusDepthManager(config);
```

### 自定义网络指标提供者

```csharp
public class CustomNetworkMetricsProvider : INetworkMetricsProvider
{
 public Task<int> GetTotalActiveNodesAsync()
 {
 // 从 P2P 网络获取实际节点数
 return Task.FromResult(actualNodeCount);
 }

 public Task<double> GetNetworkLoadAsync()
 {
 // 从监控系统获取实际负载
 return Task.FromResult(actualNetworkLoad);
 }

 public Task<double> GetAverageTransactionTimeAsync()
 {
 //统计最近交易的平均时间
 return Task.FromResult(avgTime);
 }
}

var depthManager = new DynamicConsensusDepthManager(
 config: customConfig,
 metricsProvider: new CustomNetworkMetricsProvider()
);
```

## 下一步开发

- [ ] 集成真实的 P2P 网络（libp2p）
- [ ] 实现完整的智能合约引擎
- [ ] 添加 IPFS 节点管理器
- [ ] 实现游戏发行场景的完整 Demo
- [ ] 性能基准测试与优化
- [ ] 多平台客户端（MAUI 实现中）

##许可证

本项目基于玄玉区块网络论文实现，遵循开源协议。

##贡献指南

欢迎提交 Issue 和 Pull Request！

---

**玄玉区块网络** - 融合区块链、六度原理、IPFS与动态共识的下一代分布式网络架构

---

## English (Bilingual document)

# MetaJade Network - Implementation Notes

## Overview

The MetaJade network is an innovative distributed architecture that combines **blockchain**, the **six-degree routing principle**, **IPFS-style chunking**, and a **dynamic consensus depth adjustment mechanism**. This implementation contains the core components described in the associated paper.

## Key Innovations

###1. Dynamic consensus depth adaptation
- Adaptive balance: adjusts consensus depth based on transaction importance and network load
- Time-space complexity optimization: reduces certain operations from O(n) to O(log n)
- Security-efficiency tradeoff: high-value transactions use deeper consensus (e.g.5 layers), ordinary transactions use shallow consensus (1-2 layers)

###2. Six-degree routing
- Shortest path discovery using BFS, typically within6 hops
- Trust scoring: combines transaction history, degree of connection, and activity to compute node trust
- Topology optimization: automatically identifies super-nodes and builds fast-links
- Hybrid routing: supports both P2P physical links and SNS/social relationships
 - Dual-layer architecture: physical + social routing layers
 - Smart policy: automatically selects optimal path per scenario
 - Social trust: multi-dimensional trust evaluation based on social ties

###3. Adaptive IPFS-style chunking
- Chunking strategy chooses optimal chunk sizes by file size
- Storage redundancy optimization: reduces redundancy from linear to logarithmic factors
- Transmission performance: avoids chunking for small files, intelligently splits large files

## Architecture

See the Chinese section for component layout and file mapping.

## Quick start and examples
The English examples appear in the `LibMetaJade/Docs/API.md` file and the `Examples` folder in the codebase.

## Next steps
- Integrate a real P2P network (libp2p)
- Implement an on-chain smart contract engine
- Provide an IPFS node manager and uploader
- Implement a complete game publishing demo
- Add performance benchmarks and tuning
- Ship multi-platform client using MAUI
