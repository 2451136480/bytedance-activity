// 模拟数据主入口文件
// 用于演示和测试模拟数据的使用方法

// 导入模拟数据
export * from './data';
import { mockData } from './data';

/**
 * 初始化模拟数据
 * 在应用启动时调用，确保模拟数据可用
 */
export const initMockData = () => {
  console.log('Mock data initialized');
  return mockData;
};

/**
 * 重置模拟数据
 * 用于测试场景中重置数据到初始状态
 */
export const resetMockData = () => {
  console.log('Mock data reset');
  return mockData;
};

export default {
  initMockData,
  resetMockData,
  ...mockData,
};
