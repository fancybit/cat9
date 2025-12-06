<template>
  <div id="app">
    <!-- 导航栏 -->
    <header :class="navbarClasses">
      <div class="container">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="玄玉逍游" class="logo-image">
          <div class="logo-text">
            <h1 style="margin:5px;text-align: center;">玄玉逍游<br /> <span>MetaJadeGaming</span></h1>
          </div>
        </div>

        <!-- 移动端汉堡菜单 -->
        <button class="menu-toggle mobile-only" @click="toggleMenu">
          <span class="menu-icon"></span>
          <span class="menu-icon"></span>
          <span class="menu-icon"></span>
        </button>

        <!-- 桌面端导航 -->
        <nav :class="desktopNavClasses">
          <ul>
            <li><router-link to="/" class="nav-link">{{ $t('navbar.home') }}</router-link></li>
            <li><router-link to="/store" class="nav-link">{{ $t('navbar.store') }}</router-link></li>
            <li><router-link to="/library" class="nav-link">{{ $t('navbar.library') }}</router-link></li>
            <li><router-link to="/downloads" class="nav-link">{{ $t('navbar.downloads') }}</router-link></li>
            <li><router-link to="/auction" class="nav-link">{{ $t('navbar.auction') }}</router-link></li>
            <li><router-link to="/community" class="nav-link">{{ $t('navbar.community') }}</router-link></li>
            <li v-if="isAdmin"><router-link to="/dht-manager" class="nav-link">DHT 管理器</router-link></li>
            <li><router-link to="/developer" class="nav-link">{{ $t('navbar.developer') }}</router-link></li>
            <li><router-link to="/audit-team" class="nav-link">{{ $t('navbar.auditTeam') }}</router-link></li>
            <li v-if="isAdmin"><router-link to="/admin" class="nav-link">{{ $t('navbar.admin') }}</router-link></li>
            <li><a href="#" class="nav-link">{{ $t('navbar.aboutUs') }}</a></li>
          </ul>
        </nav>

        <!-- 桌面端用户控件和语言选择器 -->
        <div class="user-controls desktop-only">
          <!-- PC版语言选择器 - 导航栏右侧 -->
          <div class="language-selector">
            <button class="language-button" @click="toggleLanguageMenu">
              <span class="earth-icon">🌎</span>
              <span class="dropdown-arrow" :class="{ 'open': languageMenuOpen }">▼</span>
            </button>
            <div class="language-dropdown" v-show="languageMenuOpen">
              <div v-for="(name, code) in supportedLanguages" :key="code" class="language-option"
                :class="{ 'active': currentLanguage === code }" @click="changeLanguage(code)">
                {{ name }}
              </div>
            </div>
          </div>

          <template v-if="isLoggedIn">
            <router-link to="/profile" class="user-profile">
              <div class="user-avatar">{{ userInitial }}</div>
              <span>{{ user.username }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="login-button">{{ $t('navbar.login') }}</router-link>
            <router-link to="/register" class="register-button">{{ $t('navbar.register') }}</router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- 移动端语言选择器已整合到移动菜单中 -->

    <!-- 移动端导航菜单 -->
    <div class="mobile-menu" v-show="menuOpen">
      <ul>
        <!-- 移动端语言选择器 -->
        <li class="mobile-language-section">
          <div class="section-title">{{ $t('common.language') }}</div>
          <div class="language-selector mobile-language-selector">
            <button class="language-button mobile-lang-btn" @click="toggleMobileLanguageMenu">
              <span class="earth-icon">🌎</span>
              {{ getCurrentLanguageName }}
              <span class="dropdown-arrow" :class="mobileLanguageMenuOpen ? 'open' : ''">▼</span>
            </button>
            <div class="language-dropdown mobile-lang-dropdown" :class="mobileLanguageMenuOpen ? 'open' : 'closed'">
              <div v-for="(name, code) in supportedLanguages" :key="code" class="language-option"
                :class="{ 'active': currentLanguage === code }" @click="changeLanguage(code)">
                {{ name }}
              </div>
            </div>
          </div>
        </li>

        <li><router-link to="/" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.home')
            }}</router-link>
        </li>
        <li><router-link to="/store" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.store')
            }}</router-link></li>
        <li><router-link to="/library" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.library')
            }}</router-link></li>
        <li><router-link to="/downloads" class="nav-link mobile-link" @click="menuOpen = false">{{
          $t('navbar.downloads')
            }}</router-link></li>
        <li><router-link to="/auction" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.auction')
            }}</router-link></li>
        <li><router-link to="/community" class="nav-link mobile-link" @click="menuOpen = false">{{
          $t('navbar.community')
            }}</router-link></li>
        <li><router-link to="/developer" class="nav-link mobile-link" @click="menuOpen = false">{{
          $t('navbar.developer')
            }}</router-link></li>
        <li><router-link to="/audit-team" class="nav-link mobile-link" @click="menuOpen = false">{{
          $t('navbar.auditTeam')
            }}</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" class="nav-link mobile-link" @click="menuOpen = false">{{
          $t('navbar.admin') }}</router-link></li>
        <li v-if="isAdmin"><router-link to="/dht-manager" class="nav-link mobile-link" @click="menuOpen = false">DHT
            管理器</router-link></li>
        <li><a href="#" class="nav-link mobile-link">{{ $t('navbar.aboutUs') }}</a></li>
        <li v-if="isLoggedIn">
          <router-link to="/profile" class="nav-link mobile-link" @click="menuOpen = false">
            <div class="user-avatar">{{ userInitial }}</div>
            <span>{{ user.username }}</span>
          </router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.login')
            }}</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/register" class="nav-link mobile-link" @click="menuOpen = false">{{ $t('navbar.register')
            }}</router-link>
        </li>
      </ul>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <h3>{{ $t('footer.aboutUs') }}</h3>
            <p>{{ $t('footer.aboutText') }}</p>
          </div>
          <div class="footer-column">
            <h3>{{ $t('footer.quickLinks') }}</h3>
            <ul>
              <li><router-link to="/store">{{ $t('footer.gameStore') }}</router-link></li>
              <li><router-link to="/library">{{ $t('footer.myLibrary') }}</router-link></li>
              <li><router-link to="/downloads">{{ $t('footer.downloadClients') }}</router-link></li>
              <li><a href="#">{{ $t('footer.developerResources') }}</a></li>
              <li><a href="#">{{ $t('footer.supportCenter') }}</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>{{ $t('footer.contactUs') }}</h3>
            <p>{{ $t('footer.email') }}: <a href="mailto:fancybit@qq.com" target="_blank">fancybit@qq.com</a></p>
            <p>{{ $t('footer.qqSpace') }}: <a href="https://148332727.qzone.qq.com" target="_blank">点击进入</a></p>
            <p>{{ $t('footer.qq') }}: <a href="tencent://message/?uin=148332727" target="_blank">148332727</a></p>
            <p>{{ $t('footer.qqGroup') }}: {{ $t('footer.groupName') }} <a
                href="https://jq.qq.com/?_wv=1027&k=1025446555" target="_blank">1025446555</a></p>

          </div>
        </div>
        <div class="copyright">
          <p>{{ $t('footer.copyright', { year: currentYear }) }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<!-- 移除未使用的组合式API代码 -->

<script>
export default {
  name: 'App',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      menuOpen: false,
      languageMenuOpen: false,
      mobileLanguageMenuOpen: false,
      supportedLanguages: {
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
        'es-ES': 'Español',
        'fr-FR': 'Français',
        'de-DE': 'Deutsch',
        'ru-RU': 'Русский'
      }
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    toggleLanguageMenu() {
      this.languageMenuOpen = !this.languageMenuOpen
    },
    toggleMobileLanguageMenu() {
      this.mobileLanguageMenuOpen = !this.mobileLanguageMenuOpen
      // 阻止事件冒泡
      event.stopPropagation()
    },
    changeLanguage(lang) {
      // 保存语言设置到localStorage
      localStorage.setItem('selectedLanguage', lang)

      if (window.channels && window.channels.LangChannel) {
        window.channels.LangChannel.postMessage({
          type: "langChanged",
          lang: lang,
          timestamp: new Date().toISOString()
        });
      }

      // 更新i18n实例的locale，确保格式一致性
      if (this.$i18n) {
        // 将语言代码转换为大写格式以匹配messages对象的键
        const formattedLang = lang.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase())
        this.$i18n.locale = formattedLang
      }

      // 更新HTML的lang属性
      if (document && document.documentElement) {
        // 格式化为标准的lang属性值（如en-US, zh-CN）
        const htmlLang = lang.replace(/-([a-z])/g, (match, p1) => '-' + p1.toUpperCase())
        document.documentElement.lang = htmlLang
      }

      // 关闭所有菜单
      this.languageMenuOpen = false
      this.mobileLanguageMenuOpen = false
      this.menuOpen = false

      // 刷新页面以应用所有翻译
      window.location.reload()
    },
    // 获取浏览器语言
    getBrowserLanguage() {
      const lang = navigator.language || navigator.userLanguage || 'zh-CN'
      const langLower = lang.toLowerCase()

      // 检查是否为中文环境
      if (langLower.includes('zh')) {
        return langLower.includes('tw') ? 'zh-tw' : 'zh-cn'
      }

      // 检查其他支持的语言
      for (const code in this.supportedLanguages) {
        if (langLower.includes(code.split('-')[0])) {
          return code
        }
      }

      return 'zh-cn'
    },
    // 监听点击外部关闭语言菜单
    handleClickOutside(event) {
      // 确保只有在桌面模式下才关闭语言菜单，避免影响移动端体验
      if (window.innerWidth >= 1024) {
        const languageSelector = this.$el.querySelector('.language-selector')
        const logoLanguageSelector = this.$el.querySelector('.logo-language-selector')
        // 如果点击的不是语言选择器元素，关闭菜单
        const isClickInsideLanguageSelector = languageSelector && languageSelector.contains(event.target)
        const isClickInsideLogoLanguageSelector = logoLanguageSelector && logoLanguageSelector.contains(event.target)

        if (!isClickInsideLanguageSelector && !isClickInsideLogoLanguageSelector) {
          this.languageMenuOpen = false
        }
      }
    },
    // 处理窗口大小变化
    handleResize() {
      // 当窗口宽度大于等于1024px（桌面模式）时，自动关闭移动端菜单
      if (window.innerWidth >= 1024) {
        this.menuOpen = false
        this.mobileLanguageMenuOpen = false
      }
    },
    // 处理localStorage变化
    handleStorageChange(event) {
      if (event.key === 'user') {
        // 强制重新渲染组件
        this.$forceUpdate()
      }
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('user') !== null
    },
    navbarClasses() {
      return {
        'navbar': true
      }
    },
    desktopNavClasses() {
      return {
        'main-nav': true,
        'desktop-nav': true
      }
    },
    user() {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : { username: '', groups: [] }
    },
    userInitial() {
      return this.user.username ? this.user.username.charAt(0).toUpperCase() : 'U'
    },
    isAdmin() {
      // 同时检查role字段和roles数组，兼容不同的数据格式
      return this.isLoggedIn &&
        (this.user.role === 'admin' ||
          (this.user.roles && this.user.roles.includes('admin')))
    },
    currentLanguage() {
      // 返回当前的i18n语言设置或默认语言
      if (this.$i18n) {
        return this.$i18n.locale
      }
      // 从localStorage获取或使用默认语言
      const savedLang = localStorage.getItem('selectedLanguage')
      if (savedLang) {
        return savedLang.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase())
      }
      return 'zh-CN'
    },
    getCurrentLanguageName() {
      const lang = this.currentLanguage
      return this.supportedLanguages[lang] || lang
    }
  },
  mounted() {
    // 导入全局样式
    import('./assets/css/global.css')
    // 添加点击外部关闭语言菜单的事件监听
    document.addEventListener('click', this.handleClickOutside)
    // 添加窗口大小变化监听器，确保在屏幕变宽时关闭移动端菜单
    window.addEventListener('resize', this.handleResize)
    // 添加localStorage变化监听器，确保登录状态变化时界面能实时更新
    window.addEventListener('storage', this.handleStorageChange)

    // 初始化HTML的lang属性
    if (document && document.documentElement) {
      // 使用当前语言设置HTML lang属性
      const currentLang = this.currentLanguage
      // 确保格式为标准的lang属性值（如en-US, zh-CN）
      document.documentElement.lang = currentLang
    }
  },
  beforeUnmount() {
    // 移除事件监听
    document.removeEventListener('click', this.handleClickOutside)
    // 移除窗口大小变化监听器
    window.removeEventListener('resize', this.handleResize)
    // 移除localStorage变化监听器
    window.removeEventListener('storage', this.handleStorageChange)
  }
}
</script>

<style>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

/* 响应式工具类 */
.desktop-only {
  display: none;
}

.mobile-only {
  display: block;
}

/* 语言选择器基础样式 */
.language-selector,
.logo-language-selector {
  position: relative;
  z-index: 1000;
  background-color: transparent;
}

/* 语言下拉菜单基础样式 */
.language-dropdown {
  display: block;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 5px 0;
  min-width: 150px;
}

.earth-icon {
  font-size: 1.1rem;
  margin-right: 5px;
}


/* 导航栏样式 */
.navbar {
  background-color: #1a1a1a;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}



.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.logo-image {
  width: 64px;
  height: 64px;
  margin-right: 8px;
}

.logo-text h1 {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2;
}

.menu-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1001;
}

.menu-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 5px 0;
  transition: all 0.3s ease;
}

/* 桌面端导航样式 */
.main-nav {
  background-color: #1a1a1a;
}

.main-nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  display: block;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #333;
}

/* 用户控件样式 */
.user-controls {
  padding: 15px;
  background-color: #222;
}

.login-button,
.register-button {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 10px;
}

.login-button {
  background-color: transparent;
  border: 1px solid var(--button-primary);
}

.register-button {
  background-color: var(--button-primary);
  border: 1px solid var(--button-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: #333;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: var(--button-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: bold;
  font-size: 14px;
}

/* 主内容区样式 */
.main-content {
  min-height: calc(100vh - 100px);
  padding: 20px 0;
}

/* 页脚样式 */
.footer {
  background-color: #1a1a1a;
  color: #ccc;
  padding: 30px 0;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.footer-column h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: 8px;
}

.footer-column a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: white;
}

.copyright {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 0.9rem;
}

/* 移动端菜单样式 */
.mobile-menu {
  background-color: #1a1a1a;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 999;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}

.mobile-menu ul {
  list-style: none;
}

.mobile-link {
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

/* 语言选择器详细样式 */
.language-selector {
  margin-bottom: 15px;
}

/* 移动端语言下拉菜单样式 */
.mobile-menu .language-dropdown {
  position: static;
  width: 100%;
  min-width: unset;
  right: unset;
  margin-top: 0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1002;
  background-color: #222;
  border: 1px solid #444;
  white-space: normal;
}

/* 桌面端样式下的语言选择器 */
@media (min-width: 1024px) {
  .language-selector {
    margin-right: 15px;
  }

  /* 调整语言选择按钮位置，使其与导航栏元素对齐 */
  .user-controls .language-selector .language-button {
    padding: 5px 10px;
    /* 减小padding使其与导航链接一致 */
    height: 36px;
    /* 设置固定高度 */
    vertical-align: middle;
    margin-top: 20px;
    /* 将按钮向下移动20像素 */
  }
}

/* 移动端语言选择器样式 - 在汉堡菜单中显示 */
.mobile-menu .language-selector {
  display: block;
  position: static;
  margin: 0;
  z-index: 1002;
}

.mobile-menu .earth-icon {
  margin-right: 8px;
}

.mobile-lang-btn {
  width: 100%;
  text-align: left;
  background-color: #222;
  border: 1px solid #444;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 移动端语言下拉菜单样式 */
.mobile-lang-dropdown {
  position: static;
  margin-top: -1px;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1002;
  background-color: #222;
  border: 1px solid #444;
  border-top: none;
  width: 100%;
  padding: 5px 0;
  transition: all 0.3s ease;
}

/* 关闭状态 */
.mobile-lang-dropdown.closed {
  display: none;
  opacity: 0;
  max-height: 0;
}

/* 打开状态 */
.mobile-lang-dropdown.open {
  display: block;
  opacity: 1;
  max-height: 500px;
}

/* 语言选项样式 */
.language-option {
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-option:hover {
  background-color: #333;
}

.language-option.active {
  background-color: var(--button-primary);
  color: white;
}

.language-button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dropdown-arrow {
  margin-left: 10px;
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.logo-language-selector .language-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 120px;
  /* 下拉菜单适当加宽以便显示语言名称 */
  background-color: #222;
  border: 1px solid #444;
  border-radius: 4px;
  margin-top: 5px;
  z-index: 1000;
  white-space: nowrap;
}

.language-option {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.language-option:hover {
  background-color: #333;
}

.language-option.active {
  background-color: #4CAF50;
  color: white;
}

/* 移动端语言选择样式 */
.mobile-language-section {
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

/* 确保桌面导航在竖屏模式下隐藏但不影响其他元素 */
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
}

.section-title {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.mobile-language-option {
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.mobile-language-option:hover {
  color: var(--button-primary);
}

.mobile-language-option.active {
  color: var(--button-primary);
  font-weight: bold;
}

/* 平板端样式 */
@media (min-width: 768px) {
  .logo-text h1 {
    font-size: 1.5rem;
  }

  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }

  .footer-column {
    flex: 1;
  }


}

/* 桌面端样式 */
@media (min-width: 1024px) {
  .desktop-only {
    display: block;
  }

  .mobile-only {
    display: none;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 确保页脚copyright单独一行并居中 */
  .footer .container {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
  }

  .copyright {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #333;
  }

  .main-nav ul {
    flex-direction: row;
  }

  .nav-link {
    padding: 20px 15px;
  }

  .user-controls {
    background-color: transparent;
    padding: 0;
    display: flex;
    align-items: center;
  }

  /* 在平板和桌面端显示语言选择器 */
  .language-selector {
    display: flex;
    margin-right: 15px;
  }

  .language-button {
    width: auto;
    background-color: #333;
    border: 1px solid #444;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #222;
    border: 1px solid #444;
    border-radius: 4px;
    margin-top: 5px;
    min-width: 150px;
    z-index: 1000;
  }

  .language-dropdown {
    min-width: 150px;
  }
}

/* 移动端页脚样式 */
@media (max-width: 767px) {
  .footer-content {
    padding: 0 10px;
  }

  .footer-column {
    margin-bottom: 20px;
  }
}

/* 平板端页脚样式 */
@media (min-width: 768px) and (max-width: 1023px) {
  .footer-content {
    flex-wrap: wrap;
  }

  .footer-column {
    flex: 0 0 48%;
    margin-bottom: 20px;
  }
}
</style>
