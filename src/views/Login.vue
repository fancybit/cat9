<template>
  <div class="login-container">
    <div class="login-wrapper fade-in">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="玄玉逍游" class="login-logo">
        <h1>{{ $t('login.title') }}</h1>
        <p>{{ $t('login.subtitle') }}</p>
      </div>
      
      <div class="login-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-group">
          <label for="username">{{ $t('login.username') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username"
            class="form-control"
            :placeholder="$t('login.placeholderUsername')"
            required
            @keyup.enter="handleLogin"
          >
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            class="form-control"
            :placeholder="$t('login.placeholderPassword')"
            required
            @keyup.enter="handleLogin"
          >
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            <span>{{ $t('login.rememberMe') }}</span>
          </label>
          <router-link to="#" class="forgot-password">{{ $t('login.forgotPassword') }}</router-link>
        </div>
        
        <button 
          class="btn btn-primary login-button"
          @click="handleLogin"
          :disabled="loading"
        >
          {{ loading ? $t('login.loggingIn') : $t('login.login') }}
        </button>
        
        <div class="divider">
          <span>{{ $t('login.or') }}</span>
        </div>
        
        <button class="btn btn-outline register-button" @click="goToRegister">
          {{ $t('login.createAccount') }}
        </button>
      </div>
      
      <div class="login-footer">
        <p>{{ $t('login.otherLoginMethods') }}</p>
        <div class="social-login">
          <button class="social-button wechat">
            <i class="icon-wechat"></i> {{ $t('login.wechat') }}
          </button>
          <button class="social-button alipay">
            <i class="icon-alipay"></i> {{ $t('login.alipay') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false
      },
      error: '',
      loading: false
    }
  },
  methods: {
    handleLogin() {
      // 简单验证
      if (!this.form.username || !this.form.password) {
        this.error = '请输入用户名和密码'
        return
      }
      
      this.loading = true
      this.error = ''
      
      // 模拟登录请求
      setTimeout(() => {
        // 模拟登录成功，根据用户名判断是否为管理员
        const isAdminUser = this.form.username === 'admin'
        const mockUser = {
          id: isAdminUser ? 'admin1' : '1',
          username: this.form.username,
          displayName: this.form.username,
          email: `${this.form.username}@example.com`,
          avatar: '',
          wallet: {
            balance: 1000
          },
          roles: isAdminUser ? ['user', 'admin'] : ['user']
        }
        
        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        this.loading = false
        
        // 登录成功后跳转
        this.$router.push('/profile')
      }, 1000)
    },
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
}

.login-wrapper {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  height: 80px;
  width: auto;
  margin-bottom: 20px;
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.login-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-form {
  margin-bottom: 30px;
}

.error-message {
  background-color: rgba(184, 56, 56, 0.2);
  border: 1px solid var(--error-color);
  color: var(--error-color);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-secondary);
}

.remember-me input[type="checkbox"] {
  cursor: pointer;
}

.forgot-password {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--hover-color);
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.divider span {
  padding: 0 15px;
}

.register-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.login-footer {
  text-align: center;
}

.login-footer p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 15px;
}

.social-login {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.social-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  background-color: var(--secondary-color);
  color: var(--text-color);
  font-size: 14px;
}

.social-button:hover {
  background-color: var(--button-secondary-hover);
  transform: translateY(-2px);
}

.social-button.wechat {
  background-color: #09bb07;
  color: white;
}

.social-button.wechat:hover {
  background-color: #07a006;
}

.social-button.alipay {
  background-color: #1677ff;
  color: white;
}

.social-button.alipay:hover {
  background-color: #096dd9;
}

/* 图标占位 */
.icon-wechat::before,
.icon-alipay::before {
  content: '📱';
  margin-right: 5px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-wrapper {
    padding: 30px 20px;
  }
  
  .login-logo {
    height: 60px;
  }
  
  .social-login {
    flex-direction: column;
  }
  
  .social-button {
    width: 100%;
  }
}
</style>