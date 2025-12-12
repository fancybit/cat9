// 鏈嶅姟绔厤缃?
// 鏈嶅姟绔熀鏈厤缃?const serverConfig = {
  // 鏈嶅姟绔疘P鍦板潃
  host: process.env.SERVER_HOST || '0.0.0.0',
  
  // 鏈嶅姟绔鍙ｏ紙鏀逛负3000浠ラ伩鍏嶄笌MetaJadeBridge鍐茬獊锛?  port: process.env.SERVER_PORT || 3000,
  
  // 鏄惁鍚敤HTTPS
  https: process.env.SERVER_HTTPS === 'true' || false,
  
  // HTTPS璇佷功閰嶇疆
  httpsConfig: {
    key: process.env.SERVER_HTTPS_KEY || '',
    cert: process.env.SERVER_HTTPS_CERT || ''
  },
  
  // 鐜勭帀鍖哄潡閾綝HT閰嶇疆
  dht: {
    // 鏄惁鑷姩鍚姩DHT鏈嶅姟鍣?    autoStart: process.env.DHT_AUTO_START === 'false' ? false : true,
    
    // DHT鏈嶅姟鍣↖P鍦板潃
    ip: process.env.DHT_IP || '0.0.0.0',
    
    // DHT鏈嶅姟鍣ㄧ鍙?    port: process.env.DHT_PORT || 4001,
    
    // 鏄惁鍚敤涓户
    enableRelay: process.env.DHT_ENABLE_RELAY === 'false' ? false : true
  },
  
  // 鏃ュ織閰嶇疆
  logging: {
    // 鏃ュ織绾у埆锛歟rror, warn, info, debug
    level: process.env.LOGGING_LEVEL || 'info',
    
    // 鏄惁灏嗘棩蹇楄緭鍑哄埌鏂囦欢
    file: process.env.LOGGING_FILE === 'true' || false,
    
    // 鏃ュ織鏂囦欢璺緞
    filePath: process.env.LOGGING_FILE_PATH || './logs/server.log'
  },
  
  // 寮€鍙戞ā寮忛厤缃?  development: {
    // 鏄惁鍚敤寮€鍙戞ā寮?    enabled: process.env.NODE_ENV === 'development' || false,
    
    // 鏄惁鍚敤鐑噸杞?    hotReload: process.env.DEV_HOT_RELOAD === 'false' ? false : true,
    
    // 鏄惁鍚敤璋冭瘯妯″紡
    debug: process.env.DEV_DEBUG === 'true' || false
  },
  
  // 瀹夊叏閰嶇疆
  security: {
    // JWT瀵嗛挜
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    
    // JWT杩囨湡鏃堕棿锛堢锛?    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
    
    // 鏄惁鍚敤CORS
    cors: process.env.SECURITY_CORS === 'false' ? false : true,
    
    // CORS閰嶇疆
    corsOptions: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: process.env.CORS_METHODS || 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Content-Type, Authorization'
    }
  },
  
  // 缂撳瓨閰嶇疆
  cache: {
    // 鏄惁鍚敤缂撳瓨
    enabled: process.env.CACHE_ENABLED === 'false' ? false : true,
    
    // 缂撳瓨杩囨湡鏃堕棿锛堢锛?    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    
    // 缂撳瓨澶у皬闄愬埗锛圡B锛?    sizeLimit: parseInt(process.env.CACHE_SIZE_LIMIT || '50')
  },
  
  // 鑷姩澶囦唤閰嶇疆
  backup: {
    // 鏄惁鍚敤鑷姩澶囦唤
    enabled: process.env.BACKUP_ENABLED === 'false' ? false : true,
    
    // 澶囦唤鏃堕棿闂撮殧锛堝皬鏃讹級
    interval: parseInt(process.env.BACKUP_INTERVAL || '24'),
    
    // 澶囦唤鏂囦欢淇濆瓨璺緞
    path: process.env.BACKUP_PATH || './backups'
  }
};

module.exports = serverConfig;
