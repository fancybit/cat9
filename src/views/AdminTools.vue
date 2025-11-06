<template>
  <div class="admin-tools-container">
    <div class="admin-sidebar">
      <div class="admin-logo">
        <h2>管理员控制台</h2>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin" class="nav-item" active-class="active">
          <i class="icon-dashboard"></i>
          <span>仪表盘</span>
        </router-link>
        <router-link to="/admin/tools" class="nav-item" active-class="active">
          <i class="icon-tools"></i>
          <span>工具集</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <i class="icon-users"></i>
          <span>用户管理</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" active-class="active">
          <i class="icon-shopping-bag"></i>
          <span>商品管理</span>
        </router-link>
        <router-link to="/admin/software" class="nav-item" active-class="active">
          <i class="icon-software"></i>
          <span>软件管理</span>
        </router-link>
        <router-link to="/admin/transactions" class="nav-item" active-class="active">
          <i class="icon-exchange"></i>
          <span>交易管理</span>
        </router-link>
      </nav>
      <div class="admin-footer">
        <button class="btn btn-outline" @click="handleLogout">退出登录</button>
      </div>
    </div>
    
    <div class="admin-tools-content">
      <div class="admin-header">
        <h1>工具集</h1>
        <div class="user-info">
          <span>{{ currentUser?.username }}</span>
        </div>
      </div>
      
      <div class="tools-section">
        <div class="tool-card">
          <h3>哈希生成工具</h3>
          <div class="tool-content">
            <div class="input-group">
              <label for="hashInput">输入文本:</label>
              <textarea 
                id="hashInput" 
                v-model="hashInput" 
                placeholder="输入需要计算哈希的文本..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="algorithm-selection">
              <label>选择算法:</label>
              <div class="algorithm-buttons">
                <button 
                  v-for="algo in hashAlgorithms" 
                  :key="algo.value"
                  :class="['algorithm-btn', { active: selectedAlgorithm === algo.value }]"
                  @click="selectedAlgorithm = algo.value"
                >
                  {{ algo.name }}
                </button>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="btn btn-primary" @click="generateHash">生成哈希</button>
              <button class="btn btn-outline" @click="clearHashInput">清空</button>
            </div>
            
            <div class="result-container" v-if="hashResult">
              <h4>哈希结果:</h4>
              <div class="hash-result">
                <pre>{{ hashResult }}</pre>
                <button class="copy-btn" @click="copyToClipboard(hashResult)">
                  <i class="icon-copy"></i> 复制
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tool-card">
          <h3>文本加密工具</h3>
          <div class="tool-content">
            <div class="input-group">
              <label for="encryptionInput">输入文本:</label>
              <textarea 
                id="encryptionInput" 
                v-model="encryptionInput" 
                placeholder="输入需要加密的文本..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="input-group">
              <label for="encryptionKey">加密密钥:</label>
              <input 
                type="text" 
                id="encryptionKey" 
                v-model="encryptionKey" 
                placeholder="输入加密密钥..."
              >
            </div>
            
            <div class="algorithm-selection">
              <label>选择加密类型:</label>
              <select v-model="selectedEncryptionType">
                <option value="base64">Base64 编码</option>
                <option value="url">URL 编码</option>
              </select>
            </div>
            
            <div class="action-buttons">
              <button class="btn btn-primary" @click="encryptText">加密文本</button>
              <button class="btn btn-secondary" @click="decryptText">解密文本</button>
              <button class="btn btn-outline" @click="clearEncryptionInput">清空</button>
            </div>
            
            <div class="result-container" v-if="encryptionResult">
              <h4>{{ isEncrypting ? '加密' : '解密' }}结果:</h4>
              <div class="encryption-result">
                <pre>{{ encryptionResult }}</pre>
                <button class="copy-btn" @click="copyToClipboard(encryptionResult)">
                  <i class="icon-copy"></i> 复制
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tool-card">
          <h3>随机数生成器</h3>
          <div class="tool-content">
            <div class="input-group">
              <label for="randomType">生成类型:</label>
              <select v-model="randomType">
                <option value="number">随机数字</option>
                <option value="string">随机字符串</option>
                <option value="guid">GUID/UUID</option>
              </select>
            </div>
            
            <div class="input-group" v-if="randomType === 'number'">
              <div class="range-inputs">
                <div>
                  <label for="minValue">最小值:</label>
                  <input type="number" id="minValue" v-model.number="minValue">
                </div>
                <div>
                  <label for="maxValue">最大值:</label>
                  <input type="number" id="maxValue" v-model.number="maxValue">
                </div>
              </div>
            </div>
            
            <div class="input-group" v-if="randomType === 'string'">
              <label for="stringLength">字符串长度:</label>
              <input type="number" id="stringLength" v-model.number="stringLength">
            </div>
            
            <div class="action-buttons">
              <button class="btn btn-primary" @click="generateRandom">生成随机值</button>
            </div>
            
            <div class="result-container" v-if="randomResult">
              <h4>随机结果:</h4>
              <div class="random-result">
                <pre>{{ randomResult }}</pre>
                <button class="copy-btn" @click="copyToClipboard(randomResult)">
                  <i class="icon-copy"></i> 复制
                </button>
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
  name: 'AdminToolsView',
  data() {
    return {
      currentUser: null,
      // 哈希生成工具
      hashInput: '',
      hashResult: '',
      selectedAlgorithm: 'md5',
      hashAlgorithms: [
        { name: 'MD5', value: 'md5' },
        { name: 'SHA-1', value: 'sha1' },
        { name: 'SHA-256', value: 'sha256' },
        { name: 'SHA-512', value: 'sha512' }
      ],
      // 文本加密工具
      encryptionInput: '',
      encryptionKey: '',
      encryptionResult: '',
      selectedEncryptionType: 'base64',
      isEncrypting: true,
      // 随机数生成器
      randomType: 'number',
      minValue: 0,
      maxValue: 100,
      stringLength: 16,
      randomResult: ''
    }
  },
  created() {
    this.checkAdminPermission()
    this.loadUserData()
  },
  beforeRouteEnter(to, from, next) {
    // 路由进入前检查权限
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.roles || !user.roles.includes('admin')) {
      next({ name: 'Login' })
    } else {
      next()
    }
  },
  methods: {
    checkAdminPermission() {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !user.roles || !user.roles.includes('admin')) {
        this.$router.push('/login')
      }
    },
    loadUserData() {
      const user = JSON.parse(localStorage.getItem('user'))
      this.currentUser = user
    },
    handleLogout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    generateHash() {
      if (!this.hashInput) {
        alert('请输入需要计算哈希的文本')
        return
      }
      
      // 这里使用模拟的哈希计算，实际项目中应该使用专门的加密库
      // 例如 crypto-js、js-sha256 等
      this.hashResult = this.mockHashCalculation(this.hashInput, this.selectedAlgorithm)
    },
    mockHashCalculation(text, algorithm) {
      // 模拟哈希计算结果，实际项目中需要替换为真实的哈希计算
      const mockHashes = {
        md5: `md5_${text.split('').map(char => char.charCodeAt(0).toString(16)).join('')}`,
        sha1: `sha1_${text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(40, '0')}`,
        sha256: `sha256_${text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(64, '0')}`,
        sha512: `sha512_${text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(128, '0')}`
      }
      return mockHashes[algorithm] || text
    },
    encryptText() {
      if (!this.encryptionInput) {
        alert('请输入需要加密的文本')
        return
      }
      
      this.isEncrypting = true
      
      if (this.selectedEncryptionType === 'base64') {
        this.encryptionResult = btoa(encodeURIComponent(this.encryptionInput))
      } else if (this.selectedEncryptionType === 'url') {
        this.encryptionResult = encodeURIComponent(this.encryptionInput)
      }
    },
    decryptText() {
      if (!this.encryptionInput) {
        alert('请输入需要解密的文本')
        return
      }
      
      this.isEncrypting = false
      
      try {
        if (this.selectedEncryptionType === 'base64') {
          this.encryptionResult = decodeURIComponent(atob(this.encryptionInput))
        } else if (this.selectedEncryptionType === 'url') {
          this.encryptionResult = decodeURIComponent(this.encryptionInput)
        }
      } catch (e) {
        this.encryptionResult = '解密失败: 输入格式不正确'
      }
    },
    generateRandom() {
      if (this.randomType === 'number') {
        if (this.minValue >= this.maxValue) {
          alert('最小值必须小于最大值')
          return
        }
        this.randomResult = Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue
      } else if (this.randomType === 'string') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < this.stringLength; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        this.randomResult = result
      } else if (this.randomType === 'guid') {
        // 生成简单的UUID/GUID
        this.randomResult = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text.toString())
        .then(() => {
          // 可以添加复制成功的提示
          alert('已复制到剪贴板')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    },
    clearHashInput() {
      this.hashInput = ''
      this.hashResult = ''
    },
    clearEncryptionInput() {
      this.encryptionInput = ''
      this.encryptionResult = ''
    }
  }
}
</script>

<style scoped>
.admin-tools-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* 侧边栏样式与Admin.vue相同 */
.admin-sidebar {
  width: 240px;
  background-color: var(--sidebar-bg);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.admin-logo {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
}

.admin-logo h2 {
  color: var(--primary-color);
  margin: 0;
  font-size: 20px;
}

.admin-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.nav-item.active {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.nav-item i {
  margin-right: 10px;
  font-size: 18px;
}

.admin-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

/* 内容区域样式 */
.admin-tools-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  color: var(--text-color);
  margin: 0;
}

.user-info {
  color: var(--text-secondary);
}

.tools-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 800px;
}

.tool-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tool-card h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  color: var(--text-color);
  font-weight: 500;
}

.input-group input,
.input-group textarea,
.input-group select {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  font-size: 14px;
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
}

.range-inputs {
  display: flex;
  gap: 15px;
}

.range-inputs > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.algorithm-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.algorithm-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.algorithm-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background-color: var(--input-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.algorithm-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.algorithm-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-color-dark);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--secondary-color-dark);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.result-container {
  background-color: var(--hover-bg);
  border-radius: 6px;
  padding: 15px;
}

.result-container h4 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
}

.hash-result,
.encryption-result,
.random-result {
  position: relative;
  background-color: var(--code-bg);
  border-radius: 4px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
}

.hash-result pre,
.encryption-result pre,
.random-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-color);
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-btn:hover {
  background-color: var(--primary-color-dark);
}
</style>