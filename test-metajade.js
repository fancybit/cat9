// 测试玄玉区块链网络集成

const dal = require('./server/dal');
const userService = require('./server/services/userService');
const transactionService = require('./server/services/transactionService');

async function testUserRegistration() {
  console.log('=== 测试用户注册 ===');
  try {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      displayName: '测试用户',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const result = await userService.register(userData);
    console.log('用户注册结果:', result);
    return result.success;
  } catch (error) {
    console.error('用户注册失败:', error);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n=== 测试用户登录 ===');
  try {
    const result = await userService.login('testuser', 'password123');
    console.log('用户登录结果:', result);
    return result.success ? result.token : null;
  } catch (error) {
    console.error('用户登录失败:', error);
    return null;
  }
}

async function testGameCreation() {
  console.log('\n=== 测试游戏创建 ===');
  try {
    const gameData = {
      name: '测试游戏',
      description: '这是一个测试游戏',
      category: '休闲',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game',
      isFeatured: true
    };
    
    const game = await dal.createGame(gameData);
    console.log('游戏创建结果:', game);
    return game ? game.id : null;
  } catch (error) {
    console.error('游戏创建失败:', error);
    return null;
  }
}

async function testTransaction() {
  console.log('\n=== 测试交易 ===');
  try {
    // 创建两个测试用户
    const user1 = await dal.createUser({
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '用户1'
    });
    
    const user2 = await dal.createUser({
      username: 'user2',
      email: 'user2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '用户2'
    });
    
    // 奖励用户1一些硬币
    const rewardResult = await transactionService.rewardCoins(user1.id, 100);
    console.log('奖励用户1结果:', rewardResult);
    
    // 用户1向用户2转账
    const transferResult = await transactionService.transferCoins(user1.id, user2.id, 50, '测试转账');
    console.log('转账结果:', transferResult);
    
    // 检查用户余额
    const user1Balance = await transactionService.getUserBalance(user1.id);
    const user2Balance = await transactionService.getUserBalance(user2.id);
    console.log('用户1余额:', user1Balance);
    console.log('用户2余额:', user2Balance);
    
    return transferResult.success;
  } catch (error) {
    console.error('交易测试失败:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('开始测试玄玉区块链网络集成...');
  
  // 初始化DAL
  await dal.initialize();
  
  // 运行所有测试
  const registrationSuccess = await testUserRegistration();
  const token = await testUserLogin();
  const gameId = await testGameCreation();
  const transactionSuccess = await testTransaction();
  
  console.log('\n=== 测试结果 ===');
  console.log('用户注册:', registrationSuccess ? '成功' : '失败');
  console.log('用户登录:', token ? '成功' : '失败');
  console.log('游戏创建:', gameId ? '成功' : '失败');
  console.log('交易测试:', transactionSuccess ? '成功' : '失败');
  
  // 关闭DAL
  await dal.close();
  
  console.log('\n所有测试完成！');
}

// 运行测试
runAllTests().catch(error => {
  console.error('测试过程中发生错误:', error);
});
