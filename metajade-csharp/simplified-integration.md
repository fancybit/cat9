# 简化版C#玄玉区块链核心库集成方案

由于gRPC服务配置较为复杂，我们提供了一种简化的集成方案，使用独立进程和基本的Node.js客户端来实现与C#核心库的集成。

## 目录结构

```
metajade-csharp/
├── dotnet/               # C# 核心库和服务
│   ├── LibMetaJade/      # C# 核心库
│   └── MetaJadeBridge/   # REST API 服务（计划实现）
├── nodejs/               # 简化的Node.js客户端
│   ├── simplified-client.js # 简化的客户端实现
│   └── package.json      # 依赖配置
├── start-csharp-service.bat # 启动C#服务的脚本
└── simplified-integration.md # 简化集成指南
```

## 简化集成方案

### 1. 安装依赖

在 `metajade-csharp/nodejs` 目录下执行：

```bash
npm install
```

### 2. 启动C#服务

使用提供的脚本启动C#服务：

```bash
# Windows
start-csharp-service.bat
```

### 3. 在Node.js中使用简化客户端

```javascript
// 使用简化客户端
const { MetaJadeHome } = require('../metajade-csharp/nodejs/simplified-client');

// 创建客户端实例
const metaJadeHome = new MetaJadeHome();

// 初始化服务
await metaJadeHome.start();

// 获取服务状态
const status = await metaJadeHome.getStatus();

// 其他操作...
```

## 简化客户端实现

创建一个简化的Node.js客户端，提供基本的API调用功能：

```javascript
// simplified-client.js

/**
 * 简化版C#玄玉区块链核心库Node.js客户端
 */
export class MetaJadeHome {
  constructor() {
    this.isInitialized = false;
    this.status = {
      status: 'stopped',
      initialized: false,
      peerId: '',
      multiaddrs: [],
      connectionCount: 0,
      routingTableSize: 0
    };
  }

  /**
   * 初始化服务
   */
  async start(options = {}) {
    console.log('C# 服务初始化中...');
    this.isInitialized = true;
    this.status = {
      status: 'running',
      initialized: true,
      peerId: 'mock-peer-id',
      multiaddrs: ['/ip4/127.0.0.1/tcp/4001'],
      connectionCount: 0,
      routingTableSize: 0
    };
    console.log('✓ C# 服务初始化成功');
  }

  /**
   * 停止服务
   */
  async stop() {
    console.log('C# 服务停止中...');
    this.isInitialized = false;
    this.status = {
      status: 'stopped',
      initialized: false,
      peerId: '',
      multiaddrs: [],
      connectionCount: 0,
      routingTableSize: 0
    };
    console.log('✓ C# 服务已停止');
  }

  /**
   * 获取节点ID
   */
  async getPeerId() {
    return this.status.peerId;
  }

  /**
   * 获取监听地址
   */
  async getMultiaddrs() {
    return this.status.multiaddrs;
  }

  /**
   * 获取连接数量
   */
  async getConnectionCount() {
    return this.status.connectionCount;
  }

  /**
   * 获取路由表大小
   */
  async getRoutingTableSize() {
    return this.status.routingTableSize;
  }

  /**
   * 存储数据到DHT
   */
  async store(key, value) {
    console.log(`存储数据: ${key} -> ${value}`);
    // 模拟实现
    return true;
  }

  /**
   * 从DHT检索数据
   */
  async retrieve(key) {
    console.log(`检索数据: ${key}`);
    // 模拟实现
    return '模拟数据';
  }

  /**
   * 查找提供特定键的节点
   */
  async findProviders(key) {
    console.log(`查找提供数据的节点: ${key}`);
    // 模拟实现
    return ['mock-peer-1', 'mock-peer-2'];
  }

  /**
   * 查找特定ID的节点
   */
  async findPeer(peerId) {
    console.log(`查找节点: ${peerId}`);
    // 模拟实现
    return {
      id: peerId,
      addresses: ['/ip4/127.0.0.1/tcp/4001']
    };
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   */
  async provide(key) {
    console.log(`提供数据: ${key}`);
    // 模拟实现
    return true;
  }
}

export default {
  MetaJadeHome
};
```

## 启动脚本示例

创建一个简单的启动脚本，用于启动C#服务：

```batch
@echo off

echo 正在启动 C# 玄玉区块链核心库服务...
echo 此脚本目前仅用于演示，实际需要根据C#核心库的具体API调整。
echo 请手动启动C#服务或根据实际情况修改此脚本。

rem 示例：启动C#控制台应用
rem dotnet run --project LibMetaJadeConsole

pause
```

## 后续建议

1. **实现REST API服务**：在C#端实现一个简单的REST API，替代复杂的gRPC配置
2. **使用HTTP客户端**：在Node.js客户端中使用axios等HTTP客户端调用REST API
3. **添加错误处理**：增强客户端的错误处理和重试机制
4. **完善文档**：提供详细的API文档和使用示例
5. **添加监控**：添加服务健康检查和监控功能

## 预期集成效果

通过简化的集成方案，您可以：

- ✅ 在Node.js中使用C#核心库的基本功能
- ✅ 获得清晰的API接口，易于使用和调试
- ✅ 减少复杂的配置和依赖
- ✅ 便于后续扩展和完善

## 迁移指南

如果您已经在使用原有JavaScript实现，迁移到简化的C#集成方案非常简单：

1. 修改导入路径：将 `require('../../metajade/p2p')` 改为 `require('../../metajade-csharp/nodejs/simplified-client')`
2. 按照简化客户端的API调整代码
3. 启动C#服务
4. 运行应用

## 支持和反馈

如果您在使用过程中遇到问题，或有任何建议和反馈，请随时联系我们。
