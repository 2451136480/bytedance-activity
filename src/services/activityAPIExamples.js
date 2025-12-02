// 活动API使用示例
// 展示如何使用activityAPI进行数据操作和错误处理

import activityAPI from './activityAPI';

/**
 * 示例1: 获取首页重点活动
 * @returns {Promise<Array>} 首页活动列表
 */
export async function fetchHomeActivitiesExample() {
  console.log('=== 示例1: 获取首页重点活动 ===');
  
  try {
    // 调用API获取首页活动，限制返回3个
    const activities = await activityAPI.getHomeActivities({ limit: 3 });
    
    console.log('✅ 成功获取首页活动:', activities);
    console.log('首页活动数量:', activities.length);
    
    // 处理获取到的活动数据
    activities.forEach(activity => {
      console.log(`- 活动: ${activity.title} (${activity.status})`);
    });
    
    return activities;
  } catch (error) {
    console.error('❌ 获取首页活动失败:', error.message);
    
    // 实际应用中的错误处理方式
    // 1. 显示用户友好的错误提示
    showErrorMessage('获取推荐活动失败，请下拉刷新重试');
    
    // 2. 记录错误日志
    logError('fetchHomeActivities', error);
    
    // 3. 返回默认数据避免页面白屏
    return getDefaultHomeActivities();
  }
}

/**
 * 示例2: 获取活动列表（支持分页、筛选和搜索）
 * @param {number} page - 当前页码
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Object>} 活动列表和分页信息
 */
export async function fetchActivityListExample(page = 1, filters = {}) {
  console.log('=== 示例2: 获取活动列表 ===');
  console.log('当前页码:', page, '筛选条件:', filters);
  
  try {
    // 构建查询参数
    const queryParams = {
      page,
      pageSize: 10,
      ...filters
    };
    
    // 调用API获取活动列表
    const result = await activityAPI.getActivityList(queryParams);
    
    console.log('✅ 成功获取活动列表');
    console.log('分页信息:', result.pagination);
    console.log(`第${page}页，共${result.pagination.totalPages}页，总计${result.pagination.total}条`);
    console.log('当前页活动:', result.list.length, '条');
    
    // 格式化输出活动信息
    result.list.forEach(activity => {
      console.log(`- ${activity.title} [${activity.type}/${activity.status}]`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ 获取活动列表失败:', error.message);
    
    // 错误处理策略
    const errorResponse = {
      list: [],
      pagination: {
        page,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
    };
    
    // 区分参数错误和服务器错误
    if (error.message.includes('参数验证失败')) {
      console.warn('⚠️ 参数错误，请检查筛选条件');
      showErrorMessage('筛选条件无效，请重新选择');
    } else {
      showErrorMessage('获取活动列表失败，请稍后重试');
      logError('fetchActivityList', error, queryParams);
    }
    
    return errorResponse;
  }
}

/**
 * 示例3: 获取活动详情
 * @param {string} activityId - 活动ID
 * @returns {Promise<Object|null>} 活动详情
 */
export async function fetchActivityDetailExample(activityId) {
  console.log('=== 示例3: 获取活动详情 ===');
  console.log('活动ID:', activityId);
  
  // 输入验证
  if (!activityId) {
    console.error('❌ 错误：活动ID不能为空');
    showErrorMessage('活动ID无效');
    return null;
  }
  
  try {
    // 调用API获取活动详情
    const activity = await activityAPI.getActivityDetail(activityId);
    
    console.log('✅ 成功获取活动详情');
    console.log('活动标题:', activity.title);
    console.log('活动状态:', activity.status);
    console.log('开始时间:', activity.startTime);
    console.log('结束时间:', activity.endTime);
    console.log('参与人数:', activity.participateCount || '0');
    
    // 处理详情数据，例如格式化时间、渲染规则等
    const formattedActivity = formatActivityDetail(activity);
    
    return formattedActivity;
  } catch (error) {
    console.error('❌ 获取活动详情失败:', error.message);
    
    // 根据错误类型提供不同的反馈
    if (error.message.includes('活动不存在')) {
      console.warn('⚠️ 活动不存在');
      showErrorMessage('您查看的活动不存在或已被删除');
      // 可以跳转到活动列表页
      navigateToActivityList();
    } else {
      showErrorMessage('获取活动详情失败，请刷新重试');
      logError('fetchActivityDetail', error, { activityId });
    }
    
    return null;
  }
}

/**
 * 示例4: 更新活动信息
 * @param {string} activityId - 活动ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object|null>} 更新后的活动
 */
export async function updateActivityExample(activityId, updateData) {
  console.log('=== 示例4: 更新活动信息 ===');
  console.log('活动ID:', activityId);
  console.log('更新数据:', updateData);
  
  // 基本验证
  if (!activityId || !updateData || Object.keys(updateData).length === 0) {
    console.error('❌ 错误：缺少必要参数');
    showErrorMessage('更新数据不能为空');
    return null;
  }
  
  try {
    // 调用API更新活动
    const updatedActivity = await activityAPI.updateActivity(activityId, updateData);
    
    console.log('✅ 成功更新活动信息');
    console.log('更新后的活动:', updatedActivity.title);
    
    // 显示成功提示
    showSuccessMessage('活动更新成功');
    
    return updatedActivity;
  } catch (error) {
    console.error('❌ 更新活动失败:', error.message);
    
    // 错误处理策略
    if (error.message.includes('参数验证失败')) {
      showErrorMessage(`参数错误: ${error.message.replace('参数验证失败: ', '')}`);
    } else if (error.message.includes('活动不存在')) {
      showErrorMessage('活动不存在，无法更新');
    } else {
      showErrorMessage('更新活动失败，请稍后重试');
      logError('updateActivity', error, { activityId, updateData });
    }
    
    return null;
  }
}

/**
 * 示例5: 组合多个API调用（实际业务场景）
 * 获取活动详情并同时获取相关数据
 */
export async function complexBusinessExample(activityId) {
  console.log('=== 示例5: 组合API调用 ===');
  
  // 显示加载状态
  showLoading(true);
  
  try {
    // 并行调用多个API
    const [activityDetail, relatedActivities] = await Promise.all([
      activityAPI.getActivityDetail(activityId),
      activityAPI.getActivityList({ 
        page: 1, 
        pageSize: 5,
        type: activityAPI.constants.ACTIVITY_TYPE.DISCOUNT 
      })
    ]);
    
    console.log('✅ 成功获取所有数据');
    console.log('主活动:', activityDetail.title);
    console.log('相关活动数量:', relatedActivities.list.length);
    
    // 处理业务逻辑
    const businessResult = {
      activity: activityDetail,
      recommendations: relatedActivities.list,
      combinedStats: calculateCombinedStats(activityDetail, relatedActivities.list)
    };
    
    return businessResult;
  } catch (error) {
    console.error('❌ 业务流程失败:', error.message);
    
    // 部分失败策略：即使部分API失败，也尽量返回可用数据
    try {
      // 尝试获取基本活动信息作为备用
      const fallbackActivity = await activityAPI.getActivityDetail(activityId);
      showErrorMessage('部分数据加载失败');
      return { activity: fallbackActivity, recommendations: [], combinedStats: null };
    } catch (fallbackError) {
      showErrorMessage('数据加载失败，请重新尝试');
      logError('complexBusinessFlow', error);
      return null;
    }
  } finally {
    // 无论成功失败都隐藏加载状态
    showLoading(false);
  }
}

/**
 * 示例6: 批量操作（获取多个活动详情）
 * @param {Array<string>} activityIds - 活动ID数组
 */
export async function batchOperationExample(activityIds) {
  console.log('=== 示例6: 批量操作 ===');
  
  try {
    // 批量获取活动详情
    const activities = await activityAPI.batchGetActivityDetails(activityIds);
    
    console.log('✅ 成功批量获取活动详情');
    console.log('获取到的活动数量:', activities.length, '/', activityIds.length);
    
    // 统计不同状态的活动
    const statusCount = activities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('状态统计:', statusCount);
    
    return activities;
  } catch (error) {
    console.error('❌ 批量操作失败:', error.message);
    showErrorMessage('批量加载失败');
    return [];
  }
}

// 辅助函数（模拟UI交互）

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
  console.log(`[UI] ❌ 错误: ${message}`);
  // 实际实现: alert(message) 或 toast.error(message)
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccessMessage(message) {
  console.log(`[UI] ✅ 成功: ${message}`);
  // 实际实现: toast.success(message)
}

/**
 * 显示加载状态
 * @param {boolean} isLoading - 是否加载中
 */
function showLoading(isLoading) {
  console.log(`[UI] ⏳ 加载状态: ${isLoading ? '显示' : '隐藏'}`);
  // 实际实现: 设置loading state
}

/**
 * 记录错误日志
 * @param {string} functionName - 函数名
 * @param {Error} error - 错误对象
 * @param {Object} context - 上下文信息
 */
function logError(functionName, error, context = {}) {
  console.error(`[LOG] 错误日志 - 函数: ${functionName}`, {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  // 实际实现: 发送到错误监控系统
}

/**
 * 获取默认首页活动数据
 * @returns {Array} 默认活动列表
 */
function getDefaultHomeActivities() {
  return [];
}

/**
 * 格式化活动详情
 * @param {Object} activity - 活动原始数据
 * @returns {Object} 格式化后的活动数据
 */
function formatActivityDetail(activity) {
  return {
    ...activity,
    // 格式化时间为本地显示格式
    formattedStartTime: new Date(activity.startTime).toLocaleString('zh-CN'),
    formattedEndTime: new Date(activity.endTime).toLocaleString('zh-CN'),
    // 计算倒计时或已持续时间
    timeRemaining: calculateTimeRemaining(activity.startTime, activity.endTime, activity.status),
    // 格式化参与人数
    formattedParticipantCount: formatNumber(activity.participateCount || 0)
  };
}

/**
 * 计算活动时间状态
 * @param {string} startTime - 开始时间
 * @param {string} endTime - 结束时间
 * @param {string} status - 活动状态
 * @returns {string} 时间状态描述
 */
function calculateTimeRemaining(startTime, endTime, status) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (status === 'upcoming') {
    const diff = start - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `距离开始还有 ${days} 天`;
  } else if (status === 'ongoing') {
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `距离结束还有 ${days} 天`;
  } else {
    return '已结束';
  }
}

/**
 * 格式化数字（千分位）
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 计算组合统计信息
 * @param {Object} mainActivity - 主活动
 * @param {Array} relatedActivities - 相关活动列表
 * @returns {Object} 组合统计
 */
function calculateCombinedStats(mainActivity, relatedActivities) {
  const totalParticipants = (mainActivity.participateCount || 0) + 
    relatedActivities.reduce((sum, act) => sum + (act.participateCount || 0), 0);
  
  return {
    totalParticipants,
    relatedActivityCount: relatedActivities.length,
    activityTypes: [...new Set(relatedActivities.map(act => act.type))]
  };
}

/**
 * 导航到活动列表页
 */
function navigateToActivityList() {
  console.log('[UI] 导航到活动列表页');
  // 实际实现: history.push('/activities')
}

/**
 * 运行所有示例
 */
export async function runAllExamples() {
  console.log('\n=================================================');
  console.log('开始运行活动API使用示例');
  console.log('=================================================\n');
  
  try {
    // 按顺序运行示例
    await fetchHomeActivitiesExample();
    console.log('\n-------------------------------------------------\n');
    
    await fetchActivityListExample(1, {
      status: activityAPI.constants.ACTIVITY_STATUS.ONGOING,
      keyword: '促销'
    });
    console.log('\n-------------------------------------------------\n');
    
    await fetchActivityDetailExample('1');
    console.log('\n-------------------------------------------------\n');
    
    // 尝试更新活动（可选运行）
    // await updateActivityExample('1', { title: '更新后的活动标题', isFeatured: true });
    
    await complexBusinessExample('1');
    console.log('\n-------------------------------------------------\n');
    
    await batchOperationExample(['1', '2', '3']);
    
  } catch (error) {
    console.error('运行示例时出错:', error);
  } finally {
    console.log('\n=================================================');
    console.log('活动API使用示例运行完毕');
    console.log('=================================================');
  }
}

// 如果需要单独运行示例，可以取消下面的注释
// runAllExamples();

export default {
  fetchHomeActivitiesExample,
  fetchActivityListExample,
  fetchActivityDetailExample,
  updateActivityExample,
  complexBusinessExample,
  batchOperationExample,
  runAllExamples
};
