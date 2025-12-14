<template>
  <div class="profile-container">
    <div class="container">
      <!-- 侧边导航 -->
      <div class="profile-sidebar">
        <div class="profile-header">
          <div class="avatar-container">
          <div class="avatar" :style="{ backgroundImage: `url(${user?.avatar || defaultAvatar})` }"></div>
          <input 
            type="file" 
            id="avatar-input" 
            accept="image/*" 
            style="display: none" 
            @change="handleAvatarUpload"
          >
          <button class="avatar-edit" @click="triggerAvatarUpload">
            <span>+</span>
          </button>
        </div>
          <h2>{{ user?.displayName || '用户' }}</h2>
          <p class="username">{{ user?.username }}</p>
          <div class="wallet-info">
            <span class="wallet-balance">Jades: {{ user?.wallet?.balance || 0 }}</span>
            <button class="btn btn-sm btn-outline">充值</button>
          </div>
        </div>
        
        <nav class="profile-nav">
          <ul>
            <li :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
              <i class="icon-user"></i> 个人资料
            </li>
            <li :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
              <i class="icon-lock"></i> 账户安全
            </li>
            <li :class="{ active: activeTab === 'wallet' }" @click="activeTab = 'wallet'">
              <i class="icon-wallet"></i> 钱包管理
            </li>
            <li :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
              <i class="icon-bell"></i> 通知设置
            </li>
            <li :class="{ active: activeTab === 'language' }" @click="activeTab = 'language'">
              <i class="icon-language"></i> {{ $t('profile.language') }}
            </li>
          </ul>
        </nav>
        
        <button class="btn btn-outline logout-button" @click="handleLogout">
          <i class="icon-logout"></i> {{ $t('profile.logout') }}
        </button>
      </div>
      
      <!-- 主内容区域 -->
      <div class="profile-main">
        <!-- 个人资料编辑 -->
        <div v-if="activeTab === 'profile'" class="profile-tab">
          <h3>{{ $t('profile.editProfile') }}</h3>
          
          <div class="card">
            <div class="form-group">
              <label for="displayName">{{ $t('profile.displayName') }}</label>
              <input 
                type="text" 
                id="displayName" 
                v-model="editForm.displayName"
                class="form-control"
                :placeholder="$t('profile.placeholderDisplayName')"
              >
            </div>
            
            <div class="form-group">
              <label for="email">{{ $t('profile.email') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="editForm.email"
                class="form-control"
                :placeholder="$t('profile.placeholderEmail')"
                readonly
              >
              <small>{{ $t('profile.emailCannotEdit') }}</small>
            </div>
            
            <div class="form-group">
              <label for="bio">个人简介</label>
              <textarea 
                id="bio" 
                v-model="editForm.bio"
                class="form-control"
                placeholder="介绍一下自己吧"
                rows="4"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="country">所在地区</label>
              <select id="country" v-model="editForm.country" class="form-control">
                <option value="">请选择</option>
                <option value="CN">中国</option>
                <option value="US">美国</option>
                <option value="JP">日本</option>
                <option value="KR">韩国</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="terms-agreement">
                <input type="checkbox" v-model="editForm.showOnlineStatus">
                <span>显示在线状态</span>
              </label>
            </div>
            
            <div class="form-actions">
              <button class="btn btn-secondary" @click="cancelEdit">取消</button>
              <button class="btn btn-primary" @click="saveProfile">保存更改</button>
            </div>
          </div>
          
          <h3 class="mt-40">社交账号绑定</h3>
          <div class="card">
            <div class="social-accounts">
              <div class="social-item">
                <span class="social-icon wechat">微信</span>
                <span class="social-status">{{ isWechatLinked ? '已绑定' : '未绑定' }}</span>
                <button class="btn btn-outline btn-sm">{{ isWechatLinked ? '解绑' : '绑定' }}</button>
              </div>
              <div class="social-item">
                <span class="social-icon alipay">支付宝</span>
                <span class="social-status">{{ isAlipayLinked ? '已绑定' : '未绑定' }}</span>
                <button class="btn btn-outline btn-sm">{{ isAlipayLinked ? '解绑' : '绑定' }}</button>
              </div>
              <div class="social-item">
                <span class="social-icon qq">QQ</span>
                <span class="social-status">{{ isQQLinked ? '已绑定' : '未绑定' }}</span>
                <button class="btn btn-outline btn-sm">{{ isQQLinked ? '解绑' : '绑定' }}</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户安全 -->
        <div v-else-if="activeTab === 'security'" class="profile-tab">
          <h3>账户安全</h3>
          
          <div class="card">
            <h4>修改密码</h4>
            <div class="form-group">
              <label for="currentPassword">当前密码</label>
              <input type="password" id="currentPassword" v-model="securityForm.currentPassword" class="form-control">
            </div>
            <div class="form-group">
              <label for="newPassword">新密码</label>
              <input type="password" id="newPassword" v-model="securityForm.newPassword" class="form-control">
            </div>
            <div class="form-group">
              <label for="confirmNewPassword">确认新密码</label>
              <input type="password" id="confirmNewPassword" v-model="securityForm.confirmNewPassword" class="form-control">
            </div>
            <button class="btn btn-primary">修改密码</button>
          </div>
          
          <h3 class="mt-40">双因素认证</h3>
          <div class="card">
            <p>开启双因素认证后，登录时需要输入额外的验证码，提高账户安全性。</p>
            <div class="two-factor-status">
              <span>当前状态：{{ isTwoFactorEnabled ? '已开启' : '未开启' }}</span>
              <button class="btn btn-outline">{{ isTwoFactorEnabled ? '关闭' : '开启' }}</button>
            </div>
          </div>
        </div>
        
        <!-- 钱包管理 -->
        <div v-else-if="activeTab === 'wallet'" class="profile-tab">
          <h3>钱包管理</h3>
          
          <div class="card wallet-overview">
            <h4>余额概览</h4>
            <div class="wallet-balance-display">
              <span class="balance-amount">{{ user?.wallet?.balance || 0 }}</span>
              <span class="balance-label">{{ $t('common.metaJades') }}</span>
            </div>
            <div class="wallet-actions">
              <button class="btn btn-primary">充值</button>
              <button class="btn btn-secondary">提现</button>
            </div>
          </div>
          
          <h3 class="mt-40">交易记录</h3>
          <div class="card">
            <div class="transaction-filters">
              <select class="form-control">
                <option>全部类型</option>
                <option>充值</option>
                <option>购买</option>
                <option>提现</option>
                <option>退款</option>
              </select>
              <input type="date" class="form-control">
              <input type="date" class="form-control">
              <button class="btn btn-outline">筛选</button>
            </div>
            
            <div class="transaction-list">
              <div class="transaction-item" v-for="transaction in transactions" :key="transaction.id">
                <div class="transaction-type">{{ transaction.type }}</div>
                <div class="transaction-desc">{{ transaction.description }}</div>
                <div class="transaction-amount" :class="{ income: transaction.amount > 0 }">
                  {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}
                </div>
                <div class="transaction-date">{{ transaction.date }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 通知设置 -->
        <div v-else-if="activeTab === 'notifications'" class="profile-tab">
          <h3>通知设置</h3>
          
          <div class="card">
            <h4>游戏通知</h4>
            <div class="notification-option">
              <label>游戏更新提醒</label>
              <input type="checkbox" v-model="notifications.gameUpdates" class="toggle-switch">
            </div>
            <div class="notification-option">
              <label>游戏优惠提醒</label>
              <input type="checkbox" v-model="notifications.gameDeals" class="toggle-switch">
            </div>
            <div class="notification-option">
              <label>好友活动提醒</label>
              <input type="checkbox" v-model="notifications.friendActivity" class="toggle-switch">
            </div>
            
            <h4 class="mt-30">系统通知</h4>
            <div class="notification-option">
              <label>账户安全提醒</label>
              <input type="checkbox" v-model="notifications.securityAlerts" class="toggle-switch" checked>
            </div>
            <div class="notification-option">
              <label>促销活动通知</label>
              <input type="checkbox" v-model="notifications.promotions" class="toggle-switch">
            </div>
            <div class="notification-option">
              <label>平台更新公告</label>
              <input type="checkbox" v-model="notifications.platformUpdates" class="toggle-switch" checked>
            </div>
            
            <h4 class="mt-30">通知方式</h4>
            <div class="notification-option">
              <label>站内信</label>
              <input type="checkbox" v-model="notificationMethods.inApp" class="toggle-switch" checked>
            </div>
            <div class="notification-option">
              <label>电子邮件</label>
              <input type="checkbox" v-model="notificationMethods.email" class="toggle-switch" checked>
            </div>
            
            <button class="btn btn-primary mt-30">保存设置</button>
          </div>
        </div>
        
        <!-- 语言偏好 -->
        <div v-else-if="activeTab === 'language'" class="profile-tab">
          <h3>{{ $t('profile.languageSettings') }}</h3>
          
          <div class="card">
            <h4>{{ $t('profile.interfaceLanguage') }}</h4>
            <div class="language-options">
              <label class="language-option" :class="{ active: selectedLanguage === 'zh-CN' }">
                <input type="radio" name="language" value="zh-CN" v-model="selectedLanguage" @change="changeLanguage">
                <span>简体中文</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'zh-TW' }">
                <input type="radio" name="language" value="zh-TW" v-model="selectedLanguage" @change="changeLanguage">
                <span>繁體中文</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'en-US' }">
                <input type="radio" name="language" value="en-US" v-model="selectedLanguage" @change="changeLanguage">
                <span>English (US)</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'ja-JP' }">
                <input type="radio" name="language" value="ja-JP" v-model="selectedLanguage" @change="changeLanguage">
                <span>日本語</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'ko-KR' }">
                <input type="radio" name="language" value="ko-KR" v-model="selectedLanguage" @change="changeLanguage">
                <span>한국어</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'es-ES' }">
                <input type="radio" name="language" value="es-ES" v-model="selectedLanguage" @change="changeLanguage">
                <span>Español</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'fr-FR' }">
                <input type="radio" name="language" value="fr-FR" v-model="selectedLanguage" @change="changeLanguage">
                <span>Français</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'de-DE' }">
                <input type="radio" name="language" value="de-DE" v-model="selectedLanguage" @change="changeLanguage">
                <span>Deutsch</span>
              </label>
              <label class="language-option" :class="{ active: selectedLanguage === 'ru-RU' }">
                <input type="radio" name="language" value="ru-RU" v-model="selectedLanguage" @change="changeLanguage">
                <span>Русский</span>
              </label>
            </div>
            
            <h4 class="mt-30">{{ $t('profile.contentPreferences') }}</h4>
            <div class="content-preferences">
              <div class="form-group">
                <label for="contentRegion">{{ $t('profile.contentRegion') }}</label>
                <select id="contentRegion" v-model="contentRegion" class="form-control">
                  <option value="CN">{{ $t('profile.regions.china') }}</option>
                  <option value="US">{{ $t('profile.regions.us') }}</option>
                  <option value="JP">{{ $t('profile.regions.japan') }}</option>
                  <option value="KR">{{ $t('profile.regions.korea') }}</option>
                  <option value="global">{{ $t('profile.regions.global') }}</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="terms-agreement">
                  <input type="checkbox" v-model="showAdultContent">
                  <span>{{ $t('profile.showAdultContent') }}</span>
                </label>
              </div>
            </div>
            
            <button class="btn btn-primary mt-30">保存设置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/userService';
import { uploadAvatar } from '@/services/userService';

export default {
  name: 'UserProfile',
  data() {
    return {
      activeTab: 'profile',
      defaultAvatar: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22%3E%3Cpath fill%3D%22%2366c0f4%22 d%3D%22M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm0-36C11.2 4 4 11.2 4 20s7.2 16 16 16 16-7.2 16-16S28.8 4 20 4zm-5 28c0 .8-.7 1.5-1.5 1.5S12 32.8 12 32v-2c0-.8.7-1.5 1.5-1.5S15 29.2 15 30v.5zm13 0c0 .8-.7 1.5-1.5 1.5S25 32.8 25 32v-2c0-.8.7-1.5 1.5-1.5S28 29.2 28 30v.5zm-5-8c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z%22%2F%3E%3C%2Fsvg%3E',
      user: null,
      editForm: {
        displayName: '',
        email: '',
        bio: '',
        country: '',
        showOnlineStatus: true
      },
      securityForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      isWechatLinked: false,
      isAlipayLinked: false,
      isQQLinked: false,
      isTwoFactorEnabled: false,
      transactions: [
        { id: 1, type: '购买', description: '购买游戏 《醒梦》', amount: -50, date: '2024-01-15' },
        { id: 2, type: '充值', description: '支付宝充值', amount: 500, date: '2024-01-10' },
        { id: 3, type: '购买', description: '购买游戏 《午夜巫女》', amount: -100, date: '2024-01-05' }
      ],
      notifications: {
        gameUpdates: true,
        gameDeals: true,
        friendActivity: false,
        securityAlerts: true,
        promotions: false,
        platformUpdates: true
      },
      notificationMethods: {
        inApp: true,
        email: true
      },
      selectedLanguage: 'zh-CN',
      contentRegion: 'CN',
      showAdultContent: false
    }
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      // 从userService加载用户信息
      const user = userService.getCurrentUserFromStorage()
      console.log('加载的用户信息:', user)
      if (user) {
        this.user = user
        console.log('用户头像URL:', this.user.avatar)
        // 初始化编辑表单
        this.editForm = {
          displayName: this.user.displayName,
          email: this.user.email,
          bio: this.user.bio || '',
          country: this.user.country || '',
          showOnlineStatus: this.user.showOnlineStatus !== false
        }
      }
      
      // 加载保存的语言设置
      const savedLanguage = localStorage.getItem('preferredLanguage')
      if (savedLanguage && this.$i18n.availableLocales.includes(savedLanguage)) {
        this.selectedLanguage = savedLanguage
        this.$i18n.locale = savedLanguage
      }
    },
    changeLanguage() {
      // 更新i18n语言
      this.$i18n.locale = this.selectedLanguage
      // 保存到localStorage
      localStorage.setItem('preferredLanguage', this.selectedLanguage)
      // 提示用户刷新页面以应用所有翻译
      alert(this.$t('profile.languageChanged'))
    },
    async saveProfile() {
      // 保存个人资料
      if (this.user) {
        try {
          const updatedUser = await userService.updateUser({
            displayName: this.editForm.displayName,
            bio: this.editForm.bio,
            country: this.editForm.country,
            showOnlineStatus: this.editForm.showOnlineStatus
          })
          // 更新本地用户信息
          this.user = updatedUser
          // 显示成功提示
          alert('个人资料已更新')
        } catch (error) {
          console.error('保存个人资料失败:', error)
          alert(error.message || '保存个人资料失败')
        }
      }
    },
    cancelEdit() {
      // 重置编辑表单
      this.editForm = {
        displayName: this.user?.displayName || '',
        email: this.user?.email || '',
        bio: this.user?.bio || '',
        country: this.user?.country || '',
        showOnlineStatus: this.user?.showOnlineStatus !== false
      }
    },
    handleLogout() {
      // 清除用户信息并跳转登录页
      userService.logout()
      this.$router.push('/login')
    },
    triggerAvatarUpload() {
      // 触发文件选择对话框
      document.getElementById('avatar-input').click()
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }
      
      try {
        // 使用uploadAvatar函数上传头像
        console.log('开始上传头像...')
        const data = await uploadAvatar(file)
        console.log('上传响应数据:', data)
        
        // 更新用户头像，确保触发Vue响应式
        if (this.user) {
          // 创建新的用户对象，确保Vue能检测到变化
          this.user = {
            ...this.user,
            avatar: data.avatarUrl
          }
          alert('头像上传成功')
        }
      } catch (error) {
        console.error('头像上传错误:', error)
        alert(error.message || '网络错误，请稍后重试')
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: var(--primary-color);
}

.container {
  display: flex;
  padding: 40px 20px;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 侧边栏样式 */
.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-header {
  background-color: var(--card-bg);
  border-radius: 4px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: var(--secondary-color);
  border: 3px solid var(--accent-color);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--button-primary);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.avatar-edit:hover {
  background-color: var(--button-primary-hover);
  transform: scale(1.1);
}

.profile-header h2 {
  margin-bottom: 5px;
  font-size: 24px;
}

.username {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.wallet-info {
  background-color: var(--secondary-color);
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.wallet-balance {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--button-primary);
  margin-bottom: 10px;
}

.wallet-info .btn {
  width: 100%;
}

.profile-nav {
  background-color: var(--card-bg);
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.profile-nav ul {
  list-style: none;
}

.profile-nav li {
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
}

.profile-nav li:last-child {
  border-bottom: none;
}

.profile-nav li:hover {
  background-color: var(--secondary-color);
}

.profile-nav li.active {
  background-color: var(--secondary-color);
  color: var(--accent-color);
  font-weight: bold;
}

.logout-button {
  width: 100%;
  padding: 12px;
  font-size: 14px;
}

/* 主内容区域 */
.profile-main {
  flex: 1;
}

.profile-tab h3 {
  margin-bottom: 20px;
  font-size: 24px;
}

.profile-tab h4 {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text-color);
}

/* 表单样式补充 */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.mt-40 {
  margin-top: 40px;
}

.mt-30 {
  margin-top: 30px;
}

/* 社交账号绑定 */
.social-accounts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.social-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 4px;
}

.social-icon {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
}

.social-icon.wechat {
  background-color: #09bb07;
}

.social-icon.alipay {
  background-color: #1677ff;
}

.social-icon.qq {
  background-color: #12b7f5;
}

.social-status {
  color: var(--text-secondary);
}

/* 钱包样式 */
.wallet-overview {
  text-align: center;
}

.wallet-balance-display {
  margin: 30px 0;
}

.balance-amount {
  display: block;
  font-size: 48px;
  font-weight: bold;
  color: var(--button-primary);
}

.balance-label {
  color: var(--text-secondary);
  font-size: 18px;
}

.wallet-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 交易记录 */
.transaction-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.transaction-filters .form-control {
  flex: 1;
  min-width: 150px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 4px;
  gap: 20px;
}

.transaction-type {
  font-weight: bold;
  min-width: 60px;
}

.transaction-desc {
  flex: 1;
  color: var(--text-secondary);
}

.transaction-amount {
  font-weight: bold;
  min-width: 80px;
  text-align: right;
  color: var(--error-color);
}

.transaction-amount.income {
  color: var(--success-color);
}

.transaction-date {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 通知设置 */
.notification-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.notification-option:last-child {
  border-bottom: none;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  -webkit-appearance: none;
  appearance: none;
  background-color: #555;
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch:checked {
  background-color: var(--button-primary);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: all 0.3s ease;
}

.toggle-switch:checked::before {
  transform: translateX(20px);
}

/* 语言偏好 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.language-option:hover {
  background-color: var(--button-secondary-hover);
}

.language-option.active {
  border-color: var(--accent-color);
  background-color: rgba(102, 192, 244, 0.1);
}

.content-preferences {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 图标占位 */
.icon-user::before { content: '👤'; }
.icon-lock::before { content: '🔒'; }
.icon-wallet::before { content: '💰'; }
.icon-bell::before { content: '🔔'; }
.icon-language::before { content: '🌐'; }
.icon-logout::before { content: '🚪'; }

/* 协议同意选项样式 */
.terms-agreement {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.terms-agreement input[type="checkbox"] {
  width: auto;
  margin: 0;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .profile-nav ul {
    display: flex;
    flex-wrap: wrap;
  }
  
  .profile-nav li {
    flex: 1;
    min-width: 150px;
    border-right: 1px solid var(--border-color);
    border-bottom: none;
  }
  
  .profile-nav li:last-child {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .transaction-filters {
    flex-direction: column;
  }
  
  .transaction-filters .form-control {
    width: 100%;
  }
  
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .transaction-amount {
    text-align: left;
  }
}
</style>