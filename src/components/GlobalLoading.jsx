import React from 'react';
import PropTypes from 'prop-types';
// 移除不存在的样式导入

/**
 * 全局加载状态组件
 * 提供统一的加载指示器和加载信息展示
 */
const GlobalLoading = ({ 
  message = '正在加载中...', 
  type = 'spinner', 
  size = 'medium',
  overlay = false,
  className = '' 
}) => {
  // 根据size确定样式类名
  const sizeClass = {
    small: 'global-loading--small',
    medium: 'global-loading--medium',
    large: 'global-loading--large'
  }[size];

  // 根据type渲染不同的加载指示器
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`global-loading__dots ${sizeClass}`}>
            <div className="global-loading__dot"></div>
            <div className="global-loading__dot"></div>
            <div className="global-loading__dot"></div>
          </div>
        );
      case 'bars':
        return (
          <div className={`global-loading__bars ${sizeClass}`}>
            <div className="global-loading__bar"></div>
            <div className="global-loading__bar"></div>
            <div className="global-loading__bar"></div>
          </div>
        );
      case 'spinner':
      default:
        return (
          <div className={`global-loading__spinner ${sizeClass}`}></div>
        );
    }
  };

  if (overlay) {
    // 全屏覆盖模式
    return (
      <div className={`global-loading-overlay ${className}`}>
        <div className={`global-loading-container ${sizeClass}`}>
          {renderLoader()}
          {message && (
            <p className="global-loading__message">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // 内联模式
  return (
    <div className={`global-loading ${sizeClass} ${className}`}>
      {renderLoader()}
      {message && (
        <p className="global-loading__message">{message}</p>
      )}
    </div>
  );
};

GlobalLoading.propTypes = {
  // 加载提示文本
  message: PropTypes.string,
  // 加载指示器类型: spinner (默认), dots, bars
  type: PropTypes.oneOf(['spinner', 'dots', 'bars']),
  // 加载指示器大小: small, medium (默认), large
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  // 是否使用全屏覆盖
  overlay: PropTypes.bool,
  // 自定义CSS类名
  className: PropTypes.string
};

export default GlobalLoading;