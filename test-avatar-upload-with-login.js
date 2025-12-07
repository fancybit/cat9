// 测试头像上传功能 - 带登录验证
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// 模拟一个简单的测试图片
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// 测试头像上传
async function testAvatarUpload() {
  try {
    // 1. 首先登录获取有效的JWT令牌
    console.log('开始登录...');
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('登录失败:', loginResponse.statusText);
      return;
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      console.error('登录失败，无法获取令牌:', loginData.error);
      return;
    }

    const token = loginData.token;
    console.log('登录成功，获取到令牌:', token);

    // 2. 使用获取到的令牌测试头像上传
    console.log('开始测试头像上传...');
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('avatar', testImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    // 发送请求
    const uploadResponse = await fetch('http://localhost:5000/api/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    // 打印响应状态码
    console.log('响应状态码:', uploadResponse.status);
    
    // 打印响应内容
    const responseData = await uploadResponse.json();
    console.log('响应内容:', JSON.stringify(responseData, null, 2));
    
    if (uploadResponse.ok && responseData.success) {
      console.log('头像上传测试成功！');
    } else {
      console.log('头像上传测试失败！');
    }
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testAvatarUpload();
