// 娴嬭瘯鐜勭帀鍖哄潡閾剧綉缁滈泦鎴?
const dal = require('./server/dal');
const userService = require('./server/services/userService');
const transactionService = require('./server/services/transactionService');

async function testUserRegistration() {
  console.log('=== 娴嬭瘯鐢ㄦ埛娉ㄥ唽 ===');
  try {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      displayName: '娴嬭瘯鐢ㄦ埛',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const result = await userService.register(userData);
    console.log('鐢ㄦ埛娉ㄥ唽缁撴灉:', result);
    return result.success;
  } catch (error) {
    console.error('鐢ㄦ埛娉ㄥ唽澶辫触:', error);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n=== 娴嬭瘯鐢ㄦ埛鐧诲綍 ===');
  try {
    const result = await userService.login('testuser', 'password123');
    console.log('鐢ㄦ埛鐧诲綍缁撴灉:', result);
    return result.success ? result.token : null;
  } catch (error) {
    console.error('鐢ㄦ埛鐧诲綍澶辫触:', error);
    return null;
  }
}

async function testGameCreation() {
  console.log('\n=== 娴嬭瘯娓告垙鍒涘缓 ===');
  try {
    const gameData = {
      name: '娴嬭瘯娓告垙',
      description: '杩欐槸涓€涓祴璇曟父鎴?,
      category: '浼戦棽',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game',
      isFeatured: true
    };
    
    const game = await dal.createGame(gameData);
    console.log('娓告垙鍒涘缓缁撴灉:', game);
    return game ? game.id : null;
  } catch (error) {
    console.error('娓告垙鍒涘缓澶辫触:', error);
    return null;
  }
}

async function testTransaction() {
  console.log('\n=== 娴嬭瘯浜ゆ槗 ===');
  try {
    // 鍒涘缓涓や釜娴嬭瘯鐢ㄦ埛
    const user1 = await dal.createUser({
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '鐢ㄦ埛1'
    });
    
    const user2 = await dal.createUser({
      username: 'user2',
      email: 'user2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '鐢ㄦ埛2'
    });
    
    // 濂栧姳鐢ㄦ埛1涓€浜涚‖甯?    const rewardResult = await transactionService.rewardCoins(user1.id, 100);
    console.log('濂栧姳鐢ㄦ埛1缁撴灉:', rewardResult);
    
    // 鐢ㄦ埛1鍚戠敤鎴?杞处
    const transferResult = await transactionService.transferCoins(user1.id, user2.id, 50, '娴嬭瘯杞处');
    console.log('杞处缁撴灉:', transferResult);
    
    // 妫€鏌ョ敤鎴蜂綑棰?    const user1Balance = await transactionService.getUserBalance(user1.id);
    const user2Balance = await transactionService.getUserBalance(user2.id);
    console.log('鐢ㄦ埛1浣欓:', user1Balance);
    console.log('鐢ㄦ埛2浣欓:', user2Balance);
    
    return transferResult.success;
  } catch (error) {
    console.error('浜ゆ槗娴嬭瘯澶辫触:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('寮€濮嬫祴璇曠巹鐜夊尯鍧楅摼缃戠粶闆嗘垚...');
  
  // 鍒濆鍖朌AL
  await dal.initialize();
  
  // 杩愯鎵€鏈夋祴璇?  const registrationSuccess = await testUserRegistration();
  const token = await testUserLogin();
  const gameId = await testGameCreation();
  const transactionSuccess = await testTransaction();
  
  console.log('\n=== 娴嬭瘯缁撴灉 ===');
  console.log('鐢ㄦ埛娉ㄥ唽:', registrationSuccess ? '鎴愬姛' : '澶辫触');
  console.log('鐢ㄦ埛鐧诲綍:', token ? '鎴愬姛' : '澶辫触');
  console.log('娓告垙鍒涘缓:', gameId ? '鎴愬姛' : '澶辫触');
  console.log('浜ゆ槗娴嬭瘯:', transactionSuccess ? '鎴愬姛' : '澶辫触');
  
  // 鍏抽棴DAL
  await dal.close();
  
  console.log('\n鎵€鏈夋祴璇曞畬鎴愶紒');
}

// 杩愯娴嬭瘯
runAllTests().catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熼敊璇?', error);
});
