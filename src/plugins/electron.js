// Electron鍔熻兘鎻掍欢

/**
 * Vue Electron鎻掍欢
 * 鐢ㄤ簬鍦╒ue搴旂敤涓畨鍏ㄥ湴璁块棶Electron鍔熻兘
 */
export default {
  install: (app) => {
    // 妫€娴嬫槸鍚﹀湪Electron鐜涓?    const isElectron = typeof window !== 'undefined' && 
                       window.electronAPI && 
                       window.electronAPI.isElectron
    
    // 瀹氫箟Electron鍔熻兘瀵硅薄
    const electronPlugin = {
      // 鐜妫€娴?      isElectron,
      
      // 骞冲彴淇℃伅
      platform: isElectron ? window.electronAPI.getPlatform() : null,
      
      // 搴旂敤淇℃伅
      appInfo: isElectron ? window.electronAPI.getAppInfo() : null,
      
      // 鍙戦€佹秷鎭埌涓昏繘绋?      sendMessage: (channel, data) => {
        if (isElectron) {
          window.electronAPI.sendMessage(channel, data)
          return true
        }
        console.warn('Electron鍔熻兘涓嶅彲鐢? 涓嶅湪Electron鐜涓?)
        return false
      },
      
      // 鐩戝惉鏉ヨ嚜涓昏繘绋嬬殑娑堟伅
      onMessage: (channel, callback) => {
        if (isElectron) {
          window.electronAPI.onMessage(channel, callback)
          return true
        }
        console.warn('Electron鍔熻兘涓嶅彲鐢? 涓嶅湪Electron鐜涓?)
        return false
      },
      
      // 涓嬭浇鏂囦欢锛圗lectron鐜涓撶敤锛?      downloadFile: (url, filename) => {
        return new Promise((resolve, reject) => {
          if (!isElectron) {
            reject(new Error('涓嬭浇鍔熻兘浠呭湪Electron鐜涓彲鐢?))
            return
          }
          
          // 鐢熸垚涓嬭浇ID
          const downloadId = Date.now().toString()
          
          // 涓存椂瀛樺偍progress鍥炶皟
          const progressCallbacks = new Map()
          
          // 鐩戝惉涓嬭浇杩涘害
          window.electronAPI.onMessage('download_progress', (data) => {
            if (data.downloadId === downloadId) {
              const callbacks = progressCallbacks.get(downloadId)
              if (callbacks && callbacks.onProgress) {
                callbacks.onProgress(data.progress)
              }
            }
          })
          
          // 鍙戦€佷笅杞借姹?          window.electronAPI.sendMessage('download_request', { url, filename })
          
          // 杩斿洖鎺у埗瀵硅薄
          resolve({
            downloadId,
            // 鎻愪緵鏂规硶鏉ョ洃鍚繘搴?            onProgress: (callback) => {
              if (!progressCallbacks.has(downloadId)) {
                progressCallbacks.set(downloadId, {})
              }
              progressCallbacks.get(downloadId).onProgress = callback
              return this // 鏀寔閾惧紡璋冪敤
            },
            // 鍙栨秷涓嬭浇
            cancel: () => {
              window.electronAPI.sendMessage('cancel_download', { downloadId })
              progressCallbacks.delete(downloadId)
              return true
            }
          })
        })
      },
      
      // 鏄剧ず绯荤粺閫氱煡锛圗lectron鐜妯℃嫙锛?      showNotification: (title, options) => {
        if (isElectron) {
          // 鍦‥lectron鐜涓紝鍙互閫氳繃IPC鍙戦€佸埌涓昏繘绋嬫樉绀哄師鐢熼€氱煡
          window.electronAPI.sendMessage('show_notification', { title, options })
          return true
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
          // 鍦ㄦ祻瑙堝櫒鐜涓紝灏濊瘯浣跨敤Web Notification API
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
    
    // 鍏ㄥ眬灞炴€?    app.config.globalProperties.$electron = electronPlugin
    
    // 鎻愪緵缁欑粍鍚堝紡API浣跨敤
    app.provide('electron', electronPlugin)
  }
}
