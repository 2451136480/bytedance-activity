import { mockActivities, mockBanners, mockCategories, mockAnnouncements } from './mockData';
import api from '../utils/api';

// 模拟网络延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 获取首页数据
export const getHomeData = async () => {
  try {
    // 模拟API请求延迟
    await delay(300);
    
    // 返回首页所需的所有数据
    return {
      banners: mockBanners.filter(banner => banner.isActive),
      ongoingActivities: mockActivities.filter(activity => activity.status === 'ongoing'),
      upcomingActivities: mockActivities.filter(activity => activity.status === 'upcoming'),
      categories: mockCategories,
      announcements: mockAnnouncements.filter(announcement => announcement.isActive)
    };
  } catch (error) {
    console.error('获取首页数据失败:', error);
    throw error;
  }
};

// 获取活动列表（支持分页和筛选）
export const getActivityList = async ({ 
  page = 1, 
  pageSize = 10, 
  status = '', 
  category = '', 
  keyword = '',
  startTime = '',
  endTime = ''
}) => {
  try {
    // 模拟API请求延迟
    await delay(500);
    
    // 根据筛选条件过滤活动
    let filteredActivities = [...mockActivities];
    
    // 状态筛选
    if (status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === status);
    }
    
    // 分类筛选
    if (category && category !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.category === category);
    }
    
    // 关键词搜索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredActivities = filteredActivities.filter(activity => 
        activity.title.toLowerCase().includes(lowerKeyword) ||
        activity.description.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // 时间范围筛选
    if (startTime) {
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.startTime) >= new Date(startTime)
      );
    }
    
    if (endTime) {
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.endTime) <= new Date(endTime)
      );
    }
    
    // 计算分页
    const total = filteredActivities.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
    
    return {
      list: paginatedActivities,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error('获取活动列表失败:', error);
    throw error;
  }
};

// 获取活动详情
export const getActivityDetail = async (id) => {
  try {
    // 模拟API请求延迟
    await delay(200);
    
    const activity = mockActivities.find(activity => activity.id === parseInt(id));
    
    if (!activity) {
      throw new Error('活动不存在');
    }
    
    return activity;
  } catch (error) {
    console.error('获取活动详情失败:', error);
    throw error;
  }
};

// 更新活动信息
export const updateActivity = async (id, activityData) => {
  try {
    // 模拟API请求延迟
    await delay(500);
    
    const index = mockActivities.findIndex(activity => activity.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('活动不存在');
    }
    
    // 在实际应用中，这里会发送PUT请求到服务器
    // 现在只是模拟更新本地数据
    const updatedActivity = {
      ...mockActivities[index],
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    
    // 更新模拟数据（实际应用中不需要这一步）
    mockActivities[index] = updatedActivity;
    
    return updatedActivity;
  } catch (error) {
    console.error('更新活动失败:', error);
    throw error;
  }
};

// 创建新活动
export const createActivity = async (activityData) => {
  try {
    // 模拟API请求延迟
    await delay(500);
    
    // 创建新活动对象
    const newActivity = {
      ...activityData,
      id: Date.now(), // 使用时间戳作为临时ID
      createdAt: new Date().toISOString()
    };
    
    // 添加到模拟数据中（实际应用中不需要这一步）
    mockActivities.unshift(newActivity);
    
    return newActivity;
  } catch (error) {
    console.error('创建活动失败:', error);
    throw error;
  }
};

// 获取分类列表
export const getCategories = async () => {
  try {
    await delay(100);
    return mockCategories;
  } catch (error) {
    console.error('获取活动分类失败:', error);
    throw error;
  }
};

// 获取公告列表
export const getAnnouncements = async () => {
  try {
    await delay(200);
    return mockAnnouncements.filter(announcement => announcement.isActive);
  } catch (error) {
    console.error('获取公告列表失败:', error);
    throw error;
  }
};

// getActivities作为getActivityList的别名，保持向后兼容
export const getActivities = getActivityList;