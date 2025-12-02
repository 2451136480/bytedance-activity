// Semi-UI 主题配置文件
// 定义运营平台的统一设计规范

const themeConfig = {
  // 颜色系统 - 主色调
  colors: {
    primary: '#276EF1',
    primaryLight: '#7BA4FF',
    primaryDark: '#0049C6',
    primaryHover: '#4989FF',
    primaryActive: '#003EB3',
    
    // 功能色
    success: '#00B42A',
    warning: '#FF7D00',
    danger: '#F53F3F',
    info: '#86909C',
    
    // 中性色
    bg: {
      1: '#FFFFFF',
      2: '#F7F8FA',
      3: '#F2F3F5',
      4: '#E5E6EB',
    },
    
    text: {
      1: '#1D2129',
      2: '#4E5969',
      3: '#86909C',
      4: '#C9CDD4',
    },
  },
  
  // 字体配置
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      h1: '24px',
      h2: '20px',
      h3: '18px',
      h4: '16px',
      body1: '16px',
      body2: '14px',
      caption: '12px',
    },
    lineHeight: {
      h1: '1.4',
      h2: '1.5',
      h3: '1.5',
      h4: '1.5',
      body1: '1.6',
      body2: '1.6',
      caption: '1.5',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // 间距规范
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // 边框圆角
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    round: '999px',
  },
  
  // 组件特定样式
  componentConfig: {
    Button: {
      paddingXS: '4px 12px',
      paddingSM: '6px 16px',
      paddingMD: '8px 20px',
      paddingLG: '10px 24px',
    },
    Input: {
      paddingXS: '6px 12px',
      paddingSM: '8px 12px',
      paddingMD: '10px 12px',
      paddingLG: '12px 12px',
    },
    Table: {
      fontSize: '14px',
      lineHeight: '1.6',
    },
    Card: {
      padding: '16px',
      marginBottom: '16px',
    },
  },
};

export default themeConfig;
