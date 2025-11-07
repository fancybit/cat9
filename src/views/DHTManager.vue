<template>
  <div class="dht-manager">
    <h1>DHT 分布式哈希表管理</h1>
    
    <!-- 服务器状态卡片 -->
    <div class="status-card" :class="{ 'running': dhtStatus.status === 'running', 'stopped': dhtStatus.status === 'stopped' }">
      <h2>服务器状态</h2>
      <div class="status-info">
        <p><strong>状态:</strong> {{ dhtStatus.status === 'running' ? '运行中' : '已停止' }}</p>
        <p><strong>节点ID:</strong> {{ dhtStatus.peerId || 'N/A' }}</p>
        <p><strong>连接节点数:</strong> {{ dhtStatus.connectionCount || 0 }}</p>
        <p><strong>路由表大小:</strong> {{ dhtStatus.routingTableSize || 0 }}</p>
      </div>
      
      <div class="multiaddrs" v-if="dhtStatus.multiaddrs && dhtStatus.multiaddrs.length > 0">
        <h3>节点地址:</h3>
        <div v-for="(addr, index) in dhtStatus.multiaddrs" :key="index" class="multiaddr">
          {{ addr }}
        </div>
      </div>
    </div>

    <!-- 数据存储表单 -->
    <div class="action-card">
      <h2>存储数据到 DHT</h2>
      <form @submit.prevent="storeData">
        <div class="form-group">
          <label for="store-key">键:</label>
          <input type="text" id="store-key" v-model="storeForm.key" required placeholder="输入键名">
        </div>
        <div class="form-group">
          <label for="store-value">值:</label>
          <textarea id="store-value" v-model="storeForm.value" required placeholder="输入要存储的数据"></textarea>
        </div>
        <button type="submit" :disabled="isLoading">存储数据</button>
      </form>
    </div>

    <!-- 数据检索表单 -->
    <div class="action-card">
      <h2>从 DHT 检索数据</h2>
      <form @submit.prevent="retrieveData">
        <div class="form-group">
          <label for="retrieve-key">键:</label>
          <input type="text" id="retrieve-key" v-model="retrieveForm.key" required placeholder="输入要检索的键名">
        </div>
        <button type="submit" :disabled="isLoading">检索数据</button>
      </form>
      
      <div v-if="retrieveResult" class="result-card">
        <h3>检索结果:</h3>
        <p><strong>键:</strong> {{ retrieveResult.key }}</p>
        <p><strong>值:</strong> {{ retrieveResult.value }}</p>
      </div>
    </div>

    <!-- 查找提供者 -->
    <div class="action-card">
      <h2>查找提供数据的节点</h2>
      <form @submit.prevent="findProviders">
        <div class="form-group">
          <label for="providers-key">键:</label>
          <input type="text" id="providers-key" v-model="providersForm.key" required placeholder="输入要查找的键名">
        </div>
        <button type="submit" :disabled="isLoading">查找节点</button>
      </form>
      
      <div v-if="providersResult && providersResult.length > 0" class="result-card">
        <h3>提供节点:</h3>
        <ul>
          <li v-for="(provider, index) in providersResult" :key="index">{{ provider }}</li>
        </ul>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
      <button @click="clearMessage" class="close-btn">&times;</button>
    </div>
  </div>
</template>

<script>
import dhtService from '../services/dhtService';

export default {
  name: 'DHTManager',
  data() {
    return {
      dhtStatus: {
        status: 'stopped',
        initialized: false
      },
      storeForm: {
        key: '',
        value: ''
      },
      retrieveForm: {
        key: ''
      },
      retrieveResult: null,
      providersForm: {
        key: ''
      },
      providersResult: null,
      isLoading: false,
      message: '',
      messageType: ''
    };
  },
  mounted() {
    // 页面加载时获取 DHT 状态
    this.fetchStatus();
    // 每 30 秒更新一次状态
    this.statusInterval = setInterval(() => {
      this.fetchStatus();
    }, 30000);
  },
  beforeUnmount() {
    // 清理定时器
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
  methods: {
    // 获取 DHT 状态
    async fetchStatus() {
      try {
        const response = await dhtService.getStatus();
        if (response.success) {
          this.dhtStatus = response.data;
        }
      } catch (error) {
        this.showMessage('获取 DHT 状态失败', 'error');
        console.error('获取 DHT 状态失败:', error);
      }
    },
    
    // 存储数据
    async storeData() {
      this.isLoading = true;
      try {
        const response = await dhtService.storeData(this.storeForm.key, this.storeForm.value);
        if (response.success) {
          this.showMessage('数据存储成功', 'success');
          this.storeForm.key = '';
          this.storeForm.value = '';
        } else {
          this.showMessage('数据存储失败: ' + (response.message || '未知错误'), 'error');
        }
      } catch (error) {
        this.showMessage('数据存储失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    // 检索数据
    async retrieveData() {
      this.isLoading = true;
      try {
        const response = await dhtService.retrieveData(this.retrieveForm.key);
        if (response.success) {
          this.retrieveResult = response.data;
          this.showMessage('数据检索成功', 'success');
        } else {
          this.retrieveResult = null;
          this.showMessage('数据检索失败: ' + (response.error || '未知错误'), 'error');
        }
      } catch (error) {
        this.retrieveResult = null;
        this.showMessage('数据检索失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    // 查找提供者
    async findProviders() {
      this.isLoading = true;
      try {
        const response = await dhtService.findProviders(this.providersForm.key);
        if (response.success) {
          this.providersResult = response.data.providers;
          this.showMessage(`找到 ${this.providersResult.length} 个提供节点`, 'success');
        } else {
          this.providersResult = null;
          this.showMessage('查找节点失败: ' + (response.error || '未知错误'), 'error');
        }
      } catch (error) {
        this.providersResult = null;
        this.showMessage('查找节点失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    // 显示消息
    showMessage(message, type = 'info') {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.clearMessage();
      }, 5000);
    },
    
    // 清除消息
    clearMessage() {
      this.message = '';
      this.messageType = '';
    }
  }
};
</script>

<style scoped>
.dht-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.status-card,
.action-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 25px;
}

.status-card.running {
  border-left: 4px solid #27ae60;
}

.status-card.stopped {
  border-left: 4px solid #e74c3c;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #34495e;
  font-size: 1.4rem;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.status-info p {
  margin: 8px 0;
  color: #34495e;
}

.multiaddrs {
  margin-top: 15px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.multiaddr {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  padding: 5px 0;
  color: #3498db;
  word-break: break-all;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #34495e;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background: #2980b9;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.result-card {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #3498db;
}

.result-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.result-card p {
  margin: 8px 0;
  word-break: break-all;
}

ul {
  padding-left: 20px;
}

li {
  margin: 5px 0;
  font-family: 'Courier New', monospace;
  color: #3498db;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
}

.message.success {
  background: #27ae60;
}

.message.error {
  background: #e74c3c;
}

.message.info {
  background: #3498db;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0;
  margin-left: 15px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .message {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>