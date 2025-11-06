<template>
  <div class="library-container">
    <!-- 库头部 -->
    <div class="library-header">
      <div class="container">
        <h1>我的游戏库</h1>
        
        <div class="library-controls">
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="搜索游戏..."
              class="search-input"
              v-model="searchQuery"
            >
            <button class="search-button">
              <i class="icon-search"></i>
            </button>
          </div>
          
          <div class="view-controls">
            <button 
              :class="{ active: viewMode === 'grid' }" 
              @click="viewMode = 'grid'"
              class="view-button"
              title="网格视图"
            >
              <i class="icon-grid"></i>
            </button>
            <button 
              :class="{ active: viewMode === 'list' }" 
              @click="viewMode = 'list'"
              class="view-button"
              title="列表视图"
            >
              <i class="icon-list"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 库内容 -->
    <div class="library-content">
      <div class="container">
        <!-- 侧边导航 -->
        <div class="library-sidebar">
          <div class="sidebar-section">
            <button 
              :class="{ active: activeCategory === 'all' }" 
              @click="activeCategory = 'all'"
              class="category-button"
            >
              <i class="icon-gamepad"></i>
              <span>全部游戏</span>
              <span class="game-count">({{ games.length }})</span>
            </button>
            <button 
              :class="{ active: activeCategory === 'recent' }" 
              @click="activeCategory = 'recent'"
              class="category-button"
            >
              <i class="icon-clock"></i>
              <span>最近游玩</span>
              <span class="game-count">({{ recentGamesCount }})</span>
            </button>
            <button 
              :class="{ active: activeCategory === 'favorites' }" 
              @click="activeCategory = 'favorites'"
              class="category-button"
            >
              <i class="icon-heart"></i>
              <span>收藏游戏</span>
              <span class="game-count">({{ favoritesCount }})</span>
            </button>
          </div>
          
          <div class="sidebar-section">
            <h3>游戏分类</h3>
            <div class="category-list">
              <button 
                v-for="category in categories" 
                :key="category.id"
                :class="{ active: selectedGenre === category.id }" 
                @click="selectedGenre = category.id"
                class="genre-button"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>安装状态</h3>
            <div class="status-filters">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="showInstalled">
                <span>已安装</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="showNotInstalled">
                <span>未安装</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- 游戏列表 -->
        <div class="library-games">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>正在加载游戏库...</p>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="error-message">
            {{ error }}
            <button class="btn btn-outline" @click="loadGames">重试</button>
          </div>
          
          <!-- 网格视图 -->
          <div v-else-if="viewMode === 'grid'" class="games-grid">
            <div 
              v-for="game in filteredGames" 
              :key="game.id" 
              class="game-card"
              @mouseenter="hoveredGame = game.id"
              @mouseleave="hoveredGame = null"
            >
              <div class="game-card-cover">
                <img :src="game.coverUrl" :alt="game.name" class="game-cover">
                <div class="game-overlay">
                  <div class="game-progress" v-if="game.progress > 0">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: `${game.progress}%` }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ game.progress }}%</span>
                  </div>
                  
                  <div class="game-actions">
                    <button 
                      class="btn btn-primary play-button"
                      @click="launchGame(game)"
                    >
                      <i class="icon-play"></i>
                      {{ game.isInstalled ? '开始游戏' : '安装游戏' }}
                    </button>
                    
                    <button 
                      class="btn btn-icon favorite-button"
                      :class="{ active: game.isFavorite }"
                      @click="toggleFavorite(game)"
                    >
                      <i class="icon-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="game-card-info">
                <h3 class="game-title">{{ game.name }}</h3>
                <div class="game-stats">
                  <span v-if="game.lastPlayed" class="last-played">
                    最近游玩: {{ formatDate(game.lastPlayed) }}
                  </span>
                  <span class="playtime" v-if="game.playtime > 0">
                    游玩时长: {{ formatPlaytime(game.playtime) }}
                  </span>
                </div>
                
                <div class="game-tags">
                  <span v-for="tag in game.tags.slice(0, 3)" :key="tag" class="game-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 列表视图 -->
          <div v-else-if="viewMode === 'list'" class="games-list">
            <div 
              v-for="game in filteredGames" 
              :key="game.id" 
              class="game-list-item"
            >
              <div class="list-item-content">
                <img :src="game.coverUrl" :alt="game.name" class="list-game-cover">
                
                <div class="list-game-info">
                  <h3 class="list-game-title">{{ game.name }}</h3>
                  <div class="list-game-stats">
                    <span class="list-playtime" v-if="game.playtime > 0">
                      {{ formatPlaytime(game.playtime) }}
                    </span>
                    <span class="list-status">
                      {{ game.isInstalled ? '已安装' : '未安装' }}
                    </span>
                    <div class="list-progress" v-if="game.progress > 0">
                      <div class="progress-bar-small">
                        <div 
                          class="progress-fill-small" 
                          :style="{ width: `${game.progress}%` }"
                        ></div>
                      </div>
                      <span class="progress-text-small">{{ game.progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="list-item-actions">
                <button 
                  class="btn btn-primary list-play-button"
                  @click="launchGame(game)"
                >
                  {{ game.isInstalled ? '开始游戏' : '安装游戏' }}
                </button>
                
                <button 
                  class="btn btn-icon list-favorite-button"
                  :class="{ active: game.isFavorite }"
                  @click="toggleFavorite(game)"
                  title="添加到收藏"
                >
                  <i class="icon-heart"></i>
                </button>
                
                <button 
                  class="btn btn-icon list-details-button"
                  @click="showGameDetails(game)"
                  title="游戏详情"
                >
                  <i class="icon-info"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="filteredGames.length === 0" class="empty-state">
            <i class="icon-empty"></i>
            <h3>没有找到游戏</h3>
            <p>{{ getEmptyStateMessage() }}</p>
            <router-link to="/store" class="btn btn-primary">
              浏览商店
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 游戏详情模态框 -->
    <div v-if="showDetails" class="modal-overlay" @click.self="closeDetails">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedGame.name }}</h2>
          <button class="modal-close" @click="closeDetails">×</button>
        </div>
        
        <div class="modal-body">
          <div class="game-detail-cover">
            <img :src="selectedGame.coverUrl" :alt="selectedGame.name">
          </div>
          
          <div class="game-detail-info">
            <div class="detail-section">
              <h3>游戏信息</h3>
              <p>{{ selectedGame.description }}</p>
            </div>
            
            <div class="detail-section">
              <h3>游戏统计</h3>
              <div class="game-stats-grid">
                <div class="stat-item">
                  <span class="stat-label">游玩时长</span>
                  <span class="stat-value">{{ formatPlaytime(selectedGame.playtime) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最后游玩</span>
                  <span class="stat-value">{{ selectedGame.lastPlayed ? formatDate(selectedGame.lastPlayed) : '从未' }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">完成度</span>
                  <span class="stat-value">{{ selectedGame.progress }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">安装状态</span>
                  <span class="stat-value">{{ selectedGame.isInstalled ? '已安装' : '未安装' }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>成就</h3>
              <div v-if="selectedGame.achievements && selectedGame.achievements.length > 0" class="achievements-grid">
                <div 
                  v-for="achievement in selectedGame.achievements" 
                  :key="achievement.id"
                  class="achievement-item"
                  :class="{ unlocked: achievement.unlocked }"
                >
                  <div class="achievement-icon">
                    <i :class="achievement.unlocked ? 'icon-trophy' : 'icon-trophy-locked'"></i>
                  </div>
                  <div class="achievement-info">
                    <h4>{{ achievement.name }}</h4>
                    <p>{{ achievement.description }}</p>
                    <span v-if="achievement.unlocked" class="unlock-date">
                      {{ formatDate(achievement.unlockDate) }}
                    </span>
                  </div>
                </div>
              </div>
              <p v-else class="no-achievements">此游戏暂无成就</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            class="btn btn-primary"
            @click="launchGame(selectedGame)"
          >
            {{ selectedGame.isInstalled ? '开始游戏' : '安装游戏' }}
          </button>
          <button 
            v-if="selectedGame.isInstalled" 
            class="btn btn-outline"
            @click="uninstallGame(selectedGame)"
          >
            卸载游戏
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 网页版中不导入Electron相关API，使用模拟数据
const Cat9API = {
  async getLocalGames() {
    // 模拟游戏数据
    return [
      {
        id: 'game1',
        name: '星际探险家',
        coverUrl: 'https://via.placeholder.com/300x400',
        lastPlayed: new Date().toISOString(),
        playtime: 3600,
        progress: 45,
        isInstalled: true,
        isFavorite: true,
        tags: ['科幻', '冒险'],
        genreId: 1
      },
      {
        id: 'game2',
        name: '魔法学院',
        coverUrl: 'https://via.placeholder.com/300x400',
        lastPlayed: new Date(Date.now() - 86400000).toISOString(),
        playtime: 7200,
        progress: 20,
        isInstalled: true,
        isFavorite: false,
        tags: ['奇幻', '角色扮演'],
        genreId: 3
      },
      {
        id: 'game3',
        name: '赛车传奇',
        coverUrl: 'https://via.placeholder.com/300x400',
        lastPlayed: null,
        playtime: 0,
        progress: 0,
        isInstalled: false,
        isFavorite: true,
        tags: ['竞速', '体育'],
        genreId: 2
      }
    ]
  },
  async getGameDetails(gameId) {
    // 模拟游戏详情
    return {
      id: gameId,
      name: '游戏详情',
      coverUrl: 'https://via.placeholder.com/600x800',
      description: '这是一个精彩的游戏描述，包含游戏的背景故事和玩法介绍。',
      playtime: 10800,
      lastPlayed: new Date().toISOString(),
      progress: 30,
      isInstalled: true,
      achievements: [
        {
          id: 1,
          name: '初入江湖',
          description: '完成游戏教程',
          unlocked: true,
          unlockDate: new Date().toISOString()
        },
        {
          id: 2,
          name: '资深玩家',
          description: '游戏时长达到10小时',
          unlocked: false
        }
      ]
    }
  },
  async launchGame(gameId) {
    console.log(`启动游戏: ${gameId}`)
    alert('游戏启动功能仅在PC客户端中可用')
  },
  async installGame(gameId) {
    console.log(`安装游戏: ${gameId}`)
    alert('游戏安装功能仅在PC客户端中可用')
  },
  async uninstallGame(gameId) {
    console.log(`卸载游戏: ${gameId}`)
    alert('游戏卸载功能仅在PC客户端中可用')
  },
  formatPlaytime(minutes) {
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`
    } else {
      return `${minutes}分钟`
    }
  }
}

export default {
  name: 'LibraryView',
  data() {
    return {
      searchQuery: '',
      viewMode: 'grid',
      activeCategory: 'all',
      selectedGenre: null,
      showInstalled: true,
      showNotInstalled: true,
      hoveredGame: null,
      showDetails: false,
      selectedGame: null,
      isLoading: false,
      error: null,
      categories: [
        { id: 1, name: '动作' },
        { id: 2, name: '冒险' },
        { id: 3, name: '角色扮演' },
        { id: 4, name: '策略' },
        { id: 5, name: '模拟' },
        { id: 6, name: '休闲' }
      ],
      games: []
    }
  },
  computed: {
    filteredGames() {
      return this.games.filter(game => {
        // 搜索过滤
        if (this.searchQuery && !game.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
          return false
        }
        
        // 分类过滤
        if (this.activeCategory === 'recent') {
          if (!game.lastPlayed) return false
        } else if (this.activeCategory === 'favorites') {
          if (!game.isFavorite) return false
        }
        
        // 类型过滤
        if (this.selectedGenre !== null && game.genreId !== this.selectedGenre) {
          return false
        }
        
        // 安装状态过滤
        if (!this.showInstalled && game.isInstalled) return false
        if (!this.showNotInstalled && !game.isInstalled) return false
        
        return true
      }).sort((a, b) => {
        // 排序：最近游玩的在前
        if (this.activeCategory === 'recent') {
          return new Date(b.lastPlayed) - new Date(a.lastPlayed)
        }
        return 0
      })
    },
    recentGamesCount() {
      return this.games.filter(game => game.lastPlayed).length
    },
    favoritesCount() {
      return this.games.filter(game => game.isFavorite).length
    }
  },
  async mounted() {
    await this.loadGames()
  },
  methods: {
    async loadGames() {
      this.isLoading = true
      this.error = null
      try {
        const games = await Cat9API.getLocalGames()
        this.games = games
      } catch (err) {
        console.error('加载游戏列表失败:', err)
        this.error = '加载游戏列表失败，请稍后重试'
      } finally {
        this.isLoading = false
      }
    },
    
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const now = new Date()
      const diffTime = Math.abs(now - d)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return '今天'
      } else if (diffDays === 1) {
        return '昨天'
      } else if (diffDays < 7) {
        return `${diffDays}天前`
      } else {
        return d.toLocaleDateString()
      }
    },
    
    formatPlaytime(minutes) {
      return Cat9API.formatPlaytime(minutes)
    },
    
    async launchGame(game) {
      try {
        if (!game.isInstalled) {
          const result = await Cat9API.installGame(game)
          if (result.success) {
            // 重新加载游戏列表
            await this.loadGames()
            alert(`${game.name} 安装完成！`)
          } else {
            alert(`安装失败: ${result.message}`)
          }
        } else {
          const result = await Cat9API.launchGame(game.id)
          if (result.success) {
            // 更新游戏信息
            game.lastPlayed = new Date().toISOString()
            // 模拟增加游玩时间，实际应该由后端跟踪
            game.playtime += 30
          } else {
            alert(`启动失败: ${result.message}`)
          }
        }
      } catch (error) {
        console.error('操作游戏失败:', error)
        alert('操作失败，请稍后重试')
      }
    },
    
    toggleFavorite(game) {
      // 实际应该调用API来更新收藏状态
      game.isFavorite = !game.isFavorite
    },
    
    async showGameDetails(game) {
      try {
        const details = await Cat9API.getGameDetails(game.id)
        this.selectedGame = details
        this.showDetails = true
      } catch (error) {
        console.error('获取游戏详情失败:', error)
        alert('获取游戏详情失败，请稍后重试')
      }
    },
    
    closeDetails() {
      this.showDetails = false
      this.selectedGame = null
    },
    
    async uninstallGame(game) {
      if (confirm(`确定要卸载 ${game.name} 吗？`)) {
        try {
          const result = await Cat9API.uninstallGame(game.id)
          if (result.success) {
            // 重新加载游戏列表
            await this.loadGames()
            alert(`${game.name} 已卸载`)
          } else {
            alert(`卸载失败: ${result.message}`)
          }
        } catch (error) {
          console.error('卸载游戏失败:', error)
          alert('卸载失败，请稍后重试')
        }
      }
    },
    
    getEmptyStateMessage() {
      if (this.isLoading) {
        return '正在加载游戏...'
      }
      if (this.error) {
        return this.error
      }
      if (this.searchQuery) {
        return `没有找到包含"${this.searchQuery}"的游戏`
      }
      if (this.activeCategory === 'recent') {
        return '您还没有游玩过任何游戏'
      }
      if (this.activeCategory === 'favorites') {
        return '您还没有添加任何收藏游戏'
      }
      return '您的游戏库中还没有游戏'
    }
  }
}
</script>

<style scoped>
.library-container {
  min-height: 100vh;
  background-color: var(--primary-color);
}

/* 加载状态样式 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-color);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: var(--error-color);
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 0;
}

/* 库头部 */
.library-header {
  background-color: var(--card-bg);
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.library-header h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.library-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  background-color: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 3px 0 0 3px;
  color: var(--text-color);
  font-size: 14px;
}

.search-button {
  padding: 10px 20px;
  background-color: var(--button-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0 3px 3px 0;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: var(--button-secondary-hover);
}

.view-controls {
  display: flex;
  background-color: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.view-button {
  padding: 10px 15px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  color: var(--text-color);
  background-color: rgba(255, 255, 255, 0.05);
}

.view-button.active {
  color: var(--accent-color);
  background-color: var(--primary-color);
}

/* 库内容 */
.library-content {
  padding: 30px 0;
}

.library-content .container {
  display: flex;
  gap: 30px;
}

/* 侧边导航 */
.library-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-section {
  background-color: var(--card-bg);
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.sidebar-section h3 {
  padding: 15px 20px;
  font-size: 16px;
  color: var(--text-color);
  background-color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color);
}

.category-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.category-button:last-child {
  border-bottom: none;
}

.category-button:hover {
  background-color: var(--secondary-color);
}

.category-button.active {
  background-color: var(--primary-color);
  color: var(--accent-color);
}

.category-button i {
  margin-right: 12px;
  font-size: 18px;
}

.game-count {
  margin-left: auto;
  color: var(--text-secondary);
  font-size: 14px;
}

.category-list {
  padding: 10px 0;
}

.genre-button {
  display: block;
  width: 100%;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.genre-button:hover {
  color: var(--text-color);
  background-color: var(--secondary-color);
}

.genre-button.active {
  color: var(--accent-color);
  background-color: var(--primary-color);
}

.status-filters {
  padding: 15px 20px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  color: var(--text-secondary);
}

.filter-checkbox:last-child {
  margin-bottom: 0;
}

/* 游戏列表 */
.library-games {
  flex: 1;
}

/* 网格视图 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.game-card {
  background-color: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.game-card-cover {
  position: relative;
  height: 320px;
  overflow: hidden;
}

.game-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-cover {
  transform: scale(1.05);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 40%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.game-progress {
  margin-bottom: 15px;
}

.progress-bar {
  height: 4px;
  background-color: var(--secondary-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.game-actions {
  display: flex;
  gap: 10px;
}

.play-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.favorite-button {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button.active {
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.2);
}

.game-card-info {
  padding: 15px;
}

.game-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.game-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

.game-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.game-tag {
  background-color: var(--secondary-color);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 列表视图 */
.games-list {
  background-color: var(--card-bg);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.game-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.game-list-item:hover {
  background-color: var(--secondary-color);
}

.game-list-item:last-child {
  border-bottom: none;
}

.list-item-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.list-game-cover {
  width: 80px;
  height: 45px;
  object-fit: cover;
  border-radius: 3px;
}

.list-game-info {
  flex: 1;
}

.list-game-title {
  font-size: 16px;
  margin-bottom: 5px;
  color: var(--text-color);
}

.list-game-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.list-status {
  padding: 2px 8px;
  background-color: var(--primary-color);
  border-radius: 3px;
  font-size: 12px;
}

.list-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-small {
  width: 80px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.progress-text-small {
  font-size: 12px;
}

.list-item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-play-button {
  padding: 8px 20px;
}

.list-favorite-button,
.list-details-button {
  width: 36px;
  height: 36px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-favorite-button.active {
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.2);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: var(--card-bg);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  gap: 16px;
}

.empty-state i {
  font-size: 64px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0;
  font-size: 24px;
  color: var(--text-color);
}

.empty-state p {
  margin: 8px 0 24px;
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 400px;
}

/* 游戏卡片悬停效果优化 */
.game-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.game-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 4px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 24px;
  color: var(--text-color);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--error-color);
  color: white;
}

.modal-body {
  display: flex;
  gap: 30px;
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.game-detail-cover {
  flex-shrink: 0;
}

.game-detail-cover img {
  width: 250px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.game-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.detail-section p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.game-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  background-color: var(--secondary-color);
  padding: 15px;
  border-radius: 4px;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 16px;
  color: var(--text-color);
  font-weight: bold;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background-color: var(--secondary-color);
  border-radius: 4px;
  opacity: 0.6;
}

.achievement-item.unlocked {
  opacity: 1;
}

.achievement-icon {
  font-size: 32px;
  color: var(--text-secondary);
}

.achievement-item.unlocked .achievement-icon {
  color: var(--accent-color);
}

.achievement-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: var(--text-color);
}

.achievement-info p {
  font-size: 14px;
  margin-bottom: 5px;
  color: var(--text-secondary);
}

.unlock-date {
  font-size: 12px;
  color: var(--accent-color);
}

.no-achievements {
  color: var(--text-secondary);
  font-style: italic;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--secondary-color);
}

/* 图标占位 */
.icon-search::before { content: '🔍'; }
.icon-grid::before { content: '📋'; }
.icon-list::before { content: '📄'; }
.icon-gamepad::before { content: '🎮'; }
.icon-clock::before { content: '🕒'; }
.icon-heart::before { content: '❤️'; }
.icon-play::before { content: '▶️'; }
.icon-info::before { content: 'ℹ️'; }
.icon-trophy::before { content: '🏆'; }
.icon-trophy-locked::before { content: '🔒'; }
.icon-empty::before { content: '📦'; }

/* 响应式设计 */
@media (max-width: 1024px) {
  .library-content .container {
    flex-direction: column;
  }
  
  .library-sidebar {
    width: 100%;
    display: flex;
    gap: 20px;
  }
  
  .sidebar-section {
    flex: 1;
    margin-bottom: 0;
  }
  
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .modal-body {
    flex-direction: column;
  }
  
  .game-detail-cover img {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .library-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .library-sidebar {
    flex-direction: column;
  }
  
  .game-list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .list-item-content {
    width: 100%;
  }
  
  .list-item-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .list-play-button {
    flex: 1;
  }
  
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .game-card-cover {
    height: 220px;
  }
}
</style>