// 调试测试脚本

console.log('1. 开始测试');

try {
  console.log('2. 尝试加载DAL模块');
  const dal = require('./server/dal');
  console.log('3. DAL模块加载成功');
  
  console.log('4. 准备运行测试函数');
  
  async function runTest() {
    console.log('5. 进入测试函数');
    
    try {
      console.log('6. 尝试初始化DAL');
      await dal.initialize();
      console.log('7. DAL初始化成功');
      
      console.log('8. 尝试创建测试用户');
      const user = await dal.createUser({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        displayName: '测试用户'
      });
      console.log('9. 用户创建成功:', user.id);
      
      console.log('10. 尝试获取用户信息');
      const retrievedUser = await dal.getUser(user.id);
      console.log('11. 用户信息获取成功:', retrievedUser.username);
      
      console.log('12. 尝试关闭DAL');
      await dal.close();
      console.log('13. DAL关闭成功');
      
      console.log('14. 测试完成');
    } catch (error) {
      console.error('测试函数内部错误:', error);
      console.error('错误堆栈:', error.stack);
    }
  }
  
  console.log('15. 调用测试函数');
  runTest().catch(error => {
    console.error('测试函数调用错误:', error);
    console.error('错误堆栈:', error.stack);
  });
  
  console.log('16. 测试脚本结束');
} catch (error) {
  console.error('顶级错误:', error);
  console.error('错误堆栈:', error.stack);
}
