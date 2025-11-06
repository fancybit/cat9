// MetaJade P2P网络库 - 基于libp2p实现的分布式网络通信框架
import Libp2p from 'libp2p';
import TCP from 'libp2p-tcp';
import Websockets from 'libp2p-websockets';
import { NOISE } from 'libp2p-noise';
import MPLEX from 'libp2p-mplex';
import KadDHT from 'libp2p-kad-dht';
import Bootstrap from 'libp2p-bootstrap';
import MulticastDNS from 'libp2p-mdns';

/**
 * CatPeer - 普通P2P节点类
 * 提供节点发现、连接管理和消息收发功能
 */
export class CatPeer {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {string} options.peerId - 可选，自定义peerId
   * @param {number} options.port - 可选，TCP端口号
   * @param {Array} options.bootstrapPeers - 可选，引导节点列表
   */
  constructor(options = {}) {
    this.options = {
      peerId: options.peerId,
      port: options.port || 0,
      bootstrapPeers: options.bootstrapPeers || [],
      enableDHT: options.enableDHT !== false,
      enableMdns: options.enableMdns !== false
    };
    
    this.libp2p = null;
    this.isRunning = false;
    this.messageHandlers = new Map();
    this.connectedPeers = new Set();
    this.discoveredPeers = new Set();
  }

  /**
   * 初始化并启动节点
   */
  async start() {
    if (this.isRunning) {
      console.warn('节点已经在运行中');
      return this;
    }

    // 配置libp2p实例
    const libp2pConfig = {
      modules: {
        transport: [TCP, Websockets],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX],
        peerDiscovery: [],
        dht: this.options.enableDHT ? KadDHT : undefined
      },
      addresses: {
        listen: [`/ip4/0.0.0.0/tcp/${this.options.port}`]
      },
      config: {
        peerDiscovery: {
          mdns: this.options.enableMdns ? { enabled: true } : { enabled: false },
          bootstrap: this.options.bootstrapPeers.length > 0 ? {
            enabled: true,
            list: this.options.bootstrapPeers
          } : { enabled: false }
        }
      }
    };

    // 如果提供了自定义peerId
    if (this.options.peerId) {
      libp2pConfig.peerId = this.options.peerId;
    }

    // 添加引导节点发现
    if (this.options.bootstrapPeers.length > 0) {
      libp2pConfig.modules.peerDiscovery.push(Bootstrap);
    }

    // 添加本地网络发现
    if (this.options.enableMdns) {
      libp2pConfig.modules.peerDiscovery.push(MulticastDNS);
    }

    // 创建libp2p实例
    this.libp2p = await Libp2p.create(libp2pConfig);

    // 设置事件监听器
    this._setupEventListeners();

    // 启动节点
    await this.libp2p.start();
    this.isRunning = true;

    console.log(`MetaJade节点启动成功，监听地址: ${this.getMultiaddrs().join(', ')}`);
    console.log(`节点ID: ${this.libp2p.peerId.toB58String()}`);

    return this;
  }

  /**
   * 停止节点
   */
  async stop() {
    if (!this.isRunning) {
      console.warn('节点未运行');
      return;
    }

    await this.libp2p.stop();
    this.isRunning = false;
    this.connectedPeers.clear();
    this.discoveredPeers.clear();

    console.log('MetaJade节点已停止');
  }

  /**
   * 设置事件监听器
   * @private
   */
  _setupEventListeners() {
    // 发现新节点
    this.libp2p.on('peer:discovery', (peerId) => {
      const peerIdStr = peerId.toB58String();
      if (!this.discoveredPeers.has(peerIdStr)) {
        this.discoveredPeers.add(peerIdStr);
        console.log(`MetaJade: 发现新节点: ${peerIdStr}`);
        this.emit('peer:discovered', peerId);
      }
    });

    // 连接到新节点
    this.libp2p.connectionManager.on('peer:connect', (connection) => {
      const peerIdStr = connection.remotePeer.toB58String();
      this.connectedPeers.add(peerIdStr);
      console.log(`MetaJade: 连接到节点: ${peerIdStr}`);
      this.emit('peer:connected', connection.remotePeer);
    });

    // 从节点断开连接
    this.libp2p.connectionManager.on('peer:disconnect', (connection) => {
      const peerIdStr = connection.remotePeer.toB58String();
      this.connectedPeers.delete(peerIdStr);
      console.log(`MetaJade: 与节点断开连接: ${peerIdStr}`);
      this.emit('peer:disconnected', connection.remotePeer);
    });

    // 处理协议消息
    this.libp2p.handle('/metajade/protocol/1.0.0', async ({ stream, connection }) => {
      const peerId = connection.remotePeer.toB58String();
      let message = '';
      try {
        // 读取消息
        for await (const chunk of stream.source) {
          message += chunk.toString();
        }

        // 解析消息
        const parsedMessage = JSON.parse(message);
        console.log(`MetaJade: 收到来自 ${peerId} 的消息:`, parsedMessage);

        // 处理消息
        const response = await this._processMessage(parsedMessage, peerId);

        // 发送响应
        if (response) {
          const responseData = JSON.stringify(response);
          await stream.sink(responseData);
        }
      } catch (error) {
        console.error(`处理消息时出错: ${error}`);
      } finally {
        // 关闭流
        await stream.close();
      }
    });
  }

  /**
   * 处理接收到的消息
   * @private
   * @param {Object} message - 消息对象
   * @param {string} peerId - 发送方ID
   * @returns {Promise<Object|null>} 响应消息
   */
  async _processMessage(message, peerId) {
    const { type, data } = message;
    
    if (this.messageHandlers.has(type)) {
      const handler = this.messageHandlers.get(type);
      try {
        return await handler(data, peerId);
      } catch (error) {
        console.error(`执行消息处理器出错 (${type}):`, error);
        return { type: 'error', data: { error: error.message } };
      }
    }
    
    console.warn(`未处理的消息类型: ${type}`);
    return { type: 'error', data: { error: `未处理的消息类型: ${type}` } };
  }

  /**
   * 注册消息处理器
   * @param {string} type - 消息类型
   * @param {Function} handler - 处理函数
   */
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * 发送消息到指定节点
   * @param {string} peerId - 目标节点ID
   * @param {string} type - 消息类型
   * @param {*} data - 消息数据
   * @returns {Promise<Object|null>} 响应消息
   */
  async sendMessage(peerId, type, data) {
    if (!this.isRunning) {
      throw new Error('节点未运行');
    }

    // 检查连接
    const connection = this.libp2p.connectionManager.get(peerId);
    if (!connection) {
      // 尝试连接
      try {
        await this.connect(peerId);
      } catch (error) {
        console.error(`连接到节点 ${peerId} 失败:`, error);
        throw new Error(`无法连接到节点 ${peerId}`);
      }
    }

    // 创建消息
    const message = JSON.stringify({ type, data });
    
    try {
      // 打开流并发送消息
      const { stream } = await this.libp2p.dialProtocol(peerId, '/metajade/protocol/1.0.0');
      
      // 发送消息
      await stream.sink(message);
      
      // 接收响应
      let response = '';
      for await (const chunk of stream.source) {
        response += chunk.toString();
      }
      
      // 关闭流
      await stream.close();
      
      return response ? JSON.parse(response) : null;
    } catch (error) {
      console.error(`发送消息到 ${peerId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 广播消息到所有连接的节点
   * @param {string} type - 消息类型
   * @param {*} data - 消息数据
   */
  async broadcastMessage(type, data) {
    if (!this.isRunning) {
      throw new Error('节点未运行');
    }

    const promises = Array.from(this.connectedPeers).map(peerId => 
      this.sendMessage(peerId, type, data).catch(error => {
        console.error(`广播到 ${peerId} 失败:`, error);
      })
    );

    await Promise.all(promises);
  }

  /**
   * 连接到指定节点
   * @param {string|Array} peerIdOrAddress - 节点ID或多地址
   */
  async connect(peerIdOrAddress) {
    if (!this.isRunning) {
      throw new Error('节点未运行');
    }

    try {
      await this.libp2p.dial(peerIdOrAddress);
      console.log(`MetaJade: 成功连接到: ${peerIdOrAddress}`);
    } catch (error) {
      console.error(`连接失败: ${error}`);
      throw error;
    }
  }

  /**
   * 断开与指定节点的连接
   * @param {string} peerId - 节点ID
   */
  async disconnect(peerId) {
    if (!this.isRunning) {
      throw new Error('节点未运行');
    }

    const connection = this.libp2p.connectionManager.get(peerId);
    if (connection) {
      await connection.close();
      console.log(`MetaJade: 成功断开与 ${peerId} 的连接`);
    }
  }

  /**
   * 获取所有连接的节点
   * @returns {Array} 节点ID数组
   */
  getConnectedPeers() {
    return Array.from(this.connectedPeers);
  }

  /**
   * 获取所有发现的节点
   * @returns {Array} 节点ID数组
   */
  getDiscoveredPeers() {
    return Array.from(this.discoveredPeers);
  }

  /**
   * 获取节点的多地址
   * @returns {Array} 多地址数组
   */
  getMultiaddrs() {
    return this.libp2p.multiaddrs.map(ma => ma.toString());
  }

  /**
   * 获取节点ID
   * @returns {string} 节点ID
   */
  getPeerId() {
    return this.libp2p.peerId.toB58String();
  }

  /**
   * 事件发射器方法
   * @param {string} event - 事件名称
   * @param {*} args - 事件参数
   */
  emit(event, ...args) {
    // 简单的事件系统，可以扩展为更完整的实现
    console.log(`事件: ${event}`, args);
  }
}

/**
   * MetaJadeHome - DHT服务器节点类
   * 提供数据存储、检索和引导节点功能
   */
export class MetaJadeHome {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {number} options.port - TCP端口号
   * @param {boolean} options.enableRelay - 是否启用中继服务
   */
  constructor(options = {}) {
    this.options = {
      port: options.port || 4001,
      enableRelay: options.enableRelay !== false
    };
    
    this.libp2p = null;
    this.isRunning = false;
    this.connectedPeers = new Set();
  }

  /**
   * 初始化并启动DHT服务器
   */
  async start() {
    if (this.isRunning) {
      console.warn('MetaJade服务器已经在运行中');
      return this;
    }

    // 配置libp2p实例
    const libp2pConfig = {
      modules: {
        transport: [TCP, Websockets],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX],
        peerDiscovery: [MulticastDNS],
        dht: KadDHT
      },
      addresses: {
        listen: [
          `/ip4/0.0.0.0/tcp/${this.options.port}`,
          `/ip4/0.0.0.0/tcp/${this.options.port + 1}/ws`
        ]
      },
      config: {
        peerDiscovery: {
          mdns: { enabled: true }
        },
        dht: {
          enabled: true,
          kBucketSize: 20,
          randomWalk: {
            enabled: true,
            interval: 1000 * 60 * 5, // 每5分钟执行一次随机漫步
            timeout: 1000 * 60 // 超时1分钟
          },
          relay: {
            enabled: this.options.enableRelay
          }
        }
      }
    };

    // 创建libp2p实例
    this.libp2p = await Libp2p.create(libp2pConfig);

    // 设置事件监听器
    this._setupEventListeners();

    // 启动节点
    await this.libp2p.start();
    this.isRunning = true;

    const multiaddrs = this.getMultiaddrs();
    console.log(`MetaJade DHT服务器启动成功!`);
    console.log(`节点ID: ${this.libp2p.peerId.toB58String()}`);
    console.log(`监听地址:`);
    multiaddrs.forEach(addr => console.log(`  ${addr}`));

    return this;
  }

  /**
   * 停止DHT服务器
   */
  async stop() {
    if (!this.isRunning) {
      console.warn('服务器未运行');
      return;
    }

    await this.libp2p.stop();
    this.isRunning = false;
    this.connectedPeers.clear();

    console.log('MetaJade DHT服务器已停止');
  }

  /**
   * 设置事件监听器
   * @private
   */
  _setupEventListeners() {
    // 连接到新节点
    this.libp2p.connectionManager.on('peer:connect', (connection) => {
      const peerIdStr = connection.remotePeer.toB58String();
      this.connectedPeers.add(peerIdStr);
      console.log(`MetaJade: 新节点连接: ${peerIdStr}`);
    });

    // 从节点断开连接
    this.libp2p.connectionManager.on('peer:disconnect', (connection) => {
      const peerIdStr = connection.remotePeer.toB58String();
      this.connectedPeers.delete(peerIdStr);
      console.log(`MetaJade: 节点断开连接: ${peerIdStr}`);
    });

    // DHT就绪
    this.libp2p.dht.on('ready', () => {
      console.log('MetaJade DHT服务就绪');
    });

    // DHT启动随机漫步
    this.libp2p.dht.on('random-walk:start', () => {
      console.log('MetaJade DHT开始随机漫步');
    });

    // DHT随机漫步完成
    this.libp2p.dht.on('random-walk:done', () => {
      console.log('MetaJade DHT随机漫步完成');
    });
  }

  /**
   * 存储数据到DHT
   * @param {string} key - 键
   * @param {string|Buffer} value - 值
   */
  async store(key, value) {
    if (!this.isRunning) {
      throw new Error('服务器未运行');
    }

    try {
      await this.libp2p.dht.put(key, Buffer.from(value));
      console.log(`MetaJade: 成功存储数据: ${key}`);
      return true;
    } catch (error) {
      console.error(`存储数据失败: ${error}`);
      return false;
    }
  }

  /**
   * 从DHT检索数据
   * @param {string} key - 键
   * @returns {Promise<string|null>} 检索到的数据
   */
  async retrieve(key) {
    if (!this.isRunning) {
      throw new Error('服务器未运行');
    }

    try {
      const results = await this.libp2p.dht.get(key);
      if (results && results.value) {
        return results.value.toString();
      }
      return null;
    } catch (error) {
      console.error(`检索数据失败: ${error}`);
      return null;
    }
  }

  /**
   * 查找提供特定键的节点
   * @param {string} key - 键
   * @returns {Promise<Array>} 节点数组
   */
  async findProviders(key) {
    if (!this.isRunning) {
      throw new Error('服务器未运行');
    }

    try {
      const providers = await this.libp2p.dht.findProviders(key);
      return providers.map(provider => provider.id.toB58String());
    } catch (error) {
      console.error(`查找提供者失败: ${error}`);
      return [];
    }
  }

  /**
   * 查找特定ID的节点
   * @param {string} peerId - 节点ID
   * @returns {Promise<Object|null>} 节点信息
   */
  async findPeer(peerId) {
    if (!this.isRunning) {
      throw new Error('服务器未运行');
    }

    try {
      const peerInfo = await this.libp2p.dht.findPeer(peerId);
      return peerInfo ? {
        id: peerInfo.id.toB58String(),
        multiaddrs: peerInfo.multiaddrs.map(ma => ma.toString())
      } : null;
    } catch (error) {
      console.error(`查找节点失败: ${error}`);
      return null;
    }
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   * @param {string} key - 键
   */
  async provide(key) {
    if (!this.isRunning) {
      throw new Error('服务器未运行');
    }

    try {
      await this.libp2p.dht.provide(key);
      console.log(`MetaJade: 提供数据: ${key}`);
      return true;
    } catch (error) {
      console.error(`提供数据失败: ${error}`);
      return false;
    }
  }

  /**
   * 获取服务器的多地址列表，用于引导节点
   * @returns {Array} 多地址数组
   */
  getMultiaddrs() {
    const peerId = this.libp2p.peerId.toB58String();
    return this.libp2p.multiaddrs.map(ma => `${ma}/p2p/${peerId}`);
  }

  /**
   * 获取服务器的节点ID
   * @returns {string} 节点ID
   */
  getPeerId() {
    return this.libp2p.peerId.toB58String();
  }

  /**
   * 获取已连接的节点数量
   * @returns {number} 连接数
   */
  getConnectionCount() {
    return this.connectedPeers.size;
  }

  /**
   * 获取DHT路由表中的节点数量
   * @returns {number} 节点数量
   */
  getRoutingTableSize() {
    return this.libp2p.dht.routingTable.size;
  }
}