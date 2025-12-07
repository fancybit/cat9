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
      
      // 保存用户信息（兼容不同类型的用户对象）
      let updatedUser = user;
      if (typeof user.save === 'function') {
        updatedUser = await user.save();
      }

      // 生成JWT令牌
      const { generateToken } = require('../utils/jwt');
      const userId = user._id || user.id; // 兼容不同类型的用户ID
      const token = generateToken({ userId });

      // 转换用户信息为JSON格式（兼容不同类型的用户对象）
      const userJson = typeof user.toJSON === 'function' ? user.toJSON() : {
        ...user,
        // 移除敏感信息
        passwordHash: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      };

      return { 
        success: true, 
        user: userJson,
        token 
      };
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

  /**
   * 请求重置密码
   * @param {string} email - 用户邮箱
   * @returns {Promise<Object>} 重置密码请求结果
   */
  async requestPasswordReset(email) {
    try {
      // 查找用户
      const user = await dal.getUserByEmail(email);
      if (!user) {
        return { success: false, error: '该邮箱未注册' };
      }

      // 生成重置令牌（这里简单实现，实际应该更复杂）
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1小时后过期

      // 保存重置令牌到用户记录
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // 这里应该发送邮件给用户，包含重置链接
      // 由于是演示，我们只返回成功信息
      console.log(`密码重置请求：用户 ${user.username} (${user.email}) 生成的重置令牌：${resetToken}`);

      return { success: true, message: '密码重置链接已发送到您的邮箱' };
    } catch (error) {
      console.error('请求密码重置失败:', error);
      return { success: false, error: '请求密码重置失败，请稍后重试' };
    }
  }

  /**
   * 验证密码重置令牌
   * @param {string} token - 重置令牌
   * @returns {Promise<Object>} 验证结果
   */
  async verifyResetToken(token) {
    try {
      // 查找有有效重置令牌的用户
      const user = await dal.getUserByResetToken(token);
      if (!user) {
        return { success: false, error: '无效的重置令牌' };
      }

      // 检查令牌是否过期
      if (user.resetPasswordExpires < Date.now()) {
        return { success: false, error: '重置令牌已过期' };
      }

      return { success: true, userId: user._id };
    } catch (error) {
      console.error('验证重置令牌失败:', error);
      return { success: false, error: '验证重置令牌失败，请稍后重试' };
    }
  }

  /**
   * 重置密码
   * @param {string} userId - 用户ID
   * @param {string} token - 重置令牌
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} 重置密码结果
   */
  async resetPassword(userId, token, newPassword) {
    try {
      // 验证令牌
      const verifyResult = await this.verifyResetToken(token);
      if (!verifyResult.success || verifyResult.userId !== userId) {
        return { success: false, error: '无效的重置令牌' };
      }

      // 查找用户
      const user = await dal.getUser(userId);
      if (!user) {
        return { success: false, error: '用户不存在' };
      }

      // 加密新密码
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // 更新密码并清除重置令牌
      user.passwordHash = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return { success: true, message: '密码重置成功' };
    } catch (error) {
      console.error('重置密码失败:', error);
      return { success: false, error: '重置密码失败，请稍后重试' };
    }
  }

  /**
   * 上传用户头像
   * @param {string} userId - 用户ID
   * @param {Object} file - 上传的文件对象
   * @returns {Promise<Object>} 上传结果
   */
  async uploadAvatar(userId, file) {
    try {
      // 查找用户
      const user = await dal.getUser(userId);
      if (!user) {
        return { success: false, error: '用户不存在' };
      }

      // 生成一个简单的随机字符串作为头像标识
      const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // 模拟玄玉区块链存储
      const avatarKey = `avatar_${userId}`;
      await dal.storeData(avatarKey, {
        userId,
        avatarId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      });

      // 生成IPFS网关URL，使用云服务器的IPFS网关
      // 使用用户提供的云服务器IPFS网关域名
      const avatarUrl = `http://ipfs.metajade.online/ipfs/${avatarId}`;
      
      // 更新用户头像URL
      user.avatar = avatarUrl;
      
      // 保存用户信息到玄玉区块链
      await dal.updateUser(userId, { avatar: avatarUrl });

      return { success: true, avatarUrl };
    } catch (error) {
      console.error('头像上传失败:', error);
      return { success: false, error: '头像上传失败，请稍后重试' };
    }
  }
}

module.exports = new UserService();