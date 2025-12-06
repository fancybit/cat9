// 数据访问层(DAL) - 为cat9库提供统一的数据访问接口，基于玄玉区块链网络

// 导入MongoDB模型（暂时保留，用于兼容）
const Game = require('../models/Game');
const mongoose = require('mongoose');

// 模拟玄玉区块链客户端类
class MockMetaJadeHome {
  constructor() {
    this.isInitialized = false;
    this.dataStore = new Map(); // 模拟玄玉区块链存储
  }

  async start(options = {}) {
    this.isInitialized = true;
    console.log('模拟玄玉区块链DHT服务初始化成功');
  }

  async stop() {
    this.isInitialized = false;
    console.log('模拟玄玉区块链DHT服务停止成功');
  }

  async store(key, value) {
    this.dataStore.set(key, value);
    console.log(`模拟玄玉区块链存储数据成功: ${key}`);
  }

  async retrieve(key) {
    return this.dataStore.get(key);
  }

  async findProviders(key) {
    return [];
  }

  async findPeer(peerId) {
    return null;
  }

  async provide(key) {
    // 模拟提供数据
  }

  async _getStatus() {
    return {
      peer_id: 'mock_peer_id',
      multiaddrs: ['/ip4/127.0.0.1/tcp/4001'],
      connection_count: 0,
      routing_table_size: 0
    };
  }
}

// 数据访问层类
class DataAccessLayer {
  constructor(dbType = 'blockchain') {
    // 初始化玄玉区块链客户端（使用模拟实现）
    this.metaJadeHome = new MockMetaJadeHome();
    this.isInitialized = false;
    this.dataCache = new Map(); // 本地缓存，提高性能
  }

  /**
   * 初始化数据访问层
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // 启动玄玉区块链DHT服务
      await this.metaJadeHome.start();
      console.log('数据访问层初始化完成，使用玄玉区块链网络');
      this.isInitialized = true;
    } catch (error) {
      console.error('数据访问层初始化失败:', error);
      throw error;
    }
  }

  /**
   * 生成唯一ID
   * @param {string} prefix - ID前缀
   * @returns {string} 唯一ID
   */
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * 存储数据到玄玉区块链
   * @param {string} key - 数据键
   * @param {Object} data - 数据对象
   * @returns {Promise<void>}
   */
  async storeData(key, data) {
    await this.initialize();
    const serializedData = JSON.stringify(data);
    await this.metaJadeHome.store(key, serializedData);
    // 更新本地缓存
    this.dataCache.set(key, data);
  }

  /**
   * 从玄玉区块链检索数据
   * @param {string} key - 数据键
   * @returns {Promise<Object|null>} 数据对象
   */
  async retrieveData(key) {
    await this.initialize();
    // 先从本地缓存获取
    if (this.dataCache.has(key)) {
      return this.dataCache.get(key);
    }
    try {
      const serializedData = await this.metaJadeHome.retrieve(key);
      if (serializedData) {
        const data = JSON.parse(serializedData);
        // 更新本地缓存
        this.dataCache.set(key, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`从玄玉区块链检索数据失败 (${key}):`, error);
      return null;
    }
  }

  /**
   * 生成用户数据键
   * @param {string} userId - 用户ID
   * @returns {string} 用户数据键
   */
  getUserKey(userId) {
    return `user_${userId}`;
  }

  /**
   * 生成用户名索引键
   * @param {string} username - 用户名
   * @returns {string} 用户名索引键
   */
  getUsernameIndexKey(username) {
    return `username_index_${username}`;
  }

  /**
   * 生成邮箱索引键
   * @param {string} email - 邮箱
   * @returns {string} 邮箱索引键
   */
  getEmailIndexKey(email) {
    return `email_index_${email}`;
  }

  /**
   * 生成游戏数据键
   * @param {string} gameId - 游戏ID
   * @returns {string} 游戏数据键
   */
  getGameKey(gameId) {
    return `game_${gameId}`;
  }

  /**
   * 生成交易数据键
   * @param {string} transactionId - 交易ID
   * @returns {string} 交易数据键
   */
  getTransactionKey(transactionId) {
    return `transaction_${transactionId}`;
  }

  /**
   * 生成开发者数据键
   * @param {string} developerId - 开发者ID
   * @returns {string} 开发者数据键
   */
  getDeveloperKey(developerId) {
    return `developer_${developerId}`;
  }

  /**
   * 生成软件数据键
   * @param {string} softwareId - 软件ID
   * @returns {string} 软件数据键
   */
  getSoftwareKey(softwareId) {
    return `software_${softwareId}`;
  }

  /**
   * 生成商品数据键
   * @param {string} productId - 商品ID
   * @returns {string} 商品数据键
   */
  getProductKey(productId) {
    return `product_${productId}`;
  }

  // ===== 用户相关方法 =====
  
  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 创建的用户
   */
  async createUser(userData) {
    await this.initialize();
    
    // 检查用户名是否已存在
    const existingUsername = await this.getUserByUsername(userData.username);
    if (existingUsername) {
      throw new Error('用户名已存在');
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await this.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('邮箱已被注册');
    }
    
    // 生成唯一用户ID
    const userId = this.generateId('user');
    
    // 创建用户对象
    const user = {
      ...userData,
      _id: userId,
      id: userId,
      createdAt: new Date(),
      lastLogin: null,
      wallet: {
        balance: 0,
        address: this.generateId('wallet')
      },
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      },
      save: async function() {
        return this;
      },
      verifyPassword: async function(compareFn, password) {
        return compareFn(password, this.passwordHash);
      }
    };
    
    // 存储用户数据到玄玉区块链
    await this.storeData(this.getUserKey(userId), user);
    
    // 创建用户名索引
    await this.storeData(this.getUsernameIndexKey(userData.username), userId);
    
    // 创建邮箱索引
    await this.storeData(this.getEmailIndexKey(userData.email), userId);
    
    return user;
  }

  /**
   * 获取用户
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUser(userId) {
    await this.initialize();
    return this.retrieveData(this.getUserKey(userId));
  }

  /**
   * 通过用户名获取用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUserByUsername(username) {
    await this.initialize();
    const userId = await this.retrieveData(this.getUsernameIndexKey(username));
    if (userId) {
      return this.getUser(userId);
    }
    return null;
  }

  /**
   * 通过邮箱获取用户
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUserByEmail(email) {
    await this.initialize();
    const userId = await this.retrieveData(this.getEmailIndexKey(email));
    if (userId) {
      return this.getUser(userId);
    }
    return null;
  }

  /**
   * 通过重置令牌获取用户
   * @param {string} token - 重置令牌
   * @returns {Promise<Object|null>} 用户对象
   */
  async getUserByResetToken(token) {
    await this.initialize();
    // 遍历所有用户查找匹配的重置令牌
    // 注意：这是一种低效的实现，实际生产环境中应该使用索引
    // 由于玄玉区块链DHT的限制，这里暂时使用这种方式
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
    
    // 获取现有用户
    const user = await this.getUser(userId);
    if (!user) {
      return null;
    }
    
    // 更新用户数据
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };
    
    // 存储更新后的用户数据到玄玉区块链
    await this.storeData(this.getUserKey(userId), updatedUser);
    
    return updatedUser;
  }

  // ===== 软件相关方法 =====
  
  /**
   * 创建软件
   * @param {Object} softwareData - 软件数据
   * @returns {Promise<Object>} 创建的软件
   */
  async createSoftware(softwareData) {
    await this.initialize();
    
    // 生成唯一软件ID
    const softwareId = this.generateId('software');
    
    // 创建软件对象
    const software = {
      ...softwareData,
      _id: softwareId,
      id: softwareId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      }
    };
    
    // 存储软件数据到玄玉区块链
    await this.storeData(this.getSoftwareKey(softwareId), software);
    
    return software;
  }

  /**
   * 获取软件
   * @param {string} softwareId - 软件ID
   * @returns {Promise<Object|null>} 软件对象
   */
  async getSoftware(softwareId) {
    await this.initialize();
    return this.retrieveData(this.getSoftwareKey(softwareId));
  }

  /**
   * 获取用户拥有的软件
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 软件列表
   */
  async getUserSoftware(userId) {
    await this.initialize();
    // 注意：玄玉区块链DHT不支持按用户ID查询软件，这里返回空列表
    // 实际生产环境中应该维护用户软件索引
    return [];
  }

  // ===== 商品相关方法 =====
  
  /**
   * 创建商品
   * @param {Object} productData - 商品数据
   * @returns {Promise<Object>} 创建的商品
   */
  async createProduct(productData) {
    await this.initialize();
    
    // 生成唯一商品ID
    const productId = this.generateId('product');
    
    // 创建商品对象
    const product = {
      ...productData,
      _id: productId,
      id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      }
    };
    
    // 存储商品数据到玄玉区块链
    await this.storeData(this.getProductKey(productId), product);
    
    return product;
  }

  /**
   * 获取商品
   * @param {string} productId - 商品ID
   * @returns {Promise<Object|null>} 商品对象
   */
  async getProduct(productId) {
    await this.initialize();
    return this.retrieveData(this.getProductKey(productId));
  }

  /**
   * 获取所有商品
   * @returns {Promise<Array>} 商品列表
   */
  async getAllProducts() {
    await this.initialize();
    // 注意：玄玉区块链DHT不支持获取所有商品，这里返回空列表
    // 实际生产环境中应该维护商品索引
    return [];
  }

  // ===== 游戏相关方法 =====
  
  /**
   * 创建游戏
   * @param {Object} gameData - 游戏数据
   * @returns {Promise<Object>} 创建的游戏
   */
  async createGame(gameData) {
    await this.initialize();
    
    // 生成唯一游戏ID
    const gameId = this.generateId('game');
    
    // 创建游戏对象
    const game = {
      ...gameData,
      _id: gameId,
      id: gameId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      }
    };
    
    // 存储游戏数据到玄玉区块链
    await this.storeData(this.getGameKey(gameId), game);
    
    return game;
  }

  /**
   * 获取所有游戏
   * @returns {Promise<Array>} 游戏列表
   */
  async getAllGames() {
    await this.initialize();
    // 注意：玄玉区块链DHT不支持获取所有游戏，这里返回空列表
    // 实际生产环境中应该维护游戏索引
    return [];
  }

  /**
   * 获取精选游戏
   * @returns {Promise<Array>} 精选游戏列表
   */
  async getFeaturedGames() {
    await this.initialize();
    // 注意：玄玉区块链DHT不支持获取精选游戏，这里返回空列表
    // 实际生产环境中应该维护精选游戏索引
    return [];
  }

  /**
   * 通过ID获取游戏
   * @param {string} gameId - 游戏ID
   * @returns {Promise<Object|null>} 游戏对象
   */
  async getGameById(gameId) {
    await this.initialize();
    return this.retrieveData(this.getGameKey(gameId));
  }

  // ===== 交易相关方法 =====
  
  /**
   * 创建交易
   * @param {Object} transactionData - 交易数据
   * @returns {Promise<Object>} 创建的交易
   */
  async createTransaction(transactionData) {
    await this.initialize();
    
    // 生成唯一交易ID
    const transactionId = this.generateId('transaction');
    
    // 创建交易对象
    const transaction = {
      ...transactionData,
      _id: transactionId,
      id: transactionId,
      createdAt: new Date(),
      status: 'pending',
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      }
    };
    
    // 存储交易数据到玄玉区块链
    await this.storeData(this.getTransactionKey(transactionId), transaction);
    
    return transaction;
  }

  /**
   * 获取交易详情
   * @param {string} transactionId - 交易ID
   * @returns {Promise<Object|null>} 交易对象
   */
  async getTransaction(transactionId) {
    await this.initialize();
    return this.retrieveData(this.getTransactionKey(transactionId));
  }

  /**
   * 获取用户交易记录
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 交易列表
   */
  async getUserTransactions(userId) {
    await this.initialize();
    // 注意：玄玉区块链DHT不支持按用户ID查询交易记录，这里返回空列表
    // 实际生产环境中应该维护用户交易索引
    return [];
  }

  /**
   * 执行交易
   * @param {string} transactionId - 交易ID
   * @returns {Promise<boolean>} 执行结果
   */
  async executeTransaction(transactionId) {
    await this.initialize();
    
    // 获取交易
    const transaction = await this.getTransaction(transactionId);
    if (!transaction) {
      return false;
    }
    
    // 更新交易状态
    transaction.status = 'completed';
    transaction.executedAt = new Date();
    
    // 存储更新后的交易数据到玄玉区块链
    await this.storeData(this.getTransactionKey(transactionId), transaction);
    
    // 更新用户余额
    if (transaction.fromUserId) {
      const fromUser = await this.getUser(transaction.fromUserId);
      if (fromUser) {
        fromUser.wallet.balance -= transaction.amount;
        await this.storeData(this.getUserKey(transaction.fromUserId), fromUser);
      }
    }
    
    if (transaction.toUserId) {
      const toUser = await this.getUser(transaction.toUserId);
      if (toUser) {
        toUser.wallet.balance += transaction.amount;
        await this.storeData(this.getUserKey(transaction.toUserId), toUser);
      }
    }
    
    return true;
  }

  /**
   * 更新用户余额
   * @param {string} userId - 用户ID
   * @param {number} amount - 交易金额（负数表示扣款）
   * @returns {Promise<Object>} 更新后的用户对象
   */
  async updateUserBalance(userId, amount) {
    await this.initialize();
    
    // 获取用户
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 更新用户余额
    user.wallet.balance += amount;
    
    // 存储更新后的用户数据到玄玉区块链
    await this.storeData(this.getUserKey(userId), user);
    
    return user;
  }

  // ===== 开发者相关方法 =====
  
  /**
   * 创建开发者
   * @param {Object} developerData - 开发者数据
   * @returns {Promise<Object>} 创建的开发者
   */
  async createDeveloper(developerData) {
    await this.initialize();
    
    // 生成唯一开发者ID
    const developerId = this.generateId('developer');
    
    // 创建开发者对象
    const developer = {
      ...developerData,
      _id: developerId,
      id: developerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 添加方法模拟MongoDB模型的行为
      toJSON: function() {
        return { ...this };
      }
    };
    
    // 存储开发者数据到玄玉区块链
    await this.storeData(this.getDeveloperKey(developerId), developer);
    
    return developer;
  }

  /**
   * 获取开发者
   * @param {string} developerId - 开发者ID
   * @returns {Promise<Object|null>} 开发者对象
   */
  async getDeveloper(developerId) {
    await this.initialize();
    return this.retrieveData(this.getDeveloperKey(developerId));
  }

  /**
   * 更新开发者
   * @param {string} developerId - 开发者ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object|null>} 更新后的开发者
   */
  async updateDeveloper(developerId, updateData) {
    await this.initialize();
    
    // 获取现有开发者
    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      return null;
    }
    
    // 更新开发者数据
    const updatedDeveloper = {
      ...developer,
      ...updateData,
      updatedAt: new Date()
    };
    
    // 存储更新后的开发者数据到玄玉区块链
    await this.storeData(this.getDeveloperKey(developerId), updatedDeveloper);
    
    return updatedDeveloper;
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
      
      // 假设用户使用wallet.balance进行支付
      if (user.wallet.balance < software.price) {
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
      
      if (user.wallet.balance < product.price) {
        throw new Error('余额不足');
      }
      
      // 扣款
      const updatedUser = await this.updateUserBalance(userId, -product.price);
      
      // 更新商品库存
      product.stock -= 1;
      product.updatedAt = new Date();
      await this.storeData(this.getProductKey(productId), product);
      
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

  // ===== 其他方法 =====
  
  /**
   * 获取数据库统计信息
   * @returns {Promise<Object>} 统计信息
   */
  async getStats() {
    await this.initialize();
    // 返回简单的统计信息
    return {
      users: 0,
      games: 0,
      transactions: 0,
      software: 0,
      products: 0
    };
  }

  /**
   * 关闭数据库连接
   */
  async close() {
    if (this.isInitialized) {
      // 玄玉区块链客户端不需要关闭连接
      this.isInitialized = false;
    }
  }

  /**
   * 获取Cat9DB实例（兼容旧版本）
   * @returns {Object} Cat9DB实例
   */
  get catDB() {
    // 返回当前实例，作为Cat9DB的兼容层
    return this;
  }
}

// 创建并导出DAL实例
const dal = new DataAccessLayer();

// 导出DAL类和实例
module.exports = dal;
module.exports.DataAccessLayer = DataAccessLayer;