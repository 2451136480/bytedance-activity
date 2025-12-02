import React from 'react';

/**
 * 活动列表骨架屏组件
 * 用于在数据加载时展示占位内容，提升用户体验
 */
const ActivityListSkeleton = ({ count = 5 }) => {
  return (
    <div className="activity-list-skeleton">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-meta">
              <div className="skeleton-date"></div>
              <div className="skeleton-participants"></div>
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-status"></div>
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .activity-list-skeleton {
          padding: 16px;
        }
        
        .skeleton-item {
          display: flex;
          padding: 16px;
          border-bottom: 1px solid var(--glass-border);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-item:last-child {
          border-bottom: none;
        }
        
        .skeleton-image {
          width: 120px;
          height: 80px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 8px;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .skeleton-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .skeleton-title {
          height: 20px;
          width: 60%;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-description {
          height: 16px;
          width: 80%;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-meta {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        
        .skeleton-date {
          height: 14px;
          width: 120px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-participants {
          height: 14px;
          width: 80px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
        }
        
        .skeleton-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
        }
        
        .skeleton-button {
          height: 32px;
          width: 80px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 6px;
        }
        
        .skeleton-status {
          height: 20px;
          width: 60px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          border-radius: 4px;
          margin-left: auto;
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
          .skeleton-item {
            flex-direction: column;
          }
          
          .skeleton-image {
            width: 100%;
            height: 160px;
            margin-right: 0;
            margin-bottom: 12px;
          }
          
          .skeleton-title {
            width: 80%;
          }
          
          .skeleton-description {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityListSkeleton;