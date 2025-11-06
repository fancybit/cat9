// JadeDB - 基于领域模型的数据存储和管理系统
// 提供用户账户、软件、商品和系统货币的管理功能

/**
 * 基础实体类
 * 所有领域模型的基类
 */
class BaseEntity {
  constructor(id, createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * 更新实体的更新时间
   */
  update() {
    this.updatedAt = new Date();
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * 用户账户类
 * 表示系统中的用户
 */
class User extends BaseEntity {
  constructor(id, username, email, passwordHash, displayName = null, avatar = null) {
    super(id);
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.displayName = displayName || username;
    this.avatar = avatar;
    this.isActive = true;
    this.isVerified = false;
    this.lastLogin = null;
    this.roles = ['user']; // 默认角色
    this.permissions = new Set();
    this.ownedSoftware = new Set(); // 拥有的软件ID集合
    this.ownedProducts = new Set(); // 拥有的商品ID集合
    this.wallet = {
      balance: 0, // MetaJadeCoins余额
      transactions: [] // 交易记录ID
    };
    this.settings = {}; // 用户设置
    this.profile = {}; // 用户个人资料
  }

  /**
   * 验证用户密码
   * @param {Function} verifyFn - 密码验证函数
   * @param {string} password - 待验证的密码
   * @returns {Promise<boolean>} 验证结果
   */
  async verifyPassword(verifyFn, password) {
    return verifyFn(this.passwordHash, password);
  }

  /**
   * 设置用户角色
   * @param {string} role - 角色名称
   */
  addRole(role) {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
      this.update();
    }
  }

  /**
   * 添加用户权限
   * @param {string} permission - 权限名称
   */
  addPermission(permission) {
    this.permissions.add(permission);
    this.update();
  }

  /**
   * 检查用户是否拥有指定权限
   * @param {string} permission - 权限名称
   * @returns {boolean} 是否拥有权限
   */
  hasPermission(permission) {
    return this.permissions.has(permission);
  }

  /**
   * 检查用户是否拥有指定角色
   * @param {string} role - 角色名称
   * @returns {boolean} 是否拥有角色
   */
  hasRole(role) {
    return this.roles.includes(role);
  }

  /**
   * 添加拥有的软件
   * @param {string} softwareId - 软件ID
   */
  addOwnedSoftware(softwareId) {
    this.ownedSoftware.add(softwareId);
    this.update();
  }

  /**
   * 添加拥有的商品
   * @param {string} productId - 商品ID
   */
  addOwnedProduct(productId) {
    this.ownedProducts.add(productId);
    this.update();
  }

  /**
   * 更新钱包余额
   * @param {number} amount - 金额变更（正数为增加，负数为减少）
   * @param {string} transactionId - 交易ID
   */
  updateBalance(amount, transactionId) {
    this.wallet.balance += amount;
    this.wallet.transactions.push(transactionId);
    this.update();
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      ...super.toJSON(),
      username: this.username,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar,
      isActive: this.isActive,
      isVerified: this.isVerified,
      lastLogin: this.lastLogin,
      roles: [...this.roles],
      permissions: [...this.permissions],
      ownedSoftware: [...this.ownedSoftware],
      ownedProducts: [...this.ownedProducts],
      wallet: {
        balance: this.wallet.balance,
        transactions: [...this.wallet.transactions]
      },
      settings: { ...this.settings },
      profile: { ...this.profile }
    };
  }
}

/**
 * 软件类
 * 表示系统中的软件产品
 */
class Software extends BaseEntity {
  constructor(id, name, description, publisherId, version, price = 0, tags = []) {
    super(id);
    this.name = name;
    this.description = description;
    this.publisherId = publisherId;
    this.version = version;
    this.price = price; // 价格（MetaJadeCoins）
    this.tags = [...tags];
    this.isActive = true;
    this.isFeatured = false;
    this.downloadCount = 0;
    this.rating = { average: 0, count: 0 };
    this.systemRequirements = {};
    this.categories = [];
    this.assets = {
      icon: null,
      screenshots: [],
      banner: null,
      downloadUrl: null
    };
    this.reviews = [];
  }

  /**
   * 更新软件版本
   * @param {string} newVersion - 新版本号
   */
  updateVersion(newVersion) {
    this.version = newVersion;
    this.update();
  }

  /**
   * 更新软件价格
   * @param {number} newPrice - 新价格
   */
  updatePrice(newPrice) {
    this.price = newPrice;
    this.update();
  }

  /**
   * 添加评论
   * @param {string} reviewId - 评论ID
   * @param {number} rating - 评分（1-5）
   */
  addReview(reviewId, rating) {
    this.reviews.push(reviewId);
    // 更新平均评分
    this.rating.count++;
    this.rating.average =
      ((this.rating.average * (this.rating.count - 1)) + rating) / this.rating.count;
    this.update();
  }

  /**
   * 增加下载计数
   */
  incrementDownloadCount() {
    this.downloadCount++;
    this.update();
  }

  /**
   * 设置为精选软件
   * @param {boolean} featured - 是否精选
   */
  setFeatured(featured) {
    this.isFeatured = featured;
    this.update();
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      publisherId: this.publisherId,
      version: this.version,
      price: this.price,
      tags: [...this.tags],
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      downloadCount: this.downloadCount,
      rating: { ...this.rating },
      systemRequirements: { ...this.systemRequirements },
      categories: [...this.categories],
      assets: {
        icon: this.assets.icon,
        screenshots: [...this.assets.screenshots],
        banner: this.assets.banner,
        downloadUrl: this.assets.downloadUrl
      },
      reviews: [...this.reviews]
    };
  }
}

/**
 * 商品类
 * 表示系统中的虚拟商品
 */
class Product extends BaseEntity {
  constructor(id, name, description, sellerId, price, category, tags = []) {
    super(id);
    this.name = name;
    this.description = description;
    this.sellerId = sellerId;
    this.price = price; // 价格（MetaJadeCoins）
    this.category = category;
    this.tags = [...tags];
    this.isActive = true;
    this.inStock = true;
    this.quantity = 0; // 数量，0表示无限
    this.salesCount = 0;
    this.rating = { average: 0, count: 0 };
    this.assets = {
      thumbnail: null,
      images: []
    };
    this.properties = {}; // 商品属性
    this.reviews = [];
  }

  /**
   * 更新商品价格
   * @param {number} newPrice - 新价格
   */
  updatePrice(newPrice) {
    this.price = newPrice;
    this.update();
  }

  /**
   * 更新库存数量
   * @param {number} quantity - 新数量
   */
  updateQuantity(quantity) {
    this.quantity = quantity;
    this.inStock = this.quantity > 0 || this.quantity === 0; // 0表示无限
    this.update();
  }

  /**
   * 减少库存
   * @param {number} amount - 减少数量
   * @returns {boolean} 是否成功
   */
  reduceStock(amount) {
    if (this.quantity === 0 || this.quantity >= amount) {
      if (this.quantity > 0) {
        this.quantity -= amount;
      }
      if (this.quantity === 0 && amount > 0) {
        this.inStock = false;
      }
      this.salesCount += amount;
      this.update();
      return true;
    }
    return false;
  }

  /**
   * 添加评论
   * @param {string} reviewId - 评论ID
   * @param {number} rating - 评分（1-5）
   */
  addReview(reviewId, rating) {
    this.reviews.push(reviewId);
    // 更新平均评分
    this.rating.count++;
    this.rating.average =
      ((this.rating.average * (this.rating.count - 1)) + rating) / this.rating.count;
    this.update();
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      sellerId: this.sellerId,
      price: this.price,
      category: this.category,
      tags: [...this.tags],
      isActive: this.isActive,
      inStock: this.inStock,
      quantity: this.quantity,
      salesCount: this.salesCount,
      rating: { ...this.rating },
      assets: {
        thumbnail: this.assets.thumbnail,
        images: [...this.assets.images]
      },
      properties: { ...this.properties },
      reviews: [...this.reviews]
    };
  }
}

/**
 * MetaJadeCoin交易类
 * 表示系统货币的交易记录
 */
class Transaction extends BaseEntity {
  constructor(id, type, fromUserId, toUserId, amount, description = '') {
    super(id);
    this.type = type; // 'purchase', 'sale', 'transfer', 'reward', 'refund'
    this.fromUserId = fromUserId; // null表示系统
    this.toUserId = toUserId; // null表示系统
    this.amount = amount;
    this.description = description;
    this.status = 'pending'; // 'pending', 'completed', 'failed'
    this.metadata = {}; // 交易相关的额外信息
  }

  /**
   * 更新交易状态
   * @param {string} status - 新状态
   */
  updateStatus(status) {
    this.status = status;
    this.update();
  }

  /**
   * 添加元数据
   * @param {string} key - 键名
   * @param {*} value - 值
   */
  addMetadata(key, value) {
    this.metadata[key] = value;
    this.update();
  }

  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      amount: this.amount,
      description: this.description,
      status: this.status,
      metadata: { ...this.metadata }
    };
  }
}

/**
 * JadeDB - 领域模型数据库类
 * 管理所有领域实体的存储和检索
 */
export class JadeDB {
  constructor() {
    // 内存存储
    this.users = new Map();
    this.software = new Map();
    this.products = new Map();
    this.transactions = new Map();

    // 索引
    this.indexes = {
      usersByUsername: new Map(),
      usersByEmail: new Map(),
      softwareByName: new Map(),
      productsByName: new Map(),
      transactionsByUser: new Map()
    };

    // ID生成器
    this.idCounter = 1;
  }

  /**
   * 生成唯一ID
   * @param {string} prefix - ID前缀
   * @returns {string} 唯一ID
   */
  generateId(prefix) {
    const timestamp = Date.now();
    const counter = this.idCounter++;
    return `${prefix}_${timestamp}_${counter}`;
  }

  // ===== 用户管理 =====

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @returns {User} 创建的用户对象
   */
  createUser(userData) {
    const id = this.generateId('user');
    const user = new User(
      id,
      userData.username,
      userData.email,
      userData.passwordHash,
      userData.displayName,
      userData.avatar
    );

    this.users.set(id, user);
    this.indexes.usersByUsername.set(user.username.toLowerCase(), id);
    this.indexes.usersByEmail.set(user.email.toLowerCase(), id);

    return user;
  }

  /**
   * 获取用户
   * @param {string} userId - 用户ID
   * @returns {User|null} 用户对象
   */
  getUser(userId) {
    return this.users.get(userId) || null;
  }

  /**
   * 通过用户名查找用户
   * @param {string} username - 用户名
   * @returns {User|null} 用户对象
   */
  getUserByUsername(username) {
    const userId = this.indexes.usersByUsername.get(username.toLowerCase());
    return userId ? this.users.get(userId) : null;
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email - 邮箱
   * @returns {User|null} 用户对象
   */
  getUserByEmail(email) {
    const userId = this.indexes.usersByEmail.get(email.toLowerCase());
    return userId ? this.users.get(userId) : null;
  }

  /**
   * 更新用户
   * @param {string} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {User|null} 更新后的用户对象
   */
  updateUser(userId, updateData) {
    const user = this.users.get(userId);
    if (!user) return null;

    // 更新用户数据
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        user[key] = updateData[key];
      }
    });

    user.update();
    return user;
  }

  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  deleteUser(userId) {
    const user = this.users.get(userId);
    if (!user) return false;

    // 移除索引
    this.indexes.usersByUsername.delete(user.username.toLowerCase());
    this.indexes.usersByEmail.delete(user.email.toLowerCase());

    // 从交易索引中移除
    if (this.indexes.transactionsByUser.has(userId)) {
      this.indexes.transactionsByUser.delete(userId);
    }

    // 删除用户
    return this.users.delete(userId);
  }

  // ===== 软件管理 =====

  /**
   * 创建新软件
   * @param {Object} softwareData - 软件数据
   * @returns {Software} 创建的软件对象
   */
  createSoftware(softwareData) {
    const id = this.generateId('software');
    const software = new Software(
      id,
      softwareData.name,
      softwareData.description,
      softwareData.publisherId,
      softwareData.version,
      softwareData.price || 0,
      softwareData.tags || []
    );
    this.software.set(id, software);
    this.indexes.softwareByName.set(software.name.toLowerCase(), id);
    return software;
  }

  /**
   * 获取软件
   * @param {string} softwareId - 软件ID
   * @returns {Software|null} 软件对象
   */
  getSoftware(softwareId) {
    return this.software.get(softwareId) || null;
  }

  /**
   * 通过名称查找软件
   * @param {string} name - 软件名称
   * @returns {Software|null} 软件对象
   */
  getSoftwareByName(name) {
    const softwareId = this.indexes.softwareByName.get(name.toLowerCase());
    return softwareId ? this.software.get(softwareId) : null;
  }

  /**
   * 更新软件
   * @param {string} softwareId - 软件ID
   * @param {Object} updateData - 更新数据
   * @returns {Software|null} 更新后的软件对象
   */
  updateSoftware(softwareId, updateData) {
    const software = this.software.get(softwareId);
    if (!software) return null;
    // 更新软件数据
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        software[key] = updateData[key];
      }
    });
    software.update();
    return software;
  }

  /**
   * 删除软件
   * @param {string} softwareId - 软件ID
   * @returns {boolean} 是否成功
   */
  deleteSoftware(softwareId) {
    const software = this.software.get(softwareId);
    if (!software) return false;
    // 移除索引
    this.indexes.softwareByName.delete(software.name.toLowerCase());
    // 删除软件
    return this.software.delete(softwareId);
  }

  /**
   * 获取用户拥有的软件
   * @param {string} userId - 用户ID
   * @returns {Software[]} 软件列表
   */
  getUserSoftware(userId) {
    const user = this.users.get(userId);
    if (!user) return [];
    return Array.from(user.ownedSoftware)
      .map(softwareId => this.software.get(softwareId))
      .filter(Boolean);
  }

  // ===== 商品管理 =====

  /**
   * 创建新商品
   * @param {Object} productData - 商品数据
   * @returns {Product} 创建的商品对象
   */
  createProduct(productData) {
    const id = this.generateId('product');
    const product = new Product(
      id,
      productData.name,
      productData.description,
      productData.sellerId,
      productData.price,
      productData.category,
      productData.tags || []
    );
    this.products.set(id, product);
    this.indexes.productsByName.set(product.name.toLowerCase(), id);

    return product;
  }

  /**
   * 获取商品
   * @param {string} productId - 商品ID
   * @returns {Product|null} 商品对象
   */
  getProduct(productId) {
    return this.products.get(productId) || null;
  }

  /**
   * 通过名称查找商品
   * @param {string} name - 商品名称
   * @returns {Product|null} 商品对象
   */
  getProductByName(name) {
    const productId = this.indexes.productsByName.get(name.toLowerCase());
    return productId ? this.products.get(productId) : null;
  }

  /**
   * 更新商品
   * @param {string} productId - 商品ID
   * @param {Object} updateData - 更新数据
   * @returns {Product|null} 更新后的商品对象
   */
  updateProduct(productId, updateData) {
    const product = this.products.get(productId);
    if (!product) return null;

    // 更新商品数据
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        product[key] = updateData[key];
      }
    });

    product.update();
    return product;
  }

  /**
   * 删除商品
   * @param {string} productId - 商品ID
   * @returns {boolean} 是否成功
   */
  deleteProduct(productId) {
    const product = this.products.get(productId);
    if (!product) return false;

    // 移除索引
    this.indexes.productsByName.delete(product.name.toLowerCase());

    // 删除商品
    return this.products.delete(productId);
  }

  /**
   * 获取用户拥有的商品
   * @param {string} userId - 用户ID
   * @returns {Product[]} 商品列表
   */
  getUserProducts(userId) {
    const user = this.users.get(userId);
    if (!user) return [];

    return Array.from(user.ownedProducts)
      .map(productId => this.products.get(productId))
      .filter(Boolean);
  }

  // ===== 交易管理 =====

  /**
   * 创建新交易
   * @param {Object} transactionData - 交易数据
   * @returns {Transaction} 创建的交易对象
   */
  createTransaction(transactionData) {
    const id = this.generateId('tx');
    const transaction = new Transaction(
      id,
      transactionData.type,
      transactionData.fromUserId,
      transactionData.toUserId,
      transactionData.amount,
      transactionData.description
    );

    this.transactions.set(id, transaction);

    // 更新交易索引
    if (transaction.fromUserId) {
      if (!this.indexes.transactionsByUser.has(transaction.fromUserId)) {
        this.indexes.transactionsByUser.set(transaction.fromUserId, new Set());
      }
      this.indexes.transactionsByUser.get(transaction.fromUserId).add(id);
    }

    if (transaction.toUserId) {
      if (!this.indexes.transactionsByUser.has(transaction.toUserId)) {
        this.indexes.transactionsByUser.set(transaction.toUserId, new Set());
      }
      this.indexes.transactionsByUser.get(transaction.toUserId).add(id);
    }

    return transaction;
  }

  /**
   * 执行交易
   * @param {string} transactionId - 交易ID
   * @returns {boolean} 是否成功
   */
  async executeTransaction(transactionId) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction || transaction.status !== 'pending') {
      return false;
    }

    try {
      // 检查余额
      if (transaction.fromUserId) {
        const fromUser = this.users.get(transaction.fromUserId);
        if (!fromUser || fromUser.wallet.balance < transaction.amount) {
          transaction.updateStatus('failed');
          return false;
        }
      }

      // 执行转账
      if (transaction.fromUserId) {
        const fromUser = this.users.get(transaction.fromUserId);
        fromUser.updateBalance(-transaction.amount, transactionId);
      }

      if (transaction.toUserId) {
        const toUser = this.users.get(transaction.toUserId);
        toUser.updateBalance(transaction.amount, transactionId);
      }

      // 更新交易状态
      transaction.updateStatus('completed');
      return true;
    } catch (error) {
      console.error('执行交易失败:', error);
      transaction.updateStatus('failed');
      return false;
    }
  }

  /**
   * 获取交易
   * @param {string} transactionId - 交易ID
   * @returns {Transaction|null} 交易对象
   */
  getTransaction(transactionId) {
    return this.transactions.get(transactionId) || null;
  }

  /**
   * 获取用户交易记录
   * @param {string} userId - 用户ID
   * @returns {Transaction[]} 交易列表
   */
  getUserTransactions(userId) {
    const transactionIds = this.indexes.transactionsByUser.get(userId);
    if (!transactionIds) return [];

    return Array.from(transactionIds)
      .map(txId => this.transactions.get(txId))
      .filter(Boolean)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // ===== 业务操作 =====

  /**
   * 用户购买软件
   * @param {string} userId - 用户ID
   * @param {string} softwareId - 软件ID
   * @returns {Object} 操作结果
   */
  async purchaseSoftware(userId, softwareId) {
    const user = this.users.get(userId);
    const software = this.software.get(softwareId);

    if (!user || !software || !software.isActive || user.ownedSoftware.has(softwareId)) {
      return { success: false, error: '无效的操作' };
    }

    // 检查余额
    if (user.wallet.balance < software.price) {
      return { success: false, error: '余额不足' };
    }

    // 创建交易
    const transaction = this.createTransaction({
      type: 'purchase',
      fromUserId: userId,
      toUserId: software.publisherId,
      amount: software.price,
      description: `购买软件: ${software.name}`
    });

    // 执行交易
    if (await this.executeTransaction(transaction.id)) {
      // 添加到用户拥有的软件
      user.addOwnedSoftware(softwareId);
      // 增加下载计数
      software.incrementDownloadCount();

      return { success: true, transactionId: transaction.id };
    }

    return { success: false, error: '交易失败' };
  }

  /**
   * 用户购买商品
   * @param {string} userId - 用户ID
   * @param {string} productId - 商品ID
   * @returns {Object} 操作结果
   */
  async purchaseProduct(userId, productId) {
    const user = this.users.get(userId);
    const product = this.products.get(productId);

    if (!user || !product || !product.isActive || !product.inStock || user.ownedProducts.has(productId)) {
      return { success: false, error: '无效的操作' };
    }

    // 检查余额
    if (user.wallet.balance < product.price) {
      return { success: false, error: '余额不足' };
    }

    // 减少库存
    if (!product.reduceStock(1)) {
      return { success: false, error: '库存不足' };
    }

    // 创建交易
    const transaction = this.createTransaction({
      type: 'purchase',
      fromUserId: userId,
      toUserId: product.sellerId,
      amount: product.price,
      description: `购买商品: ${product.name}`
    });

    // 执行交易
    if (await this.executeTransaction(transaction.id)) {
      // 添加到用户拥有的商品
      user.addOwnedProduct(productId);

      return { success: true, transactionId: transaction.id };
    }

    // 如果交易失败，恢复库存
    product.quantity += 1;
    product.inStock = true;
    product.salesCount -= 1;

    return { success: false, error: '交易失败' };
  }

  /**
   * 转账MetaJadeCoins
   * @param {string} fromUserId - 转出用户ID
   * @param {string} toUserId - 转入用户ID
   * @param {number} amount - 金额
   * @param {string} description - 描述
   * @returns {Object} 操作结果
   */
  async transferCoins(fromUserId, toUserId, amount, description = '') {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);

    if (!fromUser || !toUser || amount <= 0 || fromUser.wallet.balance < amount) {
      return { success: false, error: '无效的转账' };
    }

    // 创建交易
    const transaction = this.createTransaction({
      type: 'transfer',
      fromUserId,
      toUserId,
      amount,
      description: description || `转账给: ${toUser.displayName}`
    });

    // 执行交易
    if (await this.executeTransaction(transaction.id)) {
      return { success: true, transactionId: transaction.id };
    }

    return { success: false, error: '转账失败' };
  }

  /**
   * 奖励用户MetaJadeCoins
   * @param {string} userId - 用户ID
   * @param {number} amount - 金额
   * @param {string} description - 描述
   * @returns {Object} 操作结果
   */
  async rewardCoins(userId, amount, description = '') {
    const user = this.users.get(userId);

    if (!user || amount <= 0) {
      return { success: false, error: '无效的奖励' };
    }

    // 创建交易
    const transaction = this.createTransaction({
      type: 'reward',
      fromUserId: null, // 系统
      toUserId: userId,
      amount,
      description: description || '系统奖励'
    });

    // 执行交易（从系统转出）
    user.updateBalance(amount, transaction.id);
    transaction.updateStatus('completed');

    return { success: true, transactionId: transaction.id };
  }

  // ===== 数据导出和导入 =====

  /**
   * 导出数据库数据
   * @returns {Object} 数据库快照
   */
  exportData() {
    return {
      users: Array.from(this.users.values()).map(u => u.toJSON()),
      software: Array.from(this.software.values()).map(s => s.toJSON()),
      products: Array.from(this.products.values()).map(p => p.toJSON()),
      transactions: Array.from(this.transactions.values()).map(t => t.toJSON()),
      idCounter: this.idCounter,
      exportedAt: new Date()
    };
  }

  /**
   * 导入数据库数据
   * @param {Object} data - 数据库快照
   */
  importData(data) {
    // 清空现有数据
    this.users.clear();
    this.software.clear();
    this.products.clear();
    this.transactions.clear();

    // 重置索引
    Object.keys(this.indexes).forEach(key => {
      this.indexes[key].clear();
    });

    // 导入用户数据
    data.users.forEach(userData => {
      const user = new User(
        userData.id,
        userData.username,
        userData.email,
        userData.passwordHash,
        userData.displayName,
        userData.avatar
      );

      // 恢复其他属性
      Object.assign(user, userData);

      this.users.set(user.id, user);
      this.indexes.usersByUsername.set(user.username.toLowerCase(), user.id);
      this.indexes.usersByEmail.set(user.email.toLowerCase(), user.id);
    });

    // 导入软件数据
    data.software.forEach(softwareData => {
      const software = new Software(
        softwareData.id,
        softwareData.name,
        softwareData.description,
        softwareData.publisherId,
        softwareData.version,
        softwareData.price,
        softwareData.tags
      );

      // 恢复其他属性
      Object.assign(software, softwareData);

      this.software.set(software.id, software);
      this.indexes.softwareByName.set(software.name.toLowerCase(), software.id);
    });

    // 导入商品数据
    data.products.forEach(productData => {
      const product = new Product(
        productData.id,
        productData.name,
        productData.description,
        productData.sellerId,
        productData.price,
        productData.category,
        productData.tags
      );

      // 恢复其他属性
      Object.assign(product, productData);

      this.products.set(product.id, product);
      this.indexes.productsByName.set(product.name.toLowerCase(), product.id);
    });

    // 导入交易数据
    data.transactions.forEach(transactionData => {
      const transaction = new Transaction(
        transactionData.id,
        transactionData.type,
        transactionData.fromUserId,
        transactionData.toUserId,
        transactionData.amount,
        transactionData.description
      );

      // 恢复其他属性
      Object.assign(transaction, transactionData);

      this.transactions.set(transaction.id, transaction);

      // 恢复交易索引
      if (transaction.fromUserId) {
        if (!this.indexes.transactionsByUser.has(transaction.fromUserId)) {
          this.indexes.transactionsByUser.set(transaction.fromUserId, new Set());
        }
        this.indexes.transactionsByUser.get(transaction.fromUserId).add(transaction.id);
      }

      if (transaction.toUserId) {
        if (!this.indexes.transactionsByUser.has(transaction.toUserId)) {
          this.indexes.transactionsByUser.set(transaction.toUserId, new Set());
        }
        this.indexes.transactionsByUser.get(transaction.toUserId).add(transaction.id);
      }
    });

    // 恢复ID计数器
    this.idCounter = data.idCounter || 1;
  }
}

// 导出CatDB类和相关模型
export { BaseEntity, User, Software, Product, Transaction };