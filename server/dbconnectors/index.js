// 数据库连接器入口文件

const MongoDBConnector = require('./mongodbConnector');
const MySQLConnector = require('./mysqlConnector');
const MetaJadeConnector = require('./metajadeConnector');

module.exports = {
  MongoDBConnector,
  MySQLConnector,
  MetaJadeConnector,
  // 根据环境变量或配置选项选择合适的连接器
  getConnector(type = 'metajade', config = {}) {
    // 默认使用metajade(玄玉链)作为数据存储
    const dbType = type.toLowerCase();
    
    switch (dbType) {
      case 'metajade':
        return new MetaJadeConnector(config);
      case 'mongodb':
        return new MongoDBConnector(config);
      case 'mysql':
        return new MySQLConnector(config);
      default:
        return new MetaJadeConnector(config);
    }
  }
};