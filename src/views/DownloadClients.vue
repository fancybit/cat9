<template>
  <div class="download-clients">
    <div class="container">
      <h1 class="page-title">下载客户端</h1>
      
      <div class="download-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.name }}</span>
        </div>
      </div>
      
      <div class="tab-content">
        <!-- PC 客户端 -->
        <div v-if="activeTab === 'pc'" class="client-content">
          <div class="client-header">
            <div class="client-info">
              <h2>Cat9 PC 客户端</h2>
              <p>为 Windows、macOS 和 Linux 提供最佳游戏体验</p>
              <div class="client-stats">
                <div class="stat-item">
                  <span class="stat-label">最新版本</span>
                  <span class="stat-value">v1.2.3</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">发布日期</span>
                  <span class="stat-value">2024-01-15</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">文件大小</span>
                  <span class="stat-value">85.6 MB</span>
                </div>
              </div>
            </div>
            <div class="client-cover">
              <img src="/favicon.svg" alt="PC 客户端" class="client-image">
            </div>
          </div>
          
          <div class="download-options">
            <h3>选择平台</h3>
            <div class="platform-buttons">
              <button class="platform-button windows">
                <i class="icon-windows"></i>
                <span>Windows</span>
                <small>.exe</small>
              </button>
              <button class="platform-button macos">
                <i class="icon-macos"></i>
                <span>macOS</span>
                <small>.dmg</small>
              </button>
              <button class="platform-button linux">
                <i class="icon-linux"></i>
                <span>Linux</span>
                <small>.AppImage</small>
              </button>
            </div>
          </div>
          
          <div class="client-features">
            <h3>PC 客户端特色</h3>
            <div class="features-grid">
              <div class="feature-item">
                <i class="icon-gamepad"></i>
                <h4>游戏库管理</h4>
                <p>轻松管理您的游戏收藏，支持分类、筛选和搜索</p>
              </div>
              <div class="feature-item">
                <i class="icon-download"></i>
                <h4>高速下载</h4>
                <p>多线程下载技术，提供更快的游戏下载体验</p>
              </div>
              <div class="feature-item">
                <i class="icon-cloud"></i>
                <h4>云存档</h4>
                <p>自动同步游戏进度到云端，随时随地继续游戏</p>
              </div>
              <div class="feature-item">
                <i class="icon-auto-start"></i>
                <h4>开机启动</h4>
                <p>支持开机自动启动，快速访问您的游戏</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 安卓客户端 -->
        <div v-else-if="activeTab === 'android'" class="client-content">
          <div class="client-header">
            <div class="client-info">
              <h2>Cat9 安卓客户端</h2>
              <p>随时随地畅玩您喜爱的游戏</p>
              <div class="client-stats">
                <div class="stat-item">
                  <span class="stat-label">最新版本</span>
                  <span class="stat-value">v1.1.0</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">发布日期</span>
                  <span class="stat-value">2024-01-10</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">文件大小</span>
                  <span class="stat-value">28.3 MB</span>
                </div>
              </div>
            </div>
            <div class="client-cover">
              <img src="/favicon.svg" alt="安卓客户端" class="client-image">
            </div>
          </div>
          
          <div class="download-options">
            <h3>下载方式</h3>
            <div class="platform-buttons">
              <button class="platform-button google-play">
                <i class="icon-play-store"></i>
                <span>Google Play</span>
              </button>
              <button class="platform-button direct-download">
                <i class="icon-download"></i>
                <span>直接下载</span>
                <small>.apk</small>
              </button>
            </div>
          </div>
          
          <div class="client-features">
            <h3>安卓客户端特色</h3>
            <div class="features-grid">
              <div class="feature-item">
                <i class="icon-mobile-game"></i>
                <h4>移动游戏</h4>
                <p>访问专为移动设备优化的游戏内容</p>
              </div>
              <div class="feature-item">
                <i class="icon-notification"></i>
                <h4>游戏通知</h4>
                <p>实时接收游戏更新和活动通知</p>
              </div>
              <div class="feature-item">
                <i class="icon-sync"></i>
                <h4>跨平台同步</h4>
                <p>与PC客户端同步游戏数据和进度</p>
              </div>
              <div class="feature-item">
                <i class="icon-small-size"></i>
                <h4>轻量设计</h4>
                <p>占用更少存储空间，运行更流畅</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- iOS客户端 -->
        <div v-else-if="activeTab === 'ios'" class="client-content">
          <div class="client-header">
            <div class="client-info">
              <h2>Cat9 iOS 客户端</h2>
              <p>为 iPhone 和 iPad 带来优质游戏体验</p>
              <div class="client-stats">
                <div class="stat-item">
                  <span class="stat-label">最新版本</span>
                  <span class="stat-value">v1.0.5</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">发布日期</span>
                  <span class="stat-value">2024-01-05</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">文件大小</span>
                  <span class="stat-value">35.2 MB</span>
                </div>
              </div>
            </div>
            <div class="client-cover">
              <img src="/favicon.svg" alt="iOS客户端" class="client-image">
            </div>
          </div>
          
          <div class="download-options">
            <h3>下载方式</h3>
            <div class="platform-buttons">
              <button class="platform-button app-store">
                <i class="icon-app-store"></i>
                <span>App Store</span>
              </button>
            </div>
          </div>
          
          <div class="client-features">
            <h3>iOS客户端特色</h3>
            <div class="features-grid">
              <div class="feature-item">
                <i class="icon-ios-game"></i>
                <h4>iOS优化</h4>
                <p>针对iOS设备特性进行优化的游戏体验</p>
              </div>
              <div class="feature-item">
                <i class="icon-dark-mode"></i>
                <h4>深色模式</h4>
                <p>支持系统深色模式，保护眼睛更舒适</p>
              </div>
              <div class="feature-item">
                <i class="icon-battery"></i>
                <h4>电池优化</h4>
                <p>智能省电模式，延长电池使用时间</p>
              </div>
              <div class="feature-item">
                <i class="icon-cross-platform"></i>
                <h4>跨设备体验</h4>
                <p>与其他平台客户端无缝同步游戏数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 系统要求 -->
      <div class="system-requirements">
        <h3>系统要求</h3>
        <div class="requirements-tabs">
          <div 
            v-for="reqTab in reqTabs" 
            :key="reqTab.id"
            :class="['req-tab', { active: activeReqTab === reqTab.id }]"
            @click="activeReqTab = reqTab.id"
          >
            {{ reqTab.name }}
          </div>
        </div>
        
        <div class="req-content">
          <div v-if="activeReqTab === 'minimum'" class="req-details">
            <div class="req-section">
              <h4>最低系统要求</h4>
              <div class="req-grid">
                <div class="req-item">
                  <span class="req-label">操作系统</span>
                  <span class="req-value">Windows 7/8/10/11, macOS 10.13+, Ubuntu 18.04+</span>
                </div>
                <div class="req-item">
                  <span class="req-label">处理器</span>
                  <span class="req-value">Intel Core i3 或同等性能处理器</span>
                </div>
                <div class="req-item">
                  <span class="req-label">内存</span>
                  <span class="req-value">4 GB RAM</span>
                </div>
                <div class="req-item">
                  <span class="req-label">存储空间</span>
                  <span class="req-value">200 MB 可用空间</span>
                </div>
                <div class="req-item">
                  <span class="req-label">网络</span>
                  <span class="req-value">宽带互联网连接</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeReqTab === 'recommended'" class="req-details">
            <div class="req-section">
              <h4>推荐系统要求</h4>
              <div class="req-grid">
                <div class="req-item">
                  <span class="req-label">操作系统</span>
                  <span class="req-value">Windows 10/11, macOS 12+, Ubuntu 22.04+</span>
                </div>
                <div class="req-item">
                  <span class="req-label">处理器</span>
                  <span class="req-value">Intel Core i5 或同等性能处理器</span>
                </div>
                <div class="req-item">
                  <span class="req-label">内存</span>
                  <span class="req-value">8 GB RAM</span>
                </div>
                <div class="req-item">
                  <span class="req-label">存储空间</span>
                  <span class="req-value">500 MB 可用空间</span>
                </div>
                <div class="req-item">
                  <span class="req-label">网络</span>
                  <span class="req-value">高速互联网连接</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownloadClients',
  data() {
    return {
      activeTab: 'pc',
      activeReqTab: 'minimum',
      tabs: [
        { id: 'pc', name: 'PC 客户端', icon: 'icon-desktop' },
        { id: 'android', name: '安卓客户端', icon: 'icon-android' },
        { id: 'ios', name: 'iOS 客户端', icon: 'icon-ios' }
      ],
      reqTabs: [
        { id: 'minimum', name: '最低要求' },
        { id: 'recommended', name: '推荐要求' }
      ]
    }
  }
}
</script>

<style scoped>
.download-clients {
  min-height: 100vh;
  background-color: var(--primary-color);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 36px;
  color: var(--text-color);
  margin-bottom: 40px;
  text-align: center;
}

/* 选项卡样式 */
.download-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background-color: var(--card-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

.tab-button:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.tab-button.active {
  background-color: var(--primary-accent);
  color: white;
  border-color: var(--primary-accent);
}

.tab-button i {
  font-size: 20px;
}

/* 内容区域 */
.tab-content {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.client-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 客户端头部 */
.client-header {
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.client-info {
  flex: 1;
  min-width: 300px;
}

.client-info h2 {
  font-size: 28px;
  color: var(--text-color);
  margin-bottom: 10px;
}

.client-info p {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 20px;
}

.client-stats {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.stat-value {
  color: var(--text-color);
  font-size: 16px;
  font-weight: 500;
}

.client-cover {
  flex-shrink: 0;
}

.client-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: contain;
  background-color: var(--primary-color);
  padding: 10px;
}

/* 下载选项 */
.download-options {
  margin-top: 20px;
}

.download-options h3 {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 20px;
}

.platform-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.platform-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background-color: var(--primary-accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  min-width: 150px;
}

.platform-button:hover {
  background-color: var(--primary-accent-hover);
  transform: translateY(-2px);
}

.platform-button small {
  font-size: 12px;
  opacity: 0.8;
}

.platform-button.windows {
  background-color: #0078D7;
}

.platform-button.macos {
  background-color: #555;
}

.platform-button.linux {
  background-color: #FCC624;
  color: #1E1E1E;
}

.platform-button.google-play {
  background-color: #34A853;
}

.platform-button.app-store {
  background-color: #000;
}

.platform-button.direct-download {
  background-color: #EA4335;
}

/* 特色功能 */
.client-features {
  margin-top: 30px;
}

.client-features h3 {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: var(--primary-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-item i {
  font-size: 32px;
  color: var(--primary-accent);
}

.feature-item h4 {
  font-size: 18px;
  color: var(--text-color);
  margin: 0;
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

/* 系统要求 */
.system-requirements {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.system-requirements h3 {
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 20px;
}

.requirements-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.req-tab {
  padding: 10px 20px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.req-tab:hover {
  color: var(--text-color);
}

.req-tab.active {
  color: var(--primary-accent);
  border-bottom-color: var(--primary-accent);
}

.req-content {
  padding: 20px 0;
}

.req-section h4 {
  font-size: 18px;
  color: var(--text-color);
  margin-bottom: 15px;
}

.req-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.req-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--primary-color);
  border-radius: 6px;
}

.req-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.req-value {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .client-header {
    flex-direction: column;
    text-align: center;
  }
  
  .client-stats {
    justify-content: center;
  }
  
  .platform-buttons {
    justify-content: center;
  }
  
  .req-grid {
    grid-template-columns: 1fr;
  }
}
</style>