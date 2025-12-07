// 测试头像上传功能
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// 模拟一个简单的测试图片
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// 测试头像上传
async function testAvatarUpload() {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('avatar', testImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    // 发送请求
    const response = await fetch('http://localhost:5000/api/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzE3NjQ2OTcwNzc5MDIiLCJpYXQiOjE3NjQ2OTcwNzcsImV4cCI6MTc2NDc4MzQ3N30.4Qa6W5xQw7h8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6`
      },
      body: formData
    });

    // 打印响应状态码
    console.log('响应状态码:', response.status);
    
    // 打印响应内容
    const responseData = await response.json();
    console.log('响应内容:', JSON.stringify(responseData, null, 2));
    
    if (response.ok && responseData.success) {
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
