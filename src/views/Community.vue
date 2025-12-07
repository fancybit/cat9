<template>
  <div class="community-page">
    <div class="container">
      <h1 class="page-title">社区中心</h1>
      
      <!-- 社区导航 -->
      <div class="community-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
      
      <!-- 玩家交流区 -->
      <div v-if="activeTab === 'general'" class="tab-content">
        <div class="content-header">
          <h2 class="section-title">玩家交流区</h2>
          <button class="create-post-btn" v-if="isLoggedIn" @click="showCreatePostModal = true">
            <i class="icon-plus"></i> 发布新帖
          </button>
        </div>
        
        <!-- 帖子列表 -->
        <div class="posts-container">
          <div v-for="post in generalPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <div class="user-info">
                <div class="user-avatar">{{ getAvatarInitial(post.author) }}</div>
                <div class="user-details">
                  <div class="user-name">{{ post.author }}</div>
                  <div class="post-time">{{ formatPostTime(post.time) }}</div>
                </div>
              </div>
              <div class="post-tags">
                <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
            
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-preview">{{ post.content.substring(0, 150) }}{{ post.content.length > 150 ? '...' : '' }}</p>
              <div v-if="post.images.length > 0" class="post-images">
                <img 
                  v-for="(image, index) in post.images.slice(0, 3)" 
                  :key="index" 
                  :src="image" 
                  :alt="`图片 ${index + 1}`"
                  class="post-image"
                >
              </div>
            </div>
            
            <div class="post-footer">
              <div class="post-stats">
                <span class="stat-item"><i class="icon-eye"></i> {{ post.views }}</span>
                <span class="stat-item"><i class="icon-comment"></i> {{ post.comments }}</span>
                <span class="stat-item"><i class="icon-like"></i> {{ post.likes }}</span>
              </div>
              <button class="view-post-btn" @click="viewPost(post.id)">查看详情</button>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1">&lt; 上一页</button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="page-btn" :disabled="currentPage === totalPages">下一页 &gt;</button>
        </div>
      </div>
      
      <!-- 玩家MOD交流 -->
      <div v-else-if="activeTab === 'mods'" class="tab-content">
        <div class="content-header">
          <h2 class="section-title">MOD交流区</h2>
          <button class="create-post-btn" v-if="isLoggedIn" @click="showCreateModModal = true">
            <i class="icon-plus"></i> 分享MOD
          </button>
        </div>
        
        <!-- MOD筛选 -->
        <div class="mod-filters">
          <select v-model="modGameFilter" class="filter-select">
            <option value="all">所有游戏</option>
            <option value="star-explorer">星际探险家</option>
            <option value="magic-academy">魔法学院</option>
            <option value="racing-legend">赛车传奇</option>
          </select>
          
          <select v-model="modTypeFilter" class="filter-select">
            <option value="all">所有类型</option>
            <option value="visual">视觉增强</option>
            <option value="gameplay">游戏玩法</option>
            <option value="utility">实用工具</option>
            <option value="total-conversion">大型整合</option>
          </select>
          
          <select v-model="modSortFilter" class="filter-select">
            <option value="latest">最新发布</option>
            <option value="popular">最受欢迎</option>
            <option value="downloads">下载最多</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
        
        <!-- MOD列表 -->
        <div class="mods-container">
          <div v-for="mod in filteredMods" :key="mod.id" class="mod-card">
            <div class="mod-header">
              <div class="mod-thumbnail">
                <img :src="mod.thumbnail" :alt="mod.name" class="mod-image">
                <div v-if="mod.isFeatured" class="featured-badge">精选</div>
              </div>
              <div class="mod-info">
                <h3 class="mod-name">{{ mod.name }}</h3>
                <div class="mod-author">作者: {{ mod.author }}</div>
                <div class="mod-game">游戏: {{ mod.game }}</div>
                <div class="mod-tags">
                  <span class="tag" v-for="tag in mod.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            
            <div class="mod-description">{{ mod.description.substring(0, 100) }}{{ mod.description.length > 100 ? '...' : '' }}</div>
            
            <div class="mod-stats">
              <span class="stat-item"><i class="icon-download"></i> {{ formatDownloads(mod.downloads) }}</span>
              <span class="stat-item"><i class="icon-star"></i> {{ mod.rating }}/5</span>
              <span class="stat-item"><i class="icon-comment"></i> {{ mod.comments }}</span>
            </div>
            
            <div class="mod-actions">
              <button class="download-mod-btn" @click="downloadMod(mod.id)">下载</button>
              <button class="view-mod-btn" @click="viewModDetails(mod.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 公会交流 -->
      <div v-else-if="activeTab === 'guilds'" class="tab-content">
        <div class="content-header">
          <h2 class="section-title">公会交流</h2>
          <button class="create-post-btn" v-if="isLoggedIn" @click="showCreateGuildModal = true">
            <i class="icon-plus"></i> 创建公会
          </button>
        </div>
        
        <!-- 公会列表 -->
        <div class="guilds-container">
          <div v-for="guild in guilds" :key="guild.id" class="guild-card">
            <div class="guild-header">
              <div class="guild-logo">
                <img :src="guild.logo" :alt="guild.name" class="guild-image">
              </div>
              <div class="guild-info">
                <h3 class="guild-name">{{ guild.name }}</h3>
                <div class="guild-members">成员: {{ guild.memberCount }}人</div>
                <div class="guild-level">等级: {{ guild.level }}</div>
                <div class="guild-status" :class="guild.isRecruiting ? 'recruiting' : 'closed'">
                  {{ guild.isRecruiting ? '招募中' : '已关闭' }}
                </div>
              </div>
            </div>
            
            <div class="guild-description">{{ guild.description }}</div>
            
            <div class="guild-games">
              <span class="game-tag" v-for="game in guild.games" :key="game">{{ game }}</span>
            </div>
            
            <div class="guild-actions">
              <button 
                class="join-guild-btn" 
                v-if="guild.isRecruiting" 
                @click="joinGuild(guild.id)"
              >
                申请加入
              </button>
              <button class="view-guild-btn" @click="viewGuildDetails(guild.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 赛事交流 -->
      <div v-else-if="activeTab === 'tournaments'" class="tab-content">
        <div class="content-header">
          <h2 class="section-title">赛事交流</h2>
          <button class="create-post-btn" v-if="isLoggedIn" @click="showCreateTournamentModal = true">
            <i class="icon-plus"></i> 发布赛事
          </button>
        </div>
        
        <!-- 赛事筛选 -->
        <div class="tournament-filters">
          <select v-model="tournamentGameFilter" class="filter-select">
            <option value="all">所有游戏</option>
            <option value="star-explorer">星际探险家</option>
            <option value="magic-academy">魔法学院</option>
            <option value="racing-legend">赛车传奇</option>
          </select>
          
          <select v-model="tournamentStatusFilter" class="filter-select">
            <option value="all">所有状态</option>
            <option value="upcoming">即将开始</option>
            <option value="ongoing">进行中</option>
            <option value="completed">已结束</option>
          </select>
        </div>
        
        <!-- 赛事列表 -->
        <div class="tournaments-container">
          <div v-for="tournament in filteredTournaments" :key="tournament.id" class="tournament-card">
            <div class="tournament-banner">
              <img :src="tournament.banner" :alt="tournament.name" class="tournament-image">
              <div class="tournament-status-badge" :class="tournament.status">
                {{ getStatusText(tournament.status) }}
              </div>
            </div>
            
            <div class="tournament-info">
              <h3 class="tournament-name">{{ tournament.name }}</h3>
              <div class="tournament-game">{{ tournament.game }}</div>
              <div class="tournament-date">
                <i class="icon-calendar"></i> {{ formatTournamentDate(tournament.startDate, tournament.endDate) }}
              </div>
              <div class="tournament-prize">
                <i class="icon-trophy"></i> 奖金池: {{ tournament.prize }}
              </div>
              <div class="tournament-participants">
                <i class="icon-users"></i> {{ tournament.participantsCount }}人已报名
              </div>
            </div>
            
            <div class="tournament-actions">
              <button 
                v-if="tournament.status === 'upcoming' && !tournament.isRegistered" 
                class="register-tournament-btn" 
                @click="registerTournament(tournament.id)"
              >
                立即报名
              </button>
              <button 
                v-else-if="tournament.isRegistered" 
                class="registered-btn" 
                disabled
              >
                已报名
              </button>
              <button class="view-tournament-btn" @click="viewTournamentDetails(tournament.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 创建帖子模态框 -->
      <div v-if="showCreatePostModal" class="modal-overlay" @click="showCreatePostModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>发布新帖</h3>
            <button class="close-btn" @click="showCreatePostModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>标题</label>
              <input type="text" v-model="newPost.title" placeholder="请输入帖子标题" class="form-input">
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea v-model="newPost.content" rows="6" placeholder="请输入帖子内容" class="form-textarea"></textarea>
            </div>
            <div class="form-group">
              <label>标签</label>
              <input type="text" v-model="newPost.tagsInput" placeholder="请输入标签，用逗号分隔" class="form-input">
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" @click="showCreatePostModal = false">取消</button>
            <button class="submit-btn" @click="createPost">发布</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import userService from '@/services/userService'

export default {
  name: 'CommunityPage',
  setup() {
    const activeTab = ref('general')
    const currentPage = ref(1)
    const totalPages = ref(5)
    const showCreatePostModal = ref(false)
    const showCreateModModal = ref(false)
    const showCreateGuildModal = ref(false)
    const showCreateTournamentModal = ref(false)
    
    // 新建帖子数据
    const newPost = ref({
      title: '',
      content: '',
      tagsInput: ''
    })
    
    // 筛选条件
    const modGameFilter = ref('all')
    const modTypeFilter = ref('all')
    const modSortFilter = ref('latest')
    const tournamentGameFilter = ref('all')
    const tournamentStatusFilter = ref('all')
    
    // 标签页数据
    const tabs = [
      { id: 'general', name: '玩家交流' },
      { id: 'mods', name: 'MOD交流' },
      { id: 'guilds', name: '公会交流' },
      { id: 'tournaments', name: '赛事交流' }
    ]
    
    // 玩家交流区帖子数据
    const generalPosts = ref([
      {
        id: 1,
        title: '星际探险家新手攻略分享',
        content: '作为一名刚玩星际探险家一个月的新手，想和大家分享一下我的游戏心得。首先，在游戏初期，建议优先升级飞船的推进系统，这样可以更快地探索星系。其次，资源收集方面，氧气和燃料是最基础的，一定要保证充足...',
        author: '太空漫游者',
        time: new Date(Date.now() - 3600000).toISOString(),
        tags: ['新手攻略', '星际探险家'],
        views: 156,
        comments: 23,
        likes: 45,
        images: []
      },
      {
        id: 2,
        title: '魔法学院隐藏任务全收集',
        content: '经过我半个月的探索，终于收集到了魔法学院中所有的隐藏任务！这里给大家整理一下所有隐藏任务的触发条件和奖励。第一个隐藏任务位于图书馆的二楼，需要在晚上10点后使用照明魔法照亮墙角的暗门...',
        author: '魔法学者',
        time: new Date(Date.now() - 86400000).toISOString(),
        tags: ['隐藏任务', '魔法学院'],
        views: 342,
        comments: 56,
        likes: 89,
        images: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300']
      },
      {
        id: 3,
        title: '赛车传奇赛道技巧分享',
        content: '最近一直在练习赛车传奇的 Nürburgring 赛道，发现了几个过弯的技巧，分享给大家。在第一个发卡弯，建议提前减速到80km/h，然后在入弯点轻踩刹车...',
        author: '速度与激情',
        time: new Date(Date.now() - 172800000).toISOString(),
        tags: ['赛道技巧', '赛车传奇'],
        views: 234,
        comments: 34,
        likes: 67,
        images: ['https://via.placeholder.com/400x300']
      },
      {
        id: 4,
        title: '游戏配置推荐 2023',
        content: '最近很多朋友问我玩这些游戏需要什么配置，这里给大家整理一下2023年的游戏配置推荐。入门级配置：i5-12400F + RTX 3060 + 16GB内存，可以流畅运行所有游戏在1080p中高画质...',
        author: '硬件达人',
        time: new Date(Date.now() - 259200000).toISOString(),
        tags: ['硬件配置', '攻略'],
        views: 567,
        comments: 123,
        likes: 234,
        images: []
      }
    ])
    
    // MOD数据
    const mods = ref([
      {
        id: 1,
        name: '星际探险家增强纹理包',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'GraphicMaster',
        game: '星际探险家',
        description: '这个MOD大幅提升了游戏中的纹理质量，使星球表面、太空场景更加逼真。支持4K分辨率，需要中高端显卡才能流畅运行。',
        type: 'visual',
        tags: ['纹理增强', '视觉效果'],
        downloads: 15423,
        rating: 4.8,
        comments: 234,
        isFeatured: true
      },
      {
        id: 2,
        name: '魔法学院新法术扩展',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'WizardModder',
        game: '魔法学院',
        description: '添加了50种全新的法术，包括攻击型、防御型和实用型法术。每种法术都有独特的视觉效果和动画。',
        type: 'gameplay',
        tags: ['新内容', '法术'],
        downloads: 23456,
        rating: 4.9,
        comments: 456
      },
      {
        id: 3,
        name: '赛车传奇真实物理MOD',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'RealRacing',
        game: '赛车传奇',
        description: '重新调整了游戏的物理引擎，使车辆的操控感更加真实。包括轮胎摩擦、悬挂系统和空气动力学效果的改进。',
        type: 'gameplay',
        tags: ['物理改进', '真实体验'],
        downloads: 18765,
        rating: 4.7,
        comments: 345
      },
      {
        id: 4,
        name: '星际探险家地图扩展',
        thumbnail: 'https://via.placeholder.com/300x200',
        author: 'Explorer',
        game: '星际探险家',
        description: '添加了10个全新的星系，每个星系都有独特的星球和任务。还包括新的外星种族和故事线。',
        type: 'total-conversion',
        tags: ['新内容', '地图扩展'],
        downloads: 34567,
        rating: 4.9,
        comments: 567,
        isFeatured: true
      }
    ])
    
    // 公会数据
    const guilds = ref([
      {
        id: 1,
        name: '星际联邦',
        logo: 'https://via.placeholder.com/100x100',
        description: '专注于星际探险家游戏的公会，欢迎所有热爱太空探索的玩家加入！我们有专业的攻略团队和定期的公会活动。',
        memberCount: 256,
        level: 5,
        isRecruiting: true,
        games: ['星际探险家']
      },
      {
        id: 2,
        name: '魔法议会',
        logo: 'https://via.placeholder.com/100x100',
        description: '魔法学院游戏的顶尖公会，拥有多个服务器的排行榜前列玩家。每周组织公会副本和PVP活动。',
        memberCount: 189,
        level: 4,
        isRecruiting: true,
        games: ['魔法学院']
      },
      {
        id: 3,
        name: '速度联盟',
        logo: 'https://via.placeholder.com/100x100',
        description: '赛车传奇的专业竞速公会，定期举办内部比赛和参与官方赛事。欢迎有一定技术水平的玩家加入。',
        memberCount: 123,
        level: 6,
        isRecruiting: false,
        games: ['赛车传奇']
      },
      {
        id: 4,
        name: '全能玩家',
        logo: 'https://via.placeholder.com/100x100',
        description: '不限游戏的综合公会，欢迎所有热爱游戏的玩家。我们有多个游戏的分会，定期组织各种游戏活动。',
        memberCount: 456,
        level: 7,
        isRecruiting: true,
        games: ['星际探险家', '魔法学院', '赛车传奇']
      }
    ])
    
    // 赛事数据
    const tournaments = ref([
      {
        id: 1,
        name: '星际探险家宇宙杯',
        banner: 'https://via.placeholder.com/600x200',
        game: '星际探险家',
        startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 14).toISOString(),
        prize: '10000元',
        participantsCount: 128,
        status: 'upcoming',
        isRegistered: false
      },
      {
        id: 2,
        name: '魔法学院法术大赛',
        banner: 'https://via.placeholder.com/600x200',
        game: '魔法学院',
        startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        prize: '5000元',
        participantsCount: 64,
        status: 'ongoing',
        isRegistered: true
      },
      {
        id: 3,
        name: '赛车传奇速度挑战赛',
        banner: 'https://via.placeholder.com/600x200',
        game: '赛车传奇',
        startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        prize: '8000元',
        participantsCount: 32,
        status: 'completed',
        isRegistered: false
      }
    ])
    
    // 计算属性
    const isLoggedIn = computed(() => {
      return userService.isLoggedIn()
    })
    
    const filteredMods = computed(() => {
      let filtered = [...mods.value]
      
      // 游戏筛选
      if (modGameFilter.value !== 'all') {
        filtered = filtered.filter(mod => {
          const gameMap = {
            'star-explorer': '星际探险家',
            'magic-academy': '魔法学院',
            'racing-legend': '赛车传奇'
          }
          return mod.game === gameMap[modGameFilter.value]
        })
      }
      
      // 类型筛选
      if (modTypeFilter.value !== 'all') {
        filtered = filtered.filter(mod => mod.type === modTypeFilter.value)
      }
      
      // 排序
      switch (modSortFilter.value) {
        case 'popular':
          filtered.sort((a, b) => b.likes - a.likes)
          break
        case 'downloads':
          filtered.sort((a, b) => b.downloads - a.downloads)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'latest':
        default:
          // 默认按ID降序，模拟最新发布
          filtered.sort((a, b) => b.id - a.id)
          break
      }
      
      return filtered
    })
    
    const filteredTournaments = computed(() => {
      let filtered = [...tournaments.value]
      
      // 游戏筛选
      if (tournamentGameFilter.value !== 'all') {
        filtered = filtered.filter(tournament => {
          const gameMap = {
            'star-explorer': '星际探险家',
            'magic-academy': '魔法学院',
            'racing-legend': '赛车传奇'
          }
          return tournament.game === gameMap[tournamentGameFilter.value]
        })
      }
      
      // 状态筛选
      if (tournamentStatusFilter.value !== 'all') {
        filtered = filtered.filter(tournament => tournament.status === tournamentStatusFilter.value)
      }
      
      return filtered
    })
    
    // 方法
    const getAvatarInitial = (username) => {
      return username ? username.charAt(0).toUpperCase() : '?'
    }
    
    const formatPostTime = (timeString) => {
      const now = new Date()
      const postTime = new Date(timeString)
      const diffMs = now - postTime
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffMins < 60) {
        return `${diffMins}分钟前`
      } else if (diffHours < 24) {
        return `${diffHours}小时前`
      } else if (diffDays < 7) {
        return `${diffDays}天前`
      } else {
        return postTime.toLocaleDateString('zh-CN')
      }
    }
    
    const formatDownloads = (count) => {
      if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万'
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k'
      }
      return count.toString()
    }
    
    const formatTournamentDate = (startDate, endDate) => {
      const start = new Date(startDate)
      const end = new Date(endDate)
      return `${start.toLocaleDateString('zh-CN')} - ${end.toLocaleDateString('zh-CN')}`
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        'upcoming': '即将开始',
        'ongoing': '进行中',
        'completed': '已结束'
      }
      return statusMap[status] || status
    }
    
    const viewPost = (postId) => {
      console.log(`查看帖子: ${postId}`)
      // 实际应用中会跳转到帖子详情页
      alert(`查看帖子 ${postId}`)
    }
    
    const downloadMod = (modId) => {
      console.log(`下载MOD: ${modId}`)
      alert(`开始下载MOD ${modId}`)
    }
    
    const viewModDetails = (modId) => {
      console.log(`查看MOD详情: ${modId}`)
      alert(`查看MOD ${modId} 详情`)
    }
    
    const joinGuild = (guildId) => {
      console.log(`申请加入公会: ${guildId}`)
      alert(`已申请加入公会 ${guildId}`)
    }
    
    const viewGuildDetails = (guildId) => {
      console.log(`查看公会详情: ${guildId}`)
      alert(`查看公会 ${guildId} 详情`)
    }
    
    const registerTournament = (tournamentId) => {
      console.log(`报名赛事: ${tournamentId}`)
      alert(`已报名赛事 ${tournamentId}`)
      // 实际应用中会更新赛事的报名状态
      const tournament = tournaments.value.find(t => t.id === tournamentId)
      if (tournament) {
        tournament.isRegistered = true
        tournament.participantsCount++
      }
    }
    
    const viewTournamentDetails = (tournamentId) => {
      console.log(`查看赛事详情: ${tournamentId}`)
      alert(`查看赛事 ${tournamentId} 详情`)
    }
    
    const createPost = () => {
      if (newPost.value.title && newPost.value.content) {
        const tags = newPost.value.tagsInput
          ? newPost.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
          
        console.log('发布新帖:', {
          title: newPost.value.title,
          content: newPost.value.content,
          tags
        })
        
        alert('帖子发布成功！')
        showCreatePostModal.value = false
        
        // 重置表单
        newPost.value = {
          title: '',
          content: '',
          tagsInput: ''
        }
      }
    }
    
    return {
      activeTab,
      currentPage,
      totalPages,
      showCreatePostModal,
      showCreateModModal,
      showCreateGuildModal,
      showCreateTournamentModal,
      newPost,
      modGameFilter,
      modTypeFilter,
      modSortFilter,
      tournamentGameFilter,
      tournamentStatusFilter,
      tabs,
      generalPosts,
      guilds,
      filteredMods,
      filteredTournaments,
      isLoggedIn,
      getAvatarInitial,
      formatPostTime,
      formatDownloads,
      formatTournamentDate,
      getStatusText,
      viewPost,
      downloadMod,
      viewModDetails,
      joinGuild,
      viewGuildDetails,
      registerTournament,
      viewTournamentDetails,
      createPost
    }
  }
}
</script>

<style scoped>
.community-page {
  padding: 40px 0;
  min-height: calc(100vh - 160px);
}

.page-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
  color: var(--accent-color);
}

.community-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.nav-tab {
  padding: 12px 24px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.nav-tab:hover {
  background-color: var(--primary-color);
  border-color: var(--accent-color);
}

.nav-tab.active {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.tab-content {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-title {
  font-size: 24px;
  color: var(--text-color);
  margin: 0;
}

.create-post-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.create-post-btn:hover {
  background-color: var(--accent-hover);
}

/* 帖子样式 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: bold;
  color: var(--text-color);
}

.post-time {
  font-size: 14px;
  color: var(--text-secondary);
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background-color: var(--accent-light);
  color: var(--accent-color);
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.post-content {
  margin-bottom: 15px;
}

.post-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.post-preview {
  color: var(--text-secondary);
  line-height: 1.6;
}

.post-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.post-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 14px;
}

.view-post-btn {
  padding: 6px 16px;
  background-color: var(--border-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-post-btn:hover {
  background-color: var(--accent-light);
  color: var(--accent-color);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 16px;
  color: var(--text-secondary);
}

/* MOD样式 */
.mod-filters,
.tournament-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 15px;
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
}

.mods-container,
.guilds-container,
.tournaments-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mod-card,
.guild-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.mod-card:hover,
.guild-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mod-header,
.guild-header {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  align-items: flex-start;
}

.mod-thumbnail,
.guild-logo {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.mod-image,
.guild-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.featured-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--accent-color);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.mod-info,
.guild-info {
  flex: 1;
}

.mod-name,
.guild-name {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--text-color);
}

.mod-author,
.mod-game,
.guild-members,
.guild-level {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.guild-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

.guild-status.recruiting {
  background-color: #27ae60;
  color: white;
}

.guild-status.closed {
  background-color: #e74c3c;
  color: white;
}

.mod-description,
.guild-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

.mod-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.mod-actions,
.guild-actions {
  display: flex;
  gap: 10px;
}

.download-mod-btn,
.join-guild-btn,
.register-tournament-btn {
  padding: 8px 16px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-mod-btn:hover,
.join-guild-btn:hover,
.register-tournament-btn:hover {
  background-color: var(--accent-hover);
}

.view-mod-btn,
.view-guild-btn,
.view-tournament-btn {
  padding: 8px 16px;
  background-color: var(--border-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-mod-btn:hover,
.view-guild-btn:hover,
.view-tournament-btn:hover {
  background-color: var(--accent-light);
  color: var(--accent-color);
}

.guild-games {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.game-tag {
  padding: 4px 12px;
  background-color: var(--accent-light);
  color: var(--accent-color);
  border-radius: 15px;
  font-size: 12px;
}

/* 赛事样式 */
.tournament-card {
  background-color: var(--primary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tournament-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tournament-banner {
  position: relative;
  height: 150px;
}

.tournament-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tournament-status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.tournament-status-badge.upcoming {
  background-color: #3498db;
  color: white;
}

.tournament-status-badge.ongoing {
  background-color: #27ae60;
  color: white;
}

.tournament-status-badge.completed {
  background-color: #e74c3c;
  color: white;
}

.tournament-info {
  padding: 20px;
}

.tournament-name {
  font-size: 22px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.tournament-game {
  font-size: 16px;
  color: var(--accent-color);
  font-weight: bold;
  margin-bottom: 15px;
}

.tournament-date,
.tournament-prize,
.tournament-participants {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: var(--text-secondary);
}

.tournament-actions {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
}

.registered-btn {
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
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
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--text-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 15px;
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-color);
  font-size: 16px;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  padding: 10px 20px;
  background-color: var(--border-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: var(--primary-color);
}

.submit-btn {
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: var(--accent-hover);
}

/* 图标样式占位 */
.icon-plus:before { content: '+'; }
.icon-eye:before { content: '👁'; }
.icon-comment:before { content: '💬'; }
.icon-like:before { content: '👍'; }
.icon-download:before { content: '📥'; }
.icon-star:before { content: '⭐'; }
.icon-calendar:before { content: '📅'; }
.icon-trophy:before { content: '🏆'; }
.icon-users:before { content: '👥'; }

/* 响应式设计 */
@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .mod-header,
  .guild-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .mod-thumbnail,
  .guild-logo {
    width: 150px;
    height: 150px;
  }
  
  .post-header,
  .post-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .post-stats {
    justify-content: center;
  }
  
  .mod-filters,
  .tournament-filters {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>