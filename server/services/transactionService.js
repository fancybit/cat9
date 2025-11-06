// 交易服务 - 处理Cat9Coin交易和钱包管理相关的业务逻辑

const dal = require('../dal');

class TransactionService {
  /**
   * 创建交易
   * @param {Object} transactionData - 交易数据
   * @returns {Promise<Object>} 创建结果
   */
  async createTransaction(transactionData) {
    try {
      const transaction = await dal.createTransaction(transactionData);
      return { success: true, transaction: transaction.toJSON() };
    } catch (error) {
      console.error('创建交易失败:', error);
      return { success: false, error: '创建交易失败，请稍后重试' };
    }
  }

  /**
   * 执行交易
   * @param {string} transactionId - 交易ID
   * @returns {Promise<Object>} 执行结果
   */
  async executeTransaction(transactionId) {
    try {
      const success = await dal.executeTransaction(transactionId);
      if (success) {
        const transaction = await dal.catDB.getTransaction(transactionId);
        return { success: true, transaction: transaction.toJSON() };
      }
      return { success: false, error: '交易执行失败' };
    } catch (error) {
      console.error('执行交易失败:', error);
      return { success: false, error: '交易执行失败，请稍后重试' };
    }
  }

  /**
   * 获取交易详情
   * @param {string} transactionId - 交易ID
   * @returns {Promise<Object|null>} 交易详情
   */
  async getTransactionDetails(transactionId) {
    try {
      const transaction = await dal.catDB.getTransaction(transactionId);
      return transaction ? transaction.toJSON() : null;
    } catch (error) {
      console.error('获取交易详情失败:', error);
      return null;
    }
  }

  /**
   * 获取用户交易记录
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 交易记录列表
   */
  async getUserTransactions(userId) {
    try {
      const transactions = await dal.catDB.getUserTransactions(userId);
      return transactions.map(transaction => transaction.toJSON());
    } catch (error) {
      console.error('获取用户交易记录失败:', error);
      return [];
    }
  }

  /**
   * 转账Cat9Coins
   * @param {string} fromUserId - 转出用户ID
   * @param {string} toUserId - 转入用户ID
   * @param {number} amount - 金额
   * @param {string} description - 描述
   * @returns {Promise<Object>} 转账结果
   */
  async transferCoins(fromUserId, toUserId, amount, description = '') {
    try {
      const result = await dal.catDB.transferCoins(fromUserId, toUserId, amount, description);
      return result;
    } catch (error) {
      console.error('转账失败:', error);
      return { success: false, error: '转账失败，请稍后重试' };
    }
  }

  /**
   * 奖励用户Cat9Coins
   * @param {string} userId - 用户ID
   * @param {number} amount - 金额
   * @param {string} description - 描述
   * @returns {Promise<Object>} 奖励结果
   */
  async rewardCoins(userId, amount, description = '') {
    try {
      const result = await dal.catDB.rewardCoins(userId, amount, description);
      return result;
    } catch (error) {
      console.error('奖励失败:', error);
      return { success: false, error: '奖励失败，请稍后重试' };
    }
  }

  /**
   * 获取用户钱包余额
   * @param {string} userId - 用户ID
   * @returns {Promise<number|null>} 余额
   */
  async getUserBalance(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.wallet.balance : null;
    } catch (error) {
      console.error('获取用户余额失败:', error);
      return null;
    }
  }

  /**
   * 批量获取交易详情
   * @param {Array<string>} transactionIds - 交易ID列表
   * @returns {Promise<Array>} 交易详情列表
   */
  async getBatchTransactions(transactionIds) {
    try {
      const transactions = [];
      for (const id of transactionIds) {
        const transaction = await dal.catDB.getTransaction(id);
        if (transaction) {
          transactions.push(transaction.toJSON());
        }
      }
      return transactions;
    } catch (error) {
      console.error('批量获取交易详情失败:', error);
      return [];
    }
  }
}

module.exports = new TransactionService();