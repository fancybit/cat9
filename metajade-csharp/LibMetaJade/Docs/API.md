# LibMetaJade - API 文档

此文档概述 `LibMetaJade` 库的主要 API、核心类型和常见使用示例。该库实现了用于构建玄玉分布式区块网络的组件：区块数据结构、动态共识、混合路由、经济系统、文件分片、消息与 DRM 支持以及智能合约示例。

目录
- 概览
- 快速开始
-主要命名空间与类型速览
 - `LibMetaJade.Domain`
 - `LibMetaJade.Consensus`
 - `LibMetaJade.Network`
 - `LibMetaJade.Economy`
 - `LibMetaJade.Storage`
 - `LibMetaJade.SmartContract`
 - `LibMetaJade.DRM`
 - `LibMetaJade.Messaging`
- 常见场景示例
- 示例项目与参考

---

## 概览
`LibMetaJade` 提供可复用的原语，用于在 P2P/分布式环境中创建、签名、序列化并传播交易区块；计算交易优先级与共识深度；管理游戏/经济账户与交易；执行简单的智能合约示例（版权、虚拟商品交易）；以及用于分片（IPFS 风格）和消息备份的工具。

库采用 .NET9 和 Protobuf 用于区块序列化（`MetaJadeBlock.ToBytes()` / `FromBytes()`）。

## 快速开始
- 引用项目：将 `LibMetaJade` 引入你的解决方案。库按命名空间组织，直接使用核心类型：`MetaJadeBlock`, `TransactionContext`, `SmartContractManager`, `SixDegreeRouter` 等。

- 创建并序列化区块示例：

```csharp
// 简单字节区块
var payload = System.Text.Encoding.UTF8.GetBytes("Hello world");
var block = LibMetaJade.Domain.MetaJadeBlock.Create(payload);
var bytes = block.ToBytes();
// 恢复
var parsed = LibMetaJade.Domain.MetaJadeBlock.FromBytes(bytes);
```

创建带交易上下文以计算共识深度的区块：

```csharp
var ctx = new LibMetaJade.Consensus.TransactionContext {
 Amount =123.45m,
 Sensitivity = LibMetaJade.Consensus.DataSensitivity.Sensitive,
 CurrentNetworkLoad =0.4,
 TransactionType = "virtual_goods",
};
var txBlock = LibMetaJade.Domain.MetaJadeBlock.CreateWithContext(payload, ctx, relations: new[] { "sellerCid", "buyerCid" });
```

`MetaJadeBlock` 会内部计算哈希（SHA256）并生成伪 CID（`bafk...`）。

---

##主要命名空间与类型速览
下面列出库中常用的命名空间及其重要类 / 接口（非穷尽）。文件与示例位置可在仓库的 `LibMetaJade`目录中找到。

### LibMetaJade.Domain
- `MetaJadeBlock` / `MetaJadeBlock<T>`
 - 区块封装：`CID`, `Timestamp`, `Hash`, `PayloadBytes`, `Payload`。
 - 序列化/反序列化：`ToBytes()`, `FromBytes(...)`。
 - 创建：`Create(...)`, `CreateWithContext(...)`。
 - 用于将任意负载封装为区块并包含共识/优先级元信息。

- `MetaJadeNode`：网络节点抽象（实现细节见 `Domain/MetaJadeNode.cs`）。

### LibMetaJade.Consensus
- `TransactionContext`：承载交易元数据（如 `Amount`, `Sensitivity`, `CurrentNetworkLoad`, `TransactionType`, `ParticipantTrustScore`），辅助计算共识深度。
- `DynamicConsensusDepthManager`：基于 `TransactionContext`计算推荐的共识深度并执行模拟验证。
- 枚举：`TransactionPriority`, `DataSensitivity`。

用途：决定某笔交易或区块应该达到的确认深度以保证安全性/性能的权衡。

### LibMetaJade.Network
- `SixDegreeRouter`：基于六度原理的路由查找，提供 `FindShortestPathAsync(...)` 等方法，返回路径信息（跳数 / 信任分数 / 平均延迟）。
- `SocialRouter`、`DualLayerRouter`：用于社交图与混合路由策略。
- `Libp2pP2pService`：libp2p 的 P2P 服务实现（若编译目标支持 libp2p）。
- `HybridNodeInfo`：节点元信息结构体。

用途：支撑节点间消息/区块传播与路径查找。

### LibMetaJade.Economy
- 模型：`MetaJadeAccount`, `Transaction`, `GameEconomyConfig`, `GameItem`, `PlayerInventory`, `MarketOrder` 等。
- 服务：`TransactionService`, `GameEconomyService`, `MetaJadeEconomyService`, `XuanYuEconomyService`——提供交易处理、市场订单、账户管理与统计等。

常见操作：创建账户、发起购买（`Transaction`）、统计收入、处理托管/结算逻辑。

### LibMetaJade.Storage
- `AdaptiveChunkingStrategy`：基于文件大小选择分片策略（适用于 IPFS 风格存储场景）。
-其它存储支撑类型位于 `Storage`目录。用于将大型负载切片并上传到分布式存储。

### LibMetaJade.SmartContract
- `SmartContractManager`：部署与执行合约的管理器（见 `Examples/AdvancedMetaJadeExamples.cs` 的合约示例）。
- 合约模型示例：`CopyrightContract`, `VirtualGoodsTradeContract`（示例代码包含合约创建、部署、执行和激活流程）。

用途：演示如何把应用逻辑封装为合约并部署到链上（示例实现）。

### LibMetaJade.DRM
- `DRMService`, `GameLauncherService`：用于游戏版权、启动与许可验证相关的实现（位于 `DRM`目录）。

### LibMetaJade.Messaging
- `MailboxService`, `MessageBackupManager`, `MessagingModels`：提供消息收发、备份与离线存储策略。

---

## 常见场景示例
仓库内 `LibMetaJade/Examples` 包含多个可直接运行或借鉴的示例：
- `MetaJadeNetworkExamples`：基础用例（区块创建、共识演示、IPFS 分块策略示例）。
- `AdvancedMetaJadeExamples`：高级演示（版权合约、虚拟商品交易、性能监控、网络健康检测）。
- `HybridRoutingExamples`、`DRMExamples`、`EconomyExamples` 等。

### 示例：生成并持久化购买交易区块
```csharp
var tx = new LibMetaJade.Economy.Transaction { TransactionID = Guid.NewGuid().ToString(), Type = LibMetaJade.Economy.TransactionType.Purchase, Amount =42.5m, FromUserID = buyerId, ToUserID = sellerId };
var bytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(tx);
var ctx = new LibMetaJade.Consensus.TransactionContext { Amount = tx.Amount, Sensitivity = LibMetaJade.Consensus.DataSensitivity.Sensitive, CurrentNetworkLoad = await new LibMetaJade.Metrics.DefaultNetworkMetricsProvider().GetNetworkLoadAsync(), TransactionType = "game_purchase" };
var blk = LibMetaJade.Domain.MetaJadeBlock.CreateWithContext(bytes, ctx, relations: new[] { tx.FromUserID, tx.ToUserID });
System.IO.File.WriteAllBytes(System.IO.Path.Combine("chainstorage", blk.CID + ".blk"), blk.ToBytes());
```

### 示例：部署并调用简单合约
参见 `Examples/AdvancedMetaJadeExamples.cs` 中版权与虚拟商品合约的构建、部署与执行流程。

---

## 错误处理与验证
- `MetaJadeBlock.FromBytes` 会在反序列化时验证哈希一致性（不一致会抛异常）。
- 对于重要操作（合约部署、交易执行、网络操作）应捕获异常并审计日志。

---

## 可扩展性与集成点
- 存储：替换 `File.WriteAllBytes(...)` 为 IPFS/远程节点上传逻辑，并将返回 CID 用作区块关系或元数据。
- 共识策略：`DynamicConsensusDepthManager` 可替换或扩展为更复杂的成本-风险评估模型。
- 路由：`SixDegreeRouter` 与 `HybridNodeInfo` 提供扩展点，可集成额外的信任计算或延迟测量。
-经济/合约：当前示例合约是参考实现，可扩展为在真实智能合约运行时或仿真环境中运行。

---

## 在哪查看源代码与更多示例
仓库中的相关文件：
- 区块与域模型： `LibMetaJade/Domain/MetaJadeBlock.cs`, `MetaJadeNode.cs`
- 共识： `LibMetaJade/Consensus`目录
- 网络路由： `LibMetaJade/Network`目录（`SixDegreeRouter.cs`, `SocialRouter.cs` 等）
-经济： `LibMetaJade/Economy`目录（`EconomyModels.cs`, `TransactionService.cs`, `GameEconomyService.cs` 等）
- DRM： `LibMetaJade/DRM`目录
- 存储/分片： `LibMetaJade/Storage`目录
- 示例： `LibMetaJade/Examples`目录（控制台示例）

---

## 联系与贡献
阅读仓库根目录下的 `README.md`、`CONTRIBUTING` 或项目文档获取贡献流程与代码风格指南。若需特定 API 的额外文档或示例（例如 SmartContract 的 API细化），可指出目标子模块，我会生成详细的参考文档或示例调用。

---

## English (Bilingual document)

# LibMetaJade - API Documentation

This document summarizes the main API, core types and common usage examples of the `LibMetaJade` library. The library provides building blocks for constructing the MetaJade distributed block network: block data structures, dynamic consensus, hybrid routing, economy subsystem, file chunking, messaging and DRM support, and smart contract examples.

## Overview
`LibMetaJade` provides reusable primitives to create, sign, serialize and propagate transaction blocks in P2P/distributed environments; compute transaction priority and consensus depth; manage game/economy accounts and transactions; execute simple smart contracts (copyright, virtual goods trading); and utilities for chunking (IPFS-like) and message backups.

The library targets .NET9 and uses Protobuf for block serialization (`MetaJadeBlock.ToBytes()` / `FromBytes()`).

## Quick start
- Reference the project: add `LibMetaJade` to your solution. Use the core types across namespaces, such as `MetaJadeBlock`, `TransactionContext`, `SmartContractManager`, `SixDegreeRouter`.

- Create and serialize a block example:

```csharp
// simple byte block
var payload = System.Text.Encoding.UTF8.GetBytes("Hello world");
var block = LibMetaJade.Domain.MetaJadeBlock.Create(payload);
var bytes = block.ToBytes();
// restore
var parsed = LibMetaJade.Domain.MetaJadeBlock.FromBytes(bytes);
```

Create a block with transaction context to compute consensus depth:

```csharp
var ctx = new LibMetaJade.Consensus.TransactionContext {
 Amount =123.45m,
 Sensitivity = LibMetaJade.Consensus.DataSensitivity.Sensitive,
 CurrentNetworkLoad =0.4,
 TransactionType = "virtual_goods",
};
var txBlock = LibMetaJade.Domain.MetaJadeBlock.CreateWithContext(payload, ctx, relations: new[] { "sellerCid", "buyerCid" });
```

`MetaJadeBlock` computes SHA256 hash of the payload and creates a pseudo-CID (prefixed `bafk...`).

---

### Namespaces and key types

Refer to the Chinese section above for the Chinese descriptions. The English mapping is: Domain, Consensus, Network, Economy, Storage, SmartContract, DRM, Messaging.

### Examples and integration
See the Chinese section for usage snippets; equivalents are available in the Examples folder.

---

If you need a generated HTML site, or an API reference generated from XML comments, I can add DocFX configuration or a minimal script to export documentation as HTML.