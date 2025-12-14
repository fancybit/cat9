// 玄玉节点连接器 - 用于连接玄玉节点网络
const { MetaJadeNode } = require('../../metajade-csharp/MetaJadeNode/nodejs');

class MetaJadeConnector {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {string} options.bridgeHost - 玄玉节点网络服务器的IP，默认为localhost
   * @param {number} options.bridgePort - 玄玉节点网络服务器的端口，默认为5000
   */
  constructor(options = {}) {
    this.connected = false;
    this.dataCache = new Map(); // 本地缓存，提高性能
    this.options = options;
    // 初始化MetaJadeNode SDK实例
    this.metaJadeNode = new MetaJadeNode({
      host: options.bridgeHost || 'localhost',
      port: options.bridgePort || 5000
    });
  }

  // 检查端口是否被占用
  async isPortInUse(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const server = net.createServer();

      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      server.once('listening', () => {
        server.close();
        resolve(false);
      });

      server.listen(port, '127.0.0.1');
    });
  }

  // 连接方法
  async connect(options = {}) {
    console.log('玄玉节点正在连接中...');
    try {
      // 更新连接选项
      this.options = {
        ...this.options,
        ...options,
        bridgeHost: options.bridgeHost || 'localhost',
        bridgePort: options.bridgePort || 5000
      };

      console.log(`正在连接到玄玉节点: ${this.options.bridgeHost}:${this.options.bridgePort}`);

      // 初始化玄玉节点服务
      const initializeResult = await this.metaJadeNode.start({
        userCid: options.userCid || 'default-user-cid',
        port: options.port || 4001,
        enableRelay: options.enableRelay !== false
      });
      console.log('玄玉节点初始化结果:', initializeResult);

      // 检查初始化结果
      if (!initializeResult) {
        console.error('玄玉节点初始化失败');
        return Promise.reject(new Error('玄玉节点初始化失败'));
      }

      // 测试连接，调用getStatus方法检查玄玉节点是否可用
      const status = await this.metaJadeNode.getStatus();
      console.log('玄玉节点状态:', status);

      console.log('玄玉节点连接成功');
      this.connected = true;
      return Promise.resolve(true);
    } catch (error) {
      console.error('玄玉节点连接失败', error.message);
      return Promise.reject(error);
    }
  }

  // 断开连接方法
  async disconnect() {
    console.log('玄玉节点正在断开连接...');
    try {
      // 断开连接操作
      this.connected = false;
      this.dataCache.clear();
      console.log('玄玉节点已断开连接');
      return Promise.resolve(true);
    } catch (error) {
      console.error('玄玉节点断开连接失败:', error.message);
      return Promise.reject(error);
    }
  }

  // 生成唯一ID
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * 存储数据到玄玉区块链
   * @param {string} key - 数据键
   * @param {string} serializedData - 序列化后的数据字符串
   * @returns {Promise<void>}
   */
  async store(key, serializedData) {
    try {
      console.log(`正在将数据存储到玄玉区块链: ${key}`);

      // 使用MetaJadeNode SDK存储数据
      const result = await this.metaJadeNode.saveVar(key, serializedData);
      if (result) {
        console.log(`玄玉区块链存储数据成功: ${key}`);
        // 同时更新本地缓存
        try {
          const data = JSON.parse(serializedData);
          this.dataCache.set(key, data);
        } catch (parseError) {
          console.warn(`数据解析失败，无法更新本地缓存: ${key}`, parseError);
        }
      } else {
        console.error(`玄玉区块链存储数据失败: ${key}`);
        throw new Error('存储数据失败');
      }
    } catch (error) {
      console.error(`玄玉区块链存储数据失败: ${key}`, error);
      throw error;
    }
  }

  /**
   * 从玄玉区块链检索数据
   * @param {string} key - 数据键
   * @returns {Promise<string|null>} 序列化的数据字符串，若未找到则返回null
   */
  async retrieve(key) {
    try {
      console.log(`正在从玄玉区块链检索数据: ${key}`);

      // 首先尝试从本地缓存获取，提高性能
      const cachedData = this.dataCache.get(key);
      if (cachedData) {
        console.log(`从本地缓存获取数据成功: ${key}`);
        return JSON.stringify(cachedData);
      }

      // 本地缓存未找到，使用MetaJadeNode SDK从玄玉区块链检索
      const result = await this.metaJadeNode.getVar(key);
      if (result) {
        console.log(`从玄玉区块链检索数据成功: ${key}`);
        // 更新本地缓存
        try {
          const data = JSON.parse(result);
          this.dataCache.set(key, data);
        } catch (parseError) {
          console.warn(`数据解析失败，无法更新本地缓存: ${key}`, parseError);
        }
        return result;
      }
      console.log(`从玄玉区块链检索数据未找到: ${key}`);
      return null;
    } catch (error) {
      console.error(`从玄玉区块链检索数据失败: ${key}`, error);
      return null;
    }
  }

  // 生成数据键
  getUserKey(userId) {
    return `user_${userId}`;
  }

  getUsernameIndexKey(username) {
    return `username_index_${username}`;
  }

  getEmailIndexKey(email) {
    return `email_index_${email}`;
  }

  // 用户相关方法
  async createUser(userData) {
    try {
      // 生成唯一用户ID
      const userId = this.generateId('user');
      // 创建用户对象
      const user = {
        ...userData,
        _id: userId,
        id: userId,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        wallet: {
          balance: userData.wallet?.balance || 0,
          address: userData.wallet?.address || this.generateId('wallet')
        }
      };

      // 存储用户数据到玄玉区块链
      const userKey = this.getUserKey(userId);
      await this.store(userKey, JSON.stringify(user));

      // 创建用户名索引
      const usernameIndexKey = this.getUsernameIndexKey(userData.username);
      await this.store(usernameIndexKey, userId);

      // 创建邮箱索引
      const emailIndexKey = this.getEmailIndexKey(userData.email);
      await this.store(emailIndexKey, userId);

      // 添加verifyPassword方法
      user.verifyPassword = function (compareFunction, password) {
        return compareFunction(password, this.passwordHash);
      };

      return user;
    } catch (error) {
      console.error('创建用户失败:', error.message);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      // 从缓存或节点获取用户名索引
      const usernameIndexKey = this.getUsernameIndexKey(username);
      const userId = await this.retrieve(usernameIndexKey);

      if (!userId) {
        return null;
      }

      // 通过用户ID获取用户数据
      return this.getUserById(userId);
    } catch (error) {
      console.error('通过用户名获取用户失败:', error.message);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      // 从缓存或节点获取用户数据
      const userKey = this.getUserKey(id);
      const userData = await this.retrieve(userKey);
      
      if (!userData) {
        return null;
      }
      
      const user = JSON.parse(userData);

      // 添加verifyPassword方法
      user.verifyPassword = function (compareFunction, password) {
        return compareFunction(password, this.passwordHash);
      };

      return user;
    } catch (error) {
      console.error('通过ID获取用户失败:', error.message);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      // 获取现有用户
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }

      // 更新用户数据
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString()
      };

      // 存储更新后的用户数据到玄玉区块链
      const userKey = this.getUserKey(id);
      await this.store(userKey, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('更新用户失败:', error.message);
      throw error;
    }
  }

  async getUserByResetToken(token) {
    try {
      // 从玄玉区块链检索重置令牌对应的用户
      const resetTokenKey = `reset_token_${token}`;
      const userId = await this.retrieve(resetTokenKey);
      
      if (!userId) {
        return null;
      }
      
      return this.getUserById(userId);
    } catch (error) {
      console.error('通过重置令牌获取用户失败:', error.message);
      throw error;
    }
  }

  // 软件相关方法
  getSoftwareKey(softwareId) {
    return `software_${softwareId}`;
  }

  async createSoftware(softwareData) {
    try {
      // 生成唯一软件ID
      const softwareId = this.generateId('software');

      // 创建软件对象
      const software = {
        ...softwareData,
        _id: softwareId,
        id: softwareId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 存储软件数据到玄玉区块链
      const softwareKey = this.getSoftwareKey(softwareId);
      await this.store(softwareKey, JSON.stringify(software));

      return software;
    } catch (error) {
      console.error('创建软件失败:', error.message);
      throw error;
    }
  }

  async getSoftwareById(id) {
    try {
      // 从缓存或节点获取软件数据
      const softwareKey = this.getSoftwareKey(id);
      const softwareData = await this.retrieve(softwareKey);
      
      if (!softwareData) {
        return null;
      }
      
      return JSON.parse(softwareData);
    } catch (error) {
      console.error('通过ID获取软件失败:', error.message);
      throw error;
    }
  }

  async getAllSoftware() {
    try {
      // 注意：当前MetaJadeNode API不支持直接获取所有软件
      // 这里返回空数组，实际生产环境中应该维护软件索引
      return [];
    } catch (error) {
      console.error('获取所有软件失败:', error.message);
      throw error;
    }
  }

  async updateSoftware(id, softwareData) {
    try {
      // 获取现有软件
      const software = await this.getSoftwareById(id);
      if (!software) {
        return null;
      }

      // 更新软件数据
      const updatedSoftware = {
        ...software,
        ...softwareData,
        updatedAt: new Date().toISOString()
      };

      // 存储更新后的软件数据到玄玉区块链
      const softwareKey = this.getSoftwareKey(id);
      await this.store(softwareKey, JSON.stringify(updatedSoftware));

      return updatedSoftware;
    } catch (error) {
      console.error('更新软件失败:', error.message);
      throw error;
    }
  }

  // 产品相关方法
  getProductKey(productId) {
    return `product_${productId}`;
  }

  async createProduct(productData) {
    try {
      // 生成唯一产品ID
      const productId = this.generateId('product');

      // 创建产品对象
      const product = {
        ...productData,
        _id: productId,
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 存储产品数据到玄玉区块链
      const productKey = this.getProductKey(productId);
      await this.store(productKey, JSON.stringify(product));

      return product;
    } catch (error) {
      console.error('创建产品失败:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      // 从缓存或节点获取产品数据
      const productKey = this.getProductKey(id);
      const productData = await this.retrieve(productKey);
      
      if (!productData) {
        return null;
      }
      
      return JSON.parse(productData);
    } catch (error) {
      console.error('通过ID获取产品失败:', error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      // 注意：当前MetaJadeNode API不支持直接获取所有产品
      // 这里返回空数组，实际生产环境中应该维护产品索引
      return [];
    } catch (error) {
      console.error('获取所有产品失败:', error.message);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      // 获取现有产品
      const product = await this.getProductById(id);
      if (!product) {
        return null;
      }

      // 更新产品数据
      const updatedProduct = {
        ...product,
        ...productData,
        updatedAt: new Date().toISOString()
      };

      // 存储更新后的产品数据到玄玉区块链
      const productKey = this.getProductKey(id);
      await this.store(productKey, JSON.stringify(updatedProduct));

      return updatedProduct;
    } catch (error) {
      console.error('更新产品失败:', error.message);
      throw error;
    }
  }

  // 交易相关方法
  getTransactionKey(transactionId) {
    return `transaction_${transactionId}`;
  }

  async createTransaction(transactionData) {
    try {
      // 生成唯一交易ID
      const transactionId = this.generateId('transaction');

      // 创建交易对象
      const transaction = {
        ...transactionData,
        _id: transactionId,
        id: transactionId,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // 存储交易数据到玄玉区块链
      const transactionKey = this.getTransactionKey(transactionId);
      await this.store(transactionKey, JSON.stringify(transaction));

      // 添加到MetaJadeNode的交易记录
      await this.metaJadeNode.addTransaction(
        transactionId,
        transaction.fromCid || 'system',
        transaction.toCid || 'system',
        transaction.amount || 0,
        JSON.stringify(transaction.metadata || {}),
        new Date(transaction.createdAt)
      );

      return transaction;
    } catch (error) {
      console.error('创建交易失败:', error.message);
      throw error;
    }
  }

  async getTransactionById(id) {
    try {
      // 从缓存或节点获取交易数据
      const transactionKey = this.getTransactionKey(id);
      const transactionData = await this.retrieve(transactionKey);
      
      if (!transactionData) {
        return null;
      }
      
      return JSON.parse(transactionData);
    } catch (error) {
      console.error('通过ID获取交易失败:', error.message);
      throw error;
    }
  }

  async getUserTransactions(userId) {
    try {
      // 获取用户的所有交易记录
      // 注意：当前MetaJadeNode API不支持直接获取用户交易记录
      // 这里返回空数组，实际生产环境中应该维护用户交易索引
      return [];
    } catch (error) {
      console.error('获取用户交易记录失败:', error.message);
      throw error;
    }
  }

  // 更新用户余额
  async updateUserCoins(userId, amount) {
    try {
      // 获取现有用户
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 更新用户余额
      user.wallet.balance += amount;
      user.updatedAt = new Date().toISOString();

      // 存储更新后的用户数据到玄玉区块链
      const userKey = this.getUserKey(userId);
      await this.store(userKey, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('更新用户余额失败:', error.message);
      throw error;
    }
  }
}

module.exports = MetaJadeConnector;