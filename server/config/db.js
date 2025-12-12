// 鏁版嵁搴撹繛鎺ラ厤缃?const { getConnector } = require('../dbconnectors');

// 鑾峰彇鏁版嵁搴撶被鍨嬶紝榛樿涓簃etajade
const DB_TYPE = process.env.DB_TYPE || 'metajade';

// 鏁版嵁搴撻厤缃?const dbConfig = {
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
    // 鐜勭帀鍖哄潡閾剧綉缁滈厤缃€夐」 - 鍙繚鐣欐ˉ鏈嶅姟鐨勫繀瑕侀厤缃?    // 鍥犱负瀹冨彧鏄cs鐗堢巹鐜夊尯鍧楅摼妗ユ湇鍔＄殑灏佽
    bridgeHost: process.env.METAJADE_BRIDGE_HOST || 'localhost',
    bridgePort: process.env.METAJADE_BRIDGE_PORT || 5000
    // DHT鐩稿叧閰嶇疆宸茬Щ鑷硈erver.js涓?  }
};

// 鍏ㄥ眬鏁版嵁搴撹繛鎺ュ櫒瀹炰緥
let dbConnector = null;

// 杩炴帴鏁版嵁搴?const connectDB = async () => {
  try {
    // 鑾峰彇鏁版嵁搴撻厤缃?    const config = dbConfig[DB_TYPE];
    
    // 鑾峰彇瀵瑰簲绫诲瀷鐨勬暟鎹簱杩炴帴鍣紝浼犻€掗厤缃€夐」
    dbConnector = getConnector(DB_TYPE, config);
    
    // 杩炴帴鏁版嵁搴?    await dbConnector.connect(config);
    
    // 鑾峰彇鏁版嵁搴撶被鍨嬪悕绉?    const dbTypeName = {
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'metajade': '鐜勭帀鍖哄潡閾?
    }[DB_TYPE] || DB_TYPE;
    
    console.log(`${dbTypeName} 鏁版嵁搴撹繛鎺ユ垚鍔焋);
    
    // 濡傛灉鏄巹鐜夊尯鍧楅摼锛屾樉绀鸿繛鎺ヤ俊鎭?    if (DB_TYPE === 'metajade') {
      console.log(`鐜勭帀鍖哄潡閾鹃厤缃? 妗ユ湇鍔?${config.bridgeHost}:${config.bridgePort}`);
    }
  } catch (error) {
    // 鑾峰彇鏁版嵁搴撶被鍨嬪悕绉?    const dbTypeName = {
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'metajade': '鐜勭帀鍖哄潡閾?
    }[DB_TYPE] || DB_TYPE;
    
    console.error(`${dbTypeName} 鏁版嵁搴撹繛鎺ュけ璐? ${error.message}`);
    // 寮€鍙戠幆澧冧笅涓嶉€€鍑鸿繘绋嬶紝浠ヤ究缁х画璋冭瘯
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
    throw error;
  }
};

// 鏂紑鏁版嵁搴撹繛鎺?const disconnectDB = async () => {
  if (dbConnector) {
    try {
      await dbConnector.disconnect();
      
      // 鑾峰彇鏁版嵁搴撶被鍨嬪悕绉?      const dbTypeName = {
        'mongodb': 'MongoDB',
        'mysql': 'MySQL',
        'metajade': '鐜勭帀鍖哄潡閾?
      }[DB_TYPE] || DB_TYPE;
      
      console.log(`${dbTypeName} 鏁版嵁搴撹繛鎺ュ凡鏂紑`);
    } catch (error) {
      console.error(`鏂紑鏁版嵁搴撹繛鎺ュけ璐? ${error.message}`);
    }
  }
};

// 鑾峰彇鏁版嵁搴撹繛鎺ュ櫒瀹炰緥
const getDBConnector = () => {
  if (!dbConnector) {
    throw new Error('鏁版嵁搴撳皻鏈繛鎺ワ紝璇峰厛璋冪敤 connectDB()');
  }
  return dbConnector;
};

module.exports = {
  connectDB,
  disconnectDB,
  getDBConnector,
  DB_TYPE
};
