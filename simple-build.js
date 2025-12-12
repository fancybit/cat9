const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬬畝鍗曟瀯寤篍lectron搴旂敤...');

// 纭繚鏋勫缓鐩綍瀛樺湪
const buildDir = path.join(__dirname, 'dist-exe');
console.log(`鏋勫缓杈撳嚭鐩綍: ${buildDir}`);

// 鍏堣繍琛孷ue鏋勫缓
console.log('\n=== 绗竴姝? 杩愯Vue鏋勫缓 ===');
try {
  console.log('鎵ц鍛戒护: npm run build');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('鉁?Vue鏋勫缓鎴愬姛');
} catch (err) {
  console.error('鉂?Vue鏋勫缓澶辫触:', err.message);
  process.exit(1);
}

// 楠岃瘉dist鐩綍鏄惁鍒涘缓鎴愬姛
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.error('鉂?Vue鏋勫缓鍚庣殑dist鐩綍涓嶅瓨鍦紒');
  process.exit(1);
} else {
  console.log('鉁?dist鐩綍宸插垱寤?);
  const distFiles = fs.readdirSync(path.join(__dirname, 'dist'));
  console.log('dist鐩綍鍐呭:', distFiles);
}

// 浣跨敤鏈€绠€鍗曠殑electron-packager鍙傛暟
console.log('\n=== 绗簩姝? 鎵撳寘Electron搴旂敤 ===');
try {
  // 浣跨敤鏈€绠€鍗曠殑閰嶇疆锛岀Щ闄ゅ彲鑳藉鑷撮棶棰樼殑鍙傛暟
  const electronCommand = 'npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite';
  console.log(`鎵ц鍛戒护: ${electronCommand}`);
  
  // 璁剧疆鏇撮暱鐨勮秴鏃舵椂闂?  const options = {
    stdio: 'inherit',
    timeout: 600000, // 10鍒嗛挓瓒呮椂
  };
  
  console.log('寮€濮嬫墽琛宔lectron-packager...杩欏彲鑳介渶瑕佸嚑鍒嗛挓鏃堕棿锛岃鑰愬績绛夊緟...');
  console.log('濡傛灉閬囧埌瓒呮椂锛屽彲浠ュ皾璇曟墜鍔ㄥ湪鍛戒护琛岃繍琛屼笂杩板懡浠?);
  
  execSync(electronCommand, options);
  
  console.log('\n鉁?Electron搴旂敤鏋勫缓鎴愬姛!');
  
  // 楠岃瘉鏋勫缓缁撴灉
  const exeDir = path.join(buildDir, 'cat9-win32-x64');
  if (fs.existsSync(exeDir)) {
    console.log(`\n鉁?鏋勫缓鐩綍宸插垱寤? ${exeDir}`);
    const exePath = path.join(exeDir, 'cat9.exe');
    if (fs.existsSync(exePath)) {
      console.log(`鉁?鍙墽琛屾枃浠跺凡鐢熸垚: ${exePath}`);
    } else {
      console.warn('鈿狅笍  鍙墽琛屾枃浠舵湭鎵惧埌锛屼絾鐩綍宸插垱寤?);
    }
  } else {
    console.warn('鈿狅笍  鏋勫缓鐩綍鏈壘鍒帮紝浣嗗懡浠ゆ墽琛屾垚鍔?);
  }
  
} catch (err) {
  console.error('\n鉂?Electron鎵撳寘澶辫触:', err.message);
  console.log('\n瑙ｅ喅寤鸿:');
  console.log('1. 灏濊瘯鎵嬪姩鍦ㄥ懡浠よ杩愯: npx electron-packager . cat9 --platform=win32 --arch=x64 --out=dist-exe --overwrite');
  console.log('2. 纭繚缃戠粶杩炴帴姝ｅ父锛宔lectron-packager闇€瑕佷笅杞紼lectron');
  console.log('3. 妫€鏌ョ鐩樼┖闂存槸鍚﹀厖瓒?);
  process.exit(1);
}
