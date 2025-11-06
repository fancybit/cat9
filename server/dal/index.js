// 数据访问层(DAL) - 为cat9库提供统一的数据访问接口，支持多种数据库连接方式

// 导入数据库连接器
const { getConnector } = require('../dbconnectors');

// 导入MongoDB模型
const Game = require('../models/Game');
const mongoose = require('mongoose');

// 数据访问层类
class DataAccessLayer {
  constructor(dbType = 'mock') {
    // 根据配置选择数据库连接器
    this.connector = getConnector(dbType);
    this.dbType = dbType;
    this.isInitialized = false;
  }

  /**
   * 初始化数据访问层
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // 连接到数据库
      await this.connector.connect();
      console.log(`数据访问层初始化完成，使用${this.dbType}数据库`);
      this.isInitialized = true;
    } catch (error) {
      console.error('数据访问层初始化失败:', error);
      throw error;
    }
  }

  // ===== 用户相关方法 =====
  
  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建的用户
   */
  async createUser(userData) {
    await this.initialize();
    return this.connector.createUser(userData);
  }

  /**
   * 获取用户
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUser(userId) {
    await this.initialize();
    return this.connector.getUserById(userId);
  }

  /**
   * 通过用户名获取用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUserByUsername(username) {
    await this.initialize();
    return this.connector.getUserByUsername(username);
  }

  /**
   * 通过邮箱获取用户
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUserByEmail(email) {
    await this.initialize();
    // 如果连接器不支持直接通过邮箱获取用户，可以在这里添加兼容逻辑
    // 暂时返回null，实际使用时可能需要扩展连接器功能
    console.warn('getUserByEmail方法在当前连接器中可能不直接支持');
    return null;
  }

  /**
   * 更新用户
   * @param {string} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object|null>} 更新后的用户
   */
  async updateUser(userId, updateData) {
    await this.initialize();
    return this.connector.updateUser(userId, updateData);
  }

  // ===== 软件相关方法 =====
  
  /**
   * 创建软件
   * @param {Object} softwareData - 软件数据
   * @returns {Promise<Object>} 创建的软件
   */
  async createSoftware(softwareData) {
    await this.initialize();
    return this.connector.createSoftware(softwareData);
  }

  /**
   * 获取软件
   * @param {string} softwareId - 软件ID
   * @returns {Promise<Object|null>} 软件对象
   */
  async getSoftware(softwareId) {
    await this.initialize();
    return this.connector.getSoftwareById(softwareId);
  }

  /**
   * 获取用户拥有的软件
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 软件列表
   */
  async getUserSoftware(userId) {
    await this.initialize();
    // 如果连接器不直接支持，这里可以添加兼容逻辑
    // 暂时返回所有软件，实际使用时可能需要扩展连接器功能
    console.warn('getUserSoftware方法在当前连接器中可能不直接支持');
    return this.connector.getAllSoftware ? await this.connector.getAllSoftware() : [];
  }

  // ===== 商品相关方法 =====
  
  /**
   * 创建商品
   * @param {Object} productData - 商品数据
   * @returns {Promise<Object>} 创建的商品
   */
  async createProduct(productData) {
    await this.initialize();
    return this.connector.createProduct(productData);
  }

  /**
   * 获取商品
   * @param {string} productId - 商品ID
   * @returns {Promise<Object|null>} 商品对象
   */
  async getProduct(productId) {
    await this.initialize();
    return this.connector.getProductById(productId);
  }

  /**
   * 获取所有商品
   * @returns {Promise<Array>} 商品列表
   */
  async getAllProducts() {
    await this.initialize();
    return this.connector.getAllProducts ? await this.connector.getAllProducts() : [];
  }

  // ===== 交易相关方法 =====
  
  /**
   * 创建交易
   * @param {Object} transactionData - 交易数据
   * @returns {Promise<Object>} 创建的交易
   */
  async createTransaction(transactionData) {
    await this.initialize();
    return this.connector.createTransaction(transactionData);
  }

  /**
   * 获取交易详情
   * @param {string} transactionId - 交易ID
   * @returns {Promise<Object|null>} 交易对象
   */
  async getTransaction(transactionId) {
    await this.initialize();
    return this.connector.getTransactionById(transactionId);
  }

  /**
   * 获取用户交易记录
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 交易列表
   */
  async getUserTransactions(userId) {
    await this.initialize();
    return this.connector.getUserTransactions(userId);
  }

  /**
   * 执行交易（更新用户余额）
   * @param {string} userId - 用户ID
   * @param {number} amount - 交易金额（负数表示扣款）
   * @returns {Promise<Object>} 更新后的用户对象
   */
  async updateUserBalance(userId, amount) {
    await this.initialize();
    return this.connector.updateUserCoins(userId, amount);
  }

  // ===== MongoDB游戏相关方法 =====
  
  /**
   * 获取所有游戏
   * @returns {Promise<Array>} 游戏列表
   */
  async getAllGames() {
    try {
      return await Game.find({});
    } catch (error) {
      console.error('获取游戏列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取精选游戏
   * @returns {Promise<Array>} 精选游戏列表
   */
  async getFeaturedGames() {
    try {
      return await Game.find({ isFeatured: true });
    } catch (error) {
      console.error('获取精选游戏失败:', error);
      throw error;
    }
  }

  /**
   * 通过ID获取游戏
   * @param {string} gameId - 游戏ID
   * @returns {Promise<Object|null>} 游戏对象
   */
  async getGameById(gameId) {
    try {
      return await Game.findById(gameId);
    } catch (error) {
      console.error('获取游戏失败:', error);
      throw error;
    }
  }

  // ===== 业务操作方法 =====
  
  /**
   * 用户购买软件
   * @param {string} userId - 用户ID
   * @param {string} softwareId - 软件ID
   * @returns {Promise<Object>} 操作结果
   */
  async purchaseSoftware(userId, softwareId) {
    await this.initialize();
    
    try {
      // 获取用户和软件信息
      const user = await this.getUser(userId);
      const software = await this.getSoftware(softwareId);
      
      if (!user || !software) {
        throw new Error('用户或软件不存在');
      }
      
      if (user.coins < software.price) {
        throw new Error('余额不足');
      }
      
      // 扣款
      const updatedUser = await this.updateUserBalance(userId, -software.price);
      
      // 记录交易
      const transaction = await this.createTransaction({
        userId,
        type: 'purchase',
        amount: software.price,
        itemId: softwareId,
        itemType: 'software',
        status: 'completed'
      });
      
      return {
        success: true,
        user: updatedUser,
        transaction,
        software
      };
    } catch (error) {
      console.error('购买软件失败:', error);
      throw error;
    }
  }

  /**
   * 用户购买商品
   * @param {string} userId - 用户ID
   * @param {string} productId - 商品ID
   * @returns {Promise<Object>} 操作结果
   */
  async purchaseProduct(userId, productId) {
    await this.initialize();
    
    try {
      // 获取用户和商品信息
      const user = await this.getUser(userId);
      const product = await this.getProduct(productId);
      
      if (!user || !product) {
        throw new Error('用户或商品不存在');
      }
      
      if (product.stock <= 0) {
        throw new Error('商品库存不足');
      }
      
      if (user.coins < product.price) {
        throw new Error('余额不足');
      }
      
      // 扣款
      const updatedUser = await this.updateUserBalance(userId, -product.price);
      
      // 更新商品库存
      await this.connector.updateProduct(productId, {
        stock: product.stock - 1
      });
      
      // 记录交易
      const transaction = await this.createTransaction({
        userId,
        type: 'purchase',
        amount: product.price,
        itemId: productId,
        itemType: 'product',
        status: 'completed'
      });
      
      return {
        success: true,
        user: updatedUser,
        transaction,
        product
      };
    } catch (error) {
      console.error('购买商品失败:', error);
      throw error;
    }
  }

  /**
   * 奖励用户Cat9Coins
   * @param {string} userId - 用户ID
   * @param {number} amount - 奖励金额
   * @returns {Promise<Object>} 操作结果
   */
  async rewardCoins(userId, amount) {
    await this.initialize();
    
    try {
      // 更新用户余额
      const updatedUser = await this.updateUserBalance(userId, amount);
      
      // 记录交易
      const transaction = await this.createTransaction({
        userId,
        type: 'reward',
        amount: amount,
        status: 'completed'
      });
      
      return {
        success: true,
        user: updatedUser,
        transaction
      };
    } catch (error) {
      console.error('奖励Coins失败:', error);
      throw error;
    }
  }

  // ===== 数据同步方法 =====
  
  /**
   * 导出数据库数据
   * @returns {Promise<Object>} 数据库快照
   */
  async exportData() {
    await this.initialize();
    
    try {
      // 从连接器获取所有数据
      const users = [];
      const softwareList = [];
      const products = [];
      const transactions = [];
      
      // 如果连接器支持获取所有数据，则导出
      if (this.connector.getAllSoftware) {
        const softwares = await this.connector.getAllSoftware();
        softwareList.push(...softwares);
      }
      
      if (this.connector.getAllProducts) {
        const allProducts = await this.connector.getAllProducts();
        products.push(...allProducts);
      }
      
      return {
        users,
        software: softwareList,
        products,
        transactions,
        exportDate: new Date()
      };
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  }

  /**
   * 导入数据库数据
   * @param {Object} data - 数据库快照
   * @returns {Promise<void>}
   */
  async importData(data) {
    await this.initialize();
    
    try {
      // 这里可以根据不同的连接器实现数据导入逻辑
      console.log('开始导入数据，类型:', this.dbType);
      console.log('导入数据量 - 用户:', data.users?.length || 0);
      console.log('导入数据量 - 软件:', data.software?.length || 0);
      console.log('导入数据量 - 商品:', data.products?.length || 0);
      console.log('导入数据量 - 交易:', data.transactions?.length || 0);
      
      // 根据实际需求实现具体的导入逻辑
      // ...
      
      console.log('数据导入完成');
    } catch (error) {
      console.error('导入数据失败:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   */
  async close() {
    if (this.connector && this.connector.disconnect) {
      await this.connector.disconnect();
      this.isInitialized = false;
    }
  }
}

// 获取数据库类型配置
const getDatabaseType = () => {
  // 从环境变量获取数据库类型
  const dbType = process.env.DB_TYPE || 'mock';
  return dbType.toLowerCase();
};

// 导出单例实例
const dal = new DataAccessLayer(getDatabaseType());
module.exports = dal;