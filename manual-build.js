const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬫墜鍔ㄦ瀯寤篍lectron搴旂敤...');

// 璁剧疆鏋勫缓璺緞
const appName = 'cat9';
const outputDir = path.join(__dirname, 'dist-exe');
const appDir = path.join(outputDir, `${appName}-win32-x64`);

// 娓呯悊鏃х殑鏋勫缓鐩綍
console.log('\n娓呯悊鏋勫缓鐜...');
if (fs.existsSync(outputDir)) {
  try {
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log(`鉁?宸叉竻鐞嗘棫鐨勬瀯寤虹洰褰? ${outputDir}`);
  } catch (err) {
    console.warn(`鈿狅笍  娓呯悊鏃х洰褰曟椂鍑洪敊锛屼絾灏嗙户缁?`, err.message);
  }
}

// 鍒涘缓蹇呰鐨勭洰褰?console.log('\n鍒涘缓鏋勫缓鐩綍...');
fs.mkdirSync(appDir, { recursive: true });
console.log(`鉁?宸插垱寤哄簲鐢ㄧ洰褰? ${appDir}`);

// 鍏堣繍琛孷ue鏋勫缓
console.log('\n=== 杩愯Vue鏋勫缓 ===');
try {
  console.log('鎵ц鍛戒护: npm run build');
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

// 澶嶅埗蹇呰鐨勬枃浠跺埌搴旂敤鐩綍
console.log('\n=== 澶嶅埗搴旂敤鏂囦欢 ===');

// 1. 鍒涘缓resources/app鐩綍
const resourcesAppDir = path.join(appDir, 'resources', 'app');
fs.mkdirSync(resourcesAppDir, { recursive: true });

// 2. 纭繚electron-squirrel-startup渚濊禆琚畨瑁呭埌鐩爣搴旂敤涓?console.log('瀹夎electron-squirrel-startup鍒板簲鐢ㄧ洰褰?..');
try {
  // 鍏堢‘淇漬ode_modules鐩綍瀛樺湪
  const nodeModulesDir = path.join(resourcesAppDir, 'node_modules');
  fs.mkdirSync(nodeModulesDir, { recursive: true });

  // 灏濊瘯鐩存帴浠庨」鐩殑node_modules澶嶅埗electron-squirrel-startup
  const sourceSquirrelDir = path.join(__dirname, 'node_modules', 'electron-squirrel-startup');
  const targetSquirrelDir = path.join(nodeModulesDir, 'electron-squirrel-startup');

  if (fs.existsSync(sourceSquirrelDir)) {
    // 濡傛灉瀛樺湪锛屽鍒舵暣涓洰褰?    console.log(`澶嶅埗electron-squirrel-startup浠?{sourceSquirrelDir}鍒?{targetSquirrelDir}`);
    if (fs.existsSync(targetSquirrelDir)) {
      fs.rmSync(targetSquirrelDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetSquirrelDir, { recursive: true });

    // 澶嶅埗package.json鍜宨ndex.js
    const packageJsonPath = path.join(sourceSquirrelDir, 'package.json');
    const indexJsPath = path.join(sourceSquirrelDir, 'index.js');
    if (fs.existsSync(packageJsonPath)) {
      fs.copyFileSync(packageJsonPath, path.join(targetSquirrelDir, 'package.json'));
    }
    if (fs.existsSync(indexJsPath)) {
      fs.copyFileSync(indexJsPath, path.join(targetSquirrelDir, 'index.js'));
    }
    console.log('鉁?宸插鍒秂lectron-squirrel-startup妯″潡');
  } else {
    console.log('鈿狅笍  鏈湴鏈壘鍒癳lectron-squirrel-startup妯″潡锛屽皾璇曞畨瑁?..');
    // 灏濊瘯鍦ㄧ洰鏍囩洰褰曠洿鎺ュ畨瑁?    execSync(`cd ${resourcesAppDir} && npm install electron-squirrel-startup`, { stdio: 'inherit' });
    console.log('鉁?宸插湪搴旂敤鐩綍瀹夎electron-squirrel-startup');
  }
} catch (err) {
  console.warn('鈿狅笍  瀹夎electron-squirrel-startup鏃跺嚭閿欙紝浣嗗簲鐢ㄥ皢缁х画鏋勫缓:', err.message);
}

// 2. 澶嶅埗package.json
console.log('澶嶅埗package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  fs.copyFileSync(packageJsonPath, path.join(resourcesAppDir, 'package.json'));
  console.log('鉁?宸插鍒秔ackage.json');
} else {
  console.error(`鉂?鎵句笉鍒皃ackage.json`);
}

// 3. 澶嶅埗background.js (Electron鍏ュ彛鏂囦欢)
console.log('澶嶅埗background.js...');
const backgroundJsPath = path.join(__dirname, 'background.js');
if (fs.existsSync(backgroundJsPath)) {
  fs.copyFileSync(backgroundJsPath, path.join(resourcesAppDir, 'background.js'));
  console.log('鉁?宸插鍒禸ackground.js');
} else {
  console.error(`鉂?鎵句笉鍒癰ackground.js`);
}

// 4. 澶嶅埗electron鐩綍
console.log('澶嶅埗electron鐩綍...');
const electronDirPath = path.join(__dirname, 'electron');
const targetElectronDir = path.join(resourcesAppDir, 'electron');
if (fs.existsSync(electronDirPath)) {
  fs.mkdirSync(targetElectronDir, { recursive: true });
  // 澶嶅埗electron鐩綍涓嬬殑鎵€鏈夋枃浠?  const electronFiles = fs.readdirSync(electronDirPath);
  electronFiles.forEach(file => {
    const sourcePath = path.join(electronDirPath, file);
    const targetPath = path.join(targetElectronDir, file);
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
  console.log('鉁?宸插鍒秂lectron鐩綍');
} else {
  console.error(`鉂?鎵句笉鍒癳lectron鐩綍`);
}

// 5. 澶嶅埗dist鐩綍 (Vue鏋勫缓浜х墿)
console.log('澶嶅埗dist鐩綍...');
const targetDistDir = path.join(resourcesAppDir, 'dist');
fs.mkdirSync(targetDistDir, { recursive: true });

// 閫掑綊澶嶅埗鐩綍鍑芥暟
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
  console.log('鉁?宸插鍒禿ist鐩綍');
} catch (err) {
  console.error('鉂?澶嶅埗dist鐩綍鏃跺嚭閿?', err.message);
}

// 6. 澶嶅埗public鐩綍涓殑鍥炬爣鏂囦欢
console.log('澶嶅埗鍥炬爣鏂囦欢...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  const iconPath = path.join(publicDir, 'favicon.ico');
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, path.join(appDir, 'icon.ico'));
    console.log('鉁?宸插鍒跺浘鏍囨枃浠?);
  }
}

// 浣跨敤electron-cli鍒涘缓鍙墽琛屾枃浠剁殑绠€鍖栨柟娉?console.log('\n=== 鑾峰彇Electron鍙墽琛屾枃浠?===');
try {
  // 鍏堝畨瑁卐lectron锛堝鏋滃皻鏈畨瑁咃級
  console.log('瀹夎electron...');
  execSync('npm install --save-dev electron', { stdio: 'inherit' });

  // 鑾峰彇electron鐨勮矾寰?  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron.cmd');
  if (fs.existsSync(electronPath)) {
    console.log(`鉁?鎵惧埌electron鍙墽琛屾枃浠? ${electronPath}`);

    // 澶嶅埗electron鐨勫彲鎵ц鏂囦欢鍒拌緭鍑虹洰褰?    const nodeModulesElectronDir = path.join(__dirname, 'node_modules', 'electron');
    if (fs.existsSync(nodeModulesElectronDir)) {
      console.log('澶嶅埗electron杩愯鏃舵枃浠?..');

      // 澶嶅埗electron.exe - 娣诲姞閲嶈瘯閫昏緫浠ュ鐞咵BUSY閿欒
      const electronExePath = path.join(nodeModulesElectronDir, 'dist', 'electron.exe');
      if (fs.existsSync(electronExePath)) {
        let copySuccessful = false;
        let retries = 3;

        while (!copySuccessful && retries > 0) {
          try {
            // 鍏堟鏌ョ洰鏍囨枃浠舵槸鍚﹀瓨鍦紝濡傛灉瀛樺湪鍒欏垹闄?            const targetExePath = path.join(appDir, `${appName}.exe`);
            if (fs.existsSync(targetExePath)) {
              try {
                fs.unlinkSync(targetExePath);
                console.log(`宸插垹闄ょ幇鏈夊彲鎵ц鏂囦欢: ${targetExePath}`);
              } catch (deleteErr) {
                console.warn(`鍒犻櫎鐜版湁鏂囦欢鏃跺嚭閿欙紝浣嗗皢缁х画: ${deleteErr.message}`);
              }
            }

            // 灏濊瘯澶嶅埗鏂囦欢
            fs.copyFileSync(electronExePath, path.join(appDir, `${appName}.exe`));
            console.log(`鉁?宸插垱寤哄彲鎵ц鏂囦欢: ${path.join(appDir, `${appName}.exe`)}`);
            copySuccessful = true;
          } catch (copyErr) {
            if (copyErr.code === 'EBUSY') {
              retries--;
              console.warn(`鈿狅笍 鏂囦欢琚崰鐢紝${retries}绉掑悗閲嶈瘯...`);
              // 浣跨敤鍚屾鐫＄湢
              const wait = (ms) => {
                const start = Date.now();
                while (Date.now() - start < ms) { console.log("") }
              };
              wait(1000); // 绛夊緟1绉掑悗閲嶈瘯
            } else {
              throw copyErr;
            }
          }
        }

        if (!copySuccessful) {
          console.error(`鉂?澶嶅埗electron.exe澶辫触锛屾墍鏈夐噸璇曞潎宸茶€楀敖`);
        }
      }

      // 澶嶅埗electron鐨勫叾浠栧繀瑕佹枃浠?      const electronResourcesDir = path.join(nodeModulesElectronDir, 'dist', 'resources');
      const targetResourcesDir = path.join(appDir, 'resources');

      if (fs.existsSync(electronResourcesDir) && fs.existsSync(targetResourcesDir)) {
        // 澶嶅埗default_app.asar锛堝鏋滃瓨鍦級
        const defaultAppAsar = path.join(electronResourcesDir, 'default_app.asar');
        if (fs.existsSync(defaultAppAsar)) {
          fs.copyFileSync(defaultAppAsar, path.join(targetResourcesDir, 'default_app.asar'));
          console.log('鉁?宸插鍒禿efault_app.asar');
        }

        // 澶嶅埗electron.asar
        const electronAsar = path.join(electronResourcesDir, 'electron.asar');
        if (fs.existsSync(electronAsar)) {
          fs.copyFileSync(electronAsar, path.join(targetResourcesDir, 'electron.asar'));
          console.log('鉁?宸插鍒秂lectron.asar');
        }
      }

      console.log('\n鉁?鎵嬪姩鏋勫缓瀹屾垚!');
      console.log(`\n搴旂敤绋嬪簭鐩綍: ${appDir}`);
      console.log(`鍙墽琛屾枃浠? ${path.join(appDir, `${appName}.exe`)}`);
      console.log('\n娉ㄦ剰锛氳繖鏄竴涓畝鍖栫殑鏋勫缓锛屽彲鑳介渶瑕侀澶栭厤缃墠鑳芥甯歌繍琛屻€?);

    } else {
      console.error(`鉂?鎵句笉鍒癳lectron.exe`);
    }
  } else {
    console.error(`鉂?鎵句笉鍒癳lectron.cmd: ${electronPath}`);
  }

} catch (err) {
  console.error('\n鉂?鏋勫缓澶辫触:', err.message);
  console.log('\n瑙ｅ喅寤鸿:');
  console.log('1. 灏濊瘯浣跨敤鏇寸畝鍗曠殑鏂规硶锛?);
  console.log('   - 纭繚electron宸插畨瑁? npm install --save-dev electron');
  console.log('   - 杩愯: npx electron . 锛堢洿鎺ヨ繍琛屽紑鍙戠増鏈級');
  console.log('2. 鎴栬€呭皾璇曞叾浠栨墦鍖呭伐鍏?');
  console.log('   - electron-forge');
  console.log('   - 鎴栬€冭檻浣跨敤docker瀹瑰櫒杩涜鏋勫缓');
}

// 鍒楀嚭鏋勫缓缁撴灉
console.log('\n=== 鏋勫缓缁撴灉 ===');
try {
  if (fs.existsSync(appDir)) {
    const files = fs.readdirSync(appDir);
    console.log(`\n搴旂敤鐩綍鍐呭 (${appDir}):`);
    files.forEach(file => {
      console.log(`- ${file}`);
    });

    const exePath = path.join(appDir, `${appName}.exe`);
    if (fs.existsSync(exePath)) {
      console.log(`\n鉁?鎴愬姛鐢熸垚鍙墽琛屾枃浠? ${exePath}`);
    } else {
      console.log('\n鈿狅笍  鍙墽琛屾枃浠舵湭鐢熸垚');
    }
  } else {
    console.log(`鈿狅笍  搴旂敤鐩綍涓嶅瓨鍦? ${appDir}`);
  }
} catch (err) {
  console.error('鉂?鏌ョ湅鏋勫缓缁撴灉鏃跺嚭閿?', err.message);
}
