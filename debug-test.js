// 璋冭瘯娴嬭瘯鑴氭湰

console.log('1. 寮€濮嬫祴璇?);

try {
  console.log('2. 灏濊瘯鍔犺浇DAL妯″潡');
  const dal = require('./server/dal');
  console.log('3. DAL妯″潡鍔犺浇鎴愬姛');
  
  console.log('4. 鍑嗗杩愯娴嬭瘯鍑芥暟');
  
  async function runTest() {
    console.log('5. 杩涘叆娴嬭瘯鍑芥暟');
    
    try {
      console.log('6. 灏濊瘯鍒濆鍖朌AL');
      await dal.initialize();
      console.log('7. DAL鍒濆鍖栨垚鍔?);
      
      console.log('8. 灏濊瘯鍒涘缓娴嬭瘯鐢ㄦ埛');
      const user = await dal.createUser({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        displayName: '娴嬭瘯鐢ㄦ埛'
      });
      console.log('9. 鐢ㄦ埛鍒涘缓鎴愬姛:', user.id);
      
      console.log('10. 灏濊瘯鑾峰彇鐢ㄦ埛淇℃伅');
      const retrievedUser = await dal.getUser(user.id);
      console.log('11. 鐢ㄦ埛淇℃伅鑾峰彇鎴愬姛:', retrievedUser.username);
      
      console.log('12. 灏濊瘯鍏抽棴DAL');
      await dal.close();
      console.log('13. DAL鍏抽棴鎴愬姛');
      
      console.log('14. 娴嬭瘯瀹屾垚');
    } catch (error) {
      console.error('娴嬭瘯鍑芥暟鍐呴儴閿欒:', error);
      console.error('閿欒鍫嗘爤:', error.stack);
    }
  }
  
  console.log('15. 璋冪敤娴嬭瘯鍑芥暟');
  runTest().catch(error => {
    console.error('娴嬭瘯鍑芥暟璋冪敤閿欒:', error);
    console.error('閿欒鍫嗘爤:', error.stack);
  });
  
  console.log('16. 娴嬭瘯鑴氭湰缁撴潫');
} catch (error) {
  console.error('椤剁骇閿欒:', error);
  console.error('閿欒鍫嗘爤:', error.stack);
}
