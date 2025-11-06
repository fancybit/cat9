const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db');

// 加载环境变量
dotenv.config();

// 导入DAL实例
const dal = require('./dal');

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
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV}`);
  console.log('玄玉逍游后端服务已启动');
});

// 优雅关闭处理
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  try {
    // 断开数据库连接
    await disconnectDB();
  } catch (error) {
    console.error('关闭数据库连接时出错:', error);
  }
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});