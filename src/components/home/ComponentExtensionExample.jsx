// 组件扩展示例 - 展示如何使用组件扩展管理器注册和使用自定义组件
// 这个文件提供了扩展系统的使用示例，开发者可以参考此文件来添加新的组件类型

import React from 'react';
import PropTypes from 'prop-types';
import ComponentExtensionManager from './ComponentExtensionManager';

/**
 * 示例：创建一个自定义的VIP活动卡片组件
 */
const VIPActivityCard = ({ activity, ...props }) => {
  return (
    <div className="activity-card activity-card--vip" {...props}>
      <div className="activity-card__vip-badge">VIP专享</div>
      <div className="activity-card__image-container">
        <img 
          src={activity.imageUrl} 
          alt={activity.title} 
          className="activity-card__image"
        />
      </div>
      <div className="activity-card__content">
        <h3 className="activity-card__title">{activity.title}</h3>
        <div className="activity-card__vip-info">
          <span className="activity-card__vip-level">VIP{activity.vipLevel || '1'}</span>
          <span className="activity-card__reward">奖励: {activity.reward || '专属礼包'}</span>
        </div>
        <div className="activity-card__meta">
          <span className={`activity-card__status activity-card__status--${activity.status}`}>
            {activity.status === 'ongoing' ? '进行中' : '即将开始'}
          </span>
          <span className="activity-card__time">
            {new Date(activity.startTime).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

VIPActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    status: PropTypes.oneOf(['ongoing', 'upcoming', 'ended']),
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string,
    imageUrl: PropTypes.string,
    vipLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reward: PropTypes.string,
  }).isRequired,
};

/**
 * 示例：创建一个自定义的网格布局组件
 */
const CustomGridLayout = ({ children, columns = 3, ...props }) => {
  return (
    <div 
      className="custom-grid-layout" 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '20px',
        padding: '20px',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

CustomGridLayout.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.number,
};

/**
 * 组件扩展注册器 - 在应用启动时注册自定义组件
 */
const registerCustomComponents = () => {
  // 注册VIP活动卡片组件
  ComponentExtensionManager.registerActivityCard(
    'vip', // 自定义类型标识符
    VIPActivityCard, // 组件
    {
      priority: 100, // 优先级
      displayName: 'VIP活动卡片',
      description: '专用于展示VIP专享活动',
      // 自定义配置项
      config: {
        showBadge: true,
        enableHoverEffect: true,
      },
    }
  );
  
  // 注册自定义网格布局组件
  ComponentExtensionManager.registerLayout(
    'customGrid', // 自定义类型标识符
    CustomGridLayout, // 组件
    {
      priority: 50,
      displayName: '自定义网格布局',
      description: '支持自定义列数的网格布局',
      defaultConfig: {
        columns: 4,
      },
    }
  );
  
  console.log('✅ 自定义组件注册完成');
  
  // 获取注册信息示例
  const registryInfo = ComponentExtensionManager.getRegistryInfo();
  console.log('组件注册表信息:', registryInfo);
};

/**
 * 演示如何使用扩展组件
 * @param {Object} activity - 活动数据
 */
const renderExtendedActivityCard = (activity) => {
  // 使用组件工厂创建卡片
  return ComponentExtensionManager.createActivityCard(activity.type, {
    activity,
    onClick: () => console.log('点击了活动:', activity.id),
  });
};

/**
 * 组件扩展使用示例
 */
const ComponentExtensionDemo = () => {
  // 在实际应用中，这应该在应用初始化时调用一次
  React.useEffect(() => {
    registerCustomComponents();
  }, []);

  // 模拟VIP活动数据
  const vipActivity = {
    id: 'vip-001',
    title: 'VIP会员专享活动',
    type: 'vip',
    status: 'ongoing',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: '/vip-activity.jpg',
    vipLevel: 3,
    reward: '高级会员礼包',
  };

  return (
    <div className="component-extension-demo">
      <h2>组件扩展示例</h2>
      
      <div className="demo-section">
        <h3>1. 如何注册自定义组件</h3>
        <pre className="demo-code">
          {`// 注册VIP活动卡片示例
ComponentExtensionManager.registerActivityCard(
  'vip',
  VIPActivityCard,
  {
    priority: 100,
    displayName: 'VIP活动卡片',
    config: { showBadge: true }
  }
);

// 注册自定义布局示例
ComponentExtensionManager.registerLayout(
  'customGrid',
  CustomGridLayout,
  {
    priority: 50,
    defaultConfig: { columns: 4 }
  }
);`}
        </pre>
      </div>

      <div className="demo-section">
        <h3>2. 如何使用扩展组件</h3>
        <pre className="demo-code">
          {`// 使用组件工厂创建卡片
const card = ComponentExtensionManager.createActivityCard(
  activity.type, 
  { activity, onClick: handleClick }
);

// 检查组件是否已注册
const isVIPCardRegistered = ComponentExtensionManager.isRegistered(
  'activityCards', 
  'vip'
);`}
        </pre>
      </div>

      <div className="demo-section">
        <h3>3. 自定义VIP卡片预览</h3>
        <div className="demo-preview">
          {renderExtendedActivityCard(vipActivity)}
        </div>
      </div>

      <div className="demo-section">
        <h3>4. 组件扩展开发指南</h3>
        <ol className="demo-guide">
          <li>创建新的组件类，确保接收正确的props</li>
          <li>使用PropTypes定义组件属性类型</li>
          <li>调用ComponentExtensionManager.registerActivityCard注册组件</li>
          <li>在活动数据中设置type字段为您的组件类型标识符</li>
          <li>系统会自动根据type字段渲染对应的组件</li>
        </ol>
      </div>
    </div>
  );
};

// 导出注册函数供其他地方调用
export { registerCustomComponents, VIPActivityCard, CustomGridLayout };

// 导出示例组件
export default ComponentExtensionDemo;