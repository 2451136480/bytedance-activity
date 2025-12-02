import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityGrid from '../components/home/ActivityGrid';
import ActivityCarousel from '../components/home/ActivityCarousel';
import LayoutSwitcher from '../components/home/LayoutSwitcher';
import '../components/home/styles.css';
import ComponentExtensionManager from '../components/home/ComponentExtensionManager';
import { registerCustomComponents } from "../components/home/ComponentExtensionExample";
import PropTypes from 'prop-types';
import LoadingWrapper from '../components/common/LoadingWrapper';
import HomePageSkeleton from '../components/home/HomePageSkeleton';

// 错误边界组件
class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.element
  };

  static defaultProps = {
    fallback: null
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HomePage error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary, #f8f9fa)',
          borderRadius: '12px',
          margin: '24px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: 'var(--error-color, #fa5252)'
          }}>⚠️</div>
          <h2 style={{
            color: 'var(--text-primary, #292f36)',
            marginBottom: '12px',
            fontSize: '24px'
          }}>页面加载出错</h2>
          <p style={{
            color: 'var(--text-secondary, #6d6d6d)',
            marginBottom: '24px',
            maxWidth: '400px'
          }}>抱歉，页面加载过程中出现了错误。请稍后重试或联系技术支持。</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'var(--primary-color, #ff6b6b)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-hover, #40a9ff)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color, #ff6b6b)';
            }}
          >
            重新加载页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 初始化组件扩展管理器
const initializeComponentExtensions = () => {
  // 注册内置组件到扩展管理器
  try {
    ComponentExtensionManager.registerActivityCard('normal', () => null);
    ComponentExtensionManager.registerActivityCard('promotion', () => null);
    ComponentExtensionManager.registerLayout('grid', ActivityGrid);
    ComponentExtensionManager.registerLayout('carousel', ActivityCarousel);

    // 注册自定义组件（如果有的话）
    try {
      registerCustomComponents();
    } catch (error) {
      console.warn('注册自定义组件失败:', error);
    }

    console.log('组件扩展管理器初始化完成');
  } catch (error) {
    console.error('组件扩展管理器初始化失败:', error);
  }
};

// 加载状态组件
const LoadingState = () => (
  <div className="loading-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '24px'
  }}>
    <div className="loading-spinner" style={{
      width: '48px',
      height: '48px',
      border: '4px solid var(--border-color, #e1e4e8)',
      borderTop: '4px solid var(--primary-color, #ff6b6b)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }}></div>
    <p style={{
      color: 'var(--text-secondary, #6d6d6d)',
      fontSize: '16px',
      marginTop: '16px'
    }}>正在加载活动数据...</p>
  </div>
);

// 错误状态组件
const ErrorState = ({ error, onRetry }) => (
  <div className="error-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: 'var(--bg-secondary, #f8f9fa)',
    borderRadius: '12px',
    margin: '24px'
  }}>
    <div className="error-icon" style={{
      fontSize: '48px',
      marginBottom: '16px',
      color: 'var(--error-color, #fa5252)'
    }}>⚠️</div>
    <h3 style={{
      color: 'var(--text-primary, #292f36)',
      marginBottom: '12px',
      fontSize: '20px'
    }}>数据加载失败</h3>
    <p style={{
      color: 'var(--text-secondary, #6d6d6d)',
      marginBottom: '24px',
      maxWidth: '400px'
    }}>{error?.message || '无法获取活动数据，请稍后重试。'}</p>
    <button
      className="retry-button"
      onClick={onRetry}
      style={{
        backgroundColor: 'var(--error-color, #fa5252)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'var(--warning-color, #ff922b)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--error-color, #fa5252)';
      }}
    >
      重试
    </button>
  </div>
);

ErrorState.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func.isRequired
};

const HomePage = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 简化的筛选状态
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 组件扩展状态
  const [componentExtensions, setComponentExtensions] = useState({
    registered: false,
    activityTypes: [],
    layoutTypes: []
  });

  // 计算筛选后的活动
  const filteredActivities = React.useMemo(() => {
    if (!homeData?.activities) return [];

    let filtered = homeData.activities;

    // 按分类筛选
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    // 按状态筛选
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === selectedStatus);
    }

    return filtered;
  }, [homeData?.activities, selectedCategory, selectedStatus]);

  // 清除筛选
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // 初始化组件扩展
  useEffect(() => {
    initializeComponentExtensions();

    // 获取支持的组件类型
    const activityTypes = ComponentExtensionManager.getActivityTypes();
    const layoutTypes = ComponentExtensionManager.getLayoutTypes();

    setComponentExtensions({
      registered: true,
      activityTypes,
      layoutTypes
    });
  }, []);

  // 获取首页数据
  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟API调用
      const response = await fetch('/api/activities/home');

      if (!response.ok) {
        throw new Error('获取数据失败');
      }

      const data = await response.json();
      setHomeData(data);
    } catch (error) {
      console.warn('获取首页数据失败，使用模拟数据:', error);

      // 模拟数据加载延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        banners: [
          {
            id: 1,
            title: '春季促销活动',
            image: '/src/img/02.png',
            link: '/activities/1'
          },
          {
            id: 2,
            title: '技术分享会',
            image: '/src/img/03.png',
            link: '/activities/2'
          },
          {
            id: 3,
            title: '新品发布会',
            image: '/src/img/04.png',
            link: '/activities/3'
          }
        ],
        activities: [
          {
            id: 1,
            title: '春季促销活动',
            description: '全场商品8折优惠，限时抢购！',
            category: 'promotion',
            status: 'active',
            startTime: '2024-03-01T00:00:00Z',
            endTime: '2024-03-31T23:59:59Z',
            coverImage: '/src/img/02.png',
            participants: 1250,
            likes: 89,
            comments: 23
          },
          {
            id: 2,
            title: '技术分享会',
            description: '前端开发最佳实践分享',
            category: 'education',
            status: 'upcoming',
            startTime: '2024-04-15T14:00:00Z',
            endTime: '2024-04-15T16:00:00Z',
            coverImage: '/src/img/03.png',
            participants: 45,
            likes: 12,
            comments: 5
          },
          {
            id: 3,
            title: '新品发布会',
            description: '2024年春季新品发布',
            category: 'product',
            status: 'active',
            startTime: '2024-03-20T10:00:00Z',
            endTime: '2024-03-20T12:00:00Z',
            coverImage: '/src/img/04.png',
            participants: 320,
            likes: 156,
            comments: 42
          },
          {
            id: 4,
            title: '夏季音乐节',
            description: '享受夏日音乐盛宴',
            category: 'entertainment',
            status: 'active',
            startTime: '2024-06-01T18:00:00Z',
            endTime: '2024-06-01T22:00:00Z',
            coverImage: '/src/img/05.png',
            participants: 580,
            likes: 234,
            comments: 67
          }
        ],
        stats: {
          totalActivities: 15,
          activePromotions: 8,
          upcomingEvents: 4
        }
      };
      setHomeData(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // 响应式布局
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const banners = homeData?.banners;
    if (!banners || !banners.length) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % (banners?.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [homeData]);

  // 布局切换
  const handleLayoutChange = (layout) => {
    setLayoutMode(layout);
  };

  // 重试加载
  const handleRetry = () => {
    fetchHomeData();
  };

  // 活动点击
  const handleActivityClick = (activity) => {
    navigate(`/activities/${activity.id}`);
  };

  // 计算网格列数
  const getGridColumns = () => {
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  // 渲染活动内容
  const renderActivityContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={handleRetry} />;
    }

    if (!homeData?.activities?.length) {
      return (
        <div className="empty-state" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary, #f8f9fa)',
          borderRadius: '12px',
          margin: '24px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
            color: 'var(--text-tertiary, #999)'
          }}>📭</div>
          <h3 style={{
            color: 'var(--text-primary, #292f36)',
            marginBottom: '12px',
            fontSize: '20px'
          }}>暂无活动</h3>
          <p style={{
            color: 'var(--text-secondary, #6d6d6d)',
            marginBottom: '24px',
            maxWidth: '400px'
          }}>当前没有可用的活动，请稍后再来查看。</p>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: 'var(--primary-color, #ff6b6b)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--primary-hover, #40a9ff)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--primary-color, #ff6b6b)';
            }}
          >
            重新加载
          </button>
        </div>
      );
    }

    const activities = (filteredActivities && filteredActivities.length > 0)
      ? filteredActivities
      : (homeData?.activities || []);

    // 根据布局模式渲染不同的组件
    if (layoutMode === 'carousel') {
      return (
        <ActivityCarousel
          activities={activities}
          onActivityClick={handleActivityClick}
          autoPlay={true}
          interval={5000}
          showIndicators={true}
          showControls={true}
        />
      );
    }

    // 默认使用宫格布局
    return (
      <ActivityGrid
        activities={activities}
        onActivityClick={handleActivityClick}
        columns="auto"
        gap="24px"
      />
    );
  };

  return (
    <ErrorBoundary>
      <div className="home-page">
        <div className="home-container">
          <LoadingWrapper
            skeleton={<HomePageSkeleton />}
            loading={loading && !homeData}
            error={error}
            onRetry={handleRetry}
          >
            {/* 三栏布局 */}
            <div className="home-layout">
              {/* 左侧边栏 */}
              <aside className="left-sidebar">
                {/* 用户信息 */}
                <div className="user-info">
                  <img src="/src/img/head.jpg" alt="管理员" className="user-avatar" />
                  <div className="user-details">
                    <h3>管理员</h3>
                    <p>活动管理平台</p>
                  </div>
                </div>

                {/* 分类筛选 */}
                <div className="filter-section">
                  <div className="section-title">活动分类</div>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      全部活动
                    </button>
                    <button
                      className={`filter-option ${selectedCategory === 'promotion' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('promotion')}
                    >
                      促销活动
                    </button>
                    <button
                      className={`filter-option ${selectedCategory === 'education' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('education')}
                    >
                      教育培训
                    </button>
                    <button
                      className={`filter-option ${selectedCategory === 'product' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('product')}
                    >
                      产品发布
                    </button>
                  </div>
                </div>

                {/* 快捷操作 */}
                <div className="quick-actions">
                  <div className="section-title">快捷操作</div>
                  <button className="quick-action-btn" onClick={() => navigate('/activities/new')}>
                    ➕ 创建活动
                  </button>
                  <button className="quick-action-btn" onClick={() => navigate('/activities')}>
                    📋 活动列表
                  </button>
                  <button className="quick-action-btn" onClick={() => navigate('/analytics')}>
                    📊 数据分析
                  </button>
                </div>
              </aside>

              {/* 主内容区域 */}
              <main className="main-content">
                {/* 横幅轮播 */}
                {homeData?.banners?.length > 0 && (
                  <div className="banner-container">
                    <div className="banner-slider" style={{
                      transform: `translateX(-${bannerIndex * 100}%)`,
                      transition: 'transform 0.5s ease-in-out',
                      display: 'flex',
                      width: `${(homeData?.banners?.length || 1) * 100}%`
                    }}>
                      {homeData?.banners?.map((banner, index) => (
                        <div
                          key={banner.id}
                          className="banner-slide"
                          style={{
                            width: `${100 / (homeData?.banners?.length || 1)}%`,
                            backgroundImage: `url(${banner.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(banner.link)}
                        >
                          {banner.title}
                        </div>
                      ))}
                    </div>

                    {/* 轮播指示器 */}
                    <div className="banner-indicators" style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {homeData?.banners?.map((_, index) => (
                        <button
                          key={index}
                          className={`banner-indicator ${index === bannerIndex ? 'active' : ''}`}
                          onClick={() => setBannerIndex(index)}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: index === bannerIndex ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 统计信息 */}
                {homeData?.stats && (
                  <div className="stats-section">
                    <div className="section-title">活动统计</div>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-number">{homeData.stats.totalActivities}</div>
                        <div className="stat-label">总活动数</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{homeData.stats.activePromotions}</div>
                        <div className="stat-label">进行中促销</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{homeData.stats.upcomingEvents}</div>
                        <div className="stat-label">即将开始</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{componentExtensions.activityTypes.length}</div>
                        <div className="stat-label">支持的活动类型</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 布局切换器 */}
                <div className="layout-section">
                  <LayoutSwitcher currentLayout={layoutMode} onLayoutChange={handleLayoutChange} />
                </div>

                {/* 活动列表 */}
                <div className="activity-content">
                  {renderActivityContent()}
                </div>
              </main>

              {/* 右侧边栏 */}
              <aside className="right-sidebar">
                {/* 热门活动 */}
                <div className="stats-section">
                  <div className="section-title">热门活动</div>
                  {homeData?.activities?.slice(0, 3).map(activity => (
                    <div key={activity.id} className="hot-activity-item" onClick={() => handleActivityClick(activity)}>
                      <img src={activity.coverImage} alt={activity.title} className="hot-activity-image" />
                      <div className="hot-activity-info">
                        <div className="hot-activity-title">{activity.title}</div>
                        <div className="hot-activity-participants">{activity.participants || 0} 人参与</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sidebar-divider"></div>

                {/* 最新动态 */}
                <div className="stats-section">
                  <div className="section-title">最新动态</div>
                  <div className="latest-updates">
                    <div className="update-item">
                      <div className="update-time">2小时前</div>
                      <div className="update-content">新增促销活动：夏日新品促销</div>
                    </div>
                    <div className="update-item">
                      <div className="update-time">5小时前</div>
                      <div className="update-content">技术研讨会报名开始</div>
                    </div>
                    <div className="update-item">
                      <div className="update-time">1天前</div>
                      <div className="update-content">艺术展览活动延期通知</div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </LoadingWrapper>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          padding: 20px;
          color: var(--text-primary);
          position: relative;
        }

        .home-page::before {
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

        .home-container {
          max-width: 1600px;
          margin: 0 auto;
          background: transparent;
          border-radius: 16px;
          overflow: hidden;
        }

        .home-layout {
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          min-height: calc(100vh - 40px);
          gap: 24px;
        }

        .left-sidebar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 12px;
          border: 2px solid #3b82f6;
        }

        .user-details h3 {
          margin: 0;
          font-size: 20px;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .user-details p {
          margin: 4px 0 0;
          font-size: 14px;
          font-weight: 600;
          color: #e0e0e0;
        }

        .filter-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-option {
          padding: 14px 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 17px;
          color: #ffffff;
          text-align: left;
          font-weight: 800;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.8),
                       0 0 24px rgba(59, 130, 246, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .filter-option:hover {
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.18);
          transform: translateX(5px);
          box-shadow: 0 4px 16px 0 rgba(59, 130, 246, 0.3),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
        }

        .filter-option.active {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-weight: 900;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6),
                      0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.3);
          text-shadow: 0 0 15px rgba(255, 255, 255, 1), 
                       0 0 30px rgba(59, 130, 246, 0.8), 
                       0 0 45px rgba(34, 211, 238, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .quick-actions {
          margin-top: 24px;
        }

        .quick-action-btn {
          width: 100%;
          padding: 14px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 17px;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.8),
                       0 0 24px rgba(59, 130, 246, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .quick-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6),
                      0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
          text-shadow: 0 0 15px rgba(255, 255, 255, 1), 
                       0 0 30px rgba(59, 130, 246, 0.8), 
                       0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .main-content {
          padding: 0 24px;
          overflow-y: auto;
        }

        .banner-container {
          position: relative;
          margin-bottom: 24px;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .banner-slider {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        .banner-slide {
          min-width: 100%;
          height: 300px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: bold;
          text-shadow: 0 0 20px rgba(0,0,0,0.8);
          cursor: pointer;
        }

        .banner-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .banner-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background-color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .banner-indicator.active {
          background-color: var(--accent-secondary);
          box-shadow: 0 0 10px var(--accent-secondary);
        }

        .stats-section {
          margin-bottom: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          transition: transform 0.3s;
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
        }
        
        .stat-item:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                      0 8px 24px 0 rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
        }

        .stat-number {
          font-size: 36px;
          font-weight: 800;
          background: var(--gradient-number);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
        }

        .stat-label {
          font-size: 17px;
          color: #ffffff;
          font-weight: 800;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.8),
                       0 0 24px rgba(59, 130, 246, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .layout-section {
          margin-bottom: 24px;
        }

        .right-sidebar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .hot-activity-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .hot-activity-item:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4),
                      0 4px 12px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
        }

        .hot-activity-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 12px;
        }

        .hot-activity-title {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 4px;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.8),
                       0 0 24px rgba(59, 130, 246, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hot-activity-participants {
          font-size: 14px;
          color: var(--text-muted);
        }

        .sidebar-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 24px 0;
        }

        .latest-updates {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .update-item {
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .update-time {
          font-size: 14px;
          color: var(--accent-tertiary);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .update-content {
          font-size: 16px;
          color: #ffffff;
          font-weight: 800;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.8),
                       0 0 24px rgba(59, 130, 246, 0.6),
                       0 2px 4px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 1200px) {
          .home-layout {
            grid-template-columns: 240px 1fr 280px;
          }
        }

        @media (max-width: 992px) {
          .home-layout {
            grid-template-columns: 1fr;
          }
          
          .left-sidebar,
          .right-sidebar {
            display: none;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default HomePage;