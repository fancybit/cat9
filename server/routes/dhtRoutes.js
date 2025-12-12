const express = require('express');
const router = express.Router();
const dhtService = require('../services/dhtService');

// 鑾峰彇 DHT 鏈嶅姟鍣ㄧ姸鎬?router.get('/status', async (req, res) => {
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
        error: '蹇呴』鎻愪緵 key 鍜?value 鍙傛暟'
      });
    }

    const result = await dhtService.storeData(key, String(value));
    
    res.json({
      success: result,
      message: result ? '鏁版嵁瀛樺偍鎴愬姛' : '鏁版嵁瀛樺偍澶辫触'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 浠?DHT 妫€绱㈡暟鎹?router.get('/retrieve/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const data = await dhtService.retrieveData(key);
    
    if (data === null) {
      return res.status(404).json({
        success: false,
        error: `鏈壘鍒伴敭涓?${key} 鐨勬暟鎹甡
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

// 鏌ユ壘鎻愪緵鐗瑰畾閿殑鑺傜偣
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

// 鏌ユ壘鐗瑰畾 ID 鐨勮妭鐐?router.get('/peer/:peerId', async (req, res) => {
  try {
    const { peerId } = req.params;
    const peerInfo = await dhtService.findPeer(peerId);
    
    if (!peerInfo) {
      return res.status(404).json({
        success: false,
        error: `鏈壘鍒拌妭鐐?${peerId}`
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

// 鎻愪緵褰撳墠鑺傜偣浣滀负鎸囧畾閿殑鏁版嵁鎻愪緵鑰?router.post('/provide/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await dhtService.provide(key);
    
    res.json({
      success: result,
      message: result ? `鎴愬姛鎻愪緵閿?${key} 鐨勬暟鎹甡 : `鎻愪緵閿?${key} 鐨勬暟鎹け璐
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
