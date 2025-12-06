// 简单测试玄玉区块链网络集成

const dal = require('./server/dal');

async function testBasicFunctionality() {
  console.log('开始测试玄玉区块链网络集成的基本功能...');
  
  try {
    // 初始化DAL
    console.log('1. 初始化DAL层...');
    await dal.initialize();
    console.log('✓ DAL层初始化成功');
    
    // 创建一个简单的测试用户
    console.log('\n2. 创建测试用户...');
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: '测试用户'
    };
    
    const user = await dal.createUser(userData);
    console.log('✓ 用户创建成功:', user.id);
    
    // 获取用户信息
    console.log('\n3. 获取用户信息...');
    const retrievedUser = await dal.getUser(user.id);
    console.log('✓ 用户信息获取成功:', retrievedUser.username);
    
    // 创建一个简单的测试游戏
    console.log('\n4. 创建测试游戏...');
    const gameData = {
      name: '测试游戏',
      description: '这是一个测试游戏',
      category: '休闲',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game'
    };
    
    const game = await dal.createGame(gameData);
    console.log('✓ 游戏创建成功:', game.id);
    
    // 获取游戏信息
    console.log('\n5. 获取游戏信息...');
    const retrievedGame = await dal.getGameById(game.id);
    console.log('✓ 游戏信息获取成功:', retrievedGame.name);
    
    // 关闭DAL
    console.log('\n6. 关闭DAL层...');
    await dal.close();
    console.log('✓ DAL层关闭成功');
    
    console.log('\n=== 所有测试通过！===');
    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

// 运行测试
testBasicFunctionality().catch(error => {
  console.error('测试过程中发生错误:', error);
});
