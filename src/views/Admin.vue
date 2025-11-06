
<template>
  <div class="admin-container">
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
    
    <div class="admin-content">
      <div class="admin-header">
        <h1>仪表盘</h1>
        <div class="user-info">
          <span>{{ currentUser?.username }}</span>
        </div>
      </div>
      
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon users"><i class="icon-user"></i></div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon products"><i class="icon-shopping-bag"></i></div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalProducts }}</div>
            <div class="stat-label">商品总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon software"><i class="icon-software"></i></div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalSoftware }}</div>
            <div class="stat-label">软件总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon transactions"><i class="icon-exchange"></i></div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalTransactions }}</div>
            <div class="stat-label">交易总数</div>
          </div>
        </div>
      </div>
      
      <div class="admin-sections">
        <div class="section-card">
          <h3>最近用户活动</h3>
          <div class="activity-list">
            <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-card">
          <h3>系统状态</h3>
          <div class="system-status">
            <div class="status-item">
              <span>数据库状态:</span>
              <span class="status-indicator online">在线</span>
            </div>
            <div class="status-item">
              <span>服务器时间:</span>
              <span>{{ serverTime }}</span>
            </div>
            <div class="status-item">
              <span>当前环境:</span>
              <span>{{ environment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      currentUser: null,
      stats: {
        totalUsers: 150,
        totalProducts: 48,
        totalSoftware: 23,
        totalTransactions: 320
      },
      recentActivities: [
        {
          id: 1,
          icon: '👤',
          description: '用户 testuser 登录系统',
          time: '5分钟前'
        },
        {
          id: 2,
          icon: '💰',
          description: '交易 #TX123456 已完成',
          time: '15分钟前'
        },
        {
          id: 3,
          icon: '📦',
          description: '商品 "高级工具包" 库存已更新',
          time: '30分钟前'
        }
      ],
      serverTime: new Date().toLocaleString(),
      environment: process.env.NODE_ENV || 'development'
    }
  },
  created() {
    this.checkAdminPermission()
    this.loadUserData()
    this.startTimeSync()
  },
  beforeRouteEnter(to, from, next) {
    // 路由进入前检查权限
    const txtData = localStorage.getItem('user');
    console.log("user info:"+txtData);
    const user = JSON.parse(txtData)
    if (!user || !user.roles || !user.roles.includes('admin')) {
      next({ name: 'Login' })
    } else {
      next()
    }
  },
  methods: {
    checkAdminPermission() {
      const txtData = localStorage.getItem('user');
      console.log("user info:"+txtData);
      const user = JSON.parse(txtData)
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
    startTimeSync() {
      // 每分钟更新一次服务器时间显示
      setInterval(() => {
        this.serverTime = new Date().toLocaleString()
      }, 60000)
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
}

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

.admin-content {
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

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.stat-icon.users {
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.stat-icon.products {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.stat-icon.software {
  background-color: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
}

.stat-icon.transactions {
  background-color: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.admin-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.section-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-card h3 {
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 16px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: var(--text-color);
  margin-bottom: 5px;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--hover-bg);
  border-radius: 4px;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-indicator.online {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}
</style>