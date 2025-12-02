// 活动API错误处理最佳实践
// 展示各种错误场景和处理策略

import activityAPI from './activityAPI';

/**
 * 错误类型定义
 */
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',       // 网络错误
  SERVER_ERROR: 'SERVER_ERROR',         // 服务器错误
  VALIDATION_ERROR: 'VALIDATION_ERROR', // 参数验证错误
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND', // 资源不存在
  PERMISSION_DENIED: 'PERMISSION_DENIED', // 权限不足
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',       // 请求超时
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'        // 未知错误
};

/**
 * 错误处理工具类
 */
export class ErrorHandler {
  /**
   * 识别错误类型
   * @param {Error} error - 错误对象
   * @returns {string} 错误类型
   */
  static identifyErrorType(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('网络') || errorMessage.includes('connect')) {
      return API_ERROR_TYPES.NETWORK_ERROR;
    }
    if (errorMessage.includes('验证失败') || errorMessage.includes('invalid')) {
      return API_ERROR_TYPES.VALIDATION_ERROR;
    }
    if (errorMessage.includes('不存在')) {
      return API_ERROR_TYPES.RESOURCE_NOT_FOUND;
    }
    if (errorMessage.includes('权限') || errorMessage.includes('permission')) {
      return API_ERROR_TYPES.PERMISSION_DENIED;
    }
    if (errorMessage.includes('超时') || errorMessage.includes('timeout')) {
      return API_ERROR_TYPES.TIMEOUT_ERROR;
    }
    if (errorMessage.includes('服务器') || errorMessage.includes('server')) {
      return API_ERROR_TYPES.SERVER_ERROR;
    }
    
    return API_ERROR_TYPES.UNKNOWN_ERROR;
  }

  /**
   * 获取用户友好的错误消息
   * @param {Error} error - 错误对象
   * @returns {string} 用户友好的消息
   */
  static getFriendlyErrorMessage(error) {
    const errorType = this.identifyErrorType(error);
    
    switch (errorType) {
      case API_ERROR_TYPES.NETWORK_ERROR:
        return '网络连接异常，请检查网络设置后重试';
      case API_ERROR_TYPES.VALIDATION_ERROR:
        return `输入有误：${error.message.replace('参数验证失败: ', '')}`;
      case API_ERROR_TYPES.RESOURCE_NOT_FOUND:
        return '您访问的资源不存在或已被删除';
      case API_ERROR_TYPES.PERMISSION_DENIED:
        return '抱歉，您没有权限执行此操作';
      case API_ERROR_TYPES.TIMEOUT_ERROR:
        return '请求超时，请稍后重试';
      case API_ERROR_TYPES.SERVER_ERROR:
      case API_ERROR_TYPES.UNKNOWN_ERROR:
      default:
        return '系统繁忙，请稍后重试';
    }
  }

  /**
   * 记录错误日志
   * @param {string} functionName - 函数名
   * @param {Error} error - 错误对象
   * @param {Object} context - 上下文信息
   */
  static logError(functionName, error, context = {}) {
    const errorType = this.identifyErrorType(error);
    
    // 构建错误日志对象
    const errorLog = {
      timestamp: new Date().toISOString(),
      function: functionName,
      errorType,
      message: error.message,
      stack: error.stack,
      context,
      environment: {
        userAgent: navigator?.userAgent || 'Node.js',
        locale: navigator?.language || 'zh-CN',
        timestamp: Date.now()
      }
    };
    
    // 发送到错误监控系统
    console.error(`[ERROR LOG] ${functionName} - ${errorType}`, errorLog);
    
    // 实际项目中可以发送到监控服务
    // sendToMonitoringService(errorLog);
  }

  /**
   * 重试策略
   * @param {Function} fn - 要重试的函数
   * @param {Object} options - 重试选项
   * @param {number} options.maxRetries - 最大重试次数
   * @param {number} options.initialDelay - 初始延迟（ms）
   * @param {number} options.backoffFactor - 退避因子
   * @returns {Promise<any>}
   */
  static async retry(fn, options = {}) {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      backoffFactor = 2
    } = options;
    
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
          console.log(`重试第 ${attempt} 次，延迟 ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        return await fn();
      } catch (error) {
        lastError = error;
        const errorType = this.identifyErrorType(error);
        
        // 某些错误不需要重试
        if (errorType === API_ERROR_TYPES.VALIDATION_ERROR ||
            errorType === API_ERROR_TYPES.RESOURCE_NOT_FOUND ||
            errorType === API_ERROR_TYPES.PERMISSION_DENIED) {
          throw error;
        }
        
        console.error(`尝试 ${attempt + 1}/${maxRetries + 1} 失败:`, error.message);
      }
    }
    
    throw lastError;
  }
}

/**
 * 示例1: 参数验证错误处理
 */
export async function handleValidationErrorExample() {
  console.log('=== 示例1: 参数验证错误处理 ===');
  
  try {
    // 故意传入无效的状态参数
    await activityAPI.getActivityList({
      status: 'invalid_status', // 无效的状态
      pageSize: 200 // 超出限制的pageSize
    });
  } catch (error) {
    console.error('捕获到参数验证错误:', error.message);
    
    // 使用错误处理工具
    const errorType = ErrorHandler.identifyErrorType(error);
    const friendlyMessage = ErrorHandler.getFriendlyErrorMessage(error);
    
    console.log('错误类型:', errorType);
    console.log('用户友好消息:', friendlyMessage);
    
    // 记录错误
    ErrorHandler.logError('handleValidationErrorExample', error, {
      invalidParams: { status: 'invalid_status', pageSize: 200 }
    });
    
    // 实际应用中的处理方式
    // 1. 显示表单验证错误
    showValidationErrors(error.message);
    
    // 2. 恢复到默认参数
    const defaultParams = { status: '', pageSize: 10 };
    console.log('使用默认参数重试:', defaultParams);
  }
}

/**
 * 示例2: 资源不存在错误处理
 */
export async function handleResourceNotFoundExample() {
  console.log('\n=== 示例2: 资源不存在错误处理 ===');
  
  try {
    // 故意查询不存在的活动ID
    const nonExistentId = '999999';
    await activityAPI.getActivityDetail(nonExistentId);
  } catch (error) {
    console.error('捕获到资源不存在错误:', error.message);
    
    // 错误类型识别
    const errorType = ErrorHandler.identifyErrorType(error);
    
    if (errorType === API_ERROR_TYPES.RESOURCE_NOT_FOUND) {
      console.log('正确识别为资源不存在错误');
      
      // 实际应用中的处理策略
      // 1. 显示404页面或组件
      renderNotFoundComponent();
      
      // 2. 提供推荐内容
      const recommendations = await activityAPI.getHomeActivities({ limit: 3 });
      console.log('推荐替代活动:', recommendations.map(r => r.title));
      
      // 3. 记录访问模式
      logNotFoundAttempt('activity', '999999');
    }
  }
}

/**
 * 示例3: 使用重试策略处理网络错误
 */
export async function retryStrategyExample() {
  console.log('\n=== 示例3: 重试策略处理 ===');
  
  try {
    // 模拟不稳定连接下的API调用
    const result = await ErrorHandler.retry(
      async () => {
        // 模拟随机失败
        if (Math.random() < 0.7) { // 70%概率失败，用于演示
          throw new Error('网络连接不稳定，请求失败');
        }
        return await activityAPI.getHomeActivities();
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        backoffFactor: 2
      }
    );
    
    console.log('✅ 经过重试后成功:', result.length, '个活动');
  } catch (error) {
    console.error('❌ 所有重试都失败了:', error.message);
    
    // 重试失败后的降级策略
    const fallbackData = getFallbackHomeData();
    console.log('启用降级方案，使用备用数据');
    
    // 显示网络错误提示，提供离线模式
    showOfflineModeNotification();
  }
}

/**
 * 示例4: 批量操作中的部分失败处理
 */
export async function partialFailureExample() {
  console.log('\n=== 示例4: 批量操作部分失败处理 ===');
  
  const activityIds = ['1', '2', '999', '3', '888']; // 包含无效ID
  const results = {
    success: [],
    failed: []
  };
  
  try {
    // 分别处理每个ID，避免一个失败影响全部
    for (const id of activityIds) {
      try {
        const activity = await activityAPI.getActivityDetail(id);
        results.success.push(activity);
        console.log(`✅ 成功获取活动 ${id}: ${activity.title}`);
      } catch (error) {
        results.failed.push({
          id,
          error: error.message
        });
        console.error(`❌ 获取活动 ${id} 失败:`, error.message);
      }
    }
    
    // 汇总结果
    console.log('\n批量操作结果汇总:');
    console.log(`成功: ${results.success.length} 个`);
    console.log(`失败: ${results.failed.length} 个`);
    
    // 实际应用中的处理方式
    if (results.failed.length > 0) {
      // 1. 显示部分成功的提示
      showPartialSuccessNotification(results.success.length, results.failed.length);
      
      // 2. 提供重试失败项的选项
      offerRetryForFailedItems(results.failed);
    }
    
    return results;
  } catch (error) {
    console.error('批量操作框架错误:', error);
  }
}

/**
 * 示例5: 超时错误处理
 */
export async function timeoutErrorHandlingExample() {
  console.log('\n=== 示例5: 超时错误处理 ===');
  
  // 创建带超时的API调用
  const withTimeout = (promise, ms = 5000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`请求超时 (${ms}ms)`)), ms)
      )
    ]);
  };
  
  try {
    // 模拟长时间运行的请求
    const timeoutPromise = withTimeout(
      activityAPI.getActivityList({ page: 1, pageSize: 100 }), // 大数据量查询
      2000 // 设置较短的超时时间
    );
    
    const result = await timeoutPromise;
    console.log('✅ 请求成功完成');
    return result;
  } catch (error) {
    console.error('捕获到超时错误:', error.message);
    
    // 超时处理策略
    if (error.message.includes('超时')) {
      console.log('执行超时处理策略');
      
      // 1. 提供取消选项
      offerCancelOption();
      
      // 2. 尝试减小数据量
      const reducedResult = await activityAPI.getActivityList({ 
        page: 1, 
        pageSize: 10 // 减小每页数量
      });
      console.log('使用减小的数据量重试成功');
      
      // 3. 显示加载更多按钮
      showLoadMoreOption();
    }
  }
}

/**
 * 示例6: 错误边界和降级服务
 */
export async function degradationExample() {
  console.log('\n=== 示例6: 服务降级和错误边界 ===');
  
  try {
    // 尝试获取最新数据
    const freshData = await activityAPI.getActivityList({ 
      page: 1,
      pageSize: 10,
      status: activityAPI.constants.ACTIVITY_STATUS.ONGOING
    });
    
    // 更新缓存
    updateLocalCache('activities:ongoing', freshData);
    console.log('✅ 成功获取最新数据并更新缓存');
    
    return freshData;
  } catch (error) {
    console.error('获取最新数据失败:', error.message);
    
    // 降级到缓存数据
    const cachedData = getFromLocalCache('activities:ongoing');
    
    if (cachedData) {
      console.log('⚠️ 降级到缓存数据');
      
      // 显示数据过期提示
      showCachedDataNotification();
      
      // 后台静默刷新
      refreshDataInBackground();
      
      return cachedData;
    } else {
      // 无缓存时使用默认数据
      console.log('❌ 无缓存，使用默认数据');
      const defaultData = getDefaultData();
      
      // 显示严重错误提示
      showCriticalErrorNotification();
      
      return defaultData;
    }
  }
}

// 辅助函数（模拟实际应用场景）

function showValidationErrors(message) {
  console.log(`[UI] 显示表单验证错误: ${message}`);
  // 实际实现: showErrorInForm(message)
}

function renderNotFoundComponent() {
  console.log('[UI] 渲染404资源不存在组件');
  // 实际实现: render404Page()
}

function logNotFoundAttempt(resourceType, resourceId) {
  console.log(`[ANALYTICS] 记录资源不存在尝试: ${resourceType} - ${resourceId}`);
}

function getFallbackHomeData() {
  return [];
}

function showOfflineModeNotification() {
  console.log('[UI] 显示离线模式通知："当前网络不稳定，已切换到离线模式"');
}

function showPartialSuccessNotification(successCount, failedCount) {
  console.log(`[UI] 部分操作成功通知：${successCount}个成功，${failedCount}个失败`);
}

function offerRetryForFailedItems(failedItems) {
  console.log('[UI] 提供重试失败项的选项');
  // 显示重试按钮
}

function offerCancelOption() {
  console.log('[UI] 显示取消操作选项');
}

function showLoadMoreOption() {
  console.log('[UI] 显示"加载更多"按钮');
}

function updateLocalCache(key, data) {
  console.log(`[CACHE] 更新缓存: ${key}`);
  // 实际实现: localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function getFromLocalCache(key) {
  console.log(`[CACHE] 读取缓存: ${key}`);
  // 实际实现: JSON.parse(localStorage.getItem(key))?.data;
  return null; // 模拟无缓存
}

function showCachedDataNotification() {
  console.log('[UI] 显示缓存数据提示："当前显示的是缓存数据，可能不是最新的"');
}

function refreshDataInBackground() {
  console.log('[BACKGROUND] 后台静默刷新数据');
}

function getDefaultData() {
  return { list: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } };
}

function showCriticalErrorNotification() {
  console.log('[UI] 显示严重错误提示："无法加载数据，请检查网络连接后重试"');
}

/**
 * 运行所有错误处理示例
 */
export async function runErrorHandlingExamples() {
  console.log('\n=================================================');
  console.log('开始运行错误处理示例');
  console.log('=================================================\n');
  
  try {
    await handleValidationErrorExample();
    await handleResourceNotFoundExample();
    await retryStrategyExample();
    await partialFailureExample();
    await timeoutErrorHandlingExample();
    await degradationExample();
    
    console.log('\n=================================================');
    console.log('错误处理示例运行完成');
    console.log('=================================================\n');
  } catch (error) {
    console.error('运行示例过程中出现错误:', error);
  }
}

/**
 * 最佳实践总结：
 * 1. 精确识别错误类型，提供有针对性的处理
 * 2. 实现自动重试机制，特别是对网络错误
 * 3. 批量操作采用独立处理，避免整体失败
 * 4. 实现缓存降级策略，保证基本功能可用
 * 5. 提供友好的用户反馈，包括加载状态、错误提示和重试选项
 * 6. 完善的错误日志系统，便于问题排查
 * 7. 针对不同错误类型显示不同的UI反馈
 * 8. 考虑超时处理和用户取消操作的场景
 */

export default {
  ErrorHandler,
  API_ERROR_TYPES,
  runErrorHandlingExamples,
  handleValidationErrorExample,
  handleResourceNotFoundExample,
  retryStrategyExample,
  partialFailureExample,
  timeoutErrorHandlingExample,
  degradationExample
};
