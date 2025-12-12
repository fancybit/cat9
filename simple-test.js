// 绠€鍗曟祴璇曠巹鐜夊尯鍧楅摼缃戠粶闆嗘垚

const dal = require('./server/dal');

async function testBasicFunctionality() {
  console.log('寮€濮嬫祴璇曠巹鐜夊尯鍧楅摼缃戠粶闆嗘垚鐨勫熀鏈姛鑳?..');
  
  try {
    // 鍒濆鍖朌AL
    console.log('1. 鍒濆鍖朌AL灞?..');
    await dal.initialize();
    console.log('鉁?DAL灞傚垵濮嬪寲鎴愬姛');
    
    // 鍒涘缓涓€涓畝鍗曠殑娴嬭瘯鐢ㄦ埛
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
    
    // 鍒涘缓涓€涓畝鍗曠殑娴嬭瘯娓告垙
    console.log('\n4. 鍒涘缓娴嬭瘯娓告垙...');
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
    console.log('\n5. 鑾峰彇娓告垙淇℃伅...');
    const retrievedGame = await dal.getGameById(game.id);
    console.log('鉁?娓告垙淇℃伅鑾峰彇鎴愬姛:', retrievedGame.name);
    
    // 鍏抽棴DAL
    console.log('\n6. 鍏抽棴DAL灞?..');
    await dal.close();
    console.log('鉁?DAL灞傚叧闂垚鍔?);
    
    console.log('\n=== 鎵€鏈夋祴璇曢€氳繃锛?==');
    return true;
  } catch (error) {
    console.error('娴嬭瘯澶辫触:', error);
    return false;
  }
}

// 杩愯娴嬭瘯
testBasicFunctionality().catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熼敊璇?', error);
});
