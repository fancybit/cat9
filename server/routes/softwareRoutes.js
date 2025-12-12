// 软件相关路由

const express = require('express');
const router = express.Router();
const softwareService = require('../services/softwareService');

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
  // 这里应该有实际的权限验证逻辑
  const isAdmin = req.headers['x-is-admin'] === 'true';
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: '需要管理员权限' });
  }
  next();
};

// 创建软件 - 需要管理员权限
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await softwareService.createSoftware(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取所有软件
router.get('/', async (req, res) => {
  const softwareList = await softwareService.getAllSoftware();
  res.json({ success: true, software: softwareList });
});

// 通过ID获取软件详情
router.get('/:softwareId', async (req, res) => {
  const software = await softwareService.getSoftwareInfo(req.params.softwareId);
  if (software) {
    res.json({ success: true, software });
  } else {
    res.status(404).json({ success: false, error: '软件不存在' });
  }
});

// 通过名称获取软件
router.get('/name/:name', async (req, res) => {
  const software = await softwareService.getSoftwareByName(req.params.name);
  if (software) {
    res.json({ success: true, software });
  } else {
    res.status(404).json({ success: false, error: '软件不存在' });
  }
});

// 更新软件 - 需要管理员权限
router.put('/:softwareId', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await softwareService.updateSoftware(req.params.softwareId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 设置软件为精选 - 需要管理员权限
router.patch('/:softwareId/featured', authMiddleware, adminMiddleware, async (req, res) => {
  const { featured } = req.body;
  const result = await softwareService.setSoftwareFeatured(req.params.softwareId, featured);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 购买软件 - 需要认证
router.post('/:softwareId/purchase', authMiddleware, async (req, res) => {
  const result = await softwareService.purchaseSoftware(req.userId, req.params.softwareId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取用户拥有的软件 - 需要认证
router.get('/user/my-software', authMiddleware, async (req, res) => {
  const softwareList = await softwareService.getUserSoftware(req.userId);
  res.json({ success: true, software: softwareList });
});

module.exports = router;