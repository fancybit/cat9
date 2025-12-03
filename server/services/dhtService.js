// 使用 C# 版玄玉区块链核心库
const { MetaJadeHome } = require('../../metajade-csharp/nodejs');

class DHTService {
  constructor() {
    this.dhtServer = null;
    this.isInitialized = false;
  }

  /**
   * 初始化并启动 DHT 服务器
   */
  async initialize(options = {}) {
    if (this.isInitialized) {
      console.warn('DHT 服务已经初始化');
      return this;
    }

    try {
      // 创建 C# 版 MetaJadeHome 实例
      this.dhtServer = new MetaJadeHome();

      // 启动 DHT 服务器
      await this.dhtServer.start({
        port: options.port || 4001,
        enableRelay: options.enableRelay !== false
      });
      this.isInitialized = true;
      
      console.log('C# 版 DHT 服务已成功初始化');
      return this;
    } catch (error) {
      console.error('初始化 C# 版 DHT 服务失败:', error);
      throw error;
    }
  }

  /**
   * 停止 DHT 服务器
   */
  async shutdown() {
    if (!this.isInitialized || !this.dhtServer) {
      return;
    }

    try {
      await this.dhtServer.stop();
      this.isInitialized = false;
      console.log('C# 版 DHT 服务已关闭');
    } catch (error) {
      console.error('关闭 C# 版 DHT 服务时出错:', error);
    }
  }

  /**
   * 获取 DHT 服务器状态
   */
  getStatus() {
    if (!this.isInitialized || !this.dhtServer) {
      return {
        status: 'stopped',
        initialized: false
      };
    }

    return {
      status: 'running',
      initialized: true,
      peerId: this.dhtServer.getPeerId(),
      multiaddrs: this.dhtServer.getMultiaddrs(),
      connectionCount: this.dhtServer.getConnectionCount(),
      routingTableSize: this.dhtServer.getRoutingTableSize()
    };
  }

  /**
   * 存储数据到 DHT
   */
  async storeData(key, value) {
    if (!this.isInitialized || !this.dhtServer) {
      throw new Error('DHT 服务未初始化');
    }

    return this.dhtServer.store(key, value);
  }

  /**
   * 从 DHT 检索数据
   */
  async retrieveData(key) {
    if (!this.isInitialized || !this.dhtServer) {
      throw new Error('DHT 服务未初始化');
    }

    return this.dhtServer.retrieve(key);
  }

  /**
   * 查找提供特定键的节点
   */
  async findProviders(key) {
    if (!this.isInitialized || !this.dhtServer) {
      throw new Error('DHT 服务未初始化');
    }

    return this.dhtServer.findProviders(key);
  }

  /**
   * 查找特定 ID 的节点
   */
  async findPeer(peerId) {
    if (!this.isInitialized || !this.dhtServer) {
      throw new Error('DHT 服务未初始化');
    }

    return this.dhtServer.findPeer(peerId);
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   */
  async provide(key) {
    if (!this.isInitialized || !this.dhtServer) {
      throw new Error('DHT 服务未初始化');
    }

    return this.dhtServer.provide(key);
  }
}

// 导出单例实例
module.exports = new DHTService();