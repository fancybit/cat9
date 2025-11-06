<template>
  <div class="store-container">
    <!-- 商店头部 -->
    <div class="store-header">
      <div class="container">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="搜索游戏、软件、DLC..."
            class="search-input"
            v-model="searchQuery"
          >
          <button class="search-button">
            <i class="icon-search"></i>
          </button>
        </div>
        
        <div class="store-tabs">
          <button :class="{ active: activeTab === 'featured' }" @click="activeTab = 'featured'">精选</button>
          <button :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">新品</button>
          <button :class="{ active: activeTab === 'topSellers' }" @click="activeTab = 'topSellers'">热销</button>
          <button :class="{ active: activeTab === 'specials' }" @click="activeTab = 'specials'">特惠</button>
          <button :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">分类</button>
        </div>
      </div>
    </div>
    
    <!-- 商店内容 -->
    <div class="store-content">
      <div class="container">
        <!-- 筛选侧边栏 -->
        <div class="store-sidebar">
          <div class="filter-section">
            <h4>游戏类型</h4>
            <div class="filter-options">
              <label v-for="category in categories" :key="category.id" class="filter-checkbox">
                <input type="checkbox" :value="category.id" v-model="selectedCategories">
                <span>{{ category.name }} <small>({{ category.count }})</small></span>
              </label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>价格区间</h4>
            <div class="price-range">
              <input type="range" v-model="priceRange.min" min="0" max="1000" step="10">
              <span>{{ priceRange.min }} - {{ priceRange.max }} Cat9Coins</span>
              <input type="range" v-model="priceRange.max" min="0" max="1000" step="10">
            </div>
            <div class="price-options">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="isFreeOnly">
                <span>免费游戏</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="onSale">
                <span>特价促销</span>
              </label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>用户评分</h4>
            <div class="rating-options">
              <label class="filter-checkbox">
                <input type="radio" name="rating" value="90" v-model="minRating">
                <span>好评如潮</span>
              </label>
              <label class="filter-checkbox">
                <input type="radio" name="rating" value="80" v-model="minRating">
                <span>特别好评</span>
              </label>
              <label class="filter-checkbox">
                <input type="radio" name="rating" value="70" v-model="minRating">
                <span>多半好评</span>
              </label>
              <label class="filter-checkbox">
                <input type="radio" name="rating" value="0" v-model="minRating">
                <span>所有评价</span>
              </label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>更多筛选</h4>
            <div class="filter-options">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="isMultiplayer">
                <span>多人游戏</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="isControllerSupported">
                <span>支持控制器</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="hasCloudSaves">
                <span>云存档</span>
              </label>
            </div>
          </div>
          
          <button class="btn btn-outline reset-filters" @click="resetFilters">
            重置筛选
          </button>
        </div>
        
        <!-- 游戏列表 -->
        <div class="game-grid">
          <div v-for="game in filteredGames" :key="game.id" class="game-card">
            <div class="game-card-header">
              <div v-if="game.discount > 0" class="discount-badge">
                -{{ game.discount }}%
              </div>
              <img :src="game.imageUrl" :alt="game.name" class="game-image">
            </div>
            
            <div class="game-card-content">
              <h3 class="game-title">{{ game.name }}</h3>
              
              <div class="game-tags">
                <span v-for="tag in game.tags.slice(0, 3)" :key="tag" class="game-tag">
                  {{ tag }}
                </span>
              </div>
              
              <div class="game-rating" :class="getRatingClass(game.rating)">
                <i class="icon-star"></i>
                <span>{{ game.rating }}%</span>
                <small>({{ game.reviews }})</small>
              </div>
              
              <div class="game-price">
                <span v-if="game.discount > 0" class="original-price">
                  {{ game.originalPrice }} Cat9Coins
                </span>
                <span class="current-price" :class="{ free: game.price === 0 }">
                  {{ game.price === 0 ? '免费' : `${game.price} Cat9Coins` }}
                </span>
              </div>
              
              <div class="game-actions">
                <button 
                  class="btn btn-primary add-to-cart"
                  :disabled="game.isInCart"
                  @click="addGameToCart(game)"
                >
                  {{ game.isInCart ? '已在购物车' : '加入购物车' }}
                </button>
                <button 
                  v-if="game.price > 0" 
                  class="btn btn-secondary buy-now"
                  @click="buyGameNow(game)"
                >
                  立即购买
                </button>
                <button 
                  v-else 
                  class="btn btn-secondary play-now"
                >
                  立即游玩
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 购物车悬浮窗 -->
    <div v-if="cart.length > 0" class="cart-floating">
      <div class="cart-header">
        <span>购物车 ({{ cart.length }})</span>
        <button class="cart-close" @click="toggleCart">×</button>
      </div>
      <div class="cart-items">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <img :src="item.imageUrl" :alt="item.name" class="cart-item-image">
          <div class="cart-item-info">
            <span class="cart-item-name">{{ item.name }}</span>
            <span class="cart-item-price">{{ item.price }} Cat9Coins</span>
          </div>
          <button class="cart-item-remove" @click="removeFromCart(item.id)">
            ×
          </button>
        </div>
      </div>
      <div class="cart-summary">
        <span>总计: {{ cartTotal }} Cat9Coins</span>
        <button class="btn btn-primary checkout-button">去结算</button>
      </div>
    </div>
    
    <!-- 购物车按钮 -->
    <button class="cart-button" @click="toggleCart">
      <i class="icon-cart"></i>
      <span v-if="cart.length > 0" class="cart-count">{{ cart.length }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'StoreView',
  data() {
    return {
      activeTab: 'featured',
      searchQuery: '',
      selectedCategories: [],
      priceRange: { min: 0, max: 500 },
      isFreeOnly: false,
      onSale: false,
      minRating: 0,
      isMultiplayer: false,
      isControllerSupported: false,
      hasCloudSaves: false,
      cart: [],
      showCart: false,
      // 游戏类型
      categories: [
        { id: 1, name: '动作', count: 120 },
        { id: 2, name: '冒险', count: 85 },
        { id: 3, name: '角色扮演', count: 72 },
        { id: 4, name: '策略', count: 65 },
        { id: 5, name: '模拟', count: 58 },
        { id: 6, name: '休闲', count: 110 }
      ],
      // 模拟游戏数据
      games: [
        {
          id: 1,
          name: '醒梦',
          description: '灾厄的预兆，偏僻的小镇，母亲的秘密。13层梦中梦，一起走出梦魇，重新沐浴在自由的阳光之下。',
          imageUrl: require('@/assets/images/games/casual-game.svg'),
          price: 50,
          originalPrice: 50,
          discount: 0,
          rating: 92,
          reviews: 1567,
          tags: ['冒险', '恐怖', '解谜', '独立'],
          isMultiplayer: false,
          isInCart: false
        },
        {
          id: 2,
          name: '午夜巫女',
          description: '类似吸血鬼幸存者的MOBA游戏，支持PVE,PVP联机。',
          imageUrl: require('@/assets/images/games/action-game.svg'),
          price: 80,
          originalPrice: 100,
          discount: 20,
          rating: 88,
          reviews: 2341,
          tags: ['动作', 'MOBA', '多人', '独立'],
          isMultiplayer: true,
          isInCart: false
        },
        {
          id: 3,
          name: '元武林',
          description: '传统武术主题的3D横版格斗游戏',
          imageUrl: require('@/assets/images/games/action-game.svg'),
          price: 120,
          originalPrice: 150,
          discount: 20,
          rating: 95,
          reviews: 3456,
          tags: ['格斗', '动作', '武侠', '3D'],
          isMultiplayer: true,
          isInCart: false
        },
        {
          id: 4,
          name: '永恒传说',
          description: '穿越时空的英雄史诗，寻找传说中的圣剑',
          imageUrl: require('@/assets/images/games/rpg-game.svg'),
          price: 150,
          originalPrice: 150,
          discount: 0,
          rating: 94,
          reviews: 4567,
          tags: ['角色扮演', '奇幻', '开放世界', '剧情'],
          isMultiplayer: false,
          isInCart: false
        },
        {
          id: 5,
          name: '像素农场',
          description: '经营自己的农场，种植作物，饲养动物',
          imageUrl: require('@/assets/images/games/simulation-game.svg'),
          price: 50,
          originalPrice: 50,
          discount: 0,
          rating: 82,
          reviews: 1234,
          tags: ['模拟', '休闲', '像素', '农场'],
          isMultiplayer: false,
          isInCart: false
        },
        {
          id: 6,
          name: '机甲战士',
          description: '操控巨大机甲进行激烈战斗',
          imageUrl: '/src/assets/images/games/action-game.svg',
          price: 150,
          originalPrice: 200,
          discount: 25,
          rating: 89,
          reviews: 2567,
          tags: ['动作', '机甲', '科幻', '多人'],
          isMultiplayer: true,
          isInCart: false
        },
        {
          id: 7,
          name: '猫咪咖啡馆',
          description: '经营一家可爱的猫咪咖啡馆',
          imageUrl: require('@/assets/images/games/simulation-game.svg'),
          price: 30,
          originalPrice: 30,
          discount: 0,
          rating: 91,
          reviews: 1789,
          tags: ['模拟', '休闲', '可爱', '经营'],
          isMultiplayer: false,
          isInCart: false
        },
        {
          id: 8,
          name: '战争策略',
          description: '指挥军队进行战略战役',
          imageUrl: require('@/assets/images/games/strategy-game.svg'),
          price: 100,
          originalPrice: 100,
          discount: 0,
          rating: 87,
          reviews: 987,
          tags: ['策略', '战争', '军事', '历史'],
          isMultiplayer: true,
          isInCart: false
        },
        {
          id: 9,
          name: '宝石消除',
          description: '休闲的三消游戏，解锁各种道具和关卡',
          imageUrl: require('@/assets/images/games/casual-game.svg'),
          price: 0,
          originalPrice: 0,
          discount: 0,
          rating: 85,
          reviews: 3456,
          tags: ['休闲', '解谜', '三消', '免费'],
          isMultiplayer: false,
          isInCart: false
        },
        {
          id: 10,
          name: '文明帝国',
          description: '建立自己的文明，从石器时代发展到太空时代',
          imageUrl: require('@/assets/images/games/strategy-game.svg'),
          price: 200,
          originalPrice: 200,
          discount: 0,
          rating: 93,
          reviews: 5678,
          tags: ['策略', '建造', '历史', '文明'],
          isMultiplayer: true,
          isInCart: false
        }
      ]
    }
  },
  computed: {
    filteredGames() {
      return this.games.filter(game => {
        // 搜索过滤
        if (this.searchQuery && !game.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
          return false
        }
        
        // 价格过滤
        if (game.price < this.priceRange.min || game.price > this.priceRange.max) {
          return false
        }
        
        // 免费游戏过滤
        if (this.isFreeOnly && game.price > 0) {
          return false
        }
        
        // 促销过滤
        if (this.onSale && game.discount === 0) {
          return false
        }
        
        // 评分过滤
        if (game.rating < this.minRating) {
          return false
        }
        
        // 多人游戏过滤
        if (this.isMultiplayer && !game.isMultiplayer) {
          return false
        }
        
        return true
      })
    },
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price, 0)
    }
  },
  methods: {
    getRatingClass(rating) {
      if (rating >= 90) return 'rating-excellent'
      if (rating >= 80) return 'rating-very-good'
      if (rating >= 70) return 'rating-good'
      return 'rating-mixed'
    },
    addGameToCart(game) {
      const existingGame = this.cart.find(item => item.id === game.id)
      if (!existingGame) {
        const gameCopy = { ...game, isInCart: true }
        this.cart.push(gameCopy)
        
        // 更新原游戏数组中的状态
        const index = this.games.findIndex(g => g.id === game.id)
        if (index !== -1) {
          this.games[index].isInCart = true
        }
      }
    },
    removeFromCart(gameId) {
      this.cart = this.cart.filter(item => item.id !== gameId)
      
      // 更新原游戏数组中的状态
      const index = this.games.findIndex(g => g.id === gameId)
      if (index !== -1) {
        this.games[index].isInCart = false
      }
    },
    buyGameNow(game) {
      // 检查用户是否登录
      const user = localStorage.getItem('user')
      if (!user) {
        if (confirm('请先登录以购买游戏，是否前往登录页面？')) {
          this.$router.push('/login')
        }
        return
      }
      
      // 模拟购买
      const userData = JSON.parse(user)
      if (userData.wallet.balance >= game.price) {
        alert(`购买成功！您已成功购买 ${game.name}`)
        // 这里应该调用后端API进行购买
      } else {
        alert('余额不足，请充值后再试')
      }
    },
    toggleCart() {
      this.showCart = !this.showCart
    },
    resetFilters() {
      this.selectedCategories = []
      this.priceRange = { min: 0, max: 500 }
      this.isFreeOnly = false
      this.onSale = false
      this.minRating = 0
      this.isMultiplayer = false
      this.isControllerSupported = false
      this.hasCloudSaves = false
      this.searchQuery = ''
    }
  }
}
</script>

<style scoped>
.store-container {
  min-height: 100vh;
  background-color: var(--primary-color);
}

/* 商店头部 */
.store-header {
  background-color: var(--card-bg);
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.store-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 600px;
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

.store-tabs {
  display: flex;
  gap: 10px;
}

.store-tabs button {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.store-tabs button:hover {
  border-bottom: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.store-tabs button.active {
  border-bottom: 1px solid var(--accent-color);
  color: var(--accent-color);
  font-weight: bold;
}

/* 商店内容 */
.store-content {
  padding: 30px 0;
}

.store-content .container {
  display: flex;
  gap: 30px;
}

/* 筛选侧边栏 */
.store-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.filter-section {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.filter-section h4 {
  margin-bottom: 15px;
  font-size: 16px;
  color: var(--text-color);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 14px;
}

.filter-checkbox input[type="checkbox"],
.filter-checkbox input[type="radio"] {
  cursor: pointer;
}

.filter-checkbox small {
  color: var(--text-secondary);
  font-size: 12px;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.price-range input[type="range"] {
  width: 100%;
}

.price-range span {
  text-align: center;
  color: var(--text-color);
  font-size: 14px;
}

.reset-filters {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

/* 游戏列表 */
.game-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.game-card {
  background-color: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.game-card-header {
  position: relative;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--error-color);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 14px;
  z-index: 10;
}

.game-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
}

.game-card-content {
  padding: 15px;
}

.game-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.game-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.game-tag {
  background-color: var(--secondary-color);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: var(--text-secondary);
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.rating-excellent {
  color: #4c6b22;
}

.rating-very-good {
  color: #66c0f4;
}

.rating-good {
  color: #a4d007;
}

.rating-mixed {
  color: #b85c38;
}

.game-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.original-price {
  color: var(--text-secondary);
  text-decoration: line-through;
  font-size: 14px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: var(--button-primary);
}

.current-price.free {
  color: var(--accent-color);
}

.game-actions {
  display: flex;
  gap: 10px;
}

.add-to-cart,
.buy-now,
.play-now {
  flex: 1;
  padding: 8px 0;
  font-size: 14px;
}

.add-to-cart:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

/* 购物车 */
.cart-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--button-primary);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cart-button:hover {
  background-color: var(--button-primary-hover);
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--error-color);
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 50%;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-floating {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  background-color: var(--card-bg);
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 999;
  border: 1px solid var(--border-color);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
}

.cart-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-name {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.cart-item-price {
  font-size: 14px;
  color: var(--button-primary);
  font-weight: bold;
}

.cart-item-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.cart-item-remove:hover {
  background-color: var(--error-color);
  color: white;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--secondary-color);
}

.cart-summary span {
  font-weight: bold;
  font-size: 16px;
}

.checkout-button {
  padding: 8px 20px;
}

/* 图标占位 */
.icon-search::before { content: '🔍'; }
.icon-star::before { content: '⭐'; }
.icon-cart::before { content: '🛒'; }

/* 响应式设计 */
@media (max-width: 1024px) {
  .store-content .container {
    flex-direction: column;
  }
  
  .store-sidebar {
    width: 100%;
  }
  
  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .store-header .container {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .store-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .cart-floating {
    width: calc(100% - 60px);
    right: 30px;
    left: 30px;
  }
  
  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>