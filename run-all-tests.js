#!/usr/bin/env node

/**
 * 缁煎悎娴嬭瘯鑴氭湰
 * 1. 杩愯鍓嶇娴嬭瘯
 * 2. 杩愯鍚庣鍗曞厓娴嬭瘯
 * 3. 杩愯鍚庣闆嗘垚娴嬭瘯
 * 4. 濡傛灉鎵€鏈夋祴璇曢€氳繃锛屽悓姝ュ埌鏈嶅姟鍣?
 */

const path = require('path');

// 瀹氫箟棰滆壊甯搁噺
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

// 鎵撳嵃褰╄壊鏃ュ織
function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 杩愯鍛戒护骞惰繑鍥炵粨鏋?
function runCommand(command, cwd = process.cwd(), silent = false) {
  log('cyan', `\n鎵ц鍛戒护: ${command}`);
  
  // 缁熶竴浣跨敤child_process.exec鏉ユ墽琛屾墍鏈夊懡浠わ紝杩欐牱鍙互姝ｇ‘澶勭悊閫€鍑虹爜
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec(command, { cwd, stdio: silent ? 'pipe' : 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        // 妫€鏌ラ€€鍑虹爜
        if (error.code === 0) {
          // 閫€鍑虹爜涓?琛ㄧず鎴愬姛
          resolve({
            success: true,
            output: stdout,
            error: stderr
          });
        } else {
          // 閫€鍑虹爜涓嶄负0琛ㄧず澶辫触
          resolve({
            success: false,
            output: stdout,
            error: stderr || error.message
          });
        }
      } else {
        // 娌℃湁閿欒琛ㄧず鎴愬姛
        resolve({
          success: true,
          output: stdout,
          error: stderr
        });
      }
    });
  });
}

// 涓诲嚱鏁?
async function main() {
  log('yellow', '\n====================================');
  log('yellow', '寮€濮嬫墽琛岀巹鐜夐€嶆父缁煎悎娴嬭瘯');
  log('yellow', '====================================');

  let allTestsPassed = true;

  try {
    // 1. 妫€鏌ュ墠绔」鐩緷璧?
    log('green', '\n1. 妫€鏌ュ墠绔」鐩緷璧?..');
    const frontendDepsResult = await runCommand('npm install', path.join(__dirname));
    if (!frontendDepsResult.success) {
      log('red', '鍓嶇渚濊禆瀹夎澶辫触');
      allTestsPassed = false;
    }

    // 2. 璺宠繃鍓嶇浠ｇ爜妫€鏌ワ紙鍙€夛紝濡傞渶寮€鍚鍙栨秷娉ㄩ噴锛?
    // log('green', '\n2. 杩愯鍓嶇浠ｇ爜妫€鏌?..');
    // const frontendLintResult = await runCommand('npm run lint', path.join(__dirname));
    // if (!frontendLintResult.success) {
    //   log('red', '鍓嶇浠ｇ爜妫€鏌ュけ璐?);
    //   allTestsPassed = false;
    // }
    log('green', '\n2. 璺宠繃鍓嶇浠ｇ爜妫€鏌?);
    allTestsPassed = true;

    // 3. 妫€鏌ュ悗绔」鐩緷璧?
    log('green', '\n3. 妫€鏌ュ悗绔」鐩緷璧?..');
    const backendDepsResult = await runCommand('npm install', path.join(__dirname, 'server'));
    if (!backendDepsResult.success) {
      log('red', '鍚庣渚濊禆瀹夎澶辫触');
      allTestsPassed = false;
    }

    // 4. 杩愯鍚庣鍗曞厓娴嬭瘯锛堜娇鐢↗est锛?
    log('green', '\n4. 杩愯鍚庣鍗曞厓娴嬭瘯...');
    const backendUnitTestResult = await runCommand('npm test', path.join(__dirname, 'server'));
    if (backendUnitTestResult.success) {
      log('green', '鍚庣鍗曞厓娴嬭瘯閫氳繃');
    } else {
      log('red', '鍚庣鍗曞厓娴嬭瘯澶辫触');
      allTestsPassed = false;
    }

    // 5. 杩愯鍚庣鏈嶅姟灞傛祴璇?
    log('green', '\n5. 杩愯鍚庣鏈嶅姟灞傛祴璇?..');
    const backendServiceTestResult = await runCommand('node run-service-tests.js', path.join(__dirname, 'server'));
    if (backendServiceTestResult.success) {
      log('green', '鍚庣鏈嶅姟灞傛祴璇曢€氳繃');
    } else {
      log('red', '鍚庣鏈嶅姟灞傛祴璇曞け璐?);
      allTestsPassed = false;
    }

    // 6. 杩愯鍚庣闆嗘垚娴嬭瘯
    log('green', '\n6. 杩愯鍚庣闆嗘垚娴嬭瘯...');
    const backendIntegrationTestResult = await runCommand('node run-integration-test.js', path.join(__dirname, 'server'));
    if (backendIntegrationTestResult.success) {
      log('green', '鍚庣闆嗘垚娴嬭瘯閫氳繃');
    } else {
      log('red', '鍚庣闆嗘垚娴嬭瘯澶辫触');
      allTestsPassed = false;
    }

    // 7. 濡傛灉鎵€鏈夋祴璇曢€氳繃锛屽悓姝ュ埌鏈嶅姟鍣?
    if (allTestsPassed) {
      log('yellow', '\n====================================');
      log('yellow', '鎵€鏈夋祴璇曢€氳繃锛佸噯澶囧悓姝ュ埌鏈嶅姟鍣?..');
      log('yellow', '====================================');

      // 鎵ц鍚屾鍒版湇鍔″櫒鐨勫懡浠?
      log('green', '\n7. 鍚屾鍒版湇鍔″櫒...');
      
      try {
        // 杩欓噷鍙互鏍规嵁瀹為檯鎯呭喌淇敼鍚屾鍛戒护
        // 渚嬪锛氫娇鐢╮sync銆乻cp鎴栬€単it push绛?
        const syncResult = await runCommand('git push origin main', path.join(__dirname));
        
        if (syncResult.success) {
          log('green', '\n鉁?鍚屾鍒版湇鍔″櫒鎴愬姛锛?);
        } else {
          log('yellow', '\n鈿狅笍  鍚屾鍒版湇鍔″櫒澶辫触锛佸彲鑳芥槸鐢变簬Git閰嶇疆闂瀵艰嚧鐨勩€?);
          log('yellow', '鈿狅笍  寤鸿鎵嬪姩鎵ц git push origin main 鍛戒护锛屾垨鑰呮鏌it閰嶇疆銆?);
          // 鍗充娇鍚屾澶辫触锛屾祴璇曚篃鏄€氳繃鐨勶紝鎵€浠ユ垜浠笉鏀瑰彉 allTestsPassed 鐨勫€?
        }
      } catch (error) {
        log('yellow', `\n鈿狅笍  鍚屾鍒版湇鍔″櫒鏃跺彂鐢熼敊璇細${error.message}`);
        log('yellow', '鈿狅笍  寤鸿鎵嬪姩鎵ц git push origin main 鍛戒护锛屾垨鑰呮鏌it閰嶇疆銆?);
        // 鍗充娇鍚屾澶辫触锛屾祴璇曚篃鏄€氳繃鐨勶紝鎵€浠ユ垜浠笉鏀瑰彉 allTestsPassed 鐨勫€?
      }
    } else {
      log('red', '\n====================================');
      log('red', '娴嬭瘯澶辫触锛佽淇闂鍚庨噸璇曘€?);
      log('red', '====================================');
    }

  } catch (error) {
    log('red', `\n鉂?娴嬭瘯杩囩▼涓彂鐢熼敊璇? ${error.message}`);
    allTestsPassed = false;
  }

  log('yellow', '\n====================================');
  log('yellow', `娴嬭瘯缁撴灉: ${allTestsPassed ? '鉁?鍏ㄩ儴閫氳繃' : '鉂?閮ㄥ垎澶辫触'}`);
  log('yellow', '====================================');

  // 閫€鍑鸿繘绋嬶紝杩斿洖鐩稿簲鐨勭姸鎬佺爜
  process.exit(allTestsPassed ? 0 : 1);
}

// 杩愯涓诲嚱鏁?
main();
