const multer = require('multer');

// 閰嶇疆鏂囦欢瀛樺偍
const storage = multer.memoryStorage();

// 鏂囦欢杩囨护鍣紝鍙厑璁镐笂浼犲浘鐗?const fileFilter = (req, file, cb) => {
  // 妫€鏌ユ枃浠剁被鍨?  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('鍙厑璁镐笂浼犲浘鐗囨枃浠?), false);
  }
};

// 鍒涘缓multer瀹炰緥
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
