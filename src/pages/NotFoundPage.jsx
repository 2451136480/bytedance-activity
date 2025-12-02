import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h2>页面未找到</h2>
        <p>很抱歉，您访问的页面不存在或已被移除</p>
        

        
        <div className="action-buttons">
          <button 
            className="primary-button"
            onClick={() => navigate('/')}
          >
            返回首页
          </button>
          <button 
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;