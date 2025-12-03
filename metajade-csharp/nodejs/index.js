// C#版玄玉区块链核心库Node.js客户端

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载proto文件
const PROTO_PATH = path.join(__dirname, 'protos', 'metajade.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// 加载gRPC服务定义
const metajadeProto = grpc.loadPackageDefinition(packageDefinition).metajade;

/**
 * C#版玄玉区块链核心库Node.js客户端
 */
export class MetaJadeHome {
  constructor() {
    // gRPC客户端配置
    this.client = new metajadeProto.MetaJadeService(
      'localhost:5000', // 使用gRPC服务实际运行的端口
      grpc.credentials.createInsecure()
    );
    
    this.isInitialized = false;
  }

  /**
   * 初始化并启动DHT服务器
   * @param {Object} options - 配置选项
   * @param {number} options.port - 端口号
   * @param {boolean} options.enableRelay - 是否启用中继
   * @returns {Promise<void>}
   */
  async start(options = {}) {
    return new Promise((resolve, reject) => {
      this.client.Initialize({
        port: options.port || 4001,
        enable_relay: options.enableRelay || false
      }, (error, response) => {
        if (error) {
          reject(error);
        } else if (!response.success) {
          reject(new Error(response.error || '初始化失败'));
        } else {
          this.isInitialized = true;
          resolve();
        }
      });
    });
  }

  /**
   * 停止DHT服务器
   * @returns {Promise<void>}
   */
  async stop() {
    return new Promise((resolve, reject) => {
      this.client.Shutdown({}, (error, response) => {
        if (error) {
          reject(error);
        } else {
          this.isInitialized = false;
          resolve();
        }
      });
    });
  }

  /**
   * 获取节点ID
   * @returns {Promise<string>}
   */
  async getPeerId() {
    const status = await this._getStatus();
    return status.peer_id;
  }

  /**
   * 获取监听地址
   * @returns {Promise<Array<string>>}
   */
  async getMultiaddrs() {
    const status = await this._getStatus();
    return status.multiaddrs;
  }

  /**
   * 获取连接数量
   * @returns {Promise<number>}
   */
  async getConnectionCount() {
    const status = await this._getStatus();
    return status.connection_count;
  }

  /**
   * 获取路由表大小
   * @returns {Promise<number>}
   */
  async getRoutingTableSize() {
    const status = await this._getStatus();
    return status.routing_table_size;
  }

  /**
   * 存储数据到DHT
   * @param {string} key - 数据键
   * @param {string} value - 数据值
   * @returns {Promise<void>}
   */
  async store(key, value) {
    return new Promise((resolve, reject) => {
      this.client.StoreData({ key, value }, (error, response) => {
        if (error) {
          reject(error);
        } else if (!response.success) {
          reject(new Error(response.error || '存储数据失败'));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 从DHT检索数据
   * @param {string} key - 数据键
   * @returns {Promise<string>}
   */
  async retrieve(key) {
    return new Promise((resolve, reject) => {
      this.client.RetrieveData({ key }, (error, response) => {
        if (error) {
          reject(error);
        } else if (!response.success) {
          reject(new Error(response.error || '检索数据失败'));
        } else {
          resolve(response.value);
        }
      });
    });
  }

  /**
   * 查找提供特定键的节点
   * @param {string} key - 数据键
   * @returns {Promise<Array<string>>}
   */
  async findProviders(key) {
    return new Promise((resolve, reject) => {
      this.client.FindProviders({ key }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.providers);
        }
      });
    });
  }

  /**
   * 查找特定ID的节点
   * @param {string} peerId - 节点ID
   * @returns {Promise<Object>}
   */
  async findPeer(peerId) {
    return new Promise((resolve, reject) => {
      this.client.FindPeer({ peer_id: peerId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            id: response.peer_id,
            addresses: response.addresses
          });
        }
      });
    });
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   * @param {string} key - 数据键
   * @returns {Promise<void>}
   */
  async provide(key) {
    return new Promise((resolve, reject) => {
      this.client.Provide({ key }, (error, response) => {
        if (error) {
          reject(error);
        } else if (!response.success) {
          reject(new Error(response.error || '提供数据失败'));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 获取服务器状态
   * @returns {Promise<Object>}
   * @private
   */
  _getStatus() {
    return new Promise((resolve, reject) => {
      this.client.GetStatus({}, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

/**
 * 导出默认实例
 */
export default {
  MetaJadeHome
};
