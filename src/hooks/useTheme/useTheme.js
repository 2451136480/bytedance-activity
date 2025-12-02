import { useState, useEffect } from 'react';
import { useConfig } from '@douyinfe/semi-ui';

/**
 * 主题管理自定义Hook
 * 提供主题切换、主题状态管理功能
 */
const useTheme = () => {
  // 使用Semi-UI的Config上下文获取当前主题配置
  const { themeMode, setThemeMode } = useConfig();
  
  // 本地状态管理主题
  const [currentTheme, setCurrentTheme] = useState(themeMode || 'light');
  
  // 监听系统主题变化
  const [systemTheme, setSystemTheme] = useState('light');
  
  // 主题切换函数
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setThemeMode(newTheme);
    // 保存主题偏好到本地存储
    localStorage.setItem('theme-preference', newTheme);
  };
  
  // 设置指定主题
  const setTheme = (theme) => {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Theme must be either "light" or "dark"');
      return;
    }
    
    setCurrentTheme(theme);
    setThemeMode(theme);
    localStorage.setItem('theme-preference', theme);
  };
  
  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 初始设置
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // 监听变化
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // 从本地存储恢复主题偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  // 判断是否为暗色主题
  const isDarkTheme = currentTheme === 'dark';
  
  return {
    currentTheme,
    isDarkTheme,
    systemTheme,
    toggleTheme,
    setTheme,
  };
};

export default useTheme;
