import React from 'react';
import PropTypes from 'prop-types';
import ActivityCard from './ActivityCard';
import './styles.css';

/**
 * 普通活动卡片组件
 * 继承自ActivityCard，添加普通活动特有的信息展示
 */
const NormalCard = ({ activity, className }) => {
  // 根据活动类型获取图标
  const getActivityTypeIcon = (type) => {
    const iconMap = {
      conference: '🎤',
      workshop: '🛠️',
      exhibition: '🎨',
      performance: '🎭',
      competition: '🏆',
      meetup: '👥'
    };
    return iconMap[type] || '📅';
  };

  // 根据活动类型获取文本
  const getActivityTypeText = (type) => {
    const typeMap = {
      conference: '研讨会',
      workshop: '工作坊',
      exhibition: '展览',
      performance: '演出',
      competition: '比赛',
      meetup: '交流会'
    };
    return typeMap[type] || '活动';
  };

  // 格式化地点显示
  const formatLocation = (location) => {
    if (!location) return '地点待定';
    return location.length > 20 
      ? `${location.substring(0, 20)}...` 
      : location;
  };

  return (
    <ActivityCard 
      activity={activity} 
      className={`normal-card ${className || ''}`}
    >
      {/* 活动类型 */}
      <div className="normal-card__type">
        <span className="normal-card__type-icon">
          {getActivityTypeIcon(activity?.activityType)}
        </span>
        <span className="normal-card__type-text">
          {getActivityTypeText(activity?.activityType)}
        </span>
      </div>

      {/* 活动地点 */}
      {activity?.location && (
        <div className="normal-card__location">
          <span className="normal-card__location-icon">📍</span>
          <span className="normal-card__location-text">
            {formatLocation(activity.location)}
          </span>
        </div>
      )}

      {/* 参与人数 */}
      {(activity?.attendees || activity?.viewers) && (
        <div className="normal-card__stats">
          {activity?.attendees && (
            <span className="normal-card__stat-item">
              <span className="normal-card__stat-icon">👥</span>
              <span className="normal-card__stat-value">
                {activity.attendees}人参与
              </span>
            </span>
          )}
          {activity?.viewers && (
            <span className="normal-card__stat-item">
              <span className="normal-card__stat-icon">👁️</span>
              <span className="normal-card__stat-value">
                {activity.viewers}人观看
              </span>
            </span>
          )}
        </div>
      )}

      {/* 活动标签 */}
      {activity?.tags && activity.tags.length > 0 && (
        <div className="normal-card__tags">
          {activity.tags.map((tag, index) => (
            <span key={index} className="normal-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 主办方信息 */}
      {activity?.organizer && (
        <div className="normal-card__organizer">
          <span className="normal-card__organizer-label">主办方：</span>
          <span className="normal-card__organizer-name">
            {activity.organizer}
          </span>
        </div>
      )}
    </ActivityCard>
  );
};

NormalCard.propTypes = {
  /**
   * 活动数据对象
   */
  activity: PropTypes.shape({
    // 基础属性（继承自ActivityCard）
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    status: PropTypes.oneOf(['active', 'upcoming', 'ended']),
    // 普通活动特有属性
    activityType: PropTypes.oneOf(['conference', 'workshop', 'exhibition', 'performance', 'competition', 'meetup']),
    location: PropTypes.string,
    attendees: PropTypes.number,
    viewers: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    organizer: PropTypes.string
  }).isRequired,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string
};

export default NormalCard;