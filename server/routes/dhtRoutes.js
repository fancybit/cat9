const express = require('express');
const router = express.Router();
const dhtService = require('../services/dhtService');

// 获取 DHT 服务器状态
router.get('/status', async (req, res) => {
  try {
    const status = dhtService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 瀛樺偍鏁版嵁鍒?DHT
router.post('/store', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: '必须提供 key 和 value 参数'
      });
    }

    const result = await dhtService.storeData(key, String(value));
    
    res.json({
      success: result,
      message: result ? '数据存储成功' : '数据存储失败'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 从 DHT 查询数据
router.get('/retrieve/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const data = await dhtService.retrieveData(key);
    
    if (data === null) {
      return res.status(404).json({
        success: false,
        error: `未找到键为 ${key} 的数据`
      });
    }

    res.json({
      success: true,
      data: {
        key,
        value: data
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 查找提供特定键的数据的节点
router.get('/providers/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const providers = await dhtService.findProviders(key);
    
    res.json({
      success: true,
      data: {
        key,
        providers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 查找特定 ID 的节点
router.get('/peer/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;
    const peerInfo = await dhtService.findPeer(peerId);
    
    if (!peerInfo) {
      return res.status(404).json({
        success: false,
        error: `未找到节点 ${peerId}`
      });
    }

    res.json({
      success: true,
      data: peerInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提供当前节点作为指定键的数据提供者
router.post('/provide/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await dhtService.provide(key);
    
    res.json({
      success: result,
      message: result ? `成功提供键 ${key} 的数据` : `提供键 ${key} 的数据失败`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
