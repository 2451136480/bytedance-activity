// 模拟数据统一导出文件
// 集中导出所有模拟数据，方便项目使用

// 活动相关模拟数据
export * from './activities';
import * as activityModule from './activities';

// Banner相关模拟数据
export * from './banners';
import * as bannerModule from './banners';

// 用户相关模拟数据
export * from './users';
import * as userModule from './users';

// 统一导出所有模块
export const mockData = {
  activities: activityModule,
  banners: bannerModule,
  users: userModule,
};

export default mockData;
