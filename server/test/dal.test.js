// DAL层单元测试

const dal = require('../dal');

describe('数据访问层(DAL)测试', () => {
  beforeEach(async () => {
    // 初始化DAL层
    await dal.initialize();
  });

  afterEach(async () => {
    // 关闭DAL层
    await dal.close();
  });

  test('初始化DAL层', async () => {
    expect(dal.isInitialized).toBe(true);
  });

  test('创建和获取用户', async () => {
    // 创建测试用户
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      displayName: '测试用户'
    };
    
    const user = await dal.createUser(userData);
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe(userData.username);
    
    // 获取用户信息
    const retrievedUser = await dal.getUser(user.id);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.id).toBe(user.id);
    expect(retrievedUser.username).toBe(userData.username);
  });

  test('通过用户名获取用户', async () => {
    // 创建测试用户
    const userData = {
      username: 'testuser2',
      email: 'test2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '测试用户2'
    };
    
    await dal.createUser(userData);
    
    // 通过用户名获取用户
    const user = await dal.getUserByUsername(userData.username);
    expect(user).toBeDefined();
    expect(user.username).toBe(userData.username);
  });

  test('通过邮箱获取用户', async () => {
    // 创建测试用户
    const userData = {
      username: 'testuser3',
      email: 'test3@example.com',
      passwordHash: 'hashedpassword3',
      displayName: '测试用户3'
    };
    
    await dal.createUser(userData);
    
    // 通过邮箱获取用户
    const user = await dal.getUserByEmail(userData.email);
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  test('更新用户信息', async () => {
    // 创建测试用户
    const userData = {
      username: 'testuser4',
      email: 'test4@example.com',
      passwordHash: 'hashedpassword4',
      displayName: '测试用户4'
    };
    
    const user = await dal.createUser(userData);
    
    // 更新用户信息
    const updateData = {
      displayName: '更新后的测试用户4'
    };
    
    const updatedUser = await dal.updateUser(user.id, updateData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.displayName).toBe(updateData.displayName);
    
    // 验证更新后的用户信息
    const retrievedUser = await dal.getUser(user.id);
    expect(retrievedUser.displayName).toBe(updateData.displayName);
  });

  test('创建和获取游戏', async () => {
    // 创建测试游戏
    const gameData = {
      name: '测试游戏',
      description: '这是一个测试游戏',
      category: '休闲',
      image: 'https://via.placeholder.com/600x400',
      url: 'https://example.com/game'
    };
    
    const game = await dal.createGame(gameData);
    expect(game).toBeDefined();
    expect(game.id).toBeDefined();
    expect(game.name).toBe(gameData.name);
    
    // 获取游戏信息
    const retrievedGame = await dal.getGameById(game.id);
    expect(retrievedGame).toBeDefined();
    expect(retrievedGame.id).toBe(game.id);
    expect(retrievedGame.name).toBe(gameData.name);
  });

  test('创建交易', async () => {
    // 创建测试交易
    const transactionData = {
      fromUserId: 'user1',
      toUserId: 'user2',
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.amount).toBe(transactionData.amount);
    expect(transaction.type).toBe(transactionData.type);
  });

  test('执行交易', async () => {
    // 创建测试用户
    const user1 = await dal.createUser({
      username: 'user1',
      email: 'user1@example.com',
      passwordHash: 'hashedpassword1',
      displayName: '用户1',
      wallet: { balance: 200 }
    });
    
    const user2 = await dal.createUser({
      username: 'user2',
      email: 'user2@example.com',
      passwordHash: 'hashedpassword2',
      displayName: '用户2',
      wallet: { balance: 0 }
    });
    
    // 创建测试交易
    const transactionData = {
      fromUserId: user1.id,
      toUserId: user2.id,
      amount: 100,
      type: 'transfer',
      description: '测试转账'
    };
    
    const transaction = await dal.createTransaction(transactionData);
    
    // 执行交易
    const success = await dal.executeTransaction(transaction.id);
    expect(success).toBe(true);
    
    // 验证交易状态
    const executedTransaction = await dal.getTransaction(transaction.id);
    expect(executedTransaction.status).toBe('completed');
  });

  test('创建和获取开发者', async () => {
    // 创建测试开发者
    const developerData = {
      name: '测试开发者',
      email: 'developer@example.com',
      description: '这是一个测试开发者',
      website: 'https://example.com/developer'
    };
    
    const developer = await dal.createDeveloper(developerData);
    expect(developer).toBeDefined();
    expect(developer.id).toBeDefined();
    expect(developer.name).toBe(developerData.name);
    
    // 获取开发者信息
    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    expect(retrievedDeveloper).toBeDefined();
    expect(retrievedDeveloper.id).toBe(developer.id);
    expect(retrievedDeveloper.name).toBe(developerData.name);
  });

  test('更新开发者信息', async () => {
    // 创建测试开发者
    const developerData = {
      name: '测试开发者2',
      email: 'developer2@example.com',
      description: '这是一个测试开发者2',
      website: 'https://example.com/developer2'
    };
    
    const developer = await dal.createDeveloper(developerData);
    
    // 更新开发者信息
    const updateData = {
      description: '更新后的测试开发者2'
    };
    
    const updatedDeveloper = await dal.updateDeveloper(developer.id, updateData);
    expect(updatedDeveloper).toBeDefined();
    expect(updatedDeveloper.description).toBe(updateData.description);
    
    // 验证更新后的开发者信息
    const retrievedDeveloper = await dal.getDeveloper(developer.id);
    expect(retrievedDeveloper.description).toBe(updateData.description);
  });
});
