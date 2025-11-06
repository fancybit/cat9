// 软件服务 - 处理软件相关的业务逻辑

const dal = require('../dal');

class SoftwareService {
  /**
   * 创建软件
   * @param {Object} softwareData - 软件数据
   * @returns {Promise<Object>} 创建结果
   */
  async createSoftware(softwareData) {
    try {
      // 检查软件名称是否已存在
      const existingSoftware = await dal.catDB.getSoftwareByName(softwareData.name);
      if (existingSoftware) {
        return { success: false, error: '软件名称已存在' };
      }

      // 创建软件
      const software = await dal.createSoftware(softwareData);

      return { success: true, software: software.toJSON() };
    } catch (error) {
      console.error('创建软件失败:', error);
      return { success: false, error: '创建软件失败，请稍后重试' };
    }
  }

  /**
   * 获取软件信息
   * @param {string} softwareId - 软件ID
   * @returns {Promise<Object|null>} 软件信息
   */
  async getSoftwareInfo(softwareId) {
    try {
      const software = await dal.getSoftware(softwareId);
      return software ? software.toJSON() : null;
    } catch (error) {
      console.error('获取软件信息失败:', error);
      return null;
    }
  }

  /**
   * 通过名称获取软件
   * @param {string} name - 软件名称
   * @returns {Promise<Object|null>} 软件信息
   */
  async getSoftwareByName(name) {
    try {
      const software = await dal.catDB.getSoftwareByName(name);
      return software ? software.toJSON() : null;
    } catch (error) {
      console.error('通过名称获取软件失败:', error);
      return null;
    }
  }

  /**
   * 更新软件信息
   * @param {string} softwareId - 软件ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateSoftware(softwareId, updateData) {
    try {
      const software = await dal.updateSoftware(softwareId, updateData);
      return software ? { success: true, software: software.toJSON() } : { success: false, error: '软件不存在' };
    } catch (error) {
      console.error('更新软件信息失败:', error);
      return { success: false, error: '更新失败，请稍后重试' };
    }
  }

  /**
   * 设置软件为精选
   * @param {string} softwareId - 软件ID
   * @param {boolean} featured - 是否精选
   * @returns {Promise<Object>} 操作结果
   */
  async setSoftwareFeatured(softwareId, featured) {
    try {
      const software = await dal.getSoftware(softwareId);
      if (!software) {
        return { success: false, error: '软件不存在' };
      }

      software.setFeatured(featured);
      return { success: true, software: software.toJSON() };
    } catch (error) {
      console.error('设置软件精选状态失败:', error);
      return { success: false, error: '操作失败，请稍后重试' };
    }
  }

  /**
   * 获取用户拥有的软件
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 用户软件列表
   */
  async getUserSoftware(userId) {
    try {
      const softwareList = await dal.getUserSoftware(userId);
      return softwareList.map(software => software.toJSON());
    } catch (error) {
      console.error('获取用户软件列表失败:', error);
      return [];
    }
  }

  /**
   * 购买软件
   * @param {string} userId - 用户ID
   * @param {string} softwareId - 软件ID
   * @returns {Promise<Object>} 购买结果
   */
  async purchaseSoftware(userId, softwareId) {
    try {
      const result = await dal.purchaseSoftware(userId, softwareId);
      return result;
    } catch (error) {
      console.error('购买软件失败:', error);
      return { success: false, error: '购买失败，请稍后重试' };
    }
  }

  /**
   * 获取所有软件
   * @returns {Promise<Array>} 软件列表
   */
  async getAllSoftware() {
    try {
      // 这里需要从catDB获取所有软件
      // 由于catDB目前没有直接提供获取所有软件的方法，我们可以通过其他方式实现
      const allSoftware = Array.from(dal.catDB.software.values());
      return allSoftware.map(software => software.toJSON());
    } catch (error) {
      console.error('获取所有软件失败:', error);
      return [];
    }
  }
}

module.exports = new SoftwareService();