import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from '@douyinfe/semi-ui';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ActivityListPage from './pages/ActivityListPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import GlobalLoading from './components/GlobalLoading';
import themeConfig from './themes/themeConfig';
import { initMockData } from './mock/main';

function App() {
  const [theme, setTheme] = useState('light');
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  // 初始化应用数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setAppLoading(true);
        // 初始化模拟数据
        await initMockData();
        // 模拟应用初始化延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        setAppLoading(false);
      } catch (error) {
        console.error('应用初始化失败:', error);
        setAppError(error);
        setAppLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 应用加载中状态
  if (appLoading) {
    return (
      <GlobalLoading 
        type="spinner" 
        size="large" 
        message="应用启动中..." 
        fullScreen 
      />
    );
  }

  // 应用初始化错误状态
  if (appError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>应用初始化失败</h2>
        <p>{appError.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <GlobalErrorBoundary>
      <ConfigProvider theme={themeConfig} themeMode={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="activities" element={<ActivityListPage />} />
              <Route path="activities/:id" element={<ActivityDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
