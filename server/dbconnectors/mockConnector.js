// Mock数据库连接器 - 用于开发和测试环境
const fs = require('fs');
const path = require('path');

class MockConnector {
  constructor() {
    // 设置mock数据文件路径
    this.mockDataPath = path.join(__dirname, '..', 'mock');
    
    // 模拟数据存储
    this.mockData = {
      users: [
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          passwordHash: '$2a$10$9e7JzNtQjK7e5T3b2R1a0s9d8f7g6h5j4k3l2m1n0o9p8q7r6s5t4u3v2w1x0y9z8a7b6c5d4e3f2g1h0',
          coins: 10000,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roles: ['user', 'admin'],
          displayName: '管理员',
          avatar: '',
          wallet: {
            balance: 10000
          }
        }
      ],
      software: [],
      products: [],
      transactions: [],
      // 自增ID计数器
      nextUserId: 2,
      nextSoftwareId: 1,
      nextProductId: 1,
      nextTransactionId: 1
    };
    
    // 确保mock目录存在
    if (!fs.existsSync(this.mockDataPath)) {
      fs.mkdirSync(this.mockDataPath, { recursive: true });
    }
  }

  // 从JSON文件加载数据
  async _loadData() {
    try {
      // 加载用户数据
      if (fs.existsSync(path.join(this.mockDataPath, 'users.json'))) {
        const usersData = fs.readFileSync(path.join(this.mockDataPath, 'users.json'), 'utf8');
        this.mockData.users = JSON.parse(usersData);
        // 更新下一个用户ID
        if (this.mockData.users.length > 0) {
          const maxId = Math.max(...this.mockData.users.map(user => user.id));
          this.mockData.nextUserId = maxId + 1;
        }
      }

      // 加载软件数据
      if (fs.existsSync(path.join(this.mockDataPath, 'software.json'))) {
        const softwareData = fs.readFileSync(path.join(this.mockDataPath, 'software.json'), 'utf8');
        this.mockData.software = JSON.parse(softwareData);
        // 更新下一个软件ID
        if (this.mockData.software.length > 0) {
          const maxId = Math.max(...this.mockData.software.map(software => software.id));
          this.mockData.nextSoftwareId = maxId + 1;
        }
      }

      // 加载商品数据
      if (fs.existsSync(path.join(this.mockDataPath, 'products.json'))) {
        const productsData = fs.readFileSync(path.join(this.mockDataPath, 'products.json'), 'utf8');
        this.mockData.products = JSON.parse(productsData);
        // 更新下一个商品ID
        if (this.mockData.products.length > 0) {
          const maxId = Math.max(...this.mockData.products.map(product => product.id));
          this.mockData.nextProductId = maxId + 1;
        }
      }

      // 加载交易数据
      if (fs.existsSync(path.join(this.mockDataPath, 'transactions.json'))) {
        const transactionsData = fs.readFileSync(path.join(this.mockDataPath, 'transactions.json'), 'utf8');
        this.mockData.transactions = JSON.parse(transactionsData);
        // 更新下一个交易ID
        if (this.mockData.transactions.length > 0) {
          const maxId = Math.max(...this.mockData.transactions.map(transaction => transaction.id));
          this.mockData.nextTransactionId = maxId + 1;
        }
      }
    } catch (error) {
      console.error('加载Mock数据文件时出错:', error.message);
    }
  }

  // 将数据保存到JSON文件
  _saveData() {
    try {
      // 保存用户数据
      fs.writeFileSync(
        path.join(this.mockDataPath, 'users.json'),
        JSON.stringify(this.mockData.users, null, 2),
        'utf8'
      );

      // 保存软件数据
      fs.writeFileSync(
        path.join(this.mockDataPath, 'software.json'),
        JSON.stringify(this.mockData.software, null, 2),
        'utf8'
      );

      // 保存商品数据
      fs.writeFileSync(
        path.join(this.mockDataPath, 'products.json'),
        JSON.stringify(this.mockData.products, null, 2),
        'utf8'
      );

      // 保存交易数据
      fs.writeFileSync(
        path.join(this.mockDataPath, 'transactions.json'),
        JSON.stringify(this.mockData.transactions, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('保存Mock数据文件时出错:', error.message);
    }
  }

  // 连接方法（模拟）
  async connect() {
    console.log('Mock数据库正在连接...');
    // 加载数据文件
    await this._loadData();
    console.log('Mock数据库已连接');
    return Promise.resolve(true);
  }

  // 断开连接方法（模拟）
  async disconnect() {
    console.log('Mock数据库正在断开连接...');
    // 保存数据到文件
    this._saveData();
    console.log('Mock数据库已断开连接');
    return Promise.resolve(true);
  }

  // 用户相关方法
  async createUser(userData) {
    const user = {
      id: this.mockData.nextUserId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockData.users.push(user);
    this._saveData();
    return user;
  }

  async getUserByUsername(username) {
    const user = this.mockData.users.find(user => user.username === username);
    if (user) {
      // 添加verifyPassword方法
      user.verifyPassword = function(compareFunction, password) {
        // 简单实现：当密码为"password"时返回true
        return password === 'password';
      };
    }
    return user;
  }

  async getUserById(id) {
    return this.mockData.users.find(user => user.id === id);
  }

  async updateUser(id, userData) {
    const index = this.mockData.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.mockData.users[index] = {
        ...this.mockData.users[index],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      this._saveData();
      return this.mockData.users[index];
    }
    return null;
  }

  async getUserByResetToken(token) {
    return this.mockData.users.find(user => user.resetPasswordToken === token && user.resetPasswordExpires > Date.now());
  }

  // 软件相关方法
  async createSoftware(softwareData) {
    const software = {
      id: this.mockData.nextSoftwareId++,
      ...softwareData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockData.software.push(software);
    this._saveData();
    return software;
  }

  async getSoftwareById(id) {
    return this.mockData.software.find(software => software.id === id);
  }

  async getAllSoftware() {
    return this.mockData.software;
  }

  async updateSoftware(id, softwareData) {
    const index = this.mockData.software.findIndex(software => software.id === id);
    if (index !== -1) {
      this.mockData.software[index] = {
        ...this.mockData.software[index],
        ...softwareData,
        updatedAt: new Date().toISOString()
      };
      this._saveData();
      return this.mockData.software[index];
    }
    return null;
  }

  // 商品相关方法
  async createProduct(productData) {
    const product = {
      id: this.mockData.nextProductId++,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockData.products.push(product);
    this._saveData();
    return product;
  }

  async getProductById(id) {
    return this.mockData.products.find(product => product.id === id);
  }

  async getAllProducts() {
    return this.mockData.products;
  }

  async updateProduct(id, productData) {
    const index = this.mockData.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.mockData.products[index] = {
        ...this.mockData.products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      this._saveData();
      return this.mockData.products[index];
    }
    return null;
  }

  // 交易相关方法
  async createTransaction(transactionData) {
    const transaction = {
      id: this.mockData.nextTransactionId++,
      ...transactionData,
      createdAt: new Date().toISOString()
    };
    this.mockData.transactions.push(transaction);
    this._saveData();
    return transaction;
  }

  async getTransactionById(id) {
    return this.mockData.transactions.find(transaction => transaction.id === id);
  }

  async getUserTransactions(userId) {
    return this.mockData.transactions.filter(
      transaction => transaction.userId === userId
    );
  }

  // 更新用户余额
  async updateUserCoins(userId, amount) {
    const user = await this.getUserById(userId);
    if (user) {
      user.coins += amount;
      user.updatedAt = new Date().toISOString();
      this._saveData();
      return user;
    }
    return null;
  }
}

module.exports = MockConnector;