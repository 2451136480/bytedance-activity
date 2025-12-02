import { useState, useEffect } from 'react';

// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '新年晚会',
    date: '2025-01-01',
    location: '线上直播',
    participants: 1234
  },
  {
    id: 2,
    title: '技术分享会',
    date: '2025-01-15',
    location: '北京总部',
    participants: 256
  },
  {
    id: 3,
    title: '产品发布会',
    date: '2025-02-10',
    location: '上海国际会议中心',
    participants: 500
  }
];

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 模拟API请求获取数据
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        setActivities(mockActivities);
      } catch (error) {
        console.error('获取活动列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="activity-list">
      <h2>活动列表</h2>
      {activities.length === 0 ? (
        <p className="no-activities">暂无活动数据</p>
      ) : (
        <ul className="activities-container">
          {activities.map(activity => (
            <li key={activity.id} className="activity-item">
              <div className="activity-header">
                <h3>{activity.title}</h3>
                <span className="activity-date">{activity.date}</span>
              </div>
              <div className="activity-info">
                <p>地点: {activity.location}</p>
                <p>参与人数: {activity.participants}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;

// 组件样式
const styles = `
.activity-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.activity-list h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #667eea;
  font-size: 1.1rem;
}

.no-activities {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.activities-container {
  list-style: none;
}

.activity-item {
  padding: 1rem;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-header h3 {
  margin: 0;
  color: #667eea;
  font-size: 1.3rem;
}

.activity-date {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.activity-info {
  color: #666;
  line-height: 1.6;
}

.activity-info p {
  margin: 0.25rem 0;
}
`;

// 添加样式到文档中
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}