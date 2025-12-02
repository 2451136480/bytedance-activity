import React from 'react';

/**
 * 分页组件
 * 支持URL参数同步和响应式设计
 */
const Pagination = ({
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange
}) => {
  // 计算总页数
  const totalPages = Math.ceil(totalCount / pageSize);

  // 处理页码点击
  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  // 处理上一页
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  // 处理下一页
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  // 处理首页
  const handleFirstPage = () => {
    handlePageClick(1);
  };

  // 处理末页
  const handleLastPage = () => {
    handlePageClick(totalPages);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange(newPageSize);
  };

  // 生成页码数组
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // 如果总页数小于等于maxVisiblePages，显示所有页码
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // 否则显示当前页附近的页码
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 如果endPage已经到了末尾，调整startPage
    if (endPage === totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
    }

    // 添加开始的页码
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 如果没有数据，不显示分页
  if (totalCount === 0) {
    return null;
  }

  const pageNumbers = generatePageNumbers();

  // 计算显示范围
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="pagination-container">
      {/* 页码信息 */}
      <div className="pagination-info">
        <span className="info-text">
          显示 {startItem}-{endItem} 条，共 {totalCount} 条
        </span>

        {/* 每页条数选择 */}
        <div className="page-size-selector">
          <label htmlFor="pageSize">每页显示：</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="page-size-input"
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size} 条
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 分页控件 */}
      <div className="pagination-controls">
        {/* 首页按钮 */}
        <button
          className={`page-btn page-btn--control ${currentPage === 1 ? 'page-btn--disabled' : ''}`}
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          aria-label="首页"
        >
          &laquo;
        </button>

        {/* 上一页按钮 */}
        <button
          className={`page-btn page-btn--control ${currentPage === 1 ? 'page-btn--disabled' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="上一页"
        >
          &lsaquo;
        </button>

        {/* 页码按钮 */}
        {pageNumbers.map((page, index) => {
          // 检查是否需要显示省略号
          const showEllipsis = index > 0 && page !== pageNumbers[index - 1] + 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="page-btn page-btn--ellipsis">...</span>
              )}
              <button
                className={`page-btn ${page === currentPage ? 'page-btn--active' : ''}`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}

        {/* 下一页按钮 */}
        <button
          className={`page-btn page-btn--control ${currentPage === totalPages ? 'page-btn--disabled' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="下一页"
        >
          &rsaquo;
        </button>

        {/* 末页按钮 */}
        <button
          className={`page-btn page-btn--control ${currentPage === totalPages ? 'page-btn--disabled' : ''}`}
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          aria-label="末页"
        >
          &raquo;
        </button>
      </div>

      {/* 应用内联样式 */}
      <style jsx>{`
        .pagination-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          margin-top: 20px;
          border-top: 1px solid var(--glass-border);
        }
        
        .pagination-info {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .info-text {
          color: var(--text-secondary);
        }
        
        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .page-size-input {
          padding: 4px 8px;
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          font-size: 14px;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
        }
        
        .page-size-input:focus {
          outline: none;
          border-color: var(--accent-tertiary);
        }
        
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .page-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          background-color: transparent;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-btn:hover:not(.page-btn--disabled):not(.page-btn--ellipsis) {
          background-color: rgba(255,255,255,0.1);
          border-color: var(--accent-tertiary);
          color: var(--accent-tertiary);
        }
        
        .page-btn--active {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
          box-shadow: 0 0 10px var(--accent-primary);
        }
        
        .page-btn--active:hover {
          background-color: var(--accent-secondary);
          border-color: var(--accent-secondary);
        }
        
        .page-btn--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: rgba(255,255,255,0.05);
        }
        
        .page-btn--disabled:hover {
          border-color: var(--glass-border);
          background-color: rgba(255,255,255,0.05);
        }
        
        .page-btn--control {
          font-weight: bold;
        }
        
        .page-btn--ellipsis {
          cursor: default;
          border: none;
          background: transparent;
          min-width: 20px;
        }
        
        .page-btn--ellipsis:hover {
          background: transparent;
          border: none;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column;
            gap: 16px;
          }
          
          .pagination-info {
            justify-content: center;
          }
          
          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .page-size-selector {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;