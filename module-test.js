// 简单测试模块加载

console.log('开始测试模块加载...');

try {
  const { MetaJadeNode } = require('./metajade-csharp/MetaJadeNode/nodejs');
  console.log('✓ 模块加载成功');
  console.log('✓ MetaJadeNode类:', typeof MetaJadeNode);
} catch (error) {
  console.error('模块加载失败:', error);
  console.error('错误详情:', error.stack);
}
