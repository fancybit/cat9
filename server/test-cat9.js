// 测试cat9库集成功能

const dal = require('./dal');
const userService = require('./services/userService');
const softwareService = require('./services/softwareService');
const productService = require('./services/productService');
const transactionService = require('./services/transactionService');

async function runTest() {
  console.log('开始测试cat9库集成...');
  
  try {
    // 初始化DAL
    await dal.initialize();
    console.log('数据访问层初始化成功');
    
    // 1. 测试用户注册
    console.log('\n1. 测试用户注册...');
    const registerResult = await userService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123456',
      displayName: '测试用户'
    });
    console.log('注册结果:', registerResult.success ? '成功' : '失败', registerResult.error || '');
    
    if (!registerResult.success) return;
    
    const userId = registerResult.user.id;
    
    // 2. 测试用户登录
    console.log('\n2. 测试用户登录...');
    const loginResult = await userService.login('testuser', 'Test@123456');
    console.log('登录结果:', loginResult.success ? '成功' : '失败', loginResult.error || '');
    
    // 3. 创建一个发布者用户
    console.log('\n3. 创建发布者用户...');
    const publisherResult = await userService.register({
      username: 'publisher',
      email: 'publisher@example.com',
      password: 'Publisher@123',
      displayName: '游戏发布者'
    });
    console.log('发布者创建结果:', publisherResult.success ? '成功' : '失败');
    
    if (!publisherResult.success) return;
    
    const publisherId = publisherResult.user.id;
    
    // 4. 测试创建软件
    console.log('\n4. 测试创建软件...');
    const softwareResult = await softwareService.createSoftware({
      name: '测试游戏',
      description: '这是一个测试游戏',
      publisherId: publisherId,
      version: '1.0.0',
      price: 100,
      tags: ['测试', '游戏']
    });
    console.log('软件创建结果:', softwareResult.success ? '成功' : '失败', softwareResult.error || '');
    
    if (!softwareResult.success) return;
    
    const softwareId = softwareResult.software.id;
    
    // 5. 测试创建商品
    console.log('\n5. 测试创建商品...');
    const productResult = await productService.createProduct({
      name: '游戏道具',
      description: '测试游戏道具',
      sellerId: publisherId,
      price: 50,
      category: '游戏道具',
      tags: ['道具', '虚拟物品']
    });
    console.log('商品创建结果:', productResult.success ? '成功' : '失败', productResult.error || '');
    
    if (!productResult.success) return;
    
    const productId = productResult.product.id;
    
    // 6. 给用户奖励一些Cat9Coins
    console.log('\n6. 奖励用户Cat9Coins...');
    const rewardResult = await transactionService.rewardCoins(userId, 1000, '测试奖励');
    console.log('奖励结果:', rewardResult.success ? '成功' : '失败', rewardResult.error || '');
    
    // 7. 检查用户余额
    console.log('\n7. 检查用户余额...');
    const balance = await transactionService.getUserBalance(userId);
    console.log('用户余额:', balance, 'Cat9Coins');
    
    // 8. 测试购买软件
    console.log('\n8. 测试购买软件...');
    const purchaseSoftwareResult = await softwareService.purchaseSoftware(userId, softwareId);
    console.log('购买软件结果:', purchaseSoftwareResult.success ? '成功' : '失败', purchaseSoftwareResult.error || '');
    
    // 9. 测试购买商品
    console.log('\n9. 测试购买商品...');
    const purchaseProductResult = await productService.purchaseProduct(userId, productId);
    console.log('购买商品结果:', purchaseProductResult.success ? '成功' : '失败', purchaseProductResult.error || '');
    
    // 10. 再次检查用户余额
    console.log('\n10. 再次检查用户余额...');
    const finalBalance = await transactionService.getUserBalance(userId);
    console.log('用户最终余额:', finalBalance, 'Cat9Coins');
    
    // 11. 获取用户交易记录
    console.log('\n11. 获取用户交易记录...');
    const transactions = await transactionService.getUserTransactions(userId);
    console.log('交易记录数量:', transactions.length);
    
    // 12. 获取用户拥有的软件
    console.log('\n12. 获取用户拥有的软件...');
    const userSoftware = await softwareService.getUserSoftware(userId);
    console.log('拥有的软件数量:', userSoftware.length);
    
    // 13. 获取用户拥有的商品
    console.log('\n13. 获取用户拥有的商品...');
    const userProducts = await productService.getUserProducts(userId);
    console.log('拥有的商品数量:', userProducts.length);
    
    console.log('\n测试完成！');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
runTest();