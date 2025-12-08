// 服务端配置

// 服务端基本配置
const serverConfig = {
  // 服务端IP地址
  host: process.env.SERVER_HOST || '0.0.0.0',
  
  // 服务端端口（改为3000以避免与MetaJadeBridge冲突）
  port: process.env.SERVER_PORT || 3000,
  
  // 是否启用HTTPS
  https: process.env.SERVER_HTTPS === 'true' || false,
  
  // HTTPS证书配置
  httpsConfig: {
    key: process.env.SERVER_HTTPS_KEY || '',
    cert: process.env.SERVER_HTTPS_CERT || ''
  },
  
  // 玄玉区块链DHT配置
  dht: {
    // 是否自动启动DHT服务器
    autoStart: process.env.DHT_AUTO_START === 'false' ? false : true,
    
    // DHT服务器IP地址
    ip: process.env.DHT_IP || '0.0.0.0',
    
    // DHT服务器端口
    port: process.env.DHT_PORT || 4001,
    
    // 是否启用中继
    enableRelay: process.env.DHT_ENABLE_RELAY === 'false' ? false : true
  },
  
  // 日志配置
  logging: {
    // 日志级别：error, warn, info, debug
    level: process.env.LOGGING_LEVEL || 'info',
    
    // 是否将日志输出到文件
    file: process.env.LOGGING_FILE === 'true' || false,
    
    // 日志文件路径
    filePath: process.env.LOGGING_FILE_PATH || './logs/server.log'
  },
  
  // 开发模式配置
  development: {
    // 是否启用开发模式
    enabled: process.env.NODE_ENV === 'development' || false,
    
    // 是否启用热重载
    hotReload: process.env.DEV_HOT_RELOAD === 'false' ? false : true,
    
    // 是否启用调试模式
    debug: process.env.DEV_DEBUG === 'true' || false
  },
  
  // 安全配置
  security: {
    // JWT密钥
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    
    // JWT过期时间（秒）
    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
    
    // 是否启用CORS
    cors: process.env.SECURITY_CORS === 'false' ? false : true,
    
    // CORS配置
    corsOptions: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: process.env.CORS_METHODS || 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Content-Type, Authorization'
    }
  },
  
  // 缓存配置
  cache: {
    // 是否启用缓存
    enabled: process.env.CACHE_ENABLED === 'false' ? false : true,
    
    // 缓存过期时间（秒）
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    
    // 缓存大小限制（MB）
    sizeLimit: parseInt(process.env.CACHE_SIZE_LIMIT || '50')
  },
  
  // 自动备份配置
  backup: {
    // 是否启用自动备份
    enabled: process.env.BACKUP_ENABLED === 'false' ? false : true,
    
    // 备份时间间隔（小时）
    interval: parseInt(process.env.BACKUP_INTERVAL || '24'),
    
    // 备份文件保存路径
    path: process.env.BACKUP_PATH || './backups'
  }
};

module.exports = serverConfig;
