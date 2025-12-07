// 玄玉区块链连接器 - 用于连接玄玉区块链网络
const dal = require('../dal');

class MetaJadeConnector {
  constructor() {
    this.connected = false;
  }

  // 连接方法
  async connect() {
    console.log('玄玉区块链正在连接...');
    try {
      // 初始化DAL层
      await dal.initialize();
      this.connected = true;
      console.log('玄玉区块链已连接');
      return Promise.resolve(true);
    } catch (error) {
      console.error('玄玉区块链连接失败:', error.message);
      return Promise.reject(error);
    }
  }

  // 断开连接方法
  async disconnect() {
    console.log('玄玉区块链正在断开连接...');
    try {
      // 关闭DAL连接
      await dal.close();
      this.connected = false;
      console.log('玄玉区块链已断开连接');
      return Promise.resolve(true);
    } catch (error) {
      console.error('玄玉区块链断开连接失败:', error.message);
      return Promise.reject(error);
    }
  }

  // 用户相关方法
  async createUser(userData) {
    try {
      // 调用DAL创建用户
      const user = await dal.createUser(userData);
      return user;
    } catch (error) {
      console.error('创建用户失败:', error.message);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      // 调用DAL通过用户名获取用户
      const user = await dal.getUserByUsername(username);
      if (user) {
        // 添加verifyPassword方法
        user.verifyPassword = function(compareFunction, password) {
          // 委托给DAL处理密码验证
          return compareFunction(password, this.passwordHash);
        };
      }
      return user;
    } catch (error) {
      console.error('通过用户名获取用户失败:', error.message);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      // 调用DAL通过ID获取用户
      return await dal.getUser(id);
    } catch (error) {
      console.error('通过ID获取用户失败:', error.message);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      // 调用DAL更新用户
      const updatedUser = await dal.updateUser(id, userData);
      return updatedUser;
    } catch (error) {
      console.error('更新用户失败:', error.message);
      throw error;
    }
  }

  async getUserByResetToken(token) {
    try {
      // 调用DAL通过重置令牌获取用户
      return await dal.getUserByResetToken(token);
    } catch (error) {
      console.error('通过重置令牌获取用户失败:', error.message);
      throw error;
    }
  }

  // 软件相关方法
  async createSoftware(softwareData) {
    try {
      // 调用DAL创建软件
      return await dal.createSoftware(softwareData);
    } catch (error) {
      console.error('创建软件失败:', error.message);
      throw error;
    }
  }

  async getSoftwareById(id) {
    try {
      // 调用DAL通过ID获取软件
      return await dal.getSoftware(id);
    } catch (error) {
      console.error('通过ID获取软件失败:', error.message);
      throw error;
    }
  }

  async getAllSoftware() {
    try {
      // 调用DAL获取所有软件
      return await dal.getUserSoftware('');
    } catch (error) {
      console.error('获取所有软件失败:', error.message);
      throw error;
    }
  }

  async updateSoftware(id, softwareData) {
    try {
      // 调用DAL更新软件
      // 注意：DAL层目前没有提供updateSoftware方法，这里直接返回null
      // 实际实现时需要在DAL层添加此方法
      return null;
    } catch (error) {
      console.error('更新软件失败:', error.message);
      throw error;
    }
  }

  // 商品相关方法
  async createProduct(productData) {
    try {
      // 调用DAL创建商品
      return await dal.createProduct(productData);
    } catch (error) {
      console.error('创建商品失败:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      // 调用DAL通过ID获取商品
      return await dal.getProduct(id);
    } catch (error) {
      console.error('通过ID获取商品失败:', error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      // 调用DAL获取所有商品
      return await dal.getAllProducts();
    } catch (error) {
      console.error('获取所有商品失败:', error.message);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      // 调用DAL更新商品
      // 注意：DAL层目前没有提供updateProduct方法，这里直接返回null
      // 实际实现时需要在DAL层添加此方法
      return null;
    } catch (error) {
      console.error('更新商品失败:', error.message);
      throw error;
    }
  }

  // 交易相关方法
  async createTransaction(transactionData) {
    try {
      // 调用DAL创建交易
      return await dal.createTransaction(transactionData);
    } catch (error) {
      console.error('创建交易失败:', error.message);
      throw error;
    }
  }

  async getTransactionById(id) {
    try {
      // 调用DAL通过ID获取交易
      return await dal.getTransaction(id);
    } catch (error) {
      console.error('通过ID获取交易失败:', error.message);
      throw error;
    }
  }

  async getUserTransactions(userId) {
    try {
      // 调用DAL获取用户交易记录
      return await dal.getUserTransactions(userId);
    } catch (error) {
      console.error('获取用户交易记录失败:', error.message);
      throw error;
    }
  }

  // 更新用户余额
  async updateUserCoins(userId, amount) {
    try {
      // 调用DAL更新用户余额
      return await dal.updateUserBalance(userId, amount);
    } catch (error) {
      console.error('更新用户余额失败:', error.message);
      throw error;
    }
  }
}

module.exports = MetaJadeConnector;
