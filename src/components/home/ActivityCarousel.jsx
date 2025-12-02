import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ActivityCard from './ActivityCard';

/**
 * 活动轮播布局组件
 * 支持自动轮播、手动切换、指示器显示等功能
 */
const ActivityCarousel = ({
  activities = [],
  loading = false,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showControls = true,
  className = '',
  style = {},
  onActivityClick,
  renderEmptyState,
  renderLoadingState,
  ...cardProps
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 轮播逻辑
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activities.length - 1 ? 0 : prevIndex + 1
    );
  }, [activities.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activities.length - 1 : prevIndex - 1
    );
  }, [activities.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // 自动轮播
  useEffect(() => {
    if (autoPlay && activities.length > 1 && !isPaused) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, activities.length, interval, isPaused, nextSlide]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // 默认空状态
  const defaultEmptyState = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      color: 'var(--text-secondary, #6d6d6d)',
      minHeight: '300px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '16px',
        opacity: 0.5
      }}>🎪</div>
      <h3 style={{
        color: 'var(--text-primary, #292f36)',
        marginBottom: '8px',
        fontSize: '18px'
      }}>暂无轮播活动</h3>
      <p>当前没有可展示的活动，请稍后再试</p>
    </div>
  );

  // 默认加载状态
  const defaultLoadingState = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      minHeight: '300px'
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

  // 渲染单个活动卡片
  const renderActivityCard = (activity, index) => {
    const isActive = index === currentIndex;
    const isPrev = index === (currentIndex === 0 ? activities.length - 1 : currentIndex - 1);
    const isNext = index === (currentIndex === activities.length - 1 ? 0 : currentIndex + 1);

    let transform = 'translateX(100%)';
    let opacity = 0;
    let zIndex = 1;

    if (isActive) {
      transform = 'translateX(0)';
      opacity = 1;
      zIndex = 3;
    } else if (isPrev) {
      transform = 'translateX(-100%)';
      opacity = 0.3;
      zIndex = 2;
    } else if (isNext) {
      transform = 'translateX(100%)';
      opacity = 0.3;
      zIndex = 2;
    }

    return (
      <div
        key={activity.id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform,
          opacity,
          zIndex,
          transition: 'all 0.5s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: '90%',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <ActivityCard
            activity={activity}
            onClick={() => handleActivityClick(activity)}
            style={{
              transform: isActive ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.5s ease-in-out'
            }}
            {...cardProps}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`activity-carousel ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        background: 'rgba(13, 27, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '20px',
        padding: '24px 0',
        boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.3)',
        ...style
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {loading ? (
        renderLoadingState ? renderLoadingState() : defaultLoadingState()
      ) : activities.length === 0 ? (
        renderEmptyState ? renderEmptyState() : defaultEmptyState()
      ) : (
        <>
          {/* 轮播内容 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '350px'
          }}>
            {activities.map((activity, index) => renderActivityCard(activity, index))}
          </div>

          {/* 指示器 */}
          {showIndicators && activities.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {activities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentIndex
                      ? 'var(--primary-color, #ff6b6b)'
                      : 'var(--text-tertiary, #999999)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentIndex) {
                      e.target.style.backgroundColor = 'var(--primary-hover, #40a9ff)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentIndex) {
                      e.target.style.backgroundColor = 'var(--text-tertiary, #999999)';
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* 控制按钮 */}
          {showControls && activities.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  zIndex: 10,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                }}
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  zIndex: 10,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                }}
              >
                ›
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

ActivityCarousel.propTypes = {
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
    organizer: PropTypes.string,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    promotionInfo: PropTypes.string,
    coupons: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      condition: PropTypes.string
    })),
    participants: PropTypes.number
  })),
  loading: PropTypes.bool,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showIndicators: PropTypes.bool,
  showControls: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  onActivityClick: PropTypes.func,
  renderEmptyState: PropTypes.func,
  renderLoadingState: PropTypes.func
};

export default ActivityCarousel;