# MetaJade ConsoleTest - API 文档

此文档描述 `MetaJade.ConsoleTest` 项目的主要测试接口与使用方法，帮助开发者在本地运行并复现控制台测试场景。

## 概览
`MetaJade.ConsoleTest` 是一个交互式控制台程序，用于演示和测试 `LibMetaJade` 库的功能（区块创建、动态共识深度、六度路由、智能合约示例、虚拟商品交易等）。程序入口为 `Program.Main`，运行后会显示主菜单，提供多个示例与自定义测试项。

##运行前置条件
- .NET9 SDK 已安装
- 在解决方案根目录执行：
 - 使用 IDE运行项目 `MetaJade.ConsoleTest`，或
 - 在命令行中切换到 `MetaJade.ConsoleTest`目录并运行 `dotnet run`

## 主菜单项（功能与对应方法）
- [1] 基础功能演示
 - 方法：`MetaJadeNetworkExamples.RunAllExamplesAsync()`
 - 包含：区块创建示例、六度路由示例、IPFS 分块策略示例等

- [2] 高级功能演示
 - 方法：`AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync()`
 - 包含：版权确权智能合约、虚拟商品交易、性能监控、网络健康检测等

- [3]运行所有示例
 -依序执行基础与高级示例的所有演示

- [4] 自定义测试
 -进入 `RunCustomTestAsync()` 菜单，包含多个可单独运行的测试用例：
 - `TestBlockCreationAsync()` - 区块创建、序列化与哈希验证
 - `TestConsensusDepthAsync()` - 共识深度计算与场景测试
 - `TestSixDegreeRoutingAsync()` - 六度路由查找示例
 - `TestIPFSChunking()` - 自适应分块策略示例
 - `TestCopyrightContractAsync()` -版权合约部署与操作示例
 - `TestVirtualGoodsTradeAsync()` - 虚拟商品交易示例
 - `TestPerformanceAsync()` - 性能压力模拟
 - `TestGameMarketSimulationAsync()` - 新增：游戏市场模拟（详见下文）

##重点测试：TestGameMarketSimulationAsync
位置：`MetaJade.ConsoleTest\Program.cs`

功能概述：
- 创建并持久化模拟数据：
 -10 个买家账户（`XuanYuAccount`）
 -3 个开发者账户（`XuanYuAccount`）
 -8 个游戏项目（`GameEconomyConfig`）
- 随机生成50 笔购买交易（`Transaction`），为每笔交易创建 `MetaJadeBlock`，并将区块字节写入磁盘。

持久化位置：`{运行目录}/ConsoleChain`，每个区块保存为 `{CID}.blk`。

生成区块方式：
- 使用 `MetaJadeBlock.CreateWithContext(payloadBytes, TransactionContext, relations)`，`TransactionContext` 用于计算共识深度与交易优先级。
- 区块采用 SHA256 哈希，并通过内部 `GenerateCid`生成伪 CID（`bafk...` 开头的 base32-like 字符串）。

输出/统计：
- 存储的区块总数
- 总成交额（Total volume）
- 每个游戏的收入统计
- 前5 名买家（按消费总额排序）
- 示例存储区块 CID 列表

示例用途：可用于离线检查区块序列、复现基础经济场景、验证区块序列化/反序列化。

## 可扩展点 / 后续工作建议
- 将磁盘存储的 `.blk` 文件上链或上传到 IPFS 节点：在 `TestGameMarketSimulationAsync` 中替换 `File.WriteAllBytes` 为上传逻辑（可调用项目中已有的存储服务或实现新的 IPFS 客户端）。
- 将生成的交易包装成智能合约并部署到测试链（使用 `SmartContractManager`）。
- 增强快捷键或 UI触发，或把测试改为可配置脚本（例如从 JSON 导入模拟参数）。

##相关类型说明（简要）
- `MetaJadeBlock`：区块封装类型，含 CID、时间戳、哈希、PayloadBytes 等；序列化使用 Protobuf（`ToBytes`/`FromBytes`）。
- `TransactionContext`：交易上下文，用于计算区块共识深度与优先级。
- `XuanYuAccount`：模拟账户类型，包含 `AccountID`、`UserID`、`Balance` 等字段。
- `GameEconomyConfig`：模拟游戏配置信息（`GameID`、`GameName`、`DeveloperID` 等）。
- `Transaction`：表示一笔经济交易（购买/转账），包含金额、参与账户、时间戳等。

## 开发者提示
- 日志：控制台程序在调试模式下会在 IDE 输出窗口显示调试信息。
- 编译：解决方案基于 .NET9，可在 Windows/Mac/Linux 上使用 dotnet CLI 构建。
- 若要在调试时跳过某些耗时示例（例如运行所有示例），可在 `RunAllExamplesAsync` 中注释或限制循环次数。

---

## English (Bilingual document)

# MetaJade ConsoleTest - API Documentation

This document describes the main test interfaces and usage patterns of the `MetaJade.ConsoleTest` project, helping developers run and reproduce console test scenarios locally.

## Overview
`MetaJade.ConsoleTest` is an interactive console application used to demonstrate and test `LibMetaJade` library features (block creation, dynamic consensus depth, six-degree routing, smart contract examples, virtual goods trading, etc.). The program entry point is `Program.Main`, which displays the main menu and exposes several demo and custom test cases.

## Prerequisites
- .NET9 SDK installed
- From the solution root run:
 - Run the `MetaJade.ConsoleTest` project from your IDE, or
 - Switch to `MetaJade.ConsoleTest` folder and run `dotnet run`

## Main menu items (methods)
- [1] Basic demos
 - Method: `MetaJadeNetworkExamples.RunAllExamplesAsync()`
 - Includes: block creation demo, six-degree routing, adaptive chunking

- [2] Advanced demos
 - Method: `AdvancedMetaJadeExamples.RunAllAdvancedExamplesAsync()`
 - Includes: copyright smart contract, virtual goods trade, performance monitoring

- [3] Run all examples
 - Executes basic and advanced demos sequentially

- [4] Custom tests
 - Enters `RunCustomTestAsync()` menu that includes independent test cases:
 - `TestBlockCreationAsync()` - block creation, serialization and hash verification
 - `TestConsensusDepthAsync()` - consensus depth scenarios
 - `TestSixDegreeRoutingAsync()` - six-degree routing lookup
 - `TestIPFSChunking()` - adaptive chunking demo
 - `TestCopyrightContractAsync()` - copyright contract workflow
 - `TestVirtualGoodsTradeAsync()` - virtual goods trade demo
 - `TestPerformanceAsync()` - performance stress test
 - `TestGameMarketSimulationAsync()` - New: game market simulation (see below)

## Highlight test: TestGameMarketSimulationAsync
Location: `MetaJade.ConsoleTest\Program.cs`

Function summary:
- Create and persist sample data:
 -10 buyer accounts (`XuanYuAccount`)
 -3 developer accounts (`XuanYuAccount`)
 -8 game projects (`GameEconomyConfig`)
- Randomly generate50 purchase transactions (`Transaction`), create a `MetaJadeBlock` for each and write block bytes to disk.

Persistence location: `{run directory}/ConsoleChain`, one file per block named `{CID}.blk`.

Block creation:
- Uses `MetaJadeBlock.CreateWithContext(payloadBytes, TransactionContext, relations)` to compute consensus depth and priority.
- Blocks are hashed with SHA256 and assigned a pseudo-CID with `bafk...` prefix.

Outputs & stats:
- Total stored blocks
- Total purchase volume
- Revenue per game
- Top5 buyers by spending
- Sample stored block CIDs

Use cases: offline block inspection, economic scenario replay, serialization/validation testing.

---

If you want this doc integrated into project README or exported to HTML, or a block reader/validator tool for `ConsoleChain`, I can add that.