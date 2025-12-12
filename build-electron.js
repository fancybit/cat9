const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬫瀯寤篍lectron搴旂敤...');

// 纭繚鏋勫缓鐩綍涓嶅瓨鍦?const buildDir = path.join(__dirname, 'dist-exe');
if (fs.existsSync(buildDir)) {
  console.log(`鍒犻櫎鏃х殑鏋勫缓鐩綍: ${buildDir}`);
  try {
    // 浣跨敤绠€鍗曠殑鏂规硶鍒犻櫎鐩綍
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('鏃х洰褰曞垹闄ゆ垚鍔?);
  } catch (err) {
    console.warn('鍒犻櫎鏃х洰褰曞け璐ワ紝灏嗙户缁娇鐢ㄦ柊鐩綍鍚嶇О:', err.message);
  }
}

// 鍏堣繍琛孷ue鏋勫缓
console.log('杩愯Vue鏋勫缓...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Vue鏋勫缓鎴愬姛');
} catch (err) {
  console.error('Vue鏋勫缓澶辫触:', err.message);
  process.exit(1);
}

// 浣跨敤鏇寸畝鍗曠殑electron-packager鍙傛暟锛岄€氳繃npx杩愯
console.log('寮€濮嬫墦鍖匛lectron搴旂敤...');
try {
  // 浣跨敤鏇寸畝鍗曠殑閰嶇疆锛岄伩鍏嶅彲鑳界殑闂锛岄€氳繃npx杩愯浠ョ‘淇濆彲璁块棶
  const electronCommand = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite --ignore=node_modules';
  console.log(`鎵ц鍛戒护: ${electronCommand}`);
  
  // 璁剧疆杈冮暱鐨勮秴鏃舵椂闂?  const options = {
    stdio: 'inherit',
    timeout: 300000, // 5鍒嗛挓瓒呮椂
  };
  
  execSync(electronCommand, options);
  console.log('\n鉁?Electron搴旂敤鏋勫缓鎴愬姛!');
  console.log(`\n鍙墽琛屾枃浠朵綅缃? ${buildDir}/cat9-win32-x64/cat9.exe`);
} catch (err) {
  console.error('\n鉂?Electron鎵撳寘澶辫触:', err.message);
  console.log('\n璇锋鏌ヤ互涓嬪彲鑳界殑闂:');
  console.log('1. electron-packager鏄惁姝ｇ‘瀹夎');
  console.log('2. 椤圭洰涓槸鍚︽湁蹇呰鐨凟lectron鏂囦欢(background.js绛?');
  console.log('3. 灏濊瘯鎵嬪姩鍒犻櫎dist-exe鐩綍鍚庡啀璇?);
  process.exit(1);
}
