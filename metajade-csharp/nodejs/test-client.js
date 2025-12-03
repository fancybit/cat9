// 简单的测试脚本，用于验证 Node.js 客户端能否连接到 C# gRPC 服务

import { MetaJadeHome } from './index.js';

// 添加超时机制
const withTimeout = (promise, timeout = 5000, timeoutMsg = '操作超时') => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMsg)), timeout);
    })
  ]);
};

async function testClient() {
  console.log('正在测试 Node.js 客户端连接到 C# gRPC 服务...');
  
  try {
    // 创建客户端实例
    const metaJadeHome = new MetaJadeHome();
    
    console.log('1. 初始化 DHT 服务器...');
    await withTimeout(metaJadeHome.start(), 3000, '初始化超时');
    console.log('✓ DHT 服务器初始化成功');
    
    console.log('2. 获取服务器状态...');
    const status = {
      peerId: await withTimeout(metaJadeHome.getPeerId(), 3000, '获取 PeerId 超时'),
      multiaddrs: await withTimeout(metaJadeHome.getMultiaddrs(), 3000, '获取 Multiaddrs 超时'),
      connectionCount: await withTimeout(metaJadeHome.getConnectionCount(), 3000, '获取连接数超时'),
      routingTableSize: await withTimeout(metaJadeHome.getRoutingTableSize(), 3000, '获取路由表大小超时')
    };
    console.log('✓ 获取服务器状态成功:', status);
    
    console.log('3. 测试数据存储...');
    await withTimeout(metaJadeHome.store('test-key', 'test-value'), 3000, '存储数据超时');
    console.log('✓ 数据存储成功');
    
    console.log('4. 测试数据检索...');
    const value = await withTimeout(metaJadeHome.retrieve('test-key'), 3000, '检索数据超时');
    console.log('✓ 数据检索成功，值为:', value);
    
    console.log('5. 测试提供数据...');
    await withTimeout(metaJadeHome.provide('test-key'), 3000, '提供数据超时');
    console.log('✓ 提供数据成功');
    
    console.log('6. 测试查找节点...');
    await withTimeout(metaJadeHome.findPeer('test-peer-id'), 3000, '查找节点超时');
    console.log('✓ 查找节点成功');
    
    console.log('7. 停止 DHT 服务器...');
    await withTimeout(metaJadeHome.stop(), 3000, '停止服务器超时');
    console.log('✓ DHT 服务器停止成功');
    
    console.log('\n🎉 所有测试通过！Node.js 客户端能够成功连接到 C# gRPC 服务。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('错误详情:', error.stack);
  }
}

// 运行测试
testClient();
