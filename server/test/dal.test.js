// DAL灞傚崟鍏冩祴璇?
const dal = require('../dal');

describe('鏁版嵁璁块棶灞?DAL)娴嬭瘯', () => {
  beforeEach(async () => {
    // 鍒濆鍖朌AL灞?    await dal.initialize();
  });

  afterEach(async () => {
    // 鍏抽棴DAL灞?    await dal.close();
  });

  test('鍒濆鍖朌AL灞?, async () => {
    expect(dal.isInitialized).toBe(true);
  });

  test('鍒涘缓鍜岃幏鍙栫敤鎴?, async () => {
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: '娴嬭瘯鐢ㄦ埛'
    };
    
    const user = await dal.createUser(userData);
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe(userData.username);
    
    // 鑾峰彇鐢ㄦ埛淇℃伅
    const retrievedUser = await dal.getUser(user.id);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.id).toBe(user.id);
    expect(retrievedUser.username).toBe(userData.username);
  });

  test('閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴?, async () => {
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    const userData = {
      username: 'testuser2',
      email: 'test2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '娴嬭瘯鐢ㄦ埛2'
    };
    
    await dal.createUser(userData);
    
    // 閫氳繃鐢ㄦ埛鍚嶈幏鍙栫敤鎴?    const user = await dal.getUserByUsername(userData.username);
    expect(user).toBeDefined();
    expect(user.username).toBe(userData.username);
  });

  test('閫氳繃閭鑾峰彇鐢ㄦ埛', async () => {
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    const userData = {
      username: 'testuser3',
      email: 'test3@example.com',
      passwordHash: 'hashedpassword3',
      displayName: '娴嬭瘯鐢ㄦ埛3'
    };
    
    await dal.createUser(userData);
    
    // 閫氳繃閭鑾峰彇鐢ㄦ埛
    const user = await dal.getUserByEmail(userData.email);
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  test('鏇存柊鐢ㄦ埛淇℃伅', async () => {
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    const userData = {
      username: 'testuser4',
      email: 'test4@example.com',
      passwordHash: 'hashedpassword4',
      displayName: '娴嬭瘯鐢ㄦ埛4'
    };
    
    const user = await dal.createUser(userData);
    
    // 鏇存柊鐢ㄦ埛淇℃伅
    const updateData = {
      displayName: '鏇存柊鍚庣殑娴嬭瘯鐢ㄦ埛4'
    };
    
    const updatedUser = await dal.updateUser(user.id, updateData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.displayName).toBe(updateData.displayName);
    
    // 楠岃瘉鏇存柊鍚庣殑鐢ㄦ埛淇℃伅
    const retrievedUser = await dal.getUser(user.id);
    expect(retrievedUser.displayName).toBe(updateData.displayName);
  });

  test('鍒涘缓鍜岃幏鍙栨父鎴?, async () => {
    // 鍒涘缓娴嬭瘯娓告垙
    const gameData = {
      name: '娴嬭瘯娓告垙',
      description: '杩欐槸涓€涓祴璇曟父鎴?,
      category: '浼戦棽',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game'
    };
    
    const game = await dal.createGame(gameData);
    expect(game).toBeDefined();
    expect(game.id).toBeDefined();
    expect(game.name).toBe(gameData.name);
    
    // 鑾峰彇娓告垙淇℃伅
    const retrievedGame = await dal.getGameById(game.id);
    expect(retrievedGame).toBeDefined();
    expect(retrievedGame.id).toBe(game.id);
    expect(retrievedGame.name).toBe(gameData.name);
  });

  test('鍒涘缓浜ゆ槗', async () => {
    // 鍒涘缓娴嬭瘯浜ゆ槗
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.amount).toBe(transactionData.amount);
    expect(transaction.type).toBe(transactionData.type);
  });

  test('鎵ц浜ゆ槗', async () => {
    // 鍒涘缓娴嬭瘯鐢ㄦ埛
    const user1 = await dal.createUser({
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '鐢ㄦ埛1',
      wallet: { balance: 200 }
    });
    
    const user2 = await dal.createUser({
      username: 'user2',
      email: 'user2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '鐢ㄦ埛2',
      wallet: { balance: 0 }
    });
    
    // 鍒涘缓娴嬭瘯浜ゆ槗
    const transactionData = {
      fromUserId: user1.id,
      toUserId: user2.id,
      amount: 100,
      type: 'transfer',
      description: '娴嬭瘯杞处'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    
    // 鎵ц浜ゆ槗
    const success = await dal.executeTransaction(transaction.id);
    expect(success).toBe(true);
    
    // 楠岃瘉浜ゆ槗鐘舵€?    const executedTransaction = await dal.getTransaction(transaction.id);
    expect(executedTransaction.status).toBe('completed');
  });

  test('鍒涘缓鍜岃幏鍙栧紑鍙戣€?, async () => {
    // 鍒涘缓娴嬭瘯寮€鍙戣€?    const developerData = {
      name: '娴嬭瘯寮€鍙戣€?,
      email: 'developer@example.com',
      description: '杩欐槸涓€涓祴璇曞紑鍙戣€?,
      website: 'https://example.com/developer'
    };
    
    const developer = await dal.createDeveloper(developerData);
    expect(developer).toBeDefined();
    expect(developer.id).toBeDefined();
    expect(developer.name).toBe(developerData.name);
    
    // 鑾峰彇寮€鍙戣€呬俊鎭?    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    expect(retrievedDeveloper).toBeDefined();
    expect(retrievedDeveloper.id).toBe(developer.id);
    expect(retrievedDeveloper.name).toBe(developerData.name);
  });

  test('鏇存柊寮€鍙戣€呬俊鎭?, async () => {
    // 鍒涘缓娴嬭瘯寮€鍙戣€?    const developerData = {
      name: '娴嬭瘯寮€鍙戣€?',
      email: 'developer2@example.com',
      description: '杩欐槸涓€涓祴璇曞紑鍙戣€?',
      website: 'https://example.com/developer2'
    };
    
    const developer = await dal.createDeveloper(developerData);
    
    // 鏇存柊寮€鍙戣€呬俊鎭?    const updateData = {
      description: '鏇存柊鍚庣殑娴嬭瘯寮€鍙戣€?'
    };
    
    const updatedDeveloper = await dal.updateDeveloper(developer.id, updateData);
    expect(updatedDeveloper).toBeDefined();
    expect(updatedDeveloper.description).toBe(updateData.description);
    
    // 楠岃瘉鏇存柊鍚庣殑寮€鍙戣€呬俊鎭?    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    expect(retrievedDeveloper.description).toBe(updateData.description);
  });
});
