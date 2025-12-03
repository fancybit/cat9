// JWT工具 - 用于生成和验证JWT令牌

const jwt = require('jsonwebtoken');

// 从环境变量获取JWT密钥，默认使用一个随机字符串
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 生成JWT令牌
 * @param {Object} payload - 要包含在令牌中的数据
 * @returns {string} JWT令牌
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * 验证JWT令牌
 * @param {string} token - 要验证的JWT令牌
 * @returns {Object|null} 解析后的令牌数据，验证失败则返回null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT验证失败:', error.message);
    return null;
  }
};

/**
 * 从请求头获取JWT令牌
 * @param {Object} req - Express请求对象
 * @returns {string|null} 提取的JWT令牌，不存在则返回null
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromHeader
};
