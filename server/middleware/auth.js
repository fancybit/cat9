// 璁よ瘉涓棿浠?- 鐢ㄤ簬楠岃瘉JWT浠ょ墝

const { verifyToken, getTokenFromHeader } = require('../utils/jwt');
const userService = require('../services/userService');

/**
 * JWT璁よ瘉涓棿浠? * @param {Object} req - Express璇锋眰瀵硅薄
 * @param {Object} res - Express鍝嶅簲瀵硅薄
 * @param {Function} next - Express涓嬩竴涓腑闂翠欢鍑芥暟
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 浠庤姹傚ご鑾峰彇token
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ success: false, error: '鏈彁渚涜璇佷护鐗? });
    }
    
    // 楠岃瘉token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, error: '鏃犳晥鐨勮璇佷护鐗? });
    }
    
    // 鑾峰彇鐢ㄦ埛淇℃伅
    const user = await userService.getUserInfo(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, error: '鐢ㄦ埛涓嶅瓨鍦? });
    }
    
    // 灏嗙敤鎴蜂俊鎭坊鍔犲埌璇锋眰瀵硅薄涓?    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.error('璁よ瘉涓棿浠堕敊璇?', error);
    res.status(500).json({ success: false, error: '鏈嶅姟鍣ㄨ璇侀敊璇? });
  }
};

/**
 * 绠＄悊鍛樻潈闄愰獙璇佷腑闂翠欢
 * @param {Object} req - Express璇锋眰瀵硅薄
 * @param {Object} res - Express鍝嶅簲瀵硅薄
 * @param {Function} next - Express涓嬩竴涓腑闂翠欢鍑芥暟
 */
const adminMiddleware = (req, res, next) => {
  try {
    // 妫€鏌ョ敤鎴锋槸鍚︽湁绠＄悊鍛樿鑹?    if (req.user && req.user.roles && req.user.roles.includes('admin')) {
      next();
    } else {
      res.status(403).json({ success: false, error: '闇€瑕佺鐞嗗憳鏉冮檺' });
    }
  } catch (error) {
    console.error('绠＄悊鍛樹腑闂翠欢閿欒:', error);
    res.status(500).json({ success: false, error: '鏈嶅姟鍣ㄩ敊璇? });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
