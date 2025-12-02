import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 活动列表筛选Hook
 * 管理URL参数同步、筛选状态和防抖搜索
 */
const useActivityFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 从URL参数初始化筛选状态
  const getInitialFilters = useCallback(() => {
    return {
      status: searchParams.get('status') || '',
      keyword: searchParams.get('keyword') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      page: parseInt(searchParams.get('page')) || 1,
      pageSize: parseInt(searchParams.get('pageSize')) || 10
    };
  }, [searchParams]);

  // 本地筛选状态
  const [filters, setFilters] = useState(getInitialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // 防抖定时器使用useRef存储，确保正确清除
  const debounceTimerRef = useRef(null);

  // 当URL参数变化时更新本地状态，避免不必要的重渲染
  useEffect(() => {
    const newFilters = getInitialFilters();
    // 只有当筛选条件真正变化时才更新状态
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
  }, [getInitialFilters, filters]);

  /**
   * 更新筛选条件并同步到URL
   */
  const updateFilters = useCallback((newFilters) => {
    // 验证新筛选条件
    const validFilterNames = ['status', 'keyword', 'startDate', 'endDate', 'page', 'pageSize'];
    Object.keys(newFilters).forEach(filterName => {
      if (!validFilterNames.includes(filterName)) {
        console.warn(`Invalid filter name: ${filterName}`);
        return;
      }
    });

    const updatedFilters = { ...filters, ...newFilters };

    // 确保页码和页面大小为有效数字
    if (updatedFilters.page) {
      updatedFilters.page = Number.isInteger(updatedFilters.page) && updatedFilters.page > 0 ? updatedFilters.page : 1;
    }
    if (updatedFilters.pageSize) {
      updatedFilters.pageSize = Number.isInteger(updatedFilters.pageSize) && updatedFilters.pageSize > 0 ? updatedFilters.pageSize : 10;
    }

    setFilters(updatedFilters);

    // 构建URL参数
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // 日期格式化
        if ((key === 'startDate' || key === 'endDate') && value instanceof Date) {
          params.set(key, value.toISOString().split('T')[0]);
        } else {
          params.set(key, value.toString());
        }
      }
    });

    // 更新URL，不触发页面重载
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, navigate]);

  /**
   * 防抖搜索
   */
  const debouncedSearch = useCallback((keyword) => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 设置新的防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      updateFilters({ keyword, page: 1 });
    }, 300);
  }, [updateFilters]);

  /**
   * 重置所有筛选条件
   */
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      status: '',
      keyword: '',
      startDate: '',
      endDate: '',
      page: 1,
      pageSize: 10
    };
    setFilters(defaultFilters);
    navigate({ search: '' }, { replace: true });
  }, [navigate]);

  /**
   * 更新页面
   */
  const setPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  /**
   * 更新页面大小
   */
  const setPageSize = useCallback((pageSize) => {
    updateFilters({ pageSize, page: 1 });
  }, [updateFilters]);

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * 生成模拟数据的函数
   */
  const generateMockData = useCallback((page = 1, pageSize = 10, filterOptions = {}) => {
    // 生成更大的模拟数据集以支持各种筛选场景
    const totalItems = 500;

    // 先生成完整的数据集
    let allActivities = [];
    for (let i = 0; i < totalItems; i++) {
      // 生成更丰富的状态分布
      const statuses = ['ongoing', 'upcoming', 'ended'];
      const statusWeights = [0.4, 0.3, 0.3]; // 权重分布
      let status;
      const random = Math.random();

      if (random < statusWeights[0]) {
        status = statuses[0]; // ongoing
      } else if (random < statusWeights[0] + statusWeights[1]) {
        status = statuses[1]; // upcoming
      } else {
        status = statuses[2]; // ended
      }

      // 生成更真实的时间数据
      const now = Date.now();
      let startTime, endTime;

      switch (status) {
        case 'ongoing':
          startTime = now - Math.random() * 7 * 24 * 60 * 60 * 1000; // 过去7天内开始
          endTime = now + Math.random() * 7 * 24 * 60 * 60 * 1000; // 未来7天内结束
          break;
        case 'upcoming':
          startTime = now + Math.random() * 14 * 24 * 60 * 60 * 1000; // 未来14天内开始
          endTime = startTime + Math.random() * 7 * 24 * 60 * 60 * 1000; // 活动持续最多7天
          break;
        case 'ended':
          endTime = now - Math.random() * 30 * 24 * 60 * 60 * 1000; // 过去30天内结束
          startTime = endTime - Math.random() * 7 * 24 * 60 * 60 * 1000; // 活动持续最多7天
          break;
        default:
          startTime = now;
          endTime = now + 24 * 60 * 60 * 1000;
      }

      // 活动标题和描述模板
      const titles = [
        '技术沙龙：',
        '产品发布会：',
        '用户见面会：',
        '线上研讨会：',
        '行业峰会：',
        '开发者大会：',
        '创新工作坊：',
        '圆桌论坛：'
      ];

      const topics = [
        'AI技术应用',
        '前端框架演进',
        '云原生实践',
        '用户体验设计',
        '大数据分析',
        '移动开发趋势',
        '安全防护策略',
        '性能优化技巧'
      ];

      const titlePrefix = titles[Math.floor(Math.random() * titles.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      const activityTitle = `${titlePrefix}${topic} ${i + 1}`;

      // 生成分类数据
      const categories = [
        { id: 'tech', name: '技术分享' },
        { id: 'product', name: '产品发布' },
        { id: 'user', name: '用户活动' },
        { id: 'online', name: '线上研讨会' },
        { id: 'offline', name: '线下聚会' }
      ];

      const category = categories[Math.floor(Math.random() * categories.length)];

      // 使用真实图片路径,循环使用4张图片
      const images = [
        '/src/img/jzg.jpeg',
        '/src/img/qt.jpg',
        '/src/img/tt.jpg',
        '/src/img/xh.jpg'
      ];
      const coverImage = images[i % images.length];

      allActivities.push({
        id: `activity-${i + 1}`,
        title: activityTitle,
        description: `这是一个关于${topic}的${status === 'ongoing' ? '正在进行' : status === 'upcoming' ? '即将开始' : '已结束'}活动,我们邀请了行业专家分享最新见解和实践经验。`,
        status: status,
        coverImage: coverImage,
        image: coverImage,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        participantCount: Math.floor(Math.random() * 1000) + 50,
        participants: Math.floor(Math.random() * 1000) + 50,
        likes: Math.floor(Math.random() * 500) + 20,
        categoryId: category.id,
        categoryName: category.name,
        location: Math.random() > 0.5 ? '线上' : '线下'
      });
    }

    // 应用筛选条件
    let filteredActivities = [...allActivities];

    // 状态筛选
    if (filterOptions.status && filterOptions.status !== 'all') {
      filteredActivities = filteredActivities.filter(activity =>
        activity.status === filterOptions.status
      );
    }

    // 关键词搜索
    if (filterOptions.keyword) {
      const keyword = filterOptions.keyword.toLowerCase();
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.toLowerCase().includes(keyword) ||
        activity.description.toLowerCase().includes(keyword) ||
        activity.categoryName.toLowerCase().includes(keyword)
      );
    }

    // 时间范围筛选（支持startTime/endTime或startDate/endDate）
    const startDate = filterOptions.startTime || filterOptions.startDate;
    const endDate = filterOptions.endTime || filterOptions.endDate;

    if (startDate || endDate) {
      filteredActivities = filteredActivities.filter(activity => {
        const activityStart = new Date(activity.startTime).getTime();
        const activityEnd = new Date(activity.endTime).getTime();

        if (startDate) {
          const filterStart = new Date(startDate).getTime();
          // 活动结束时间必须大于筛选开始时间
          if (activityEnd < filterStart) return false;
        }

        if (endDate) {
          const filterEnd = new Date(endDate).getTime();
          // 活动开始时间必须小于筛选结束时间
          if (activityStart > filterEnd) return false;
        }

        return true;
      });
    }

    // 应用分页
    const startIndex = (page - 1) * pageSize;
    const paginatedActivities = filteredActivities.slice(
      startIndex,
      startIndex + pageSize
    );

    return {
      activities: paginatedActivities,
      total: filteredActivities.length,
      page,
      pageSize,
      filters: filterOptions
    };
  }, []);

  return {
    filters,
    isLoading,
    setIsLoading,
    updateFilters,
    debouncedSearch,
    resetFilters,
    setPage,
    setPageSize,
    generateMockData,
    // 为了与ActivityListPage更好集成，添加别名
    pagination: {
      current: filters.page,
      pageSize: filters.pageSize,
      total: 0 // 初始值，会在组件中更新
    },
    updateFilter: (key, value) => updateFilters({ [key]: value }),
    updatePagination: (page, pageSize, total) => {
      if (pageSize !== undefined) {
        setPageSize(pageSize);
      } else {
        setPage(page);
      }
      // total参数用于兼容ActivityListPage的调用，但不实际使用
    }
  };
};

/**
 * 获取活动状态选项
 */
export const getStatusOptions = () => [
  { value: '', label: '全部状态' },
  { value: 'active', label: '进行中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'completed', label: '已结束' }
];

/**
 * 格式化日期为ISO字符串（YYYY-MM-DD）
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export default useActivityFilters;