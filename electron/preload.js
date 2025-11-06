const { contextBridge, ipcRenderer } = require('electron')

// 使用contextBridge安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：发送消息到主进程
  sendMessage: (channel, data) => {
    // 定义允许的通道以提高安全性
    const validChannels = ['app_message', 'download_request', 'daemon_status']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  
  // 示例：接收来自主进程的消息
  onMessage: (channel, callback) => {
    const validChannels = ['app_response', 'download_progress', 'daemon_event']
    if (validChannels.includes(channel)) {
      // 避免内存泄漏，移除所有监听器后再添加新的
      ipcRenderer.removeAllListeners(channel)
      ipcRenderer.on(channel, (event, ...args) => callback(...args))
    }
  },
  
  // 检查是否在Electron环境中
  isElectron: true,
  
  // 获取平台信息
  getPlatform: () => process.platform,
  
  // 获取应用信息
  getAppInfo: () => ({
    name: '玄玉逍游',
    version: '1.0.0'
  })
})

// 全局错误处理
window.onerror = (message, source, lineno, colno, error) => {
  console.error('渲染进程错误:', message, source, lineno, colno, error)
  // 可以通过IPC发送错误到主进程进行日志记录
  try {
    ipcRenderer.send('error_log', {
      message,
      source,
      lineno,
      colno,
      stack: error?.stack
    })
  } catch (e) {
    console.error('发送错误日志失败:', e)
  }
}

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason)
  try {
    ipcRenderer.send('error_log', {
      message: 'Unhandled Promise Rejection',
      reason: event.reason?.toString(),
      stack: event.reason?.stack
    })
  } catch (e) {
    console.error('发送Promise错误日志失败:', e)
  }
})