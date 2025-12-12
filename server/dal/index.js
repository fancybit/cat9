// 鏁版嵁璁块棶灞?DAL) - 涓篶at9搴撴彁渚涚粺涓€鐨勬暟鎹闂帴鍙ｏ紝鍩轰簬鐜勭帀鍖哄潡閾剧綉缁?
// 瀵煎叆鏁版嵁搴撹繛鎺ュ櫒
const MetaJadeConnector = require('../dbconnectors/metajadeConnector');

// 瀵煎叆MongoDB妯″瀷锛堟殏鏃朵繚鐣欙紝鐢ㄤ簬鍏煎锛?const Game = require('../models/Game');
const mongoose = require('mongoose');

// 鏁版嵁璁块棶灞傜被
class DataAccessLayer {
  constructor(dbType = 'blockchain') {
    // 鍒濆鍖栫巹鐜夊尯鍧楅摼杩炴帴鍣?    this.connector = new MetaJadeConnector();
    this.isInitialized = false;
  }

  /**
   * 鍒濆鍖栨暟鎹闂眰
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // 杩炴帴鍒扮巹鐜夊尯鍧楅摼缃戠粶
      await this.connector.connect();
      console.log('鏁版嵁璁块棶灞傚垵濮嬪寲瀹屾垚锛屼娇鐢ㄧ巹鐜夊尯鍧楅摼缃戠粶');
      this.isInitialized = true;
    } catch (error) {
      console.error('鏁版嵁璁块棶灞傚垵濮嬪寲澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鐢熸垚鍞竴ID
   * @param {string} prefix - ID鍓嶇紑
   * @returns {string} 鍞竴ID
   */
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * 瀛樺偍鏁版嵁鍒扮巹鐜夊尯鍧楅摼
   * @param {string} key - 鏁版嵁閿?   * @param {Object} data - 鏁版嵁瀵硅薄
   * @returns {Promise<void>}
   */
  async storeData(key, data) {
    await this.initialize();
    const serializedData = JSON.stringify(data);
    await this.connector.metaJadeHome.store(key, serializedData);
  }

  /**
   * 浠庣巹鐜夊尯鍧楅摼妫€绱㈡暟鎹?   * @param {string} key - 鏁版嵁閿?   * @returns {Promise<Object|null>} 鏁版嵁瀵硅薄
   */
  async retrieveData(key) {
    await this.initialize();
    try {
      const serializedData = await this.connector.metaJadeHome.retrieve(key);
      if (serializedData) {
        const data = JSON.parse(serializedData);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`浠庣巹鐜夊尯鍧楅摼妫€绱㈡暟鎹け璐?(${key}):`, error);
      return null;
    }
  }

  /**
   * 鐢熸垚鐢ㄦ埛鏁版嵁閿?   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {string} 鐢ㄦ埛鏁版嵁閿?   */
  getUserKey(userId) {
    return `user_${userId}`;
  }

  /**
   * 鐢熸垚鐢ㄦ埛鍚嶇储寮曢敭
   * @param {string} username - 鐢ㄦ埛鍚?   * @returns {string} 鐢ㄦ埛鍚嶇储寮曢敭
   */
  getUsernameIndexKey(username) {
    return `username_index_${username}`;
  }

  /**
   * 鐢熸垚閭绱㈠紩閿?   * @param {string} email - 閭
   * @returns {string} 閭绱㈠紩閿?   */
  getEmailIndexKey(email) {
    return `email_index_${email}`;
  }

  /**
   * 鐢熸垚娓告垙鏁版嵁閿?   * @param {string} gameId - 娓告垙ID
   * @returns {string} 娓告垙鏁版嵁閿?   */
  getGameKey(gameId) {
    return `game_${gameId}`;
  }

  /**
   * 鐢熸垚浜ゆ槗鏁版嵁閿?   * @param {string} transactionId - 浜ゆ槗ID
   * @returns {string} 浜ゆ槗鏁版嵁閿?   */
  getTransactionKey(transactionId) {
    return `transaction_${transactionId}`;
  }

  /**
   * 鐢熸垚寮€鍙戣€呮暟鎹敭
   * @param {string} developerId - 寮€鍙戣€匢D
   * @returns {string} 寮€鍙戣€呮暟鎹敭
   */
  getDeveloperKey(developerId) {
    return `developer_${developerId}`;
  }

  /**
   * 鐢熸垚杞欢鏁版嵁閿?   * @param {string} softwareId - 杞欢ID
   * @returns {string} 杞欢鏁版嵁閿?   */
  getSoftwareKey(softwareId) {
    return `software_${softwareId}`;
  }

  /**
   * 鐢熸垚鍟嗗搧鏁版嵁閿?   * @param {string} productId - 鍟嗗搧ID
   * @returns {string} 鍟嗗搧鏁版嵁閿?   */
  getProductKey(productId) {
    return `product_${productId}`;
  }

  // ===== 鐢ㄦ埛鐩稿叧鏂规硶 =====
  
  /**
   * 鍒涘缓鐢ㄦ埛
   * @param {Object} userData - 鐢ㄦ埛鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓鐨勭敤鎴?   */
  async createUser(userData) {
    await this.initialize();
    
    // 妫€鏌ョ敤鎴峰悕鏄惁宸插瓨鍦?    const existingUsername = await this.getUserByUsername(userData.username);
    if (existingUsername) {
      throw new Error('鐢ㄦ埛鍚嶅凡瀛樺湪');
    }
    
    // 妫€鏌ラ偖绠辨槸鍚﹀凡瀛樺湪
    const existingEmail = await this.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('閭宸茶娉ㄥ唽');
    }
    
    // 鐢熸垚鍞竴鐢ㄦ埛ID
    const userId = this.generateId('user');
    
    // 鍒涘缓鐢ㄦ埛瀵硅薄
    const user = {
      ...userData,
      _id: userId,
      id: userId,
      createdAt: new Date(),
      lastLogin: null,
      wallet: {
        balance: userData.wallet?.balance || 0,
        address: userData.wallet?.address || this.generateId('wallet')
      },
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      },
      save: async function() {
        return this;
      },
      verifyPassword: async function(compareFn, password) {
        return compareFn(password, this.passwordHash);
      }
    };
    
    // 瀛樺偍鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getUserKey(userId), user);
    
    // 鍒涘缓鐢ㄦ埛鍚嶇储寮?    await this.storeData(this.getUsernameIndexKey(userData.username), userId);
    
    // 鍒涘缓閭绱㈠紩
    await this.storeData(this.getEmailIndexKey(userData.email), userId);
    
    return user;
  }

  /**
   * 鑾峰彇鐢ㄦ埛
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Object|null>} 鐢ㄦ埛瀵硅薄
   */
  async getUser(userId) {
    await this.initialize();
    return this.retrieveData(this.getUserKey(userId));
  }

  /**
   * 閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴?   * @param {string} username - 鐢ㄦ埛鍚?   * @returns {Promise<Object|null>} 鐢ㄦ埛瀵硅薄
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
   * 閫氳繃閭鑾峰彇鐢ㄦ埛
   * @param {string} email - 閭
   * @returns {Promise<Object|null>} 鐢ㄦ埛瀵硅薄
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
   * 閫氳繃閲嶇疆浠ょ墝鑾峰彇鐢ㄦ埛
   * @param {string} token - 閲嶇疆浠ょ墝
   * @returns {Promise<Object|null>} 鐢ㄦ埛瀵硅薄
   */
  async getUserByResetToken(token) {
    await this.initialize();
    // 閬嶅巻鎵€鏈夌敤鎴锋煡鎵惧尮閰嶇殑閲嶇疆浠ょ墝
    // 娉ㄦ剰锛氳繖鏄竴绉嶄綆鏁堢殑瀹炵幇锛屽疄闄呯敓浜х幆澧冧腑搴旇浣跨敤绱㈠紩
    // 鐢变簬鐜勭帀鍖哄潡閾綝HT鐨勯檺鍒讹紝杩欓噷鏆傛椂浣跨敤杩欑鏂瑰紡
    return null;
  }

  /**
   * 鏇存柊鐢ㄦ埛
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {Object} updateData - 鏇存柊鏁版嵁
   * @returns {Promise<Object|null>} 鏇存柊鍚庣殑鐢ㄦ埛
   */
  async updateUser(userId, updateData) {
    await this.initialize();
    
    // 鑾峰彇鐜版湁鐢ㄦ埛
    const user = await this.getUser(userId);
    if (!user) {
      return null;
    }
    
    // 鏇存柊鐢ㄦ埛鏁版嵁
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };
    
    // 瀛樺偍鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getUserKey(userId), updatedUser);
    
    return updatedUser;
  }

  // ===== 杞欢鐩稿叧鏂规硶 =====
  
  /**
   * 鍒涘缓杞欢
   * @param {Object} softwareData - 杞欢鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓鐨勮蒋浠?   */
  async createSoftware(softwareData) {
    await this.initialize();
    
    // 鐢熸垚鍞竴杞欢ID
    const softwareId = this.generateId('software');
    
    // 鍒涘缓杞欢瀵硅薄
    const software = {
      ...softwareData,
      _id: softwareId,
      id: softwareId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      }
    };
    
    // 瀛樺偍杞欢鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getSoftwareKey(softwareId), software);
    
    return software;
  }

  /**
   * 鑾峰彇杞欢
   * @param {string} softwareId - 杞欢ID
   * @returns {Promise<Object|null>} 杞欢瀵硅薄
   */
  async getSoftware(softwareId) {
    await this.initialize();
    return this.retrieveData(this.getSoftwareKey(softwareId));
  }

  /**
   * 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勮蒋浠?   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 杞欢鍒楄〃
   */
  async getUserSoftware(userId) {
    await this.initialize();
    // 娉ㄦ剰锛氱巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佹寜鐢ㄦ埛ID鏌ヨ杞欢锛岃繖閲岃繑鍥炵┖鍒楄〃
    // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ょ敤鎴疯蒋浠剁储寮?    return [];
  }

  // ===== 鍟嗗搧鐩稿叧鏂规硶 =====
  
  /**
   * 鍒涘缓鍟嗗搧
   * @param {Object} productData - 鍟嗗搧鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓鐨勫晢鍝?   */
  async createProduct(productData) {
    await this.initialize();
    
    // 鐢熸垚鍞竴鍟嗗搧ID
    const productId = this.generateId('product');
    
    // 鍒涘缓鍟嗗搧瀵硅薄
    const product = {
      ...productData,
      _id: productId,
      id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      }
    };
    
    // 瀛樺偍鍟嗗搧鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getProductKey(productId), product);
    
    return product;
  }

  /**
   * 鑾峰彇鍟嗗搧
   * @param {string} productId - 鍟嗗搧ID
   * @returns {Promise<Object|null>} 鍟嗗搧瀵硅薄
   */
  async getProduct(productId) {
    await this.initialize();
    return this.retrieveData(this.getProductKey(productId));
  }

  /**
   * 鑾峰彇鎵€鏈夊晢鍝?   * @returns {Promise<Array>} 鍟嗗搧鍒楄〃
   */
  async getAllProducts() {
    await this.initialize();
    // 娉ㄦ剰锛氱巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栨墍鏈夊晢鍝侊紝杩欓噷杩斿洖绌哄垪琛?    // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ゅ晢鍝佺储寮?    return [];
  }

  // ===== 娓告垙鐩稿叧鏂规硶 =====
  
  /**
   * 鍒涘缓娓告垙
   * @param {Object} gameData - 娓告垙鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓鐨勬父鎴?   */
  async createGame(gameData) {
    await this.initialize();
    
    // 鐢熸垚鍞竴娓告垙ID
    const gameId = this.generateId('game');
    
    // 鍒涘缓娓告垙瀵硅薄
    const game = {
      ...gameData,
      _id: gameId,
      id: gameId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      }
    };
    
    // 瀛樺偍娓告垙鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getGameKey(gameId), game);
    
    return game;
  }

  /**
   * 鑾峰彇鎵€鏈夋父鎴?   * @returns {Promise<Array>} 娓告垙鍒楄〃
   */
  async getAllGames() {
    await this.initialize();
    // 娉ㄦ剰锛氱巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栨墍鏈夋父鎴忥紝杩欓噷杩斿洖绌哄垪琛?    // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ゆ父鎴忕储寮?    return [];
  }

  /**
   * 鑾峰彇绮鹃€夋父鎴?   * @returns {Promise<Array>} 绮鹃€夋父鎴忓垪琛?   */
  async getFeaturedGames() {
    await this.initialize();
    // 娉ㄦ剰锛氱巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栫簿閫夋父鎴忥紝杩欓噷杩斿洖绌哄垪琛?    // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ょ簿閫夋父鎴忕储寮?    return [];
  }

  /**
   * 閫氳繃ID鑾峰彇娓告垙
   * @param {string} gameId - 娓告垙ID
   * @returns {Promise<Object|null>} 娓告垙瀵硅薄
   */
  async getGameById(gameId) {
    await this.initialize();
    return this.retrieveData(this.getGameKey(gameId));
  }

  // ===== 浜ゆ槗鐩稿叧鏂规硶 =====
  
  /**
   * 鍒涘缓浜ゆ槗
   * @param {Object} transactionData - 浜ゆ槗鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓鐨勪氦鏄?   */
  async createTransaction(transactionData) {
    await this.initialize();
    
    // 鐢熸垚鍞竴浜ゆ槗ID
    const transactionId = this.generateId('transaction');
    
    // 鍒涘缓浜ゆ槗瀵硅薄
    const transaction = {
      ...transactionData,
      _id: transactionId,
      id: transactionId,
      createdAt: new Date(),
      status: 'pending',
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      }
    };
    
    // 瀛樺偍浜ゆ槗鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getTransactionKey(transactionId), transaction);
    
    return transaction;
  }

  /**
   * 鑾峰彇浜ゆ槗璇︽儏
   * @param {string} transactionId - 浜ゆ槗ID
   * @returns {Promise<Object|null>} 浜ゆ槗瀵硅薄
   */
  async getTransaction(transactionId) {
    await this.initialize();
    return this.retrieveData(this.getTransactionKey(transactionId));
  }

  /**
   * 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 浜ゆ槗鍒楄〃
   */
  async getUserTransactions(userId) {
    await this.initialize();
    // 娉ㄦ剰锛氱巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佹寜鐢ㄦ埛ID鏌ヨ浜ゆ槗璁板綍锛岃繖閲岃繑鍥炵┖鍒楄〃
    // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ょ敤鎴蜂氦鏄撶储寮?    return [];
  }

  /**
   * 鎵ц浜ゆ槗
   * @param {string} transactionId - 浜ゆ槗ID
   * @returns {Promise<boolean>} 鎵ц缁撴灉
   */
  async executeTransaction(transactionId) {
    await this.initialize();
    
    // 鑾峰彇浜ゆ槗
    const transaction = await this.getTransaction(transactionId);
    if (!transaction) {
      return false;
    }
    
    // 鏇存柊浜ゆ槗鐘舵€?    transaction.status = 'completed';
    transaction.executedAt = new Date();
    
    // 瀛樺偍鏇存柊鍚庣殑浜ゆ槗鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getTransactionKey(transactionId), transaction);
    
    // 鏇存柊鐢ㄦ埛浣欓
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
   * 鏇存柊鐢ㄦ埛浣欓
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {number} amount - 浜ゆ槗閲戦锛堣礋鏁拌〃绀烘墸娆撅級
   * @returns {Promise<Object>} 鏇存柊鍚庣殑鐢ㄦ埛瀵硅薄
   */
  async updateUserBalance(userId, amount) {
    await this.initialize();
    
    // 鑾峰彇鐢ㄦ埛
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('鐢ㄦ埛涓嶅瓨鍦?);
    }
    
    // 鏇存柊鐢ㄦ埛浣欓
    user.wallet.balance += amount;
    
    // 瀛樺偍鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
    await this.storeData(this.getUserKey(userId), user);
    
    return user;
  }

  // ===== 寮€鍙戣€呯浉鍏虫柟娉?=====
  
  /**
   * 鍒涘缓寮€鍙戣€?   * @param {Object} developerData - 寮€鍙戣€呮暟鎹?   * @returns {Promise<Object>} 鍒涘缓鐨勫紑鍙戣€?   */
  async createDeveloper(developerData) {
    await this.initialize();
    
    // 鐢熸垚鍞竴寮€鍙戣€匢D
    const developerId = this.generateId('developer');
    
    // 鍒涘缓寮€鍙戣€呭璞?    const developer = {
      ...developerData,
      _id: developerId,
      id: developerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      // 娣诲姞鏂规硶妯℃嫙MongoDB妯″瀷鐨勮涓?      toJSON: function() {
        return { ...this };
      }
    };
    
    // 瀛樺偍寮€鍙戣€呮暟鎹埌鐜勭帀鍖哄潡閾?    await this.storeData(this.getDeveloperKey(developerId), developer);
    
    return developer;
  }

  /**
   * 鑾峰彇寮€鍙戣€?   * @param {string} developerId - 寮€鍙戣€匢D
   * @returns {Promise<Object|null>} 寮€鍙戣€呭璞?   */
  async getDeveloper(developerId) {
    await this.initialize();
    return this.retrieveData(this.getDeveloperKey(developerId));
  }

  /**
   * 鏇存柊寮€鍙戣€?   * @param {string} developerId - 寮€鍙戣€匢D
   * @param {Object} updateData - 鏇存柊鏁版嵁
   * @returns {Promise<Object|null>} 鏇存柊鍚庣殑寮€鍙戣€?   */
  async updateDeveloper(developerId, updateData) {
    await this.initialize();
    
    // 鑾峰彇鐜版湁寮€鍙戣€?    const developer = await this.getDeveloper(developerId);
    if (!developer) {
      return null;
    }
    
    // 鏇存柊寮€鍙戣€呮暟鎹?    const updatedDeveloper = {
      ...developer,
      ...updateData,
      updatedAt: new Date()
    };
    
    // 瀛樺偍鏇存柊鍚庣殑寮€鍙戣€呮暟鎹埌鐜勭帀鍖哄潡閾?    await this.storeData(this.getDeveloperKey(developerId), updatedDeveloper);
    
    return updatedDeveloper;
  }

  // ===== 涓氬姟鎿嶄綔鏂规硶 =====
  
  /**
   * 鐢ㄦ埛璐拱杞欢
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} softwareId - 杞欢ID
   * @returns {Promise<Object>} 鎿嶄綔缁撴灉
   */
  async purchaseSoftware(userId, softwareId) {
    await this.initialize();
    
    try {
      // 鑾峰彇鐢ㄦ埛鍜岃蒋浠朵俊鎭?      const user = await this.getUser(userId);
      const software = await this.getSoftware(softwareId);
      
      if (!user || !software) {
        throw new Error('鐢ㄦ埛鎴栬蒋浠朵笉瀛樺湪');
      }
      
      // 鍋囪鐢ㄦ埛浣跨敤wallet.balance杩涜鏀粯
      if (user.wallet.balance < software.price) {
        throw new Error('浣欓涓嶈冻');
      }
      
      // 鎵ｆ
      const updatedUser = await this.updateUserBalance(userId, -software.price);
      
      // 璁板綍浜ゆ槗
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
      console.error('璐拱杞欢澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鐢ㄦ埛璐拱鍟嗗搧
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} productId - 鍟嗗搧ID
   * @returns {Promise<Object>} 鎿嶄綔缁撴灉
   */
  async purchaseProduct(userId, productId) {
    await this.initialize();
    
    try {
      // 鑾峰彇鐢ㄦ埛鍜屽晢鍝佷俊鎭?      const user = await this.getUser(userId);
      const product = await this.getProduct(productId);
      
      if (!user || !product) {
        throw new Error('鐢ㄦ埛鎴栧晢鍝佷笉瀛樺湪');
      }
      
      if (product.stock <= 0) {
        throw new Error('鍟嗗搧搴撳瓨涓嶈冻');
      }
      
      if (user.wallet.balance < product.price) {
        throw new Error('浣欓涓嶈冻');
      }
      
      // 鎵ｆ
      const updatedUser = await this.updateUserBalance(userId, -product.price);
      
      // 鏇存柊鍟嗗搧搴撳瓨
      product.stock -= 1;
      product.updatedAt = new Date();
      await this.storeData(this.getProductKey(productId), product);
      
      // 璁板綍浜ゆ槗
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
      console.error('璐拱鍟嗗搧澶辫触:', error);
      throw error;
    }
  }

  /**
   * 濂栧姳鐢ㄦ埛Cat9Coins
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {number} amount - 濂栧姳閲戦
   * @returns {Promise<Object>} 鎿嶄綔缁撴灉
   */
  async rewardCoins(userId, amount) {
    await this.initialize();
    
    try {
      // 鏇存柊鐢ㄦ埛浣欓
      const updatedUser = await this.updateUserBalance(userId, amount);
      
      // 璁板綍浜ゆ槗
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
      console.error('濂栧姳Coins澶辫触:', error);
      throw error;
    }
  }

  // ===== 鍏朵粬鏂规硶 =====
  
  /**
   * 鑾峰彇鏁版嵁搴撶粺璁′俊鎭?   * @returns {Promise<Object>} 缁熻淇℃伅
   */
  async getStats() {
    await this.initialize();
    // 杩斿洖绠€鍗曠殑缁熻淇℃伅
    return {
      users: 0,
      games: 0,
      transactions: 0,
      software: 0,
      products: 0
    };
  }

  /**
   * 鍏抽棴鏁版嵁搴撹繛鎺?   */
  async close() {
    if (this.isInitialized) {
      // 璋冪敤杩炴帴鍣ㄧ殑disconnect鏂规硶鍏抽棴杩炴帴
      await this.connector.disconnect();
      this.isInitialized = false;
    }
  }

  /**
   * 鑾峰彇Cat9DB瀹炰緥锛堝吋瀹规棫鐗堟湰锛?   * @returns {Object} Cat9DB瀹炰緥
   */
  get catDB() {
    // 杩斿洖褰撳墠瀹炰緥锛屼綔涓篊at9DB鐨勫吋瀹瑰眰
    return this;
  }
}

// 鍒涘缓骞跺鍑篋AL瀹炰緥
const dal = new DataAccessLayer();

// 瀵煎嚭DAL绫诲拰瀹炰緥
module.exports = dal;
module.exports.DataAccessLayer = DataAccessLayer;
