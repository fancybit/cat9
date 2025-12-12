// 交易相关路由

const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

// 模拟认证中间件
const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ success: false, error: '未认证' });
  }
  req.userId = userId;
  next();
};

// 模拟管理员权限中间件
const adminMiddleware = (req, res, next) => {
  const isAdmin = req.headers['x-is-admin'] === 'true';
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: '闇€瑕佺鐞嗗憳鏉冮檺' });
  }
  next();
};

// 获取用户钱包余额 - 需要认证
router.get('/balance', authMiddleware, async (req, res) => {
  const balance = await transactionService.getUserBalance(req.userId);
  if (balance !== null) {
    res.json({ success: true, balance });
  } else {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

// 获取用户交易记录 - 需要认证
router.get('/history', authMiddleware, async (req, res) => {
  const transactions = await transactionService.getUserTransactions(req.userId);
  res.json({ success: true, transactions });
});

// 转账给其他用户 - 需要认证
router.post('/transfer', authMiddleware, async (req, res) => {
  const { toUserId, amount, description } = req.body;
  
  // 防止自己给自己转账
  if (req.userId === toUserId) {
    return res.status(400).json({ success: false, error: '不能给自己转账' });
  }
  
  const result = await transactionService.transferCoins(req.userId, toUserId, amount, description);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 奖励用户Cat9Coins - 需要管理员权限
router.post('/reward', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId, amount, description } = req.body;
  const result = await transactionService.rewardCoins(userId, amount, description);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 通过ID获取交易详情 - 需要认证
router.get('/:transactionId', authMiddleware, async (req, res) => {
  const transaction = await transactionService.getTransactionDetails(req.params.transactionId);
  if (transaction) {
    // 检查是否是用户自己的交易或管理员
    const isAdmin = req.headers['x-is-admin'] === 'true';
    const isUserTransaction = transaction.fromUserId === req.userId || transaction.toUserId === req.userId;
    
    if (isAdmin || isUserTransaction) {
      res.json({ success: true, transaction });
    } else {
      res.status(403).json({ success: false, error: '无权查看此交易' });
    }
  } else {
    res.status(404).json({ success: false, error: '交易不存在' });
  }
});

// 批量获取交易详情 - 需要认证
router.post('/batch', authMiddleware, async (req, res) => {
  const { transactionIds } = req.body;
  if (!Array.isArray(transactionIds)) {
    return res.status(400).json({ success: false, error: '交易ID列表必须是数组' });
  }
  
  const transactions = await transactionService.getBatchTransactions(transactionIds);
  res.json({ success: true, transactions });
});

module.exports = router;
