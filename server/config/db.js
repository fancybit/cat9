// 数据库连接配置
const { getConnector } = require('../dbconnectors');

// 获取数据库类型，默认为metajade
const DB_TYPE = process.env.DB_TYPE || 'metajade';

// 数据库配置
const dbConfig = {
  mock: {
    // Mock数据库不需要额外配置
  },
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/cat9',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cat9',
    port: process.env.MYSQL_PORT || 3306
  },
  metajade: {
    // 玄玉区块链不需要额外配置
  }
};

// 全局数据库连接器实例
let dbConnector = null;

// 连接数据库
const connectDB = async () => {
  try {
    // 获取对应类型的数据库连接器
    dbConnector = getConnector(DB_TYPE);
    
    // 连接数据库
    await dbConnector.connect(dbConfig[DB_TYPE]);
    
    // 获取数据库类型名称
    const dbTypeName = {
      'mock': 'Mock',
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'metajade': '玄玉区块链'
    }[DB_TYPE] || DB_TYPE;
    
    console.log(`${dbTypeName} 数据库连接成功`);
  } catch (error) {
    // 获取数据库类型名称
    const dbTypeName = {
      'mock': 'Mock',
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'metajade': '玄玉区块链'
    }[DB_TYPE] || DB_TYPE;
    
    console.error(`${dbTypeName} 数据库连接失败: ${error.message}`);
    // 开发环境下不退出进程，以便继续调试
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
    throw error;
  }
};

// 断开数据库连接
const disconnectDB = async () => {
  if (dbConnector) {
    try {
      await dbConnector.disconnect();
      
      // 获取数据库类型名称
      const dbTypeName = {
        'mock': 'Mock',
        'mongodb': 'MongoDB',
        'mysql': 'MySQL',
        'metajade': '玄玉区块链'
      }[DB_TYPE] || DB_TYPE;
      
      console.log(`${dbTypeName} 数据库连接已断开`);
    } catch (error) {
      console.error(`断开数据库连接失败: ${error.message}`);
    }
  }
};

// 获取数据库连接器实例
const getDBConnector = () => {
  if (!dbConnector) {
    throw new Error('数据库尚未连接，请先调用 connectDB()');
  }
  return dbConnector;
};

module.exports = {
  connectDB,
  disconnectDB,
  getDBConnector,
  DB_TYPE
};