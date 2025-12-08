const axios = require('axios');

/**
 * MetaJadeNode - 封装对C#版MetaJadeNode的调用
 */
class MetaJadeNode {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {string} options.host - 玄玉节点的IP地址，默认为localhost
   * @param {number} options.port - 玄玉节点的端口，默认为5000
   */
  constructor(options = {}) {
    this.host = options.host || 'localhost';
    this.port = options.port || 5000;
    this.baseUrl = `http://${this.host}:${this.port}/api/metajade`;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 初始化并启动玄玉节点
   * @param {Object} options - 玄玉节点配置
   * @param {number} options.port - 玄玉节点端口，默认为4001
   * @param {string} options.ip - 玄玉节点IP，默认为0.0.0.0
   * @param {boolean} options.enableRelay - 是否启用中继，默认为true
   * @returns {Promise<boolean>} - 初始化结果
   */
  async start(options = {}) {
    try {
      const response = await this.axios.post('/initialize', {
        Port: options.port || 4001,
        EnableRelay: options.enableRelay !== false
      });
      return response.data.success;
    } catch (error) {
      console.error('启动玄玉节点失败:', error.message);
      throw error;
    }
  }

  /**
   * 停止玄玉节点
   * @returns {Promise<boolean>} - 停止结果
   */
  async stop() {
    try {
      const response = await this.axios.post('/shutdown');
      return response.data.success;
    } catch (error) {
      console.error('停止玄玉节点失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取玄玉节点状态
   * @returns {Promise<Object>} - 节点状态
   */
  async getStatus() {
    try {
      const response = await this.axios.get('/status');
      return response.data;
    } catch (error) {
      console.error('获取玄玉节点状态失败:', error.message);
      throw error;
    }
  }

  /**
   * 存储数据到玄玉节点（数据库操作）
   * @param {string} key - 数据键
   * @param {string} value - 数据值
   * @returns {Promise<boolean>} - 存储结果
   */
  async store(key, value) {
    try {
      const response = await this.axios.post('/store', {
        Key: key,
        Value: value
      });
      return response.data.success;
    } catch (error) {
      console.error('存储数据失败:', error.message);
      throw error;
    }
  }

  /**
   * 从玄玉节点检索数据（数据库操作）
   * @param {string} key - 数据键
   * @returns {Promise<string|null>} - 检索到的数据
   */
  async retrieve(key) {
    try {
      const response = await this.axios.get(`/retrieve/${encodeURIComponent(key)}`);
      return response.data.value;
    } catch (error) {
      console.error('检索数据失败:', error.message);
      throw error;
    }
  }

  /**
   * 查找提供特定键的节点
   * @param {string} key - 数据键
   * @returns {Promise<Array<string>>} - 提供该键的节点列表
   */
  async findProviders(key) {
    try {
      const response = await this.axios.get(`/find-providers/${encodeURIComponent(key)}`);
      return response.data.providers || [];
    } catch (error) {
      console.error('查找提供者失败:', error.message);
      throw error;
    }
  }

  /**
   * 查找特定ID的节点
   * @param {string} peerId - 节点ID
   * @returns {Promise<Object>} - 节点信息
   */
  async findPeer(peerId) {
    try {
      const response = await this.axios.get(`/find-peer/${encodeURIComponent(peerId)}`);
      return response.data;
    } catch (error) {
      console.error('查找节点失败:', error.message);
      throw error;
    }
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   * @param {string} key - 数据键
   * @returns {Promise<boolean>} - 提供结果
   */
  async provide(key) {
    try {
      const response = await this.axios.post(`/provide/${encodeURIComponent(key)}`);
      return response.data.success;
    } catch (error) {
      console.error('提供数据失败:', error.message);
      throw error;
    }
  }

  /**
   * 存储文件到玄玉节点（文件操作）
   * @param {string} filePath - 本地文件路径
   * @returns {Promise<string>} - 文件的CID
   */
  async storeFile(filePath) {
    try {
      // 读取文件内容
      const fs = require('fs');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // 生成文件的唯一键
      const fileKey = `file_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // 存储文件内容到玄玉节点
      await this.store(fileKey, fileContent);
      
      console.log(`文件已存储，键: ${fileKey}`);
      return fileKey;
    } catch (error) {
      console.error('存储文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 从玄玉节点检索文件（文件操作）
   * @param {string} fileKey - 文件的键
   * @param {string} outputPath - 输出文件路径
   * @returns {Promise<boolean>} - 检索结果
   */
  async retrieveFile(fileKey, outputPath) {
    try {
      // 从玄玉节点检索文件内容
      const fileContent = await this.retrieve(fileKey);
      
      if (!fileContent) {
        console.error('文件不存在');
        return false;
      }
      
      // 写入文件
      const fs = require('fs');
      fs.writeFileSync(outputPath, fileContent, 'utf8');
      
      console.log(`文件已检索，保存到: ${outputPath}`);
      return true;
    } catch (error) {
      console.error('检索文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取节点的Peer ID
   * @returns {Promise<string>} - 节点的Peer ID
   */
  async getPeerId() {
    try {
      const status = await this.getStatus();
      return status.peerId;
    } catch (error) {
      console.error('获取Peer ID失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取节点的多地址列表
   * @returns {Promise<Array<string>>} - 节点的多地址列表
   */
  async getMultiaddrs() {
    try {
      const status = await this.getStatus();
      return status.multiaddrs || [];
    } catch (error) {
      console.error('获取多地址列表失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取节点的连接数
   * @returns {Promise<number>} - 节点的连接数
   */
  async getConnectionCount() {
    try {
      const status = await this.getStatus();
      return status.connectionCount || 0;
    } catch (error) {
      console.error('获取连接数失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取节点的路由表大小
   * @returns {Promise<number>} - 节点的路由表大小
   */
  async getRoutingTableSize() {
    try {
      const status = await this.getStatus();
      return status.routingTableSize || 0;
    } catch (error) {
      console.error('获取路由表大小失败:', error.message);
      throw error;
    }
  }
}

// 导出MetaJadeNode类
module.exports = {
  MetaJadeNode
};

// 导出默认实例
module.exports.default = MetaJadeNode;