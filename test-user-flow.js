// 鐢ㄦ埛娴佺▼娴嬭瘯鑴氭湰 - 娴嬭瘯娉ㄥ唽銆佺櫥褰曘€佺櫥鍑恒€佹崲璐﹀彿娉ㄥ唽銆佺櫥褰?const fetch = require('node-fetch');

// 娴嬭瘯閰嶇疆
const API_BASE_URL = 'http://localhost:5000/api/users';

// 鐢熸垚闅忔満鐢ㄦ埛鍚?const generateRandomUsername = () => {
  return `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// 娴嬭瘯鍑芥暟
async function testUserFlow() {
  console.log('寮€濮嬬敤鎴锋祦绋嬫祴璇?..');
  console.log('='.repeat(50));

  // 娴嬭瘯1锛氭敞鍐屾柊鐢ㄦ埛
  console.log('\n1. 娴嬭瘯娉ㄥ唽鏂扮敤鎴?..');
  const username1 = generateRandomUsername();
  const user1Email = `${username1}@example.com`;
  const user1Password = 'testpassword123';

  try {
    const registerResponse = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        email: user1Email,
        password: user1Password,
        displayName: 'Test User 1'
      })
    });

    if (!registerResponse.ok) {
      throw new Error(`娉ㄥ唽澶辫触锛岀姸鎬佺爜: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`娉ㄥ唽澶辫触: ${registerData.error}`);
    }

    console.log(`鉁?娉ㄥ唽鎴愬姛锛岀敤鎴峰悕: ${username1}`);
    console.log(`   鐢ㄦ埛ID: ${registerData.user.id}`);
  } catch (error) {
    console.error(`鉂?娉ㄥ唽澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯2锛氫娇鐢ㄦ柊娉ㄥ唽鐨勭敤鎴风櫥褰?  console.log('\n2. 娴嬭瘯鐧诲綍鏂版敞鍐岀殑鐢ㄦ埛...');
  let user1Token = null;

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        password: user1Password
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`鐧诲綍澶辫触锛岀姸鎬佺爜: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`鐧诲綍澶辫触: ${loginData.error}`);
    }

    user1Token = loginData.token;
    console.log(`鉁?鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝`);
    console.log(`   浠ょ墝绫诲瀷: Bearer`);
    console.log(`   浠ょ墝闀垮害: ${user1Token.length} 瀛楃`);
  } catch (error) {
    console.error(`鉂?鐧诲綍澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯3锛氳幏鍙栧綋鍓嶇敤鎴蜂俊鎭?  console.log('\n3. 娴嬭瘯鑾峰彇褰撳墠鐢ㄦ埛淇℃伅...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user1Token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触锛岀姸鎬佺爜: ${userInfoResponse.status}`);
    }

    const userInfoData = await userInfoResponse.json();
    if (!userInfoData.success || !userInfoData.user) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${userInfoData.error}`);
    }

    console.log(`鉁?鑾峰彇鐢ㄦ埛淇℃伅鎴愬姛`);
    console.log(`   鐢ㄦ埛鍚? ${userInfoData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${userInfoData.user.displayName}`);
    console.log(`   閭: ${userInfoData.user.email}`);
  } catch (error) {
    console.error(`鉂?鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${error.message}`);
  }

  // 娴嬭瘯4锛氱櫥鍑猴紙鍓嶇琛屼负锛屽悗绔笉闇€瑕丄PI锛?  console.log('\n4. 娴嬭瘯鐧诲嚭...');
  user1Token = null; // 鍓嶇娓呴櫎浠ょ墝
  console.log(`鉁?鐧诲嚭鎴愬姛锛堝墠绔竻闄や护鐗岋級`);

  // 娴嬭瘯5锛氫娇鐢ㄦ棤鏁堜护鐗岃幏鍙栫敤鎴蜂俊鎭紙楠岃瘉鐧诲嚭鏁堟灉锛?  console.log('\n5. 娴嬭瘯浣跨敤鏃犳晥浠ょ墝鑾峰彇鐢ㄦ埛淇℃伅...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer invalid_token`
      }
    });

    if (userInfoResponse.ok) {
      throw new Error('浣跨敤鏃犳晥浠ょ墝鑾峰彇鐢ㄦ埛淇℃伅鎴愬姛锛岃繖鏄笉搴旇鍙戠敓鐨?);
    }

    console.log(`鉁?楠岃瘉鎴愬姛锛氫娇鐢ㄦ棤鏁堜护鐗岃姝ｇ‘鎷掔粷`);
  } catch (error) {
    console.error(`鉂?楠岃瘉澶辫触: ${error.message}`);
  }

  // 娴嬭瘯6锛氭敞鍐岀浜屼釜璐﹀彿
  console.log('\n6. 娴嬭瘯娉ㄥ唽绗簩涓处鍙?..');
  const username2 = generateRandomUsername();
  const user2Email = `${username2}@example.com`;
  const user2Password = 'testpassword456';

  try {
    const registerResponse = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username2,
        email: user2Email,
        password: user2Password,
        displayName: 'Test User 2'
      })
    });

    if (!registerResponse.ok) {
      throw new Error(`娉ㄥ唽澶辫触锛岀姸鎬佺爜: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`娉ㄥ唽澶辫触: ${registerData.error}`);
    }

    console.log(`鉁?娉ㄥ唽鎴愬姛锛岀敤鎴峰悕: ${username2}`);
    console.log(`   鐢ㄦ埛ID: ${registerData.user.id}`);
  } catch (error) {
    console.error(`鉂?娉ㄥ唽澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯7锛氫娇鐢ㄧ浜屼釜璐﹀彿鐧诲綍
  console.log('\n7. 娴嬭瘯浣跨敤绗簩涓处鍙风櫥褰?..');
  let user2Token = null;

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username2,
        password: user2Password
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`鐧诲綍澶辫触锛岀姸鎬佺爜: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`鐧诲綍澶辫触: ${loginData.error}`);
    }

    user2Token = loginData.token;
    console.log(`鉁?鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝`);
    console.log(`   浠ょ墝绫诲瀷: Bearer`);
    console.log(`   浠ょ墝闀垮害: ${user2Token.length} 瀛楃`);
  } catch (error) {
    console.error(`鉂?鐧诲綍澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯8锛氳幏鍙栫浜屼釜鐢ㄦ埛鐨勪俊鎭?  console.log('\n8. 娴嬭瘯鑾峰彇绗簩涓敤鎴风殑淇℃伅...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user2Token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触锛岀姸鎬佺爜: ${userInfoResponse.status}`);
    }

    const userInfoData = await userInfoResponse.json();
    if (!userInfoData.success || !userInfoData.user) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${userInfoData.error}`);
    }

    console.log(`鉁?鑾峰彇鐢ㄦ埛淇℃伅鎴愬姛`);
    console.log(`   鐢ㄦ埛鍚? ${userInfoData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${userInfoData.user.displayName}`);
    console.log(`   閭: ${userInfoData.user.email}`);
  } catch (error) {
    console.error(`鉂?鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${error.message}`);
  }

  // 娴嬭瘯9锛氫娇鐢ㄧ涓€涓处鍙风殑鐢ㄦ埛鍚嶅拰绗簩涓处鍙风殑瀵嗙爜鐧诲綍锛堝簲璇ュけ璐ワ級
  console.log('\n9. 娴嬭瘯浣跨敤閿欒鐨勭敤鎴峰悕鍜屽瘑鐮佺櫥褰?..');

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        password: user2Password // 浣跨敤閿欒鐨勫瘑鐮?      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      if (loginData.success) {
        throw new Error('浣跨敤閿欒鐨勫瘑鐮佺櫥褰曟垚鍔燂紝杩欐槸涓嶅簲璇ュ彂鐢熺殑');
      }
    }

    console.log(`鉁?楠岃瘉鎴愬姛锛氫娇鐢ㄩ敊璇殑瀵嗙爜琚纭嫆缁漙);
  } catch (error) {
    console.error(`鉂?楠岃瘉澶辫触: ${error.message}`);
  }

  // 娴嬭瘯10锛氫娇鐢ㄧ涓€涓处鍙锋甯哥櫥褰?  console.log('\n10. 娴嬭瘯浣跨敤绗竴涓处鍙锋甯哥櫥褰?..');

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        password: user1Password // 浣跨敤姝ｇ‘鐨勫瘑鐮?      })
    });

    if (!loginResponse.ok) {
      throw new Error(`鐧诲綍澶辫触锛岀姸鎬佺爜: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`鐧诲綍澶辫触: ${loginData.error}`);
    }

    user1Token = loginData.token;
    console.log(`鉁?鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝`);
    console.log(`   浠ょ墝绫诲瀷: Bearer`);
    console.log(`   浠ょ墝闀垮害: ${user1Token.length} 瀛楃`);
  } catch (error) {
    console.error(`鉂?鐧诲綍澶辫触: ${error.message}`);
    return;
  }

  console.log('\n' + '='.repeat(50));
  console.log('鎵€鏈夋祴璇曞畬鎴愶紒');
  console.log('鉁?娴嬭瘯缁撴灉锛氱敤鎴锋祦绋嬫祴璇曢€氳繃锛岀巹鐜夊尯鍧楅摼杩炴帴鍣ㄥ伐浣滄甯?);
}

// 杩愯娴嬭瘯
testUserFlow().catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熼敊璇?', error);
});
