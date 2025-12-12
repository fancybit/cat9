// 鐧诲綍娴嬭瘯鑴氭湰 - 娴嬭瘯浣跨敤姝ｇ‘鐨勭敤鎴峰悕鍜屽瘑鐮佺櫥褰?const fetch = require('node-fetch');

// 娴嬭瘯閰嶇疆
const API_BASE_URL = 'http://localhost:5000/api/users';

// 娴嬭瘯鍑芥暟
async function testLogin() {
  console.log('寮€濮嬬櫥褰曟祴璇?..');
  console.log('='.repeat(50));

  // 娴嬭瘯鏁版嵁
  const testUsername = 'testuser_1765070810335_594';
  const testPassword = 'testpassword123';

  try {
    // 鍙戦€佺櫥褰曡姹?    console.log(`\n娴嬭瘯浣跨敤鐢ㄦ埛鍚?"${testUsername}" 鍜屽瘑鐮?"${testPassword}" 鐧诲綍...`);
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
    console.log('鐧诲綍鍝嶅簲鏁版嵁:', loginData);

    if (!loginData.success || !loginData.token) {
      throw new Error(`鐧诲綍澶辫触: ${loginData.error}`);
    }

    console.log(`鉁?鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝`);
    console.log(`   浠ょ墝绫诲瀷: Bearer`);
    console.log(`   浠ょ墝闀垮害: ${loginData.token.length} 瀛楃`);
    console.log(`   鐢ㄦ埛鍚? ${loginData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${loginData.user.displayName}`);
    console.log(`   閭: ${loginData.user.email}`);

    // 娴嬭瘯浣跨敤鑾峰彇鍒扮殑浠ょ墝鑾峰彇鐢ㄦ埛淇℃伅
    console.log('\n娴嬭瘯浣跨敤鑾峰彇鍒扮殑浠ょ墝鑾峰彇鐢ㄦ埛淇℃伅...');
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触锛岀姸鎬佺爜: ${userInfoResponse.status}`);
    }

    const userInfoData = await userInfoResponse.json();
    console.log('鑾峰彇鐢ㄦ埛淇℃伅鍝嶅簲鏁版嵁:', userInfoData);

    if (!userInfoData.success || !userInfoData.user) {
      throw new Error(`鑾峰彇鐢ㄦ埛淇℃伅澶辫触: ${userInfoData.error}`);
    }

    console.log(`鉁?鑾峰彇鐢ㄦ埛淇℃伅鎴愬姛`);
    console.log(`   鐢ㄦ埛鍚? ${userInfoData.user.username}`);
    console.log(`   鏄剧ず鍚嶇О: ${userInfoData.user.displayName}`);
    console.log(`   閭: ${userInfoData.user.email}`);

    console.log('\n' + '='.repeat(50));
    console.log('鉁?鐧诲綍娴嬭瘯閫氳繃锛?);
    console.log('鉁?鐜勭帀鍖哄潡閾捐繛鎺ュ櫒宸ヤ綔姝ｅ父锛?);
    console.log('鉁?鐢ㄦ埛鍚嶅拰瀵嗙爜楠岃瘉姝ｅ父锛?);
  } catch (error) {
    console.error('\n鉂?娴嬭瘯澶辫触:', error.message);
    console.error('鉂?鐧诲綍閿欒璇︽儏:', error);
  }
}

// 杩愯娴嬭瘯
testLogin().catch(error => {
  console.error('娴嬭瘯杩囩▼涓彂鐢熼敊璇?', error);
});
