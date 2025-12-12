const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬬畝鍖栫増鏈殑Electron搴旂敤鏋勫缓...');

// 璁剧疆鏋勫缓璺緞
const appName = 'cat9';
const outputDir = path.join(__dirname, 'dist-exe');
const appDir = path.join(outputDir, `${appName}-win32-x64`);
const resourcesAppDir = path.join(appDir, 'resources', 'app');

// 娓呯悊鏃х殑鏋勫缓鐩綍
console.log('\n娓呯悊鏋勫缓鐜...');
try {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  console.log('鉁?宸叉竻鐞嗘棫鐨勬瀯寤虹洰褰?);
} catch (err) {
  console.warn('鈿狅笍  娓呯悊鏃х洰褰曟椂鍑洪敊:', err.message);
}

// 鍒涘缓蹇呰鐨勭洰褰?console.log('\n鍒涘缓鏋勫缓鐩綍...');
fs.mkdirSync(resourcesAppDir, { recursive: true });
fs.mkdirSync(path.join(resourcesAppDir, 'node_modules'), { recursive: true });
console.log(`鉁?宸插垱寤哄簲鐢ㄧ洰褰曠粨鏋刞);

// 杩愯Vue鏋勫缓
console.log('\n=== 杩愯Vue鏋勫缓 ===');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('鉁?Vue鏋勫缓鎴愬姛');
} catch (err) {
  console.error('鉂?Vue鏋勫缓澶辫触:', err.message);
  process.exit(1);
}

// 妫€鏌ist鐩綍鏄惁瀛樺湪
const vueDistDir = path.join(__dirname, 'dist');
if (!fs.existsSync(vueDistDir)) {
  console.error(`鉂?Vue鏋勫缓鐩綍涓嶅瓨鍦? ${vueDistDir}`);
  process.exit(1);
}

// 澶嶅埗蹇呰鐨勬枃浠?console.log('\n=== 澶嶅埗搴旂敤鏂囦欢 ===');

// 澶嶅埗package.json
function copyFile(source, target, desc) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`鉁?宸插鍒?{desc}`);
    } else {
      console.warn(`鈿狅笍  ${desc}婧愭枃浠朵笉瀛樺湪: ${source}`);
    }
  } catch (err) {
    console.error(`鉂?澶嶅埗${desc}鏃跺嚭閿?`, err.message);
  }
}

copyFile(path.join(__dirname, 'package.json'), path.join(resourcesAppDir, 'package.json'), 'package.json');
copyFile(path.join(__dirname, 'background.js'), path.join(resourcesAppDir, 'background.js'), 'background.js');

// 澶嶅埗electron鐩綍
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

// 澶嶅埗dist鐩綍
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
        console.warn(`鈿狅笍  澶嶅埗鏂囦欢澶辫触: ${sourcePath}`, err.message);
      }
    }
  });
}

console.log('澶嶅埗dist鐩綍...');
copyDir(vueDistDir, path.join(resourcesAppDir, 'dist'));
console.log('鉁?宸插鍒禿ist鐩綍');

// 澶嶅埗鍥炬爣
copyFile(path.join(__dirname, 'public', 'favicon.ico'), path.join(appDir, 'icon.ico'), '鍥炬爣鏂囦欢');

// 纭繚electron-squirrel-startup妯″潡瀛樺湪
console.log('\n=== 澶勭悊electron-squirrel-startup渚濊禆 ===');
const squirrelModuleDir = path.join(__dirname, 'node_modules', 'electron-squirrel-startup');
const targetSquirrelDir = path.join(resourcesAppDir, 'node_modules', 'electron-squirrel-startup');

try {
  if (fs.existsSync(squirrelModuleDir)) {
    console.log(`澶嶅埗electron-squirrel-startup妯″潡...`);
    fs.mkdirSync(targetSquirrelDir, { recursive: true });
    
    // 澶嶅埗蹇呰鐨勬枃浠?    copyFile(
      path.join(squirrelModuleDir, 'index.js'),
      path.join(targetSquirrelDir, 'index.js'),
      'electron-squirrel-startup/index.js'
    );
    copyFile(
      path.join(squirrelModuleDir, 'package.json'),
      path.join(targetSquirrelDir, 'package.json'),
      'electron-squirrel-startup/package.json'
    );
    console.log('鉁?electron-squirrel-startup妯″潡宸插鍒?);
  } else {
    console.warn('鈿狅笍  electron-squirrel-startup妯″潡鏈壘鍒?);
  }
} catch (err) {
  console.warn('鈿狅笍  澶勭悊electron-squirrel-startup鏃跺嚭閿?', err.message);
}

// 澶嶅埗Electron杩愯鏃舵枃浠?console.log('\n=== 澶嶅埗Electron杩愯鏃舵枃浠?===');
const electronDir = path.join(__dirname, 'node_modules', 'electron');

if (fs.existsSync(electronDir)) {
  // 澶嶅埗electron.exe - 娣诲姞閲嶈瘯閫昏緫
  const electronExePath = path.join(electronDir, 'dist', 'electron.exe');
  const targetExePath = path.join(appDir, `${appName}.exe`);
  let copySuccessful = false;
  
  for (let i = 0; i < 3 && !copySuccessful; i++) {
    try {
      // 灏濊瘯鍒犻櫎鐜版湁鏂囦欢
      if (fs.existsSync(targetExePath)) {
        try {
          fs.unlinkSync(targetExePath);
        } catch (e) {
          console.warn(`鈿狅笍  鏃犳硶鍒犻櫎鐜版湁鏂囦欢: ${e.message}`);
        }
      }
      
      fs.copyFileSync(electronExePath, targetExePath);
      console.log(`鉁?宸插垱寤哄彲鎵ц鏂囦欢: ${targetExePath}`);
      copySuccessful = true;
    } catch (err) {
      if (i < 2) {
        console.warn(`鈿狅笍  澶嶅埗澶辫触锛?{i+1}绉掑悗閲嶈瘯...`);
        const wait = (ms) => { const start = Date.now(); while (Date.now() - start < ms) {} };
        wait(1000 * (i+1));
      } else {
        console.error(`鉂?澶嶅埗electron.exe澶辫触:`, err.message);
      }
    }
  }
  
  // 澶嶅埗鍏朵粬蹇呰鏂囦欢
  const electronResourcesDir = path.join(electronDir, 'dist', 'resources');
  const appResourcesDir = path.join(appDir, 'resources');
  
  if (fs.existsSync(electronResourcesDir)) {
    // 澶嶅埗electron.asar
    copyFile(
      path.join(electronResourcesDir, 'electron.asar'),
      path.join(appResourcesDir, 'electron.asar'),
      'electron.asar'
    );
    
    // 澶嶅埗default_app.asar锛堝鏋滃瓨鍦級
    copyFile(
      path.join(electronResourcesDir, 'default_app.asar'),
      path.join(appResourcesDir, 'default_app.asar'),
      'default_app.asar'
    );
  }
  
  // 澶嶅埗鍏朵粬蹇呰鐨凞LL鏂囦欢
  const electronDistDir = path.join(electronDir, 'dist');
  const dllFiles = ['ffmpeg.dll', 'libEGL.dll', 'libGLESv2.dll', 'vulkan-1.dll', 
                    'd3dcompiler_47.dll', 'icudtl.dat', 'resources.pak', 
                    'chrome_100_percent.pak', 'chrome_200_percent.pak',
                    'snapshot_blob.bin', 'v8_context_snapshot.bin'];
  
  console.log('\n澶嶅埗Electron杩愯鏃禗LL鏂囦欢...');
  dllFiles.forEach(dll => {
    copyFile(
      path.join(electronDistDir, dll),
      path.join(appDir, dll),
      dll
    );
  });
  
  // 澶嶅埗locales鐩綍
  if (fs.existsSync(path.join(electronDistDir, 'locales'))) {
    console.log('澶嶅埗locales鐩綍...');
    copyDir(
      path.join(electronDistDir, 'locales'),
      path.join(appDir, 'locales')
    );
    console.log('鉁?宸插鍒秎ocales鐩綍');
  }
} else {
  console.error(`鉂?Electron鏈畨瑁呭湪node_modules涓璥);
}

// 妫€鏌ユ瀯寤虹粨鏋?console.log('\n=== 鏋勫缓缁撴灉 ===');
try {
  if (fs.existsSync(appDir)) {
    const exePath = path.join(appDir, `${appName}.exe`);
    if (fs.existsSync(exePath)) {
      console.log(`\n鉁?鎴愬姛鐢熸垚鍙墽琛屾枃浠? ${exePath}`);
      console.log('搴旂敤绋嬪簭宸叉瀯寤哄畬鎴愶紒');
    } else {
      console.log(`\n鉂?鍙墽琛屾枃浠舵湭鐢熸垚: ${exePath}`);
    }
  }
} catch (err) {
  console.error('鉂?鏌ョ湅鏋勫缓缁撴灉鏃跺嚭閿?', err.message);
}
