import axios from 'axios';

class UserService {
  constructor() {
    // 使用相对路径，通过当前域名的API代理访问后端
    const baseURL = `/api/users`;
    this.api = axios.create({
      baseURL,
      timeout: 10000
    });

    // 添加请求拦截器，在请求头中添加token
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    // 添加响应拦截器，统一处理错误
    this.api.interceptors.response.use(
      response => response,
      error => {
        let errorMessage = '网络错误，请稍后重试';
        
        if (error.response) {
          // 服务器返回了错误状态码
          switch (error.response.status) {
            case 400:
              errorMessage = error.response.data?.error || '请求参数错误';
              break;
            case 401:
              errorMessage = error.response.data?.error || '未授权，请重新登录';
              // 清除本地存储的用户信息和token
              this.logout();
              // 重定向到登录页
              window.location.href = '/login';
              break;
            case 403:
              errorMessage = error.response.data?.error || '权限不足，无法访问';
              break;
            case 404:
              errorMessage = error.response.data?.error || '请求的资源不存在';
              break;
            case 500:
              errorMessage = error.response.data?.error || '服务器内部错误';
              break;
            default:
              errorMessage = error.response.data?.error || `请求失败，状态码：${error.response.status}`;
          }
        } else if (error.request) {
          // 请求已发出，但没有收到响应
          errorMessage = '服务器无响应，请稍后重试';
        }
        
        console.error('API请求错误:', errorMessage, error);
        return Promise.reject({
          message: errorMessage,
          originalError: error
        });
      }
    );
  }

  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  async login(username, password) {
    try {
      const response = await this.api.post('/login', { username, password });
      // 保存用户信息和token到localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @returns {Promise<Object>} 注册结果
   */
  async register(userData) {
    try {
      const response = await this.api.post('/register', userData);
      // 保存用户信息和token到localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async getCurrentUser() {
    try {
      const response = await this.api.get('/me');
      // 更新localStorage中的用户信息
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateUser(userData) {
    try {
      const response = await this.api.put('/me', userData);
      // 更新localStorage中的用户信息
      const user = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }

  /**
   * 退出登录
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * 检查是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  /**
   * 获取当前用户
   * @returns {Object|null} 当前用户
   */
  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * 请求密码重置
   * @param {string} email - 用户邮箱
   * @returns {Promise<Object>} 重置密码请求结果
   */
  async requestPasswordReset(email) {
    try {
      const response = await this.api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('请求密码重置失败:', error);
      throw error;
    }
  }

  /**
   * 验证密码重置令牌
   * @param {string} token - 重置令牌
   * @returns {Promise<Object>} 验证结果
   */
  async verifyResetToken(token) {
    try {
      const response = await this.api.get(`/reset-password/${token}`);
      return response.data;
    } catch (error) {
      console.error('验证重置令牌失败:', error);
      throw error;
    }
  }

  /**
   * 重置密码
   * @param {string} userId - 用户ID
   * @param {string} token - 重置令牌
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} 重置密码结果
   */
  async resetPassword(userId, token, newPassword) {
    try {
      const response = await this.api.post(`/reset-password/${userId}/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      console.error('重置密码失败:', error);
      throw error;
    }
  }
}

export default new UserService();

// 头像上传方法
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const token = localStorage.getItem('token');
    // 使用相对路径，通过当前域名的API代理访问后端
    const apiUrl = `/api/users/avatar`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('头像上传失败');
    }
    
    const data = await response.json();
    // 更新localStorage中的用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.avatar = data.avatarUrl;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return data;
  } catch (error) {
    console.error('头像上传错误:', error);
    throw error;
  }
};