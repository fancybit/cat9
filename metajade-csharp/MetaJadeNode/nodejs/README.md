# MetaJade Node SDK

一个用于MetaJadeNode (C# version)的Node.js SDK，提供基础的数据库和文件读写操作。

## 目录

- [MetaJade Node SDK](#metajade-node-sdk)
  - [目录](#目录)
  - [简介](#简介)
  - [安装](#安装)
  - [快速开始](#快速开始)
  - [API文档](#api文档)
    - [初始化](#初始化)
    - [节点管理](#节点管理)
    - [数据操作](#数据操作)
    - [文件操作](#文件操作)
    - [节点信息](#节点信息)
  - [示例代码](#示例代码)
    - [基础用法](#基础用法)
    - [文件操作](#文件操作-1)
  - [测试](#测试)
  - [贡献](#贡献)
  - [许可证](#许可证)

## 简介

MetaJade Node SDK是一个用于与C#版MetaJadeNode交互的Node.js库，提供了以下功能：

- 初始化和管理玄玉节点
- 存储和检索数据到玄玉节点
- 查找提供特定键的节点
- 获取节点状态和信息
- 文件的存储和检索

## 安装

使用npm安装：

```bash
npm install metajade-node-sdk
```

## 快速开始

```javascript
const { MetaJadeNode } = require('metajade-node-sdk');

async function main() {
  // 创建MetaJadeNode实例
  const metaJadeNode = new MetaJadeNode();
  
  // 初始化并启动玄玉节点
  await metaJadeNode.start();
  
  // 存储数据
  await metaJadeNode.store('test-key', 'Hello, MetaJade!');
  
  // 检索数据
  const value = await metaJadeNode.retrieve('test-key');
  console.log(value); // 输出: Hello, MetaJade!
  
  // 停止玄玉节点
  await metaJadeNode.stop();
}

main();
```

## API文档

### 初始化

```javascript
const metaJadeNode = new MetaJadeNode({
  host: 'localhost', // 玄玉节点的IP地址
  port: 5000 // 玄玉节点的端口
});
```

### 节点管理

#### start(options)

初始化并启动玄玉节点

- **参数**:

  - `options`: 玄玉节点配置
    - `port`: 玄玉节点端口，默认为4001
    - `ip`: 玄玉节点IP，默认为0.0.0.0
    - `enableRelay`: 是否启用中继，默认为true
- **返回值**: `Promise<boolean>` - 初始化结果

#### stop()

停止玄玉节点

- **返回值**: `Promise<boolean>` - 停止结果

#### getStatus()

获取玄玉节点状态

- **返回值**: `Promise<Object>` - 节点状态

### 数据操作

#### store(key, value)

存储数据到玄玉节点

- **参数**:

  - `key`: 数据键
  - `value`: 数据值
- **返回值**: `Promise<boolean>` - 存储结果

#### retrieve(key)

从玄玉节点检索数据

- **参数**:

  - `key`: 数据键
- **返回值**: `Promise<string|null>` - 检索到的数据

#### findProviders(key)

查找提供特定键的节点

- **参数**:

  - `key`: 数据键
- **返回值**: `Promise<Array<string>>` - 提供该键的节点列表

#### provide(key)

提供当前节点作为指定键的数据提供者

- **参数**:

  - `key`: 数据键
- **返回值**: `Promise<boolean>` - 提供结果

### 文件操作

#### storeFile(filePath)

存储文件到玄玉节点

- **参数**:

  - `filePath`: 本地文件路径
- **返回值**: `Promise<string>` - 文件的键

#### retrieveFile(fileKey, outputPath)

从玄玉节点检索文件

- **参数**:

  - `fileKey`: 文件的键
  - `outputPath`: 输出文件路径
- **返回值**: `Promise<boolean>` - 检索结果

### 节点信息

#### getPeerId()

获取节点的Peer ID

- **返回值**: `Promise<string>` - 节点的Peer ID

#### getMultiaddrs()

获取节点的多地址列表

- **返回值**: `Promise<Array<string>>` - 节点的多地址列表

#### getConnectionCount()

获取节点的连接数

- **返回值**: `Promise<number>` - 节点的连接数

#### getRoutingTableSize()

获取节点的路由表大小

- **返回值**: `Promise<number>` - 节点的路由表大小

## 示例代码

### 基础用法

```javascript
const { MetaJadeNode } = require('metajade-node-sdk');

async function basicExample() {
  // 创建MetaJadeNode实例
  const metaJadeNode = new MetaJadeNode();
  
  try {
    // 初始化并启动玄玉节点
    console.log('启动玄玉节点...');
    await metaJadeNode.start();
  
    // 获取节点状态
    const status = await metaJadeNode.getStatus();
    console.log('节点状态:', status);
  
    // 存储数据
    console.log('存储数据...');
    await metaJadeNode.store('my-key', 'my-value');
  
    // 检索数据
    console.log('检索数据...');
    const value = await metaJadeNode.retrieve('my-key');
    console.log('检索结果:', value);
  
    // 查找提供者
    console.log('查找提供者...');
    const providers = await metaJadeNode.findProviders('my-key');
    console.log('提供者数量:', providers.length);
  
  } catch (error) {
    console.error('错误:', error);
  } finally {
    // 停止玄玉节点
    console.log('停止玄玉节点...');
    await metaJadeNode.stop();
  }
}

basicExample();
```

### 文件操作

```javascript
const { MetaJadeNode } = require('metajade-node-sdk');
const path = require('path');

async function fileExample() {
  // 创建MetaJadeNode实例
  const metaJadeNode = new MetaJadeNode();
  
  try {
    // 初始化并启动玄玉节点
    await metaJadeNode.start();
  
    // 存储文件
    console.log('存储文件...');
    const filePath = path.join(__dirname, 'test.txt');
    const fileKey = await metaJadeNode.storeFile(filePath);
    console.log('文件键:', fileKey);
  
    // 检索文件
    console.log('检索文件...');
    const outputPath = path.join(__dirname, 'retrieved.txt');
    await metaJadeNode.retrieveFile(fileKey, outputPath);
    console.log('文件已检索到:', outputPath);
  
  } catch (error) {
    console.error('错误:', error);
  } finally {
    // 停止玄玉节点
    await metaJadeNode.stop();
  }
}

fileExample();
```

## 测试

运行测试：

```bash
npm test
```

## 贡献

欢迎贡献代码！请先阅读[贡献指南](CONTRIBUTING.md)。

## 许可证

MIT
