// 鏈嶅姟灞傛祴璇曡剼鏈?
const userService = require('./services/userService');
const transactionService = require('./services/transactionService');

async function runServiceTests() {
  console.log('寮€濮嬫祴璇曠巹鐜夊尯鍧楅摼鏈嶅姟灞?..');
  
  try {
    // 娴嬭瘯1: 鐢ㄦ埛娉ㄥ唽
    console.log('\n=== 娴嬭瘯1: 鐢ㄦ埛娉ㄥ唽 ===');
    const userData = {
      username: 'serviceuser',
      email: 'service@example.com',
      password: 'password123',
      displayName: '鏈嶅姟娴嬭瘯鐢ㄦ埛'
    };
    
    const registerResult = await userService.register(userData);
    console.log('鉁?鐢ㄦ埛娉ㄥ唽鎴愬姛:', registerResult.user.username);
    
    // 娴嬭瘯2: 鐢ㄦ埛鐧诲綍
    console.log('\n=== 娴嬭瘯2: 鐢ㄦ埛鐧诲綍 ===');
    const loginResult = await userService.login(userData.username, userData.password);
    console.log('鉁?鐢ㄦ埛鐧诲綍鎴愬姛:', loginResult.user.username);
    console.log('鉁?JWT浠ょ墝鐢熸垚鎴愬姛:', loginResult.token.substring(0, 20) + '...');
    
    // 娴嬭瘯3: 鑾峰彇鐢ㄦ埛淇℃伅
    console.log('\n=== 娴嬭瘯3: 鑾峰彇鐢ㄦ埛淇℃伅 ===');
    const userInfo = await userService.getUserInfo(registerResult.user.id);
    console.log('鉁?鐢ㄦ埛淇℃伅鑾峰彇鎴愬姛:', userInfo.displayName);
    
    // 娴嬭瘯4: 鏇存柊鐢ㄦ埛淇℃伅
    console.log('\n=== 娴嬭瘯4: 鏇存柊鐢ㄦ埛淇℃伅 ===');
    const updateData = {
      displayName: '鏇存柊鍚庣殑鏈嶅姟娴嬭瘯鐢ㄦ埛',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const updateResult = await userService.updateUserInfo(registerResult.user.id, updateData);
    console.log('鉁?鐢ㄦ埛淇℃伅鏇存柊鎴愬姛:', updateResult.user.displayName);
    
    // 娴嬭瘯5: 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅
    console.log('\n=== 娴嬭瘯5: 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅 ===');
    const wallet = await userService.getUserWallet(registerResult.user.id);
    console.log('鉁?鐢ㄦ埛閽卞寘淇℃伅鑾峰彇鎴愬姛:', wallet.balance);
    
    // 娴嬭瘯6: 濂栧姳鐢ㄦ埛
    console.log('\n=== 娴嬭瘯6: 濂栧姳鐢ㄦ埛 ===');
    const rewardAmount = 100;
    const rewardResult = await transactionService.rewardCoins(registerResult.user.id, rewardAmount, '娴嬭瘯濂栧姳');
    console.log('鉁?濂栧姳鐢ㄦ埛鎴愬姛:', rewardResult.success);
    
    // 娴嬭瘯7: 鑾峰彇鐢ㄦ埛浣欓
    console.log('\n=== 娴嬭瘯7: 鑾峰彇鐢ㄦ埛浣欓 ===');
    const balance = await transactionService.getUserBalance(registerResult.user.id);
    console.log('鉁?鐢ㄦ埛浣欓鑾峰彇鎴愬姛:', balance);
    
    // 娴嬭瘯8: 鍒涘缓绗簩涓敤鎴?    console.log('\n=== 娴嬭瘯8: 鍒涘缓绗簩涓敤鎴?===');
    const userData2 = {
      username: 'serviceuser2',
      email: 'service2@example.com',
      password: 'password123',
      displayName: '鏈嶅姟娴嬭瘯鐢ㄦ埛2'
    };
    
    const registerResult2 = await userService.register(userData2);
    console.log('鉁?绗簩涓敤鎴锋敞鍐屾垚鍔?', registerResult2.user.username);
    
    // 娴嬭瘯9: 杞处
    console.log('\n=== 娴嬭瘯9: 杞处 ===');
    const transferAmount = 50;
    const transferResult = await transactionService.transferCoins(
      registerResult.user.id, 
      registerResult2.user.id, 
      transferAmount, 
      '娴嬭瘯杞处'
    );
    console.log('鉁?杞处鎴愬姛:', transferResult.success);
    
    // 娴嬭瘯10: 楠岃瘉杞处缁撴灉
    console.log('\n=== 娴嬭瘯10: 楠岃瘉杞处缁撴灉 ===');
    const balance1 = await transactionService.getUserBalance(registerResult.user.id);
    const balance2 = await transactionService.getUserBalance(registerResult2.user.id);
    console.log('鉁?鐢ㄦ埛1浣欓:', balance1);
    console.log('鉁?鐢ㄦ埛2浣欓:', balance2);
    console.log('鉁?杞处閲戦:', transferAmount);
    
    // 娴嬭瘯11: 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    console.log('\n=== 娴嬭瘯11: 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍 ===');
    const transactions = await userService.getUserTransactions(registerResult.user.id);
    console.log('鉁?鐢ㄦ埛浜ゆ槗璁板綍鑾峰彇鎴愬姛:', transactions.length);
    
    console.log('\n=== 鎵€鏈夋湇鍔″眰娴嬭瘯閫氳繃锛?==');
    return true;
  } catch (error) {
    console.error('娴嬭瘯澶辫触:', error);
    console.error('閿欒璇︽儏:', error.stack);
    return false;
  }
}

// 杩愯娴嬭瘯
runServiceTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熸湭鎹曡幏鐨勯敊璇?', error);
  process.exit(1);
});
