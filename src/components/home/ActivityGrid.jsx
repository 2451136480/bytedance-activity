import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActivityCard from './ActivityCard';

/**
 * 活动网格布局组件
 * 支持响应式网格布局，自动适配不同屏幕尺寸
 */
const ActivityGrid = ({ 
  activities = [], 
  loading = false, 
  columns = 'auto',
  gap = '24px',
  className = '',
  style = {},
  onActivityClick,
  renderEmptyState,
  renderLoadingState,
  ...cardProps 
}) => {
  const [gridColumns, setGridColumns] = useState(() => {
    if (columns === 'auto') {
      return getAutoColumns(window.innerWidth);
    }
    return columns;
  });

  // 监听窗口大小变化，自动调整列数
  useEffect(() => {
    if (columns === 'auto') {
      const handleResize = () => {
        setGridColumns(getAutoColumns(window.innerWidth));
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [columns]);

  // 计算自动列数
  function getAutoColumns(width) {
    if (width >= 1200) return 4; // 大屏幕
    if (width >= 992) return 3;  // 中等屏幕
    if (width >= 768) return 2;  // 平板
    return 1; // 手机
  }

  // 默认空状态
  const defaultEmptyState = () => (
    <div style={{
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      color: 'var(--text-secondary, #6d6d6d)'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '16px',
        opacity: 0.5
      }}>📋</div>
      <h3 style={{
        color: 'var(--text-primary, #292f36)',
        marginBottom: '8px',
        fontSize: '18px'
      }}>暂无活动</h3>
      <p>当前没有可展示的活动，请稍后再试</p>
    </div>
  );

  // 默认加载状态
  const defaultLoadingState = () => (
    <div style={{
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--border-color, #e1e4e8)',
        borderTop: '3px solid var(--primary-color, #ff6b6b)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }}></div>
      <p style={{
        color: 'var(--text-secondary, #6d6d6d)'
      }}>正在加载活动...</p>
    </div>
  );

  // 处理活动点击
  const handleActivityClick = (activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  return (
    <div 
      className={`activity-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: gap,
        width: '100%',
        ...style
      }}
    >
      {loading ? (
        renderLoadingState ? renderLoadingState() : defaultLoadingState()
      ) : activities.length === 0 ? (
        renderEmptyState ? renderEmptyState() : defaultEmptyState()
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={() => handleActivityClick(activity)}
            {...cardProps}
          />
        ))
      )}
    </div>
  );
};

ActivityGrid.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    status: PropTypes.oneOf(['active', 'upcoming', 'ended']),
    type: PropTypes.oneOf(['normal', 'promotion']),
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    participantCount: PropTypes.number,
    location: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    organizer: PropTypes.string
  })),
  loading: PropTypes.bool,
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['auto'])
  ]),
  gap: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onActivityClick: PropTypes.func,
  renderEmptyState: PropTypes.func,
  renderLoadingState: PropTypes.func
};

export default ActivityGrid;