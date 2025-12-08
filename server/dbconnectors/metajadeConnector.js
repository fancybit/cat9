// 玄玉区块链连接器 - 用于连接玄玉区块链网络
const { MetaJadeHome } = require('../../metajade-csharp/nodejs');
const { spawn } = require('child_process');
const path = require('path');

class MetaJadeConnector {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {string} options.bridgeHost - 玄玉区块链网络服务端的IP，默认为localhost
   * @param {number} options.bridgePort - 玄玉区块链网络服务端的端口，默认为5000
   */
  constructor(options = {}) {
    this.connected = false;
    // 使用bridgeHost和bridgePort作为REST服务器连接参数
    this.metaJadeHome = new MetaJadeHome({
      host: options.bridgeHost || 'localhost',
      port: options.bridgePort || 5001
    });
    this.dataCache = new Map(); // 本地缓存，提高性能
    this.bridgeProcess = null;
    this.options = options;
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
    console.log('玄玉区块链正在连接...');
    try {
      // 获取用户指定的DHT服务器配置，DHT端口默认为6666，避免和其他端口冲突
      const dhtOptions = {
        port: options.dhtPort || 6666,
        ip: options.dhtIp || '0.0.0.0', // 允许配置DHT服务器IP
        enableRelay: options.enableRelay || true
      };
      
      // 检测指定端口是否被占用
      const isPortUsed = await this.isPortInUse(dhtOptions.port);
      
      if (isPortUsed) {
        console.error(`玄玉DHT服务器端口 ${dhtOptions.port} 已被占用，无法启动新的DHT服务器`);
        return Promise.reject(new Error(`玄玉DHT服务器端口 ${dhtOptions.port} 已被占用`));
      }
      
      // 启动MetaJadeBridge
      console.log('启动MetaJadeBridge...');
      // 使用dotnet run命令启动MetaJadeBridge服务
      try {
        this.bridgeProcess = spawn('dotnet', ['run'], {
          cwd: path.join(__dirname, '../../metajade-csharp/dotnet/MetaJadeBridge'),
          detached: true,
          stdio: 'ignore'
        });
        
        // 等待2秒钟让bridge启动
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (bridgeError) {
        console.error('启动MetaJadeBridge失败:', bridgeError.message);
        // 继续执行，不中断连接过程
      }
      
      // 初始化并启动DHT服务器
      console.log(`初始化并启动DHT服务器，使用IP: ${dhtOptions.ip}，端口: ${dhtOptions.port}...`);
      await this.metaJadeHome.start(dhtOptions);
      
      this.connected = true;
      console.log(`玄玉区块链已连接，DHT服务器IP: ${dhtOptions.ip}，端口: ${dhtOptions.port}`);
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
      // 停止DHT服务器
      if (this.metaJadeHome) {
        await this.metaJadeHome.stop();
      }
      
      // 关闭MetaJadeBridge进程
      if (this.bridgeProcess) {
        console.log('关闭MetaJadeBridge...');
        this.bridgeProcess.kill();
        this.bridgeProcess = null;
      }
      
      this.connected = false;
      this.dataCache.clear();
      console.log('玄玉区块链已断开连接');
      return Promise.resolve(true);
    } catch (error) {
      console.error('玄玉区块链断开连接失败:', error.message);
      return Promise.reject(error);
    }
  }

  // 生成唯一ID
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
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
      await this.metaJadeHome.store(userKey, JSON.stringify(user));
      this.dataCache.set(userKey, user);
      
      // 创建用户名索引
      const usernameIndexKey = this.getUsernameIndexKey(userData.username);
      await this.metaJadeHome.store(usernameIndexKey, userId);
      this.dataCache.set(usernameIndexKey, userId);
      
      // 创建邮箱索引
      const emailIndexKey = this.getEmailIndexKey(userData.email);
      await this.metaJadeHome.store(emailIndexKey, userId);
      this.dataCache.set(emailIndexKey, userId);
      
      // 添加verifyPassword方法
      user.verifyPassword = function(compareFunction, password) {
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
      // 从缓存或区块链获取用户名索引
      const usernameIndexKey = this.getUsernameIndexKey(username);
      let userId = this.dataCache.get(usernameIndexKey);
      
      if (!userId) {
        userId = await this.metaJadeHome.retrieve(usernameIndexKey);
        if (userId) {
          this.dataCache.set(usernameIndexKey, userId);
        } else {
          return null;
        }
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
      // 从缓存或区块链获取用户数据
      const userKey = this.getUserKey(id);
      let user = this.dataCache.get(userKey);
      
      if (!user) {
        const userData = await this.metaJadeHome.retrieve(userKey);
        if (userData) {
          user = JSON.parse(userData);
          this.dataCache.set(userKey, user);
        } else {
          return null;
        }
      }
      
      // 添加verifyPassword方法
      user.verifyPassword = function(compareFunction, password) {
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
      await this.metaJadeHome.store(userKey, JSON.stringify(updatedUser));
      this.dataCache.set(userKey, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('更新用户失败:', error.message);
      throw error;
    }
  }

  async getUserByResetToken(token) {
    try {
      // 注意：当前实现中，重置令牌没有存储在玄玉区块链上
      // 实际生产环境中应该实现此功能
      return null;
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
      await this.metaJadeHome.store(softwareKey, JSON.stringify(software));
      this.dataCache.set(softwareKey, software);
      
      return software;
    } catch (error) {
      console.error('创建软件失败:', error.message);
      throw error;
    }
  }

  async getSoftwareById(id) {
    try {
      // 从缓存或区块链获取软件数据
      const softwareKey = this.getSoftwareKey(id);
      let software = this.dataCache.get(softwareKey);
      
      if (!software) {
        const softwareData = await this.metaJadeHome.retrieve(softwareKey);
        if (softwareData) {
          software = JSON.parse(softwareData);
          this.dataCache.set(softwareKey, software);
        } else {
          return null;
        }
      }
      
      return software;
    } catch (error) {
      console.error('通过ID获取软件失败:', error.message);
      throw error;
    }
  }

  async getAllSoftware() {
    try {
      // 注意：当前实现中，玄玉区块链DHT不支持获取所有软件
      // 实际生产环境中应该维护软件索引
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
      await this.metaJadeHome.store(softwareKey, JSON.stringify(updatedSoftware));
      this.dataCache.set(softwareKey, updatedSoftware);
      
      return updatedSoftware;
    } catch (error) {
      console.error('更新软件失败:', error.message);
      throw error;
    }
  }

  // 商品相关方法
  getProductKey(productId) {
    return `product_${productId}`;
  }

  async createProduct(productData) {
    try {
      // 生成唯一商品ID
      const productId = this.generateId('product');
      
      // 创建商品对象
      const product = {
        ...productData,
        _id: productId,
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 存储商品数据到玄玉区块链
      const productKey = this.getProductKey(productId);
      await this.metaJadeHome.store(productKey, JSON.stringify(product));
      this.dataCache.set(productKey, product);
      
      return product;
    } catch (error) {
      console.error('创建商品失败:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      // 从缓存或区块链获取商品数据
      const productKey = this.getProductKey(id);
      let product = this.dataCache.get(productKey);
      
      if (!product) {
        const productData = await this.metaJadeHome.retrieve(productKey);
        if (productData) {
          product = JSON.parse(productData);
          this.dataCache.set(productKey, product);
        } else {
          return null;
        }
      }
      
      return product;
    } catch (error) {
      console.error('通过ID获取商品失败:', error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      // 注意：当前实现中，玄玉区块链DHT不支持获取所有商品
      // 实际生产环境中应该维护商品索引
      return [];
    } catch (error) {
      console.error('获取所有商品失败:', error.message);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      // 获取现有商品
      const product = await this.getProductById(id);
      if (!product) {
        return null;
      }
      
      // 更新商品数据
      const updatedProduct = {
        ...product,
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      // 存储更新后的商品数据到玄玉区块链
      const productKey = this.getProductKey(id);
      await this.metaJadeHome.store(productKey, JSON.stringify(updatedProduct));
      this.dataCache.set(productKey, updatedProduct);
      
      return updatedProduct;
    } catch (error) {
      console.error('更新商品失败:', error.message);
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
      await this.metaJadeHome.store(transactionKey, JSON.stringify(transaction));
      this.dataCache.set(transactionKey, transaction);
      
      return transaction;
    } catch (error) {
      console.error('创建交易失败:', error.message);
      throw error;
    }
  }

  async getTransactionById(id) {
    try {
      // 从缓存或区块链获取交易数据
      const transactionKey = this.getTransactionKey(id);
      let transaction = this.dataCache.get(transactionKey);
      
      if (!transaction) {
        const transactionData = await this.metaJadeHome.retrieve(transactionKey);
        if (transactionData) {
          transaction = JSON.parse(transactionData);
          this.dataCache.set(transactionKey, transaction);
        } else {
          return null;
        }
      }
      
      return transaction;
    } catch (error) {
      console.error('通过ID获取交易失败:', error.message);
      throw error;
    }
  }

  async getUserTransactions(userId) {
    try {
      // 注意：当前实现中，玄玉区块链DHT不支持获取用户交易记录
      // 实际生产环境中应该维护用户交易索引
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
      await this.metaJadeHome.store(userKey, JSON.stringify(user));
      this.dataCache.set(userKey, user);
      
      return user;
    } catch (error) {
      console.error('更新用户余额失败:', error.message);
      throw error;
    }
  }
}

module.exports = MetaJadeConnector;
