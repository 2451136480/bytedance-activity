import React from 'react';

/**
 * 首页骨架屏组件
 * 模拟首页布局结构，包括横幅、筛选器和活动列表
 */
const HomePageSkeleton = () => {
  return (
    <div className="home-page-skeleton">
      {/* 横幅区域 */}
      <div className="skeleton-banner">
        <div className="skeleton-banner-content">
          <div className="skeleton-banner-title"></div>
          <div className="skeleton-banner-subtitle"></div>
          <div className="skeleton-banner-button"></div>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="skeleton-main-content">
        {/* 标题和控制区域 */}
        <div className="skeleton-header">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-controls">
            <div className="skeleton-filter"></div>
            <div className="skeleton-layout-switch"></div>
          </div>
        </div>
        
        {/* 活动网格 */}
        <div className="skeleton-activity-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="skeleton-activity-card">
              <div className="skeleton-card-image"></div>
              <div className="skeleton-card-content">
                <div className="skeleton-card-title"></div>
                <div className="skeleton-card-description"></div>
                <div className="skeleton-card-meta">
                  <div className="skeleton-date"></div>
                  <div className="skeleton-participants"></div>
                </div>
                <div className="skeleton-card-footer">
                  <div className="skeleton-status"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .home-page-skeleton {
          min-height: 100vh;
          background: #f5f5f5;
        }
        
        /* 横幅区域 */
        .skeleton-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 0;
          margin-bottom: 40px;
        }
        
        .skeleton-banner-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
        }
        
        .skeleton-banner-title {
          height: 48px;
          width: 400px;
          background: linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%);
          border-radius: 8px;
          margin: 0 auto 16px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-banner-subtitle {
          height: 24px;
          width: 300px;
          background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 75%);
          border-radius: 6px;
          margin: 0 auto 24px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-banner-button {
          height: 40px;
          width: 120px;
          background: linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 75%);
          border-radius: 8px;
          margin: 0 auto;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        /* 主要内容区域 */
        .skeleton-main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .skeleton-section-title {
          height: 32px;
          width: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-controls {
          display: flex;
          gap: 16px;
        }
        
        .skeleton-filter {
          height: 36px;
          width: 120px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-layout-switch {
          height: 36px;
          width: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        /* 活动网格 */
        .skeleton-activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        
        .skeleton-activity-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-card-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        }
        
        .skeleton-card-content {
          padding: 20px;
        }
        
        .skeleton-card-title {
          height: 24px;
          width: 80%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
          margin-bottom: 12px;
        }
        
        .skeleton-card-description {
          height: 16px;
          width: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
          margin-bottom: 16px;
        }
        
        .skeleton-card-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .skeleton-date {
          height: 14px;
          width: 100px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
        }
        
        .skeleton-participants {
          height: 14px;
          width: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
        }
        
        .skeleton-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .skeleton-status {
          height: 20px;
          width: 50px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
        }
        
        .skeleton-price {
          height: 24px;
          width: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          border-radius: 4px;
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
          .skeleton-banner-title {
            width: 280px;
            height: 36px;
          }
          
          .skeleton-banner-subtitle {
            width: 220px;
            height: 20px;
          }
          
          .skeleton-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .skeleton-section-title {
            width: 160px;
          }
          
          .skeleton-activity-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePageSkeleton;