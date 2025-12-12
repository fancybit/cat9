const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db');
// 瀵煎叆鏈嶅姟绔厤缃?const serverConfig = require('./config/server');
// 瀵煎叆DHT鏈嶅姟
const dhtService = require('./services/dhtService');

// 鍔犺浇鐜鍙橀噺
dotenv.config();

// 瀵煎叆DAL瀹炰緥
//const dal = require('./dal');

// 鍒涘缓Express搴旂敤
const app = express();

// 杩炴帴鏁版嵁搴?connectDB();

// 涓棿浠堕厤缃?app.use(cors());
app.use(express.json());

// 璺敱閰嶇疆
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/software', require('./routes/softwareRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
// 鍚敤DHT璺敱
app.use('/api/dht', require('./routes/dhtRoutes'));

// 鍩烘湰璺敱
app.get('/', (req, res) => {
  res.send('鐜勭帀閫嶆父鍚庣鏈嶅姟杩愯涓?);
});

// 404 璺敱澶勭悊
app.use((req, res, next) => {
  const error = new Error('璇锋眰鐨勮矾鐢变笉瀛樺湪');
  error.status = 404;
  next(error);
});

// 閿欒澶勭悊涓棿浠?app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    error: error.message || '鏈嶅姟鍣ㄩ敊璇?,
  });
  next(error);
});

// 鍚姩鏈嶅姟鍣?const PORT = serverConfig.port || 5000;
const server = app.listen(PORT, serverConfig.host || '0.0.0.0', async () => {
  console.log(`鏈嶅姟鍣ㄨ繍琛屽湪 http://${serverConfig.host || '0.0.0.0'}:${PORT}`);
  console.log(`鐜: ${process.env.NODE_ENV}`);
  
  // 鍒濆鍖?DHT 鏈嶅姟锛堝鏋滈厤缃负鑷姩鍚姩锛?  if (serverConfig.dht.autoStart) {
    try {
      await dhtService.initialize({
        port: serverConfig.dht.port,
        ip: serverConfig.dht.ip,
        enableRelay: serverConfig.dht.enableRelay
      });
      console.log(`DHT 鏈嶅姟宸叉垚鍔熷垵濮嬪寲锛屼娇鐢ㄧ鍙? ${serverConfig.dht.port}`);
    } catch (error) {
      console.error('鍒濆鍖?DHT 鏈嶅姟澶辫触锛屼絾缁х画杩愯鍏朵粬鏈嶅姟:', error);
    }
  }
  
  console.log('鐜勭帀閫嶆父鍚庣鏈嶅姟宸插惎鍔?);
});

// 浼橀泤鍏抽棴澶勭悊
process.on('SIGINT', async () => {
  console.log('姝ｅ湪鍏抽棴鏈嶅姟鍣?..');
  try {
    // 鏂紑鏁版嵁搴撹繛鎺?    await disconnectDB();
    
    // 鍏抽棴 DHT 鏈嶅姟
    await dhtService.shutdown();
  } catch (error) {
    console.error('鍏抽棴鏈嶅姟鏃跺嚭閿?', error);
  }
  server.close(() => {
    console.log('鏈嶅姟鍣ㄥ凡鍏抽棴');
    process.exit(0);
  });
});
