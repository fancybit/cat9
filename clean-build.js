const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 鏋勫缓鐩綍璺緞
const buildDir = path.join(__dirname, 'electron-build');
const appDir = path.join(buildDir, '鐜勭帀閫嶆父-win32-x64');

console.log('寮€濮嬫竻鐞嗘瀯寤虹洰褰?..');

try {
  // 浣跨敤Windows鐨剅mdir鍛戒护锛屽甫/s /q鍙傛暟閫掑綊鍒犻櫎鐩綍
  if (process.platform === 'win32') {
    if (fs.existsSync(appDir)) {
      console.log(`姝ｅ湪鍒犻櫎鐩綍: ${appDir}`);
      execSync(`rmdir /s /q "${appDir}"`, { stdio: 'inherit' });
      console.log('鐩綍鍒犻櫎鎴愬姛');
    } else if (fs.existsSync(buildDir)) {
      console.log(`姝ｅ湪鍒犻櫎鐩綍: ${buildDir}`);
      execSync(`rmdir /s /q "${buildDir}"`, { stdio: 'inherit' });
      console.log('鐩綍鍒犻櫎鎴愬姛');
    }
  } else {
    // 闈濿indows绯荤粺浣跨敤fs.rmSync
    if (fs.existsSync(buildDir)) {
      console.log(`姝ｅ湪鍒犻櫎鐩綍: ${buildDir}`);
      fs.rmSync(buildDir, { recursive: true, force: true });
      console.log('鐩綍鍒犻櫎鎴愬姛');
    }
  }
  
  // 閲嶆柊鍒涘缓鏋勫缓鐩綍
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`鏋勫缓鐩綍宸插垱寤? ${buildDir}`);
  }
  
  console.log('娓呯悊瀹屾垚锛?);
} catch (error) {
  console.error('娓呯悊鏋勫缓鐩綍鏃跺嚭閿?', error.message);
  console.log('灏濊瘯浣跨敤澶囩敤鏂规硶...');
  
  // 澶囩敤鏂规硶锛氫娇鐢ㄦ洿绠€鍗曠殑鏂规硶
  try {
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
      console.log('澶囩敤鏂规硶锛氱洰褰曞垹闄ゆ垚鍔?);
    }
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`澶囩敤鏂规硶锛氭瀯寤虹洰褰曞凡鍒涘缓: ${buildDir}`);
  } catch (altError) {
    console.error('澶囩敤鏂规硶涔熷け璐?', altError.message);
  }
}
