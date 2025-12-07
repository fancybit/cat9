<template>
  <div class="register-container">
    <div class="register-wrapper fade-in">
      <div class="register-header">
        <img src="@/assets/logo.png" alt="玄玉逍游" class="register-logo">
        <h1>{{ $t('register.title') }}</h1>
        <p>{{ $t('register.subtitle') }}</p>
      </div>
      
      <div class="register-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <div class="form-group">
          <label for="username">{{ $t('register.username') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username"
            class="form-control"
            :placeholder="$t('register.placeholderUsername')"
            required
          >
          <small v-if="form.username" :class="{ valid: isValidUsername, invalid: !isValidUsername }">
            {{ isValidUsername ? $t('register.usernameValid') : $t('register.usernameInvalid') }}
          </small>
        </div>
        
        <div class="form-group">
          <label for="email">{{ $t('register.email') }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            class="form-control"
            :placeholder="$t('register.placeholderEmail')"
            required
          >
          <small v-if="form.email" :class="{ valid: isValidEmail, invalid: !isValidEmail }">
            {{ isValidEmail ? $t('register.emailValid') : $t('register.emailInvalid') }}
          </small>
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('register.password') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            class="form-control"
            :placeholder="$t('register.placeholderPassword')"
            required
          >
          <small v-if="form.password" :class="{ valid: isValidPassword, invalid: !isValidPassword }">
            {{ isValidPassword ? $t('register.passwordValid') : $t('register.passwordInvalid') }}
          </small>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">{{ $t('register.confirmPassword') }}</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword"
            class="form-control"
            :placeholder="$t('register.placeholderPassword')"
            required
          >
          <small v-if="form.confirmPassword" :class="{ valid: passwordsMatch, invalid: !passwordsMatch }">
            {{ passwordsMatch ? $t('register.passwordsMatchValid') : $t('register.passwordsMatchInvalid') }}
          </small>
        </div>
        
        <div class="form-group">
          <label class="terms-agreement">
            <input type="checkbox" v-model="form.agreeTerms">
            <span>{{ $t('register.agreeTerms') }} <a href="#" class="terms-link">{{ $t('register.terms') }}</a> {{ $t('register.and') }} <a href="#" class="terms-link">{{ $t('register.privacy') }}</a></span>
          </label>
        </div>
        
        <button 
          class="btn btn-primary register-button"
          @click="handleRegister"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? $t('register.registering') : $t('register.createAccount') }}
        </button>
        
        <div class="divider">
          <span>{{ $t('register.or') }}</span>
        </div>
        
        <button class="btn btn-outline login-button" @click="goToLogin">
          {{ $t('register.backToLogin') }}
        </button>
      </div>
      
      <div class="register-footer">
        <p>{{ $t('register.thirdPartyRegister') }}</p>
        <div class="social-register">
          <button class="social-button wechat">
            <i class="icon-wechat"></i> {{ $t('register.wechat') }}
          </button>
          <button class="social-button alipay">
            <i class="icon-alipay"></i> {{ $t('register.alipay') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/userService';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      error: '',
      success: '',
      loading: false
    }
  },
  computed: {
    isValidUsername() {
      return /^[a-zA-Z0-9_]{3,20}$/.test(this.form.username)
    },
    isValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
    },
    isValidPassword() {
      return this.form.password.length >= 8 && /[a-zA-Z]/.test(this.form.password) && /[0-9]/.test(this.form.password)
    },
    passwordsMatch() {
      return this.form.password === this.form.confirmPassword
    },
    isFormValid() {
      return this.isValidUsername && this.isValidEmail && this.isValidPassword && this.passwordsMatch && this.form.agreeTerms
    }
  },
  methods: {
    async handleRegister() {
      if (!this.isFormValid) {
        this.error = '请确保所有必填项填写正确'
        return
      }
      
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        // 调用真实注册API
        const response = await userService.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          displayName: this.form.username
        });
        
        if (response.success) {
          this.loading = false
          this.success = '注册成功！正在跳转...'
          
          // 注册成功后延迟跳转
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        } else {
          this.loading = false
          this.error = response.error || '注册失败'
        }
      } catch (error) {
        this.loading = false
        this.error = error.message || '网络错误，请稍后重试'
        console.error('注册错误:', error)
      }
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
}

.register-wrapper {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-logo {
  height: 80px;
  width: auto;
  margin-bottom: 20px;
}

.register-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.register-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.register-form {
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

.success-message {
  background-color: rgba(76, 107, 34, 0.2);
  border: 1px solid var(--success-color);
  color: var(--success-color);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  position: relative;
}

.form-group small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
}

.form-group small.valid {
  color: var(--success-color);
}

.form-group small.invalid {
  color: var(--error-color);
}

.terms-agreement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.terms-agreement input[type="checkbox"] {
  margin-top: 3px;
  cursor: pointer;
}

.terms-link {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: var(--hover-color);
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
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

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.register-footer {
  text-align: center;
}

.register-footer p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 15px;
}

.social-register {
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
  .register-wrapper {
    padding: 30px 20px;
  }
  
  .register-logo {
    height: 60px;
  }
  
  .social-register {
    flex-direction: column;
  }
  
  .social-button {
    width: 100%;
  }
}
</style>