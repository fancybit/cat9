// 鍟嗗搧鐩稿叧璺敱

const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

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

// 鍒涘缓鍟嗗搧 - 闇€瑕佺鐞嗗憳鏉冮檺
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await productService.createProduct(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鑾峰彇鎵€鏈夊晢鍝?router.get('/', async (req, res) => {
  const { category } = req.query;
  let products;
  
  if (category) {
    products = await productService.getProductsByCategory(category);
  } else {
    products = await productService.getAllProducts();
  }
  
  res.json({ success: true, products });
});

// 閫氳繃ID鑾峰彇鍟嗗搧璇︽儏
router.get('/:productId', async (req, res) => {
  const product = await productService.getProductInfo(req.params.productId);
  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404).json({ success: false, error: '鍟嗗搧涓嶅瓨鍦? });
  }
});

// 閫氳繃鍚嶇О鑾峰彇鍟嗗搧
router.get('/name/:name', async (req, res) => {
  const product = await productService.getProductByName(req.params.name);
  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404).json({ success: false, error: '鍟嗗搧涓嶅瓨鍦? });
  }
});

// 鏇存柊鍟嗗搧 - 闇€瑕佺鐞嗗憳鏉冮檺
router.put('/:productId', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await productService.updateProduct(req.params.productId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鏇存柊鍟嗗搧搴撳瓨 - 闇€瑕佺鐞嗗憳鏉冮檺
router.patch('/:productId/stock', authMiddleware, adminMiddleware, async (req, res) => {
  const { quantity } = req.body;
  const result = await productService.updateProductStock(req.params.productId, quantity);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 璐拱鍟嗗搧 - 闇€瑕佽璇?router.post('/:productId/purchase', authMiddleware, async (req, res) => {
  const result = await productService.purchaseProduct(req.userId, req.params.productId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勫晢鍝?- 闇€瑕佽璇?router.get('/user/my-products', authMiddleware, async (req, res) => {
  const products = await productService.getUserProducts(req.userId);
  res.json({ success: true, products });
});

module.exports = router;
