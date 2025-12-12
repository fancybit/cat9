// 绠€鍗曟祴璇曡剼鏈?
const dal = require('./dal');

async function runSimpleTest() {
  console.log('寮€濮嬫祴璇曠巹鐜夊尯鍧楅摼DAL灞?..');
  
  try {
    // 鍒濆鍖朌AL灞?    console.log('1. 鍒濆鍖朌AL灞?..');
    await dal.initialize();
    console.log('鉁?DAL灞傚垵濮嬪寲鎴愬姛');
    
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    console.log('\n2. 鍒涘缓娴嬭瘯鐢ㄦ埛...');
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: '娴嬭瘯鐢ㄦ埛'
    };
    
    const user = await dal.createUser(userData);
    console.log('鉁?鐢ㄦ埛鍒涘缓鎴愬姛:', user.id);
    
    // 鑾峰彇鐢ㄦ埛淇℃伅
    console.log('\n3. 鑾峰彇鐢ㄦ埛淇℃伅...');
    const retrievedUser = await dal.getUser(user.id);
    console.log('鉁?鐢ㄦ埛淇℃伅鑾峰彇鎴愬姛:', retrievedUser.username);
    
    // 閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴?    console.log('\n4. 閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴?..');
    const userByUsername = await dal.getUserByUsername(userData.username);
    console.log('鉁?閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴锋垚鍔?', userByUsername.username);
    
    // 鍒涘缓娴嬭瘯娓告垙
    console.log('\n5. 鍒涘缓娴嬭瘯娓告垙...');
    const gameData = {
      name: '娴嬭瘯娓告垙',
      description: '杩欐槸涓€涓祴璇曟父鎴?,
      category: '浼戦棽',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game'
    };
    
    const game = await dal.createGame(gameData);
    console.log('鉁?娓告垙鍒涘缓鎴愬姛:', game.id);
    
    // 鑾峰彇娓告垙淇℃伅
    console.log('\n6. 鑾峰彇娓告垙淇℃伅...');
    const retrievedGame = await dal.getGameById(game.id);
    console.log('鉁?娓告垙淇℃伅鑾峰彇鎴愬姛:', retrievedGame.name);
    
    // 鍒涘缓娴嬭瘯浜ゆ槗
    console.log('\n7. 鍒涘缓娴嬭瘯浜ゆ槗...');
    const transactionData = {
      fromUserId: user.id,
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    console.log('鉁?浜ゆ槗鍒涘缓鎴愬姛:', transaction.id);
    
    // 鎵ц浜ゆ槗
    console.log('\n8. 鎵ц浜ゆ槗...');
    const success = await dal.executeTransaction(transaction.id);
    console.log('鉁?浜ゆ槗鎵ц鎴愬姛:', success);
    
    // 鍒涘缓娴嬭瘯寮€鍙戣€?    console.log('\n9. 鍒涘缓娴嬭瘯寮€鍙戣€?..');
    const developerData = {
      name: '娴嬭瘯寮€鍙戣€?,
      email: 'developer@example.com',
      description: '杩欐槸涓€涓祴璇曞紑鍙戣€?,
      website: 'https://example.com/developer'
    };
    
    const developer = await dal.createDeveloper(developerData);
    console.log('鉁?寮€鍙戣€呭垱寤烘垚鍔?', developer.id);
    
    // 鑾峰彇寮€鍙戣€呬俊鎭?    console.log('\n10. 鑾峰彇寮€鍙戣€呬俊鎭?..');
    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    console.log('鉁?寮€鍙戣€呬俊鎭幏鍙栨垚鍔?', retrievedDeveloper.name);
    
    // 鍏抽棴DAL灞?    console.log('\n11. 鍏抽棴DAL灞?..');
    await dal.close();
    console.log('鉁?DAL灞傚叧闂垚鍔?);
    
    console.log('\n=== 鎵€鏈夋祴璇曢€氳繃锛?==');
    return true;
  } catch (error) {
    console.error('娴嬭瘯澶辫触:', error);
    console.error('閿欒璇︽儏:', error.stack);
    return false;
  }
}

// 杩愯娴嬭瘯
runSimpleTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熸湭鎹曡幏鐨勯敊璇?', error);
  process.exit(1);
});
