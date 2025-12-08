// 示例：使用MetaJadeNode SDK

const { MetaJadeNode } = require('./index');

async function main() {
  try {
    // 创建MetaJadeNode实例
    const metaJadeNode = new MetaJadeNode();
    
    console.log('=== MetaJadeNode SDK 示例 ===');
    
    // 1. 初始化并启动玄玉节点
    console.log('1. 初始化并启动玄玉节点...');
    const startResult = await metaJadeNode.start();
    console.log(`   启动结果: ${startResult}`);
    
    // 2. 获取玄玉节点状态
    console.log('2. 获取玄玉节点状态...');
    const status = await metaJadeNode.getStatus();
    console.log('   节点状态:', status);
    
    // 3. 存储数据到玄玉节点
    console.log('3. 存储数据到玄玉节点...');
    const storeResult = await metaJadeNode.store('test-key', 'Hello, MetaJade!');
    console.log(`   存储结果: ${storeResult}`);
    
    // 4. 从玄玉节点检索数据
    console.log('4. 从玄玉节点检索数据...');
    const retrievedValue = await metaJadeNode.retrieve('test-key');
    console.log(`   检索结果: ${retrievedValue}`);
    
    // 5. 查找提供特定键的节点
    console.log('\n5. 查找提供特定键的节点...');
    const providers = await metaJadeNode.findProviders('test-key');
    console.log(`   提供者数量: ${providers.length}`);
    
    // 6. 获取节点信息
    console.log('\n6. 获取节点信息...');
    const peerId = await metaJadeNode.getPeerId();
    const multiaddrs = await metaJadeNode.getMultiaddrs();
    const connectionCount = await metaJadeNode.getConnectionCount();
    console.log(`   Peer ID: ${peerId}`);
    console.log(`   多地址: ${multiaddrs.join(', ')}`);
    console.log(`   连接数: ${connectionCount}`);
    
    // 7. 停止玄玉节点
    console.log('7. 停止玄玉节点...');
    const stopResult = await metaJadeNode.stop();
    console.log(`   停止结果: ${stopResult}`);
    
    console.log('\n=== 示例结束 ===');
    
  } catch (error) {
    console.error('示例执行失败:', error.message);
    process.exit(1);
  }
}

// 运行示例
main();