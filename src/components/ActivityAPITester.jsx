import React, { useState } from 'react';
import activityAPI from '../services/activityAPI';

const ActivityAPITester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState(null);

  // 运行测试的通用函数
  const runTest = async (testName, testFunction) => {
    setActiveTest(testName);
    setLoading(true);
    setResults({ ...results, [testName]: { status: 'running' } });

    try {
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [testName]: { status: 'success', data: result }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testName]: { status: 'error', error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // 测试函数
  const tests = {
    homeActivities: async () => {
      return await activityAPI.getHomeActivities({ limit: 3 });
    },
    activityList: async () => {
      return await activityAPI.getActivityList({
        page: 1,
        pageSize: 5,
        status: activityAPI.constants.ACTIVITY_STATUS.ONGOING
      });
    },
    activityDetail: async () => {
      return await activityAPI.getActivityDetail('1');
    },
    searchTest: async () => {
      return await activityAPI.getActivityList({
        page: 1,
        pageSize: 10,
        keyword: '直播'
      });
    },
    invalidIdTest: async () => {
      try {
        await activityAPI.getActivityDetail('999999');
        return { success: false, message: '应该抛出错误但没有' };
      } catch (error) {
        return { success: true, error: error.message };
      }
    },
    validationTest: async () => {
      try {
        await activityAPI.getActivityList({
          pageSize: 200,
          status: 'invalid_status'
        });
        return { success: false, message: '应该抛出参数验证错误但没有' };
      } catch (error) {
        return { success: true, error: error.message };
      }
    }
  };

  const testLabels = {
    homeActivities: '获取首页活动',
    activityList: '获取活动列表',
    activityDetail: '获取活动详情',
    searchTest: '关键词搜索',
    invalidIdTest: '无效ID测试',
    validationTest: '参数验证测试'
  };

  const reset = () => {
    setResults({});
    setActiveTest(null);
  };

  return (
    <div style={styles.container}>
      <h2>活动管理API测试工具</h2>
      <div style={styles.buttons}>
        {Object.entries(tests).map(([key, testFn]) => (
          <button
            key={key}
            onClick={() => runTest(key, testFn)}
            disabled={loading}
            style={{
              ...styles.button,
              ...(activeTest === key ? styles.activeButton : {})
            }}
          >
            {testLabels[key]}
          </button>
        ))}
        <button onClick={reset} style={styles.resetButton}>
          重置测试
        </button>
      </div>

      <div style={styles.results}>
        {Object.entries(results).map(([testName, result]) => (
          <div key={testName} style={styles.resultItem}>
            <h4>{testLabels[testName]}</h4>
            <div style={{
              ...styles.status,
              ...(result.status === 'success' ? styles.success : 
                 result.status === 'error' ? styles.error : styles.running)
            }}>
              {result.status === 'success' && '✓ 成功'}
              {result.status === 'error' && '✗ 失败'}
              {result.status === 'running' && '⏳ 运行中'}
            </div>
            {result.data && (
              <pre style={styles.data}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
            {result.error && (
              <div style={styles.errorText}>
                错误: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.summary}>
        <h4>API信息</h4>
        <pre>
          状态常量: {JSON.stringify(activityAPI.constants.ACTIVITY_STATUS, null, 2)}
        </pre>
        <pre>
          类型常量: {JSON.stringify(activityAPI.constants.ACTIVITY_TYPE, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1677ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  },
  activeButton: {
    backgroundColor: '#0958d9'
  },
  resetButton: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  results: {
    marginTop: '20px'
  },
  resultItem: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    backgroundColor: '#fafafa'
  },
  status: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '10px'
  },
  success: {
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f'
  },
  error: {
    backgroundColor: '#fff2f0',
    color: '#ff4d4f',
    border: '1px solid #ffccc7'
  },
  running: {
    backgroundColor: '#e6f7ff',
    color: '#1677ff',
    border: '1px solid #91d5ff'
  },
  data: {
    backgroundColor: 'white',
    padding: '10px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    overflowX: 'auto',
    fontSize: '12px'
  },
  errorText: {
    color: '#ff4d4f',
    backgroundColor: '#fff2f0',
    padding: '10px',
    border: '1px solid #ffccc7',
    borderRadius: '4px'
  },
  summary: {
    marginTop: '30px',
    padding: '15px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    backgroundColor: '#fafafa'
  }
};

export default ActivityAPITester;