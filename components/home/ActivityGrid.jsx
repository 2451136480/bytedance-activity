import React from 'react';
import PropTypes from 'prop-types';
import NormalCard from './NormalCard';
import PromotionCard from './PromotionCard';
import './styles.css';

/**
 * 活动宫格布局组件
 * 用于以网格形式展示多个活动卡片
 */
const ActivityGrid = ({ 
  activities, 
  columns = 3, 
  gap = 20, 
  className 
}) => {
  // 判断活动是否为促销活动
  const isPromotionActivity = (activity) => {
    return activity?.type === 'promotion' || 
           activity?.discount !== undefined || 
           activity?.coupons !== undefined;
  };

  // 渲染活动卡片
  const renderActivityCard = (activity) => {
    if (!activity?.id) return null;

    if (isPromotionActivity(activity)) {
      return <PromotionCard key={activity.id} activity={activity} />;
    } else {
      return <NormalCard key={activity.id} activity={activity} />;
    }
  };

  // 设置网格样式
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%'
  };

  // 空状态显示
  if (!activities || activities.length === 0) {
    return (
      <div className={`activity-grid activity-grid--empty ${className || ''}`}>
        <div className="activity-grid__empty-state">
          <div className="activity-grid__empty-icon">📅</div>
          <p className="activity-grid__empty-text">暂无活动数据</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`activity-grid ${className || ''}`}
      style={gridStyle}
    >
      {activities.map(renderActivityCard)}
    </div>
  );
};

ActivityGrid.propTypes = {
  /**
   * 活动数据数组
   */
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['normal', 'promotion']),
      // 其他活动属性将由具体卡片组件验证
    })
  ),
  
  /**
   * 网格列数
   */
  columns: PropTypes.number,
  
  /**
   * 卡片间距（像素）
   */
  gap: PropTypes.number,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string
};

export default ActivityGrid;