import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import NormalCard from './NormalCard';
import PromotionCard from './PromotionCard';
import './styles.css';

/**
 * 活动轮播布局组件
 * 用于以轮播形式展示活动卡片
 */
const ActivityCarousel = ({ 
  activities = [], 
  autoplay = true, 
  interval = 5000, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);

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
      return <PromotionCard key={activity.id} activity={activity} className="activity-carousel__card" />;
    } else {
      return <NormalCard key={activity.id} activity={activity} className="activity-carousel__card" />;
    }
  };

  // 下一个活动
  const nextActivity = () => {
    if (isTransitioning || activities.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activities.length);
  };

  // 上一个活动
  const prevActivity = () => {
    if (isTransitioning || activities.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? activities.length - 1 : prevIndex - 1
    );
  };

  // 跳转到指定活动
  const goToActivity = (index) => {
    if (isTransitioning || index === currentIndex || activities.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // 自动播放
  useEffect(() => {
    if (!autoplay || activities.length <= 1) return;

    autoplayRef.current = setInterval(nextActivity, interval);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, interval, activities.length, isTransitioning]);

  // 过渡结束处理
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  // 空状态显示
  if (!activities || activities.length === 0) {
    return (
      <div className={`activity-carousel activity-carousel--empty ${className || ''}`}>
        <div className="activity-carousel__empty-state">
          <div className="activity-carousel__empty-icon">📅</div>
          <p className="activity-carousel__empty-text">暂无活动数据</p>
        </div>
      </div>
    );
  }

  // 单活动显示（不轮播）
  if (activities.length === 1) {
    return (
      <div className={`activity-carousel activity-carousel--single ${className || ''}`}>
        <div className="activity-carousel__slides">
          <div className="activity-carousel__slide">
            {renderActivityCard(activities[0])}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`activity-carousel ${className || ''}`}>
      {/* 轮播容器 */}
      <div 
        className="activity-carousel__container"
        ref={containerRef}
      >
        {/* 轮播轨道 */}
        <div 
          className="activity-carousel__slides"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {activities.map((activity) => (
            <div key={activity?.id} className="activity-carousel__slide">
              {renderActivityCard(activity)}
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        <button 
          className="activity-carousel__nav-button activity-carousel__nav-button--prev"
          onClick={prevActivity}
          disabled={isTransitioning}
          aria-label="上一个活动"
        >
          ❮
        </button>
        <button 
          className="activity-carousel__nav-button activity-carousel__nav-button--next"
          onClick={nextActivity}
          disabled={isTransitioning}
          aria-label="下一个活动"
        >
          ❯
        </button>
      </div>

      {/* 指示器 */}
      <div className="activity-carousel__indicators">
        {activities.map((_, index) => (
          <button
            key={index}
            className={`activity-carousel__indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToActivity(index)}
            disabled={isTransitioning}
            aria-label={`跳转到活动 ${index + 1}`}
          >
            {index === currentIndex ? '●' : '○'}
          </button>
        ))}
      </div>
    </div>
  );
};

ActivityCarousel.propTypes = {
  /**
   * 活动数据数组
   */
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['normal', 'promotion']),
      // 其他活动属性将由具体卡片组件验证
    })
  ).isRequired,
  
  /**
   * 是否自动播放
   */
  autoplay: PropTypes.bool,
  
  /**
   * 自动播放间隔时间（毫秒）
   */
  interval: PropTypes.number,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string
};

export default ActivityCarousel;