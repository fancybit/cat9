// 浜ゆ槗鐩稿叧璺敱

const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

// 妯℃嫙璁よ瘉涓棿浠?const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ success: false, error: '鏈璇? });
  }
  req.userId = userId;
  next();
};

// 妯℃嫙绠＄悊鍛樻潈闄愪腑闂翠欢
const adminMiddleware = (req, res, next) => {
  const isAdmin = req.headers['x-is-admin'] === 'true';
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: '闇€瑕佺鐞嗗憳鏉冮檺' });
  }
  next();
};

// 鑾峰彇鐢ㄦ埛閽卞寘浣欓 - 闇€瑕佽璇?router.get('/balance', authMiddleware, async (req, res) => {
  const balance = await transactionService.getUserBalance(req.userId);
  if (balance !== null) {
    res.json({ success: true, balance });
  } else {
    res.status(404).json({ success: false, error: '鐢ㄦ埛涓嶅瓨鍦? });
  }
});

// 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍 - 闇€瑕佽璇?router.get('/history', authMiddleware, async (req, res) => {
  const transactions = await transactionService.getUserTransactions(req.userId);
  res.json({ success: true, transactions });
});

// 杞处缁欏叾浠栫敤鎴?- 闇€瑕佽璇?router.post('/transfer', authMiddleware, async (req, res) => {
  const { toUserId, amount, description } = req.body;
  
  // 闃叉鑷繁缁欒嚜宸辫浆璐?  if (req.userId === toUserId) {
    return res.status(400).json({ success: false, error: '涓嶈兘缁欒嚜宸辫浆璐? });
  }
  
  const result = await transactionService.transferCoins(req.userId, toUserId, amount, description);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 濂栧姳鐢ㄦ埛Cat9Coins - 闇€瑕佺鐞嗗憳鏉冮檺
router.post('/reward', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId, amount, description } = req.body;
  const result = await transactionService.rewardCoins(userId, amount, description);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 閫氳繃ID鑾峰彇浜ゆ槗璇︽儏 - 闇€瑕佽璇?router.get('/:transactionId', authMiddleware, async (req, res) => {
  const transaction = await transactionService.getTransactionDetails(req.params.transactionId);
  if (transaction) {
    // 妫€鏌ユ槸鍚︽槸鐢ㄦ埛鑷繁鐨勪氦鏄撴垨绠＄悊鍛?    const isAdmin = req.headers['x-is-admin'] === 'true';
    const isUserTransaction = transaction.fromUserId === req.userId || transaction.toUserId === req.userId;
    
    if (isAdmin || isUserTransaction) {
      res.json({ success: true, transaction });
    } else {
      res.status(403).json({ success: false, error: '鏃犳潈鏌ョ湅姝や氦鏄? });
    }
  } else {
    res.status(404).json({ success: false, error: '浜ゆ槗涓嶅瓨鍦? });
  }
});

// 鎵归噺鑾峰彇浜ゆ槗璇︽儏 - 闇€瑕佽璇?router.post('/batch', authMiddleware, async (req, res) => {
  const { transactionIds } = req.body;
  if (!Array.isArray(transactionIds)) {
    return res.status(400).json({ success: false, error: '浜ゆ槗ID鍒楄〃蹇呴』鏄暟缁? });
  }
  
  const transactions = await transactionService.getBatchTransactions(transactionIds);
  res.json({ success: true, transactions });
});

module.exports = router;
