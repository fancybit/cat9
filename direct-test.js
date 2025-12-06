// 直接测试MetaJadeHome客户端

const { MetaJadeHome } = require('./metajade-csharp/nodejs');

async function testMetaJadeClient() {
  console.log('开始测试MetaJadeHome客户端...');
  
  try {
    // 创建客户端实例
    const metaJadeHome = new MetaJadeHome();
    console.log('✓ MetaJadeHome客户端创建成功');
    
    // 初始化DHT服务器
    console.log('\n初始化DHT服务器...');
    await metaJadeHome.start();
    console.log('✓ DHT服务器初始化成功');
    
    // 存储一些测试数据
    console.log('\n存储测试数据...');
    const testKey = 'test_key';
    const testValue = JSON.stringify({ message: 'Hello, MetaJade!' });
    await metaJadeHome.store(testKey, testValue);
    console.log('✓ 测试数据存储成功');
    
    // 检索测试数据
    console.log('\n检索测试数据...');
    const retrievedValue = await metaJadeHome.retrieve(testKey);
    console.log('✓ 测试数据检索成功:', JSON.parse(retrievedValue).message);
    
    // 停止DHT服务器
    console.log('\n停止DHT服务器...');
    await metaJadeHome.stop();
    console.log('✓ DHT服务器停止成功');
    
    console.log('\n=== 所有测试通过！===');
    return true;
  } catch (error) {
    console.error('测试失败:', error);
    console.error('错误详情:', error.stack);
    return false;
  }
}

// 运行测试
testMetaJadeClient().catch(error => {
  console.error('测试过程中发生错误:', error);
});
