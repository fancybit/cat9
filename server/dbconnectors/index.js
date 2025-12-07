// 数据库连接器索引文件

const MockConnector = require('./mockConnector');
const MongoDBConnector = require('./mongodbConnector');
const MySQLConnector = require('./mysqlConnector');
const MetaJadeConnector = require('./metajadeConnector');

module.exports = {
  MockConnector,
  MongoDBConnector,
  MySQLConnector,
  MetaJadeConnector,
  // 根据环境变量或配置选择合适的连接器
  getConnector(type = 'mock') {
    switch (type.toLowerCase()) {
      case 'mongodb':
        return new MongoDBConnector();
      case 'mysql':
        return new MySQLConnector();
      case 'metajade':
        return new MetaJadeConnector();
      case 'mock':
      default:
        return new MockConnector();
    }
  }
};