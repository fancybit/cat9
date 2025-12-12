// 杞欢鐩稿叧璺敱

const express = require('express');
const router = express.Router();
const softwareService = require('../services/softwareService');

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
  // 杩欓噷搴旇鏈夊疄闄呯殑鏉冮檺妫€鏌ラ€昏緫
  const isAdmin = req.headers['x-is-admin'] === 'true';
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: '闇€瑕佺鐞嗗憳鏉冮檺' });
  }
  next();
};

// 鍒涘缓杞欢 - 闇€瑕佺鐞嗗憳鏉冮檺
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await softwareService.createSoftware(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鑾峰彇鎵€鏈夎蒋浠?router.get('/', async (req, res) => {
  const softwareList = await softwareService.getAllSoftware();
  res.json({ success: true, software: softwareList });
});

// 閫氳繃ID鑾峰彇杞欢璇︽儏
router.get('/:softwareId', async (req, res) => {
  const software = await softwareService.getSoftwareInfo(req.params.softwareId);
  if (software) {
    res.json({ success: true, software });
  } else {
    res.status(404).json({ success: false, error: '杞欢涓嶅瓨鍦? });
  }
});

// 閫氳繃鍚嶇О鑾峰彇杞欢
router.get('/name/:name', async (req, res) => {
  const software = await softwareService.getSoftwareByName(req.params.name);
  if (software) {
    res.json({ success: true, software });
  } else {
    res.status(404).json({ success: false, error: '杞欢涓嶅瓨鍦? });
  }
});

// 鏇存柊杞欢 - 闇€瑕佺鐞嗗憳鏉冮檺
router.put('/:softwareId', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await softwareService.updateSoftware(req.params.softwareId, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 璁剧疆杞欢涓虹簿閫?- 闇€瑕佺鐞嗗憳鏉冮檺
router.patch('/:softwareId/featured', authMiddleware, adminMiddleware, async (req, res) => {
  const { featured } = req.body;
  const result = await softwareService.setSoftwareFeatured(req.params.softwareId, featured);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 璐拱杞欢 - 闇€瑕佽璇?router.post('/:softwareId/purchase', authMiddleware, async (req, res) => {
  const result = await softwareService.purchaseSoftware(req.userId, req.params.softwareId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勮蒋浠?- 闇€瑕佽璇?router.get('/user/my-software', authMiddleware, async (req, res) => {
  const softwareList = await softwareService.getUserSoftware(req.userId);
  res.json({ success: true, software: softwareList });
});

module.exports = router;
