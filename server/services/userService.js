// 用户服务 - 处理用户相关的业务逻辑

const dal = require('../dal');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @returns {Promise<Object>} 注册结果
   */
  async register(userData) {
    try {
      // 检查用户名是否已存在
      const existingUser = await dal.getUserByUsername(userData.username);
      if (existingUser) {
        return { success: false, error: '用户名已存在' };
      }

      // 检查邮箱是否已存在
      const existingEmail = await dal.getUserByEmail(userData.email);
      if (existingEmail) {
        return { success: false, error: '邮箱已被注册' };
      }

      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      // 创建用户
      const user = await dal.createUser({
        username: userData.username,
        email: userData.email,
        passwordHash,
        displayName: userData.displayName,
        avatar: userData.avatar
      });

      return { success: true, user: user.toJSON() };
    } catch (error) {
      console.error('用户注册失败:', error);
      return { success: false, error: '注册失败，请稍后重试' };
    }
  }

  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  async login(username, password) {
    try {
      // 查找用户
      const user = await dal.getUserByUsername(username);
      if (!user) {
        return { success: false, error: '用户名或密码错误' };
      }

      // 验证密码
      const isMatch = await user.verifyPassword(bcrypt.compare, password);
      if (!isMatch) {
        return { success: false, error: '用户名或密码错误' };
      }

      // 更新最后登录时间
      user.lastLogin = new Date();

      return { success: true, user: user.toJSON() };
    } catch (error) {
      console.error('用户登录失败:', error);
      return { success: false, error: '登录失败，请稍后重试' };
    }
  }

  /**
   * 获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 用户信息
   */
  async getUserInfo(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateUserInfo(userId, updateData) {
    try {
      // 如果更新密码，需要加密
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
      }

      const user = await dal.updateUser(userId, updateData);
      return user ? { success: true, user: user.toJSON() } : { success: false, error: '用户不存在' };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, error: '更新失败，请稍后重试' };
    }
  }

  /**
   * 获取用户钱包信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 钱包信息
   */
  async getUserWallet(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.wallet : null;
    } catch (error) {
      console.error('获取用户钱包信息失败:', error);
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
      return transactions.map(tx => tx.toJSON());
    } catch (error) {
      console.error('获取用户交易记录失败:', error);
      return [];
    }
  }
}

module.exports = new UserService();