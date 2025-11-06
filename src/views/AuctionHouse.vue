<template>
  <div class="auction-house">
    <div class="container">
      <h1 class="page-title">虚拟商品拍卖行</h1>
      
      <!-- 搜索和筛选 -->
      <div class="search-filter-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索虚拟商品..."
            class="search-input"
          >
          <button class="search-button">搜索</button>
        </div>
        
        <div class="filter-options">
          <select v-model="categoryFilter" class="filter-select">
            <option value="all">全部分类</option>
            <option value="skins">皮肤</option>
            <option value="weapons">武器</option>
            <option value="pets">宠物</option>
            <option value="mounts">坐骑</option>
            <option value="props">道具</option>
          </select>
          
          <select v-model="sortOption" class="filter-select">
            <option value="latest">最新上架</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
            <option value="ending_soon">即将结束</option>
          </select>
        </div>
      </div>
      
      <!-- 特色拍卖 -->
      <section class="featured-auctions">
        <h2 class="section-title">特色拍卖</h2>
        <div class="featured-carousel">
          <div 
            v-for="item in featuredItems" 
            :key="item.id"
            class="featured-item"
            @click="showItemDetails(item.id)"
          >
            <div class="item-image-container">
              <img :src="item.imageUrl" :alt="item.name" class="item-image">
              <div class="item-overlay">
                <div class="current-price">当前价格: {{ item.currentBid }} ETH</div>
                <div class="time-left">剩余时间: {{ formatTimeLeft(item.endTime) }}</div>
              </div>
            </div>
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-category">{{ getCategoryName(item.category) }}</div>
          </div>
        </div>
      </section>
      
      <!-- 拍卖商品列表 -->
      <section class="auction-items">
        <h2 class="section-title">正在拍卖</h2>
        <div class="items-grid">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            class="auction-item"
            @click="showItemDetails(item.id)"
          >
            <div class="item-image-container">
              <img :src="item.imageUrl" :alt="item.name" class="item-image">
              <div v-if="item.isHot" class="hot-badge">热门</div>
            </div>
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-info">
              <div class="current-price">当前价格: {{ item.currentBid }} ETH</div>
              <div class="time-left">剩余: {{ formatTimeLeft(item.endTime) }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 我参与的拍卖 -->
      <section v-if="isLoggedIn" class="my-auctions">
        <h2 class="section-title">我参与的拍卖</h2>
        <div v-if="userAuctions.length > 0" class="items-grid">
          <div 
            v-for="item in userAuctions" 
            :key="item.id"
            class="auction-item"
            @click="showItemDetails(item.id)"
          >
            <div class="item-image-container">
              <img :src="item.imageUrl" :alt="item.name" class="item-image">
              <div v-if="item.isWinning" class="winning-badge">领先</div>
            </div>
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-info">
              <div class="current-price">当前价格: {{ item.currentBid }} ETH</div>
              <div class="my-bid" v-if="item.myBid">我的出价: {{ item.myBid }} ETH</div>
              <div class="time-left">剩余: {{ formatTimeLeft(item.endTime) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>您还没有参与任何拍卖</p>
        </div>
      </section>
      
      <!-- 拍卖详情模态框 -->
      <div v-if="selectedItem" class="modal-overlay" @click="closeItemDetails">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeItemDetails">×</button>
          
          <div class="modal-header">
            <img :src="selectedItem.imageUrl" :alt="selectedItem.name" class="modal-image">
            <div class="modal-info">
              <h2 class="modal-title">{{ selectedItem.name }}</h2>
              <div class="modal-category">{{ getCategoryName(selectedItem.category) }}</div>
              <div class="modal-price">当前价格: <span class="price-value">{{ selectedItem.currentBid }} ETH</span></div>
              <div class="modal-time">剩余时间: <span class="time-value">{{ formatTimeLeft(selectedItem.endTime) }}</span></div>
              <div class="modal-owner">卖家: {{ selectedItem.owner }}</div>
              <div class="bid-count">已有 {{ selectedItem.bidCount }} 人出价</div>
            </div>
          </div>
          
          <div class="modal-body">
            <div class="item-description">
              <h3>商品描述</h3>
              <p>{{ selectedItem.description }}</p>
            </div>
            
            <div class="bid-history">
              <h3>出价历史</h3>
              <div class="bid-list">
                <div 
                  v-for="bid in selectedItem.bidHistory" 
                  :key="bid.id"
                  class="bid-item"
                  :class="{ 'my-bid': bid.isMine }"
                >
                  <span class="bid-user">{{ bid.user }}</span>
                  <span class="bid-amount">{{ bid.amount }} ETH</span>
                  <span class="bid-time">{{ formatDate(bid.time) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer" v-if="isLoggedIn">
            <div class="bid-input-group">
              <label>我的出价 (ETH):</label>
              <input 
                type="number" 
                v-model.number="bidAmount" 
                :min="selectedItem.currentBid + 0.01" 
                step="0.01"
                class="bid-input"
              >
              <button 
                class="place-bid-button"
                @click="placeBid"
                :disabled="bidAmount <= selectedItem.currentBid"
              >
                出价
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuctionHouse',
  data() {
    return {
      searchQuery: '',
      categoryFilter: 'all',
      sortOption: 'latest',
      selectedItem: null,
      bidAmount: 0,
      // 模拟数据
      featuredItems: [
        {
          id: '1',
          name: '星际探险家限定皮肤',
          imageUrl: 'https://via.placeholder.com/600x400',
          category: 'skins',
          currentBid: 2.5,
          endTime: new Date(Date.now() + 86400000).toISOString() // 24小时后
        },
        {
          id: '2',
          name: '魔法学院传说武器',
          imageUrl: 'https://via.placeholder.com/600x400',
          category: 'weapons',
          currentBid: 3.8,
          endTime: new Date(Date.now() + 172800000).toISOString() // 48小时后
        },
        {
          id: '3',
          name: '赛车传奇稀有宠物',
          imageUrl: 'https://via.placeholder.com/600x400',
          category: 'pets',
          currentBid: 1.2,
          endTime: new Date(Date.now() + 43200000).toISOString() // 12小时后
        }
      ],
      auctionItems: [
        {
          id: '1',
          name: '星际探险家限定皮肤',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'skins',
          currentBid: 2.5,
          endTime: new Date(Date.now() + 86400000).toISOString(),
          isHot: true
        },
        {
          id: '2',
          name: '魔法学院传说武器',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'weapons',
          currentBid: 3.8,
          endTime: new Date(Date.now() + 172800000).toISOString()
        },
        {
          id: '3',
          name: '赛车传奇稀有宠物',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'pets',
          currentBid: 1.2,
          endTime: new Date(Date.now() + 43200000).toISOString()
        },
        {
          id: '4',
          name: '奇幻世界飞行坐骑',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'mounts',
          currentBid: 5.0,
          endTime: new Date(Date.now() + 259200000).toISOString(),
          isHot: true
        },
        {
          id: '5',
          name: '战斗通行证等级提升道具',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'props',
          currentBid: 0.8,
          endTime: new Date(Date.now() + 129600000).toISOString()
        },
        {
          id: '6',
          name: '战术射击游戏限定角色',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'skins',
          currentBid: 4.2,
          endTime: new Date(Date.now() + 64800000).toISOString()
        }
      ],
      userAuctions: [
        {
          id: '1',
          name: '星际探险家限定皮肤',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'skins',
          currentBid: 2.5,
          myBid: 2.5,
          endTime: new Date(Date.now() + 86400000).toISOString(),
          isWinning: true
        },
        {
          id: '5',
          name: '战斗通行证等级提升道具',
          imageUrl: 'https://via.placeholder.com/300x300',
          category: 'props',
          currentBid: 0.8,
          myBid: 0.7,
          endTime: new Date(Date.now() + 129600000).toISOString(),
          isWinning: false
        }
      ]
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('user') !== null
    },
    filteredItems() {
      let items = [...this.auctionItems]
      
      // 搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter(item => 
          item.name.toLowerCase().includes(query)
        )
      }
      
      // 分类筛选
      if (this.categoryFilter !== 'all') {
        items = items.filter(item => item.category === this.categoryFilter)
      }
      
      // 排序
      switch (this.sortOption) {
        case 'price_asc':
          items.sort((a, b) => a.currentBid - b.currentBid)
          break
        case 'price_desc':
          items.sort((a, b) => b.currentBid - a.currentBid)
          break
        case 'ending_soon':
          items.sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
          break
        case 'latest':
        default:
          // 默认按ID降序，模拟最新上架
          items.sort((a, b) => b.id - a.id)
          break
      }
      
      return items
    }
  },
  methods: {
    getCategoryName(category) {
      const categoryMap = {
        'skins': '皮肤',
        'weapons': '武器',
        'pets': '宠物',
        'mounts': '坐骑',
        'props': '道具'
      }
      return categoryMap[category] || category
    },
    formatTimeLeft(endTime) {
      const now = new Date()
      const end = new Date(endTime)
      const diff = end - now
      
      if (diff <= 0) return '已结束'
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      } else {
        return `${minutes}分钟`
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    },
    showItemDetails(itemId) {
      // 模拟获取商品详情
      const item = this.auctionItems.find(i => i.id === itemId)
      if (item) {
        this.selectedItem = {
          ...item,
          owner: '游戏收藏家',
          bidCount: 8,
          description: '这是一个稀有的游戏虚拟商品，拥有独特的外观和特殊属性。获得后可以在游戏中展示给其他玩家，彰显您的独特品味和收藏价值。',
          bidHistory: [
            { id: 1, user: '当前用户', amount: 2.5, time: new Date().toISOString(), isMine: true },
            { id: 2, user: '游戏大师', amount: 2.4, time: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, user: '收藏家', amount: 2.3, time: new Date(Date.now() - 7200000).toISOString() }
          ]
        }
        this.bidAmount = item.currentBid + 0.01
      }
    },
    closeItemDetails() {
      this.selectedItem = null
      this.bidAmount = 0
    },
    placeBid() {
      if (this.bidAmount > this.selectedItem.currentBid) {
        alert(`成功出价 ${this.bidAmount} ETH！`)
        // 在实际应用中，这里会发送出价请求到服务器
        this.closeItemDetails()
      }
    }
  }
}
</script>

<style scoped>
.auction-house {
  padding: 40px 0;
  min-height: calc(100vh - 160px);
}

.page-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  color: var(--accent-color);
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  display: flex;
  flex: 1;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px 0 0 4px;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.search-button {
  padding: 12px 24px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: var(--accent-hover);
}

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
}

.section-title {
  font-size: 24px;
  margin: 40px 0 20px;
  color: var(--text-color);
}

.featured-carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: thin;
}

.featured-carousel::-webkit-scrollbar {
  height: 6px;
}

.featured-carousel::-webkit-scrollbar-track {
  background: var(--primary-color);
}

.featured-carousel::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.featured-item {
  flex: 0 0 auto;
  width: 350px;
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.featured-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.item-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.featured-item:hover .item-image {
  transform: scale(1.05);
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.time-left {
  font-size: 14px;
  opacity: 0.9;
}

.item-name {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}

.item-category {
  padding: 0 15px 15px;
  color: var(--text-secondary);
  font-size: 14px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.auction-item {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.auction-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.auction-item .item-image-container {
  height: 180px;
}

.hot-badge,
.winning-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.hot-badge {
  background-color: #e74c3c;
  color: white;
}

.winning-badge {
  background-color: #27ae60;
  color: white;
}

.auction-item .item-name {
  padding: 15px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info {
  padding: 0 15px 15px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 30px;
  color: var(--text-color);
  cursor: pointer;
  z-index: 10;
}

.modal-header {
  display: flex;
  padding: 30px;
  gap: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.modal-info {
  flex: 1;
}

.modal-title {
  font-size: 28px;
  margin-bottom: 10px;
}

.modal-category {
  color: var(--accent-color);
  font-size: 16px;
  margin-bottom: 15px;
}

.modal-price,
.modal-time,
.modal-owner,
.bid-count {
  margin-bottom: 10px;
  font-size: 16px;
}

.price-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-color);
}

.time-value {
  font-weight: bold;
  color: #e74c3c;
}

.modal-body {
  padding: 30px;
}

.item-description,
.bid-history {
  margin-bottom: 30px;
}

.item-description h3,
.bid-history h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

.bid-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bid-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: var(--primary-color);
  border-radius: 4px;
}

.bid-item.my-bid {
  border: 2px solid var(--accent-color);
}

.bid-user {
  font-weight: bold;
}

.bid-amount {
  font-weight: bold;
  color: var(--accent-color);
}

.bid-time {
  color: var(--text-secondary);
  font-size: 14px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid var(--border-color);
  background-color: var(--primary-color);
}

.bid-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bid-input-group label {
  font-size: 16px;
  font-weight: bold;
}

.bid-input {
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-bg);
  color: var(--text-color);
  width: 150px;
}

.place-bid-button {
  padding: 10px 30px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.place-bid-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.place-bid-button:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-options {
    justify-content: center;
  }
  
  .featured-item {
    width: 280px;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .modal-header {
    flex-direction: column;
  }
  
  .modal-image {
    width: 100%;
    height: auto;
  }
  
  .bid-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .bid-input {
    width: 100%;
  }
}
</style>