// 娴嬭瘯澶村儚涓婁紶鍔熻兘 - 甯︾敤鎴锋敞鍐?const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// 妯℃嫙涓€涓畝鍗曠殑娴嬭瘯鍥剧墖
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// 鐢熸垚闅忔満鐢ㄦ埛鍚?const randomUsername = `testuser_${Date.now()}`;

// 娴嬭瘯澶村儚涓婁紶
async function testAvatarUpload() {
  try {
    // 1. 棣栧厛娉ㄥ唽涓€涓柊鐢ㄦ埛
    console.log('寮€濮嬫敞鍐屾柊鐢ㄦ埛...');
    const registerResponse = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: randomUsername,
        email: `${randomUsername}@example.com`,
        password: 'testpassword123',
        displayName: 'Test User'
      })
    });

    if (!registerResponse.ok) {
      console.error('娉ㄥ唽澶辫触:', registerResponse.statusText);
      return;
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      console.error('娉ㄥ唽澶辫触:', registerData.error);
      return;
    }

    console.log('娉ㄥ唽鎴愬姛锛岀敤鎴蜂俊鎭?', registerData.user);

    // 2. 浣跨敤鏂版敞鍐岀殑鐢ㄦ埛鐧诲綍
    console.log('寮€濮嬬櫥褰?..');
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: randomUsername,
        password: 'testpassword123'
      })
    });

    if (!loginResponse.ok) {
      console.error('鐧诲綍澶辫触:', loginResponse.statusText);
      return;
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      console.error('鐧诲綍澶辫触锛屾棤娉曡幏鍙栦护鐗?', loginData.error);
      return;
    }

    const token = loginData.token;
    console.log('鐧诲綍鎴愬姛锛岃幏鍙栧埌浠ょ墝:', token);

    // 3. 浣跨敤鑾峰彇鍒扮殑浠ょ墝娴嬭瘯澶村儚涓婁紶
    console.log('寮€濮嬫祴璇曞ご鍍忎笂浼?..');
    
    // 鍒涘缓FormData瀵硅薄
    const formData = new FormData();
    formData.append('avatar', testImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    // 鍙戦€佽姹?    const uploadResponse = await fetch('http://localhost:5000/api/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    // 鎵撳嵃鍝嶅簲鐘舵€佺爜
    console.log('鍝嶅簲鐘舵€佺爜:', uploadResponse.status);
    
    // 鎵撳嵃鍝嶅簲鍐呭
    const responseData = await uploadResponse.json();
    console.log('鍝嶅簲鍐呭:', JSON.stringify(responseData, null, 2));
    
    if (uploadResponse.ok && responseData.success) {
      console.log('澶村儚涓婁紶娴嬭瘯鎴愬姛锛?);
      console.log('澶村儚URL:', responseData.avatarUrl);
    } else {
      console.log('澶村儚涓婁紶娴嬭瘯澶辫触锛?);
    }
  } catch (error) {
    console.error('娴嬭瘯杩囩▼涓嚭閿?', error);
  }
}

// 杩愯娴嬭瘯
testAvatarUpload();
