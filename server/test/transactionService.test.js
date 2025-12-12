// 交易服务单元测试

const transactionService = require('../services/transactionService');
const dal = require('../dal');

describe('交易服务测试', () => {
  beforeEach(async () => {
    // 初始化DAL层
    await dal.initialize();
  });

  afterEach(async () => {
    // 关闭DAL层
    await dal.close();
  });

  test('创建交易', async () => {
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const result = await transactionService.createTransaction(transactionData);
    expect(result.success).toBe(true);
    expect(result.transaction).toBeDefined();
    expect(result.transaction.amount).toBe(transactionData.amount);
    expect(result.transaction.type).toBe(transactionData.type);
  });

  test('执行交易', async () => {
    // 先创建一个交易
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const createResult = await transactionService.createTransaction(transactionData);
    
    // 然后执行交易
    const executeResult = await transactionService.executeTransaction(createResult.transaction.id);
    expect(executeResult.success).toBe(true);
    expect(executeResult.transaction.status).toBe('completed');
  });

  test('获取交易详情', async () => {
    // 先创建一个交易
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const createResult = await transactionService.createTransaction(transactionData);
    
    // 然后获取交易详情
    const transactionDetails = await transactionService.getTransactionDetails(createResult.transaction.id);
    expect(transactionDetails).toBeDefined();
    expect(transactionDetails.id).toBe(createResult.transaction.id);
    expect(transactionDetails.amount).toBe(transactionData.amount);
  });

  test('获取用户交易记录', async () => {
    // 先创建一个测试用户
    const user = await dal.createUser({
      username: 'transactionuser',
      email: 'transaction@example.com',
      passwordHash: 'hashedpassword',
      displayName: '交易记录用户'
    });
    
    // 然后获取用户交易记录
    const transactions = await transactionService.getUserTransactions(user.id);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });

  test('转账功能', async () => {
    // 先创建两个测试用户
    const user1 = await dal.createUser({
      username: 'fromuser',
      email: 'from@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '转出用户',
      wallet: { balance: 200 }
    });
    
    const user2 = await dal.createUser({
      username: 'touser',
      email: 'to@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '转入用户',
      wallet: { balance: 0 }
    });
    
    // 然后进行转账
    const transferResult = await transactionService.transferCoins(user1.id, user2.id, 100, '测试转账');
    expect(transferResult.success).toBe(true);
    
    // 验证转账结果
    const user1Balance = await transactionService.getUserBalance(user1.id);
    const user2Balance = await transactionService.getUserBalance(user2.id);
    expect(user1Balance).toBe(100); // 200 - 100 = 100
    expect(user2Balance).toBe(100); // 0 + 100 = 100
  });

  test('奖励功能', async () => {
    // 先创建一个测试用户
    const user = await dal.createUser({
      username: 'rewarduser',
      email: 'reward@example.com',
      passwordHash: 'hashedpassword',
      displayName: '奖励用户',
      wallet: { balance: 0 }
    });
    
    // 然后进行奖励
    const rewardResult = await transactionService.rewardCoins(user.id, 100, '测试奖励');
    expect(rewardResult.success).toBe(true);
    
    // 验证奖励结果
    const userBalance = await transactionService.getUserBalance(user.id);
    expect(userBalance).toBe(100); // 0 + 100 = 100
  });

  test('获取用户余额', async () => {
    // 先创建一个测试用户
    const user = await dal.createUser({
      username: 'balanceuser',
      email: 'balance@example.com',
      passwordHash: 'hashedpassword',
      displayName: '余额用户',
      wallet: { balance: 500 }
    });
    
    // 然后获取用户余额
    const balance = await transactionService.getUserBalance(user.id);
    expect(balance).toBe(500);
  });

  test('批量获取交易详情', async () => {
    // 先创建两个交易
    const transactionData1 = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账1'
    };
    
    const transactionData2 = {
      fromUserId: 'user2',
      toUserId: 'user1',
      amount: 50,
      type: 'transfer',
      description: '测试转账2'
    };
    
    const createResult1 = await transactionService.createTransaction(transactionData1);
    const createResult2 = await transactionService.createTransaction(transactionData2);
    
    // 然后批量获取交易详情
    const transactionIds = [createResult1.transaction.id, createResult2.transaction.id];
    const transactions = await transactionService.getBatchTransactions(transactionIds);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBe(2);
  });
});