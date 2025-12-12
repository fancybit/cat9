// JWT宸ュ叿 - 鐢ㄤ簬鐢熸垚鍜岄獙璇丣WT浠ょ墝

const jwt = require('jsonwebtoken');

// 浠庣幆澧冨彉閲忚幏鍙朖WT瀵嗛挜锛岄粯璁や娇鐢ㄤ竴涓殢鏈哄瓧绗︿覆
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 鐢熸垚JWT浠ょ墝
 * @param {Object} payload - 瑕佸寘鍚湪浠ょ墝涓殑鏁版嵁
 * @returns {string} JWT浠ょ墝
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * 楠岃瘉JWT浠ょ墝
 * @param {string} token - 瑕侀獙璇佺殑JWT浠ょ墝
 * @returns {Object|null} 瑙ｆ瀽鍚庣殑浠ょ墝鏁版嵁锛岄獙璇佸け璐ュ垯杩斿洖null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT楠岃瘉澶辫触:', error.message);
    return null;
  }
};

/**
 * 浠庤姹傚ご鑾峰彇JWT浠ょ墝
 * @param {Object} req - Express璇锋眰瀵硅薄
 * @returns {string|null} 鎻愬彇鐨凧WT浠ょ墝锛屼笉瀛樺湪鍒欒繑鍥瀗ull
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
