// 鐢ㄦ埛鏈嶅姟 - 澶勭悊鐢ㄦ埛鐩稿叧鐨勪笟鍔￠€昏緫

const dal = require('../dal');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * 鐢ㄦ埛娉ㄥ唽
   * @param {Object} userData - 鐢ㄦ埛娉ㄥ唽鏁版嵁
   * @returns {Promise<Object>} 娉ㄥ唽缁撴灉
   */
  async register(userData) {
    try {
      // 妫€鏌ョ敤鎴峰悕鏄惁宸插瓨鍦?      const existingUser = await dal.getUserByUsername(userData.username);
      if (existingUser) {
        return { success: false, error: '鐢ㄦ埛鍚嶅凡瀛樺湪' };
      }

      // 妫€鏌ラ偖绠辨槸鍚﹀凡瀛樺湪
      const existingEmail = await dal.getUserByEmail(userData.email);
      if (existingEmail) {
        return { success: false, error: '閭宸茶娉ㄥ唽' };
      }

      // 鍔犲瘑瀵嗙爜
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      // 鍒涘缓鐢ㄦ埛
      const user = await dal.createUser({
        username: userData.username,
        email: userData.email,
        passwordHash,
        displayName: userData.displayName,
        avatar: userData.avatar
      });

      return { success: true, user: user.toJSON() };
    } catch (error) {
      console.error('鐢ㄦ埛娉ㄥ唽澶辫触:', error);
      return { success: false, error: '娉ㄥ唽澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鐢ㄦ埛鐧诲綍
   * @param {string} username - 鐢ㄦ埛鍚?   * @param {string} password - 瀵嗙爜
   * @returns {Promise<Object>} 鐧诲綍缁撴灉
   */
  async login(username, password) {
    try {
      // 鏌ユ壘鐢ㄦ埛
      const user = await dal.getUserByUsername(username);
      if (!user) {
        return { success: false, error: '鐢ㄦ埛鍚嶆垨瀵嗙爜閿欒' };
      }

      // 楠岃瘉瀵嗙爜
      const isMatch = await user.verifyPassword(bcrypt.compare, password);
      if (!isMatch) {
        return { success: false, error: '鐢ㄦ埛鍚嶆垨瀵嗙爜閿欒' };
      }

      // 鏇存柊鏈€鍚庣櫥褰曟椂闂?      user.lastLogin = new Date();
      
      // 淇濆瓨鐢ㄦ埛淇℃伅锛堝吋瀹逛笉鍚岀被鍨嬬殑鐢ㄦ埛瀵硅薄锛?      let updatedUser = user;
      if (typeof user.save === 'function') {
        updatedUser = await user.save();
      }

      // 鐢熸垚JWT浠ょ墝
      const { generateToken } = require('../utils/jwt');
      const userId = user._id || user.id; // 鍏煎涓嶅悓绫诲瀷鐨勭敤鎴稩D
      const token = generateToken({ userId });

      // 杞崲鐢ㄦ埛淇℃伅涓篔SON鏍煎紡锛堝吋瀹逛笉鍚岀被鍨嬬殑鐢ㄦ埛瀵硅薄锛?      const userJson = typeof user.toJSON === 'function' ? user.toJSON() : {
        ...user,
        // 绉婚櫎鏁忔劅淇℃伅
        passwordHash: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      };

      return { 
        success: true, 
        user: userJson,
        token 
      };
    } catch (error) {
      console.error('鐢ㄦ埛鐧诲綍澶辫触:', error);
      return { success: false, error: '鐧诲綍澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛淇℃伅
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Object|null>} 鐢ㄦ埛淇℃伅
   */
  async getUserInfo(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛淇℃伅澶辫触:', error);
      return null;
    }
  }

  /**
   * 鏇存柊鐢ㄦ埛淇℃伅
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {Object} updateData - 鏇存柊鏁版嵁
   * @returns {Promise<Object>} 鏇存柊缁撴灉
   */
  async updateUserInfo(userId, updateData) {
    try {
      // 濡傛灉鏇存柊瀵嗙爜锛岄渶瑕佸姞瀵?      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
      }

      const user = await dal.updateUser(userId, updateData);
      return user ? { success: true, user: user.toJSON() } : { success: false, error: '鐢ㄦ埛涓嶅瓨鍦? };
    } catch (error) {
      console.error('鏇存柊鐢ㄦ埛淇℃伅澶辫触:', error);
      return { success: false, error: '鏇存柊澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛閽卞寘淇℃伅
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Object|null>} 閽卞寘淇℃伅
   */
  async getUserWallet(userId) {
    try {
      const user = await dal.getUser(userId);
      return user ? user.wallet : null;
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛閽卞寘淇℃伅澶辫触:', error);
      return null;
    }
  }

  /**
   * 鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍
   * @param {string} userId - 鐢ㄦ埛ID
   * @returns {Promise<Array>} 浜ゆ槗璁板綍鍒楄〃
   */
  async getUserTransactions(userId) {
    try {
      const transactions = await dal.catDB.getUserTransactions(userId);
      return transactions.map(tx => tx.toJSON());
    } catch (error) {
      console.error('鑾峰彇鐢ㄦ埛浜ゆ槗璁板綍澶辫触:', error);
      return [];
    }
  }

  /**
   * 璇锋眰閲嶇疆瀵嗙爜
   * @param {string} email - 鐢ㄦ埛閭
   * @returns {Promise<Object>} 閲嶇疆瀵嗙爜璇锋眰缁撴灉
   */
  async requestPasswordReset(email) {
    try {
      // 鏌ユ壘鐢ㄦ埛
      const user = await dal.getUserByEmail(email);
      if (!user) {
        return { success: false, error: '璇ラ偖绠辨湭娉ㄥ唽' };
      }

      // 鐢熸垚閲嶇疆浠ょ墝锛堣繖閲岀畝鍗曞疄鐜帮紝瀹為檯搴旇鏇村鏉傦級
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1灏忔椂鍚庤繃鏈?
      // 淇濆瓨閲嶇疆浠ょ墝鍒扮敤鎴疯褰?      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // 杩欓噷搴旇鍙戦€侀偖浠剁粰鐢ㄦ埛锛屽寘鍚噸缃摼鎺?      // 鐢变簬鏄紨绀猴紝鎴戜滑鍙繑鍥炴垚鍔熶俊鎭?      console.log(`瀵嗙爜閲嶇疆璇锋眰锛氱敤鎴?${user.username} (${user.email}) 鐢熸垚鐨勯噸缃护鐗岋細${resetToken}`);

      return { success: true, message: '瀵嗙爜閲嶇疆閾炬帴宸插彂閫佸埌鎮ㄧ殑閭' };
    } catch (error) {
      console.error('璇锋眰瀵嗙爜閲嶇疆澶辫触:', error);
      return { success: false, error: '璇锋眰瀵嗙爜閲嶇疆澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 楠岃瘉瀵嗙爜閲嶇疆浠ょ墝
   * @param {string} token - 閲嶇疆浠ょ墝
   * @returns {Promise<Object>} 楠岃瘉缁撴灉
   */
  async verifyResetToken(token) {
    try {
      // 鏌ユ壘鏈夋湁鏁堥噸缃护鐗岀殑鐢ㄦ埛
      const user = await dal.getUserByResetToken(token);
      if (!user) {
        return { success: false, error: '鏃犳晥鐨勯噸缃护鐗? };
      }

      // 妫€鏌ヤ护鐗屾槸鍚﹁繃鏈?      if (user.resetPasswordExpires < Date.now()) {
        return { success: false, error: '閲嶇疆浠ょ墝宸茶繃鏈? };
      }

      return { success: true, userId: user._id };
    } catch (error) {
      console.error('楠岃瘉閲嶇疆浠ょ墝澶辫触:', error);
      return { success: false, error: '楠岃瘉閲嶇疆浠ょ墝澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 閲嶇疆瀵嗙爜
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {string} token - 閲嶇疆浠ょ墝
   * @param {string} newPassword - 鏂板瘑鐮?   * @returns {Promise<Object>} 閲嶇疆瀵嗙爜缁撴灉
   */
  async resetPassword(userId, token, newPassword) {
    try {
      // 楠岃瘉浠ょ墝
      const verifyResult = await this.verifyResetToken(token);
      if (!verifyResult.success || verifyResult.userId !== userId) {
        return { success: false, error: '鏃犳晥鐨勯噸缃护鐗? };
      }

      // 鏌ユ壘鐢ㄦ埛
      const user = await dal.getUser(userId);
      if (!user) {
        return { success: false, error: '鐢ㄦ埛涓嶅瓨鍦? };
      }

      // 鍔犲瘑鏂板瘑鐮?      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // 鏇存柊瀵嗙爜骞舵竻闄ら噸缃护鐗?      user.passwordHash = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return { success: true, message: '瀵嗙爜閲嶇疆鎴愬姛' };
    } catch (error) {
      console.error('閲嶇疆瀵嗙爜澶辫触:', error);
      return { success: false, error: '閲嶇疆瀵嗙爜澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }

  /**
   * 涓婁紶鐢ㄦ埛澶村儚
   * @param {string} userId - 鐢ㄦ埛ID
   * @param {Object} file - 涓婁紶鐨勬枃浠跺璞★紙multer澶勭悊鍚庯級鎴栧ご鍍忔暟鎹?   * @param {Object} [avatarData] - 鍙€夌殑澶村儚鏁版嵁瀵硅薄锛堢敤浜嶫SON鏍煎紡涓婁紶锛?   * @returns {Promise<Object>} 涓婁紶缁撴灉
   */
  async uploadAvatar(userId, file, avatarData = null) {
    try {
      // 鏌ユ壘鐢ㄦ埛
      const user = await dal.getUser(userId);
      if (!user) {
        return { success: false, error: '鐢ㄦ埛涓嶅瓨鍦? };
      }

      // 鐢熸垚涓€涓畝鍗曠殑闅忔満瀛楃涓蹭綔涓哄ご鍍忔爣璇?      const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // 妯℃嫙鐜勭帀鍖哄潡閾惧瓨鍌?      const avatarKey = `avatar_${userId}`;
      
      // 澶勭悊涓ょ涓婁紶鏂瑰紡锛歮ulter鏂囦欢涓婁紶鍜孞SON鏁版嵁涓婁紶
      let storedData;
      if (file && file.originalname) {
        // 浼犵粺鏂囦欢涓婁紶鏂瑰紡
        storedData = {
          userId,
          avatarId,
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        };
      } else {
        // JSON鏁版嵁涓婁紶鏂瑰紡
        storedData = {
          userId,
          avatarId,
          fileName: `${avatarId}.svg`,
          mimeType: 'image/svg+xml',
          size: avatarData ? avatarData.length || 0 : 0,
          uploadedAt: new Date()
        };
      }
      
      await dal.storeData(avatarKey, storedData);

      // 浣跨敤鏁版嵁URL浣滀负澶村儚鍗犱綅绗︼紝閬垮厤渚濊禆澶栭儴鏈嶅姟锛岃В鍐矰NS瑙ｆ瀽闂
      // 鐢熸垚涓€涓畝鍗曠殑SVG鏁版嵁URL锛屾樉绀虹敤鎴峰悕棣栧瓧姣?      const initial = user.username.charAt(0).toUpperCase();
      // 鐢熸垚SVG鏁版嵁URL锛屽渾褰㈣儗鏅紝鐧借壊鏂囧瓧
      const avatarUrl = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22120%22 height%3D%22120%22 viewBox%3D%220 0 120 120%22%3E%3Ccircle cx%3D%2260%22 cy%3D%2260%22 r%3D%2255%22 fill%3D%22%2366c0f4%22%2F%3E%3Ctext x%3D%2260%22 y%3D%2275%22 font-size%3D%2260%22 text-anchor%3D%22middle%22 fill%3D%22white%22 font-weight%3D%22bold%22%3E${initial}%3C%2Ftext%3E%3C%2Fsvg%3E`;
      
      // 鏇存柊鐢ㄦ埛澶村儚URL
      user.avatar = avatarUrl;
      
      // 淇濆瓨鐢ㄦ埛淇℃伅鍒扮巹鐜夊尯鍧楅摼
      await dal.updateUser(userId, { avatar: avatarUrl });

      return { success: true, avatarUrl };
    } catch (error) {
      console.error('澶村儚涓婁紶澶辫触:', error);
      return { success: false, error: '澶村儚涓婁紶澶辫触锛岃绋嶅悗閲嶈瘯' };
    }
  }
}

module.exports = new UserService();
