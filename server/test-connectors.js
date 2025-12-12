// 娴嬭瘯鏁版嵁搴撹繛鎺ュ櫒鍔熻兘

const { MockConnector, MongoDBConnector, MySQLConnector } = require('./dbconnectors');

async function testConnector(connector, type) {
  console.log(`\n=== 娴嬭瘯 ${type} 鏁版嵁搴撹繛鎺ュ櫒 ===`);
  
  try {
    // 杩炴帴鏁版嵁搴?    await connector.connect();
    console.log(`${type} 杩炴帴鎴愬姛`);

    // 娴嬭瘯鐢ㄦ埛鎿嶄綔
    console.log('\n1. 娴嬭瘯鐢ㄦ埛鎿嶄綔:');
    const user = await connector.createUser({
      username: `test${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      passwordHash: '$2a$10$samplehash',
      coins: 1000
    });
    console.log('   - 鍒涘缓鐢ㄦ埛鎴愬姛:', user.username);

    const foundUser = await connector.getUserByUsername(user.username);
    console.log('   - 鎸夌敤鎴峰悕鏌ヨ鎴愬姛:', foundUser ? '鏄? : '鍚?);

    const userById = await connector.getUserById(user.id);
    console.log('   - 鎸塈D鏌ヨ鎴愬姛:', userById ? '鏄? : '鍚?);

    // 娴嬭瘯杞欢鎿嶄綔
    console.log('\n2. 娴嬭瘯杞欢鎿嶄綔:');
    const software = await connector.createSoftware({
      name: '娴嬭瘯杞欢',
      description: '杩欐槸涓€涓祴璇曡蒋浠?,
      version: '1.0.0',
      price: 99,
      publisherId: user.id
    });
    console.log('   - 鍒涘缓杞欢鎴愬姛:', software.name);

    const foundSoftware = await connector.getSoftwareById(software.id);
    console.log('   - 鏌ヨ杞欢鎴愬姛:', foundSoftware ? '鏄? : '鍚?);

    // 娴嬭瘯鍟嗗搧鎿嶄綔
    console.log('\n3. 娴嬭瘯鍟嗗搧鎿嶄綔:');
    const product = await connector.createProduct({
      name: '娴嬭瘯鍟嗗搧',
      description: '杩欐槸涓€涓祴璇曞晢鍝?,
      price: 50,
      stock: 100,
      category: 'digital'
    });
    console.log('   - 鍒涘缓鍟嗗搧鎴愬姛:', product.name);

    const foundProduct = await connector.getProductById(product.id);
    console.log('   - 鏌ヨ鍟嗗搧鎴愬姛:', foundProduct ? '鏄? : '鍚?);

    // 娴嬭瘯浜ゆ槗鎿嶄綔
    console.log('\n4. 娴嬭瘯浜ゆ槗鎿嶄綔:');
    const transaction = await connector.createTransaction({
      userId: user.id,
      type: 'purchase',
      amount: 99,
      itemId: software.id,
      itemType: 'software'
    });
    console.log('   - 鍒涘缓浜ゆ槗鎴愬姛:', transaction.id);

    const foundTransaction = await connector.getTransactionById(transaction.id);
    console.log('   - 鏌ヨ浜ゆ槗鎴愬姛:', foundTransaction ? '鏄? : '鍚?);

    // 娴嬭瘯鏇存柊浣欓
    console.log('\n5. 娴嬭瘯鏇存柊浣欓:');
    const updatedUser = await connector.updateUserCoins(user.id, -99);
    console.log('   - 鏇存柊浣欓鎴愬姛锛屽墿浣欎綑棰?', updatedUser.coins);

    // 娴嬭瘯鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    console.log('\n6. 娴嬭瘯鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍:');
    const userTransactions = await connector.getUserTransactions(user.id);
    console.log('   - 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍鎴愬姛锛屾暟閲?', userTransactions.length);

    // 鏂紑杩炴帴
    await connector.disconnect();
    console.log(`\n${type} 鏂紑杩炴帴鎴愬姛`);
    
    return true;
  } catch (error) {
    console.error(`\n${type} 娴嬭瘯澶辫触:`, error.message);
    try {
      await connector.disconnect();
    } catch (disconnectError) {
      console.error(`${type} 鏂紑杩炴帴澶辫触:`, disconnectError.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('寮€濮嬫祴璇曟暟鎹簱杩炴帴鍣?..');

  // 娴嬭瘯Mock鏁版嵁搴?  const mockConnector = new MockConnector();
  const mockResult = await testConnector(mockConnector, 'Mock鏁版嵁搴?);
  console.log(`\nMock鏁版嵁搴撴祴璇曠粨鏋? ${mockResult ? '閫氳繃' : '澶辫触'}`);

  // 娉ㄦ剰锛氬疄闄呰繍琛屾椂锛孧ongoDB鍜孧ySQL娴嬭瘯闇€瑕佺‘淇濇暟鎹簱鏈嶅姟宸插惎鍔?  console.log('\n娉ㄦ剰锛歁ongoDB鍜孧ySQL娴嬭瘯闇€瑕佺‘淇濆搴旀暟鎹簱鏈嶅姟宸插惎鍔?);
  console.log('濡傞渶娴嬭瘯锛岃鍙栨秷涓嬮潰浠ｇ爜鐨勬敞閲?);

  // 娴嬭瘯MongoDB锛堝鏋滈渶瑕佹祴璇曪紝璇峰彇娑堟敞閲婏級
  // const mongoConnector = new MongoDBConnector();
  // const mongoResult = await testConnector(mongoConnector, 'MongoDB');
  // console.log(`\nMongoDB娴嬭瘯缁撴灉: ${mongoResult ? '閫氳繃' : '澶辫触'}`);

  // 娴嬭瘯MySQL锛堝鏋滈渶瑕佹祴璇曪紝璇峰彇娑堟敞閲婂苟閰嶇疆姝ｇ‘鐨勮繛鎺ヤ俊鎭級
  // const mysqlConnector = new MySQLConnector();
  // const mysqlResult = await testConnector(mysqlConnector, 'MySQL');
  // console.log(`\nMySQL娴嬭瘯缁撴灉: ${mysqlResult ? '閫氳繃' : '澶辫触'}`);

  console.log('\n娴嬭瘯瀹屾垚锛?);
}

// 杩愯娴嬭瘯
runTests().catch(err => {
  console.error('娴嬭瘯杩囩▼涓嚭鐜版湭鎹曡幏鐨勯敊璇?', err);
});
