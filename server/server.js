const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db');
// 导入服务器配置
const serverConfig = require('./config/server');
// 导入DHT服务
const dhtService = require('./services/dhtService');

// 加载环境变量
dotenv.config();

// 导入DAL实例
//const dal = require('./dal');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件配置
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/software', require('./routes/softwareRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
// 启用DHT路由
app.use('/api/dht', require('./routes/dhtRoutes'));

// 基本路由
app.get('/', (req, res) => {
  res.send('玄玉引擎后端服务运行中');
});

// 404 路由处理
app.use((req, res, next) => {
  const error = new Error('请求的路由不存在');
  error.status = 404;
  next(error);
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    error: error.message || '服务器错误',
  });
  next(error);
});

// 启动服务器
const PORT = serverConfig.port || 5000;
const server = app.listen(PORT, serverConfig.host || '0.0.0.0', async () => {
  console.log(`服务器运行在 http://${serverConfig.host || '0.0.0.0'}:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV}`);
  
  // 初始化 DHT 服务（如果配置为自动启动）
  if (serverConfig.dht.autoStart) {
    try {
      await dhtService.initialize({
        port: serverConfig.dht.port,
        ip: serverConfig.dht.ip,
        enableRelay: serverConfig.dht.enableRelay
      });
      console.log(`DHT 服务已成功初始化，使用端口 ${serverConfig.dht.port}`);
    } catch (error) {
      console.error('初始化 DHT 服务失败，但继续运行其他服务:', error);
    }
  }
  
  console.log('玄玉引擎后端服务已启动');
});

// 优雅关闭处理
process.on('SIGINT', async () => {
  console.log('正在关闭服务器..');
  try {
    // 断开数据库连接
    await disconnectDB();
    
    // 关闭 DHT 服务
    await dhtService.shutdown();
  } catch (error) {
    console.error('关闭服务时出错', error);
  }
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
