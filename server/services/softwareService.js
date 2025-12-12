// 杞欢鏈嶅姟 - 澶勭悊杞欢鐩稿叧鐨勪笟鍔￠€昏緫

const dal = require('../dal');

class SoftwareService {
  /**
   * 鍒涘缓杞欢
   * @param {Object} softwareData - 杞欢鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓缁撴灉
   */
  async createSoftware(softwareData) {
    try {
      // 妫€鏌ヨ蒋浠跺悕绉版槸鍚﹀凡瀛樺湪
      const existingSoftware = await dal.catDB.getSoftwareByName(softwareData.name);
      if (existingSoftware) {
        return { success: false, error: '杞欢鍚嶇О宸插瓨鍦? };
      }

      // 鍒涘缓杞欢
      const software = await dal.createSoftware(softwareData);

      return { success: true, software: software.toJSON() };
    } catch (error) {
      console.error('鍒涘缓杞欢澶辫触:', error);
      return { success: false, error: '鍒涘缓杞欢澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇杞欢淇℃伅
   * @param {string} softwareId - 杞欢ID
   * @returns {Promise<Object|null>} 杞欢淇℃伅
   */
  async getSoftwareInfo(softwareId) {
    try {
      const software = await dal.getSoftware(softwareId);
      return software ? software.toJSON() : null;
    } catch (error) {
      console.error('鑾峰彇杞欢淇℃伅澶辫触:', error);
      return null;
    }
  }

  /**
   * 閫氳繃鍚嶇О鑾峰彇杞欢
   * @param {string} name - 杞欢鍚嶇О
   * @returns {Promise<Object|null>} 杞欢淇℃伅
   */
  async getSoftwareByName(name) {
    try {
      const software = await dal.catDB.getSoftwareByName(name);
      return software ? software.toJSON() : null;
    } catch (error) {
      console.error('閫氳繃鍚嶇О鑾峰彇杞欢澶辫触:', error);
      return null;
    }
  }

  /**
   * 鏇存柊杞欢淇℃伅
   * @param {string} softwareId - 杞欢ID
   * @param {Object} updateData - 鏇存柊鏁版嵁
   * @returns {Promise<Object>} 鏇存柊缁撴灉
   */
  async updateSoftware(softwareId, updateData) {
    try {
      const software = await dal.updateSoftware(softwareId, updateData);
      return software ? { success: true, software: software.toJSON() } : { success: false, error: '杞欢涓嶅瓨鍦? };
    } catch (error) {
      console.error('鏇存柊杞欢淇℃伅澶辫触:', error);
      return { success: false, error: '鏇存柊澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 璁剧疆杞欢涓虹簿閫?   * @param {string} softwareId - 杞欢ID
   * @param {boolean} featured - 鏄惁绮鹃€?   * @returns {Promise<Object>} 鎿嶄綔缁撴灉
   */
  async setSoftwareFeatured(softwareId, featured) {
    try {
      const software = await dal.getSoftware(softwareId);
      if (!software) {
        return { success: false, error: '杞欢涓嶅瓨鍦? };
      }

      software.setFeatured(featured);
      return { success: true, software: software.toJSON() };
    } catch (error) {
      console.error('璁剧疆杞欢绮鹃€夌姸鎬佸け璐?', error);
      return { success: false, error: '鎿嶄綔澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勮蒋浠?   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 鐢ㄦ埛杞欢鍒楄〃
   */
  async getUserSoftware(userId) {
    try {
      const softwareList = await dal.getUserSoftware(userId);
      return softwareList.map(software => software.toJSON());
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛杞欢鍒楄〃澶辫触:', error);
      return [];
    }
  }

  /**
   * 璐拱杞欢
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} softwareId - 杞欢ID
   * @returns {Promise<Object>} 璐拱缁撴灉
   */
  async purchaseSoftware(userId, softwareId) {
    try {
      const result = await dal.purchaseSoftware(userId, softwareId);
      return result;
    } catch (error) {
      console.error('璐拱杞欢澶辫触:', error);
      return { success: false, error: '璐拱澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鎵€鏈夎蒋浠?   * @returns {Promise<Array>} 杞欢鍒楄〃
   */
  async getAllSoftware() {
    try {
      // 杩欓噷闇€瑕佷粠catDB鑾峰彇鎵€鏈夎蒋浠?      // 鐢变簬catDB鐩墠娌℃湁鐩存帴鎻愪緵鑾峰彇鎵€鏈夎蒋浠剁殑鏂规硶锛屾垜浠彲浠ラ€氳繃鍏朵粬鏂瑰紡瀹炵幇
      const allSoftware = Array.from(dal.catDB.software.values());
      return allSoftware.map(software => software.toJSON());
    } catch (error) {
      console.error('鑾峰彇鎵€鏈夎蒋浠跺け璐?', error);
      return [];
    }
  }
}

module.exports = new SoftwareService();
