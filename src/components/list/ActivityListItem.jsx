import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 活动列表项组件
 */
const ActivityListItem = ({ activity }) => {
  const navigate = useNavigate();

  // 处理列表项点击，跳转到详情页
  const handleItemClick = (e) => {
    // 阻止冒泡，确保只有在点击列表项本身时才跳转
    e.stopPropagation();
    navigate(`/activity/${activity.id}`);
  };

  // 获取活动状态的样式和文本
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { className: 'status-badge--active', text: '进行中' };
      case 'upcoming':
        return { className: 'status-badge--upcoming', text: '即将开始' };
      case 'completed':
        return { className: 'status-badge--completed', text: '已结束' };
      default:
        return { className: 'status-badge--default', text: '未知' };
    }
  };

  const statusInfo = getStatusInfo(activity.status);

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="activity-list-item" onClick={handleItemClick}>
      {/* 活动图片 */}
      <div className="activity-item__image-container">
        <img
          src={activity.coverImage || '/placeholder-activity.svg'}
          alt={activity.title || '活动图片'}
          className="activity-item__image"
          onError={(e) => {
            e.target.src = '/placeholder-activity.svg';
            e.target.style.objectFit = 'contain';
          }}
        />
      </div>

      {/* 活动信息 */}
      <div className="activity-item__content">
        {/* 标题和状态 */}
        <div className="activity-item__header">
          <h3 className="activity-item__title">
            {activity.title || '未命名活动'}
          </h3>
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* 活动描述 */}
        {activity.description && (
          <p className="activity-item__description">
            {activity.description.length > 100
              ? `${activity.description.substring(0, 100)}...`
              : activity.description}
          </p>
        )}

        {/* 活动时间和参与人数 */}
        <div className="activity-item__meta">
          <div className="meta-item">
            <span className="meta-label">开始时间：</span>
            <span className="meta-value">{formatDate(activity.startTime)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">结束时间：</span>
            <span className="meta-value">{formatDate(activity.endTime)}</span>
          </div>
          {activity.participantCount !== undefined && (
            <div className="meta-item">
              <span className="meta-label">参与人数：</span>
              <span className="meta-value">{activity.participantCount}人</span>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="activity-item__footer">
          <button className="action-btn action-btn--view">
            查看详情
          </button>
          {activity.status === 'active' && (
            <button className="action-btn action-btn--join">
              立即参与
            </button>
          )}
        </div>
      </div>

      {/* 应用内联样式 */}
      <style jsx>{`
        .activity-list-item {
          display: flex;
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .activity-list-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .activity-item__image-container {
          flex: 0 0 120px;
          height: 120px;
          overflow: hidden;
          border-radius: 6px;
          margin-right: 16px;
        }
        
        .activity-item__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        
        .activity-list-item:hover .activity-item__image {
          transform: scale(1.05);
        }
        
        .activity-item__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0; /* 防止内容溢出 */
        }
        
        .activity-item__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .activity-item__title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          flex: 1;
          margin-right: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .status-badge--active {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge--upcoming {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-badge--completed {
          background-color: #e9ecef;
          color: #495057;
        }
        
        .status-badge--default {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .activity-item__description {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .activity-item__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .meta-item {
          font-size: 13px;
          color: #666;
        }
        
        .meta-label {
          color: #999;
          margin-right: 4px;
        }
        
        .meta-value {
          color: #333;
          font-weight: 500;
        }
        
        .activity-item__footer {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }
        
        .action-btn {
          padding: 6px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }
        
        .action-btn--view {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .action-btn--view:hover {
          background-color: #e0e0e0;
        }
        
        .action-btn--join {
          background-color: #007bff;
          color: white;
        }
        
        .action-btn--join:hover {
          background-color: #0056b3;
          transform: translateY(-1px);
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .activity-list-item {
            flex-direction: column;
          }
          
          .activity-item__image-container {
            width: 100%;
            height: 180px;
            flex: none;
            margin-right: 0;
            margin-bottom: 12px;
          }
          
          .activity-item__header {
            flex-direction: column;
            gap: 8px;
          }
          
          .activity-item__title {
            white-space: normal;
            overflow: visible;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }
          
          .activity-item__meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityListItem;