<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="container">
        <h2>
          {{ $t('home.heroTitle') }}
        </h2>
        <div>
        <p>{{ $t('home.heroSubtitle1') }}</p>
        <p>{{ $t('home.heroSubtitle2') }}</p>
        <p>{{ $t('home.heroSubtitle3') }}</p>
        <p>{{ $t('home.heroSubtitle4') }}</p>
        <p>{{ $t('home.heroSubtitle5') }}</p>
        </div>
        <div class="cta-buttons">
          <router-link to="/store" class="btn btn-primary">{{ $t('home.heroBtnExplore') }}</router-link>
          <a href="#" class="btn btn-secondary">{{ $t('home.heroBtnLearnMore') }}</a>
        </div>
      </div>
    </section>

    <!-- 特色游戏 -->
    <section class="featured-games">
      <div class="container">
        <h3>{{ $t('home.featuredGamesTitle') }}</h3>
        <div class="games-grid">
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video"
                src="//player.bilibili.com/player.html?isOutside=true&aid=115354231639204&bvid=BV15o4cz7EJc&cid=32987809148&p=1&muted=true"
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>{{ $t('home.game1Title') }}</h4>
            <p>{{ $t('home.game1Desc') }}</p>
            <a href="#" class="play-now">{{ $t('home.btnPlayNow') }}</a>
          </div>
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video" src="//player.bilibili.com/player.html?isOutside=true&aid=115354399410787&bvid=BV1TG4wzTEid&cid=32988596284&p=1&muted=true" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>{{ $t('home.game2Title') }}</h4>
            <p>{{ $t('home.game2Desc') }}</p>
            <a href="#" class="play-now">{{ $t('home.btnPlayNow') }}</a>
          </div>
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video"
                src="//player.bilibili.com/player.html?isOutside=true&aid=871527902&bvid=BV1mV4y1q7T6&cid=1216399540&p=1&muted=true"
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>{{ $t('home.game3Title') }}</h4>
            <p>{{ $t('home.game3Desc') }}</p>
            <a href="#" class="play-now">{{ $t('home.btnPlayNow') }}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Web3 介绍 -->
    <section class="web3-info">
      <div class="container">
        <div class="info-content">
          <h3>{{ $t('home.web3Title') }}</h3>
          <div>{{ $t('home.web3Content') }}</div>
        </div>
        <div class="info-image"></div>
      </div>
    </section>

    <!-- 最新资讯 -->
    <section class="news">
      <div class="container">
        <h3>{{ $t('home.newsTitle') }}</h3>
        <div class="news-grid">
          <div class="news-card">
            <div class="news-img"></div>
            <h4>{{ $t('home.news1Title') }}</h4>
            <p>{{ $t('home.news1Desc') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
/* 已有样式已在全局CSS中定义 */
.hero {
  background: linear-gradient(rgba(27, 40, 56, 0.9), rgba(27, 40, 56, 0.8)), url('@/assets/logo.png') no-repeat center center;
  background-size: cover;
  padding: 80px 0;
  text-align: center;
}

.container{
  display: block;
  float: clear;
}

.hero h2 {
  font-size: 42px;
  margin-bottom: 30px;
  color: var(--accent-color);
}

.hero p {
  font-size: 18px;
  margin-bottom: 15px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.featured-games {
  padding: 60px 0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.game-card {
  background-color: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.game-video-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.game-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-card h4 {
  padding: 15px;
  font-size: 20px;
  color: var(--text-color);
}

.game-card p {
  padding: 0 15px 15px;
  color: var(--text-secondary);
  font-size: 14px;
}

.play-now {
  display: block;
  padding: 10px 15px;
  background-color: var(--button-primary);
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.play-now:hover {
  background-color: var(--button-primary-hover);
}

.web3-info {
  background-color: var(--secondary-color);
  padding: 60px 0;
}

.info-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.info-content h3 {
  margin-bottom: 20px;
}

.info-content div {
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
}

.news {
  padding: 60px 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.news-card {
  background-color: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.news-img {
  height: 180px;
  background-color: var(--secondary-color);
  background-image: url('@/assets/logo.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.news-card h4 {
  padding: 15px;
  font-size: 18px;
  color: var(--text-color);
}

.news-card p {
  padding: 0 15px 15px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>