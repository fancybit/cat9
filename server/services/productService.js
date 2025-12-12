// 鍟嗗搧鏈嶅姟 - 澶勭悊铏氭嫙鍟嗗搧鐩稿叧鐨勪笟鍔￠€昏緫

const dal = require('../dal');

class ProductService {
  /**
   * 鍒涘缓鍟嗗搧
   * @param {Object} productData - 鍟嗗搧鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓缁撴灉
   */
  async createProduct(productData) {
    try {
      // 妫€鏌ュ晢鍝佸悕绉版槸鍚﹀凡瀛樺湪
      const existingProduct = await dal.catDB.getProductByName(productData.name);
      if (existingProduct) {
        return { success: false, error: '鍟嗗搧鍚嶇О宸插瓨鍦? };
      }

      // 鍒涘缓鍟嗗搧
      const product = await dal.createProduct(productData);

      return { success: true, product: product.toJSON() };
    } catch (error) {
      console.error('鍒涘缓鍟嗗搧澶辫触:', error);
      return { success: false, error: '鍒涘缓鍟嗗搧澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鍟嗗搧淇℃伅
   * @param {string} productId - 鍟嗗搧ID
   * @returns {Promise<Object|null>} 鍟嗗搧淇℃伅
   */
  async getProductInfo(productId) {
    try {
      const product = await dal.getProduct(productId);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error('鑾峰彇鍟嗗搧淇℃伅澶辫触:', error);
      return null;
    }
  }

  /**
   * 閫氳繃鍚嶇О鑾峰彇鍟嗗搧
   * @param {string} name - 鍟嗗搧鍚嶇О
   * @returns {Promise<Object|null>} 鍟嗗搧淇℃伅
   */
  async getProductByName(name) {
    try {
      const product = await dal.catDB.getProductByName(name);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error('閫氳繃鍚嶇О鑾峰彇鍟嗗搧澶辫触:', error);
      return null;
    }
  }

  /**
   * 鏇存柊鍟嗗搧淇℃伅
   * @param {string} productId - 鍟嗗搧ID
   * @param {Object} updateData - 鏇存柊鏁版嵁
   * @returns {Promise<Object>} 鏇存柊缁撴灉
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await dal.updateProduct(productId, updateData);
      return product ? { success: true, product: product.toJSON() } : { success: false, error: '鍟嗗搧涓嶅瓨鍦? };
    } catch (error) {
      console.error('鏇存柊鍟嗗搧淇℃伅澶辫触:', error);
      return { success: false, error: '鏇存柊澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鏇存柊鍟嗗搧搴撳瓨
   * @param {string} productId - 鍟嗗搧ID
   * @param {number} quantity - 鏂板簱瀛樻暟閲?   * @returns {Promise<Object>} 鎿嶄綔缁撴灉
   */
  async updateProductStock(productId, quantity) {
    try {
      const product = await dal.getProduct(productId);
      if (!product) {
        return { success: false, error: '鍟嗗搧涓嶅瓨鍦? };
      }

      product.updateQuantity(quantity);
      return { success: true, product: product.toJSON() };
    } catch (error) {
      console.error('鏇存柊鍟嗗搧搴撳瓨澶辫触:', error);
      return { success: false, error: '鎿嶄綔澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勫晢鍝?   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 鐢ㄦ埛鍟嗗搧鍒楄〃
   */
  async getUserProducts(userId) {
    try {
      const products = await dal.catDB.getUserProducts(userId);
      return products.map(product => product.toJSON());
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛鍟嗗搧鍒楄〃澶辫触:', error);
      return [];
    }
  }

  /**
   * 璐拱鍟嗗搧
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} productId - 鍟嗗搧ID
   * @returns {Promise<Object>} 璐拱缁撴灉
   */
  async purchaseProduct(userId, productId) {
    try {
      const result = await dal.purchaseProduct(userId, productId);
      return result;
    } catch (error) {
      console.error('璐拱鍟嗗搧澶辫触:', error);
      return { success: false, error: '璐拱澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鎵€鏈夊晢鍝?   * @returns {Promise<Array>} 鍟嗗搧鍒楄〃
   */
  async getAllProducts() {
    try {
      // 浠巆atDB鑾峰彇鎵€鏈夊晢鍝?      const allProducts = Array.from(dal.catDB.products.values());
      return allProducts.map(product => product.toJSON());
    } catch (error) {
      console.error('鑾峰彇鎵€鏈夊晢鍝佸け璐?', error);
      return [];
    }
  }

  /**
   * 鑾峰彇鐗瑰畾绫诲埆鐨勫晢鍝?   * @param {string} category - 鍟嗗搧绫诲埆
   * @returns {Promise<Array>} 鍟嗗搧鍒楄〃
   */
  async getProductsByCategory(category) {
    try {
      const allProducts = Array.from(dal.catDB.products.values());
      const filteredProducts = allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase() && product.isActive
      );
      return filteredProducts.map(product => product.toJSON());
    } catch (error) {
      console.error('鑾峰彇鍟嗗搧鍒嗙被澶辫触:', error);
      return [];
    }
  }
}

module.exports = new ProductService();
