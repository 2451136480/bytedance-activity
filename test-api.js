// 测试脚本 - 运行活动管理API服务测试

console.log('开始测试活动管理API服务...');

// 导入必要的模块
import { fetchHomeActivitiesExample } from './src/services/activityAPIExamples.js';
import activityAPI from './src/services/activityAPI.js';

// 主测试函数
async function runAllTests() {
  console.log('\n=================================================');
  console.log('🔄 运行API接口测试');
  console.log('=================================================\n');
  
  try {
    // 测试1: 获取首页活动示例
    await fetchHomeActivitiesExample();
    
    // 测试2: 直接测试核心API功能
    console.log('\n\n=== 直接测试核心API功能 ===');
    
    // 测试获取活动列表
    console.log('\n测试获取活动列表:');
    const listResult = await activityAPI.getActivityList({
      page: 1,
      pageSize: 5,
      status: 'ongoing'
    });
    console.log('活动列表结果:', listResult.list.length, '个活动');
    
    // 测试获取活动详情
    console.log('\n测试获取活动详情:');
    const detailResult = await activityAPI.getActivityDetail('1');
    console.log('活动详情结果:', detailResult?.title);
    
    console.log('\n✅ API接口测试完成');
    console.log('\n🎉 测试运行成功！');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error);
    console.error('错误详情:', error.stack);
    process.exit(1);
  }
}

// 运行测试
runAllTests();
