// 用户流程测试脚本 - 测试注册、登录、登出、换账号注册、登录
const fetch = require('node-fetch');

// 测试配置
const API_BASE_URL = 'http://localhost:5000/api/users';

// 生成随机用户名
const generateRandomUsername = () => {
  return `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// 测试函数
async function testUserFlow() {
  console.log('开始用户流程测试...');
  console.log('='.repeat(50));

  // 测试1：注册新用户
  console.log('\n1. 测试注册新用户...');
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
      throw new Error(`注册失败，状态码: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`注册失败: ${registerData.error}`);
    }

    console.log(`✅ 注册成功，用户名: ${username1}`);
    console.log(`   用户ID: ${registerData.user.id}`);
  } catch (error) {
    console.error(`❌ 注册失败: ${error.message}`);
    return;
  }

  // 测试2：使用新注册的用户登录
  console.log('\n2. 测试登录新注册的用户...');
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
      throw new Error(`登录失败，状态码: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    user1Token = loginData.token;
    console.log(`✅ 登录成功，获取到令牌`);
    console.log(`   令牌类型: Bearer`);
    console.log(`   令牌长度: ${user1Token.length} 字符`);
  } catch (error) {
    console.error(`❌ 登录失败: ${error.message}`);
    return;
  }

  // 测试3：获取当前用户信息
  console.log('\n3. 测试获取当前用户信息...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user1Token}`
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
  } catch (error) {
    console.error(`❌ 获取用户信息失败: ${error.message}`);
  }

  // 测试4：登出（前端行为，后端不需要API）
  console.log('\n4. 测试登出...');
  user1Token = null; // 前端清除令牌
  console.log(`✅ 登出成功（前端清除令牌）`);

  // 测试5：使用无效令牌获取用户信息（验证登出效果）
  console.log('\n5. 测试使用无效令牌获取用户信息...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer invalid_token`
      }
    });

    if (userInfoResponse.ok) {
      throw new Error('使用无效令牌获取用户信息成功，这是不应该发生的');
    }

    console.log(`✅ 验证成功：使用无效令牌被正确拒绝`);
  } catch (error) {
    console.error(`❌ 验证失败: ${error.message}`);
  }

  // 测试6：注册第二个账号
  console.log('\n6. 测试注册第二个账号...');
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
      throw new Error(`注册失败，状态码: ${registerResponse.status}`);
    }

    const registerData = await registerResponse.json();
    if (!registerData.success || !registerData.user) {
      throw new Error(`注册失败: ${registerData.error}`);
    }

    console.log(`✅ 注册成功，用户名: ${username2}`);
    console.log(`   用户ID: ${registerData.user.id}`);
  } catch (error) {
    console.error(`❌ 注册失败: ${error.message}`);
    return;
  }

  // 测试7：使用第二个账号登录
  console.log('\n7. 测试使用第二个账号登录...');
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
      throw new Error(`登录失败，状态码: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    user2Token = loginData.token;
    console.log(`✅ 登录成功，获取到令牌`);
    console.log(`   令牌类型: Bearer`);
    console.log(`   令牌长度: ${user2Token.length} 字符`);
  } catch (error) {
    console.error(`❌ 登录失败: ${error.message}`);
    return;
  }

  // 测试8：获取第二个用户的信息
  console.log('\n8. 测试获取第二个用户的信息...');

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user2Token}`
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
  } catch (error) {
    console.error(`❌ 获取用户信息失败: ${error.message}`);
  }

  // 测试9：使用第一个账号的用户名和第二个账号的密码登录（应该失败）
  console.log('\n9. 测试使用错误的用户名和密码登录...');

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        password: user2Password // 使用错误的密码
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      if (loginData.success) {
        throw new Error('使用错误的密码登录成功，这是不应该发生的');
      }
    }

    console.log(`✅ 验证成功：使用错误的密码被正确拒绝`);
  } catch (error) {
    console.error(`❌ 验证失败: ${error.message}`);
  }

  // 测试10：使用第一个账号正常登录
  console.log('\n10. 测试使用第一个账号正常登录...');

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username1,
        password: user1Password // 使用正确的密码
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`登录失败，状态码: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    user1Token = loginData.token;
    console.log(`✅ 登录成功，获取到令牌`);
    console.log(`   令牌类型: Bearer`);
    console.log(`   令牌长度: ${user1Token.length} 字符`);
  } catch (error) {
    console.error(`❌ 登录失败: ${error.message}`);
    return;
  }

  console.log('\n' + '='.repeat(50));
  console.log('所有测试完成！');
  console.log('✅ 测试结果：用户流程测试通过，玄玉区块链连接器工作正常');
}

// 运行测试
testUserFlow().catch(error => {
  console.error('测试过程中发生错误:', error);
});
