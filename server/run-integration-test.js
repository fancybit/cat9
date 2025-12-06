// 集成测试脚本 - 测试完整的用户注册、登录、转账流程

const userService = require('./services/userService');
const transactionService = require('./services/transactionService');

async function runIntegrationTest() {
  console.log('开始玄玉区块链集成测试...');
  console.log('='.repeat(50));
  
  try {
    // 阶段1: 用户注册
    console.log('\n=== 阶段1: 用户注册 ===');
    
    // 创建第一个用户
    const user1Data = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      displayName: '用户1'
    };
    
    const registerResult1 = await userService.register(user1Data);
    console.log('✓ 用户1注册成功:', registerResult1.user.username);
    
    // 创建第二个用户
    const user2Data = {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      displayName: '用户2'
    };
    
    const registerResult2 = await userService.register(user2Data);
    console.log('✓ 用户2注册成功:', registerResult2.user.username);
    
    // 阶段2: 用户登录
    console.log('\n=== 阶段2: 用户登录 ===');
    
    const loginResult1 = await userService.login(user1Data.username, user1Data.password);
    console.log('✓ 用户1登录成功:', loginResult1.user.username);
    console.log('✓ 用户1令牌生成:', loginResult1.token.substring(0, 20) + '...');
    
    const loginResult2 = await userService.login(user2Data.username, user2Data.password);
    console.log('✓ 用户2登录成功:', loginResult2.user.username);
    console.log('✓ 用户2令牌生成:', loginResult2.token.substring(0, 20) + '...');
    
    // 阶段3: 获取用户信息
    console.log('\n=== 阶段3: 获取用户信息 ===');
    
    const user1Info = await userService.getUserInfo(registerResult1.user.id);
    console.log('✓ 用户1信息:', user1Info.displayName);
    
    const user2Info = await userService.getUserInfo(registerResult2.user.id);
    console.log('✓ 用户2信息:', user2Info.displayName);
    
    // 阶段4: 奖励用户1
    console.log('\n=== 阶段4: 奖励用户 ===');
    
    const rewardAmount = 200;
    const rewardResult = await transactionService.rewardCoins(registerResult1.user.id, rewardAmount, '测试奖励');
    console.log('✓ 奖励用户1成功:', rewardResult.success);
    
    const user1BalanceAfterReward = await transactionService.getUserBalance(registerResult1.user.id);
    console.log('✓ 用户1余额:', user1BalanceAfterReward);
    
    // 阶段5: 转账测试
    console.log('\n=== 阶段5: 转账测试 ===');
    
    const transferAmount = 80;
    const transferResult = await transactionService.transferCoins(
      registerResult1.user.id,
      registerResult2.user.id,
      transferAmount,
      '测试转账'
    );
    
    console.log('✓ 转账成功:', transferResult.success);
    
    const user1BalanceAfterTransfer = await transactionService.getUserBalance(registerResult1.user.id);
    const user2BalanceAfterTransfer = await transactionService.getUserBalance(registerResult2.user.id);
    
    console.log('✓ 用户1转账后余额:', user1BalanceAfterTransfer);
    console.log('✓ 用户2收款后余额:', user2BalanceAfterTransfer);
    
    // 阶段6: 更新用户信息
    console.log('\n=== 阶段6: 更新用户信息 ===');
    
    const updateResult = await userService.updateUserInfo(registerResult1.user.id, {
      displayName: '更新后的用户1',
      avatar: 'https://via.placeholder.com/150'
    });
    
    console.log('✓ 用户1信息更新成功:', updateResult.user.displayName);
    
    // 阶段7: 获取用户交易记录
    console.log('\n=== 阶段7: 获取用户交易记录 ===');
    
    const user1Transactions = await userService.getUserTransactions(registerResult1.user.id);
    const user2Transactions = await userService.getUserTransactions(registerResult2.user.id);
    
    console.log('✓ 用户1交易记录数量:', user1Transactions.length);
    console.log('✓ 用户2交易记录数量:', user2Transactions.length);
    
    // 阶段8: 获取用户钱包信息
    console.log('\n=== 阶段8: 获取用户钱包信息 ===');
    
    const user1Wallet = await userService.getUserWallet(registerResult1.user.id);
    const user2Wallet = await userService.getUserWallet(registerResult2.user.id);
    
    console.log('✓ 用户1钱包信息:', user1Wallet);
    console.log('✓ 用户2钱包信息:', user2Wallet);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 所有集成测试通过！玄玉区块链系统运行正常！');
    console.log('='.repeat(50));
    
    return true;
  } catch (error) {
    console.error('\n测试失败:', error);
    console.error('错误详情:', error.stack);
    console.log('\n' + '='.repeat(50));
    console.log('❌ 集成测试失败！');
    console.log('='.repeat(50));
    return false;
  }
}

// 运行测试
runIntegrationTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试过程中发生未捕获的错误:', error);
  process.exit(1);
});
