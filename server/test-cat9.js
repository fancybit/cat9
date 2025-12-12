// 娴嬭瘯cat9搴撻泦鎴愬姛鑳?
const dal = require('./dal');
const userService = require('./services/userService');
const softwareService = require('./services/softwareService');
const productService = require('./services/productService');
const transactionService = require('./services/transactionService');

async function runTest() {
  console.log('寮€濮嬫祴璇昪at9搴撻泦鎴?..');
  
  try {
    // 鍒濆鍖朌AL
    await dal.initialize();
    console.log('鏁版嵁璁块棶灞傚垵濮嬪寲鎴愬姛');
    
    // 1. 娴嬭瘯鐢ㄦ埛娉ㄥ唽
    console.log('\n1. 娴嬭瘯鐢ㄦ埛娉ㄥ唽...');
    const registerResult = await userService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123456',
      displayName: '娴嬭瘯鐢ㄦ埛'
    });
    console.log('娉ㄥ唽缁撴灉:', registerResult.success ? '鎴愬姛' : '澶辫触', registerResult.error || '');
    
    if (!registerResult.success) return;
    
    const userId = registerResult.user.id;
    
    // 2. 娴嬭瘯鐢ㄦ埛鐧诲綍
    console.log('\n2. 娴嬭瘯鐢ㄦ埛鐧诲綍...');
    const loginResult = await userService.login('testuser', 'Test@123456');
    console.log('鐧诲綍缁撴灉:', loginResult.success ? '鎴愬姛' : '澶辫触', loginResult.error || '');
    
    // 3. 鍒涘缓涓€涓彂甯冭€呯敤鎴?    console.log('\n3. 鍒涘缓鍙戝竷鑰呯敤鎴?..');
    const publisherResult = await userService.register({
      username: 'publisher',
      email: 'publisher@example.com',
      password: 'Publisher@123',
      displayName: '娓告垙鍙戝竷鑰?
    });
    console.log('鍙戝竷鑰呭垱寤虹粨鏋?', publisherResult.success ? '鎴愬姛' : '澶辫触');
    
    if (!publisherResult.success) return;
    
    const publisherId = publisherResult.user.id;
    
    // 4. 娴嬭瘯鍒涘缓杞欢
    console.log('\n4. 娴嬭瘯鍒涘缓杞欢...');
    const softwareResult = await softwareService.createSoftware({
      name: '娴嬭瘯娓告垙',
      description: '杩欐槸涓€涓祴璇曟父鎴?,
      publisherId: publisherId,
      version: '1.0.0',
      price: 100,
      tags: ['娴嬭瘯', '娓告垙']
    });
    console.log('杞欢鍒涘缓缁撴灉:', softwareResult.success ? '鎴愬姛' : '澶辫触', softwareResult.error || '');
    
    if (!softwareResult.success) return;
    
    const softwareId = softwareResult.software.id;
    
    // 5. 娴嬭瘯鍒涘缓鍟嗗搧
    console.log('\n5. 娴嬭瘯鍒涘缓鍟嗗搧...');
    const productResult = await productService.createProduct({
      name: '娓告垙閬撳叿',
      description: '娴嬭瘯娓告垙閬撳叿',
      sellerId: publisherId,
      price: 50,
      category: '娓告垙閬撳叿',
      tags: ['閬撳叿', '铏氭嫙鐗╁搧']
    });
    console.log('鍟嗗搧鍒涘缓缁撴灉:', productResult.success ? '鎴愬姛' : '澶辫触', productResult.error || '');
    
    if (!productResult.success) return;
    
    const productId = productResult.product.id;
    
    // 6. 缁欑敤鎴峰鍔变竴浜汣at9Coins
    console.log('\n6. 濂栧姳鐢ㄦ埛Cat9Coins...');
    const rewardResult = await transactionService.rewardCoins(userId, 1000, '娴嬭瘯濂栧姳');
    console.log('濂栧姳缁撴灉:', rewardResult.success ? '鎴愬姛' : '澶辫触', rewardResult.error || '');
    
    // 7. 妫€鏌ョ敤鎴蜂綑棰?    console.log('\n7. 妫€鏌ョ敤鎴蜂綑棰?..');
    const balance = await transactionService.getUserBalance(userId);
    console.log('鐢ㄦ埛浣欓:', balance, 'Cat9Coins');
    
    // 8. 娴嬭瘯璐拱杞欢
    console.log('\n8. 娴嬭瘯璐拱杞欢...');
    const purchaseSoftwareResult = await softwareService.purchaseSoftware(userId, softwareId);
    console.log('璐拱杞欢缁撴灉:', purchaseSoftwareResult.success ? '鎴愬姛' : '澶辫触', purchaseSoftwareResult.error || '');
    
    // 9. 娴嬭瘯璐拱鍟嗗搧
    console.log('\n9. 娴嬭瘯璐拱鍟嗗搧...');
    const purchaseProductResult = await productService.purchaseProduct(userId, productId);
    console.log('璐拱鍟嗗搧缁撴灉:', purchaseProductResult.success ? '鎴愬姛' : '澶辫触', purchaseProductResult.error || '');
    
    // 10. 鍐嶆妫€鏌ョ敤鎴蜂綑棰?    console.log('\n10. 鍐嶆妫€鏌ョ敤鎴蜂綑棰?..');
    const finalBalance = await transactionService.getUserBalance(userId);
    console.log('鐢ㄦ埛鏈€缁堜綑棰?', finalBalance, 'Cat9Coins');
    
    // 11. 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
    console.log('\n11. 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍...');
    const transactions = await transactionService.getUserTransactions(userId);
    console.log('浜ゆ槗璁板綍鏁伴噺:', transactions.length);
    
    // 12. 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勮蒋浠?    console.log('\n12. 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勮蒋浠?..');
    const userSoftware = await softwareService.getUserSoftware(userId);
    console.log('鎷ユ湁鐨勮蒋浠舵暟閲?', userSoftware.length);
    
    // 13. 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勫晢鍝?    console.log('\n13. 鑾峰彇鐢ㄦ埛鎷ユ湁鐨勫晢鍝?..');
    const userProducts = await productService.getUserProducts(userId);
    console.log('鎷ユ湁鐨勫晢鍝佹暟閲?', userProducts.length);
    
    console.log('\n娴嬭瘯瀹屾垚锛?);
    
  } catch (error) {
    console.error('娴嬭瘯杩囩▼涓嚭鐜伴敊璇?', error);
  }
}

// 杩愯娴嬭瘯
runTest();
