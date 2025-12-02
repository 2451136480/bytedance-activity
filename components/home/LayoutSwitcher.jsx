import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

/**
 * 布局切换控制器组件
 * 用于在宫格布局和轮播布局之间切换
 */
const LayoutSwitcher = ({ currentLayout, onLayoutChange, className }) => {
  // 处理布局切换
  const handleLayoutSwitch = (layoutType) => {
    if (currentLayout !== layoutType && onLayoutChange) {
      onLayoutChange(layoutType);
    }
  };

  return (
    <div className={`layout-switcher ${className || ''}`}>
      <div className="layout-switcher__container">
        {/* 宫格布局按钮 */}
        <button 
          className={`layout-switcher__button layout-switcher__button--grid ${currentLayout === 'grid' ? 'active' : ''}`}
          onClick={() => handleLayoutSwitch('grid')}
          aria-label="宫格布局"
          aria-pressed={currentLayout === 'grid'}
        >
          <span className="layout-switcher__icon">📊</span>
          <span className="layout-switcher__text">宫格</span>
        </button>
        
        {/* 轮播布局按钮 */}
        <button 
          className={`layout-switcher__button layout-switcher__button--carousel ${currentLayout === 'carousel' ? 'active' : ''}`}
          onClick={() => handleLayoutSwitch('carousel')}
          aria-label="轮播布局"
          aria-pressed={currentLayout === 'carousel'}
        >
          <span className="layout-switcher__icon">🎠</span>
          <span className="layout-switcher__text">轮播</span>
        </button>
      </div>
    </div>
  );
};

LayoutSwitcher.propTypes = {
  /**
   * 当前选中的布局类型
   */
  currentLayout: PropTypes.oneOf(['grid', 'carousel']).isRequired,
  
  /**
   * 布局切换回调函数
   */
  onLayoutChange: PropTypes.func.isRequired,
  
  /**
   * 自定义CSS类名
   */
  className: PropTypes.string
};

export default LayoutSwitcher;