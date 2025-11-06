// 测试i18n配置
const fs = require('fs');
const path = require('path');

// 读取语言文件
const zhCnPath = path.join(__dirname, 'src/lang/zh-CN.js');
const zhCnContent = fs.readFileSync(zhCnPath, 'utf8');

console.log('zh-CN.js 文件内容:');
console.log(zhCnContent);

// 检查navbar.aboutUs键是否存在
if (zhCnContent.includes('aboutUs') && zhCnContent.includes('关于我们')) {
  console.log('✅ navbar.aboutUs 翻译键存在');
} else {
  console.log('❌ navbar.aboutUs 翻译键不存在或内容不匹配');
}

console.log('\n测试完成');