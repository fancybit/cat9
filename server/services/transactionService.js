// 浜ゆ槗鏈嶅姟 - 澶勭悊Cat9Coin浜ゆ槗鍜岄挶鍖呯鐞嗙浉鍏崇殑涓氬姟閫昏緫

const dal = require('../dal');

class TransactionService {
  /**
   * 鍒涘缓浜ゆ槗
   * @param {Object} transactionData - 浜ゆ槗鏁版嵁
   * @returns {Promise<Object>} 鍒涘缓缁撴灉
   */
  async createTransaction(transactionData) {
    try {
      const transaction = await dal.createTransaction(transactionData);
      return { success: true, transaction: transaction.toJSON() };
    } catch (error) {
      console.error('鍒涘缓浜ゆ槗澶辫触:', error);
      return { success: false, error: '鍒涘缓浜ゆ槗澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鎵ц浜ゆ槗
   * @param {string} transactionId - 浜ゆ槗ID
   * @returns {Promise<Object>} 鎵ц缁撴灉
   */
  async executeTransaction(transactionId) {
    try {
      const success = await dal.executeTransaction(transactionId);
      if (success) {
        const transaction = await dal.getTransaction(transactionId);
        return { success: true, transaction: transaction.toJSON() };
      }
      return { success: false, error: '浜ゆ槗鎵ц澶辫触' };
    } catch (error) {
      console.error('鎵ц浜ゆ槗澶辫触:', error);
      return { success: false, error: '浜ゆ槗鎵ц澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇浜ゆ槗璇︽儏
   * @param {string} transactionId - 浜ゆ槗ID
   * @returns {Promise<Object|null>} 浜ゆ槗璇︽儏
   */
  async getTransactionDetails(transactionId) {
    try {
      const transaction = await dal.getTransaction(transactionId);
      return transaction ? transaction.toJSON() : null;
    } catch (error) {
      console.error('鑾峰彇浜ゆ槗璇︽儏澶辫触:', error);
      return null;
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 浜ゆ槗璁板綍鍒楄〃
   */
  async getUserTransactions(userId) {
    try {
      const transactions = await dal.getUserTransactions(userId);
      return transactions.map(transaction => transaction.toJSON());
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍澶辫触:', error);
      return [];
    }
  }

  /**
   * 杞处Cat9Coins
   * @param {string} fromUserId - 杞嚭鐢ㄦ埛ID
   * @param {string} toUserId - 杞叆鐢ㄦ埛ID
   * @param {number} amount - 閲戦
   * @param {string} description - 鎻忚堪
   * @returns {Promise<Object>} 杞处缁撴灉
   */
  async transferCoins(fromUserId, toUserId, amount, description = '') {
    try {
      // 鐩存帴瀹炵幇杞处閫昏緫
      // 鑾峰彇杞嚭鐢ㄦ埛
      const fromUser = await dal.getUser(fromUserId);
      const toUser = await dal.getUser(toUserId);
      
      if (!fromUser || !toUser) {
        return { success: false, error: '鐢ㄦ埛涓嶅瓨鍦? };
      }
      
      if (fromUser.wallet.balance < amount) {
        return { success: false, error: '浣欓涓嶈冻' };
      }
      
      // 鏇存柊鐢ㄦ埛浣欓
      fromUser.wallet.balance -= amount;
      toUser.wallet.balance += amount;
      
      // 淇濆瓨鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁
      await dal.storeData(dal.getUserKey(fromUserId), fromUser);
      await dal.storeData(dal.getUserKey(toUserId), toUser);
      
      // 鍒涘缓浜ゆ槗璁板綍
      const transaction = await dal.createTransaction({
        fromUserId,
        toUserId,
        amount,
        type: 'transfer',
        description,
        status: 'completed'
      });
      
      return { success: true, transaction };
    } catch (error) {
      console.error('杞处澶辫触:', error);
      return { success: false, error: '杞处澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 濂栧姳鐢ㄦ埛Cat9Coins
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {number} amount - 閲戦
   * @param {string} description - 鎻忚堪
   * @returns {Promise<Object>} 濂栧姳缁撴灉
   */
  async rewardCoins(userId, amount, description = '') {
    try {
      // 鐩存帴瀹炵幇濂栧姳閫昏緫
      // 鑾峰彇鐢ㄦ埛
      const user = await dal.getUser(userId);
      if (!user) {
        return { success: false, error: '鐢ㄦ埛涓嶅瓨鍦? };
      }
      
      // 鏇存柊鐢ㄦ埛浣欓
      user.wallet.balance += amount;
      
      // 淇濆瓨鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁
      await dal.storeData(dal.getUserKey(userId), user);
      
      // 鍒涘缓浜ゆ槗璁板綍
      const transaction = await dal.createTransaction({
        toUserId: userId,
        amount,
        type: 'reward',
        description,
        status: 'completed'
      });
      
      return { success: true, transaction };
    } catch (error) {
      console.error('濂栧姳澶辫触:', error);
      return { success: false, error: '濂栧姳澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛閽卞寘浣欓
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<number|null>} 浣欓
   */
  async getUserBalance(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.wallet.balance : null;
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛浣欓澶辫触:', error);
      return null;
    }
  }

  /**
   * 鎵归噺鑾峰彇浜ゆ槗璇︽儏
   * @param {Array<string>} transactionIds - 浜ゆ槗ID鍒楄〃
   * @returns {Promise<Array>} 浜ゆ槗璇︽儏鍒楄〃
   */
  async getBatchTransactions(transactionIds) {
    try {
      const transactions = [];
      for (const id of transactionIds) {
        const transaction = await dal.getTransaction(id);
        if (transaction) {
          transactions.push(transaction.toJSON());
        }
      }
      return transactions;
    } catch (error) {
      console.error('鎵归噺鑾峰彇浜ゆ槗璇︽儏澶辫触:', error);
      return [];
    }
  }
}

module.exports = new TransactionService();
