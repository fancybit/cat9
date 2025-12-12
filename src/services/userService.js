import axios from 'axios';

class UserService {
  constructor() {
    // 浣跨敤鐩稿璺緞锛岄€氳繃褰撳墠鍩熷悕鐨凙PI浠ｇ悊璁块棶鍚庣
    const baseURL = `/api/users`;
    this.api = axios.create({
      baseURL,
      timeout: 10000
    });

    // 娣诲姞璇锋眰鎷︽埅鍣紝鍦ㄨ姹傚ご涓坊鍔爐oken
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    // 娣诲姞鍝嶅簲鎷︽埅鍣紝缁熶竴澶勭悊閿欒
    this.api.interceptors.response.use(
      response => response,
      error => {
        let errorMessage = '缃戠粶閿欒锛岃绋嶅悗閲嶈瘯';
        
        if (error.response) {
          // 鏈嶅姟鍣ㄨ繑鍥炰簡閿欒鐘舵€佺爜
          switch (error.response.status) {
            case 400:
              errorMessage = error.response.data?.error || '璇锋眰鍙傛暟閿欒';
              break;
            case 401:
              errorMessage = error.response.data?.error || '鏈巿鏉冿紝璇烽噸鏂扮櫥褰?;
              // 娓呴櫎鏈湴瀛樺偍鐨勭敤鎴蜂俊鎭拰token
              this.logout();
              break;
            case 403:
              errorMessage = error.response.data?.error || '鏉冮檺涓嶈冻锛屾棤娉曡闂?;
              break;
            case 404:
              errorMessage = error.response.data?.error || '璇锋眰鐨勮祫婧愪笉瀛樺湪';
              break;
            case 500:
              errorMessage = error.response.data?.error || '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?;
              break;
            default:
              errorMessage = error.response.data?.error || `璇锋眰澶辫触锛岀姸鎬佺爜锛?{error.response.status}`;
          }
        } else if (error.request) {
          // 璇锋眰宸插彂鍑猴紝浣嗘病鏈夋敹鍒板搷搴?          errorMessage = '鏈嶅姟鍣ㄦ棤鍝嶅簲锛岃绋嶅悗閲嶈瘯';
        }
        
        console.error('API璇锋眰閿欒:', errorMessage, error);
        return Promise.reject({
          message: errorMessage,
          originalError: error
        });
      }
    );
  }

  /**
   * 鐢ㄦ埛鐧诲綍
   * @param {string} username - 鐢ㄦ埛鍚?   * @param {string} password - 瀵嗙爜
   * @returns {Promise<Object>} 鐧诲綍缁撴灉
   */
  async login(username, password) {
    try {
      const response = await this.api.post('/login', { username, password });
      // 淇濆瓨鐢ㄦ埛淇℃伅鍜宼oken鍒發ocalStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('鐧诲綍澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鐢ㄦ埛娉ㄥ唽
   * @param {Object} userData - 鐢ㄦ埛娉ㄥ唽鏁版嵁
   * @returns {Promise<Object>} 娉ㄥ唽缁撴灉
   */
  async register(userData) {
    try {
      const response = await this.api.post('/register', userData);
      // 淇濆瓨鐢ㄦ埛淇℃伅鍜宼oken鍒發ocalStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('娉ㄥ唽澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鑾峰彇褰撳墠鐢ㄦ埛淇℃伅
   * @returns {Promise<Object>} 鐢ㄦ埛淇℃伅
   */
  async getCurrentUser() {
    try {
      const response = await this.api.get('/me');
      // 鏇存柊localStorage涓殑鐢ㄦ埛淇℃伅
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛淇℃伅澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鏇存柊鐢ㄦ埛淇℃伅
   * @param {Object} userData - 鐢ㄦ埛鏁版嵁
   * @returns {Promise<Object>} 鏇存柊缁撴灉
   */
  async updateUser(userData) {
    try {
      const response = await this.api.put('/me', userData);
      // 鏇存柊localStorage涓殑鐢ㄦ埛淇℃伅
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('鏇存柊鐢ㄦ埛淇℃伅澶辫触:', error);
      throw error;
    }
  }

  /**
   * 鐧诲嚭
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * 妫€鏌ユ槸鍚﹀凡鐧诲綍
   * @returns {boolean} 鏄惁宸茬櫥褰?   */
  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  /**
   * 鑾峰彇褰撳墠鐢ㄦ埛
   * @returns {Object|null} 褰撳墠鐢ㄦ埛
   */
  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * 璇锋眰瀵嗙爜閲嶇疆
   * @param {string} email - 鐢ㄦ埛閭
   * @returns {Promise<Object>} 閲嶇疆瀵嗙爜璇锋眰缁撴灉
   */
  async requestPasswordReset(email) {
    try {
      const response = await this.api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('璇锋眰瀵嗙爜閲嶇疆澶辫触:', error);
      throw error;
    }
  }

  /**
   * 楠岃瘉瀵嗙爜閲嶇疆浠ょ墝
   * @param {string} token - 閲嶇疆浠ょ墝
   * @returns {Promise<Object>} 楠岃瘉缁撴灉
   */
  async verifyResetToken(token) {
    try {
      const response = await this.api.get(`/reset-password/${token}`);
      return response.data;
    } catch (error) {
      console.error('楠岃瘉閲嶇疆浠ょ墝澶辫触:', error);
      throw error;
    }
  }

  /**
   * 閲嶇疆瀵嗙爜
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} token - 閲嶇疆浠ょ墝
   * @param {string} newPassword - 鏂板瘑鐮?   * @returns {Promise<Object>} 閲嶇疆瀵嗙爜缁撴灉
   */
  async resetPassword(userId, token, newPassword) {
    try {
      const response = await this.api.post(`/reset-password/${userId}/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      console.error('閲嶇疆瀵嗙爜澶辫触:', error);
      throw error;
    }
  }
}

export default new UserService();

// 澶村儚涓婁紶鏂规硶
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const token = localStorage.getItem('token');
    // 浣跨敤鐩稿璺緞锛岄€氳繃褰撳墠鍩熷悕鐨凙PI浠ｇ悊璁块棶鍚庣
    const apiUrl = `/api/users/avatar`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('澶村儚涓婁紶澶辫触');
    }
    
    const data = await response.json();
    // 鏇存柊localStorage涓殑鐢ㄦ埛淇℃伅
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.avatar = data.avatarUrl;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return data;
  } catch (error) {
    console.error('澶村儚涓婁紶閿欒:', error);
    throw error;
  }
};
