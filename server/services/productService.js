// 产品服务 - 处理虚拟产品相关的业务逻辑

const dal = require('../dal');

class ProductService {
  /**
   * 创建产品
   * @param {Object} productData - 产品数据
   * @returns {Promise<Object>} 创建结果
   */
  async createProduct(productData) {
    try {
      // 检查产品名称是否已存在
      const existingProduct = await dal.catDB.getProductByName(productData.name);
      if (existingProduct) {
        return { success: false, error: '产品名称已存在' };
      }

      // 创建产品
      const product = await dal.createProduct(productData);

      return { success: true, product: product.toJSON() };
    } catch (error) {
      console.error('创建产品失败:', error);
      return { success: false, error: '创建产品失败，请稍后重试' };
    }
  }

  /**
   * 获取产品信息
   * @param {string} productId - 产品ID
   * @returns {Promise<Object|null>} 产品信息
   */
  async getProductInfo(productId) {
    try {
      const product = await dal.getProduct(productId);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error('获取产品信息失败:', error);
      return null;
    }
  }

  /**
   * 通过名称获取产品
   * @param {string} name - 产品名称
   * @returns {Promise<Object|null>} 产品信息
   */
  async getProductByName(name) {
    try {
      const product = await dal.catDB.getProductByName(name);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error('通过名称获取产品失败:', error);
      return null;
    }
  }

  /**
   * 更新产品信息
   * @param {string} productId - 产品ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await dal.updateProduct(productId, updateData);
      return product ? { success: true, product: product.toJSON() } : { success: false, error: '产品不存在' };
    } catch (error) {
      console.error('更新产品信息失败:', error);
      return { success: false, error: '更新失败，请稍后重试' };
    }
  }

  /**
   * 更新产品库存
   * @param {string} productId - 产品ID
   * @param {number} quantity - 新库存数量
   * @returns {Promise<Object>} 操作结果
   */
  async updateProductStock(productId, quantity) {
    try {
      const product = await dal.getProduct(productId);
      if (!product) {
        return { success: false, error: '产品不存在' };
      }

      product.updateQuantity(quantity);
      return { success: true, product: product.toJSON() };
    } catch (error) {
      console.error('更新产品库存失败:', error);
      return { success: false, error: '操作失败，请稍后重试' };
    }
  }

  /**
   * 获取用户拥有的产品
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 用户产品列表
   */
  async getUserProducts(userId) {
    try {
      const products = await dal.catDB.getUserProducts(userId);
      return products.map(product => product.toJSON());
    } catch (error) {
      console.error('获取用户产品列表失败:', error);
      return [];
    }
  }

  /**
   * 购买产品
   * @param {string} userId - 用户ID
   * @param {string} productId - 产品ID
   * @returns {Promise<Object>} 购买结果
   */
  async purchaseProduct(userId, productId) {
    try {
      const result = await dal.purchaseProduct(userId, productId);
      return result;
    } catch (error) {
      console.error('购买产品失败:', error);
      return { success: false, error: '购买失败，请稍后重试' };
    }
  }

  /**
   * 获取所有产品
   * @returns {Promise<Array>} 产品列表
   */
  async getAllProducts() {
    try {
      // 从catDB获取所有产品
      const allProducts = Array.from(dal.catDB.products.values());
      return allProducts.map(product => product.toJSON());
    } catch (error) {
      console.error('获取所有产品失败:', error);
      return [];
    }
  }

  /**
   * 获取指定类别的产品
   * @param {string} category - 产品类别
   * @returns {Promise<Array>} 产品列表
   */
  async getProductsByCategory(category) {
    try {
      const allProducts = Array.from(dal.catDB.products.values());
      const filteredProducts = allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase() && product.isActive
      );
      return filteredProducts.map(product => product.toJSON());
    } catch (error) {
      console.error('获取产品分类失败:', error);
      return [];
    }
  }
}

module.exports = new ProductService();