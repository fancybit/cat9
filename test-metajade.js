const { MetaJadeNode } = require('./metajade-csharp/MetaJadeNode/nodejs');

async function testMetaJadeNode() {
    console.log('开始测试玄玉节点连接...');
    
    try {
        // 创建MetaJadeNode实例
        const metaJadeNode = new MetaJadeNode({
            host: 'localhost',
            port: 5000
        });
        
        // 测试获取状态
        console.log('测试获取节点状态...');
        const status = await metaJadeNode.getStatus();
        console.log('节点状态:', status);
        
        // 测试存储数据
        console.log('测试存储数据...');
        const storeResult = await metaJadeNode.store('test-key', 'test-value');
        console.log('存储数据结果:', storeResult);
        
        // 测试检索数据
        console.log('测试检索数据...');
        const retrieveResult = await metaJadeNode.retrieve('test-key');
        console.log('检索数据结果:', retrieveResult);
        
        // 测试获取文件列表
        console.log('测试获取文件列表...');
        const files = await metaJadeNode.getFiles();
        console.log('文件列表:', files);
        
        // 测试获取好友列表
        console.log('测试获取好友列表...');
        const friends = await metaJadeNode.getFriends();
        console.log('好友列表:', friends);
        
        console.log('所有测试完成，玄玉节点连接正常！');
    } catch (error) {
        console.error('测试失败:', error.message);
        console.error(error.stack);
    }
}

testMetaJadeNode();