<template>
  <div class="developer-page">
    <div class="container">
      <h1 class="page-title">开发者中心</h1>
      
      <!-- 开发者统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-number">12+</div>
            <div class="stat-label">API 文档</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛠️</div>
          <div class="stat-content">
            <div class="stat-number">8</div>
            <div class="stat-label">开发工具</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-content">
            <div class="stat-number">200+</div>
            <div class="stat-label">社区开发者</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-number">50+</div>
            <div class="stat-label">公开模组</div>
          </div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="content-section">
        <div class="left-panel">
          <!-- 快速链接 -->
          <div class="panel-card">
            <h2 class="panel-title">快速链接</h2>
            <div class="quick-links">
              <a href="#" class="quick-link" @click.prevent="openAPIDocs">
                <span class="link-icon">📖</span>
                <span class="link-text">API 文档</span>
              </a>
              <a href="#" class="quick-link" @click.prevent="openSDKDownload">
                <span class="link-icon">💻</span>
                <span class="link-text">SDK 下载</span>
              </a>
              <a href="#" class="quick-link" @click.prevent="openDevTools">
                <span class="link-icon">🔧</span>
                <span class="link-text">开发工具</span>
              </a>
              <a href="#" class="quick-link" @click.prevent="openModGuidelines">
                <span class="link-icon">📝</span>
                <span class="link-text">模组规范</span>
              </a>
              <a href="#" class="quick-link" @click.prevent="openCommunityForums">
                <span class="link-icon">💬</span>
                <span class="link-text">开发者论坛</span>
              </a>
            </div>
          </div>
          
          <!-- 最新公告 -->
          <div class="panel-card">
            <h2 class="panel-title">最新公告</h2>
            <div class="announcements">
              <div class="announcement-item" v-for="announcement in announcements" :key="announcement.id">
                <div class="announcement-date">{{ announcement.date }}</div>
                <div class="announcement-title">{{ announcement.title }}</div>
                <div class="announcement-preview">{{ announcement.preview }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="right-panel">
          <!-- 欢迎区域 -->
          <div class="welcome-card">
            <h2>欢迎来到 Cat9 开发者中心</h2>
            <p>Cat9 提供强大的开发工具和 API，帮助你创建精彩的游戏内容、模组和应用。无论你是游戏开发者、模组作者还是应用开发者，我们都为你提供了所需的资源。</p>
            <div class="action-buttons">
              <button class="btn-primary" @click="createDeveloperAccount">创建开发者账号</button>
              <button class="btn-secondary" @click="learnMore">了解更多</button>
            </div>
          </div>
          
          <!-- 开发资源 -->
          <div class="resources-card">
            <h2>开发资源</h2>
            <div class="resource-tabs">
              <button 
                v-for="tab in resourceTabs" 
                :key="tab.id"
                :class="['tab-button', { active: activeResourceTab === tab.id }]"
                @click="activeResourceTab = tab.id"
              >
                {{ tab.name }}
              </button>
            </div>
            
            <!-- 游戏开发资源 -->
            <div v-if="activeResourceTab === 'game-dev'" class="tab-content">
              <div class="resource-item" v-for="resource in gameDevResources" :key="resource.id">
                <div class="resource-icon">{{ resource.icon }}</div>
                <div class="resource-details">
                  <h3 class="resource-title">{{ resource.title }}</h3>
                  <p class="resource-description">{{ resource.description }}</p>
                  <div class="resource-meta">
                    <span class="resource-level">{{ resource.level }}</span>
                    <span class="resource-date">{{ resource.updatedAt }}</span>
                  </div>
                </div>
                <button class="resource-action" @click="resource.action">获取</button>
              </div>
            </div>
            
            <!-- 模组开发资源 -->
            <div v-else-if="activeResourceTab === 'mod-dev'" class="tab-content">
              <div class="resource-item" v-for="resource in modDevResources" :key="resource.id">
                <div class="resource-icon">{{ resource.icon }}</div>
                <div class="resource-details">
                  <h3 class="resource-title">{{ resource.title }}</h3>
                  <p class="resource-description">{{ resource.description }}</p>
                  <div class="resource-meta">
                    <span class="resource-level">{{ resource.level }}</span>
                    <span class="resource-date">{{ resource.updatedAt }}</span>
                  </div>
                </div>
                <button class="resource-action" @click="resource.action">获取</button>
              </div>
            </div>
            
            <!-- API 资源 -->
            <div v-else-if="activeResourceTab === 'api'" class="tab-content">
              <div class="resource-item" v-for="resource in apiResources" :key="resource.id">
                <div class="resource-icon">{{ resource.icon }}</div>
                <div class="resource-details">
                  <h3 class="resource-title">{{ resource.title }}</h3>
                  <p class="resource-description">{{ resource.description }}</p>
                  <div class="resource-meta">
                    <span class="resource-level">{{ resource.level }}</span>
                    <span class="resource-date">{{ resource.updatedAt }}</span>
                  </div>
                </div>
                <button class="resource-action" @click="resource.action">获取</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 合作伙伴展示 -->
      <div class="partners-section">
        <h2 class="section-title">合作伙伴</h2>
        <div class="partners-grid">
          <div class="partner-item" v-for="partner in partners" :key="partner.id">
            <div class="partner-logo">
              <div class="logo-placeholder">{{ partner.logo }}</div>
            </div>
            <div class="partner-name">{{ partner.name }}</div>
            <div class="partner-desc">{{ partner.description }}</div>
          </div>
        </div>
      </div>
      
      <!-- 联系我们 -->
      <div class="contact-section">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-content">
          <div class="contact-info">
            <p>有任何问题或建议？请通过以下方式联系我们的开发者支持团队：</p>
            <div class="contact-items">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span class="contact-text">developer@cat9.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">💬</span>
                <span class="contact-text">Discord #开发者频道</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span class="contact-text">微信：Cat9Dev</span>
              </div>
            </div>
          </div>
          <div class="feedback-form">
            <h3>提交反馈</h3>
            <form @submit.prevent="submitFeedback">
              <div class="form-group">
                <label>您的邮箱</label>
                <input type="email" v-model="feedback.email" placeholder="请输入您的邮箱" class="form-input">
              </div>
              <div class="form-group">
                <label>反馈类型</label>
                <select v-model="feedback.type" class="form-select">
                  <option value="">请选择反馈类型</option>
                  <option value="bug">Bug 反馈</option>
                  <option value="feature">功能建议</option>
                  <option value="question">技术咨询</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div class="form-group">
                <label>反馈内容</label>
                <textarea v-model="feedback.content" rows="4" placeholder="请输入反馈内容" class="form-textarea"></textarea>
              </div>
              <button type="submit" class="submit-btn">提交反馈</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DeveloperPage',
  setup() {
    const activeResourceTab = ref('game-dev')
    const feedback = ref({
      email: '',
      type: '',
      content: ''
    })
    
    // 统计卡片数据
    const statsCards = ref([
      { icon: '📚', number: '12+', label: 'API 文档' },
      { icon: '🛠️', number: '8', label: '开发工具' },
      { icon: '🌟', number: '200+', label: '社区开发者' },
      { icon: '📦', number: '50+', label: '公开模组' }
    ])
    
    // 最新公告
    const announcements = ref([
      {
        id: 1,
        date: '2023-10-15',
        title: 'API v2.0 版本发布',
        preview: '我们很高兴地宣布 API v2.0 版本正式发布，带来了全新的功能和性能改进...'
      },
      {
        id: 1,
        date: '2023-10-05',
        title: '开发者大会即将举行',
        preview: '2023 Cat9 开发者大会将于11月15日在线上举行，报名已开始...'
      },
      {
        id: 1,
        date: '2023-09-28',
        title: '模组审核流程更新',
        preview: '为了提升用户体验，我们更新了模组审核流程和规范...'
      }
    ])
    
    // 资源标签
    const resourceTabs = ref([
      { id: 'game-dev', name: '游戏开发' },
      { id: 'mod-dev', name: '模组开发' },
      { id: 'api', name: 'API 资源' }
    ])
    
    // 游戏开发资源
    const gameDevResources = ref([
      {
        id: 1,
        icon: '🎮',
        title: '游戏开发工具包',
        description: '完整的游戏开发工具包，包含引擎、编辑器和示例项目',
        level: '初学者',
        updatedAt: '2023-09-30',
        action: () => alert('开始下载游戏开发工具包')
      },
      {
        id: 2,
        icon: '📖',
        title: '游戏开发教程',
        description: '从入门到精通的游戏开发教程，覆盖所有核心概念',
        level: '全级别',
        updatedAt: '2023-10-10',
        action: () => alert('查看游戏开发教程')
      },
      {
        id: 3,
        icon: '🧰',
        title: '游戏性能优化指南',
        description: '详细的游戏性能优化指南，帮助你创建流畅的游戏体验',
        level: '中级',
        updatedAt: '2023-09-15',
        action: () => alert('下载性能优化指南')
      }
    ])
    
    // 模组开发资源
    const modDevResources = ref([
      {
        id: 1,
        icon: '🔧',
        title: '模组开发工具',
        description: '专为 Cat9 游戏设计的模组开发工具，支持一键打包发布',
        level: '初学者',
        updatedAt: '2023-10-05',
        action: () => alert('下载模组开发工具')
      },
      {
        id: 2,
        icon: '📝',
        title: '模组开发指南',
        description: '全面的模组开发指南，从基础到高级的完整教程',
        level: '全级别',
        updatedAt: '2023-09-20',
        action: () => alert('查看模组开发指南')
      },
      {
        id: 3,
        icon: '🔍',
        title: '模组调试工具',
        description: '专业的模组调试工具，帮助你快速定位和解决问题',
        level: '中级',
        updatedAt: '2023-10-12',
        action: () => alert('获取模组调试工具')
      }
    ])
    
    // API 资源
    const apiResources = ref([
      {
        id: 1,
        icon: '📚',
        title: 'RESTful API 文档',
        description: '完整的 RESTful API 文档，包含所有端点和示例代码',
        level: '全级别',
        updatedAt: '2023-10-15',
        action: () => alert('查看 RESTful API 文档')
      },
      {
        id: 2,
        icon: '💻',
        title: 'SDK 下载',
        description: '官方支持的多语言 SDK，包含 Python、JavaScript、Java 等',
        level: '全级别',
        updatedAt: '2023-10-08',
        action: () => alert('下载 SDK')
      },
      {
        id: 3,
        icon: '🔐',
        title: '认证与授权指南',
        description: '详细的 API 认证与授权指南，确保你的应用安全访问',
        level: '中级',
        updatedAt: '2023-09-25',
        action: () => alert('查看认证指南')
      }
    ])
    
    // 合作伙伴
    const partners = ref([
      {
        id: 1,
        logo: '🏢',
        name: 'GameStudio',
        description: '知名游戏开发工作室，专注于 3D 游戏开发'
      },
      {
        id: 2,
        logo: '💻',
        name: 'DevTools',
        description: '专业的游戏开发工具提供商'
      },
      {
        id: 3,
        logo: '🎨',
        name: 'ArtCraft',
        description: '游戏美术资源和设计服务提供商'
      },
      {
        id: 4,
        logo: '📱',
        name: 'MobileTech',
        description: '移动游戏技术解决方案提供商'
      }
    ])
    
    // 方法
    const openAPIDocs = () => {
      console.log('打开 API 文档')
      alert('正在打开 API 文档...')
    }
    
    const openSDKDownload = () => {
      console.log('打开 SDK 下载页面')
      alert('正在打开 SDK 下载页面...')
    }
    
    const openDevTools = () => {
      console.log('打开开发工具页面')
      alert('正在打开开发工具页面...')
    }
    
    const openModGuidelines = () => {
      console.log('打开模组规范页面')
      alert('正在打开模组规范页面...')
    }
    
    const openCommunityForums = () => {
      console.log('打开开发者论坛')
      alert('正在打开开发者论坛...')
    }
    
    const createDeveloperAccount = () => {
      console.log('创建开发者账号')
      alert('跳转到开发者账号创建页面...')
    }
    
    const learnMore = () => {
      console.log('了解更多')
      alert('查看开发者中心介绍...')
    }
    
    const submitFeedback = () => {
      if (feedback.value.email && feedback.value.type && feedback.value.content) {
        console.log('提交反馈:', feedback.value)
        alert('反馈提交成功！我们会尽快回复您。')
        
        // 重置表单
        feedback.value = {
          email: '',
          type: '',
          content: ''
        }
      } else {
        alert('请填写完整的反馈信息')
      }
    }
    
    return {
      activeResourceTab,
      feedback,
      statsCards,
      announcements,
      resourceTabs,
      gameDevResources,
      modDevResources,
      apiResources,
      partners,
      openAPIDocs,
      openSDKDownload,
      openDevTools,
      openModGuidelines,
      openCommunityForums,
      createDeveloperAccount,
      learnMore,
      submitFeedback
    }
  }
}
</script>

<style scoped>
.developer-page {
  padding: 40px 0;
  min-height: calc(100vh - 160px);
}

.page-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  color: var(--accent-color);
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent-light);
  border-radius: 50%;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 5px;
}

/* 内容区域 */
.content-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.panel-title {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--text-color);
}

/* 快速链接 */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: var(--card-bg);
  border-radius: 6px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
}

.quick-link:hover {
  background-color: var(--accent-light);
  color: var(--accent-color);
}

.link-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.link-text {
  font-size: 16px;
}

/* 公告 */
.announcements {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-item {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.announcement-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.announcement-date {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.announcement-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 5px;
}

.announcement-preview {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 欢迎卡片 */
.welcome-card {
  background-color: var(--accent-color);
  color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
}

.welcome-card h2 {
  font-size: 28px;
  margin-bottom: 15px;
}

.welcome-card p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.95;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary {
  padding: 12px 24px;
  background-color: white;
  color: var(--accent-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.btn-secondary {
  padding: 12px 24px;
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 资源卡片 */
.resources-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.resources-card h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.resource-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover {
  color: var(--text-color);
}

.tab-button.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: var(--card-bg);
  border-radius: 6px;
  transition: background-color 0.3s;
}

.resource-item:hover {
  background-color: var(--accent-light);
}

.resource-icon {
  font-size: 32px;
  width: 50px;
  text-align: center;
}

.resource-details {
  flex: 1;
}

.resource-title {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--text-color);
}

.resource-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.resource-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: var(--text-secondary);
}

.resource-level {
  background-color: var(--accent-light);
  color: var(--accent-color);
  padding: 2px 8px;
  border-radius: 10px;
}

.resource-action {
  padding: 8px 16px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.resource-action:hover {
  background-color: var(--accent-hover);
}

/* 合作伙伴 */
.partners-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  margin-bottom: 25px;
  text-align: center;
  color: var(--text-color);
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.partner-item {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: transform 0.2s;
}

.partner-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.partner-logo {
  margin-bottom: 15px;
}

.logo-placeholder {
  font-size: 48px;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background-color: var(--accent-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 8px;
}

.partner-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 联系我们 */
.contact-section {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 30px;
  border: 1px solid var(--border-color);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-info p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 20px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-icon {
  font-size: 20px;
}

.contact-text {
  font-size: 16px;
  color: var(--text-color);
}

/* 反馈表单 */
.feedback-form h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--text-color);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 15px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-color);
  font-size: 16px;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: var(--accent-hover);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-section {
    grid-template-columns: 1fr;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .resource-tabs {
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .resource-item {
    flex-direction: column;
    text-align: center;
  }
  
  .resource-meta {
    justify-content: center;
  }
  
  .partners-grid {
    grid-template-columns: 1fr;
  }
}
</style>