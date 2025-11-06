const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 构建目录路径
const buildDir = path.join(__dirname, 'electron-build');
const appDir = path.join(buildDir, '玄玉逍游-win32-x64');

console.log('开始清理构建目录...');

try {
  // 使用Windows的rmdir命令，带/s /q参数递归删除目录
  if (process.platform === 'win32') {
    if (fs.existsSync(appDir)) {
      console.log(`正在删除目录: ${appDir}`);
      execSync(`rmdir /s /q "${appDir}"`, { stdio: 'inherit' });
      console.log('目录删除成功');
    } else if (fs.existsSync(buildDir)) {
      console.log(`正在删除目录: ${buildDir}`);
      execSync(`rmdir /s /q "${buildDir}"`, { stdio: 'inherit' });
      console.log('目录删除成功');
    }
  } else {
    // 非Windows系统使用fs.rmSync
    if (fs.existsSync(buildDir)) {
      console.log(`正在删除目录: ${buildDir}`);
      fs.rmSync(buildDir, { recursive: true, force: true });
      console.log('目录删除成功');
    }
  }
  
  // 重新创建构建目录
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`构建目录已创建: ${buildDir}`);
  }
  
  console.log('清理完成！');
} catch (error) {
  console.error('清理构建目录时出错:', error.message);
  console.log('尝试使用备用方法...');
  
  // 备用方法：使用更简单的方法
  try {
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
      console.log('备用方法：目录删除成功');
    }
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`备用方法：构建目录已创建: ${buildDir}`);
  } catch (altError) {
    console.error('备用方法也失败:', altError.message);
  }
}