// 全局样式定义
// 基于主题配置的统一设计规范实现
import { css } from '@douyinfe/semi-ui/lib/esm/_styles/css';

// 全局重置样式
export const resetStyles = css`
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #1D2129;
    background-color: #F7F8FA;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    height: 100%;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #F2F3F5;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #C9CDD4;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #86909C;
  }
`;

// 通用布局样式
export const layoutStyles = css`
  /* 主容器 */
  .app-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  /* 页面内容区域 */
  .page-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }
  
  /* 卡片容器 */
  .card-container {
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: 16px;
    margin-bottom: 16px;
  }
  
  /* 响应式布局断点 */
  @media (max-width: 768px) {
    .page-content {
      padding: 16px;
    }
    
    .card-container {
      padding: 12px;
    }
  }
`;

// 排版样式
export const typographyStyles = css`
  /* 标题样式 */
  .h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    color: #1D2129;
    margin-bottom: 16px;
  }
  
  .h2 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
    color: #1D2129;
    margin-bottom: 16px;
  }
  
  .h3 {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    color: #1D2129;
    margin-bottom: 12px;
  }
  
  /* 正文样式 */
  .body-text {
    font-size: 16px;
    line-height: 1.6;
    color: #1D2129;
  }
  
  .body-text-secondary {
    font-size: 16px;
    line-height: 1.6;
    color: #4E5969;
  }
  
  .caption {
    font-size: 14px;
    line-height: 1.5;
    color: #86909C;
  }
  
  /* 链接样式 */
  .link {
    color: #276EF1;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .link:hover {
    color: #4989FF;
  }
`;

// 间距工具类
export const spacingStyles = css`
  /* 外边距 */
  .m-0 { margin: 0; }
  .m-xs { margin: 4px; }
  .m-sm { margin: 8px; }
  .m-md { margin: 16px; }
  .m-lg { margin: 24px; }
  .m-xl { margin: 32px; }
  
  /* 内边距 */
  .p-0 { padding: 0; }
  .p-xs { padding: 4px; }
  .p-sm { padding: 8px; }
  .p-md { padding: 16px; }
  .p-lg { padding: 24px; }
  .p-xl { padding: 32px; }
  
  /* 水平间距 */
  .mx-0 { margin-left: 0; margin-right: 0; }
  .mx-xs { margin-left: 4px; margin-right: 4px; }
  .mx-sm { margin-left: 8px; margin-right: 8px; }
  .mx-md { margin-left: 16px; margin-right: 16px; }
  
  /* 垂直间距 */
  .my-0 { margin-top: 0; margin-bottom: 0; }
  .my-xs { margin-top: 4px; margin-bottom: 4px; }
  .my-sm { margin-top: 8px; margin-bottom: 8px; }
  .my-md { margin-top: 16px; margin-bottom: 16px; }
`;

// 导出所有样式
export const globalStyles = css`
  ${resetStyles}
  ${layoutStyles}
  ${typographyStyles}
  ${spacingStyles}
`;

export default globalStyles;
