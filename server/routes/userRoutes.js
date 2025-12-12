// 鐢ㄦ埛鐩稿叧璺敱

const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 鐢ㄦ埛娉ㄥ唽
router.post('/register', async (req, res) => {
  const result = await userService.register(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鐢ㄦ埛鐧诲綍
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await userService.login(username, password);
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
});

// 鑾峰彇鐢ㄦ埛淇℃伅 - 闇€瑕佽璇?router.get('/me', authMiddleware, async (req, res) => {
  const user = await userService.getUserInfo(req.userId);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, error: '鐢ㄦ埛涓嶅瓨鍦? });
  }
});

// 鏇存柊鐢ㄦ埛淇℃伅 - 闇€瑕佽璇?router.put('/me', authMiddleware, async (req, res) => {
  const result = await userService.updateUserInfo(req.userId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅 - 闇€瑕佽璇?router.get('/me/wallet', authMiddleware, async (req, res) => {
  const wallet = await userService.getUserWallet(req.userId);
  if (wallet) {
    res.json({ success: true, wallet });
  } else {
    res.status(404).json({ success: false, error: '鐢ㄦ埛涓嶅瓨鍦? });
  }
});

// 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍 - 闇€瑕佽璇?router.get('/me/transactions', authMiddleware, async (req, res) => {
  const transactions = await userService.getUserTransactions(req.userId);
  res.json({ success: true, transactions });
});

// 閫氳繃ID鑾峰彇鐢ㄦ埛淇℃伅
router.get('/:userId', async (req, res) => {
  const user = await userService.getUserInfo(req.params.userId);
  if (user) {
    // 绉婚櫎鏁忔劅淇℃伅
    const { passwordHash, email, ...publicInfo } = user;
    res.json({ success: true, user: publicInfo });
  } else {
    res.status(404).json({ success: false, error: '鐢ㄦ埛涓嶅瓨鍦? });
  }
});

// 璇锋眰瀵嗙爜閲嶇疆
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const result = await userService.requestPasswordReset(email);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 楠岃瘉瀵嗙爜閲嶇疆浠ょ墝
router.get('/reset-password/:token', async (req, res) => {
  const token = req.params.token;
  const result = await userService.verifyResetToken(token);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 閲嶇疆瀵嗙爜
router.post('/reset-password/:userId/:token', async (req, res) => {
  const { userId, token } = req.params;
  const { newPassword } = req.body;
  const result = await userService.resetPassword(userId, token, newPassword);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 澶村儚涓婁紶鏀寔涓ょ鏂瑰紡锛歮ultipart/form-data鏂囦欢涓婁紶鍜孞SON鏁版嵁涓婁紶
const upload = require('../middleware/upload');

// 涓棿浠讹紝鐢ㄤ簬妫€娴嬭姹傜被鍨嬪苟鍐冲畾鏄惁浣跨敤multer
function dynamicUploadMiddleware(req, res, next) {
  // 妫€鏌ontent-Type澶?  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    // 浼犵粺鏂囦欢涓婁紶锛屼娇鐢╩ulter
    return upload.single('avatar')(req, res, next);
  }
  // JSON鏁版嵁涓婁紶锛岀洿鎺ラ€氳繃
  next();
}

router.post('/avatar', authMiddleware, dynamicUploadMiddleware, async (req, res) => {
  try {
    let result;
    if (req.file) {
      // 浼犵粺鏂囦欢涓婁紶鏂瑰紡
      result = await userService.uploadAvatar(req.userId, req.file);
    } else {
      // JSON鏁版嵁涓婁紶鏂瑰紡
      result = await userService.uploadAvatar(req.userId, null, req.body.avatarData);
    }
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('澶村儚涓婁紶閿欒:', error);
    res.status(500).json({ success: false, error: '鏈嶅姟鍣ㄩ敊璇紝璇风◢鍚庨噸璇? });
  }
});

module.exports = router;
