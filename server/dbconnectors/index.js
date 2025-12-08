// 数据库连接器索引文件

const MongoDBConnector = require('./mongodbConnector');
const MySQLConnector = require('./mysqlConnector');
const MetaJadeConnector = require('./metajadeConnector');

module.exports = {
  MongoDBConnector,
  MySQLConnector,
  MetaJadeConnector,
  // 根据环境变量或配置选择合适的连接器
  getConnector(type = 'metajade', config = {}) {
    switch (type.toLowerCase()) {
      case 'mongodb':
        return new MongoDBConnector(config);
      case 'mysql':
        return new MySQLConnector(config);
      case 'metajade':
      default:
        return new MetaJadeConnector(config);
    }
  }
};