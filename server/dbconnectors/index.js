// 鏁版嵁搴撹繛鎺ュ櫒绱㈠紩鏂囦欢

const MongoDBConnector = require('./mongodbConnector');
const MySQLConnector = require('./mysqlConnector');
const MetaJadeConnector = require('./metajadeConnector');

module.exports = {
  MongoDBConnector,
  MySQLConnector,
  MetaJadeConnector,
  // 鏍规嵁鐜鍙橀噺鎴栭厤缃€夋嫨鍚堥€傜殑杩炴帴鍣?  getConnector(type = 'metajade', config = {}) {
    // 榛樿浣跨敤metajade锛堢巹鐜夐摼锛変綔涓烘暟鎹瓨鍌?    const dbType = type.toLowerCase();
    
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
