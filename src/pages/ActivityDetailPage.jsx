import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActivityDetail, updateActivity, getCategories } from '../services/activityService';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // 获取活动详情
  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        const data = await getActivityDetail(id);
        setActivity(data);
        setEditData(data); // 初始化编辑数据
      } catch (err) {
        setError('获取活动详情失败，请稍后重试');
        console.error('Failed to fetch activity detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivityDetail();
    }
  }, [id]);

  // 处理编辑数据变化
  const handleInputChange = (fieldName, value) => {
    setEditData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // 切换编辑模式
  const toggleEditMode = () => {
    if (isEditMode) {
      // 取消编辑，恢复原始数据
      setEditData(activity);
    }
    setIsEditMode(!isEditMode);
    // 重置提交状态
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // 提交编辑
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitSuccess(false);
      setSubmitError(null);

      // 验证必填字段
      if (!editData.title || !editData.startTime || !editData.endTime) {
        throw new Error('请填写必填字段');
      }

      // 验证时间范围
      if (new Date(editData.startTime) >= new Date(editData.endTime)) {
        throw new Error('开始时间必须早于结束时间');
      }

      // 提交更新
      const updatedActivity = await updateActivity(id, editData);

      // 更新状态
      setActivity(updatedActivity);
      setSubmitSuccess(true);
      setIsEditMode(false);

      // 3秒后清除成功提示
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (err) {
      setSubmitError(err.message || '更新失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取状态样式
  const getStatusStyle = (status) => {
    const styles = {
      active: { text: '进行中', color: '#52c41a', bg: '#f6ffed' },
      upcoming: { text: '未开始', color: '#1890ff', bg: '#e6f7ff' },
      ended: { text: '已结束', color: '#d9d9d9', bg: '#f5f5f5' }
    };
    return styles[status] || { text: '未知', color: '#999', bg: '#f5f5f5' };
  };

  if (loading) {
    return (
      <div className="activity-detail-page loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="activity-detail-page error">
        <div className="error-container">
          <p className="error-message">{error || '活动不存在或已被删除'}</p>
          <div className="error-actions">
            <button onClick={() => navigate('/activities')} className="primary-button">
              返回活动列表
            </button>
            <button onClick={() => navigate('/')} className="secondary-button">
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(activity.status);
  const category = categories.find(cat => cat.id === activity.categoryId);

  return (
    <div className="activity-detail-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-left">
          <h2>活动详情</h2>
          <nav className="breadcrumb">
            <Link to="/">首页</Link> &gt;
            <Link to="/activities">活动列表</Link> &gt;
            <span>{activity.title}</span>
          </nav>
        </div>

        <div className="header-actions">
          {isEditMode ? (
            <>
              <button
                onClick={toggleEditMode}
                className="secondary-button"
                disabled={isSubmitting}
              >
                取消编辑
              </button>
              <button
                onClick={handleSubmit}
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '保存修改'}
              </button>
            </>
          ) : (
            <button
              onClick={toggleEditMode}
              className="primary-button"
              title="编辑活动"
            >
              编辑活动
            </button>
          )}
          <Link to="/activities" className="secondary-button">
            返回列表
          </Link>
        </div>
      </div>

      {/* 提交反馈 */}
      {submitSuccess && (
        <div className="submit-success-message">
          ✅ 修改成功！
        </div>
      )}

      {submitError && (
        <div className="submit-error-message">
          ❌ {submitError}
        </div>
      )}

      {/* 活动基本信息 */}
      <section className="activity-info-section">
        <div className="section-header">
          <h3>基本信息</h3>
          {!isEditMode && (
            <span
              className={`status-badge ${activity.status}`}
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.color
              }}
            >
              {statusStyle.text}
            </span>
          )}
        </div>

        {isEditMode ? (
          <form className="edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="required">活动标题</label>
                <input
                  id="title"
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="form-input"
                  placeholder="请输入活动标题"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">活动分类</label>
                <select
                  id="categoryId"
                  value={editData.categoryId || ''}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="form-select"
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">活动状态</label>
                <select
                  id="status"
                  value={editData.status || 'upcoming'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="form-select"
                >
                  <option value="upcoming">未开始</option>
                  <option value="active">进行中</option>
                  <option value="ended">已结束</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="createdBy">创建人</label>
                <input
                  id="createdBy"
                  type="text"
                  value={editData.createdBy || ''}
                  onChange={(e) => handleInputChange('createdBy', e.target.value)}
                  className="form-input"
                  placeholder="请输入创建人姓名"
                />
              </div>

              <div className="form-group">
                <label htmlFor="startTime" className="required">开始时间</label>
                <input
                  id="startTime"
                  type="datetime-local"
                  value={editData.startTime ? new Date(editData.startTime).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime" className="required">结束时间</label>
                <input
                  id="endTime"
                  type="datetime-local"
                  value={editData.endTime ? new Date(editData.endTime).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">活动描述</label>
              <textarea
                id="description"
                value={editData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="请输入活动描述"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rules">活动规则</label>
              <textarea
                id="rules"
                value={editData.rules || ''}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                className="form-textarea"
                rows="6"
                placeholder="请输入活动规则"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">封面图片URL</label>
              <input
                id="coverImage"
                type="url"
                value={editData.coverImage || ''}
                onChange={(e) => handleInputChange('coverImage', e.target.value)}
                className="form-input"
                placeholder="请输入封面图片URL"
              />
            </div>
          </form>
        ) : (
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">活动标题：</span>
              <span className="info-value title">{activity.title}</span>
            </div>

            <div className="info-item">
              <span className="info-label">活动分类：</span>
              <span className="info-value">{category ? category.name : '-'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">创建人：</span>
              <span className="info-value">{activity.createdBy || '-'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">创建时间：</span>
              <span className="info-value">{formatDate(activity.createdAt)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">开始时间：</span>
              <span className="info-value">{formatDate(activity.startTime)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">结束时间：</span>
              <span className="info-value">{formatDate(activity.endTime)}</span>
            </div>

            <div className="info-item full-width">
              <span className="info-label">活动描述：</span>
              <div className="info-value">{activity.description || '-'}</div>
            </div>

            <div className="info-item full-width">
              <span className="info-label">活动规则：</span>
              <div className="info-value rules-content">{activity.rules || '-'}</div>
            </div>
          </div>
        )}
      </section>

      {/* 活动图片 */}
      {activity.coverImage && (
        <section className="activity-image-section">
          <div className="section-header">
            <h3>活动封面</h3>
          </div>

          <div className="cover-image-container">
            <img
              src={activity.coverImage}
              alt={activity.title}
              className="cover-image"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* 参与数据统计 */}
      <section className="activity-stats-section">
        <div className="section-header">
          <h3>参与数据</h3>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{activity.participantCount || 0}</div>
              <div className="stat-label">参与人数</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <div className="stat-value">{activity.viewCount || 0}</div>
              <div className="stat-label">浏览次数</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <div className="stat-value">{activity.likeCount || 0}</div>
              <div className="stat-label">点赞次数</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-value">{activity.commentCount || 0}</div>
              <div className="stat-label">评论数量</div>
            </div>
          </div>
        </div>
      </section>

      {/* 活动历史记录 */}
      {activity.updatedAt && (
        <section className="activity-history-section">
          <div className="section-header">
            <h3>修改历史</h3>
          </div>

          <div className="history-info">
            <p>
              创建时间：{formatDate(activity.createdAt)}
              {activity.updatedAt !== activity.createdAt && (
                <>
                  <br />
                  <span>更新时间：{formatDate(activity.updatedAt)}</span>
                </>
              )}
            </p>
          </div>
        </section>
      )}

      <style jsx>{`
        .activity-detail-page {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* 页面头部 */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .header-left h2 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
        }
        
        .breadcrumb {
          font-size: 14px;
          color: #666;
        }
        
        .breadcrumb a {
          color: #1890ff;
          text-decoration: none;
        }
        
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        
        .breadcrumb span {
          margin: 0 8px;
          color: #999;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .primary-button,
        .secondary-button {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          text-align: center;
        }
        
        .primary-button {
          background-color: #1890ff;
          color: white;
        }
        
        .primary-button:hover:not(:disabled) {
          background-color: #40a9ff;
        }
        
        .secondary-button {
          background-color: white;
          color: #666;
          border: 1px solid #d9d9d9;
        }
        
        .secondary-button:hover {
          color: #1890ff;
          border-color: #1890ff;
        }
        
        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* 提交反馈 */
        .submit-success-message,
        .submit-error-message {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .submit-success-message {
          background-color: #f6ffed;
          color: #52c41a;
          border: 1px solid #b7eb8f;
        }
        
        .submit-error-message {
          background-color: #fff2f0;
          color: #ff4d4f;
          border: 1px solid #ffccc7;
        }
        
        /* 状态标签 */
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        /* 通用区域样式 */
        section {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }
        
        /* 只读模式信息展示 */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .info-item.full-width {
          grid-column: 1 / -1;
        }
        
        .info-label {
          font-size: 14px;
          color: #999;
          font-weight: 500;
        }
        
        .info-value {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
        }
        
        .info-value.title {
          font-size: 16px;
          font-weight: 500;
          color: #1890ff;
        }
        
        .rules-content {
          white-space: pre-wrap;
          font-family: inherit;
        }
        
        /* 编辑模式表单 */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
        
        .form-group label.required::after {
          content: ' *';
          color: #ff4d4f;
        }
        
        .form-input,
        .form-select,
        .form-textarea {
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        /* 封面图片 */
        .cover-image-container {
          display: flex;
          justify-content: center;
          padding: 20px;
          background-color: #fafafa;
          border-radius: 4px;
        }
        
        .cover-image {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 4px;
        }
        
        /* 统计数据 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background-color: #fafafa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }
        
        .stat-icon {
          font-size: 32px;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          line-height: 1;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
        }
        
        /* 历史记录 */
        .history-info {
          padding: 16px;
          background-color: #fafafa;
          border-radius: 4px;
        }
        
        .history-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
        
        /* 加载和错误状态 */
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          min-height: 400px;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1890ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #ff4d4f;
          font-size: 18px;
          margin-bottom: 24px;
        }
        
        .error-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-left {
            width: 100%;
          }
          
          .header-left h2 {
            font-size: 24px;
          }
          
          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }
          
          .form-grid,
          .info-grid,
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          section {
            padding: 16px;
          }
          
          .stat-value {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityDetailPage;