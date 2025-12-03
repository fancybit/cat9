<template>
  <div class="reset-password-container">
    <div class="reset-password-wrapper fade-in">
      <div class="reset-password-header">
        <img src="@/assets/logo.png" alt="玄玉逍游" class="reset-password-logo">
        <h1>重置密码</h1>
        <p>请输入您的新密码</p>
      </div>
      
      <div class="reset-password-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <div v-if="tokenValid === false" class="error-message">
          无效的重置令牌，请重新请求密码重置
        </div>
        
        <template v-if="tokenValid !== false">
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="form.newPassword"
              class="form-control"
              placeholder="至少8个字符，包含字母和数字"
              required
              @keyup.enter="handleSubmit"
            >
            <small v-if="form.newPassword" :class="{ valid: isValidPassword, invalid: !isValidPassword }">
              {{ isValidPassword ? '✓ 密码强度符合要求' : '✗ 密码太弱' }}
            </small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="form.confirmPassword"
              class="form-control"
              placeholder="请再次输入新密码"
              required
              @keyup.enter="handleSubmit"
            >
            <small v-if="form.confirmPassword" :class="{ valid: passwordsMatch, invalid: !passwordsMatch }">
              {{ passwordsMatch ? '✓ 密码一致' : '✗ 密码不一致' }}
            </small>
          </div>
          
          <button 
            class="btn btn-primary submit-button"
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? '重置中...' : '重置密码' }}
          </button>
          
          <div class="form-footer">
            <router-link to="/login" class="back-to-login">返回登录</router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/userService';

export default {
  name: 'ResetPasswordView',
  data() {
    return {
      form: {
        newPassword: '',
        confirmPassword: ''
      },
      error: '',
      success: '',
      loading: false,
      tokenValid: null, // null: 未验证, true: 有效, false: 无效
      userId: null
    }
  },
  computed: {
    isValidPassword() {
      return this.form.newPassword.length >= 8 && /[a-zA-Z]/.test(this.form.newPassword) && /[0-9]/.test(this.form.newPassword)
    },
    passwordsMatch() {
      return this.form.newPassword === this.form.confirmPassword
    },
    isFormValid() {
      return this.isValidPassword && this.passwordsMatch
    }
  },
  async created() {
    // 从URL参数中获取重置令牌
    const token = this.$route.query.token;
    if (!token) {
      this.tokenValid = false;
      this.error = '缺少重置令牌';
      return;
    }
    
    try {
      // 验证重置令牌
      const response = await userService.verifyResetToken(token);
      if (response.success) {
        this.tokenValid = true;
        this.userId = response.userId;
      } else {
        this.tokenValid = false;
        this.error = response.error;
      }
    } catch (error) {
      this.tokenValid = false;
      this.error = '验证令牌失败，请重新请求密码重置';
      console.error('验证令牌错误:', error);
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isFormValid) {
        this.error = '请确保所有必填项填写正确';
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        const token = this.$route.query.token;
        const response = await userService.resetPassword(this.userId, token, this.form.newPassword);
        
        if (response.success) {
          this.success = response.message || '密码重置成功';
          this.form = {
            newPassword: '',
            confirmPassword: ''
          };
          
          // 3秒后跳转到登录页面
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
        } else {
          this.error = response.error || '密码重置失败';
        }
      } catch (error) {
        this.error = error.response?.data?.error || '网络错误，请稍后重试';
        console.error('密码重置错误:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color));
}

.reset-password-wrapper {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.reset-password-header {
  text-align: center;
  margin-bottom: 30px;
}

.reset-password-logo {
  height: 80px;
  width: auto;
  margin-bottom: 20px;
}

.reset-password-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.reset-password-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.reset-password-form {
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
  margin-bottom: 20px;
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
  .reset-password-wrapper {
    padding: 30px 20px;
  }
  
  .reset-password-logo {
    height: 60px;
  }
}
</style>
