const { app, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

// 璁剧疆璇︾粏鏃ュ織璁板綍锛屼娇鐢ㄥ簲鐢ㄧ▼搴忕洰褰曚笅鐨勫浐瀹氫綅缃紝姣忔鍚姩鏃跺垱寤烘柊鐨勬棩蹇楁枃浠?const logFile = path.join(__dirname, 'app.log')

// 绠€鍗曠殑鏃ュ織鍑芥暟锛岀‘淇濇棩蹇楄兘姝ｅ父鍐欏叆
function logMessage(message) {
  const timestamp = new Date().toISOString()
  const logEntry = `${timestamp}: ${message}\n`
  console.log(logEntry)
  try {
    fs.appendFileSync(logFile, logEntry)
  } catch (err) {
    console.error('Failed to write log:', err)
  }
}

// 娓呯┖鏃ュ織鏂囦欢
try {
  fs.writeFileSync(logFile, '')
  console.log('Log file cleared')
} catch (err) {
  console.error('Failed to clear log file:', err)
}

// 娣诲姞鍩虹鏃ュ織
logMessage('Application started')
logMessage('Background.js file loaded')

// 寮曞叆瀹堟姢杩涚▼鍜屼笅杞界鐞嗗櫒
//let daemonManager
//let downloadManager

try {
  // 灏濊瘯鍔犺浇鍘熸湁鐨勫姛鑳芥ā鍧楋紝濡傛灉涓嶅瓨鍦ㄥ垯蹇界暐
  //daemonManager = require('./electron/daemon')
  //downloadManager = require('./electron/downloadManager')
  logMessage('Feature modules skipped')
} catch (error) {
  logMessage('Feature modules not found: ' + error.message)
}

// 澶勭悊Windows瀹夎鍜屾洿鏂?- 娣诲姞閿欒澶勭悊浠ラ槻姝㈡ā鍧楃己澶辨椂宕╂簝
try {
  // 浠呭湪妯″潡瀛樺湪鏃舵墠灏濊瘯鍔犺浇鍜屼娇鐢?  if (require('electron-squirrel-startup')) {
    app.quit()
  }
} catch (error) {
  logMessage('electron-squirrel-startup妯″潡鏈壘鍒帮紝浣嗗簲鐢ㄥ皢缁х画杩愯: ' + error.message)
}

// 鍒涘缓绐楀彛鍑芥暟
function createWindow () {
  logMessage('Starting to create browser window')
  try {
    // 鍒涘缓娴忚鍣ㄧ獥鍙?    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 360, // 鏈€灏忓搴︼紝閫傞厤绉诲姩璁惧瑙嗗彛
      minHeight: 600, // 鏈€灏忛珮搴?      backgroundColor: '#1b2838', // 涓庡簲鐢ㄤ富棰樿壊涓€鑷?      show: false, // 鍏堥殣钘忕獥鍙?      icon: path.join(__dirname, 'public', 'favicon.ico'), // 璁剧疆搴旂敤鍥炬爣
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'electron/preload.js'),
        zoomFactor: 1.0, // 榛樿缂╂斁姣斾緥
      }
    })

    logMessage('Window created successfully')

    // 绐楀彛鍑嗗濂藉悗鍐嶆樉绀猴紝閬垮厤闂儊
    win.once('ready-to-show', () => {
      win.show()
      logMessage('Window shown')
    })

    // 鍔犺浇Vue搴旂敤
    // 鍦ㄥ紑鍙戠幆澧冧腑鍔犺浇http://localhost:8080锛屽湪鐢熶骇鐜涓姞杞絠ndex.html
    try {
      logMessage(`Current directory: ${__dirname}`)
      logMessage(`Resources path: ${process.resourcesPath}`)
      
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        logMessage(`Development environment, trying to load dev server: ${process.env.WEBPACK_DEV_SERVER_URL}`)
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL).then(() => {
          logMessage('Dev server loaded successfully')
        }).catch(error => {
          logMessage(`Failed to load dev server: ${error.message}`)
          // 寮€鍙戠幆澧冨姞杞藉け璐ユ椂锛屽皾璇曞姞杞芥湰鍦版瀯寤烘枃浠朵綔涓哄閫?          const fallbackPath = path.join(__dirname, 'dist', 'index.html')
          logMessage(`Trying to load fallback file: ${fallbackPath}`)
          if (fs.existsSync(fallbackPath)) {
            win.loadFile(fallbackPath)
          }
        })
        // 寮€鍙戠幆澧冩墦寮€寮€鍙戣€呭伐鍏?        if (!process.env.IS_TEST) win.webContents.openDevTools()
      } else {
        // 鐢熶骇鐜灏濊瘯澶氱鍙兘鐨勮矾寰勶紝澧炲姞鏇村鏃ュ織鍜岃矾寰勬鏌?        const possiblePaths = [
          path.join(__dirname, 'dist', 'index.html'),
          path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
          path.join(process.resourcesPath, 'dist', 'index.html'),
          path.join(__dirname, 'index.html')
        ]
        
        // 妫€鏌ュ悇鐩綍鏄惁瀛樺湪
        logMessage('Checking if critical directories exist:')
        logMessage(`__dirname/dist: ${fs.existsSync(path.join(__dirname, 'dist'))}`)
        logMessage(`process.resourcesPath/app/dist: ${fs.existsSync(path.join(process.resourcesPath, 'app', 'dist'))}`)
        logMessage(`process.resourcesPath/dist: ${fs.existsSync(path.join(process.resourcesPath, 'dist'))}`)
        
        let foundPath = null
        for (const testPath of possiblePaths) {
          logMessage(`Checking if path exists: ${testPath}`)
          if (fs.existsSync(testPath)) {
            foundPath = testPath
            logMessage(`Found valid index.html path: ${testPath}`)
            // 妫€鏌ヨ璺緞涓嬫槸鍚︽湁app.js绛夊叧閿祫婧?            const distDir = path.dirname(testPath)
            const appJsPath = path.join(distDir, 'app.js')
            const vendorsJsPath = path.join(distDir, 'chunk-vendors.js')
            logMessage(`Checking critical resources in ${distDir} directory:`)
            logMessage(`app.js: ${fs.existsSync(appJsPath)}`)
            logMessage(`chunk-vendors.js: ${fs.existsSync(vendorsJsPath)}`)
            break
          }
        }
        
        if (foundPath) {
          logMessage(`Production environment, loading HTML: ${foundPath}`)
          win.loadFile(foundPath).then(() => {
            logMessage('HTML loaded successfully')
          }).catch(error => {
            logMessage(`Failed to load HTML: ${error.message}`)
            // 濡傛灉鏂囦欢鍔犺浇澶辫触锛屽皾璇曚娇鐢║RL鏂瑰紡
            const fileUrl = `file://${foundPath}`
            logMessage(`Trying to load using URL: ${fileUrl}`)
            win.loadURL(fileUrl).catch(urlError => {
              logMessage(`URL loading also failed: ${urlError.message}`)
            })
          })
        } else {
          logMessage('Error: Could not find index.html file!')
          // 鏄剧ず閿欒椤甸潰锛屽鍔犳洿澶氳皟璇曚俊鎭?          const errorHtml = `
            <html>
              <head><title>Error - Failed to load application</title></head>
              <body style="font-family: Arial; margin: 40px;">
                <h1>Application loading failed</h1>
                <p>Could not find index.html file. Please check if the application is fully installed.</p>
                <p>Attempted paths:</p>
                <ul>
                  ${possiblePaths.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <p>Current directory: ${__dirname}</p>
                <p>Resources directory: ${process.resourcesPath}</p>
                <p>Directory existence check:</p>
                <ul>
                  <li>__dirname/dist: ${fs.existsSync(path.join(__dirname, 'dist'))}</li>
                  <li>process.resourcesPath/app/dist: ${fs.existsSync(path.join(process.resourcesPath, 'app', 'dist'))}</li>
                  <li>process.resourcesPath/dist: ${fs.existsSync(path.join(process.resourcesPath, 'dist'))}</li>
                </ul>
              </body>
            </html>
          `
          win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
        }
      }
    } catch (error) {
      logMessage(`Critical error when loading application: ${error.message}`)
      console.error(error)
      // 鏄剧ず涓ラ噸閿欒椤甸潰
      const criticalErrorHtml = `
        <html>
          <head><title>Critical Error</title></head>
          <body style="font-family: Arial; margin: 40px; color: red;">
            <h1>Critical error during application startup</h1>
            <p>Error message: ${error.message}</p>
            <p>Please check application installation or contact developer.</p>
          </body>
        </html>
      `
      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(criticalErrorHtml)}`)
    }
    
    // 鎵撳嵃鏃ュ織
    logMessage('Window creation in progress...')
    
    // 娣诲姞閿欒澶勭悊
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      logMessage(`Page load failed: ${errorDescription} (code: ${errorCode})`)
      logMessage(`URL: ${validatedURL}`)
      console.error(`Load failed: ${errorDescription} (code: ${errorCode})`)
      console.error(`URL: ${validatedURL}`)
    })
    
    win.webContents.on('did-finish-load', () => {
      logMessage('Page loaded completely')
      console.log('Page loaded completely')
    })
    
    // 鐩戝惉鎺у埗鍙版秷鎭?    win.webContents.on('console-message', (event, level, message) => {
      logMessage(`Web console: ${message}`)
      console.log(`Web console: ${message}`)
    })
    
    // 鐩戝惉绐楀彛澶у皬鍙樺寲锛屼互渚胯皟璇曞搷搴斿紡璁捐
    win.on('resize', () => {
      const { width, height } = win.getBounds()
      logMessage(`Window size changed: ${width}x${height}`)
      console.log(`Window size changed: ${width}x${height}`)
    })
    
    // 鍏佽缂╂斁
    win.webContents.on('did-finish-load', () => {
      // 鍚敤缂╂斁鎺у埗
      win.webContents.setVisualZoomLevelLimits(0.5, 2.0)
    })

    // 鐩戝惉绐楀彛鍏抽棴浜嬩欢
    win.on('closed', () => {
      logMessage('Window closed')
    })

  } catch (error) {
    logMessage(`Error during window creation: ${error.message}`)
    console.error(error)
  }
}

// 妫€鏌pp瀵硅薄鐘舵€?logMessage(`App ready state: ${app.isReady()}`)

// 娣诲姞绔嬪嵆鎵ц鐨勬棩蹇楁潵楠岃瘉鎵ц娴佺▼
setTimeout(() => {
  logMessage('1 second timeout callback executed - event loop working')
}, 1000)

// Electron 浼氬湪鍒濆鍖栧畬鎴愬苟涓斿噯澶囧ソ鍒涘缓娴忚鍣ㄧ獥鍙ｆ椂璋冪敤杩欎釜鏂规硶
// 閮ㄥ垎 API 鍦?ready 浜嬩欢瑙﹀彂鍚庢墠鑳戒娇鐢?logMessage('Setting up ready event listener')
app.on('ready', () => {
  logMessage('Ready event triggered')
  try {
    logMessage('Preparing to call createWindow()')
    createWindow()
    logMessage('createWindow() call completed')
  } catch (error) {
    logMessage(`Failed to create window: ${error.message}`)
    console.error('Failed to create window:', error)
  }
})

logMessage('Setting up activate event listener')
app.on('activate', function () {
  logMessage('Activate event triggered')
  // 鍦?macOS 涓婏紝褰撶偣鍑?dock 鍥炬爣骞朵笖娌℃湁鍏朵粬绐楀彛鎵撳紑鏃讹紝閫氬父浼氶噸鏂板垱寤轰竴涓獥鍙?  if (BrowserWindow.getAllWindows().length === 0) {
    logMessage('No active windows, creating new window')
    createWindow()
  }
})

// 褰撴墍鏈夌獥鍙ｉ兘鍏抽棴鏃堕€€鍑哄簲鐢?app.on('window-all-closed', function () {
  logMessage('鎵€鏈夌獥鍙ｅ凡鍏抽棴')
  // 鍦?macOS 涓婏紝闄ら潪鐢ㄦ埛鐢?Cmd + Q 纭畾鍦伴€€鍑猴紝鍚﹀垯缁濆ぇ閮ㄥ垎搴旂敤鍙婂叾鑿滃崟鏍忎細淇濇寔婵€娲?  if (process.platform !== 'darwin') {
    logMessage('搴旂敤鍑嗗閫€鍑?)
    app.quit()
  }
})

// 鐩戝惉搴旂敤閫€鍑轰簨浠?app.on('will-quit', () => {
  logMessage('搴旂敤鍗冲皢閫€鍑?)
})

// 鐩戝惉鏈崟鑾风殑寮傚父
process.on('uncaughtException', (error) => {
  logMessage(`鏈崟鑾风殑寮傚父: ${error.message}`)
  logMessage(`鍫嗘爤璺熻釜: ${error.stack}`)
  console.error('鏈崟鑾风殑寮傚父:', error)
})

// 鐩戝惉鏈鐞嗙殑Promise鎷掔粷
process.on('unhandledRejection', (reason) => {
  logMessage(`鏈鐞嗙殑Promise鎷掔粷: ${reason}`)
  console.error('鏈鐞嗙殑Promise鎷掔粷:', reason)
})

// 鍦ㄨ繖涓枃浠朵腑锛屼綘鍙互缁啓搴旂敤鍓╀笅涓昏繘绋嬩唬鐮?// 涔熷彲浠ユ媶鍒嗘垚鍑犱釜鏂囦欢锛岀劧鍚庣敤 require 瀵煎叆
