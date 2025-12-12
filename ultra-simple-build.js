const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬭秴绠€鍖栫増Electron搴旂敤鏋勫缓...');

// 纭繚宸ヤ綔鐩綍骞插噣
const cleanDirs = ['dist-electron', 'dist-exe', 'dist'];
cleanDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`娓呯悊鐩綍: ${dirPath}`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.warn(`娓呯悊 ${dir} 鏃跺嚭閿欙紝浣嗗皢缁х画:`, err.message);
    }
  }
});

// 閲嶆柊鍒涘缓dist鐩綍
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// 閲嶆柊鍒涘缓dist-exe鐩綍
if (!fs.existsSync(path.join(__dirname, 'dist-exe'))) {
  fs.mkdirSync(path.join(__dirname, 'dist-exe'));
}

// 纭繚娌℃湁濂囨€殑绗﹀彿閾炬帴鎴栧祵濂楃洰褰?console.log('\n妫€鏌ュ苟娓呯悊鍙兘鐨勭鍙烽摼鎺ラ棶棰?..');

try {
  // 鍏堣繍琛孷ue鏋勫缓
  console.log('\n=== 杩愯Vue鏋勫缓 ===');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('鉁?Vue鏋勫缓鎴愬姛');
  
  // 楠岃瘉Vue鏋勫缓缁撴灉
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'))) {
    console.log('鉁?Vue鏋勫缓浜х墿楠岃瘉鎴愬姛');
  } else {
    console.error('鉂?Vue鏋勫缓浜х墿楠岃瘉澶辫触锛屾壘涓嶅埌index.html');
    process.exit(1);
  }
  
  // 浣跨敤鏈€绠€鍗曠殑electron-packager鍛戒护锛屽彧鍖呭惈蹇呰鍙傛暟
  console.log('\n=== 鎵撳寘Electron搴旂敤 ===');
  console.log('娉ㄦ剰锛氳繖涓€姝ュ彲鑳介渶瑕佽緝闀挎椂闂达紝鍥犱负闇€瑕佷笅杞紼lectron');
  
  // 浣跨敤npx鐩存帴杩愯electron-packager锛屽彧浣跨敤鏈€鍩烘湰鐨勫弬鏁?  const command = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe';
  console.log(`鎵ц鍛戒护: ${command}`);
  
  // 涓嶈缃秴鏃讹紝璁╁畠鑷劧瀹屾垚
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n鉁?Electron搴旂敤鏋勫缓瀹屾垚!');
  
  // 妫€鏌ユ瀯寤虹粨鏋?  const exePath = path.join(__dirname, 'dist-exe', 'cat9-win32-x64', 'cat9.exe');
  if (fs.existsSync(exePath)) {
    console.log(`鉁?鍙墽琛屾枃浠跺凡鎴愬姛鐢熸垚: ${exePath}`);
  } else {
    console.log('鈿狅笍  璇锋鏌ist-exe鐩綍涓殑鏋勫缓缁撴灉');
  }
  
} catch (err) {
  console.error('\n鉂?鏋勫缓澶辫触:', err.message);
  console.log('\n鎵嬪姩鏋勫缓寤鸿:');
  console.log('1. 纭繚鎵€鏈変緷璧栧凡瀹夎: npm install');
  console.log('2. 鍗曠嫭杩愯Vue鏋勫缓: npm run build');
  console.log('3. 鐒跺悗鎵嬪姩杩愯: npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe');
  process.exit(1);
}
