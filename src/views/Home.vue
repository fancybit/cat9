<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="container">
        <h2>
          探索 独立游戏的未来
        </h2>
        <div>
        <p>让利开发者，无需版号申请，没有平台拿走一半广告收入,不许买断内购的条款。</p>
        <p>香港公司运营，中国的全球自由贸易港，0关税，无需担心美国的关税波动问题。</p>
        <p>支持支付宝，微信，银联，visa，paypal，区块链技术赋能，保障玩家充值的账目安全。</p>
        <p>新平台限时优惠，只收取开发者10%的销售收入，免费上架，提供SDK接入技术支持。</p>
        <p>为独立游戏开发者开辟新的盈利通道。期待您的加入！</p>
        </div>
        <div class="cta-buttons">
          <router-link to="/store" class="btn btn-primary">探索游戏</router-link>
          <a href="#" class="btn btn-secondary">了解更多</a>
        </div>
      </div>
    </section>

    <!-- 特色游戏 -->
    <section class="featured-games">
      <div class="container">
        <h3>特色游戏</h3>
        <div class="games-grid">
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video"
                src="//player.bilibili.com/player.html?isOutside=true&aid=115354231639204&bvid=BV15o4cz7EJc&cid=32987809148&p=1&muted=true"
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>醒梦</h4>
            <p>灾厄的预兆，偏僻的小镇，母亲的秘密。13层梦中梦，一起走出梦魇，重新沐浴在自由的阳光之下。只要5美元，小品级游戏，万圣节礼物，为您的好友带来惊喜。</p>
            <a href="#" class="play-now">立即体验</a>
          </div>
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video" src="//player.bilibili.com/player.html?isOutside=true&aid=115354399410787&bvid=BV1TG4wzTEid&cid=32988596284&p=1&muted=true" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>午夜巫女</h4>
            <p>类似吸血鬼幸存者的MOBA游戏，支持PVE,PVP联机。</p>
            <a href="#" class="play-now">立即体验</a>
          </div>
          <div class="game-card">
            <div class="game-video-container">
              <iframe class="game-video"
                src="//player.bilibili.com/player.html?isOutside=true&aid=871527902&bvid=BV1mV4y1q7T6&cid=1216399540&p=1&muted=true"
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
            </div>
            <h4>元武林</h4>
            <p>传统武术主题的3D横版格斗游戏</p>
            <a href="#" class="play-now">立即体验</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Web3 介绍 -->
    <section class="web3-info">
      <div class="container">
        <div class="info-content">
          <h3>新手独立游戏开发者路在何方？</h3>
          <div>玄玉逍游创始人九命狸花猫，原本的网名是fancybit,幻。<br/>
          2016年左右在B站最赚钱的自研手游《机动战姬》初代项目组担任服务端负责人，全栈程序。经过无数个不眠的日夜，项目成功上线，盈利，随后有了《机动战姬-聚变》，《重装战姬》2个著名二刺猿项目。然而随着项目成功上线，随之而来的是卸磨杀驴，团队分裂。<br/>
          离开B站和闪翼后，九命狸花猫又在北京，郑州，石家庄的几家手游公司任职，最后回到家乡加入了独立游戏开发者的行列。在游戏行业沉浮了十多年，九命狸花猫深知独立游戏开发者组队和盈利，宣发的不易。在创乐坊结识了许多独立游戏开发者朋友和团队，公司之后。九命狸花猫决定创办一家类似steam的独立游戏发行平台，同时支持PC,游戏机,手游等平台。<br/>
          美国关税战的开打似乎也影响到了游戏行业，国内独立游戏开发者普遍遇到了注册和身份验证的问题，原本独立游戏发行平台最后的净土steam也变得开始对中国独游开发者不那么友好。为了解决这些问题，九命狸花猫决定成立一家新的独立游戏发行平台，取名为玄玉逍游。结合创乐坊的人脉和社区，服务全国和全世界的独立游戏开发者，为他们开辟一个新的廉价，方便的游戏发行平台。<br/>
          </div>
        </div>
        <div class="info-image"></div>
      </div>
    </section>

    <!-- 最新资讯 -->
    <section class="news">
      <div class="container">
        <h3>最新资讯</h3>
        <div class="news-grid">
          <div class="news-card">
            <div class="news-img"></div>
            <h4>《玄玉逍游》上线测试中</h4>
            <p>免费独立游戏发行平台，为独立游戏开发者提供一站式服务。</p>
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