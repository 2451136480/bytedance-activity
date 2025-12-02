import React, { useState, useEffect } from 'react';
import { getStatusOptions } from '../../hooks/useActivityFilters';

/**
 * 活动筛选栏组件
 */
const ActivityFilterBar = ({ filters, onFilterChange, onReset, debouncedSearch }) => {
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || '');
  const statusOptions = getStatusOptions();

  // 当外部filters变化时更新本地关键词状态
  useEffect(() => {
    setLocalKeyword(filters.keyword || '');
  }, [filters.keyword]);

  // 处理关键词输入变化
  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setLocalKeyword(value);
    // 使用防抖搜索
    debouncedSearch(value);
  };

  // 处理状态选择变化
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value, page: 1 });
  };

  // 处理日期范围变化
  const handleDateChange = (field, value) => {
    onFilterChange({ [field]: value, page: 1 });
  };

  // 处理重置按钮点击
  const handleReset = () => {
    setLocalKeyword('');
    onReset();
  };

  return (
    <div className="activity-filter-bar">
      <div className="filter-bar__container">
        {/* 状态筛选 */}
        <div className="filter-item">
          <label htmlFor="status-filter">状态：</label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="filter-input filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 关键词搜索 */}
        <div className="filter-item filter-item--search">
          <label htmlFor="keyword-search">关键词：</label>
          <input
            id="keyword-search"
            type="text"
            value={localKeyword}
            onChange={handleKeywordChange}
            placeholder="搜索活动名称或描述"
            className="filter-input filter-search-input"
          />
        </div>

        {/* 日期范围筛选 */}
        <div className="filter-item">
          <label htmlFor="start-date">开始日期：</label>
          <input
            id="start-date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="filter-input filter-date-input"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="end-date">结束日期：</label>
          <input
            id="end-date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="filter-input filter-date-input"
          />
        </div>

        {/* 重置按钮 */}
        <div className="filter-item filter-item--actions">
          <button
            onClick={handleReset}
            className="filter-reset-btn"
            disabled={!filters.status && !filters.keyword && !filters.startDate && !filters.endDate}
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 应用内联样式 */}
      <style jsx>{`
        .activity-filter-bar {
          background-color: var(--glass-bg);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: var(--card-radius);
          margin-bottom: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }
        
        .filter-bar__container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }
        
        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }
        
        .filter-item--search {
          flex: 1 0 auto;
          min-width: 200px;
        }
        
        .filter-item--actions {
          margin-left: auto;
        }
        
        label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        
        .filter-input {
          padding: 8px 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          transition: all 0.3s;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: var(--accent-tertiary);
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
          background: rgba(255,255,255,0.1);
        }
        
        .filter-search-input {
          width: 100%;
          max-width: 300px;
        }
        
        .filter-select {
          min-width: 120px;
          cursor: pointer;
        }
        
        .filter-select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .filter-date-input {
          min-width: 150px;
          color-scheme: dark;
        }
        
        .filter-reset-btn {
          padding: 8px 16px;
          background-color: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .filter-reset-btn:hover:not(:disabled) {
          background-color: rgba(255,255,255,0.1);
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        
        .filter-reset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .filter-bar__container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-item {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-item--search,
          .filter-item--actions {
            flex: 1 0 auto;
            margin-left: 0;
          }
          
          .filter-search-input {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityFilterBar;