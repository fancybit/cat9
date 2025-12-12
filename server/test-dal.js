// 娴嬭瘯DAL鍔熻兘涓庢暟鎹簱杩炴帴鍣ㄩ泦鎴?
const dal = require('./dal');

async function testDAL() {
  console.log('=== 寮€濮嬫祴璇旸AL灞?===');
  
  try {
    // 鍒濆鍖朌AL
    await dal.initialize();
    console.log('DAL鍒濆鍖栨垚鍔?);

    // 1. 娴嬭瘯鐢ㄦ埛鎿嶄綔
    console.log('\n1. 娴嬭瘯鐢ㄦ埛鎿嶄綔:');
    const user = await dal.createUser({
      username: `dal_test${Date.now()}`,
      email: `dal_test${Date.now()}@example.com`,
      passwordHash: '$2a$10$samplehash',
      coins: 2000
    });
    console.log('   - 鍒涘缓鐢ㄦ埛鎴愬姛:', user.username);

    const foundUser = await dal.getUserByUsername(user.username);
    console.log('   - 鎸夌敤鎴峰悕鏌ヨ鎴愬姛:', foundUser ? '鏄? : '鍚?);

    const userById = await dal.getUser(user.id);
    console.log('   - 鎸塈D鏌ヨ鎴愬姛:', userById ? '鏄? : '鍚?);

    // 2. 娴嬭瘯杞欢鎿嶄綔
    console.log('\n2. 娴嬭瘯杞欢鎿嶄綔:');
    const software = await dal.createSoftware({
      name: 'DAL娴嬭瘯杞欢',
      description: '杩欐槸涓€涓狣AL娴嬭瘯杞欢',
      version: '1.0.0',
      price: 199,
      publisherId: user.id,
      isFeatured: true
    });
    console.log('   - 鍒涘缓杞欢鎴愬姛:', software.name);

    const foundSoftware = await dal.getSoftware(software.id);
    console.log('   - 鏌ヨ杞欢鎴愬姛:', foundSoftware ? '鏄? : '鍚?);

    // 3. 娴嬭瘯鍟嗗搧鎿嶄綔
    console.log('\n3. 娴嬭瘯鍟嗗搧鎿嶄綔:');
    const product = await dal.createProduct({
      name: 'DAL娴嬭瘯鍟嗗搧',
      description: '杩欐槸涓€涓狣AL娴嬭瘯鍟嗗搧',
      price: 88,
      stock: 50,
      category: 'digital'
    });
    console.log('   - 鍒涘缓鍟嗗搧鎴愬姛:', product.name);

    const foundProduct = await dal.getProduct(product.id);
    console.log('   - 鏌ヨ鍟嗗搧鎴愬姛:', foundProduct ? '鏄? : '鍚?);

    const allProducts = await dal.getAllProducts();
    console.log('   - 鑾峰彇鎵€鏈夊晢鍝佹垚鍔燂紝鏁伴噺:', allProducts.length);

    // 4. 娴嬭瘯浜ゆ槗鎿嶄綔
    console.log('\n4. 娴嬭瘯浜ゆ槗鎿嶄綔:');
    const transaction = await dal.createTransaction({
      userId: user.id,
      type: 'purchase',
      amount: 199,
      itemId: software.id,
      itemType: 'software'
    });
    console.log('   - 鍒涘缓浜ゆ槗鎴愬姛:', transaction.id);

    const foundTransaction = await dal.getTransaction(transaction.id);
    console.log('   - 鏌ヨ浜ゆ槗鎴愬姛:', foundTransaction ? '鏄? : '鍚?);

    const userTransactions = await dal.getUserTransactions(user.id);
    console.log('   - 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍鎴愬姛锛屾暟閲?', userTransactions.length);

    // 5. 娴嬭瘯涓氬姟鎿嶄綔 - 濂栧姳Coins
    console.log('\n5. 娴嬭瘯濂栧姳Coins:');
    const rewardResult = await dal.rewardCoins(user.id, 500);
    console.log('   - 濂栧姳Coins鎴愬姛锛屾柊浣欓:', rewardResult.user.coins);

    // 6. 娴嬭瘯涓氬姟鎿嶄綔 - 璐拱杞欢
    console.log('\n6. 娴嬭瘯璐拱杞欢:');
    const purchaseSoftwareResult = await dal.purchaseSoftware(user.id, software.id);
    console.log('   - 璐拱杞欢鎴愬姛:', purchaseSoftwareResult.success);
    console.log('   - 璐拱鍚庝綑棰?', purchaseSoftwareResult.user.coins);

    // 7. 娴嬭瘯涓氬姟鎿嶄綔 - 璐拱鍟嗗搧
    console.log('\n7. 娴嬭瘯璐拱鍟嗗搧:');
    const purchaseProductResult = await dal.purchaseProduct(user.id, product.id);
    console.log('   - 璐拱鍟嗗搧鎴愬姛:', purchaseProductResult.success);
    console.log('   - 璐拱鍚庝綑棰?', purchaseProductResult.user.coins);
    const updatedProduct = await dal.getProduct(product.id);
    console.log('   - 鍟嗗搧搴撳瓨鏇存柊:', updatedProduct.stock);

    // 8. 娴嬭瘯鏁版嵁瀵煎嚭
    console.log('\n8. 娴嬭瘯鏁版嵁瀵煎嚭:');
    const exportedData = await dal.exportData();
    console.log('   - 鏁版嵁瀵煎嚭鎴愬姛');
    console.log('   - 瀵煎嚭鐨勮蒋浠舵暟閲?', exportedData.software.length);
    console.log('   - 瀵煎嚭鐨勫晢鍝佹暟閲?', exportedData.products.length);

    // 鍏抽棴杩炴帴
    await dal.close();
    console.log('\nDAL杩炴帴鍏抽棴鎴愬姛');

    console.log('\n=== DAL娴嬭瘯鍏ㄩ儴閫氳繃锛?==');
    return true;
  } catch (error) {
    console.error('\nDAL娴嬭瘯澶辫触:', error.message);
    try {
      await dal.close();
    } catch (disconnectError) {
      console.error('DAL鍏抽棴杩炴帴澶辫触:', disconnectError.message);
    }
    return false;
  }
}

// 杩愯娴嬭瘯
testDAL().catch(err => {
  console.error('娴嬭瘯杩囩▼涓嚭鐜版湭鎹曡幏鐨勯敊璇?', err);
});
