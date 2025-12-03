// 引导配置文件
export const guideConfigs = {
  home: {
    steps: [
      {
        element: '.banner-container',
        intro: '这是活动轮播区，展示重要活动',
        position: 'bottom'
      },
      {
        element: '.layout-section',
        intro: '点击切换布局视图，支持宫格和轮播两种方式',
        position: 'right'
      },
      {
        element: '.activity-content',
        intro: '这是活动卡片列表，展示所有活动',
        position: 'top'
      }
    ],
    options: {
      tooltipPosition: 'auto',
      showButtons: true,
      showProgress: true,
      showBullets: true,
      overlayOpacity: 0.8,
      doneLabel: '完成',
      nextLabel: '下一步',
      prevLabel: '上一步',
      skipLabel: '跳过'
    }
  },
  activities: {
    steps: [
      {
        element: '.filter-section',
        intro: '使用筛选条件查找活动，支持状态、关键词和时间范围筛选',
        position: 'bottom'
      },
      {
        element: '.travel-list',
        intro: '活动列表，展示活动基本信息',
        position: 'top'
      },
      {
        element: '.pagination',
        intro: '分页导航，浏览更多活动',
        position: 'top'
      }
    ],
    options: {
      tooltipPosition: 'auto',
      showButtons: true,
      showProgress: true,
      showBullets: true,
      overlayOpacity: 0.8,
      doneLabel: '完成',
      nextLabel: '下一步',
      prevLabel: '上一步',
      skipLabel: '跳过'
    }
  },
  activityDetail: {
    steps: [
      {
        element: '.activity-header',
        intro: '这是活动基本信息区域',
        position: 'bottom'
      },
      {
        element: '.activity-rules',
        intro: '活动规则说明，详细了解活动要求',
        position: 'bottom'
      }
    ],
    options: {
      tooltipPosition: 'auto',
      showButtons: true,
      showProgress: true,
      showBullets: true,
      overlayOpacity: 0.8,
      doneLabel: '完成',
      nextLabel: '下一步',
      prevLabel: '上一步',
      skipLabel: '跳过'
    }
  }
};

// 获取当前页面的引导配置
export const getCurrentGuideConfig = (path) => {
  if (path === '/') {
    return guideConfigs.home;
  } else if (path.startsWith('/activities')) {
    if (path.match(/\/activities\/\d+/)) {
      return guideConfigs.activityDetail;
    }
    return guideConfigs.activities;
  }
  return null;
};
