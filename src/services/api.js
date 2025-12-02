// API服务模块
// 为各个数据模型提供服务层抽象，使用请求工具进行数据交互

import request from '../utils/request/request';

/**
 * 活动相关API服务
 */
export const activityService = {
  /**
   * 获取活动列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 活动列表
   */
  getActivities: (params) => {
    return request.get('/activities', params);
  },

  /**
   * 获取活动详情
   * @param {string} id - 活动ID
   * @returns {Promise} 活动详情
   */
  getActivityById: (id) => {
    return request.get(`/activities/${id}`);
  },

  /**
   * 创建活动
   * @param {Object} data - 活动数据
   * @returns {Promise} 创建结果
   */
  createActivity: (data) => {
    return request.post('/activities', data);
  },

  /**
   * 更新活动
   * @param {string} id - 活动ID
   * @param {Object} data - 更新数据
   * @returns {Promise} 更新结果
   */
  updateActivity: (id, data) => {
    return request.put(`/activities/${id}`, data);
  },

  /**
   * 删除活动
   * @param {string} id - 活动ID
   * @returns {Promise} 删除结果
   */
  deleteActivity: (id) => {
    return request.delete(`/activities/${id}`);
  },

  /**
   * 获取活动统计数据
   * @returns {Promise} 统计数据
   */
  getActivityStats: () => {
    return request.get('/activities/stats');
  },
};

/**
 * Banner相关API服务
 */
export const bannerService = {
  /**
   * 获取Banner列表
   * @param {Object} params - 查询参数
   * @returns {Promise} Banner列表
   */
  getBanners: (params) => {
    return request.get('/banners', params);
  },

  /**
   * 获取Banner详情
   * @param {string} id - Banner ID
   * @returns {Promise} Banner详情
   */
  getBannerById: (id) => {
    return request.get(`/banners/${id}`);
  },

  /**
   * 创建Banner
   * @param {Object} data - Banner数据
   * @returns {Promise} 创建结果
   */
  createBanner: (data) => {
    return request.post('/banners', data);
  },

  /**
   * 更新Banner
   * @param {string} id - Banner ID
   * @param {Object} data - 更新数据
   * @returns {Promise} 更新结果
   */
  updateBanner: (id, data) => {
    return request.put(`/banners/${id}`, data);
  },

  /**
   * 删除Banner
   * @param {string} id - Banner ID
   * @returns {Promise} 删除结果
   */
  deleteBanner: (id) => {
    return request.delete(`/banners/${id}`);
  },

  /**
   * 记录Banner点击
   * @param {string} id - Banner ID
   * @returns {Promise} 记录结果
   */
  recordBannerClick: (id) => {
    return request.post(`/banners/${id}/click`);
  },

  /**
   * 记录Banner展示
   * @param {string} id - Banner ID
   * @returns {Promise} 记录结果
   */
  recordBannerDisplay: (id) => {
    return request.post(`/banners/${id}/display`);
  },
};

/**
 * 用户相关API服务
 */
export const userService = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @returns {Promise} 登录结果
   */
  login: (credentials) => {
    return request.post('/users/login', credentials);
  },

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  logout: () => {
    return request.post('/users/logout');
  },

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 用户列表
   */
  getUsers: (params) => {
    return request.get('/users', params);
  },

  /**
   * 获取用户详情
   * @param {string} id - 用户ID
   * @returns {Promise} 用户详情
   */
  getUserById: (id) => {
    return request.get(`/users/${id}`);
  },

  /**
   * 创建用户
   * @param {Object} data - 用户数据
   * @returns {Promise} 创建结果
   */
  createUser: (data) => {
    return request.post('/users', data);
  },

  /**
   * 更新用户
   * @param {string} id - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Promise} 更新结果
   */
  updateUser: (id, data) => {
    return request.put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   * @param {string} id - 用户ID
   * @returns {Promise} 删除结果
   */
  deleteUser: (id) => {
    return request.delete(`/users/${id}`);
  },

  /**
   * 获取当前用户信息
   * @returns {Promise} 用户信息
   */
  getCurrentUser: () => {
    return request.get('/users/current');
  },
};

// 统一导出所有服务
export const apiServices = {
  activities: activityService,
  banners: bannerService,
  users: userService,
};

export default apiServices;
