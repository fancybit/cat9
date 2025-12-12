// 鐢ㄦ埛鏈嶅姟鍗曞厓娴嬭瘯

const userService = require('../services/userService');
const dal = require('../dal');

describe('鐢ㄦ埛鏈嶅姟娴嬭瘯', () => {
  beforeEach(async () => {
    // 鍒濆鍖朌AL灞?    await dal.initialize();
  });

  afterEach(async () => {
    // 鍏抽棴DAL灞?    await dal.close();
  });

  test('鐢ㄦ埛娉ㄥ唽', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      displayName: '娴嬭瘯鐢ㄦ埛'
    };
    
    const result = await userService.register(userData);
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe(userData.username);
    expect(result.user.email).toBe(userData.email);
  });

  test('鐢ㄦ埛鐧诲綍', async () => {
    // 鍏堟敞鍐屼竴涓敤鎴?    const userData = {
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123',
      displayName: '鐧诲綍娴嬭瘯鐢ㄦ埛'
    };
    
    await userService.register(userData);
    
    // 鐒跺悗灏濊瘯鐧诲綍
    const loginResult = await userService.login(userData.username, userData.password);
    expect(loginResult.success).toBe(true);
    expect(loginResult.token).toBeDefined();
    expect(loginResult.user).toBeDefined();
    expect(loginResult.user.username).toBe(userData.username);
  });

  test('鑾峰彇鐢ㄦ埛淇℃伅', async () => {
    // 鍏堟敞鍐屼竴涓敤鎴?    const userData = {
      username: 'infouser',
      email: 'info@example.com',
      password: 'password123',
      displayName: '淇℃伅娴嬭瘯鐢ㄦ埛'
    };
    
    const registerResult = await userService.register(userData);
    
    // 鐒跺悗鑾峰彇鐢ㄦ埛淇℃伅
    const userInfo = await userService.getUserInfo(registerResult.user.id);
    expect(userInfo).toBeDefined();
    expect(userInfo.username).toBe(userData.username);
    expect(userInfo.displayName).toBe(userData.displayName);
  });

  test('鏇存柊鐢ㄦ埛淇℃伅', async () => {
    // 鍏堟敞鍐屼竴涓敤鎴?    const userData = {
      username: 'updateuser',
      email: 'update@example.com',
      password: 'password123',
      displayName: '鏇存柊娴嬭瘯鐢ㄦ埛'
    };
    
    const registerResult = await userService.register(userData);
    
    // 鐒跺悗鏇存柊鐢ㄦ埛淇℃伅
    const updateData = {
      displayName: '鏇存柊鍚庣殑娴嬭瘯鐢ㄦ埛',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const updateResult = await userService.updateUserInfo(registerResult.user.id, updateData);
    expect(updateResult.success).toBe(true);
    expect(updateResult.user.displayName).toBe(updateData.displayName);
    expect(updateResult.user.avatar).toBe(updateData.avatar);
  });

  test('鑾峰彇鐢ㄦ埛閽卞寘淇℃伅', async () => {
    // 鍏堟敞鍐屼竴涓敤鎴?    const userData = {
      username: 'walletuser',
      email: 'wallet@example.com',
      password: 'password123',
      displayName: '閽卞寘娴嬭瘯鐢ㄦ埛'
    };
    
    const registerResult = await userService.register(userData);
    
    // 鐒跺悗鑾峰彇鐢ㄦ埛閽卞寘淇℃伅
    const wallet = await userService.getUserWallet(registerResult.user.id);
    expect(wallet).toBeDefined();
    expect(wallet.balance).toBe(0);
  });

  test('鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍', async () => {
    // 鍏堟敞鍐屼竴涓敤鎴?    const userData = {
      username: 'transactionuser',
      email: 'transaction@example.com',
      password: 'password123',
      displayName: '浜ゆ槗璁板綍娴嬭瘯鐢ㄦ埛'
    };
    
    const registerResult = await userService.register(userData);
    
    // 鐒跺悗鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    const transactions = await userService.getUserTransactions(registerResult.user.id);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });
});
