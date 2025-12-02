import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 虚拟滚动列表组件
 * 高效渲染大量数据，只渲染可视区域内的元素
 */
const VirtualList = ({
  data = [], // 数据源
  itemHeight = 120, // 预估的单项高度
  bufferSize = 5, // 缓冲区大小，可视区域外额外渲染的项数
  renderItem, // 渲染单项的函数
  className = '', // 自定义类名
  onScroll, // 滚动回调函数
  containerHeight, // 容器高度
  keyExtractor // 生成key的函数
}) => {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [scrollTop, setScrollTop] = useState(0);

  // 计算总高度
  const totalHeight = data.length * itemHeight;

  // 计算可视区域内的项目范围
  const calculateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { start: 0, end: 0 };

    const height = containerHeight || container.clientHeight;
    // 计算第一个可见项的索引
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    // 计算最后一个可见项的索引
    const visibleCount = Math.ceil(height / itemHeight) + bufferSize * 2;
    const end = Math.min(data.length - 1, start + visibleCount);

    return { start, end };
  }, [scrollTop, itemHeight, bufferSize, data.length, containerHeight]);

  // 当滚动位置或数据变化时，重新计算可见范围
  useEffect(() => {
    setVisibleRange(calculateVisibleRange());
  }, [calculateVisibleRange, data.length]);

  // 处理滚动事件
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    
    if (onScroll) {
      onScroll({
        scrollTop: newScrollTop,
        scrollHeight: e.target.scrollHeight,
        clientHeight: e.target.clientHeight,
        // 计算滚动进度（0-1）
        progress: newScrollTop / (e.target.scrollHeight - e.target.clientHeight || 1)
      });
    }
  }, [onScroll]);

  // 渲染可见的项目
  const renderVisibleItems = () => {
    const { start, end } = visibleRange;
    // 计算偏移量
    const offsetY = start * itemHeight;

    // 生成可见项列表
    const visibleItems = [];
    for (let index = start; index <= end && index < data.length; index++) {
      const item = data[index];
      const key = keyExtractor ? keyExtractor(item, index) : index;
      
      visibleItems.push(
        <div
          key={key}
          style={{
            position: 'absolute',
            top: (index - start) * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
            overflow: 'hidden'
          }}
          className="virtual-list-item"
        >
          {renderItem(item, index)}
        </div>
      );
    }

    return (
      <div
        className="virtual-list-content"
        style={{
          position: 'relative',
          transform: `translateY(${offsetY}px)`,
          height: totalHeight,
          width: '100%'
        }}
      >
        {visibleItems}
      </div>
    );
  };

  // 渲染骨架屏（当数据加载中时）
  const renderSkeletons = () => {
    const container = containerRef.current;
    if (!container) return null;

    const height = containerHeight || container.clientHeight;
    const visibleCount = Math.ceil(height / itemHeight) + 2;
    const skeletons = [];

    for (let i = 0; i < visibleCount; i++) {
      skeletons.push(
        <div
          key={`skeleton-${i}`}
          style={{
            height: itemHeight,
            marginBottom: i < visibleCount - 1 ? '1px' : 0
          }}
          className="virtual-list-skeleton"
        >
          <div className="skeleton-content">
            <div className="skeleton-image"></div>
            <div className="skeleton-texts">
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line--short"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="virtual-list-skeletons">
        {skeletons}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        width: '100%'
      }}
      onScroll={handleScroll}
    >
      {data.length > 0 ? (
        renderVisibleItems()
      ) : (
        renderSkeletons()
      )}

      {/* 应用内联样式 */}
      <style jsx>{`
        .virtual-list {
          -webkit-overflow-scrolling: touch; /* 移动端流畅滚动 */
          scroll-behavior: smooth;
        }
        
        .virtual-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .virtual-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .virtual-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .virtual-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .virtual-list-item {
          box-sizing: border-box;
        }
        
        .virtual-list-content {
          will-change: transform;
        }
        
        /* 骨架屏样式 */
        .virtual-list-skeleton {
          background: #f8f8f8;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 8px;
          animation: skeleton-loading 1.5s infinite ease-in-out;
        }
        
        .skeleton-content {
          display: flex;
          gap: 12px;
        }
        
        .skeleton-image {
          width: 80px;
          height: 80px;
          background: #e0e0e0;
          border-radius: 4px;
          flex-shrink: 0;
        }
        
        .skeleton-texts {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }
        
        .skeleton-line {
          height: 16px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          width: 100%;
          animation: skeleton-shimmer 1.5s infinite ease-in-out;
        }
        
        .skeleton-line--title {
          width: 70%;
          height: 20px;
        }
        
        .skeleton-line--short {
          width: 50%;
        }
        
        @keyframes skeleton-loading {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }
        
        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VirtualList;