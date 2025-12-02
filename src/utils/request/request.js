// 请求工具模块
// 统一处理API请求，支持模拟数据和真实API切换

import { mockData } from '../../mock/data';

// API基础配置
const API_CONFIG = {
  baseURL: '/api',
  timeout: 10000,
  useMock: true, // 是否使用模拟数据
};

/**
 * 模拟延迟
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise}
 */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 模拟API响应
 * @param {Object} data - 响应数据
 * @param {number} status - 状态码
 * @returns {Promise<Object>} 模拟响应对象
 */
const mockResponse = async (data, status = 200) => {
  await delay();
  return {
    success: status === 200,
    status,
    data,
    message: status === 200 ? 'success' : 'error',
  };
};

/**
 * 处理模拟请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 模拟响应
 */
const handleMockRequest = async (url, options) => {
  // 解析URL路径
  const path = url.replace(API_CONFIG.baseURL, '');
  const [resource, action, id] = path.split('/').filter(Boolean);
  
  // 根据资源类型分发到不同的模拟处理逻辑
  switch (resource) {
    case 'activities':
      return handleActivitiesMockRequest(action, id, options);
    case 'banners':
      return handleBannersMockRequest(action, id, options);
    case 'users':
      return handleUsersMockRequest(action, id, options);
    default:
      return mockResponse({ error: 'Resource not found' }, 404);
  }
};

/**
 * 处理活动相关模拟请求
 */
const handleActivitiesMockRequest = async (action, id, options) => {
  const { method } = options;
  const { params, data } = options.body ? JSON.parse(options.body) : {};
  
  switch (true) {
    case !action && !id && method === 'GET':
      return mockResponse(mockData.activities.getActivities(params || {}));
    case id && method === 'GET':
      const activity = mockData.activities.getActivityById(id);
      return activity ? mockResponse(activity) : mockResponse({ error: 'Activity not found' }, 404);
    case !action && !id && method === 'POST':
      return mockResponse(data);
    case id && method === 'PUT':
      return mockResponse({ ...mockData.activities.getActivityById(id), ...data });
    case id && method === 'DELETE':
      return mockResponse({ success: true });
    default:
      return mockResponse({ error: 'Method not supported' }, 405);
  }
};

/**
 * 处理Banner相关模拟请求
 */
const handleBannersMockRequest = async (action, id, options) => {
  const { method } = options;
  const { params, data } = options.body ? JSON.parse(options.body) : {};
  
  switch (true) {
    case !action && !id && method === 'GET':
      return mockResponse(mockData.banners.getBanners(params || {}));
    case id && method === 'GET':
      const banner = mockData.banners.getBannerById(id);
      return banner ? mockResponse(banner) : mockResponse({ error: 'Banner not found' }, 404);
    case !action && !id && method === 'POST':
      return mockResponse(data);
    case id && method === 'PUT':
      return mockResponse({ ...mockData.banners.getBannerById(id), ...data });
    case id && method === 'DELETE':
      return mockResponse({ success: true });
    case id && action === 'click' && method === 'POST':
      return mockResponse({ success: mockData.banners.recordBannerClick(id) });
    case id && action === 'display' && method === 'POST':
      return mockResponse({ success: mockData.banners.recordBannerDisplay(id) });
    default:
      return mockResponse({ error: 'Method not supported' }, 405);
  }
};

/**
 * 处理用户相关模拟请求
 */
const handleUsersMockRequest = async (action, id, options) => {
  const { method } = options;
  const { params, data } = options.body ? JSON.parse(options.body) : {};
  
  switch (true) {
    case action === 'login' && method === 'POST':
      const { username, password } = data;
      const user = mockData.users.validateLogin(username, password);
      return user ? mockResponse({ user, token: 'mock-token-123456' }) : mockResponse({ error: 'Invalid credentials' }, 401);
    case !action && !id && method === 'GET':
      return mockResponse(mockData.users.getUsers(params || {}));
    case id && method === 'GET':
      const userInfo = mockData.users.getUserById(id);
      return userInfo ? mockResponse(userInfo) : mockResponse({ error: 'User not found' }, 404);
    case !action && !id && method === 'POST':
      return mockResponse(data);
    case id && method === 'PUT':
      return mockResponse({ ...mockData.users.getUserById(id), ...data });
    case id && method === 'DELETE':
      return mockResponse({ success: true });
    default:
      return mockResponse({ error: 'Method not supported' }, 405);
  }
};

/**
 * 基础请求方法
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应结果
 */
const request = async (url, options = {}) => {
  try {
    // 构建完整URL
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;
    
    // 合并请求选项
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    
    // 如果使用模拟数据
    if (API_CONFIG.useMock) {
      return handleMockRequest(fullUrl, requestOptions);
    }
    
    // 真实API请求
    const response = await fetch(fullUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @param {Object} options - 其他请求选项
 * @returns {Promise<Object>} 响应结果
 */
export const get = (url, params = {}, options = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return request(fullUrl, {
    method: 'GET',
    ...options,
  });
};

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {Object} options - 其他请求选项
 * @returns {Promise<Object>} 响应结果
 */
export const post = (url, data = {}, options = {}) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {Object} options - 其他请求选项
 * @returns {Promise<Object>} 响应结果
 */
export const put = (url, data = {}, options = {}) => {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应结果
 */
export const del = (url, options = {}) => {
  return request(url, {
    method: 'DELETE',
    ...options,
  });
};

// 导出请求工具对象
export default {
  get,
  post,
  put,
  delete: del,
  request,
  config: API_CONFIG,
};
