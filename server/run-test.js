// 简单测试脚本

const dal = require('./dal');

async function runSimpleTest() {
  console.log('开始测试玄玉区块链DAL层...');
  
  try {
    // 初始化DAL层
    console.log('1. 初始化DAL层...');
    await dal.initialize();
    console.log('✓ DAL层初始化成功');
    
    // 创建测试用户
    console.log('\n2. 创建测试用户...');
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: '测试用户'
    };
    
    const user = await dal.createUser(userData);
    console.log('✓ 用户创建成功:', user.id);
    
    // 获取用户信息
    console.log('\n3. 获取用户信息...');
    const retrievedUser = await dal.getUser(user.id);
    console.log('✓ 用户信息获取成功:', retrievedUser.username);
    
    // 通过用户名获取用户
    console.log('\n4. 通过用户名获取用户...');
    const userByUsername = await dal.getUserByUsername(userData.username);
    console.log('✓ 通过用户名获取用户成功:', userByUsername.username);
    
    // 创建测试游戏
    console.log('\n5. 创建测试游戏...');
    const gameData = {
      name: '测试游戏',
      description: '这是一个测试游戏',
      category: '休闲',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game'
    };
    
    const game = await dal.createGame(gameData);
    console.log('✓ 游戏创建成功:', game.id);
    
    // 获取游戏信息
    console.log('\n6. 获取游戏信息...');
    const retrievedGame = await dal.getGameById(game.id);
    console.log('✓ 游戏信息获取成功:', retrievedGame.name);
    
    // 创建测试交易
    console.log('\n7. 创建测试交易...');
    const transactionData = {
      fromUserId: user.id,
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    console.log('✓ 交易创建成功:', transaction.id);
    
    // 执行交易
    console.log('\n8. 执行交易...');
    const success = await dal.executeTransaction(transaction.id);
    console.log('✓ 交易执行成功:', success);
    
    // 创建测试开发者
    console.log('\n9. 创建测试开发者...');
    const developerData = {
      name: '测试开发者',
      email: 'developer@example.com',
      description: '这是一个测试开发者',
      website: 'https://example.com/developer'
    };
    
    const developer = await dal.createDeveloper(developerData);
    console.log('✓ 开发者创建成功:', developer.id);
    
    // 获取开发者信息
    console.log('\n10. 获取开发者信息...');
    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    console.log('✓ 开发者信息获取成功:', retrievedDeveloper.name);
    
    // 关闭DAL层
    console.log('\n11. 关闭DAL层...');
    await dal.close();
    console.log('✓ DAL层关闭成功');
    
    console.log('\n=== 所有测试通过！===');
    return true;
  } catch (error) {
    console.error('测试失败:', error);
    console.error('错误详情:', error.stack);
    return false;
  }
}

// 运行测试
runSimpleTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试过程中发生未捕获的错误:', error);
  process.exit(1);
});
