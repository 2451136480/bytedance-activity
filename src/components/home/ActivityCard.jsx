import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * 基础活动卡片组件
 * 提供统一的卡片接口，根据活动类型渲染不同的卡片样式
 */
const ActivityCard = ({ 
  activity, 
  onClick,
  className = '',
  style = {},
  variant = 'default',
  showStatus = true,
  showTime = true,
  showParticipants = true,
  customCardRenderer = null
}) => {
  const navigate = useNavigate();

  // 处理卡片点击
  const handleCardClick = () => {
    if (onClick) {
      onClick(activity);
    } else if (activity.id) {
      // 默认跳转到活动详情页
      navigate(`/activity/${activity.id}`);
    }
  };

  // 获取状态样式
  const getStatusStyle = (status) => {
    const statusStyles = {
      active: {
        backgroundColor: 'var(--success-color, #51cf66)',
        color: 'white'
      },
      upcoming: {
        backgroundColor: 'var(--info-color, #339af0)',
        color: 'white'
      },
      ended: {
        backgroundColor: 'var(--text-tertiary, #999999)',
        color: 'white'
      }
    };
    return statusStyles[status] || statusStyles.active;
  };

  // 获取活动类型标签
  const getActivityTypeLabel = (type) => {
    const typeLabels = {
      promotion: '促销',
      normal: '活动',
      conference: '会议',
      exhibition: '展览',
      workshop: '工作坊'
    };
    return typeLabels[type] || '活动';
  };

  // 格式化时间
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 自定义卡片渲染器
  if (customCardRenderer) {
    return customCardRenderer(activity, handleCardClick);
  }

  // 根据活动类型选择不同的卡片样式
  if (activity.type === 'promotion') {
    return <PromotionCard activity={activity} onClick={handleCardClick} />;
  }

  return (
    <div 
      className={`activity-card activity-card--normal ${className}`}
      onClick={handleCardClick}
      style={{
        backgroundColor: 'var(--bg-primary, #ffffff)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-light, 0 2px 8px rgba(0, 0, 0, 0.1))',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover, 0 6px 24px rgba(0, 0, 0, 0.2))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-light, 0 2px 8px rgba(0, 0, 0, 0.1))';
      }}
    >
      {/* 卡片图片 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        overflow: 'hidden'
      }}>
        <img 
          src={activity.coverImage || '/placeholder-activity.svg'}
          alt={activity.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onError={(e) => {
            e.target.src = '/placeholder-activity.svg';
          }}
        />
        
        {/* 状态标签 */}
        {showStatus && activity.status && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            ...getStatusStyle(activity.status)
          }}>
            {activity.status === 'active' ? '进行中' : 
             activity.status === 'upcoming' ? '即将开始' : '已结束'}
          </div>
        )}

        {/* 活动类型标签 */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {getActivityTypeLabel(activity.type)}
        </div>
      </div>

      {/* 卡片内容 */}
      <div style={{
        padding: '16px'
      }}>
        {/* 标题 */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text-primary, #292f36)',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {activity.title}
        </h3>

        {/* 描述 */}
        {activity.description && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary, #6d6d6d)',
            lineHeight: '1.5',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {activity.description}
          </p>
        )}

        {/* 时间信息 */}
        {showTime && activity.startTime && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            fontSize: '13px',
            color: 'var(--text-secondary, #6d6d6d)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span>{formatDateTime(activity.startTime)}</span>
          </div>
        )}

        {/* 参与人数和位置 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary, #6d6d6d)'
        }}>
          {showParticipants && activity.participantCount !== undefined && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              {activity.participantCount}人参与
            </span>
          )}
          
          {activity.location && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {activity.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// 促销卡片组件
const PromotionCard = ({ activity, onClick }) => {
  return (
    <div 
      className="activity-card activity-card--promotion"
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-primary, #ffffff)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-medium, 0 4px 16px rgba(0, 0, 0, 0.15))',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        border: '2px solid var(--accent-color, #ffd166)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl, 0 20px 25px rgba(0, 0, 0, 0.1))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-medium, 0 4px 16px rgba(0, 0, 0, 0.15))';
      }}
    >
      {/* 促销标识 */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, var(--accent-color, #ffd166), var(--primary-color, #ff6b6b))',
        zIndex: 2
      }}></div>

      {/* 促销标签 */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: 'var(--accent-color, #ffd166)',
        color: 'var(--text-primary, #292f36)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(255, 209, 102, 0.4)',
        zIndex: 2
      }}>
        🔥 促销
      </div>

      {/* 卡片图片 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        overflow: 'hidden'
      }}>
        <img 
          src={activity.coverImage || '/placeholder-activity.svg'}
          alt={activity.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onError={(e) => {
            e.target.src = '/placeholder-activity.svg';
          }}
        />
      </div>

      {/* 促销内容 */}
      <div style={{
        padding: '16px'
      }}>
        {/* 标题 */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--text-primary, #292f36)',
          marginBottom: '8px',
          lineHeight: '1.4'
        }}>
          {activity.title}
        </h3>

        {/* 折扣信息 */}
        {activity.discount && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--error-color, #fa5252)'
            }}>
              {typeof activity.discount === 'number' ? `${activity.discount}折` : activity.discount}
            </span>
            {activity.promotionInfo && (
              <span style={{
                fontSize: '14px',
                color: 'var(--text-secondary, #6d6d6d)',
                textDecoration: 'line-through'
              }}>
                {activity.promotionInfo}
              </span>
            )}
          </div>
        )}

        {/* 描述 */}
        {activity.description && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary, #6d6d6d)',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}>
            {activity.description}
          </p>
        )}

        {/* 优惠券信息 */}
        {activity.coupons && activity.coupons.length > 0 && (
          <div style={{
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary, #6d6d6d)',
              marginBottom: '4px'
            }}>
              可用优惠券：
            </div>
            {activity.coupons.slice(0, 2).map((coupon, index) => (
              <div key={index} style={{
                display: 'inline-block',
                backgroundColor: 'var(--bg-secondary, #f8f9fa)',
                color: 'var(--primary-color, #ff6b6b)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '11px',
                marginRight: '4px',
                marginBottom: '4px',
                border: '1px solid var(--primary-color, #ff6b6b)'
              }}>
                {coupon.value}
              </div>
            ))}
          </div>
        )}

        {/* 参与人数 */}
        {activity.participants !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-secondary, #6d6d6d)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <span>{activity.participants}人已参与</span>
          </div>
        )}
      </div>
    </div>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    status: PropTypes.oneOf(['active', 'upcoming', 'ended']),
    type: PropTypes.oneOf(['normal', 'promotion']),
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    participantCount: PropTypes.number,
    participants: PropTypes.number,
    location: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    organizer: PropTypes.string,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    promotionInfo: PropTypes.string,
    coupons: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      condition: PropTypes.string
    }))
  }).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
  showStatus: PropTypes.bool,
  showTime: PropTypes.bool,
  showParticipants: PropTypes.bool,
  customCardRenderer: PropTypes.func
};

export default ActivityCard;