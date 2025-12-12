// Electron功能插件

/**
 * Vue Electron插件
 * 用于在Vue应用中安全地访问Electron功能
 */
export default {
  install: (app) => {
    // 检测是否在Electron环境中
    const isElectron = typeof window !== 'undefined' && 
                       window.electronAPI && 
                       window.electronAPI.isElectron
    
    // 定义Electron功能对象
    const electronPlugin = {
      // 环境检测
      isElectron,
      
      // 平台信息
      platform: isElectron ? window.electronAPI.getPlatform() : null,
      
      // 应用信息
      appInfo: isElectron ? window.electronAPI.getAppInfo() : null,
      
      // 发送消息到主进程
      sendMessage: (channel, data) => {
        if (isElectron) {
          window.electronAPI.sendMessage(channel, data)
          return true
        }
        console.warn('Electron功能不可用，不在Electron环境中')
        return false
      },
      
      // 监听来自主进程的消息
      onMessage: (channel, callback) => {
        if (isElectron) {
          window.electronAPI.onMessage(channel, callback)
          return true
        }
        console.warn('Electron功能不可用，不在Electron环境中')
        return false
      },
      
      // 下载文件（Electron环境专用）
      downloadFile: (url, filename) => {
        return new Promise((resolve, reject) => {
          if (!isElectron) {
            reject(new Error('下载功能仅在Electron环境中可用'))
            return
          }
          
          // 生成下载ID
          const downloadId = Date.now().toString()
          
          // 临时存储progress回调
          const progressCallbacks = new Map()
          
          // 监听下载进度
          window.electronAPI.onMessage('download_progress', (data) => {
            if (data.downloadId === downloadId) {
              const callbacks = progressCallbacks.get(downloadId)
              if (callbacks && callbacks.onProgress) {
                callbacks.onProgress(data.progress)
              }
            }
          })
          
          // 发送下载请求
          window.electronAPI.sendMessage('download_request', { url, filename })
          
          // 返回控制对象
          resolve({
            downloadId,
            // 提供方法来监听进度
            onProgress: (callback) => {
              if (!progressCallbacks.has(downloadId)) {
                progressCallbacks.set(downloadId, {})
              }
              progressCallbacks.get(downloadId).onProgress = callback
              return this // 支持链式调用
            },
            // 取消下载
            cancel: () => {
              window.electronAPI.sendMessage('cancel_download', { downloadId })
              progressCallbacks.delete(downloadId)
              return true
            }
          })
        })
      },
      
      // 显示系统通知（Electron环境优先）
      showNotification: (title, options) => {
        if (isElectron) {
          // 在Electron环境中，可以通过IPC发送到主进程显示原生通知
          window.electronAPI.sendMessage('show_notification', { title, options })
          return true
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
          // 在浏览器环境中，尝试使用Web Notification API
          if (Notification.permission === 'granted') {
            new Notification(title, options)
            return true
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification(title, options)
                return true
              }
            })
          }
        }
        return false
      }
    }
    
    // 全局属性
    app.config.globalProperties.$electron = electronPlugin
    
    // 提供给组合式API使用
    app.provide('electron', electronPlugin)
  }
}
