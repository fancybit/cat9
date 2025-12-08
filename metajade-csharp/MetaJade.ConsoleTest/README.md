# 玄玉区块网络 - 控制台测试项目

## 项目说明

这是玄玉区块网络的独立控制台测试项目，提供交互式菜单和完整的功能演示。

## 功能特性

### ?? 主菜单
1. **基础功能演示**
   - 动态共识深度演示
   - 六度原理路由
   - IPFS自适应分块策略
   - 完整游戏道具交易流程

2. **高级功能演示**
   - 版权确权完整流程
   - 虚拟商品交易流程
   - 性能监控与统计
   - 网络健康检测

3. **运行所有示例**
   - Phase 1 + Phase 2 完整演示
   - 大约需要5分钟

4. **自定义测试**
   - 创建区块并验证
   - 测试共识深度计算
   - 测试六度路由
   - 测试IPFS分块
   - 测试版权合约
   - 测试虚拟商品交易
   - 性能压力测试

5. **关于**
   - 项目信息与技术架构

## 快速开始

### 构建项目
```bash
cd MetaJade.ConsoleTest
dotnet build
```

### 运行测试
```bash
dotnet run
```

### 从解决方案根目录运行
```bash
dotnet run --project MetaJade.ConsoleTest
```

## 使用示例

### 示例1: 运行基础功能演示
```
请输入选项 (0-5): 1

═══════════════════════════════════════════════════════════
    基础功能演示
═══════════════════════════════════════════════════════════

╔══════════════════════════════════════════════════════════╗
║          玄玉区块网络 (MetaJade Network)       ║
║    动态共识深度 + 六度原理 + IPFS 自适应分块    ║
╚══════════════════════════════════════════════════════════╝

=== 示例1：动态共识深度演示 ===
...
```

### 示例2: 自定义测试 - 创建区块
```
请选择 (0-7): 1

? 区块创建与验证测试
────────────────────────────────────────────────────────

请输入区块数据: Hello MetaJade

? 普通区块已创建:
   CID: bafk3ryqy5zl3xa5...
   哈希: 1a2b3c4d5e6f7g8h...
   大小: 14 bytes

创建高优先级交易区块...

? 高级区块已创建:
CID: bafklm4k7q2n8wz9..., Priority: High, ConsensusDepth: 4, ...

?? 哈希验证: ? 通过
?? 序列化测试: ? 通过
```

### 示例3: 性能压力测试
```
请选择 (0-7): 7

? 性能压力测试
────────────────────────────────────────────────────────

输入测试交易数量 (默认1000): 5000

?? 开始测试 5000 笔交易...

进度: 100% (5000/5000)

? 测试完成！耗时: 8.32 秒

╔══════════════════════════════════════════════════════════╗
║玄玉区块网络 - 性能监控报告        ║
╚══════════════════════════════════════════════════════════╝

=== 交易统计 ===
总交易数: 5000
成功: 4750 (95.0%)
失败: 250 (5.0%)
TPS (每秒交易数): 601.44
...
```

## 测试功能详解

### 1. 区块创建与验证测试
- 创建普通区块
- 创建带交易上下文的高级区块
- 验证区块哈希
- 测试序列化/反序列化

### 2. 共识深度计算测试
测试场景包括：
- 小额交易（?50）→ 1-2层深度
- 中等交易（?1000）→ 2-3层深度
- 高价值交易（?15000）→ 3-4层深度
- 版权确权 → 5层深度
- 账户转移 → 5层深度

### 3. 六度原理路由测试
- 输入起始和目标节点CID
- 查找最短路径（≤6跳）
- 显示信任评分和预估延迟
- 网络拓扑优化

### 4. IPFS分块策略测试
展示不同文件大小的分块策略：
- 小文件（<1MB）→ 不分块
- 中等文件（1-100MB）→ 256KB分块
- 大文件（100MB-1GB）→ 2MB分块
- 超大文件（>1GB）→ 4MB分块

### 5. 版权合约测试
- 创建版权信息
- 部署版权合约
- 激活合约
- 显示合约摘要

### 6. 虚拟商品交易测试
- 创建虚拟商品信息
- 创建交易合约
- 部署并激活合约
- 显示交易摘要

### 7. 性能压力测试
- 自定义测试交易数量
- 实时显示进度
- 生成完整性能报告
- 显示TPS、成功率、平均确认时间等

## 项目结构

```
MetaJade.ConsoleTest/
├── MetaJade.ConsoleTest.csproj    # 项目文件
├── Program.cs       # 主程序
└── README.md             # 本文档
```

## 依赖项

- **LibMetaJade** - 玄玉区块网络核心库
- **.NET 9.0** - 运行时
- **System.Text.Json** - JSON序列化

## 技术特点

### 交互式菜单
- 清晰的导航结构
- 彩色控制台输出
- 用户友好的提示信息

### 完整的错误处理
- 捕获并显示详细错误信息
- 友好的错误提示
- 程序不会意外崩溃

### 灵活的测试选项
- 可单独测试每个功能
- 可运行完整演示
- 支持自定义参数输入

### 性能优化
- 异步操作支持
- 高效的数据处理
- 实时进度显示

## 输出示例

### 欢迎界面
```
╔════════════════════════════════════════════════════════════════╗
║         ║
║  玄玉区块网络 (MetaJade Network)     ║
║    控制台测试程序 v2.0         ║
║         ║
║  基于区块链、六度原理与IPFS的分布式网络           ║
║  动态共识深度 + 智能合约 + 性能监控   ║
║          ║
╚════════════════════════════════════════════════════════════════╝
```

### 共识深度测试输出
```
场景测试:
--------------------------------------------------------------------------------
场景       金额         敏感度       类型        优先级     深度  
--------------------------------------------------------------------------------
小额交易        ?50.00       Normal       payment    Low      2     
中等交易        ?1,000.00    Normal       virtual_goods        Medium     3     
高价值交易      ?15,000.00   Sensitive    rare_item            High   4     
版权确权        ?0.00Critical   copyright          Critical   5     
账户转移        ?5,000.00    Critical     account_transfer   Critical   5     
--------------------------------------------------------------------------------
```

## 常见问题

### Q: 如何退出程序？
A: 在主菜单输入 `0`、`exit` 或 `quit`

### Q: 如何跳过长时间的测试？
A: 按 `Ctrl+C` 中断当前测试

### Q: 为什么性能测试结果不一致？
A: 测试使用随机数据和模拟延迟，每次结果会有所不同

### Q: 如何查看详细的技术架构？
A: 选择主菜单的 `[5] 关于`

## 开发建议

### 添加新测试
1. 在 `RunCustomTestAsync()` 方法中添加菜单选项
2. 实现新的测试方法（参考 `TestBlockCreationAsync()`）
3. 使用 `ShowSubHeader()` 显示测试标题
4. 使用 `ShowSuccess()` / `ShowError()` 显示结果

### 自定义颜色
```csharp
Console.ForegroundColor = ConsoleColor.Cyan;  // 青色
Console.ForegroundColor = ConsoleColor.Yellow; // 黄色
Console.ForegroundColor = ConsoleColor.Green;  // 绿色
Console.ForegroundColor = ConsoleColor.Red;    // 红色
Console.ResetColor(); // 重置颜色
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

本项目遵循玄玉区块网络的开源许可证。

---

**玄玉区块网络控制台测试项目** - 完整的功能演示与交互式测试平台 ??
