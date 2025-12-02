import React from 'react';

/**
 * 筛选栏骨架屏组件
 * 用于在筛选数据加载时展示占位内容
 */
const ActivityFilterBarSkeleton = () => {
  return (
    <div className="filter-bar-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-reset"></div>
      </div>

      <div className="skeleton-filters">
        <div className="skeleton-filter-item">
          <div className="skeleton-label"></div>
          <div className="skeleton-input"></div>
        </div>

        <div className="skeleton-filter-item">
          <div className="skeleton-label"></div>
          <div className="skeleton-select"></div>
        </div>

        <div className="skeleton-filter-item">
          <div className="skeleton-label"></div>
          <div className="skeleton-date-range"></div>
        </div>

        <div className="skeleton-filter-item">
          <div className="skeleton-label"></div>
          <div className="skeleton-search"></div>
        </div>
      </div>

      <style jsx>{`
        .filter-bar-skeleton {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-radius: var(--card-radius);
          padding: 20px;
          box-shadow: var(--glass-shadow);
          margin-bottom: 24px;
          border: 1px solid var(--glass-border);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .skeleton-title {
          height: 20px;
          width: 80px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-reset {
          height: 24px;
          width: 60px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .skeleton-filter-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .skeleton-label {
          height: 16px;
          width: 60px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-input {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 6px;
        }
        
        .skeleton-select {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 6px;
        }
        
        .skeleton-date-range {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 6px;
        }
        
        .skeleton-search {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 6px;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .skeleton-filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityFilterBarSkeleton;