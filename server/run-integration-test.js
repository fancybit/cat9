// 闆嗘垚娴嬭瘯鑴氭湰 - 娴嬭瘯瀹屾暣鐨勭敤鎴锋敞鍐屻€佺櫥褰曘€佽浆璐︽祦绋?
const userService = require('./services/userService');
const transactionService = require('./services/transactionService');

async function runIntegrationTest() {
  console.log('寮€濮嬬巹鐜夊尯鍧楅摼闆嗘垚娴嬭瘯...');
  console.log('='.repeat(50));
  
  try {
    // 闃舵1: 鐢ㄦ埛娉ㄥ唽
    console.log('\n=== 闃舵1: 鐢ㄦ埛娉ㄥ唽 ===');
    
    // 鍒涘缓绗竴涓敤鎴?    const user1Data = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      displayName: '鐢ㄦ埛1'
    };
    
    const registerResult1 = await userService.register(user1Data);
    console.log('鉁?鐢ㄦ埛1娉ㄥ唽鎴愬姛:', registerResult1.user.username);
    
    // 鍒涘缓绗簩涓敤鎴?    const user2Data = {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      displayName: '鐢ㄦ埛2'
    };
    
    const registerResult2 = await userService.register(user2Data);
    console.log('鉁?鐢ㄦ埛2娉ㄥ唽鎴愬姛:', registerResult2.user.username);
    
    // 闃舵2: 鐢ㄦ埛鐧诲綍
    console.log('\n=== 闃舵2: 鐢ㄦ埛鐧诲綍 ===');
    
    const loginResult1 = await userService.login(user1Data.username, user1Data.password);
    console.log('鉁?鐢ㄦ埛1鐧诲綍鎴愬姛:', loginResult1.user.username);
    console.log('鉁?鐢ㄦ埛1浠ょ墝鐢熸垚:', loginResult1.token.substring(0, 20) + '...');
    
    const loginResult2 = await userService.login(user2Data.username, user2Data.password);
    console.log('鉁?鐢ㄦ埛2鐧诲綍鎴愬姛:', loginResult2.user.username);
    console.log('鉁?鐢ㄦ埛2浠ょ墝鐢熸垚:', loginResult2.token.substring(0, 20) + '...');
    
    // 闃舵3: 鑾峰彇鐢ㄦ埛淇℃伅
    console.log('\n=== 闃舵3: 鑾峰彇鐢ㄦ埛淇℃伅 ===');
    
    const user1Info = await userService.getUserInfo(registerResult1.user.id);
    console.log('鉁?鐢ㄦ埛1淇℃伅:', user1Info.displayName);
    
    const user2Info = await userService.getUserInfo(registerResult2.user.id);
    console.log('鉁?鐢ㄦ埛2淇℃伅:', user2Info.displayName);
    
    // 闃舵4: 濂栧姳鐢ㄦ埛1
    console.log('\n=== 闃舵4: 濂栧姳鐢ㄦ埛 ===');
    
    const rewardAmount = 200;
    const rewardResult = await transactionService.rewardCoins(registerResult1.user.id, rewardAmount, '娴嬭瘯濂栧姳');
    console.log('鉁?濂栧姳鐢ㄦ埛1鎴愬姛:', rewardResult.success);
    
    const user1BalanceAfterReward = await transactionService.getUserBalance(registerResult1.user.id);
    console.log('鉁?鐢ㄦ埛1浣欓:', user1BalanceAfterReward);
    
    // 闃舵5: 杞处娴嬭瘯
    console.log('\n=== 闃舵5: 杞处娴嬭瘯 ===');
    
    const transferAmount = 80;
    const transferResult = await transactionService.transferCoins(
      registerResult1.user.id,
      registerResult2.user.id,
      transferAmount,
      '娴嬭瘯杞处'
    );
    
    console.log('鉁?杞处鎴愬姛:', transferResult.success);
    
    const user1BalanceAfterTransfer = await transactionService.getUserBalance(registerResult1.user.id);
    const user2BalanceAfterTransfer = await transactionService.getUserBalance(registerResult2.user.id);
    
    console.log('鉁?鐢ㄦ埛1杞处鍚庝綑棰?', user1BalanceAfterTransfer);
    console.log('鉁?鐢ㄦ埛2鏀舵鍚庝綑棰?', user2BalanceAfterTransfer);
    
    // 闃舵6: 鏇存柊鐢ㄦ埛淇℃伅
    console.log('\n=== 闃舵6: 鏇存柊鐢ㄦ埛淇℃伅 ===');
    
    const updateResult = await userService.updateUserInfo(registerResult1.user.id, {
      displayName: '鏇存柊鍚庣殑鐢ㄦ埛1',
      avatar: 'https://via.placeholder.com/150'
    });
    
    console.log('鉁?鐢ㄦ埛1淇℃伅鏇存柊鎴愬姛:', updateResult.user.displayName);
    
    // 闃舵7: 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    console.log('\n=== 闃舵7: 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍 ===');
    
    const user1Transactions = await userService.getUserTransactions(registerResult1.user.id);
    const user2Transactions = await userService.getUserTransactions(registerResult2.user.id);
    
    console.log('鉁?鐢ㄦ埛1浜ゆ槗璁板綍鏁伴噺:', user1Transactions.length);
    console.log('鉁?鐢ㄦ埛2浜ゆ槗璁板綍鏁伴噺:', user2Transactions.length);
    
    // 闃舵8: 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅
    console.log('\n=== 闃舵8: 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅 ===');
    
    const user1Wallet = await userService.getUserWallet(registerResult1.user.id);
    const user2Wallet = await userService.getUserWallet(registerResult2.user.id);
    
    console.log('鉁?鐢ㄦ埛1閽卞寘淇℃伅:', user1Wallet);
    console.log('鉁?鐢ㄦ埛2閽卞寘淇℃伅:', user2Wallet);
    
    console.log('\n' + '='.repeat(50));
    console.log('馃帀 鎵€鏈夐泦鎴愭祴璇曢€氳繃锛佺巹鐜夊尯鍧楅摼绯荤粺杩愯姝ｅ父锛?);
    console.log('='.repeat(50));
    
    return true;
  } catch (error) {
    console.error('\n娴嬭瘯澶辫触:', error);
    console.error('閿欒璇︽儏:', error.stack);
    console.log('\n' + '='.repeat(50));
    console.log('鉂?闆嗘垚娴嬭瘯澶辫触锛?);
    console.log('='.repeat(50));
    return false;
  }
}

// 杩愯娴嬭瘯
runIntegrationTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熸湭鎹曡幏鐨勯敊璇?', error);
  process.exit(1);
});
