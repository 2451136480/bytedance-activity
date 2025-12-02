import React from 'react';

/**
 * 加载状态包装器组件
 * 提供平滑的加载状态切换动画
 */
const LoadingWrapper = ({ loading, skeleton, children, transitionDuration = 300 }) => {
  const [showContent, setShowContent] = React.useState(!loading);
  const [showSkeleton, setShowSkeleton] = React.useState(loading);

  React.useEffect(() => {
    if (loading) {
      // 开始加载时，先显示骨架屏，然后延迟隐藏内容
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowContent(false);
      }, transitionDuration / 2);
      return () => clearTimeout(timer);
    } else {
      // 加载完成时，先显示内容，然后延迟隐藏骨架屏
      setShowContent(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, transitionDuration);
      return () => clearTimeout(timer);
    }
  }, [loading, transitionDuration]);

  return (
    <div className="loading-wrapper">
      <div className={`content-container ${showContent ? 'visible' : 'hidden'}`}>
        {children}
      </div>
      <div className={`skeleton-container ${showSkeleton ? 'visible' : 'hidden'}`}>
        {skeleton}
      </div>
      
      <style jsx>{`
        .loading-wrapper {
          position: relative;
          width: 100%;
        }
        
        .content-container,
        .skeleton-container {
          transition: opacity ${transitionDuration}ms ease-in-out;
        }
        
        .content-container.visible,
        .skeleton-container.visible {
          opacity: 1;
        }
        
        .content-container.hidden,
        .skeleton-container.hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        .skeleton-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
        }
        
        .content-container {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default LoadingWrapper;