// 用户注册和登录测试脚本
const fetch = require('node-fetch');

// 测试配置
const API_BASE_URL = 'http://localhost:5000/api/users';

// 生成随机用户名
const generateRandomUsername = () => {
  return `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// 测试函数
async function testRegisterLogin() {
  console.log('开始用户注册和登录测试...');
  console.log('='.repeat(50));

  // 生成测试数据
  const testUsername = generateRandomUsername();
  const testEmail = `${testUsername}@example.com`;
  const testPassword = 'testpassword123';
  const testDisplayName = 'Test User';

  console.log('测试数据:');
  console.log(`   用户名: ${testUsername}`);
  console.log(`   邮箱: ${testEmail}`);
  console.log(`   密码: ${testPassword}`);
  console.log(`   显示名称: ${testDisplayName}`);

  // 测试1：注册新用户
  console.log('\n1. 测试注册新用户...');
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
      throw new Error(`注册失败，状态码: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`注册失败: ${registerData.error}`);
    }

    console.log(`✅ 注册成功，用户ID: ${registerData.user.id}`);
    console.log(`   用户名: ${registerData.user.username}`);
    console.log(`   显示名称: ${registerData.user.displayName}`);
    console.log(`   邮箱: ${registerData.user.email}`);
  } catch (error) {
    console.error(`❌ 注册失败: ${error.message}`);
    return;
  }

  // 测试2：使用新注册的用户登录
  console.log('\n2. 测试使用新注册的用户登录...');
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
      throw new Error(`登录失败，状态码: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    authToken = loginData.token;
    console.log(`✅ 登录成功，获取到令牌`);
    console.log(`   令牌类型: Bearer`);
    console.log(`   令牌长度: ${authToken.length} 字符`);
    console.log(`   用户名: ${loginData.user.username}`);
    console.log(`   显示名称: ${loginData.user.displayName}`);
    console.log(`   邮箱: ${loginData.user.email}`);
  } catch (error) {
    console.error(`❌ 登录失败: ${error.message}`);
    return;
  }

  // 测试3：使用获取到的令牌获取用户信息
  console.log('\n3. 测试使用获取到的令牌获取用户信息...');
  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error(`获取用户信息失败，状态码: ${userInfoResponse.status}`);
    }

    const userInfoData = await userInfoResponse.json();
    if (!userInfoData.success || !userInfoData.user) {
      throw new Error(`获取用户信息失败: ${userInfoData.error}`);
    }

    console.log(`✅ 获取用户信息成功`);
    console.log(`   用户名: ${userInfoData.user.username}`);
    console.log(`   显示名称: ${userInfoData.user.displayName}`);
    console.log(`   邮箱: ${userInfoData.user.email}`);
    console.log(`   用户ID: ${userInfoData.user.id}`);
    console.log(`   创建时间: ${userInfoData.user.createdAt}`);
  } catch (error) {
    console.error(`❌ 获取用户信息失败: ${error.message}`);
    return;
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ 测试结果：用户注册和登录流程测试通过！');
  console.log('✅ 玄玉区块链连接器工作正常！');
  console.log('✅ 测试账号信息：');
  console.log(`   用户名: ${testUsername}`);
  console.log(`   密码: ${testPassword}`);
  console.log(`   邮箱: ${testEmail}`);
}

// 运行测试
testRegisterLogin().catch(error => {
  console.error('测试过程中发生错误:', error);
});
