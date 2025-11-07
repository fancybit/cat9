const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始简化版本的Electron应用构建...');

// 设置构建路径
const appName = 'cat9';
const outputDir = path.join(__dirname, 'dist-exe');
const appDir = path.join(outputDir, `${appName}-win32-x64`);
const resourcesAppDir = path.join(appDir, 'resources', 'app');

// 清理旧的构建目录
console.log('\n清理构建环境...');
try {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  console.log('✅ 已清理旧的构建目录');
} catch (err) {
  console.warn('⚠️  清理旧目录时出错:', err.message);
}

// 创建必要的目录
console.log('\n创建构建目录...');
fs.mkdirSync(resourcesAppDir, { recursive: true });
fs.mkdirSync(path.join(resourcesAppDir, 'node_modules'), { recursive: true });
console.log(`✅ 已创建应用目录结构`);

// 运行Vue构建
console.log('\n=== 运行Vue构建 ===');
try {
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

// 复制必要的文件
console.log('\n=== 复制应用文件 ===');

// 复制package.json
function copyFile(source, target, desc) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`✅ 已复制${desc}`);
    } else {
      console.warn(`⚠️  ${desc}源文件不存在: ${source}`);
    }
  } catch (err) {
    console.error(`❌ 复制${desc}时出错:`, err.message);
  }
}

copyFile(path.join(__dirname, 'package.json'), path.join(resourcesAppDir, 'package.json'), 'package.json');
copyFile(path.join(__dirname, 'background.js'), path.join(resourcesAppDir, 'background.js'), 'background.js');

// 复制electron目录
if (fs.existsSync(path.join(__dirname, 'electron'))) {
  fs.mkdirSync(path.join(resourcesAppDir, 'electron'), { recursive: true });
  const electronFiles = fs.readdirSync(path.join(__dirname, 'electron'));
  electronFiles.forEach(file => {
    copyFile(
      path.join(__dirname, 'electron', file),
      path.join(resourcesAppDir, 'electron', file),
      `electron/${file}`
    );
  });
}

// 复制dist目录
function copyDir(source, target) {
  if (!fs.existsSync(source)) return;
  
  fs.mkdirSync(target, { recursive: true });
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      try {
        fs.copyFileSync(sourcePath, targetPath);
      } catch (err) {
        console.warn(`⚠️  复制文件失败: ${sourcePath}`, err.message);
      }
    }
  });
}

console.log('复制dist目录...');
copyDir(vueDistDir, path.join(resourcesAppDir, 'dist'));
console.log('✅ 已复制dist目录');

// 复制图标
copyFile(path.join(__dirname, 'public', 'favicon.ico'), path.join(appDir, 'icon.ico'), '图标文件');

// 确保electron-squirrel-startup模块存在
console.log('\n=== 处理electron-squirrel-startup依赖 ===');
const squirrelModuleDir = path.join(__dirname, 'node_modules', 'electron-squirrel-startup');
const targetSquirrelDir = path.join(resourcesAppDir, 'node_modules', 'electron-squirrel-startup');

try {
  if (fs.existsSync(squirrelModuleDir)) {
    console.log(`复制electron-squirrel-startup模块...`);
    fs.mkdirSync(targetSquirrelDir, { recursive: true });
    
    // 复制必要的文件
    copyFile(
      path.join(squirrelModuleDir, 'index.js'),
      path.join(targetSquirrelDir, 'index.js'),
      'electron-squirrel-startup/index.js'
    );
    copyFile(
      path.join(squirrelModuleDir, 'package.json'),
      path.join(targetSquirrelDir, 'package.json'),
      'electron-squirrel-startup/package.json'
    );
    console.log('✅ electron-squirrel-startup模块已复制');
  } else {
    console.warn('⚠️  electron-squirrel-startup模块未找到');
  }
} catch (err) {
  console.warn('⚠️  处理electron-squirrel-startup时出错:', err.message);
}

// 复制Electron运行时文件
console.log('\n=== 复制Electron运行时文件 ===');
const electronDir = path.join(__dirname, 'node_modules', 'electron');

if (fs.existsSync(electronDir)) {
  // 复制electron.exe - 添加重试逻辑
  const electronExePath = path.join(electronDir, 'dist', 'electron.exe');
  const targetExePath = path.join(appDir, `${appName}.exe`);
  let copySuccessful = false;
  
  for (let i = 0; i < 3 && !copySuccessful; i++) {
    try {
      // 尝试删除现有文件
      if (fs.existsSync(targetExePath)) {
        try {
          fs.unlinkSync(targetExePath);
        } catch (e) {
          console.warn(`⚠️  无法删除现有文件: ${e.message}`);
        }
      }
      
      fs.copyFileSync(electronExePath, targetExePath);
      console.log(`✅ 已创建可执行文件: ${targetExePath}`);
      copySuccessful = true;
    } catch (err) {
      if (i < 2) {
        console.warn(`⚠️  复制失败，${i+1}秒后重试...`);
        const wait = (ms) => { const start = Date.now(); while (Date.now() - start < ms) {} };
        wait(1000 * (i+1));
      } else {
        console.error(`❌ 复制electron.exe失败:`, err.message);
      }
    }
  }
  
  // 复制其他必要文件
  const electronResourcesDir = path.join(electronDir, 'dist', 'resources');
  const appResourcesDir = path.join(appDir, 'resources');
  
  if (fs.existsSync(electronResourcesDir)) {
    // 复制electron.asar
    copyFile(
      path.join(electronResourcesDir, 'electron.asar'),
      path.join(appResourcesDir, 'electron.asar'),
      'electron.asar'
    );
    
    // 复制default_app.asar（如果存在）
    copyFile(
      path.join(electronResourcesDir, 'default_app.asar'),
      path.join(appResourcesDir, 'default_app.asar'),
      'default_app.asar'
    );
  }
  
  // 复制其他必要的DLL文件
  const electronDistDir = path.join(electronDir, 'dist');
  const dllFiles = ['ffmpeg.dll', 'libEGL.dll', 'libGLESv2.dll', 'vulkan-1.dll', 
                    'd3dcompiler_47.dll', 'icudtl.dat', 'resources.pak', 
                    'chrome_100_percent.pak', 'chrome_200_percent.pak',
                    'snapshot_blob.bin', 'v8_context_snapshot.bin'];
  
  console.log('\n复制Electron运行时DLL文件...');
  dllFiles.forEach(dll => {
    copyFile(
      path.join(electronDistDir, dll),
      path.join(appDir, dll),
      dll
    );
  });
  
  // 复制locales目录
  if (fs.existsSync(path.join(electronDistDir, 'locales'))) {
    console.log('复制locales目录...');
    copyDir(
      path.join(electronDistDir, 'locales'),
      path.join(appDir, 'locales')
    );
    console.log('✅ 已复制locales目录');
  }
} else {
  console.error(`❌ Electron未安装在node_modules中`);
}

// 检查构建结果
console.log('\n=== 构建结果 ===');
try {
  if (fs.existsSync(appDir)) {
    const exePath = path.join(appDir, `${appName}.exe`);
    if (fs.existsSync(exePath)) {
      console.log(`\n✅ 成功生成可执行文件: ${exePath}`);
      console.log('应用程序已构建完成！');
    } else {
      console.log(`\n❌ 可执行文件未生成: ${exePath}`);
    }
  }
} catch (err) {
  console.error('❌ 查看构建结果时出错:', err.message);
}