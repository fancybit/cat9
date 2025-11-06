// 用户相关路由

const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// 模拟认证中间件
const authMiddleware = (req, res, next) => {
  // 这里应该有实际的JWT认证逻辑
  // 目前仅作为示例，假设用户已认证
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ success: false, error: '未认证' });
  }
  req.userId = userId;
  next();
};

// 用户注册
router.post('/register', async (req, res) => {
  const result = await userService.register(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await userService.login(username, password);
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
});

// 获取用户信息 - 需要认证
router.get('/me', authMiddleware, async (req, res) => {
  const user = await userService.getUserInfo(req.userId);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

// 更新用户信息 - 需要认证
router.put('/me', authMiddleware, async (req, res) => {
  const result = await userService.updateUserInfo(req.userId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取用户钱包信息 - 需要认证
router.get('/me/wallet', authMiddleware, async (req, res) => {
  const wallet = await userService.getUserWallet(req.userId);
  if (wallet) {
    res.json({ success: true, wallet });
  } else {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

// 获取用户交易记录 - 需要认证
router.get('/me/transactions', authMiddleware, async (req, res) => {
  const transactions = await userService.getUserTransactions(req.userId);
  res.json({ success: true, transactions });
});

// 通过ID获取用户信息
router.get('/:userId', async (req, res) => {
  const user = await userService.getUserInfo(req.params.userId);
  if (user) {
    // 移除敏感信息
    const { passwordHash, email, ...publicInfo } = user;
    res.json({ success: true, user: publicInfo });
  } else {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

module.exports = router;