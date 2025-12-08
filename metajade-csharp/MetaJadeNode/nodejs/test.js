// 测试：MetaJadeNode SDK

const { MetaJadeNode } = require('./index');

async function testSDK() {
  console.log('=== 测试 MetaJadeNode SDK ===\n');
  
  // 创建MetaJadeNode实例
  const metaJadeNode = new MetaJadeNode();
  
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // 测试函数
  async function runTest(testName, testFn) {
    testResults.total++;
    console.log(`测试 ${testResults.total}: ${testName}`);
    
    try {
      await testFn();
      console.log(`   ✅ 通过`);
      testResults.passed++;
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
      testResults.failed++;
    }
    
    console.log('');
  }
  
  // 测试1: 初始化并启动玄玉节点
  await runTest('初始化并启动玄玉节点', async () => {
    const result = await metaJadeNode.start();
    if (!result) {
      throw new Error('启动失败');
    }
  });
  
  // 测试2: 获取玄玉节点状态
  await runTest('获取玄玉节点状态', async () => {
    const status = await metaJadeNode.getStatus();
    if (!status) {
      throw new Error('获取状态失败');
    }
  });
  
  // 测试3: 存储数据到玄玉节点
  await runTest('存储数据到玄玉节点', async () => {
    const result = await metaJadeNode.store('test-key', 'Hello, MetaJade!');
    if (!result) {
      throw new Error('存储失败');
    }
  });
  
  // 测试4: 从玄玉节点检索数据
  await runTest('从玄玉节点检索数据', async () => {
    const value = await metaJadeNode.retrieve('test-key');
    if (value !== 'Hello, MetaJade!') {
      throw new Error('检索失败，结果不符合预期');
    }
  });
  
  // 测试5: 查找提供特定键的节点
  await runTest('查找提供特定键的节点', async () => {
    await metaJadeNode.findProviders('test-key');
  });
  
  // 测试6: 获取节点的Peer ID
  await runTest('获取节点的Peer ID', async () => {
    await metaJadeNode.getPeerId();
  });
  
  // 测试7: 获取节点的多地址列表
  await runTest('获取节点的多地址列表', async () => {
    await metaJadeNode.getMultiaddrs();
  });
  
  // 测试8: 获取节点的连接数
  await runTest('获取节点的连接数', async () => {
    await metaJadeNode.getConnectionCount();
  });
  
  // 测试9: 获取节点的路由表大小
  await runTest('获取节点的路由表大小', async () => {
    await metaJadeNode.getRoutingTableSize();
  });
  
  // 测试10: 停止玄玉节点
  await runTest('停止玄玉节点', async () => {
    const result = await metaJadeNode.stop();
    if (!result) {
      throw new Error('停止失败');
    }
  });
  
  // 输出测试结果
  console.log('=== 测试结果 ===');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`通过: ${testResults.passed}`);
  console.log(`失败: ${testResults.failed}`);
  console.log(`通过率: ${(testResults.passed / testResults.total * 100).toFixed(2)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n✅ 所有测试通过！');
  } else {
    console.log('\n❌ 部分测试失败！');
    process.exit(1);
  }
}

// 运行测试
testSDK();