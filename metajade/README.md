# MetaJade核心库

MetaJade核心库提供了P2P网络通信和领域模型数据存储两大核心功能模块，基于libp2p实现的分布式P2P网络通信框架，提供了简单易用的API来构建去中心化应用。

## 目录结构

```
metajade/
├── index.js        # 主入口文件，包含CatPeer、CatHome和JadeDB类
├── jadedb.js       # 数据存储模块，包含JadeDB和领域模型
├── p2p.js          # P2P网络模块，包含CatPeer和CatHome类
├── package.json    # 包配置文件，包含libp2p依赖
└── README.md       # 文档说明
```

## 核心模块

### 1. P2P网络模块

- **JadePeer**: 普通P2P节点，提供与其他节点建立连接、发送消息和接收数据的功能
- **JadeHome**: DHT服务器节点，继承自JadePeer，提供引导节点功能，维护网络拓扑结构，支持数据存储和检索

### 2. 数据存储模块

- **JadeDB**: 领域模型数据库，管理用户账户、软件、商品和系统货币
- **基础模型**: User(用户)、Software(软件)、Product(商品)、Transaction(交易)

## 安装

### NPM安装

```bash
# 先安装依赖
cd metajade
npm install

# 在项目中引用
npm install ../metajade  # 本地开发时使用相对路径
```

或者通过npm仓库安装:

```bash
npm install metajade
```

## 使用示例

### 创建并启动DHT服务器节点 (CatHome)

```javascript
import { CatHome } from 'metajade-p2p';

async function startDHTServer() {
  // 创建DHT服务器实例
  const homeNode = new CatHome({
    port: 9000  // 指定服务器端口
  });

  try {
    // 启动服务器
    await homeNode.start();
    console.log('DHT服务器启动成功');
  
    // 获取引导节点地址
    const bootstrapAddrs = homeNode.getBootstrapAddrs();
    console.log('引导节点地址:', bootstrapAddrs);
  
    // 存储数据到DHT
    await homeNode.storeData('game:lobby:1', JSON.stringify({
      name: '主大厅',
      players: 0,
      maxPlayers: 100
    }));
  } catch (error) {
    console.error('启动DHT服务器失败:', error);
  }
}

startDHTServer();
```

### 创建并连接普通P2P节点 (CatPeer)

```javascript
import { CatPeer } from 'metajade-p2p';

async function startPeer() {
  // 创建普通节点实例，连接到引导节点
  const peerNode = new CatPeer({
    port: 0,  // 自动分配端口
    bootstrap: [
      '/ip4/127.0.0.1/tcp/9000/p2p/QmServerPeerId'  // DHT服务器的multiaddr
    ]
  });

  try {
    // 启动节点
    await peerNode.start();
    console.log('P2P节点启动成功');
  
    // 监听消息事件
    peerNode.on('message', (data) => {
      console.log(`收到来自${data.source}的消息:`, data.message);
    });
  
    // 连接到其他节点
    await peerNode.connect('/ip4/127.0.0.1/tcp/9001/p2p/QmAnotherPeerId');
  
    // 发送消息
    await peerNode.sendMessage('QmAnotherPeerId', 'Hello from MetaJade!');
  } catch (error) {
    console.error('启动P2P节点失败:', error);
  }
}

startPeer();
```

### 在P2P网络中查找节点

```javascript
async function findPeersInNetwork(peerNode) {
  try {
    // 在DHT中查找指定节点
    const foundPeer = await peerNode.findPeer('QmTargetPeerId');
    if (foundPeer) {
      console.log('找到目标节点:', foundPeer.id.toString());
      console.log('节点地址:', foundPeer.multiaddrs);
    }
  } catch (error) {
    console.error('查找节点失败:', error);
  }
}
```

### 从DHT服务器检索数据

```javascript
async function retrieveFromDHT(homeNode) {
  try {
    // 从DHT检索数据
    const data = await homeNode.retrieveData('game:lobby:1');
    if (data) {
      console.log('检索到数据:', JSON.parse(data));
    }
  } catch (error) {
    console.error('检索数据失败:', error);
  }
}
```

## API参考

### CatPeer 类

#### 构造函数

```javascript
new CatPeer(options)
```

- **options**: 配置选项
  - **id**: 可选，预定义的peerId
  - **port**: 可选，监听端口，默认为0（随机分配）
  - **bootstrap**: 可选，引导节点列表

#### 方法

- **start()**: 启动P2P节点
- **stop()**: 停止P2P节点
- **connect(peerAddress)**: 连接到指定节点
- **sendMessage(peerId, message)**: 发送消息到指定节点
- **findPeer(peerId)**: 在DHT中查找节点
- **on(event, handler)**: 注册事件监听器
- **off(event, handler)**: 移除事件监听器

#### 事件

- **message**: 收到消息时触发
- **peer:discovery**: 发现新节点时触发
- **peer:connect**: 节点连接建立时触发
- **peer:disconnect**: 节点连接断开时触发

### CatHome 类 (继承自CatPeer)

#### 构造函数

```javascript
new CatHome(options)
```

- **options**: 配置选项
  - **id**: 可选，预定义的peerId
  - **port**: 可选，监听端口，默认为9000

#### 方法

- **getBootstrapAddrs()**: 获取引导节点地址列表
- **storeData(key, value)**: 存储数据到DHT
- **retrieveData(key)**: 从DHT检索数据

## 技术特点

- **去中心化**: 基于libp2p构建的分布式网络
- **安全性**: 使用Noise协议进行加密通信
- **灵活性**: 支持TCP和WebSocket传输
- **可扩展性**: 内置Kademlia DHT用于节点发现和数据存储
- **模块化**: 清晰的类层次结构，易于扩展

## 依赖项

- **libp2p**: P2P网络核心库
- **@libp2p/tcp**: TCP传输支持
- **@libp2p/websockets**: WebSocket传输支持
- **@libp2p/noise**: 加密通信
- **@libp2p/mplex**: 流复用
- **@libp2p/kad-dht**: Kademlia DHT实现

## 版本历史

- v1.0.0: 初始版本，实现CatPeer和CatHome基础功能

### 数据存储模块使用

```javascript
import { JadeDB } from 'metajade';

// 创建数据库实例
const db = new JadeDB();

// 创建用户
const user = db.createUser({
  username: 'testuser',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  displayName: '测试用户'
});

// 创建软件
const software = db.createSoftware({
  name: 'MetaJade编辑器',
  description: '强大的代码编辑器',
  publisherId: user.id,
  version: '1.0.0',
  price: 100
});

// 创建商品
const product = db.createProduct({
  name: '高级主题包',
  description: '精美UI主题集合',
  sellerId: user.id,
  price: 50,
  category: '插件'
});

// 用户购买软件
const purchaseResult = await db.purchaseSoftware(user.id, software.id);
console.log('购买结果:', purchaseResult);

// 获取用户拥有的软件
const userSoftware = db.getUserSoftware(user.id);
console.log('用户拥有的软件:', userSoftware);

// 导出数据库数据
const dataSnapshot = db.exportData();
// 保存到文件或存储
```

## JadeDB API参考

### 构造函数

```javascript
new JadeDB()
```

### 用户管理方法

- **createUser(userData)**: 创建新用户
- **getUser(userId)**: 获取用户
- **getUserByUsername(username)**: 通过用户名查找用户
- **getUserByEmail(email)**: 通过邮箱查找用户
- **updateUser(userId, updateData)**: 更新用户信息
- **deleteUser(userId)**: 删除用户

### 软件管理方法

- **createSoftware(softwareData)**: 创建新软件
- **getSoftware(softwareId)**: 获取软件
- **getSoftwareByName(name)**: 通过名称查找软件
- **updateSoftware(softwareId, updateData)**: 更新软件信息
- **deleteSoftware(softwareId)**: 删除软件
- **getUserSoftware(userId)**: 获取用户拥有的软件

### 商品管理方法

- **createProduct(productData)**: 创建新商品
- **getProduct(productId)**: 获取商品
- **getProductByName(name)**: 通过名称查找商品
- **updateProduct(productId, updateData)**: 更新商品信息
- **deleteProduct(productId)**: 删除商品
- **getUserProducts(userId)**: 获取用户拥有的商品

### 交易管理方法

- **createTransaction(transactionData)**: 创建新交易
- **executeTransaction(transactionId)**: 执行交易
- **getTransaction(transactionId)**: 获取交易
- **getUserTransactions(userId)**: 获取用户交易记录

### 业务操作方法

- **purchaseSoftware(userId, softwareId)**: 用户购买软件
- **purchaseProduct(userId, productId)**: 用户购买商品
- **transferCoins(fromUserId, toUserId, amount, description)**:// 转账MetaJadeCoins
- **rewardCoins(userId, amount, description)**: 奖励用户MetaJadeCoins

### 数据导入导出

- **exportData()**: 导出数据库数据
- **importData(data)**: 导入数据库数据

## 领域模型

### User(用户)

属性:

- **id**: 用户ID
- **username**: 用户名
- **email**: 邮箱
- **passwordHash**: 密码哈希
- **displayName**: 显示名称
- **avatar**: 头像
- **isActive**: 是否激活
- **isVerified**: 是否已验证
- **roles**: 角色列表
- **permissions**: 权限集合
- **ownedSoftware**: 拥有的软件ID集合
- **ownedProducts**: 拥有的商品ID集合
- **wallet**: 钱包信息

### Software(软件)

属性:

- **id**: 软件ID
- **name**: 名称
- **description**: 描述
- **publisherId**: 发布者ID
- **version**: 版本号
- **price**: 价格
- **tags**: 标签列表
- **isActive**: 是否激活
- **isFeatured**: 是否精选
- **downloadCount**: 下载次数
- **rating**: 评分信息
- **assets**: 资源链接

### Product(商品)

属性:

- **id**: 商品ID
- **name**: 名称
- **description**: 描述
- **sellerId**: 卖家ID
- **price**: 价格
- **category**: 分类
- **tags**: 标签列表
- **isActive**: 是否激活
- **inStock**: 是否有库存
- **quantity**: 库存数量
- **salesCount**: 销售数量
- **rating**: 评分信息

### Transaction(交易)

属性:

- **id**: 交易ID
- **type**: 交易类型
- **fromUserId**: 转出用户ID
- **toUserId**: 转入用户ID
- **amount**: 金额
- **description**: 描述
- **status**: 状态
- **metadata**: 元数据

## 技术特点

- **领域驱动设计**: 基于领域模型的数据结构，清晰表达业务概念
- **完整的用户系统**: 支持用户注册、权限管理和钱包功能
- **商品交易系统**: 支持软件和商品的创建、销售和购买
- **P2P通信**: 基于libp2p的分布式网络通信能力
- **模块化设计**: 独立的P2P和数据存储模块，可单独使用

## 依赖项

- **libp2p**: P2P网络核心库
- **@libp2p/tcp**: TCP传输支持
- **@libp2p/websockets**: WebSocket传输支持
- **@libp2p/noise**: 加密通信
- **@libp2p/mplex**: 流复用
- **@libp2p/kad-dht**: Kademlia DHT实现

## 版本历史

- v1.0.0: 初始版本，实现CatPeer和CatHome基础功能

## 许可证

[MIT](LICENSE)
