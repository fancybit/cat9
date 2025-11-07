const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始简单构建Electron应用...');

// 确保构建目录存在
const buildDir = path.join(__dirname, 'dist-exe');
console.log(`构建输出目录: ${buildDir}`);

// 先运行Vue构建
console.log('\n=== 第一步: 运行Vue构建 ===');
try {
  console.log('执行命令: npm run build');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Vue构建成功');
} catch (err) {
  console.error('❌ Vue构建失败:', err.message);
  process.exit(1);
}

// 验证dist目录是否创建成功
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.error('❌ Vue构建后的dist目录不存在！');
  process.exit(1);
} else {
  console.log('✅ dist目录已创建');
  const distFiles = fs.readdirSync(path.join(__dirname, 'dist'));
  console.log('dist目录内容:', distFiles);
}

// 使用最简单的electron-packager参数
console.log('\n=== 第二步: 打包Electron应用 ===');
try {
  // 使用最简单的配置，移除可能导致问题的参数
  const electronCommand = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite';
  console.log(`执行命令: ${electronCommand}`);
  
  // 设置更长的超时时间
  const options = {
    stdio: 'inherit',
    timeout: 600000, // 10分钟超时
  };
  
  console.log('开始执行electron-packager...这可能需要几分钟时间，请耐心等待...');
  console.log('如果遇到超时，可以尝试手动在命令行运行上述命令');
  
  execSync(electronCommand, options);
  
  console.log('\n✅ Electron应用构建成功!');
  
  // 验证构建结果
  const exeDir = path.join(buildDir, 'cat9-win32-x64');
  if (fs.existsSync(exeDir)) {
    console.log(`\n✅ 构建目录已创建: ${exeDir}`);
    const exePath = path.join(exeDir, 'cat9.exe');
    if (fs.existsSync(exePath)) {
      console.log(`✅ 可执行文件已生成: ${exePath}`);
    } else {
      console.warn('⚠️  可执行文件未找到，但目录已创建');
    }
  } else {
    console.warn('⚠️  构建目录未找到，但命令执行成功');
  }
  
} catch (err) {
  console.error('\n❌ Electron打包失败:', err.message);
  console.log('\n解决建议:');
  console.log('1. 尝试手动在命令行运行: npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite');
  console.log('2. 确保网络连接正常，electron-packager需要下载Electron');
  console.log('3. 检查磁盘空间是否充足');
  process.exit(1);
}