# C#版玄玉区块链核心库桥接层

本目录包含用于将C#版玄玉区块链核心库集成到Node.js应用的桥接层代码。

## 架构设计

1. **C#核心库**：使用 `https://github.com/fancybit/MetaJade.git` 仓库中的 `LibMetaJade` 项目
2. **桥接层**：使用 .NET Core 创建一个 gRPC 服务，暴露 C# 核心库的功能
3. **Node.js客户端**：创建一个 Node.js 客户端，通过 gRPC 调用 C# 核心库的功能

## 功能映射

| 当前功能 | C# 对应功能 |
|----------|-------------|
| MetaJadeHome | LibMetaJade.MetaJadeNode |
| 节点管理 | LibMetaJade.MetaJadeNode |
| DHT 数据存储 | LibMetaJade.P2P.Implementations.Libp2pP2pService |
| 数据检索 | LibMetaJade.P2P.Implementations.Libp2pP2pService |
| 节点发现 | LibMetaJade.P2P.Implementations.Libp2pP2pService |

## 目录结构

```
metajade-csharp/
├── dotnet/               # C# gRPC 服务
│   ├── LibMetaJade/      # C# 核心库（从 GitHub 克隆）
│   ├── MetaJadeBridge/   # gRPC 服务项目
│   └── MetaJadeBridge.sln # 解决方案文件
├── nodejs/               # Node.js gRPC 客户端
│   ├── index.js          # 客户端入口
│   ├── package.json      # 依赖配置
│   └── protos/           # gRPC 协议定义文件
└── README.md             # 说明文档
```

## 实现步骤

1. 克隆 C# 核心库
2. 创建 .NET Core gRPC 服务
3. 实现 gRPC 服务接口，包装 C# 核心库的功能
4. 创建 Node.js gRPC 客户端
5. 重构 dhtService.js，使用 Node.js gRPC 客户端代替直接调用 metajade/p2p.js
6. 测试和验证

## 依赖要求

- .NET 6.0 或更高版本
- Node.js 16.x 或更高版本
- gRPC 运行时
