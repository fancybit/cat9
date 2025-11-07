const { app, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

// 设置详细日志记录，使用应用程序目录下的固定位置，每次启动时创建新的日志文件
const logFile = path.join(__dirname, 'app.log')

// 简单的日志函数，确保日志能正常写入
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

// 清空日志文件
try {
  fs.writeFileSync(logFile, '')
  console.log('Log file cleared')
} catch (err) {
  console.error('Failed to clear log file:', err)
}

// 添加基础日志
logMessage('Application started')
logMessage('Background.js file loaded')

// 引入守护进程和下载管理器
//let daemonManager
//let downloadManager

try {
  // 尝试加载原有的功能模块，如果不存在则忽略
  //daemonManager = require('./electron/daemon')
  //downloadManager = require('./electron/downloadManager')
  logMessage('Feature modules skipped')
} catch (error) {
  logMessage('Feature modules not found: ' + error.message)
}

// 处理Windows安装和更新 - 添加错误处理以防止模块缺失时崩溃
try {
  // 仅在模块存在时才尝试加载和使用
  if (require('electron-squirrel-startup')) {
    app.quit()
  }
} catch (error) {
  logMessage('electron-squirrel-startup模块未找到，但应用将继续运行: ' + error.message)
}

// 创建窗口函数
function createWindow () {
  logMessage('Starting to create browser window')
  try {
    // 创建浏览器窗口
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 360, // 最小宽度，适配移动设备视口
      minHeight: 600, // 最小高度
      backgroundColor: '#1b2838', // 与应用主题色一致
      show: false, // 先隐藏窗口
      icon: path.join(__dirname, 'public', 'favicon.ico'), // 设置应用图标
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'electron/preload.js'),
        zoomFactor: 1.0, // 默认缩放比例
      }
    })

    logMessage('Window created successfully')

    // 窗口准备好后再显示，避免闪烁
    win.once('ready-to-show', () => {
      win.show()
      logMessage('Window shown')
    })

    // 加载Vue应用
    // 在开发环境中加载http://localhost:8080，在生产环境中加载index.html
    try {
      logMessage(`Current directory: ${__dirname}`)
      logMessage(`Resources path: ${process.resourcesPath}`)
      
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        logMessage(`Development environment, trying to load dev server: ${process.env.WEBPACK_DEV_SERVER_URL}`)
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL).then(() => {
          logMessage('Dev server loaded successfully')
        }).catch(error => {
          logMessage(`Failed to load dev server: ${error.message}`)
          // 开发环境加载失败时，尝试加载本地构建文件作为备选
          const fallbackPath = path.join(__dirname, 'dist', 'index.html')
          logMessage(`Trying to load fallback file: ${fallbackPath}`)
          if (fs.existsSync(fallbackPath)) {
            win.loadFile(fallbackPath)
          }
        })
        // 开发环境打开开发者工具
        if (!process.env.IS_TEST) win.webContents.openDevTools()
      } else {
        // 生产环境尝试多种可能的路径，增加更多日志和路径检查
        const possiblePaths = [
          path.join(__dirname, 'dist', 'index.html'),
          path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
          path.join(process.resourcesPath, 'dist', 'index.html'),
          path.join(__dirname, 'index.html')
        ]
        
        // 检查各目录是否存在
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
            // 检查该路径下是否有app.js等关键资源
            const distDir = path.dirname(testPath)
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
            // 如果文件加载失败，尝试使用URL方式
            const fileUrl = `file://${foundPath}`
            logMessage(`Trying to load using URL: ${fileUrl}`)
            win.loadURL(fileUrl).catch(urlError => {
              logMessage(`URL loading also failed: ${urlError.message}`)
            })
          })
        } else {
          logMessage('Error: Could not find index.html file!')
          // 显示错误页面，增加更多调试信息
          const errorHtml = `
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
      // 显示严重错误页面
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
    
    // 打印日志
    logMessage('Window creation in progress...')
    
    // 添加错误处理
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
    
    // 监听控制台消息
    win.webContents.on('console-message', (event, level, message) => {
      logMessage(`Web console: ${message}`)
      console.log(`Web console: ${message}`)
    })
    
    // 监听窗口大小变化，以便调试响应式设计
    win.on('resize', () => {
      const { width, height } = win.getBounds()
      logMessage(`Window size changed: ${width}x${height}`)
      console.log(`Window size changed: ${width}x${height}`)
    })
    
    // 允许缩放
    win.webContents.on('did-finish-load', () => {
      // 启用缩放控制
      win.webContents.setVisualZoomLevelLimits(0.5, 2.0)
    })

    // 监听窗口关闭事件
    win.on('closed', () => {
      logMessage('Window closed')
    })

  } catch (error) {
    logMessage(`Error during window creation: ${error.message}`)
    console.error(error)
  }
}

// 检查app对象状态
logMessage(`App ready state: ${app.isReady()}`)

// 添加立即执行的日志来验证执行流程
setTimeout(() => {
  logMessage('1 second timeout callback executed - event loop working')
}, 1000)

// Electron 会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用
logMessage('Setting up ready event listener')
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
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    logMessage('No active windows, creating new window')
    createWindow()
  }
})

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', function () {
  logMessage('所有窗口已关闭')
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活
  if (process.platform !== 'darwin') {
    logMessage('应用准备退出')
    app.quit()
  }
})

// 监听应用退出事件
app.on('will-quit', () => {
  logMessage('应用即将退出')
})

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  logMessage(`未捕获的异常: ${error.message}`)
  logMessage(`堆栈跟踪: ${error.stack}`)
  console.error('未捕获的异常:', error)
})

// 监听未处理的Promise拒绝
process.on('unhandledRejection', (reason) => {
  logMessage(`未处理的Promise拒绝: ${reason}`)
  console.error('未处理的Promise拒绝:', reason)
})

// 在这个文件中，你可以续写应用剩下主进程代码
// 也可以拆分成几个文件，然后用 require 导入