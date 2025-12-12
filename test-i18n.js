// 娴嬭瘯i18n閰嶇疆
const fs = require('fs');
const path = require('path');

// 璇诲彇璇█鏂囦欢
const zhCnPath = path.join(__dirname, 'src/lang/zh-CN.js');
const zhCnContent = fs.readFileSync(zhCnPath, 'utf8');

console.log('zh-CN.js 鏂囦欢鍐呭:');
console.log(zhCnContent);

// 妫€鏌avbar.aboutUs閿槸鍚﹀瓨鍦?if (zhCnContent.includes('aboutUs') && zhCnContent.includes('鍏充簬鎴戜滑')) {
  console.log('鉁?navbar.aboutUs 缈昏瘧閿瓨鍦?);
} else {
  console.log('鉂?navbar.aboutUs 缈昏瘧閿笉瀛樺湪鎴栧唴瀹逛笉鍖归厤');
}

console.log('\n娴嬭瘯瀹屾垚');
