<template>
  <div class="about-us-container">
    <div class="container">
      <!-- 页面标题 -->
      <h1 class="page-title">{{ $t('navbar.aboutUs') }}</h1>
      
      <!-- 关于我们内容 -->
      <div class="about-content">
        <!-- 公司介绍 -->
        <section class="company-intro">
          <h2>公司简介</h2>
          <div class="content-wrapper">
            <div class="text-content">
              <p>玄玉引擎是一个专注于独立游戏发行的平台，为开发者提供完善的游戏发布渠道，为玩家带来优质的游戏体验。</p>
              <p>我们致力于打造一个公平、开放、共赢的游戏生态系统，让独立开发者能够轻松发布和推广他们的游戏，同时让玩家能够发现和享受更多优秀的独立游戏作品。</p>
            </div>
            <div class="image-content">
              <img src="@/assets/logo.png" alt="玄玉逍游" class="company-logo">
            </div>
          </div>
        </section>
        
        <!-- 我们的使命 -->
        <section class="mission-vision">
          <h2>我们的使命与愿景</h2>
          <div class="mission-grid">
            <div class="mission-item">
              <div class="mission-icon">
                <i class="icon-mission"></i>
              </div>
              <h3>使命</h3>
              <p>为独立游戏开发者提供一站式的游戏发布和运营服务，助力优秀游戏作品走向全球市场。</p>
            </div>
            <div class="mission-item">
              <div class="mission-icon">
                <i class="icon-vision"></i>
              </div>
              <h3>愿景</h3>
              <p>成为全球领先的独立游戏发行平台，连接开发者与玩家，共同构建繁荣的游戏生态。</p>
            </div>
            <div class="mission-item">
              <div class="mission-icon">
                <i class="icon-values"></i>
              </div>
              <h3>价值观</h3>
              <p>公平、开放、创新、共赢，始终以用户需求为中心，不断提升平台服务质量。</p>
            </div>
          </div>
        </section>
        
        <!-- 发展历程 -->
        <section class="history-timeline">
          <h2>发展历程</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-year">2023</div>
              <div class="timeline-content">
                <h3>平台成立</h3>
                <p>玄玉引擎正式成立，团队致力于打造独立游戏发行平台。</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2024</div>
              <div class="timeline-content">
                <h3>平台上线</h3>
                <p>玄玉引擎平台正式上线，开始接受开发者提交游戏。</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2025</div>
              <div class="timeline-content">
                <h3>快速发展</h3>
                <p>平台用户数量突破10万，合作开发者超过100家，发布游戏超过500款。</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 团队介绍 -->
        <section class="team-intro">
          <h2>团队介绍</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar"></div>
              <h3>张三</h3>
              <p class="member-position">创始人兼CEO</p>
              <p class="member-bio">拥有10年游戏行业经验，曾任职于多家知名游戏公司，致力于推动独立游戏发展。</p>
            </div>
            <div class="team-member">
              <div class="member-avatar"></div>
              <h3>李四</h3>
              <p class="member-position">技术总监</p>
              <p class="member-bio">资深全栈开发者，拥有丰富的平台架构设计经验，负责平台技术研发。</p>
            </div>
            <div class="team-member">
              <div class="member-avatar"></div>
              <h3>王五</h3>
              <p class="member-position">运营总监</p>
              <p class="member-bio">拥有丰富的游戏运营经验，负责平台用户增长和游戏推广。</p>
            </div>
            <div class="team-member">
              <div class="member-avatar"></div>
              <h3>赵六</h3>
              <p class="member-position">商务总监</p>
              <p class="member-bio">负责平台商务合作，与开发者建立良好的合作关系。</p>
            </div>
          </div>
        </section>
        
        <!-- 联系我们 -->
        <section class="contact-info">
          <h2>联系我们</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <div class="contact-icon">
                <i class="icon-email"></i>
              </div>
              <div class="contact-details">
                <h3>邮箱</h3>
                <p>fancybit@qq.com</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <i class="icon-phone"></i>
              </div>
              <div class="contact-details">
                <h3>电话</h3>
                <p>+86 15333729278</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <i class="icon-address"></i>
              </div>
              <div class="contact-details">
                <h3>地址</h3>
                <p>中国河南省安阳市龙安区文昌大道玄玉宫（惠丰小区8号楼）</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      // 页面数据
    }
  },
  mounted() {
    // 页面加载时执行的逻辑
  },
  methods: {
    // 页面方法
  }
}
</script>

<style scoped>
.about-us-container {
  min-height: 100vh;
  background-color: var(--primary-color);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
  color: var(--text-color);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* 公司介绍 */
.company-intro {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.company-intro h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: center;
}

.text-content {
  flex: 1;
  line-height: 1.8;
  color: var(--text-secondary);
}

.text-content p {
  margin-bottom: 15px;
}

.image-content {
    width: 200px;
    height: 200px;
  }
  
  .company-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .placeholder-image {
    width: 100%;
    height: 100%;
    background-color: var(--secondary-color);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
  
  .placeholder-image i {
    font-size: 48px;
    margin-bottom: 10px;
  }

/* 使命愿景 */
.mission-vision {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mission-vision h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--text-color);
  text-align: center;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.mission-item {
  text-align: center;
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mission-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.mission-icon {
  width: 80px;
  height: 80px;
  background-color: var(--button-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.mission-icon i {
  font-size: 32px;
}

.mission-item h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--text-color);
}

.mission-item p {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 发展历程 */
.history-timeline {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.history-timeline h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--text-color);
  text-align: center;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--border-color);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
}

.timeline-year {
  width: 100px;
  height: 100px;
  background-color: var(--button-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  z-index: 1;
  flex-shrink: 0;
}

.timeline-content {
  width: calc(50% - 80px);
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  margin: 0 40px;
}

.timeline-content h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.timeline-content p {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 团队介绍 */
.team-intro {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.team-intro h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--text-color);
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.team-member {
  text-align: center;
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  width: 120px;
  height: 120px;
  background-color: var(--button-primary);
  border-radius: 50%;
  margin: 0 auto 20px;
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22%3E%3Cpath fill%3D%22%23ffffff%22 d%3D%22M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm0-36C11.2 4 4 11.2 4 20s7.2 16 16 16 16-7.2 16-16S28.8 4 20 4zm-5 28c0 .8-.7 1.5-1.5 1.5S12 32.8 12 32v-2c0-.8.7-1.5 1.5-1.5S15 29.2 15 30v.5zm13 0c0 .8-.7 1.5-1.5 1.5S25 32.8 25 32v-2c0-.8.7-1.5 1.5-1.5S28 29.2 28 30v.5zm-5-8c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z%22%2F%3E%3C%2Fsvg%3E');
  background-size: cover;
  background-position: center;
}

.member-name {
  font-size: 20px;
  margin-bottom: 5px;
  color: var(--text-color);
}

.member-position {
  font-size: 14px;
  color: var(--button-primary);
  margin-bottom: 15px;
  font-weight: bold;
}

.member-bio {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 联系我们 */
.contact-info {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-info h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--text-color);
  text-align: center;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  width: 60px;
  height: 60px;
  background-color: var(--button-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.contact-icon i {
  font-size: 24px;
}

.contact-details h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--text-color);
}

.contact-details p {
  color: var(--text-secondary);
}

/* 图标占位 */
.icon-building::before { content: '🏢'; }
.icon-mission::before { content: '🎯'; }
.icon-vision::before { content: '👁️'; }
.icon-values::before { content: '💡'; }
.icon-email::before { content: '📧'; }
.icon-phone::before { content: '📞'; }
.icon-address::before { content: '📍'; }

/* 响应式设计 */
@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .image-content {
    width: 150px;
    height: 150px;
  }
  
  .mission-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline::before {
    left: 50px;
  }
  
  .timeline-item {
    flex-direction: row !important;
    align-items: flex-start;
  }
  
  .timeline-content {
    width: calc(100% - 180px);
    margin-left: 40px;
    margin-right: 0;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>