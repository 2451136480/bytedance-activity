// 活动管理API服务
// 实现活动管理相关的接口服务，包含异步请求模拟、错误处理等功能

import { 
  getHomeActivities as getHomeActivitiesMock, 
  getActivityList as getActivityListMock, 
  getActivityDetail as getActivityDetailMock, 
  updateActivity as updateActivityMock,
  validateFilterParams,
  ACTIVITY_STATUS,
  ACTIVITY_TYPE
} from '../mock/data/activities';

/**
 * 模拟网络延迟
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
const delay = (ms = 300 + Math.random() * 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 随机错误生成器
 * @param {number} errorRate - 错误率（0-1）
 * @param {string} message - 错误消息
 * @returns {Promise<void>}
 */
const randomError = async (errorRate = 0.05, message = '请求失败，请稍后重试') => {
  if (Math.random() < errorRate) {
    await delay(100);
    throw new Error(message);
  }
};

/**
 * 统一错误处理
 * @param {Function} fn - 执行的函数
 * @param {string} errorMessage - 错误消息
 * @returns {Promise<any>}
 */
const handleError = async (fn, errorMessage = '操作失败，请稍后重试') => {
  try {
    await randomError();
    const result = await fn();
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(errorMessage);
  }
};

/**
 * 活动管理API服务对象
 */
const activityAPI = {
  /**
   * 获取首页重点活动
   * @param {Object} options - 配置选项
   * @param {number} options.limit - 限制返回数量
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Array>} 重点活动列表
   * @throws {Error} 请求失败时抛出错误
   */
  async getHomeActivities(options = { limit: 4, includeMockDelay: true }) {
    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const activities = getHomeActivitiesMock(options.limit);
        return activities;
      },
      '获取首页活动失败'
    );
  },

  /**
   * 获取活动列表，支持分页和筛选
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页大小
   * @param {string} params.status - 活动状态筛选
   * @param {string} params.type - 活动类型筛选
   * @param {string} params.keyword - 关键词搜索
   * @param {string} params.startTime - 开始时间筛选
   * @param {string} params.endTime - 结束时间筛选
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Object>} 包含活动列表和分页信息的对象
   * @throws {Error} 参数验证失败或请求失败时抛出错误
   */
  async getActivityList(params = {}, options = { includeMockDelay: true }) {
    // 参数验证
    const validation = validateFilterParams(params);
    if (!validation.isValid) {
      throw new Error(`参数验证失败: ${validation.errors.join('; ')}`);
    }

    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const result = getActivityListMock(params);
        return result;
      },
      '获取活动列表失败'
    );
  },

  /**
   * 获取活动详情
   * @param {string} id - 活动ID
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Object>} 活动详情
   * @throws {Error} 活动不存在或请求失败时抛出错误
   */
  async getActivityDetail(id, options = { includeMockDelay: true }) {
    if (!id) {
      throw new Error('活动ID不能为空');
    }

    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const activity = getActivityDetailMock(id);
        if (!activity) {
          throw new Error(`活动不存在: ID=${id}`);
        }
        return activity;
      },
      '获取活动详情失败'
    );
  },

  /**
   * 更新活动信息
   * @param {string} id - 活动ID
   * @param {Object} data - 要更新的数据
   * @param {string} [data.title] - 活动标题
   * @param {string} [data.description] - 活动描述
   * @param {string} [data.status] - 活动状态
   * @param {string} [data.type] - 活动类型
   * @param {string} [data.startTime] - 开始时间
   * @param {string} [data.endTime] - 结束时间
   * @param {string} [data.rules] - 活动规则
   * @param {boolean} [data.isFeatured] - 是否为精选活动
   * @param {number} [data.priority] - 优先级
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Object>} 更新后的活动信息
   * @throws {Error} 参数验证失败、活动不存在或请求失败时抛出错误
   */
  async updateActivity(id, data, options = { includeMockDelay: true }) {
    if (!id) {
      throw new Error('活动ID不能为空');
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('更新数据不能为空');
    }

    // 验证状态和类型
    if (data.status && !Object.values(ACTIVITY_STATUS).includes(data.status)) {
      throw new Error(`无效的活动状态: ${data.status}`);
    }

    if (data.type && !Object.values(ACTIVITY_TYPE).includes(data.type)) {
      throw new Error(`无效的活动类型: ${data.type}`);
    }

    // 验证时间
    if (data.startTime || data.endTime) {
      // 检查活动是否存在
      const existingActivity = getActivityDetailMock(id);
      if (!existingActivity) {
        throw new Error(`活动不存在: ID=${id}`);
      }

      const startTime = data.startTime || existingActivity.startTime;
      const endTime = data.endTime || existingActivity.endTime;
      
      if (new Date(startTime) > new Date(endTime)) {
        throw new Error('开始时间不能晚于结束时间');
      }
    }

    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const updatedActivity = updateActivityMock(id, data);
        if (!updatedActivity) {
          throw new Error(`更新失败，活动不存在: ID=${id}`);
        }
        return updatedActivity;
      },
      '更新活动信息失败'
    );
  },

  /**
   * 批量获取活动详情
   * @param {Array<string>} ids - 活动ID列表
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Array<Object>>} 活动详情列表
   * @throws {Error} 请求失败时抛出错误
   */
  async batchGetActivityDetails(ids = [], options = { includeMockDelay: true }) {
    if (!Array.isArray(ids)) {
      throw new Error('ids必须是数组');
    }

    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const activities = ids
          .filter(id => id)
          .map(id => getActivityDetailMock(id))
          .filter(activity => activity); // 过滤掉不存在的活动
        return activities;
      },
      '批量获取活动详情失败'
    );
  },

  /**
   * 获取活动统计信息
   * @param {string} id - 活动ID
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeMockDelay - 是否包含模拟延迟
   * @returns {Promise<Object>} 活动统计信息
   * @throws {Error} 活动不存在或请求失败时抛出错误
   */
  async getActivityStats(id, options = { includeMockDelay: true }) {
    if (!id) {
      throw new Error('活动ID不能为空');
    }

    return handleError(
      async () => {
        if (options.includeMockDelay) {
          await delay();
        }
        const activity = getActivityDetailMock(id);
        if (!activity) {
          throw new Error(`活动不存在: ID=${id}`);
        }
        return activity.stats || {};
      },
      '获取活动统计信息失败'
    );
  },

  /**
   * 导出枚举常量
   */
  constants: {
    ACTIVITY_STATUS,
    ACTIVITY_TYPE
  }
};

/**
 * API使用示例
 * 
 * // 获取首页重点活动
 * async function fetchHomeActivities() {
 *   try {
 *     const activities = await activityAPI.getHomeActivities();
 *     console.log('首页活动:', activities);
 *     return activities;
 *   } catch (error) {
 *     console.error('获取首页活动失败:', error.message);
 *     // 显示错误提示
 *     showError(error.message);
 *     return [];
 *   }
 * }
 * 
 * // 获取活动列表（带筛选）
 * async function fetchActivityList(page = 1) {
 *   try {
 *     const params = {
 *       page,
 *       pageSize: 10,
 *       status: activityAPI.constants.ACTIVITY_STATUS.ONGOING,
 *       keyword: '促销'
 *     };
 *     const result = await activityAPI.getActivityList(params);
 *     console.log('活动列表:', result.list);
 *     console.log('分页信息:', result.pagination);
 *     return result;
 *   } catch (error) {
 *     console.error('获取活动列表失败:', error.message);
 *     showError(error.message);
 *     return { list: [], pagination: { page, pageSize: 10, total: 0, totalPages: 0 } };
 *   }
 * }
 * 
 * // 获取活动详情
 * async function fetchActivityDetail(id) {
 *   try {
 *     const activity = await activityAPI.getActivityDetail(id);
 *     console.log('活动详情:', activity);
 *     return activity;
 *   } catch (error) {
 *     console.error('获取活动详情失败:', error.message);
 *     showError(error.message);
 *     return null;
 *   }
 * }
 * 
 * // 更新活动信息
 * async function updateActivityInfo(id, data) {
 *   try {
 *     const updatedActivity = await activityAPI.updateActivity(id, data);
 *     console.log('更新成功:', updatedActivity);
 *     showSuccess('更新成功');
 *     return updatedActivity;
 *   } catch (error) {
 *     console.error('更新失败:', error.message);
 *     showError(error.message);
 *     return null;
 *   }
 * }
 */

export default activityAPI;
