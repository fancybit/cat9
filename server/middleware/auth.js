// 认证中间件 - 用于验证JWT令牌

const { verifyToken, getTokenFromHeader } = require('../utils/jwt');
const userService = require('../services/userService');

/**
 * JWT认证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ success: false, error: '未提供认证令牌' });
    }
    
    // 验证token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, error: '无效的认证令牌' });
    }
    
    // 获取用户信息
    const user = await userService.getUserInfo(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, error: '用户不存在' });
    }
    
    // 将用户信息添加到请求对象中
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ success: false, error: '服务器认证错误' });
  }
};

/**
 * 管理员权限验证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const adminMiddleware = (req, res, next) => {
  try {
    // 检查用户是否有管理员角色
    if (req.user && req.user.roles && req.user.roles.includes('admin')) {
      next();
    } else {
      res.status(403).json({ success: false, error: '需要管理员权限' });
    }
  } catch (error) {
    console.error('管理员中间件错误:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
