import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './styles.css';

/**
 * 基础活动卡片组件
 * 展示活动基本信息，支持点击跳转详情页
 */
const ActivityCard = ({ activity, className, children }) => {
  const navigate = useNavigate();

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return '时间待定';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '时间格式错误';
    }
  };

  // 根据状态获取标签样式
  const getStatusBadgeClass = (status) => {
    return `activity-card__status ${status || ''}`;
  };

  // 根据状态获取显示文本
  const getStatusText = (status) => {
    const statusMap = {
      active: '进行中',
      upcoming: '即将开始',
      ended: '已结束'
    };
    return statusMap[status] || '未知状态';
  };

  // 处理卡片点击，跳转到详情页
  const handleCardClick = (e) => {
    if (activity?.id) {
      navigate(`/activities/${activity.id}`);
    }
  };

  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.src = '/placeholder-activity.svg';
    e.target.style.objectFit = 'contain';
  };

  return (
    <div 
      className={`activity-card ${className || ''}`}
      onClick={handleCardClick}
    >
      {/* 活动图片 */}
      <div className="activity-card__image-container">
        <img 
          className="activity-card__image"
          src={activity?.coverImage || '/placeholder-activity.svg'}
          alt={activity?.title || '活动图片'}
          onError={handleImageError}
          loading="lazy"
        />
        {/* 状态标签 */}
        <div className={getStatusBadgeClass(activity?.status)}>
          {getStatusText(activity?.status)}
        </div>
      </div>

      {/* 活动内容 */}
      <div className="activity-card__content">
        {/* 活动标题 */}
        <h3 className="activity-card__title">
          {activity?.title || '未命名活动'}
        </h3>
        
        {/* 活动描述 */}
        <p className="activity-card__description">
          {activity?.description || '暂无活动描述'}
        </p>
        
        {/* 活动时间 */}
        <div className="activity-card__time">
          <span className="activity-card__time-icon">⏰</span>
          <span className="activity-card__time-text">
            {formatDate(activity?.startTime)} - {formatDate(activity?.endTime)}
          </span>
        </div>
        
        {/* 子组件内容 */}
        {children}
      </div>
    </div>
  );
};

ActivityCard.propTypes = {
  /**
   * 活动数据对象
   */
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    status: PropTypes.oneOf(['active', 'upcoming', 'ended'])
  }).isRequired,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string,
  
  /**
   * 子组件内容
   */
  children: PropTypes.node
};

export default ActivityCard;