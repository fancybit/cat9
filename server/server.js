const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db');
// 暂时注释掉dhtService，避免ES模块错误
// const dhtService = require('./services/dhtService');

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
// 暂时注释掉DHT路由，避免ES模块错误
// app.use('/api/dht', require('./routes/dhtRoutes'));

// 基本路由
app.get('/', (req, res) => {
  res.send('玄玉逍游后端服务运行中');
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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV}`);
  
  // 暂时注释掉 DHT 服务初始化，避免模块加载错误
  /*
  // 初始化 DHT 服务
  try {
    const dhtPort = process.env.DHT_PORT || 4001;
    await dhtService.initialize({
      port: dhtPort,
      enableRelay: process.env.ENABLE_DHT_RELAY !== 'false'
    });
  } catch (error) {
    console.error('初始化 DHT 服务失败，但继续运行其他服务:', error);
  }
  */
  
  console.log('玄玉逍游后端服务已启动');
});

// 优雅关闭处理
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  try {
    // 断开数据库连接
    await disconnectDB();
    
    // 暂时注释掉DHT服务关闭，避免ES模块错误
    /*
    // 关闭 DHT 服务
    await dhtService.shutdown();
    */
  } catch (error) {
    console.error('关闭服务时出错:', error);
  }
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});