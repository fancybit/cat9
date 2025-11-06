// MySQL数据库连接器
const mysql = require('mysql2/promise');

class MySQLConnector {
  constructor() {
    this.pool = null;
  }

  // 连接到MySQL
  async connect(config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cat9',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }) {
    try {
      this.pool = mysql.createPool(config);
      
      // 测试连接
      const [rows] = await this.pool.query('SELECT 1 + 1 AS solution');
      console.log('MySQL数据库已连接，测试结果:', rows[0].solution);
      
      // 初始化表结构（如果不存在）
      await this._initTables();
      
      return true;
    } catch (error) {
      console.error('MySQL连接失败:', error.message);
      throw error;
    }
  }

  // 初始化数据库表结构
  async _initTables() {
    try {
      // 创建用户表
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          passwordHash VARCHAR(255) NOT NULL,
          coins INT DEFAULT 0,
          role VARCHAR(20) DEFAULT 'user',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      // 创建软件表
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS software (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          version VARCHAR(20) NOT NULL,
          price INT NOT NULL,
          publisherId INT NOT NULL,
          isFeatured BOOLEAN DEFAULT FALSE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (publisherId) REFERENCES users(id)
        );
      `);

      // 创建商品表
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          price INT NOT NULL,
          stock INT NOT NULL DEFAULT 0,
          category VARCHAR(50) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      // 创建交易表
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          type VARCHAR(20) NOT NULL,
          amount INT NOT NULL,
          itemId VARCHAR(50),
          itemType VARCHAR(20),
          status VARCHAR(20) DEFAULT 'completed',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `);

      console.log('MySQL表结构初始化完成');
    } catch (error) {
      console.error('MySQL表结构初始化失败:', error.message);
      throw error;
    }
  }

  // 断开连接
  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log('MySQL数据库已断开连接');
        return true;
      }
      return false;
    } catch (error) {
      console.error('MySQL断开连接失败:', error.message);
      throw error;
    }
  }

  // 用户相关方法
  async createUser(userData) {
    const { username, email, passwordHash, coins = 0, role = 'user' } = userData;
    const [result] = await this.pool.query(
      'INSERT INTO users (username, email, passwordHash, coins, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, passwordHash, coins, role]
    );
    
    return {
      id: result.insertId,
      username,
      email,
      passwordHash,
      coins,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getUserByUsername(username) {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  async getUserById(id) {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async updateUser(id, userData) {
    const fields = [];
    const values = [];
    
    Object.entries(userData).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });
    
    values.push(id);
    
    await this.pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.getUserById(id);
  }

  // 软件相关方法
  async createSoftware(softwareData) {
    const { name, description, version, price, publisherId, isFeatured = false } = softwareData;
    const [result] = await this.pool.query(
      'INSERT INTO software (name, description, version, price, publisherId, isFeatured) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, version, price, publisherId, isFeatured]
    );
    
    return {
      id: result.insertId,
      name,
      description,
      version,
      price,
      publisherId,
      isFeatured,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getSoftwareById(id) {
    const [rows] = await this.pool.query('SELECT * FROM software WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async getAllSoftware() {
    const [rows] = await this.pool.query('SELECT * FROM software');
    return rows;
  }

  async updateSoftware(id, softwareData) {
    const fields = [];
    const values = [];
    
    Object.entries(softwareData).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });
    
    values.push(id);
    
    await this.pool.query(
      `UPDATE software SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.getSoftwareById(id);
  }

  // 商品相关方法
  async createProduct(productData) {
    const { name, description, price, stock = 0, category } = productData;
    const [result] = await this.pool.query(
      'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, category]
    );
    
    return {
      id: result.insertId,
      name,
      description,
      price,
      stock,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getProductById(id) {
    const [rows] = await this.pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async getAllProducts() {
    const [rows] = await this.pool.query('SELECT * FROM products');
    return rows;
  }

  async updateProduct(id, productData) {
    const fields = [];
    const values = [];
    
    Object.entries(productData).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });
    
    values.push(id);
    
    await this.pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.getProductById(id);
  }

  // 交易相关方法
  async createTransaction(transactionData) {
    const { userId, type, amount, itemId, itemType, status = 'completed' } = transactionData;
    const [result] = await this.pool.query(
      'INSERT INTO transactions (userId, type, amount, itemId, itemType, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, amount, itemId, itemType, status]
    );
    
    return {
      id: result.insertId,
      userId,
      type,
      amount,
      itemId,
      itemType,
      status,
      createdAt: new Date()
    };
  }

  async getTransactionById(id) {
    const [rows] = await this.pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async getUserTransactions(userId) {
    const [rows] = await this.pool.query('SELECT * FROM transactions WHERE userId = ?', [userId]);
    return rows;
  }

  // 更新用户余额
  async updateUserCoins(userId, amount) {
    await this.pool.query(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [amount, userId]
    );
    return await this.getUserById(userId);
  }
}

module.exports = MySQLConnector;