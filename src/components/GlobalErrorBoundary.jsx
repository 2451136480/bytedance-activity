import React from 'react';
// 移除不存在的样式导入

/**
 * 全局错误边界组件
 * 捕获并处理React组件树中的JavaScript错误
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下一次渲染将显示降级UI
    return {
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里记录错误信息到错误监控服务
    console.error('Global Error:', error);
    console.error('Error Info:', errorInfo);
    
    // 可选：发送错误报告到后端服务
    try {
      // 这里可以添加错误上报逻辑
      // 例如：fetch('/api/error-report', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
    } catch (reportError) {
      console.warn('Failed to report error:', reportError);
    }
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // 重置错误状态，重新渲染正常UI
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // 可选：刷新页面以确保应用状态完全重置
    if (this.props.forceRefreshOnReset) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // 自定义错误UI
      return (
        <div className="global-error-boundary">
          <div className="global-error-container">
            <div className="global-error-icon">💥</div>
            <h1 className="global-error-title">应用发生错误</h1>
            <div className="global-error-content">
              <p className="global-error-message">
                抱歉，应用在运行过程中遇到了问题。
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="global-error-details">
                  <h3>错误详情：</h3>
                  <pre className="global-error-stack">
                    {this.state.error?.toString() || '未知错误'}
                  </pre>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="global-error-component-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
            <div className="global-error-actions">
              <button 
                className="global-error-reset-button" 
                onClick={this.handleReset}
              >
                重试
              </button>
              <button 
                className="global-error-reload-button"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 正常情况下，渲染子组件
    return this.props.children;
  }
}

export default GlobalErrorBoundary;