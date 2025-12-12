// 娴嬭瘯澶村儚涓婁紶鍔熻兘
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// 妯℃嫙涓€涓畝鍗曠殑娴嬭瘯鍥剧墖
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// 娴嬭瘯澶村儚涓婁紶
async function testAvatarUpload() {
  try {
    // 鍒涘缓FormData瀵硅薄
    const formData = new FormData();
    formData.append('avatar', testImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    // 鍙戦€佽姹?    const response = await fetch('http://localhost:5000/api/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzE3NjQ2OTcwNzc5MDIiLCJpYXQiOjE3NjQ2OTcwNzcsImV4cCI6MTc2NDc4MzQ3N30.4Qa6W5xQw7h8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6`
      },
      body: formData
    });

    // 鎵撳嵃鍝嶅簲鐘舵€佺爜
    console.log('鍝嶅簲鐘舵€佺爜:', response.status);
    
    // 鎵撳嵃鍝嶅簲鍐呭
    const responseData = await response.json();
    console.log('鍝嶅簲鍐呭:', JSON.stringify(responseData, null, 2));
    
    if (response.ok && responseData.success) {
      console.log('澶村儚涓婁紶娴嬭瘯鎴愬姛锛?);
    } else {
      console.log('澶村儚涓婁紶娴嬭瘯澶辫触锛?);
    }
  } catch (error) {
    console.error('娴嬭瘯杩囩▼涓嚭閿?', error);
  }
}

// 杩愯娴嬭瘯
testAvatarUpload();
