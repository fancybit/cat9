// 测试DAL功能与数据库连接器集成

const dal = require('./dal');

async function testDAL() {
  console.log('=== 开始测试DAL层 ===');
  
  try {
    // 初始化DAL
    await dal.initialize();
    console.log('DAL初始化成功');

    // 1. 测试用户操作
    console.log('\n1. 测试用户操作:');
    const user = await dal.createUser({
      username: `dal_test${Date.now()}`,
      email: `dal_test${Date.now()}@example.com`,
      passwordHash: '$2a$10$samplehash',
      coins: 2000
    });
    console.log('   - 创建用户成功:', user.username);

    const foundUser = await dal.getUserByUsername(user.username);
    console.log('   - 按用户名查询成功:', foundUser ? '是' : '否');

    const userById = await dal.getUser(user.id);
    console.log('   - 按ID查询成功:', userById ? '是' : '否');

    // 2. 测试软件操作
    console.log('\n2. 测试软件操作:');
    const software = await dal.createSoftware({
      name: 'DAL测试软件',
      description: '这是一个DAL测试软件',
      version: '1.0.0',
      price: 199,
      publisherId: user.id,
      isFeatured: true
    });
    console.log('   - 创建软件成功:', software.name);

    const foundSoftware = await dal.getSoftware(software.id);
    console.log('   - 查询软件成功:', foundSoftware ? '是' : '否');

    // 3. 测试商品操作
    console.log('\n3. 测试商品操作:');
    const product = await dal.createProduct({
      name: 'DAL测试商品',
      description: '这是一个DAL测试商品',
      price: 88,
      stock: 50,
      category: 'digital'
    });
    console.log('   - 创建商品成功:', product.name);

    const foundProduct = await dal.getProduct(product.id);
    console.log('   - 查询商品成功:', foundProduct ? '是' : '否');

    const allProducts = await dal.getAllProducts();
    console.log('   - 获取所有商品成功，数量:', allProducts.length);

    // 4. 测试交易操作
    console.log('\n4. 测试交易操作:');
    const transaction = await dal.createTransaction({
      userId: user.id,
      type: 'purchase',
      amount: 199,
      itemId: software.id,
      itemType: 'software'
    });
    console.log('   - 创建交易成功:', transaction.id);

    const foundTransaction = await dal.getTransaction(transaction.id);
    console.log('   - 查询交易成功:', foundTransaction ? '是' : '否');

    const userTransactions = await dal.getUserTransactions(user.id);
    console.log('   - 获取用户交易记录成功，数量:', userTransactions.length);

    // 5. 测试业务操作 - 奖励Coins
    console.log('\n5. 测试奖励Coins:');
    const rewardResult = await dal.rewardCoins(user.id, 500);
    console.log('   - 奖励Coins成功，新余额:', rewardResult.user.coins);

    // 6. 测试业务操作 - 购买软件
    console.log('\n6. 测试购买软件:');
    const purchaseSoftwareResult = await dal.purchaseSoftware(user.id, software.id);
    console.log('   - 购买软件成功:', purchaseSoftwareResult.success);
    console.log('   - 购买后余额:', purchaseSoftwareResult.user.coins);

    // 7. 测试业务操作 - 购买商品
    console.log('\n7. 测试购买商品:');
    const purchaseProductResult = await dal.purchaseProduct(user.id, product.id);
    console.log('   - 购买商品成功:', purchaseProductResult.success);
    console.log('   - 购买后余额:', purchaseProductResult.user.coins);
    const updatedProduct = await dal.getProduct(product.id);
    console.log('   - 商品库存更新:', updatedProduct.stock);

    // 8. 测试数据导出
    console.log('\n8. 测试数据导出:');
    const exportedData = await dal.exportData();
    console.log('   - 数据导出成功');
    console.log('   - 导出的软件数量:', exportedData.software.length);
    console.log('   - 导出的商品数量:', exportedData.products.length);

    // 关闭连接
    await dal.close();
    console.log('\nDAL连接关闭成功');

    console.log('\n=== DAL测试全部通过！===');
    return true;
  } catch (error) {
    console.error('\nDAL测试失败:', error.message);
    try {
      await dal.close();
    } catch (disconnectError) {
      console.error('DAL关闭连接失败:', disconnectError.message);
    }
    return false;
  }
}

// 运行测试
testDAL().catch(err => {
  console.error('测试过程中出现未捕获的错误:', err);
});