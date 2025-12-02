import React from 'react';

/**
 * 分页骨架屏组件
 * 用于在分页数据加载时展示占位内容
 */
const PaginationSkeleton = () => {
  return (
    <div className="pagination-skeleton">
      <div className="skeleton-info"></div>
      <div className="skeleton-controls">
        <div className="skeleton-button"></div>
        <div className="skeleton-pages"></div>
        <div className="skeleton-button"></div>
      </div>
      
      <style jsx>{`
        .pagination-skeleton {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-info {
          height: 16px;
          width: 120px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
        }
        
        .skeleton-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .skeleton-button {
          height: 32px;
          width: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 6px;
        }
        
        .skeleton-pages {
          display: flex;
          gap: 8px;
        }
        
        .skeleton-pages::before,
        .skeleton-pages::after {
          content: '';
          height: 32px;
          width: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 6px;
        }
        
        .skeleton-pages::before {
          width: 40px;
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
          .pagination-skeleton {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .skeleton-info {
            width: 100px;
          }
          
          .skeleton-controls {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginationSkeleton;