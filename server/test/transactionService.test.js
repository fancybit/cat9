// 浜ゆ槗鏈嶅姟鍗曞厓娴嬭瘯

const transactionService = require('../services/transactionService');
const dal = require('../dal');

describe('浜ゆ槗鏈嶅姟娴嬭瘯', () => {
  beforeEach(async () => {
    // 鍒濆鍖朌AL灞?    await dal.initialize();
  });

  afterEach(async () => {
    // 鍏抽棴DAL灞?    await dal.close();
  });

  test('鍒涘缓浜ゆ槗', async () => {
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const result = await transactionService.createTransaction(transactionData);
    expect(result.success).toBe(true);
    expect(result.transaction).toBeDefined();
    expect(result.transaction.amount).toBe(transactionData.amount);
    expect(result.transaction.type).toBe(transactionData.type);
  });

  test('鎵ц浜ゆ槗', async () => {
    // 鍏堝垱寤轰竴涓氦鏄?    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const createResult = await transactionService.createTransaction(transactionData);
    
    // 鐒跺悗鎵ц浜ゆ槗
    const executeResult = await transactionService.executeTransaction(createResult.transaction.id);
    expect(executeResult.success).toBe(true);
    expect(executeResult.transaction.status).toBe('completed');
  });

  test('鑾峰彇浜ゆ槗璇︽儏', async () => {
    // 鍏堝垱寤轰竴涓氦鏄?    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const createResult = await transactionService.createTransaction(transactionData);
    
    // 鐒跺悗鑾峰彇浜ゆ槗璇︽儏
    const transactionDetails = await transactionService.getTransactionDetails(createResult.transaction.id);
    expect(transactionDetails).toBeDefined();
    expect(transactionDetails.id).toBe(createResult.transaction.id);
    expect(transactionDetails.amount).toBe(transactionData.amount);
  });

  test('鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍', async () => {
    // 鍏堝垱寤轰竴涓祴璇曠敤鎴?    const user = await dal.createUser({
      username: 'transactionuser',
      email: 'transaction@example.com',
      passwordHash: 'hashedpassword',
      displayName: '浜ゆ槗璁板綍鐢ㄦ埛'
    });
    
    // 鐒跺悗鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    const transactions = await transactionService.getUserTransactions(user.id);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });

  test('杞处鍔熻兘', async () => {
    // 鍏堝垱寤轰袱涓祴璇曠敤鎴?    const user1 = await dal.createUser({
      username: 'fromuser',
      email: 'from@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '杞嚭鐢ㄦ埛',
      wallet: { balance: 200 }
    });
    
    const user2 = await dal.createUser({
      username: 'touser',
      email: 'to@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '杞叆鐢ㄦ埛',
      wallet: { balance: 0 }
    });
    
    // 鐒跺悗杩涜杞处
    const transferResult = await transactionService.transferCoins(user1.id, user2.id, 100, '娴嬭瘯杞处');
    expect(transferResult.success).toBe(true);
    
    // 楠岃瘉杞处缁撴灉
    const user1Balance = await transactionService.getUserBalance(user1.id);
    const user2Balance = await transactionService.getUserBalance(user2.id);
    expect(user1Balance).toBe(100); // 200 - 100 = 100
    expect(user2Balance).toBe(100); // 0 + 100 = 100
  });

  test('濂栧姳鍔熻兘', async () => {
    // 鍏堝垱寤轰竴涓祴璇曠敤鎴?    const user = await dal.createUser({
      username: 'rewarduser',
      email: 'reward@example.com',
      passwordHash: 'hashedpassword',
      displayName: '濂栧姳鐢ㄦ埛',
      wallet: { balance: 0 }
    });
    
    // 鐒跺悗杩涜濂栧姳
    const rewardResult = await transactionService.rewardCoins(user.id, 100, '娴嬭瘯濂栧姳');
    expect(rewardResult.success).toBe(true);
    
    // 楠岃瘉濂栧姳缁撴灉
    const userBalance = await transactionService.getUserBalance(user.id);
    expect(userBalance).toBe(100); // 0 + 100 = 100
  });

  test('鑾峰彇鐢ㄦ埛浣欓', async () => {
    // 鍏堝垱寤轰竴涓祴璇曠敤鎴?    const user = await dal.createUser({
      username: 'balanceuser',
      email: 'balance@example.com',
      passwordHash: 'hashedpassword',
      displayName: '浣欓鐢ㄦ埛',
      wallet: { balance: 500 }
    });
    
    // 鐒跺悗鑾峰彇鐢ㄦ埛浣欓
    const balance = await transactionService.getUserBalance(user.id);
    expect(balance).toBe(500);
  });

  test('鎵归噺鑾峰彇浜ゆ槗璇︽儏', async () => {
    // 鍏堝垱寤轰袱涓氦鏄?    const transactionData1 = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处1'
    };
    
    const transactionData2 = {
      fromUserId: 'user2',
      toUserId: 'user1',
      amount: 50,
      type: 'transfer',
      description: '娴嬭瘯杞处2'
    };
    
    const createResult1 = await transactionService.createTransaction(transactionData1);
    const createResult2 = await transactionService.createTransaction(transactionData2);
    
    // 鐒跺悗鎵归噺鑾峰彇浜ゆ槗璇︽儏
    const transactionIds = [createResult1.transaction.id, createResult2.transaction.id];
    const transactions = await transactionService.getBatchTransactions(transactionIds);
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBe(2);
  });
});
