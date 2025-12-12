// 鐢ㄦ埛娉ㄥ唽鍜岀櫥褰曟祴璇曡剼鏈?const fetch = require('node-fetch');

// 娴嬭瘯閰嶇疆
const API_BASE_URL = 'http://localhost:5000/api/users';

// 鐢熸垚闅忔満鐢ㄦ埛鍚?const generateRandomUsername = () => {
  return `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// 娴嬭瘯鍑芥暟
async function testRegisterLogin() {
  console.log('寮€濮嬬敤鎴锋敞鍐屽拰鐧诲綍娴嬭瘯...');
  console.log('='.repeat(50));

  // 鐢熸垚娴嬭瘯鏁版嵁
  const testUsername = generateRandomUsername();
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword123';
  const testDisplayName = 'Test User';

  console.log('娴嬭瘯鏁版嵁:');
  console.log(`   鐢ㄦ埛鍚? ${testUsername}`);
  console.log(`   閭: ${testEmail}`);
  console.log(`   瀵嗙爜: ${testPassword}`);
  console.log(`   鏄剧ず鍚嶇О: ${testDisplayName}`);

  // 娴嬭瘯1锛氭敞鍐屾柊鐢ㄦ埛
  console.log('\n1. 娴嬭瘯娉ㄥ唽鏂扮敤鎴?..');
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: testPassword,
        displayName: testDisplayName
      })
    });

    if (!registerResponse.ok) {
      throw new Error(`娉ㄥ唽澶辫触锛岀姸鎬佺爜: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`娉ㄥ唽澶辫触: ${registerData.error}`);
    }

    console.log(`鉁?娉ㄥ唽鎴愬姛锛岀敤鎴稩D: ${registerData.user.id}`);
    console.log(`   鐢ㄦ埛鍚? ${registerData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${registerData.user.displayName}`);
    console.log(`   閭: ${registerData.user.email}`);
  } catch (error) {
    console.error(`鉂?娉ㄥ唽澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯2锛氫娇鐢ㄦ柊娉ㄥ唽鐨勭敤鎴风櫥褰?  console.log('\n2. 娴嬭瘯浣跨敤鏂版敞鍐岀殑鐢ㄦ埛鐧诲綍...');
  let authToken = null;
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`鐧诲綍澶辫触锛岀姸鎬佺爜: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`鐧诲綍澶辫触: ${loginData.error}`);
    }

    authToken = loginData.token;
    console.log(`鉁?鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝`);
    console.log(`   浠ょ墝绫诲瀷: Bearer`);
    console.log(`   浠ょ墝闀垮害: ${authToken.length} 瀛楃`);
    console.log(`   鐢ㄦ埛鍚? ${loginData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${loginData.user.displayName}`);
    console.log(`   閭: ${loginData.user.email}`);
  } catch (error) {
    console.error(`鉂?鐧诲綍澶辫触: ${error.message}`);
    return;
  }

  // 娴嬭瘯3锛氫娇鐢ㄨ幏鍙栧埌鐨勪护鐗岃幏鍙栫敤鎴蜂俊鎭?  console.log('\n3. 娴嬭瘯浣跨敤鑾峰彇鍒扮殑浠ょ墝鑾峰彇鐢ㄦ埛淇℃伅...');
  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
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
    console.log(`   鐢ㄦ埛ID: ${userInfoData.user.id}`);
    console.log(`   鍒涘缓鏃堕棿: ${userInfoData.user.createdAt}`);
  } catch (error) {
    console.error(`鉂?鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${error.message}`);
    return;
  }

  console.log('\n' + '='.repeat(50));
  console.log('鉁?娴嬭瘯缁撴灉锛氱敤鎴锋敞鍐屽拰鐧诲綍娴佺▼娴嬭瘯閫氳繃锛?);
  console.log('鉁?鐜勭帀鍖哄潡閾捐繛鎺ュ櫒宸ヤ綔姝ｅ父锛?);
  console.log('鉁?娴嬭瘯璐﹀彿淇℃伅锛?);
  console.log(`   鐢ㄦ埛鍚? ${testUsername}`);
  console.log(`   瀵嗙爜: ${testPassword}`);
  console.log(`   閭: ${testEmail}`);
}

// 杩愯娴嬭瘯
testRegisterLogin().catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熼敊璇?', error);
});
