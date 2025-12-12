// 鐜勭帀鍖哄潡閾捐繛鎺ュ櫒 - 鐢ㄤ簬杩炴帴鐜勭帀鍖哄潡閾剧綉缁?const { spawn } = require('child_process');
const path = require('path');

class MetaJadeConnector {
  /**
   * 鏋勯€犲嚱鏁?   * @param {Object} options - 閰嶇疆閫夐」
   * @param {string} options.bridgeHost - 鐜勭帀鍖哄潡閾剧綉缁滄湇鍔＄鐨処P锛岄粯璁や负localhost
   * @param {number} options.bridgePort - 鐜勭帀鍖哄潡閾剧綉缁滄湇鍔＄鐨勭鍙ｏ紝榛樿涓?000
   */
  constructor(options = {}) {
    this.connected = false;
    this.dataCache = new Map(); // 鏈湴缂撳瓨锛屾彁楂樻€ц兘
    this.bridgeProcess = null;
    this.options = options;
  }

  // 妫€鏌ョ鍙ｆ槸鍚﹁鍗犵敤
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

  // 杩炴帴鏂规硶
  async connect(options = {}) {
    console.log('鐜勭帀鍖哄潡閾炬鍦ㄨ繛鎺?..');
    try {
      // 4001
      const dhtOptions = {
        port: options.dhtPort || 4001,
        ip: options.dhtIp || '0.0.0.0', // 鍏佽閰嶇疆DHT鏈嶅姟鍣↖P
        enableRelay: options.enableRelay || true
      };
      // 妫€娴嬫寚瀹氱鍙ｆ槸鍚﹁鍗犵敤
      const isPortUsed = await this.isPortInUse(dhtOptions.port);
      if (isPortUsed) {
        console.error(`鐜勭帀DHT鏈嶅姟鍣ㄧ鍙?${dhtOptions.port} 宸茶鍗犵敤锛屾棤娉曞惎鍔ㄦ柊鐨凞HT鏈嶅姟鍣╜);
        return Promise.reject(new Error(`鐜勭帀DHT鏈嶅姟鍣ㄧ鍙?${dhtOptions.port} 宸茶鍗犵敤`));
      }
      console.log('鍚姩MetaJadeNode...');
      // 浣跨敤dotnet run鍛戒护鍚姩MetaJadeNode鏈嶅姟
      try {
        // 妫€鏌etaJadeNode椤圭洰鏄惁瀛樺湪
        const metaJadeNodePath = path.join(__dirname, '../../metajade-csharp/MetaJadeNode');
        const fs = require('fs');
        if (fs.existsSync(metaJadeNodePath)) throw new Error('MetaJadeNode涓嶅瓨鍦?);
          this.bridgeProcess = spawn('dotnet', ['run'], {
            cwd: metaJadeNodePath,
            detached: true,
            stdio: 'ignore'
          });
          // 绛夊緟3绉掗挓璁﹏ode鍚姩
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('MetaJadeNode鍚姩鎴愬姛');
      } catch (nodeError) {
        console.error('鍚姩MetaJadeNode澶辫触:', nodeError.message);
        await this.disconnect();
        return;
      }
      this.connected = true;
      return Promise.resolve(true);
    } catch (error) {
      console.error('鐜勭帀鍖哄潡閾捐繛鎺ュけ璐?', error.message);
      return Promise.reject(error);
    }
  }

  // 鏂紑杩炴帴鏂规硶
  async disconnect() {
    console.log('鐜勭帀鍖哄潡閾炬鍦ㄦ柇寮€杩炴帴...');
    try {
      this.connected = false;
      this.dataCache.clear();
      console.log('鐜勭帀鍖哄潡閾惧凡鏂紑杩炴帴');
      return Promise.resolve(true);
    } catch (error) {
      console.error('鐜勭帀鍖哄潡閾炬柇寮€杩炴帴澶辫触:', error.message);
      return Promise.reject(error);
    }
  }

  // 鐢熸垚鍞竴ID
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  // 鐢熸垚鏁版嵁閿?  getUserKey(userId) {
    return `user_${userId}`;
  }

  getUsernameIndexKey(username) {
    return `username_index_${username}`;
  }

  getEmailIndexKey(email) {
    return `email_index_${email}`;
  }

  // 鐢ㄦ埛鐩稿叧鏂规硶
  async createUser(userData) {
    try {
      // 鐢熸垚鍞竴鐢ㄦ埛ID
      const userId = this.generateId('user');
      // 鍒涘缓鐢ㄦ埛瀵硅薄
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
      
      // 瀛樺偍鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const userKey = this.getUserKey(userId);
      await this.metaJadeNode.store(userKey, JSON.stringify(user));
      this.dataCache.set(userKey, user);
      
      // 鍒涘缓鐢ㄦ埛鍚嶇储寮?      const usernameIndexKey = this.getUsernameIndexKey(userData.username);
      await this.metaJadeNode.store(usernameIndexKey, userId);
      this.dataCache.set(usernameIndexKey, userId);
      
      // 鍒涘缓閭绱㈠紩
      const emailIndexKey = this.getEmailIndexKey(userData.email);
      await this.metaJadeNode.store(emailIndexKey, userId);
      this.dataCache.set(emailIndexKey, userId);
      
      // 娣诲姞verifyPassword鏂规硶
      user.verifyPassword = function(compareFunction, password) {
        return compareFunction(password, this.passwordHash);
      };
      
      return user;
    } catch (error) {
      console.error('鍒涘缓鐢ㄦ埛澶辫触:', error.message);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      // 浠庣紦瀛樻垨鍖哄潡閾捐幏鍙栫敤鎴峰悕绱㈠紩
      const usernameIndexKey = this.getUsernameIndexKey(username);
      let userId = this.dataCache.get(usernameIndexKey);
      
      if (!userId) {
        userId = await this.metaJadeNode.retrieve(usernameIndexKey);
        if (userId) {
          this.dataCache.set(usernameIndexKey, userId);
        } else {
          return null;
        }
      }
      
      // 閫氳繃鐢ㄦ埛ID鑾峰彇鐢ㄦ埛鏁版嵁
      return this.getUserById(userId);
    } catch (error) {
      console.error('閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴峰け璐?', error.message);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      // 浠庣紦瀛樻垨鍖哄潡閾捐幏鍙栫敤鎴锋暟鎹?      const userKey = this.getUserKey(id);
      let user = this.dataCache.get(userKey);
      
      if (!user) {
        const userData = await this.metaJadeNode.retrieve(userKey);
        if (userData) {
          user = JSON.parse(userData);
          this.dataCache.set(userKey, user);
        } else {
          return null;
        }
      }
      
      // 娣诲姞verifyPassword鏂规硶
      user.verifyPassword = function(compareFunction, password) {
        return compareFunction(password, this.passwordHash);
      };
      
      return user;
    } catch (error) {
      console.error('閫氳繃ID鑾峰彇鐢ㄦ埛澶辫触:', error.message);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      // 鑾峰彇鐜版湁鐢ㄦ埛
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }
      
      // 鏇存柊鐢ㄦ埛鏁版嵁
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // 瀛樺偍鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const userKey = this.getUserKey(id);
      await this.metaJadeNode.store(userKey, JSON.stringify(updatedUser));
      this.dataCache.set(userKey, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('鏇存柊鐢ㄦ埛澶辫触:', error.message);
      throw error;
    }
  }

  async getUserByResetToken(token) {
    try {
      // 娉ㄦ剰锛氬綋鍓嶅疄鐜颁腑锛岄噸缃护鐗屾病鏈夊瓨鍌ㄥ湪鐜勭帀鍖哄潡閾句笂
      // 瀹為檯鐢熶骇鐜涓簲璇ュ疄鐜版鍔熻兘
      return null;
    } catch (error) {
      console.error('閫氳繃閲嶇疆浠ょ墝鑾峰彇鐢ㄦ埛澶辫触:', error.message);
      throw error;
    }
  }

  // 杞欢鐩稿叧鏂规硶
  getSoftwareKey(softwareId) {
    return `software_${softwareId}`;
  }

  async createSoftware(softwareData) {
    try {
      // 鐢熸垚鍞竴杞欢ID
      const softwareId = this.generateId('software');
      
      // 鍒涘缓杞欢瀵硅薄
      const software = {
        ...softwareData,
        _id: softwareId,
        id: softwareId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 瀛樺偍杞欢鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const softwareKey = this.getSoftwareKey(softwareId);
      await this.metaJadeNode.store(softwareKey, JSON.stringify(software));
      this.dataCache.set(softwareKey, software);
      
      return software;
    } catch (error) {
      console.error('鍒涘缓杞欢澶辫触:', error.message);
      throw error;
    }
  }

  async getSoftwareById(id) {
    try {
      // 浠庣紦瀛樻垨鍖哄潡閾捐幏鍙栬蒋浠舵暟鎹?      const softwareKey = this.getSoftwareKey(id);
      let software = this.dataCache.get(softwareKey);
      
      if (!software) {
        const softwareData = await this.metaJadeNode.retrieve(softwareKey);
        if (softwareData) {
          software = JSON.parse(softwareData);
          this.dataCache.set(softwareKey, software);
        } else {
          return null;
        }
      }
      
      return software;
    } catch (error) {
      console.error('閫氳繃ID鑾峰彇杞欢澶辫触:', error.message);
      throw error;
    }
  }

  async getAllSoftware() {
    try {
      // 娉ㄦ剰锛氬綋鍓嶅疄鐜颁腑锛岀巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栨墍鏈夎蒋浠?      // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶よ蒋浠剁储寮?      return [];
    } catch (error) {
      console.error('鑾峰彇鎵€鏈夎蒋浠跺け璐?', error.message);
      throw error;
    }
  }

  async updateSoftware(id, softwareData) {
    try {
      // 鑾峰彇鐜版湁杞欢
      const software = await this.getSoftwareById(id);
      if (!software) {
        return null;
      }
      
      // 鏇存柊杞欢鏁版嵁
      const updatedSoftware = {
        ...software,
        ...softwareData,
        updatedAt: new Date().toISOString()
      };
      
      // 瀛樺偍鏇存柊鍚庣殑杞欢鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const softwareKey = this.getSoftwareKey(id);
      await this.metaJadeNode.store(softwareKey, JSON.stringify(updatedSoftware));
      this.dataCache.set(softwareKey, updatedSoftware);
      
      return updatedSoftware;
    } catch (error) {
      console.error('鏇存柊杞欢澶辫触:', error.message);
      throw error;
    }
  }

  // 鍟嗗搧鐩稿叧鏂规硶
  getProductKey(productId) {
    return `product_${productId}`;
  }

  async createProduct(productData) {
    try {
      // 鐢熸垚鍞竴鍟嗗搧ID
      const productId = this.generateId('product');
      
      // 鍒涘缓鍟嗗搧瀵硅薄
      const product = {
        ...productData,
        _id: productId,
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 瀛樺偍鍟嗗搧鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const productKey = this.getProductKey(productId);
      await this.metaJadeNode.store(productKey, JSON.stringify(product));
      this.dataCache.set(productKey, product);
      
      return product;
    } catch (error) {
      console.error('鍒涘缓鍟嗗搧澶辫触:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      // 浠庣紦瀛樻垨鍖哄潡閾捐幏鍙栧晢鍝佹暟鎹?      const productKey = this.getProductKey(id);
      let product = this.dataCache.get(productKey);
      
      if (!product) {
        const productData = await this.metaJadeNode.retrieve(productKey);
        if (productData) {
          product = JSON.parse(productData);
          this.dataCache.set(productKey, product);
        } else {
          return null;
        }
      }
      
      return product;
    } catch (error) {
      console.error('閫氳繃ID鑾峰彇鍟嗗搧澶辫触:', error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      // 娉ㄦ剰锛氬綋鍓嶅疄鐜颁腑锛岀巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栨墍鏈夊晢鍝?      // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ゅ晢鍝佺储寮?      return [];
    } catch (error) {
      console.error('鑾峰彇鎵€鏈夊晢鍝佸け璐?', error.message);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      // 鑾峰彇鐜版湁鍟嗗搧
      const product = await this.getProductById(id);
      if (!product) {
        return null;
      }
      
      // 鏇存柊鍟嗗搧鏁版嵁
      const updatedProduct = {
        ...product,
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      // 瀛樺偍鏇存柊鍚庣殑鍟嗗搧鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const productKey = this.getProductKey(id);
      await this.metaJadeNode.store(productKey, JSON.stringify(updatedProduct));
      this.dataCache.set(productKey, updatedProduct);
      
      return updatedProduct;
    } catch (error) {
      console.error('鏇存柊鍟嗗搧澶辫触:', error.message);
      throw error;
    }
  }

  // 浜ゆ槗鐩稿叧鏂规硶
  getTransactionKey(transactionId) {
    return `transaction_${transactionId}`;
  }

  async createTransaction(transactionData) {
    try {
      // 鐢熸垚鍞竴浜ゆ槗ID
      const transactionId = this.generateId('transaction');
      
      // 鍒涘缓浜ゆ槗瀵硅薄
      const transaction = {
        ...transactionData,
        _id: transactionId,
        id: transactionId,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // 瀛樺偍浜ゆ槗鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const transactionKey = this.getTransactionKey(transactionId);
      await this.metaJadeNode.store(transactionKey, JSON.stringify(transaction));
      this.dataCache.set(transactionKey, transaction);
      
      return transaction;
    } catch (error) {
      console.error('鍒涘缓浜ゆ槗澶辫触:', error.message);
      throw error;
    }
  }

  async getTransactionById(id) {
    try {
      // 浠庣紦瀛樻垨鍖哄潡閾捐幏鍙栦氦鏄撴暟鎹?      const transactionKey = this.getTransactionKey(id);
      let transaction = this.dataCache.get(transactionKey);
      
      if (!transaction) {
        const transactionData = await this.metaJadeNode.retrieve(transactionKey);
        if (transactionData) {
          transaction = JSON.parse(transactionData);
          this.dataCache.set(transactionKey, transaction);
        } else {
          return null;
        }
      }
      
      return transaction;
    } catch (error) {
      console.error('閫氳繃ID鑾峰彇浜ゆ槗澶辫触:', error.message);
      throw error;
    }
  }

  async getUserTransactions(userId) {
    try {
      // 娉ㄦ剰锛氬綋鍓嶅疄鐜颁腑锛岀巹鐜夊尯鍧楅摼DHT涓嶆敮鎸佽幏鍙栫敤鎴蜂氦鏄撹褰?      // 瀹為檯鐢熶骇鐜涓簲璇ョ淮鎶ょ敤鎴蜂氦鏄撶储寮?      return [];
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍澶辫触:', error.message);
      throw error;
    }
  }

  // 鏇存柊鐢ㄦ埛浣欓
  async updateUserCoins(userId, amount) {
    try {
      // 鑾峰彇鐜版湁鐢ㄦ埛
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('鐢ㄦ埛涓嶅瓨鍦?);
      }
      
      // 鏇存柊鐢ㄦ埛浣欓
      user.wallet.balance += amount;
      user.updatedAt = new Date().toISOString();
      
      // 瀛樺偍鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁鍒扮巹鐜夊尯鍧楅摼
      const userKey = this.getUserKey(userId);
      await this.metaJadeNode.store(userKey, JSON.stringify(user));
      this.dataCache.set(userKey, user);
      
      return user;
    } catch (error) {
      console.error('鏇存柊鐢ㄦ埛浣欓澶辫触:', error.message);
      throw error;
    }
  }
}

module.exports = MetaJadeConnector;
