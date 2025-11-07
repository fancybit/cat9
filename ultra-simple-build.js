const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始超简化版Electron应用构建...');

// 确保工作目录干净
const cleanDirs = ['dist-electron', 'dist-exe', 'dist'];
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

// 重新创建dist目录
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// 重新创建dist-exe目录
if (!fs.existsSync(path.join(__dirname, 'dist-exe'))) {
  fs.mkdirSync(path.join(__dirname, 'dist-exe'));
}

// 确保没有奇怪的符号链接或嵌套目录
console.log('\n检查并清理可能的符号链接问题...');

try {
  // 先运行Vue构建
  console.log('\n=== 运行Vue构建 ===');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Vue构建成功');
  
  // 验证Vue构建结果
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'))) {
    console.log('✅ Vue构建产物验证成功');
  } else {
    console.error('❌ Vue构建产物验证失败，找不到index.html');
    process.exit(1);
  }
  
  // 使用最简单的electron-packager命令，只包含必要参数
  console.log('\n=== 打包Electron应用 ===');
  console.log('注意：这一步可能需要较长时间，因为需要下载Electron');
  
  // 使用npx直接运行electron-packager，只使用最基本的参数
  const command = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe';
  console.log(`执行命令: ${command}`);
  
  // 不设置超时，让它自然完成
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Electron应用构建完成!');
  
  // 检查构建结果
  const exePath = path.join(__dirname, 'dist-exe', 'cat9-win32-x64', 'cat9.exe');
  if (fs.existsSync(exePath)) {
    console.log(`✅ 可执行文件已成功生成: ${exePath}`);
  } else {
    console.log('⚠️  请检查dist-exe目录中的构建结果');
  }
  
} catch (err) {
  console.error('\n❌ 构建失败:', err.message);
  console.log('\n手动构建建议:');
  console.log('1. 确保所有依赖已安装: npm install');
  console.log('2. 单独运行Vue构建: npm run build');
  console.log('3. 然后手动运行: npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe');
  process.exit(1);
}