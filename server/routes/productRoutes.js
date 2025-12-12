// 产品相关路由

const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

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
    return res.status(403).json({ success: false, error: '需要管理员权限' });
  }
  next();
};

// 创建产品 - 需要管理员权限
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await productService.createProduct(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取所有产品
router.get('/', async (req, res) => {
  const { category } = req.query;
  let products;
  
  if (category) {
    products = await productService.getProductsByCategory(category);
  } else {
    products = await productService.getAllProducts();
  }
  
  res.json({ success: true, products });
});

// 通过ID获取产品详情
router.get('/:productId', async (req, res) => {
  const product = await productService.getProductInfo(req.params.productId);
  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404).json({ success: false, error: '产品不存在' });
  }
});

// 通过名称获取产品
router.get('/name/:name', async (req, res) => {
  const product = await productService.getProductByName(req.params.name);
  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404).json({ success: false, error: '产品不存在' });
  }
});

// 更新产品 - 需要管理员权限
router.put('/:productId', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await productService.updateProduct(req.params.productId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 更新产品库存 - 需要管理员权限
router.patch('/:productId/stock', authMiddleware, adminMiddleware, async (req, res) => {
  const { quantity } = req.body;
  const result = await productService.updateProductStock(req.params.productId, quantity);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 购买产品 - 需要认证
router.post('/:productId/purchase', authMiddleware, async (req, res) => {
  const result = await productService.purchaseProduct(req.userId, req.params.productId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 获取用户拥有的产品 - 需要认证
router.get('/user/my-products', authMiddleware, async (req, res) => {
  const products = await productService.getUserProducts(req.userId);
  res.json({ success: true, products });
});

module.exports = router;