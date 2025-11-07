const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始手动构建Electron应用...');

// 设置构建路径
const appName = 'cat9';
const outputDir = path.join(__dirname, 'dist-exe');
const appDir = path.join(outputDir, `${appName}-win32-x64`);

// 清理旧的构建目录
console.log('\n清理构建环境...');
if (fs.existsSync(outputDir)) {
  try {
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log(`✅ 已清理旧的构建目录: ${outputDir}`);
  } catch (err) {
    console.warn(`⚠️  清理旧目录时出错，但将继续:`, err.message);
  }
}

// 创建必要的目录
console.log('\n创建构建目录...');
fs.mkdirSync(appDir, { recursive: true });
console.log(`✅ 已创建应用目录: ${appDir}`);

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

// 检查dist目录是否存在
const vueDistDir = path.join(__dirname, 'dist');
if (!fs.existsSync(vueDistDir)) {
  console.error(`❌ Vue构建目录不存在: ${vueDistDir}`);
  process.exit(1);
}

// 复制必要的文件到应用目录
console.log('\n=== 复制应用文件 ===');

// 1. 创建resources/app目录
const resourcesAppDir = path.join(appDir, 'resources', 'app');
fs.mkdirSync(resourcesAppDir, { recursive: true });

// 2. 确保electron-squirrel-startup依赖被安装到目标应用中
console.log('安装electron-squirrel-startup到应用目录...');
try {
  // 先确保node_modules目录存在
  const nodeModulesDir = path.join(resourcesAppDir, 'node_modules');
  fs.mkdirSync(nodeModulesDir, { recursive: true });

  // 尝试直接从项目的node_modules复制electron-squirrel-startup
  const sourceSquirrelDir = path.join(__dirname, 'node_modules', 'electron-squirrel-startup');
  const targetSquirrelDir = path.join(nodeModulesDir, 'electron-squirrel-startup');

  if (fs.existsSync(sourceSquirrelDir)) {
    // 如果存在，复制整个目录
    console.log(`复制electron-squirrel-startup从${sourceSquirrelDir}到${targetSquirrelDir}`);
    if (fs.existsSync(targetSquirrelDir)) {
      fs.rmSync(targetSquirrelDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetSquirrelDir, { recursive: true });

    // 复制package.json和index.js
    const packageJsonPath = path.join(sourceSquirrelDir, 'package.json');
    const indexJsPath = path.join(sourceSquirrelDir, 'index.js');
    if (fs.existsSync(packageJsonPath)) {
      fs.copyFileSync(packageJsonPath, path.join(targetSquirrelDir, 'package.json'));
    }
    if (fs.existsSync(indexJsPath)) {
      fs.copyFileSync(indexJsPath, path.join(targetSquirrelDir, 'index.js'));
    }
    console.log('✅ 已复制electron-squirrel-startup模块');
  } else {
    console.log('⚠️  本地未找到electron-squirrel-startup模块，尝试安装...');
    // 尝试在目标目录直接安装
    execSync(`cd ${resourcesAppDir} && npm install electron-squirrel-startup`, { stdio: 'inherit' });
    console.log('✅ 已在应用目录安装electron-squirrel-startup');
  }
} catch (err) {
  console.warn('⚠️  安装electron-squirrel-startup时出错，但应用将继续构建:', err.message);
}

// 2. 复制package.json
console.log('复制package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  fs.copyFileSync(packageJsonPath, path.join(resourcesAppDir, 'package.json'));
  console.log('✅ 已复制package.json');
} else {
  console.error(`❌ 找不到package.json`);
}

// 3. 复制background.js (Electron入口文件)
console.log('复制background.js...');
const backgroundJsPath = path.join(__dirname, 'background.js');
if (fs.existsSync(backgroundJsPath)) {
  fs.copyFileSync(backgroundJsPath, path.join(resourcesAppDir, 'background.js'));
  console.log('✅ 已复制background.js');
} else {
  console.error(`❌ 找不到background.js`);
}

// 4. 复制electron目录
console.log('复制electron目录...');
const electronDirPath = path.join(__dirname, 'electron');
const targetElectronDir = path.join(resourcesAppDir, 'electron');
if (fs.existsSync(electronDirPath)) {
  fs.mkdirSync(targetElectronDir, { recursive: true });
  // 复制electron目录下的所有文件
  const electronFiles = fs.readdirSync(electronDirPath);
  electronFiles.forEach(file => {
    const sourcePath = path.join(electronDirPath, file);
    const targetPath = path.join(targetElectronDir, file);
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
  console.log('✅ 已复制electron目录');
} else {
  console.error(`❌ 找不到electron目录`);
}

// 5. 复制dist目录 (Vue构建产物)
console.log('复制dist目录...');
const targetDistDir = path.join(resourcesAppDir, 'dist');
fs.mkdirSync(targetDistDir, { recursive: true });

// 递归复制目录函数
function copyDir(source, target) {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

try {
  copyDir(vueDistDir, targetDistDir);
  console.log('✅ 已复制dist目录');
} catch (err) {
  console.error('❌ 复制dist目录时出错:', err.message);
}

// 6. 复制public目录中的图标文件
console.log('复制图标文件...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  const iconPath = path.join(publicDir, 'favicon.ico');
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(appDir, 'icon.ico'));
    console.log('✅ 已复制图标文件');
  }
}

// 使用electron-cli创建可执行文件的简化方法
console.log('\n=== 获取Electron可执行文件 ===');
try {
  // 先安装electron（如果尚未安装）
  console.log('安装electron...');
  execSync('npm install --save-dev electron', { stdio: 'inherit' });

  // 获取electron的路径
  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron.cmd');
  if (fs.existsSync(electronPath)) {
    console.log(`✅ 找到electron可执行文件: ${electronPath}`);

    // 复制electron的可执行文件到输出目录
    const nodeModulesElectronDir = path.join(__dirname, 'node_modules', 'electron');
    if (fs.existsSync(nodeModulesElectronDir)) {
      console.log('复制electron运行时文件...');

      // 复制electron.exe - 添加重试逻辑以处理EBUSY错误
      const electronExePath = path.join(nodeModulesElectronDir, 'dist', 'electron.exe');
      if (fs.existsSync(electronExePath)) {
        let copySuccessful = false;
        let retries = 3;

        while (!copySuccessful && retries > 0) {
          try {
            // 先检查目标文件是否存在，如果存在则删除
            const targetExePath = path.join(appDir, `${appName}.exe`);
            if (fs.existsSync(targetExePath)) {
              try {
                fs.unlinkSync(targetExePath);
                console.log(`已删除现有可执行文件: ${targetExePath}`);
              } catch (deleteErr) {
                console.warn(`删除现有文件时出错，但将继续: ${deleteErr.message}`);
              }
            }

            // 尝试复制文件
            fs.copyFileSync(electronExePath, path.join(appDir, `${appName}.exe`));
            console.log(`✅ 已创建可执行文件: ${path.join(appDir, `${appName}.exe`)}`);
            copySuccessful = true;
          } catch (copyErr) {
            if (copyErr.code === 'EBUSY') {
              retries--;
              console.warn(`⚠️ 文件被占用，${retries}秒后重试...`);
              // 使用同步睡眠
              const wait = (ms) => {
                const start = Date.now();
                while (Date.now() - start < ms) { console.log("") }
              };
              wait(1000); // 等待1秒后重试
            } else {
              throw copyErr;
            }
          }
        }

        if (!copySuccessful) {
          console.error(`❌ 复制electron.exe失败，所有重试均已耗尽`);
        }
      }

      // 复制electron的其他必要文件
      const electronResourcesDir = path.join(nodeModulesElectronDir, 'dist', 'resources');
      const targetResourcesDir = path.join(appDir, 'resources');

      if (fs.existsSync(electronResourcesDir) && fs.existsSync(targetResourcesDir)) {
        // 复制default_app.asar（如果存在）
        const defaultAppAsar = path.join(electronResourcesDir, 'default_app.asar');
        if (fs.existsSync(defaultAppAsar)) {
          fs.copyFileSync(defaultAppAsar, path.join(targetResourcesDir, 'default_app.asar'));
          console.log('✅ 已复制default_app.asar');
        }

        // 复制electron.asar
        const electronAsar = path.join(electronResourcesDir, 'electron.asar');
        if (fs.existsSync(electronAsar)) {
          fs.copyFileSync(electronAsar, path.join(targetResourcesDir, 'electron.asar'));
          console.log('✅ 已复制electron.asar');
        }
      }

      console.log('\n✅ 手动构建完成!');
      console.log(`\n应用程序目录: ${appDir}`);
      console.log(`可执行文件: ${path.join(appDir, `${appName}.exe`)}`);
      console.log('\n注意：这是一个简化的构建，可能需要额外配置才能正常运行。');

    } else {
      console.error(`❌ 找不到electron.exe`);
    }
  } else {
    console.error(`❌ 找不到electron.cmd: ${electronPath}`);
  }

} catch (err) {
  console.error('\n❌ 构建失败:', err.message);
  console.log('\n解决建议:');
  console.log('1. 尝试使用更简单的方法：');
  console.log('   - 确保electron已安装: npm install --save-dev electron');
  console.log('   - 运行: npx electron . （直接运行开发版本）');
  console.log('2. 或者尝试其他打包工具:');
  console.log('   - electron-forge');
  console.log('   - 或考虑使用docker容器进行构建');
}

// 列出构建结果
console.log('\n=== 构建结果 ===');
try {
  if (fs.existsSync(appDir)) {
    const files = fs.readdirSync(appDir);
    console.log(`\n应用目录内容 (${appDir}):`);
    files.forEach(file => {
      console.log(`- ${file}`);
    });

    const exePath = path.join(appDir, `${appName}.exe`);
    if (fs.existsSync(exePath)) {
      console.log(`\n✅ 成功生成可执行文件: ${exePath}`);
    } else {
      console.log('\n⚠️  可执行文件未生成');
    }
  } else {
    console.log(`⚠️  应用目录不存在: ${appDir}`);
  }
} catch (err) {
  console.error('❌ 查看构建结果时出错:', err.message);
}