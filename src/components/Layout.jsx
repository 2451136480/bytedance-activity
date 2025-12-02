import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 导航菜单数据
  const navMenu = [
    {
      id: 'home',
      path: '/',
      label: '活动首页',
      icon: '🏠',
      matchPattern: /^\/$/
    },
    {
      id: 'activities',
      path: '/activities',
      label: '活动列表',
      icon: '📋',
      matchPattern: /^\/activities(\/\d+)?$/
    }
  ];

  // 关闭移动端菜单时添加动画效果
  const closeMenu = () => {
    if (!isMenuOpen) return;

    setIsAnimating(true);
    setIsMenuOpen(false);

    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // 判断是否为当前活动路由
  const isActiveRoute = (menuItem) => {
    return menuItem.matchPattern.test(location.pathname);
  };

  // 处理菜单点击事件
  const handleMenuClick = (menuItem, event) => {
    // 阻止默认行为，先执行动画再导航
    if (isMenuOpen && window.innerWidth <= 768) {
      event.preventDefault();
      closeMenu();

      // 动画结束后导航
      setTimeout(() => {
        navigate(menuItem.path);
      }, 300);
    }
  };

  return (
    <div className="layout-container">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <div className="flex-shrink-0">
            <Link to="/" className="logo-link">
              <h1 className="logo-title">
                <span className="logo-icon">🎯</span>
                <span>活动管理系统</span>
              </h1>
            </Link>
          </div>

          {/* 桌面导航 */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navMenu.map((item) => (
                <li key={item.id} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActiveRoute(item) ? 'active' : ''}`}
                    onClick={(e) => handleMenuClick(item, e)}
                    title={item.label}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActiveRoute(item) && <span className="active-indicator"></span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={() => {
              setIsAnimating(true);
              setIsMenuOpen(!isMenuOpen);
              setTimeout(() => setIsAnimating(false), 300);
            }}
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isMenuOpen}
          >
            <span className="menu-icon-bar top"></span>
            <span className="menu-icon-bar middle"></span>
            <span className="menu-icon-bar bottom"></span>
          </button>
        </div>
      </header>

      {/* 移动端侧边菜单 */}
      <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">导航菜单</h3>
          <button
            className="close-btn"
            onClick={closeMenu}
            aria-label="关闭菜单"
          >
            ✕
          </button>
        </div>
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            {navMenu.map((item) => (
              <li key={item.id} className="mobile-nav-item">
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${isActiveRoute(item) ? 'active' : ''}`}
                  onClick={(e) => handleMenuClick(item, e)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 当前路径显示 */}
        <div className="sidebar-footer">
          <span className="path-label">当前路径:</span>
          <span className="path-value">{location.pathname}</span>
        </div>
      </div>

      {/* 遮罩层 */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* 主要内容区域 */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 活动管理系统. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;