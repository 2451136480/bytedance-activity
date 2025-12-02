import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getActivities, getCategories } from '../services/activityService';
import useActivityFilters from '../hooks/useActivityFilters';
import ActivityFilterBar from '../components/list/ActivityFilterBar';
import ActivityListItem from '../components/list/ActivityListItem';
import Pagination from '../components/list/Pagination';
import VirtualList from '../components/list/VirtualList';
import ActivityListSkeleton from '../components/list/ActivityListSkeleton';
import ActivityFilterBarSkeleton from '../components/list/ActivityFilterBarSkeleton';
import PaginationSkeleton from '../components/list/PaginationSkeleton';
import LoadingWrapper from '../components/common/LoadingWrapper';

const ActivityListPage = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 使用自定义Hook管理筛选和分页逻辑
  const hook = useActivityFilters();
  const {
    filters,
    pagination,
    updateFilter,
    updatePagination
  } = hook;
  const generateMockData = hook.generateMockData;

  const [total, setTotal] = useState(0);
  const [allStats, setAllStats] = useState({
    active: 0,
    upcoming: 0,
    ended: 0
  });

  // 从URL参数初始化筛选条件
  useEffect(() => {
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || pagination.pageSize.toString());

    if (status) updateFilter('status', status);
    if (search) updateFilter('search', search);
    if (category) updateFilter('category', category);
    if (startDate) updateFilter('startDate', startDate);
    if (endDate) updateFilter('endDate', endDate);
    if (page !== pagination.current || pageSize !== pagination.pageSize) {
      updatePagination(page, pageSize);
    }
  }, []); // 仅在组件挂载时执行

  // 是否使用虚拟滚动（根据数据量动态决定）
  const [useVirtualScroll, setUseVirtualScroll] = useState(false);
  const listContainerHeight = 'calc(100vh - 250px)'; // 动态计算列表容器高度

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

  // 获取活动列表数据
  useEffect(() => {
    let isMounted = true;
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const params = {
          page: pagination.current,
          pageSize: pagination.pageSize,
          ...filters
        };

        let data;
        try {
          // 尝试调用真实API
          data = await getActivities(params);
        } catch (apiError) {
          // API调用失败时使用模拟数据
          console.warn('API调用失败，使用模拟数据:', apiError);
          data = generateMockData(pagination.current, pagination.pageSize, filters);
        }

        if (!isMounted) return;

        // 设置数据并判断是否需要使用虚拟滚动
        // 兼容不同的数据结构 (API返回 { list, pagination }，模拟数据返回 { activities, total })
        const activityList = data.list || data.activities || [];
        const totalCount = data.pagination?.total || data.total || 0;

        setActivities(activityList);
        setTotal(totalCount);

        // 当数据量超过50条或当前页面数据超过20条时，启用虚拟滚动
        setUseVirtualScroll(
          totalCount > 50 || activityList.length > 20
        );

        // 清除错误状态
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError('获取活动列表失败，请稍后重试');
        console.error('Failed to fetch activities:', err);
        // 即使发生错误，也生成一些模拟数据以便展示界面
        const mockData = generateMockData(pagination.current, pagination.pageSize, filters);
        setActivities(mockData.activities || []);
        setTotal(mockData.total || 0);

        // 计算全局统计(获取所有数据的统计)
        const allData = generateMockData(1, mockData.total || 500, {});
        const stats = {
          active: allData.activities.filter(a => a.status === 'active' || a.status === 'ongoing').length,
          upcoming: allData.activities.filter(a => a.status === 'upcoming').length,
          ended: allData.activities.filter(a => a.status === 'ended').length
        };
        setAllStats(stats);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [pagination.current, pagination.pageSize, filters, generateMockData]);

  // 处理筛选条件变化
  const handleFilterChange = (filterName, value) => {
    // 更新筛选条件
    updateFilter(filterName, value);

    // 同步到URL参数
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    // 筛选条件变化时重置到第一页
    newParams.set('page', '1');
    navigate(`/activities?${newParams.toString()}`, { replace: true });

    // 重置分页到第一页
    updatePagination(1, pagination.pageSize);
  };

  // 处理分页变化
  const handlePaginationChange = (page, pageSize) => {
    updatePagination(page, pageSize);
  };

  // 处理重置筛选
  const handleResetFilters = () => {
    // 清除所有筛选条件
    Object.keys(filters).forEach(key => {
      updateFilter(key, '');
    });
    // 重置到第一页
    updatePagination(1, pagination.pageSize);
  };

  // 处理搜索 - 已由useActivityFilters中的防抖搜索处理
  const handleSearch = (searchTerm) => {
    updateFilter('search', searchTerm);

    // 同步到URL参数
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // 重置到第一页
    navigate(`/activities?${newParams.toString()}`, { replace: true });

    updatePagination(1, pagination.pageSize);
  };

  // 处理分页变化
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    navigate(`/activities?${newParams.toString()}`);

    updatePagination(page, pagination.pageSize);
  };

  // 处理页面大小变化
  const handlePageSizeChange = (pageSize) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pageSize', pageSize.toString());
    newParams.set('page', '1'); // 重置到第一页
    navigate(`/activities?${newParams.toString()}`);

    updatePagination(1, pageSize);
  };

  // 清除所有筛选条件
  const handleClearFilters = () => {
    // 清除所有筛选条件
    Object.keys(filters).forEach(key => {
      updateFilter(key, '');
    });
    // 清除URL参数并重置分页
    navigate('/activities', { replace: true });
    updatePagination(1, pagination.pageSize);
  };

  // 处理删除活动
  const handleDelete = (activity) => {
    if (window.confirm(`确定要删除活动 "${activity.title}" 吗？`)) {
      // 这里应该调用删除API，现在只是模拟删除
      setActivities(prev => prev.filter(item => item.id !== activity.id));
      console.log(`删除了活动: ${activity.title}`);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取状态标签样式
  const getStatusStyle = (status) => {
    const styles = {
      active: { text: '进行中', color: '#52c41a', bg: '#f6ffed' },
      upcoming: { text: '未开始', color: '#1890ff', bg: '#e6f7ff' },
      ended: { text: '已结束', color: '#d9d9d9', bg: '#f5f5f5' }
    };
    return styles[status] || { text: '未知', color: '#999', bg: '#f5f5f5' };
  };

  return (
    <div className="activity-list-page">
      <div className="activity-layout">
        {/* 左侧边栏 - 用户信息和筛选 */}
        <aside className="sidebar left-sidebar">
          {/* 用户信息区域 */}
          <div className="user-profile">
            <img className="user-avatar" src="/src/img/head.jpg" alt="管理员头像" />
            <div className="user-name">
              <span className="welcome">管理员</span>
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* 关键词搜索 */}
          <div className="filter-section">
            <div className="section-title">关键词搜索</div>
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="搜索活动名称..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              {filters.search && (
                <button
                  className="clear-search-btn"
                  onClick={() => handleFilterChange('search', '')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* 状态筛选 */}
          <div className="filter-section">
            <div className="section-title">状态筛选</div>
            <div className="filter-options vertical">
              <div
                className={`filter-item ${filters.status === '' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', '')}
              >
                全部活动
              </div>
              <div
                className={`filter-item ${filters.status === 'active' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'active')}
              >
                进行中
              </div>
              <div
                className={`filter-item ${filters.status === 'upcoming' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'upcoming')}
              >
                即将开始
              </div>
              <div
                className={`filter-item ${filters.status === 'ended' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'ended')}
              >
                已结束
              </div>
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* 时间范围筛选 */}
          <div className="filter-section">
            <div className="section-title">时间范围</div>
            <div className="date-range-picker">
              <div className="date-input-group">
                <label className="date-label">开始日期</label>
                <input
                  type="date"
                  className="date-input"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label className="date-label">结束日期</label>
                <input
                  type="date"
                  className="date-input"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              {(filters.startDate || filters.endDate) && (
                <button
                  className="clear-date-btn"
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                  }}
                >
                  清除日期
                </button>
              )}
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* 分页控制移到左侧栏底部 */}
          <div className="pagination vertical">
            <button
              disabled={pagination.current <= 1}
              onClick={() => handlePageChange(pagination.current - 1)}
              className="page-btn"
            >
              上一页
            </button>
            <span className="page-info">第 {pagination.current} 页</span>
            <button
              disabled={pagination.current >= Math.ceil(total / pagination.pageSize)}
              onClick={() => handlePageChange(pagination.current + 1)}
              className="page-btn"
            >
              下一页
            </button>
          </div>
        </aside>

        {/* 中间栏 - 活动列表 */}
        <main className="main-content">
          <div className="audit-banner">
            <div className="banner-content">
              <h1 className="banner-title">活动审核中心</h1>
              <div className="banner-actions">
                <button className="banner-btn primary" onClick={() => handleFilterChange('status', 'upcoming')}>
                  <span className="icon">📋</span> 待审核活动
                </button>
                <button className="banner-btn secondary" onClick={() => handleFilterChange('status', 'ended')}>
                  <span className="icon">📜</span> 审核历史
                </button>
              </div>
            </div>
          </div>

          <div className="travel-list">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button className="retry-button" onClick={() => window.location.reload()}>
                  重试
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <h3>暂无活动数据</h3>
                <p>当前没有符合条件的活动</p>
                <button className="reset-button" onClick={handleClearFilters}>
                  清除筛选条件
                </button>
              </div>
            ) : (
              <div className="list-container">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="travel-card">
                    <div className="travel-header">
                      <img className="avatar" src={activity.image || '/placeholder-activity.svg'} alt={activity.title} />
                      <div className="user-detail">
                        <span className="nickname">{activity.title}</span>
                        <span className="time">{formatDate(activity.startTime)}</span>
                      </div>
                      <div className={`status-tag status-${activity.status}`}>
                        {getStatusStyle(activity.status).text}
                      </div>
                    </div>

                    <div className="travel-body" onClick={() => navigate(`/activities/${activity.id}`)}>
                      <div className="travel-title">{activity.title}</div>
                      <img className="cover-image" src={activity.image || '/placeholder-activity.svg'} alt={activity.title} />
                    </div>

                    <div className="travel-footer">
                      <div className="travel-stats">
                        <span className="stat-item">浏览：{activity.participants || 0}</span>
                        <span className="stat-item">点赞：{activity.likes || 0}</span>
                      </div>

                      <div className="travel-actions">
                        <button className="action-btn view" onClick={() => navigate(`/activities/${activity.id}`)}>
                          查看详情
                        </button>
                        <button className="action-btn edit" onClick={() => navigate(`/activities/${activity.id}/edit`)}>
                          编辑
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(activity)}>
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* 右侧栏 - 统计信息 */}
        <aside className="sidebar right-sidebar">
          <div className="stats-section">
            <div className="section-title">数据统计</div>
            <div className="stats-cards">
              <div className="stat-card pending">
                <div className="stat-value">{allStats.active}</div>
                <div className="stat-label">进行中</div>
              </div>
              <div className="stat-card approved">
                <div className="stat-value">{allStats.upcoming}</div>
                <div className="stat-label">即将开始</div>
              </div>
              <div className="stat-card rejected">
                <div className="stat-value">{allStats.ended}</div>
                <div className="stat-label">已结束</div>
              </div>
            </div>
          </div>

          <div className="sidebar-divider"></div>

          <div className="quick-actions">
            <div className="section-title">快捷操作</div>
            <button className="quick-action-btn refresh" onClick={() => window.location.reload()}>
              刷新数据
            </button>
            <button className="quick-action-btn create" onClick={() => navigate('/activities/create')}>
              创建活动
            </button>
          </div>
        </aside>
      </div>

      {/* 内联样式 */}
      <style jsx>{`
        .activity-list-page {
          max-width: 1600px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-primary);
          position: relative;
          min-height: 100vh;
        }

        .activity-list-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/src/img/01.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.15;
          z-index: -1;
        }
        
        .activity-layout {
          display: grid;
          grid-template-columns: 240px 1fr 280px;
          gap: 24px;
          min-height: calc(100vh - 40px);
          background: transparent;
          align-items: start;
        }

        /* Sidebar Styles */
        .sidebar {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-radius);
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          box-shadow: var(--glass-shadow);
          position: sticky;
          top: 20px;
        }

        .user-profile {
          padding: 30px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--glass-border);
          background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          padding: 2px;
          object-fit: cover;
        }

        .user-name {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .welcome {
          font-size: 16px;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .username {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        .logout-btn {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--glass-border);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: rgba(255, 77, 79, 0.2);
          color: #ff4d4f;
          border-color: #ff4d4f;
        }

        .sidebar-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 16px 24px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 0 24px;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 16px;
        }

        .filter-item {
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          color: #e0e0e0;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: rgba(59, 130, 246, 0.08);
        }

        .filter-item:hover {
          background: rgba(59, 130, 246, 0.2);
          color: #ffffff;
          padding-left: 24px;
        }

        .filter-item.active {
          background: rgba(59, 130, 246, 0.3);
          color: #ffffff;
          border-left: 3px solid #3b82f6;
          font-weight: 700;
        }

        /* Main Content */
        .main-content {
          background: transparent;
          overflow-y: visible;
          min-height: 100%;
        }

        .content-header {
          display: none;
        }

        .audit-banner {
          height: 240px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(20, 30, 48, 0.8), rgba(36, 59, 85, 0.8)), url('/src/img/02.png');
          background-size: cover;
          background-position: center;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .audit-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(2px);
        }

        .banner-content {
          position: relative;
          z-index: 1;
          text-align: center;
          width: 100%;
          max-width: 600px;
        }

        .banner-title {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          background: linear-gradient(to right, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .banner-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 24px;
        }

        .banner-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .banner-btn {
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
        }

        .banner-btn.primary {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          color: white;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }

        .banner-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.6);
        }

        .banner-btn.secondary {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .banner-btn.secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .header-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));
        }

        .travel-list {
          padding: 0;
          min-height: 400px;
        }

        .list-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding-bottom: 40px;
        }

        .travel-card {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-radius);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .travel-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.03), transparent);
          transform: translateX(-100%);
          transition: 0.5s;
        }

        .travel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3), 0 0 15px rgba(127, 0, 255, 0.3);
          border-color: rgba(127, 0, 255, 0.5);
        }

        .travel-card:hover::before {
          transform: translateX(100%);
        }

        .travel-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.2);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--accent-primary);
        }

        .nickname {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .time {
          font-size: 13px;
          color: #b0b0b0;
          font-weight: 500;
        }

        .status-tag {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-tag.status-active {
          background: rgba(82, 196, 26, 0.2);
          color: #52c41a;
          border: 1px solid rgba(82, 196, 26, 0.3);
          box-shadow: 0 0 8px rgba(82, 196, 26, 0.2);
        }

        .status-tag.status-upcoming {
          background: rgba(24, 144, 255, 0.2);
          color: #1890ff;
          border: 1px solid rgba(24, 144, 255, 0.3);
          box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
        }

        .status-tag.status-ended {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          border: 1px solid var(--glass-border);
        }

        .travel-body {
          padding: 16px;
          cursor: pointer;
        }

        .travel-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .cover-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.5s;
        }
        
        .travel-card:hover .cover-image {
          transform: scale(1.02);
        }

        .travel-footer {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.1);
        }

        .stat-item {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .travel-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .action-btn.view {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
        }

        .action-btn.view:hover {
          background: var(--accent-primary);
          box-shadow: 0 0 10px var(--accent-primary);
        }

        .action-btn.edit {
          background: rgba(255,255,255,0.1);
          color: var(--text-primary);
        }

        .action-btn.edit:hover {
          background: var(--accent-tertiary);
          box-shadow: 0 0 10px var(--accent-tertiary);
          color: #000;
        }

        .action-btn.delete {
          background: rgba(255,255,255,0.1);
          color: var(--text-muted);
        }

        .action-btn.delete:hover {
          background: #ff4d4f;
          color: white;
          box-shadow: 0 0 10px #ff4d4f;
        }

        /* Right Sidebar */
        .right-sidebar {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: var(--card-radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: fit-content;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateX(5px);
        }
        
        .stat-card.pending { border-left: 3px solid #fa8c16; }
        .stat-card.approved { border-left: 3px solid #52c41a; }
        .stat-card.rejected { border-left: 3px solid #ff4d4f; }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 14px;
          color: #e0e0e0;
          font-weight: 600;
          text-transform: uppercase;
        }

        .quick-action-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .quick-action-btn.refresh {
          background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          box-shadow: 0 4px 15px rgba(127, 0, 255, 0.4);
        }

        .quick-action-btn.refresh:hover {
          box-shadow: 0 6px 20px rgba(127, 0, 255, 0.6);
          transform: translateY(-2px);
        }

        .quick-action-btn.create {
          background: transparent;
          border: 1px solid var(--accent-tertiary);
          color: var(--accent-tertiary);
        }

        .quick-action-btn.create:hover {
          background: var(--accent-tertiary);
          color: #000;
          box-shadow: 0 0 15px var(--accent-tertiary);
        }

        .pagination {
          padding: 24px;
          margin-top: auto;
        }

        .loading, .empty {
          color: var(--text-muted);
          padding: 100px 0;
        }
        
        .loading-spinner {
          border-color: rgba(255,255,255,0.1);
          border-top-color: var(--accent-primary);
        }

        /* Search and Filter Input Styles */
        .search-box {
          position: relative;
          padding: 0 24px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .search-input::placeholder {
          color: #b0b0b0;
        }

        .search-input:focus {
          outline: none;
          background: rgba(59, 130, 246, 0.15);
          border-color: #3b82f6;
        }

        .clear-search-btn {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          font-size: 16px;
          padding: 4px 8px;
          transition: all 0.3s;
        }

        .clear-search-btn:hover {
          color: #ffffff;
        }

        .date-range-picker {
          padding: 0 24px;
        }

        .date-input-group {
          margin-bottom: 12px;
        }

        .date-label {
          display: block;
          font-size: 12px;
          color: #e0e0e0;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .date-input {
          width: 100%;
          padding: 10px 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .date-input:focus {
          outline: none;
          background: rgba(59, 130, 246, 0.15);
          border-color: #3b82f6;
        }

        .clear-date-btn {
          width: 100%;
          padding: 10px;
          background: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.3);
          border-radius: 8px;
          color: #ff4d4f;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }

        .clear-date-btn:hover {
          background: rgba(255, 77, 79, 0.2);
          border-color: #ff4d4f;
        }

        .filter-section {
          margin-bottom: 8px;
        }

        .page-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          margin-bottom: 8px;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-btn:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
        }

        .page-info {
          color: #e0e0e0;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          margin: 8px 0;
        }

      `}</style>
    </div>
  );
};

export default ActivityListPage;