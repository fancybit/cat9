// 登录测试脚本 - 测试使用正确的用户名和密码登录
const fetch = require('node-fetch');

// 测试配置
const API_BASE_URL = 'http://localhost:5000/api/users';

// 测试函数
async function testLogin() {
  console.log('开始登录测试...');
  console.log('='.repeat(50));

  // 测试数据
  const testUsername = 'testuser_1765070810335_594';
  const testPassword = 'testpassword123';

  try {
    // 发送登录请求
    console.log(`\n测试使用用户名 "${testUsername}" 和密码 "${testPassword}" 登录...`);
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
      throw new Error(`登录失败，状态码: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('登录响应数据:', loginData);

    if (!loginData.success || !loginData.token) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    console.log(`✅ 登录成功，获取到令牌`);
    console.log(`   令牌类型: Bearer`);
    console.log(`   令牌长度: ${loginData.token.length} 字符`);
    console.log(`   用户名: ${loginData.user.username}`);
    console.log(`   显示名称: ${loginData.user.displayName}`);
    console.log(`   邮箱: ${loginData.user.email}`);

    // 测试使用获取到的令牌获取用户信息
    console.log('\n测试使用获取到的令牌获取用户信息...');
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error(`获取用户信息失败，状态码: ${userInfoResponse.status}`);
    }

    const userInfoData = await userInfoResponse.json();
    console.log('获取用户信息响应数据:', userInfoData);

    if (!userInfoData.success || !userInfoData.user) {
      throw new Error(`获取用户信息失败: ${userInfoData.error}`);
    }

    console.log(`✅ 获取用户信息成功`);
    console.log(`   用户名: ${userInfoData.user.username}`);
    console.log(`   显示名称: ${userInfoData.user.displayName}`);
    console.log(`   邮箱: ${userInfoData.user.email}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ 登录测试通过！');
    console.log('✅ 玄玉区块链连接器工作正常！');
    console.log('✅ 用户名和密码验证正常！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('❌ 登录错误详情:', error);
  }
}

// 运行测试
testLogin().catch(error => {
  console.error('测试过程中发生错误:', error);
});
