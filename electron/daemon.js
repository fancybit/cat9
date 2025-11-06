const { exec } = require('child_process')
const path = require('path')

class DaemonManager {
  constructor() {
    this.isRunning = false
    this.daemonPath = null
    this.process = null
  }

  // 启动守护进程
  startDaemon() {
    console.log('尝试启动守护进程...')
    
    // 确定守护进程路径
    this.daemonPath = this.getDaemonPath()
    
    if (!this.daemonPath) {
      console.error('无法找到守护进程可执行文件')
      return false
    }

    try {
      this.process = exec(`"${this.daemonPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`守护进程错误: ${error.message}`)
          this.isRunning = false
          return
        }
        if (stderr) {
          console.error(`守护进程标准错误: ${stderr}`)
        }
        if (stdout) {
          console.log(`守护进程输出: ${stdout}`)
        }
      })

      this.process.on('close', (code) => {
        console.log(`守护进程已退出，退出码 ${code}`)
        this.isRunning = false
      })

      this.isRunning = true
      console.log('守护进程已启动')
      return true
    } catch (error) {
      console.error('启动守护进程失败:', error)
      return false
    }
  }

  // 停止守护进程
  stopDaemon() {
    if (!this.isRunning || !this.process) {
      console.log('守护进程未运行')
      return false
    }

    try {
      // 根据平台使用适当的终止方式
      if (process.platform === 'win32') {
        this.process.kill('SIGTERM')
      } else {
        this.process.kill()
      }
      this.isRunning = false
      this.process = null
      console.log('守护进程已停止')
      return true
    } catch (error) {
      console.error('停止守护进程失败:', error)
      return false
    }
  }

  // 检查守护进程状态
  getStatus() {
    return {
      isRunning: this.isRunning,
      daemonPath: this.daemonPath
    }
  }

  // 获取守护进程路径
  getDaemonPath() {
    // 根据平台确定守护进程路径
    const platform = process.platform
    let daemonName = 'cat9-daemon'
    
    if (platform === 'win32') {
      daemonName += '.exe'
    } else if (platform === 'darwin') {
      daemonName += '.app'
    }
    
    // 构建守护进程的完整路径
    // 注意：这需要根据实际项目结构进行调整
    const potentialPaths = [
      path.join(__dirname, '..', 'daemon', daemonName),
      path.join(process.resourcesPath, 'daemon', daemonName)
    ]
    
    // 简单地返回第一个可能的路径
    // 在实际应用中，应该检查文件是否存在
    return potentialPaths[0]
  }
}

// 导出单例实例
module.exports = new DaemonManager()