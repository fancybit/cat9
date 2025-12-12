import axios from 'axios';

class DHTService {
  constructor(baseURL = '/api/dht') {
    this.api = axios.create({
      baseURL,
      timeout: 10000
    });
  }

  /**
   * 鑾峰彇 DHT 鏈嶅姟鍣ㄧ姸鎬?   */
  async getStatus() {
    try {
      const response = await this.api.get('/status');
      return response.data;
    } catch (error) {
      console.error('鑾峰彇 DHT 鐘舵€佸け璐?', error);
      throw error;
    }
  }

  /**
   * 瀛樺偍鏁版嵁鍒?DHT
   * @param {string} key - 閿?   * @param {string} value - 鍊?   */
  async storeData(key, value) {
    try {
      const response = await this.api.post('/store', { key, value });
      return response.data;
    } catch (error) {
      console.error('瀛樺偍鏁版嵁鍒?DHT 澶辫触:', error);
      throw error;
    }
  }

  /**
   * 浠?DHT 妫€绱㈡暟鎹?   * @param {string} key - 閿?   */
  async retrieveData(key) {
    try {
      const response = await this.api.get(`/retrieve/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`浠?DHT 妫€绱㈡暟鎹け璐?(key: ${key}):`, error);
      throw error;
    }
  }

  /**
   * 鏌ユ壘鎻愪緵鐗瑰畾閿殑鑺傜偣
   * @param {string} key - 閿?   */
  async findProviders(key) {
    try {
      const response = await this.api.get(`/providers/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`鏌ユ壘鎻愪緵閿?${key} 鐨勮妭鐐瑰け璐?`, error);
      throw error;
    }
  }

  /**
   * 鏌ユ壘鐗瑰畾 ID 鐨勮妭鐐?   * @param {string} peerId - 鑺傜偣 ID
   */
  async findPeer(peerId) {
    try {
      const response = await this.api.get(`/peer/${encodeURIComponent(peerId)}`);
      return response.data;
    } catch (error) {
      console.error(`鏌ユ壘鑺傜偣 ${peerId} 澶辫触:`, error);
      throw error;
    }
  }

  /**
   * 鎻愪緵褰撳墠鑺傜偣浣滀负鎸囧畾閿殑鏁版嵁鎻愪緵鑰?   * @param {string} key - 閿?   */
  async provide(key) {
    try {
      const response = await this.api.post(`/provide/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error(`鎻愪緵閿?${key} 鐨勬暟鎹け璐?`, error);
      throw error;
    }
  }
}

export default new DHTService();
