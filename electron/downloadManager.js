const { ipcMain } = require('electron')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

class DownloadManager {
  constructor() {
    this.downloads = new Map() // 存储所有下载任务
    this.registerIpcHandlers()
  }

  // 注册IPC事件处理程序
  registerIpcHandlers() {
    ipcMain.on('download_request', (event, { url, filename }) => {
      const downloadId = this.startDownload(url, filename, (progress) => {
        event.sender.send('download_progress', { downloadId, progress })
      })
      
      event.sender.send('download_response', { success: true, downloadId })
    })

    ipcMain.on('cancel_download', (event, { downloadId }) => {
      const result = this.cancelDownload(downloadId)
      event.sender.send('cancel_download_response', { success: result })
    })
  }

  // 开始下载文件
  startDownload(url, filename, progressCallback) {
    const downloadId = Date.now().toString()
    const downloadPath = this.getDownloadPath()
    const filePath = path.join(downloadPath, filename)
    
    // 确保下载目录存在
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }

    // 记录下载任务
    const downloadInfo = {
      id: downloadId,
      url,
      filename,
      filePath,
      startTime: Date.now(),
      bytesDownloaded: 0,
      totalBytes: 0,
      progress: 0,
      completed: false,
      error: null
    }

    this.downloads.set(downloadId, downloadInfo)
    
    // 选择适当的协议
    const httpModule = url.startsWith('https') ? https : http
    
    // 发起请求
    const request = httpModule.get(url, (response) => {
      // 检查响应状态
      if (response.statusCode !== 200) {
        this.handleDownloadError(downloadId, `服务器返回错误: ${response.statusCode}`)
        return
      }

      // 获取文件大小
      const contentLength = response.headers['content-length']
      downloadInfo.totalBytes = contentLength ? parseInt(contentLength, 10) : 0
      
      // 创建文件写入流
      const fileStream = fs.createWriteStream(filePath)
      
      // 监听数据事件
      response.on('data', (chunk) => {
        downloadInfo.bytesDownloaded += chunk.length
        if (downloadInfo.totalBytes > 0) {
          downloadInfo.progress = (downloadInfo.bytesDownloaded / downloadInfo.totalBytes) * 100
        }
        
        // 更新进度
        if (progressCallback) {
          progressCallback(downloadInfo.progress)
        }
      })
      
      // 管道数据到文件
      response.pipe(fileStream)
      
      // 监听完成事件
      fileStream.on('finish', () => {
        downloadInfo.completed = true
        downloadInfo.progress = 100
        
        if (progressCallback) {
          progressCallback(100)
        }
        
        console.log(`下载完成: ${filename}`)
        
        // 完成后保留记录一段时间
        setTimeout(() => {
          if (this.downloads.get(downloadId)?.completed) {
            this.downloads.delete(downloadId)
          }
        }, 3600000) // 1小时后删除完成的下载记录
      })
      
      // 监听错误事件
      fileStream.on('error', (error) => {
        this.handleDownloadError(downloadId, error.message)
      })
    })
    
    // 监听请求错误
    request.on('error', (error) => {
      this.handleDownloadError(downloadId, error.message)
    })
    
    // 存储请求对象以便取消
    downloadInfo.request = request
    
    return downloadId
  }

  // 取消下载
  cancelDownload(downloadId) {
    const downloadInfo = this.downloads.get(downloadId)
    
    if (!downloadInfo) {
      console.log(`找不到下载任务: ${downloadId}`)
      return false
    }

    try {
      // 中止请求
      if (downloadInfo.request) {
        downloadInfo.request.abort()
      }
      
      // 删除部分下载的文件
      if (fs.existsSync(downloadInfo.filePath)) {
        fs.unlinkSync(downloadInfo.filePath)
      }
      
      // 移除下载记录
      this.downloads.delete(downloadId)
      console.log(`已取消下载: ${downloadInfo.filename}`)
      return true
    } catch (error) {
      console.error(`取消下载失败: ${error.message}`)
      return false
    }
  }

  // 处理下载错误
  handleDownloadError(downloadId, errorMessage) {
    const downloadInfo = this.downloads.get(downloadId)
    
    if (downloadInfo) {
      downloadInfo.error = errorMessage
      
      // 尝试删除部分下载的文件
      if (fs.existsSync(downloadInfo.filePath)) {
        try {
          fs.unlinkSync(downloadInfo.filePath)
        } catch (e) {
          console.error(`删除部分下载文件失败: ${e.message}`)
        }
      }
      
      console.error(`下载失败 [${downloadId}]: ${errorMessage}`)
      
      // 保留错误记录一段时间
      setTimeout(() => {
        this.downloads.delete(downloadId)
      }, 1800000) // 30分钟后删除错误记录
    }
  }

  // 获取下载路径
  getDownloadPath() {
    // 返回用户下载目录或应用数据目录
    const { app } = require('electron')
    const userDataPath = app.getPath('userData')
    return path.join(userDataPath, 'downloads')
  }

  // 获取所有下载任务
  getAllDownloads() {
    return Array.from(this.downloads.values())
  }
}

// 导出单例实例
module.exports = new DownloadManager()