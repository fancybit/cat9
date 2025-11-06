// 测试数据库连接器功能

const { MockConnector, MongoDBConnector, MySQLConnector } = require('./dbconnectors');

async function testConnector(connector, type) {
  console.log(`\n=== 测试 ${type} 数据库连接器 ===`);
  
  try {
    // 连接数据库
    await connector.connect();
    console.log(`${type} 连接成功`);

    // 测试用户操作
    console.log('\n1. 测试用户操作:');
    const user = await connector.createUser({
      username: `test${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      passwordHash: '$2a$10$samplehash',
      coins: 1000
    });
    console.log('   - 创建用户成功:', user.username);

    const foundUser = await connector.getUserByUsername(user.username);
    console.log('   - 按用户名查询成功:', foundUser ? '是' : '否');

    const userById = await connector.getUserById(user.id);
    console.log('   - 按ID查询成功:', userById ? '是' : '否');

    // 测试软件操作
    console.log('\n2. 测试软件操作:');
    const software = await connector.createSoftware({
      name: '测试软件',
      description: '这是一个测试软件',
      version: '1.0.0',
      price: 99,
      publisherId: user.id
    });
    console.log('   - 创建软件成功:', software.name);

    const foundSoftware = await connector.getSoftwareById(software.id);
    console.log('   - 查询软件成功:', foundSoftware ? '是' : '否');

    // 测试商品操作
    console.log('\n3. 测试商品操作:');
    const product = await connector.createProduct({
      name: '测试商品',
      description: '这是一个测试商品',
      price: 50,
      stock: 100,
      category: 'digital'
    });
    console.log('   - 创建商品成功:', product.name);

    const foundProduct = await connector.getProductById(product.id);
    console.log('   - 查询商品成功:', foundProduct ? '是' : '否');

    // 测试交易操作
    console.log('\n4. 测试交易操作:');
    const transaction = await connector.createTransaction({
      userId: user.id,
      type: 'purchase',
      amount: 99,
      itemId: software.id,
      itemType: 'software'
    });
    console.log('   - 创建交易成功:', transaction.id);

    const foundTransaction = await connector.getTransactionById(transaction.id);
    console.log('   - 查询交易成功:', foundTransaction ? '是' : '否');

    // 测试更新余额
    console.log('\n5. 测试更新余额:');
    const updatedUser = await connector.updateUserCoins(user.id, -99);
    console.log('   - 更新余额成功，剩余余额:', updatedUser.coins);

    // 测试获取用户交易记录
    console.log('\n6. 测试获取用户交易记录:');
    const userTransactions = await connector.getUserTransactions(user.id);
    console.log('   - 获取用户交易记录成功，数量:', userTransactions.length);

    // 断开连接
    await connector.disconnect();
    console.log(`\n${type} 断开连接成功`);
    
    return true;
  } catch (error) {
    console.error(`\n${type} 测试失败:`, error.message);
    try {
      await connector.disconnect();
    } catch (disconnectError) {
      console.error(`${type} 断开连接失败:`, disconnectError.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('开始测试数据库连接器...');

  // 测试Mock数据库
  const mockConnector = new MockConnector();
  const mockResult = await testConnector(mockConnector, 'Mock数据库');
  console.log(`\nMock数据库测试结果: ${mockResult ? '通过' : '失败'}`);

  // 注意：实际运行时，MongoDB和MySQL测试需要确保数据库服务已启动
  console.log('\n注意：MongoDB和MySQL测试需要确保对应数据库服务已启动');
  console.log('如需测试，请取消下面代码的注释');

  // 测试MongoDB（如果需要测试，请取消注释）
  // const mongoConnector = new MongoDBConnector();
  // const mongoResult = await testConnector(mongoConnector, 'MongoDB');
  // console.log(`\nMongoDB测试结果: ${mongoResult ? '通过' : '失败'}`);

  // 测试MySQL（如果需要测试，请取消注释并配置正确的连接信息）
  // const mysqlConnector = new MySQLConnector();
  // const mysqlResult = await testConnector(mysqlConnector, 'MySQL');
  // console.log(`\nMySQL测试结果: ${mysqlResult ? '通过' : '失败'}`);

  console.log('\n测试完成！');
}

// 运行测试
runTests().catch(err => {
  console.error('测试过程中出现未捕获的错误:', err);
});