import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActivityCard from './ActivityCard';
import './styles.css';

/**
 * 促销活动卡片组件
 * 继承自ActivityCard，添加促销活动特有的信息展示
 */
const PromotionCard = ({ activity, className }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // 计算倒计时
  useEffect(() => {
    if (!activity?.endTime || activity?.status === 'ended') return;

    const calculateTimeLeft = () => {
      const difference = new Date(activity.endTime) - new Date();
      let timeLeft = '';

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / 1000 / 60 / 60) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (days > 0) {
          timeLeft = `${days}天 ${hours}时 ${minutes}分`;
        } else if (hours > 0) {
          timeLeft = `${hours}时 ${minutes}分 ${seconds}秒`;
        } else {
          timeLeft = `${minutes}分 ${seconds}秒`;
        }
      } else {
        timeLeft = '已结束';
      }

      setTimeLeft(timeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activity?.endTime, activity?.status]);

  // 格式化折扣信息
  const formatDiscount = (discount) => {
    if (!discount) return '';
    
    if (typeof discount === 'number') {
      return `${discount}折`;
    } else if (typeof discount === 'string') {
      return discount.includes('折') ? discount : `${discount}折`;
    }
    
    return '';
  };

  return (
    <ActivityCard 
      activity={activity} 
      className={`promotion-card ${className || ''}`}
    >
      {/* 折扣标签 */}
      {activity?.discount && (
        <div className="promotion-card__discount">
          <span className="promotion-card__discount-badge">
            {formatDiscount(activity.discount)}
          </span>
        </div>
      )}

      {/* 促销信息 */}
      {activity?.promotionInfo && (
        <div className="promotion-card__info">
          <span className="promotion-card__info-text">
            {activity.promotionInfo}
          </span>
        </div>
      )}

      {/* 优惠券信息 */}
      {activity?.coupons && activity.coupons.length > 0 && (
        <div className="promotion-card__coupons">
          {activity.coupons.slice(0, 2).map((coupon, index) => (
            <div key={index} className="promotion-card__coupon">
              <span className="promotion-card__coupon-value">{coupon.value}</span>
              <span className="promotion-card__coupon-condition">{coupon.condition || ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* 倒计时 */}
      {activity?.status === 'active' && activity?.endTime && (
        <div className="promotion-card__countdown">
          <span className="promotion-card__countdown-label">距结束：</span>
          <span className="promotion-card__countdown-time">{timeLeft}</span>
        </div>
      )}

      {/* 参与人数 */}
      {activity?.participants && (
        <div className="promotion-card__participants">
          <span className="promotion-card__participants-icon">👥</span>
          <span className="promotion-card__participants-count">
            已有{activity.participants}人参与
          </span>
        </div>
      )}
    </ActivityCard>
  );
};

PromotionCard.propTypes = {
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
    // 促销活动特有属性
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    promotionInfo: PropTypes.string,
    coupons: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        condition: PropTypes.string
      })
    ),
    participants: PropTypes.number
  }).isRequired,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string
};

export default PromotionCard;