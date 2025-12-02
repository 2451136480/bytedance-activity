import React from 'react';
import PropTypes from 'prop-types';

/**
 * 布局切换器组件
 * 支持宫格布局和轮播布局之间的切换
 */
const LayoutSwitcher = ({ currentLayout, onLayoutChange, className = '', style = {} }) => {
  const layouts = [
    {
      key: 'grid',
      label: '宫格布局',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      ),
      description: '以网格形式展示活动卡片'
    },
    {
      key: 'carousel',
      label: '轮播布局',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="4" width="12" height="8" rx="1" />
          <circle cx="4" cy="8" r="1" />
          <circle cx="12" cy="8" r="1" />
        </svg>
      ),
      description: '以轮播形式展示活动卡片'
    }
  ];

  const handleLayoutChange = (layoutKey) => {
    if (onLayoutChange && layoutKey !== currentLayout) {
      onLayoutChange(layoutKey);
    }
  };

  return (
    <div
      className={`layout-switcher ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        ...style
      }}
    >
      <span style={{
        fontSize: '16px',
        fontWeight: '800',
        color: '#ffffff',
        marginRight: '8px',
        textShadow: '0 0 12px rgba(255, 255, 255, 0.8), 0 0 24px rgba(59, 130, 246, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)',
        letterSpacing: '0.5px'
      }}>
        布局模式：
      </span>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {layouts.map((layout) => (
          <button
            key={layout.key}
            onClick={() => handleLayoutChange(layout.key)}
            title={layout.description}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: '1px solid',
              borderColor: currentLayout === layout.key
                ? 'rgba(255, 255, 255, 0.4)'
                : 'rgba(255, 255, 255, 0.2)',
              background: currentLayout === layout.key
                ? 'rgba(255, 255, 255, 0.25)'
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#ffffff',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: currentLayout === layout.key ? '900' : '700',
              transition: 'all 0.3s ease',
              minWidth: 'fit-content',
              textShadow: currentLayout === layout.key
                ? '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4)'
                : '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(59, 130, 246, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
              boxShadow: currentLayout === layout.key
                ? '0 0 20px rgba(59, 130, 246, 0.6), 0 4px 16px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                : '0 2px 8px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (currentLayout !== layout.key) {
                e.target.style.background = 'rgba(255, 255, 255, 0.18)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                e.target.style.boxShadow = '0 4px 16px 0 rgba(59, 130, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentLayout !== layout.key) {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            {layout.icon}
            <span>{layout.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

LayoutSwitcher.propTypes = {
  currentLayout: PropTypes.oneOf(['grid', 'carousel']).isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default LayoutSwitcher;