const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('寮€濮嬩娇鐢╡lectron-builder鏋勫缓搴旂敤...');

// 娓呯悊鏃х殑鏋勫缓鐩綍
console.log('\n娓呯悊鏋勫缓鐜...');
const cleanDirs = ['dist-electron', 'dist-exe', 'dist', 'release-builds'];
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

// 纭繚蹇呰鐨勭洰褰曞瓨鍦?if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// 纭繚electron-builder.yml閰嶇疆姝ｇ‘锛堢鐢ㄦ墍鏈夊彲鑳藉鑷存潈闄愰棶棰樼殑鍔熻兘锛?console.log('\n妫€鏌ユ瀯寤洪厤缃?..');
const builderConfig = `appId: com.cat9.app
productName: cat9
files:
  - 'dist/**/*'
  - 'electron/**/*'
  - 'background.js'
  - 'package.json'
win:
  target: portable
  icon: public/favicon.ico
  signAndEditExecutable: false
  rfc3161TimeStampServer: false
  timeStampServer: false
signAndEditExecutable: false
buildDependenciesFromSource: true
winSignAndEditExecutable: false
compression: store
asar: false`;

// 鍐欏叆electron-builder.yml閰嶇疆
fs.writeFileSync(path.join(__dirname, 'electron-builder.yml'), builderConfig);
console.log('鉁?electron-builder.yml閰嶇疆宸叉洿鏂?);

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

// 纭繚electron-builder宸插畨瑁?console.log('\n=== 纭繚electron-builder宸插畨瑁?===');
try {
  console.log('鎵ц鍛戒护: npm install --save-dev electron-builder');
  execSync('npm install --save-dev electron-builder', { stdio: 'inherit' });
  console.log('鉁?electron-builder瀹夎鎴愬姛');
} catch (err) {
  console.error('鉂?electron-builder瀹夎澶辫触锛屼絾灏嗙户缁皾璇曟瀯寤?', err.message);
}

// 浣跨敤electron-builder鏋勫缓
console.log('\n=== 浣跨敤electron-builder鏋勫缓Windows搴旂敤 ===');
try {
  // 浣跨敤npx纭繚electron-builder鍙敤锛屽苟娣诲姞棰濆鐨勭幆澧冨彉閲忔潵绂佺敤绛惧悕
  const command = 'set CSC_IDENTITY_AUTO_DISCOVERY=false && npx electron-builder --win portable --publish never';
  console.log(`鎵ц鍛戒护: ${command}`);
  console.log('浣跨敤鐜鍙橀噺绂佺敤浠ｇ爜绛惧悕浠ラ伩鍏嶆潈闄愰棶棰?..');
  console.log('娉ㄦ剰锛氳繖涓€姝ュ彲鑳介渶瑕佸嚑鍒嗛挓鏃堕棿...');
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n鉁?Electron搴旂敤鏋勫缓鎴愬姛!');
  
  // 妫€鏌ユ瀯寤虹粨鏋?  const outputDir = path.join(__dirname, 'dist');
  const files = fs.readdirSync(outputDir);
  console.log(`\n鏋勫缓杈撳嚭鐩綍鍐呭 (${outputDir}):`);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
  
  // 妫€鏌ユ槸鍚︽湁exe鏂囦欢鐢熸垚
  const exeFiles = files.filter(file => file.endsWith('.exe'));
  if (exeFiles.length > 0) {
    console.log('\n鉁?鎵惧埌鍙墽琛屾枃浠?');
    exeFiles.forEach(file => {
      console.log(`- ${path.join(outputDir, file)}`);
    });
  } else {
    console.log('\n鈿狅笍  鏈湪dist鐩綍鎵惧埌exe鏂囦欢锛岃妫€鏌ユ瀯寤鸿緭鍑?);
  }
  
} catch (err) {
  console.error('\n鉂?鏋勫缓澶辫触:', err.message);
  console.log('\n瑙ｅ喅寤鸿:');
  console.log('1. 纭繚鎵€鏈変緷璧栧凡瀹夎: npm install');
  console.log('2. 妫€鏌ョ綉缁滆繛鎺?);
  console.log('3. 灏濊瘯浣跨敤绠＄悊鍛樻潈闄愯繍琛屽懡浠?);
  process.exit(1);
}
