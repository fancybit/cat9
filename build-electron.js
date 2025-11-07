const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建Electron应用...');

// 确保构建目录不存在
const buildDir = path.join(__dirname, 'dist-exe');
if (fs.existsSync(buildDir)) {
  console.log(`删除旧的构建目录: ${buildDir}`);
  try {
    // 使用简单的方法删除目录
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('旧目录删除成功');
  } catch (err) {
    console.warn('删除旧目录失败，将继续使用新目录名称:', err.message);
  }
}

// 先运行Vue构建
console.log('运行Vue构建...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Vue构建成功');
} catch (err) {
  console.error('Vue构建失败:', err.message);
  process.exit(1);
}

// 使用更简单的electron-packager参数，通过npx运行
console.log('开始打包Electron应用...');
try {
  // 使用更简单的配置，避免可能的问题，通过npx运行以确保可访问
  const electronCommand = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite --ignore=node_modules';
  console.log(`执行命令: ${electronCommand}`);
  
  // 设置较长的超时时间
  const options = {
    stdio: 'inherit',
    timeout: 300000, // 5分钟超时
  };
  
  execSync(electronCommand, options);
  console.log('\n✅ Electron应用构建成功!');
  console.log(`\n可执行文件位置: ${buildDir}/cat9-win32-x64/cat9.exe`);
} catch (err) {
  console.error('\n❌ Electron打包失败:', err.message);
  console.log('\n请检查以下可能的问题:');
  console.log('1. electron-packager是否正确安装');
  console.log('2. 项目中是否有必要的Electron文件(background.js等)');
  console.log('3. 尝试手动删除dist-exe目录后再试');
  process.exit(1);
}