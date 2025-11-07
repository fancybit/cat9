import axios from 'axios';

class DHTService {
  constructor(baseURL = '/api/dht') {
    this.api = axios.create({
      baseURL,
      timeout: 10000
    });
  }

  /**
   * 获取 DHT 服务器状态
   */
  async getStatus() {
    try {
      const response = await this.api.get('/status');
      return response.data;
    } catch (error) {
      console.error('获取 DHT 状态失败:', error);
      throw error;
    }
  }

  /**
   * 存储数据到 DHT
   * @param {string} key - 键
   * @param {string} value - 值
   */
  async storeData(key, value) {
    try {
      const response = await this.api.post('/store', { key, value });
      return response.data;
    } catch (error) {
      console.error('存储数据到 DHT 失败:', error);
      throw error;
    }
  }

  /**
   * 从 DHT 检索数据
   * @param {string} key - 键
   */
  async retrieveData(key) {
    try {
      const response = await this.api.get(`/retrieve/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`从 DHT 检索数据失败 (key: ${key}):`, error);
      throw error;
    }
  }

  /**
   * 查找提供特定键的节点
   * @param {string} key - 键
   */
  async findProviders(key) {
    try {
      const response = await this.api.get(`/providers/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`查找提供键 ${key} 的节点失败:`, error);
      throw error;
    }
  }

  /**
   * 查找特定 ID 的节点
   * @param {string} peerId - 节点 ID
   */
  async findPeer(peerId) {
    try {
      const response = await this.api.get(`/peer/${encodeURIComponent(peerId)}`);
      return response.data;
    } catch (error) {
      console.error(`查找节点 ${peerId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 提供当前节点作为指定键的数据提供者
   * @param {string} key - 键
   */
  async provide(key) {
    try {
      const response = await this.api.post(`/provide/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`提供键 ${key} 的数据失败:`, error);
      throw error;
    }
  }
}

export default new DHTService();