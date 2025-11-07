const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始使用electron-builder构建应用...');

// 清理旧的构建目录
console.log('\n清理构建环境...');
const cleanDirs = ['dist-electron', 'dist-exe', 'dist', 'release-builds'];
cleanDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`清理目录: ${dirPath}`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.warn(`清理 ${dir} 时出错，但将继续:`, err.message);
    }
  }
});

// 确保必要的目录存在
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// 确保electron-builder.yml配置正确（禁用所有可能导致权限问题的功能）
console.log('\n检查构建配置...');
const builderConfig = `appId: com.cat9.app
productName: cat9
files:
  - 'dist/**/*'
  - 'electron/**/*'
  - 'background.js'
  - 'package.json'
win:
  target: portable
  icon: public/favicon.ico
  signAndEditExecutable: false
  rfc3161TimeStampServer: false
  timeStampServer: false
signAndEditExecutable: false
buildDependenciesFromSource: true
winSignAndEditExecutable: false
compression: store
asar: false`;

// 写入electron-builder.yml配置
fs.writeFileSync(path.join(__dirname, 'electron-builder.yml'), builderConfig);
console.log('✅ electron-builder.yml配置已更新');

// 先运行Vue构建
console.log('\n=== 运行Vue构建 ===');
try {
  console.log('执行命令: npm run build');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Vue构建成功');
} catch (err) {
  console.error('❌ Vue构建失败:', err.message);
  process.exit(1);
}

// 确保electron-builder已安装
console.log('\n=== 确保electron-builder已安装 ===');
try {
  console.log('执行命令: npm install --save-dev electron-builder');
  execSync('npm install --save-dev electron-builder', { stdio: 'inherit' });
  console.log('✅ electron-builder安装成功');
} catch (err) {
  console.error('❌ electron-builder安装失败，但将继续尝试构建:', err.message);
}

// 使用electron-builder构建
console.log('\n=== 使用electron-builder构建Windows应用 ===');
try {
  // 使用npx确保electron-builder可用，并添加额外的环境变量来禁用签名
  const command = 'set CSC_IDENTITY_AUTO_DISCOVERY=false && npx electron-builder --win portable --publish never';
  console.log(`执行命令: ${command}`);
  console.log('使用环境变量禁用代码签名以避免权限问题...');
  console.log('注意：这一步可能需要几分钟时间...');
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Electron应用构建成功!');
  
  // 检查构建结果
  const outputDir = path.join(__dirname, 'dist');
  const files = fs.readdirSync(outputDir);
  console.log(`\n构建输出目录内容 (${outputDir}):`);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
  
  // 检查是否有exe文件生成
  const exeFiles = files.filter(file => file.endsWith('.exe'));
  if (exeFiles.length > 0) {
    console.log('\n✅ 找到可执行文件:');
    exeFiles.forEach(file => {
      console.log(`- ${path.join(outputDir, file)}`);
    });
  } else {
    console.log('\n⚠️  未在dist目录找到exe文件，请检查构建输出');
  }
  
} catch (err) {
  console.error('\n❌ 构建失败:', err.message);
  console.log('\n解决建议:');
  console.log('1. 确保所有依赖已安装: npm install');
  console.log('2. 检查网络连接');
  console.log('3. 尝试使用管理员权限运行命令');
  process.exit(1);
}