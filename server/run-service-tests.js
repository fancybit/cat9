// 服务层测试脚本

const userService = require('./services/userService');
const transactionService = require('./services/transactionService');

async function runServiceTests() {
  console.log('开始测试玄玉区块链服务层...');
  
  try {
    // 测试1: 用户注册
    console.log('\n=== 测试1: 用户注册 ===');
    const userData = {
      username: 'serviceuser',
      email: 'service@example.com',
      password: 'password123',
      displayName: '服务测试用户'
    };
    
    const registerResult = await userService.register(userData);
    console.log('✓ 用户注册成功:', registerResult.user.username);
    
    // 测试2: 用户登录
    console.log('\n=== 测试2: 用户登录 ===');
    const loginResult = await userService.login(userData.username, userData.password);
    console.log('✓ 用户登录成功:', loginResult.user.username);
    console.log('✓ JWT令牌生成成功:', loginResult.token.substring(0, 20) + '...');
    
    // 测试3: 获取用户信息
    console.log('\n=== 测试3: 获取用户信息 ===');
    const userInfo = await userService.getUserInfo(registerResult.user.id);
    console.log('✓ 用户信息获取成功:', userInfo.displayName);
    
    // 测试4: 更新用户信息
    console.log('\n=== 测试4: 更新用户信息 ===');
    const updateData = {
      displayName: '更新后的服务测试用户',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const updateResult = await userService.updateUserInfo(registerResult.user.id, updateData);
    console.log('✓ 用户信息更新成功:', updateResult.user.displayName);
    
    // 测试5: 获取用户钱包信息
    console.log('\n=== 测试5: 获取用户钱包信息 ===');
    const wallet = await userService.getUserWallet(registerResult.user.id);
    console.log('✓ 用户钱包信息获取成功:', wallet.balance);
    
    // 测试6: 奖励用户
    console.log('\n=== 测试6: 奖励用户 ===');
    const rewardAmount = 100;
    const rewardResult = await transactionService.rewardCoins(registerResult.user.id, rewardAmount, '测试奖励');
    console.log('✓ 奖励用户成功:', rewardResult.success);
    
    // 测试7: 获取用户余额
    console.log('\n=== 测试7: 获取用户余额 ===');
    const balance = await transactionService.getUserBalance(registerResult.user.id);
    console.log('✓ 用户余额获取成功:', balance);
    
    // 测试8: 创建第二个用户
    console.log('\n=== 测试8: 创建第二个用户 ===');
    const userData2 = {
      username: 'serviceuser2',
      email: 'service2@example.com',
      password: 'password123',
      displayName: '服务测试用户2'
    };
    
    const registerResult2 = await userService.register(userData2);
    console.log('✓ 第二个用户注册成功:', registerResult2.user.username);
    
    // 测试9: 转账
    console.log('\n=== 测试9: 转账 ===');
    const transferAmount = 50;
    const transferResult = await transactionService.transferCoins(
      registerResult.user.id, 
      registerResult2.user.id, 
      transferAmount, 
      '测试转账'
    );
    console.log('✓ 转账成功:', transferResult.success);
    
    // 测试10: 验证转账结果
    console.log('\n=== 测试10: 验证转账结果 ===');
    const balance1 = await transactionService.getUserBalance(registerResult.user.id);
    const balance2 = await transactionService.getUserBalance(registerResult2.user.id);
    console.log('✓ 用户1余额:', balance1);
    console.log('✓ 用户2余额:', balance2);
    console.log('✓ 转账金额:', transferAmount);
    
    // 测试11: 获取用户交易记录
    console.log('\n=== 测试11: 获取用户交易记录 ===');
    const transactions = await userService.getUserTransactions(registerResult.user.id);
    console.log('✓ 用户交易记录获取成功:', transactions.length);
    
    console.log('\n=== 所有服务层测试通过！===');
    return true;
  } catch (error) {
    console.error('测试失败:', error);
    console.error('错误详情:', error.stack);
    return false;
  }
}

// 运行测试
runServiceTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('测试过程中发生未捕获的错误:', error);
  process.exit(1);
});
