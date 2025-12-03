<template>
  <div class="forgot-password-container">
    <div class="forgot-password-wrapper fade-in">
      <div class="forgot-password-header">
        <img src="@/assets/logo.png" alt="玄玉逍游" class="forgot-password-logo">
        <h1>{{ $t('forgotPassword.title') }}</h1>
        <p>{{ $t('forgotPassword.subtitle') }}</p>
      </div>
      
      <div class="forgot-password-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <div class="form-group">
          <label for="email">电子邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            class="form-control"
            placeholder="请输入您注册时使用的邮箱"
            required
            @keyup.enter="handleSubmit"
          >
        </div>
        
        <button 
          class="btn btn-primary submit-button"
          @click="handleSubmit"
          :disabled="loading || !isValidEmail"
        >
          {{ loading ? '发送中...' : '发送重置链接' }}
        </button>
        
        <div class="form-footer">
          <router-link to="/login" class="back-to-login">{{ $t('forgotPassword.backToLogin') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/userService';

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      form: {
        email: ''
      },
      error: '',
      success: '',
      loading: false
    }
  },
  computed: {
    isValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isValidEmail) {
        this.error = '请输入有效的电子邮箱';
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        const response = await userService.requestPasswordReset(this.form.email);
        
        if (response.success) {
          this.success = response.message || '密码重置链接已发送到您的邮箱';
          this.form.email = '';
        } else {
          this.error = response.error || '发送失败，请稍后重试';
        }
      } catch (error) {
        this.error = error.response?.data?.error || '网络错误，请稍后重试';
        console.error('请求密码重置错误:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
}

.forgot-password-wrapper {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 30px;
}

.forgot-password-logo {
  height: 80px;
  width: auto;
  margin-bottom: 20px;
}

.forgot-password-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.forgot-password-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.forgot-password-form {
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

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.back-to-login {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.back-to-login:hover {
  color: var(--hover-color);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .forgot-password-wrapper {
    padding: 30px 20px;
  }
  
  .forgot-password-logo {
    height: 60px;
  }
}
</style>
