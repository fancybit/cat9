// 用户服务单元测试

const userService = require('../services/userService');
const dal = require('../dal');

describe('用户服务测试', () => {
  beforeEach(async () => {
    // 初始化DAL层
    await dal.initialize();
  });

  afterEach(async () => {
    // 关闭DAL层
    await dal.close();
  });

  test('用户注册', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      displayName: '测试用户'
    };
    
    const result = await userService.register(userData);
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe(userData.username);
    expect(result.user.email).toBe(userData.email);
  });

  test('用户登录', async () => {
    // 先注册一个用户
    const userData = {
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123',
      displayName: '登录测试用户'
    };
    
    await userService.register(userData);
    
    // 然后测试登录
    const loginResult = await userService.login(userData.username, userData.password);
    expect(loginResult.success).toBe(true);
    expect(loginResult.token).toBeDefined();
    expect(loginResult.user).toBeDefined();
    expect(loginResult.user.username).toBe(userData.username);
  });

  test('获取用户信息', async () => {
    // 先注册一个用户
    const userData = {
      username: 'infouser',
      email: 'info@example.com',
      password: 'password123',
      displayName: '信息测试用户'
    };
    
    const registerResult = await userService.register(userData);
    
    // 然后获取用户信息
    const userInfo = await userService.getUserInfo(registerResult.user.id);
    expect(userInfo).toBeDefined();
    expect(userInfo.username).toBe(userData.username);
    expect(userInfo.displayName).toBe(userData.displayName);
  });

  test('更新用户信息', async () => {
    // 先注册一个用户
    const userData = {
      username: 'updateuser',
      email: 'update@example.com',
      password: 'password123',
      displayName: '更新测试用户'
    };
    
    const registerResult = await userService.register(userData);
    
    // 然后更新用户信息
    const updateData = {
      displayName: '更新后的测试用户',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const updateResult = await userService.updateUserInfo(registerResult.user.id, updateData);
    expect(updateResult.success).toBe(true);
    expect(updateResult.user.displayName).toBe(updateData.displayName);
    expect(updateResult.user.avatar).toBe(updateData.avatar);
  });

  test('获取用户钱包信息', async () => {
    // 先注册一个用户
    const userData = {
      username: 'walletuser',
      email: 'wallet@example.com',
      password: 'password123',
      displayName: '钱包测试用户'
    };
    
    const registerResult = await userService.register(userData);
    
    // 然后获取用户钱包信息
    const wallet = await userService.getUserWallet(registerResult.user.id);
    expect(wallet).toBeDefined();
    expect(wallet.balance).toBe(0);
  });

  test('获取用户交易记录', async () => {
    // 先注册一个用户
    const userData = {
      username: 'transactionuser',
      email: 'transaction@example.com',
      password: 'password123',
      displayName: '交易记录测试用户'
    };
    
    const registerResult = await userService.register(userData);
    
    // 然后获取用户交易记录
    const transactions = await userService.getUserTransactions(registerResult.user.id);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });
});