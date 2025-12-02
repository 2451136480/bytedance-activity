// 活动列表模拟数据
// 定义运营平台活动的数据结构和示例数据

/**
 * 活动状态枚举
 * @type {Object}
 */
export const ACTIVITY_STATUS = {
  UPCOMING: 'upcoming',    // 未开始
  ONGOING: 'ongoing',      // 进行中
  ENDED: 'ended',          // 已结束
};

/**
 * 活动类型枚举
 * @type {Object}
 */
export const ACTIVITY_TYPE = {
  COUPON: 'coupon',        // 优惠券活动
  DISCOUNT: 'discount',    // 折扣活动
  GIFT: 'gift',            // 赠品活动
  FLASH_SALE: 'flashSale', // 限时抢购
  NEW_PRODUCT: 'newProduct', // 新品发布
};

/**
 * 模拟活动列表数据
 * @type {Array}
 */
const mockActivities = [
  {
    id: '1',
    title: '618电商大促',
    description: '年中最大规模促销活动，全场低至5折，更有满减优惠券等你来拿！',
    type: ACTIVITY_TYPE.DISCOUNT,
    status: ACTIVITY_STATUS.ONGOING,
    startTime: '2025-06-16T00:00:00',
    endTime: '2025-06-20T23:59:59',
    coverImage: '/vite.svg',
    bannerImage: '/vite.svg',
    rules: '1. 全场商品享受不同折扣\n2. 满299减50，满499减100\n3. 优惠券不可与其他活动叠加',
    participateCount: 15324,
    viewsCount: 56789,
    createdAt: '2025-06-01T10:00:00',
    updatedAt: '2025-06-15T14:30:00',
    createdBy: 'system',
    priority: 100,
    isFeatured: true,
    
    // 参与数据统计
    stats: {
      totalParticipants: 15324,
      totalOrders: 8765,
      totalSales: 3456789,
      conversionRate: 0.572,
    },
  },
  {
    id: '2',
    title: '新品发布会',
    description: '全新系列产品正式发布，首发用户享优惠价并获赠精美礼品！',
    type: ACTIVITY_TYPE.NEW_PRODUCT,
    status: ACTIVITY_STATUS.UPCOMING,
    startTime: '2025-07-01T14:00:00',
    endTime: '2025-07-07T23:59:59',
    coverImage: '/vite.svg',
    bannerImage: '/vite.svg',
    rules: '1. 新品首发价限时7天\n2. 前500名下单用户赠送精美礼品\n3. 支持预售和分期付款',
    participateCount: 0,
    viewsCount: 28901,
    createdAt: '2025-06-20T09:00:00',
    updatedAt: '2025-06-25T16:45:00',
    createdBy: 'system',
    priority: 90,
    isFeatured: true,
    
    stats: {
      totalParticipants: 0,
      totalOrders: 0,
      totalSales: 0,
      conversionRate: 0,
    },
  },
  {
    id: '3',
    title: '限时秒杀活动',
    description: '每日限量秒杀，超值商品低至1折，先到先得！',
    type: ACTIVITY_TYPE.FLASH_SALE,
    status: ACTIVITY_STATUS.ONGOING,
    startTime: '2025-06-10T00:00:00',
    endTime: '2025-06-30T23:59:59',
    coverImage: '/vite.svg',
    bannerImage: '/vite.svg',
    rules: '1. 每日10点、14点、20点准时开抢\n2. 每个用户每种商品限抢1件\n3. 秒杀商品不支持退换货',
    participateCount: 32456,
    viewsCount: 89012,
    createdAt: '2025-06-05T11:30:00',
    updatedAt: '2025-06-18T10:15:00',
    createdBy: 'system',
    priority: 80,
    isFeatured: false,
    
    stats: {
      totalParticipants: 32456,
      totalOrders: 12345,
      totalSales: 1234567,
      conversionRate: 0.380,
    },
  },
  {
    id: '4',
    title: '会员专享日',
    description: 'VIP会员专享特权，额外95折，还有专属礼品和积分双倍奖励！',
    type: ACTIVITY_TYPE.COUPON,
    status: ACTIVITY_STATUS.ENDED,
    startTime: '2025-06-01T00:00:00',
    endTime: '2025-06-10T23:59:59',
    coverImage: '/vite.svg',
    bannerImage: '/vite.svg',
    rules: '1. VIP会员额外95折优惠\n2. 积分双倍累积\n3. 会员专享礼品限量发放',
    participateCount: 8901,
    viewsCount: 45678,
    createdAt: '2025-05-25T13:00:00',
    updatedAt: '2025-06-10T23:59:59',
    createdBy: 'system',
    priority: 70,
    isFeatured: false,
    
    stats: {
      totalParticipants: 8901,
      totalOrders: 5678,
      totalSales: 2345678,
      conversionRate: 0.638,
    },
  },
  {
    id: '5',
    title: '满额赠礼活动',
    description: '购物满指定金额，即送精美礼品，多买多送！',
    type: ACTIVITY_TYPE.GIFT,
    status: ACTIVITY_STATUS.ONGOING,
    startTime: '2025-06-15T00:00:00',
    endTime: '2025-06-25T23:59:59',
    coverImage: '/vite.svg',
    bannerImage: '/vite.svg',
    rules: '1. 满399送精美笔记本\n2. 满799送品牌雨伞\n3. 满1299送运动手环\n4. 满2999送智能音箱',
    participateCount: 7654,
    viewsCount: 34567,
    createdAt: '2025-06-10T15:20:00',
    updatedAt: '2025-06-18T09:30:00',
    createdBy: 'system',
    priority: 60,
    isFeatured: true,
    
    stats: {
      totalParticipants: 7654,
      totalOrders: 4321,
      totalSales: 3456789,
      conversionRate: 0.565,
    },
  },
];

/**
 * 获取活动列表（支持分页和筛选）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.status - 活动状态筛选
 * @param {string} params.type - 活动类型筛选
 * @param {string} params.keyword - 关键词搜索
 * @param {string} params.startTime - 开始时间筛选
 * @param {string} params.endTime - 结束时间筛选
 * @returns {Object} 包含活动列表和分页信息的对象
 */
export const getActivityList = ({ 
  page = 1, 
  pageSize = 10, 
  status = '', 
  type = '', 
  keyword = '',
  startTime = '',
  endTime = ''
} = {}) => {
  let filtered = [...mockActivities];
  
  // 状态筛选
  if (status && Object.values(ACTIVITY_STATUS).includes(status)) {
    filtered = filtered.filter(activity => activity.status === status);
  }
  
  // 类型筛选
  if (type && Object.values(ACTIVITY_TYPE).includes(type)) {
    filtered = filtered.filter(activity => activity.type === type);
  }
  
  // 关键词搜索（标题、描述）
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(activity => 
      activity.title.toLowerCase().includes(lowerKeyword) ||
      activity.description.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 开始时间筛选
  if (startTime) {
    const startDate = new Date(startTime);
    filtered = filtered.filter(activity => 
      new Date(activity.startTime) >= startDate
    );
  }
  
  // 结束时间筛选
  if (endTime) {
    const endDate = new Date(endTime);
    filtered = filtered.filter(activity => 
      new Date(activity.endTime) <= endDate
    );
  }
  
  // 按创建时间降序排序
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 分页计算
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);
  
  return {
    list: paginatedData,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

/**
 * 分页获取活动列表（兼容旧接口）
 * @param {Object} params - 查询参数
 * @returns {Object} 分页结果
 */
export const getActivities = (params) => {
  return getActivityList(params);
};

/**
 * 根据ID获取活动详情
 * @param {string} id - 活动ID
 * @returns {Object|null} 活动详情或null
 */
export const getActivityById = (id) => {
  return mockActivities.find(activity => activity.id === id) || null;
};

/**
 * 根据ID获取活动详情（别名）
 * @param {string} id - 活动ID
 * @returns {Object|null} 活动详情或null
 */
export const getActivityDetail = (id) => {
  return getActivityById(id);
};

/**
 * 更新活动信息
 * @param {string} id - 活动ID
 * @param {Object} updates - 要更新的字段
 * @returns {Object|null} 更新后的活动详情或null
 */
export const updateActivity = (id, updates) => {
  const index = mockActivities.findIndex(activity => activity.id === id);
  
  if (index !== -1) {
    mockActivities[index] = {
      ...mockActivities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockActivities[index];
  }
  
  return null;
};

/**
 * 获取首页重点活动
 * @param {number} limit - 限制返回数量
 * @returns {Array} 重点活动列表
 */
export const getHomeActivities = (limit = 4) => {
  // 优先返回进行中和未开始的活动，并按优先级排序
  return mockActivities
    .filter(activity => 
      activity.status === ACTIVITY_STATUS.ONGOING || 
      activity.status === ACTIVITY_STATUS.UPCOMING
    )
    .sort((a, b) => {
      // 先按isFeatured排序，再按priority排序
      if (a.isFeatured !== b.isFeatured) {
        return b.isFeatured ? 1 : -1;
      }
      return a.priority - b.priority;
    })
    .slice(0, limit);
};

/**
 * 验证筛选参数
 * @param {Object} params - 要验证的参数
 * @returns {Object} 验证结果 { isValid, errors }
 */
export const validateFilterParams = (params) => {
  const errors = [];
  
  // 验证页码
  if (params.page && (typeof params.page !== 'number' || params.page < 1)) {
    errors.push('页码必须是大于0的整数');
  }
  
  // 验证每页大小
  if (params.pageSize && (typeof params.pageSize !== 'number' || params.pageSize < 1 || params.pageSize > 100)) {
    errors.push('每页大小必须是1-100之间的整数');
  }
  
  // 验证状态
  if (params.status && !Object.values(ACTIVITY_STATUS).includes(params.status)) {
    errors.push(`无效的活动状态，必须是以下之一: ${Object.values(ACTIVITY_STATUS).join(', ')}`);
  }
  
  // 验证类型
  if (params.type && !Object.values(ACTIVITY_TYPE).includes(params.type)) {
    errors.push(`无效的活动类型，必须是以下之一: ${Object.values(ACTIVITY_TYPE).join(', ')}`);
  }
  
  // 验证日期格式
  if (params.startTime) {
    const startDate = new Date(params.startTime);
    if (isNaN(startDate.getTime())) {
      errors.push('开始时间格式无效');
    }
  }
  
  if (params.endTime) {
    const endDate = new Date(params.endTime);
    if (isNaN(endDate.getTime())) {
      errors.push('结束时间格式无效');
    }
  }
  
  // 验证开始时间不能晚于结束时间
  if (params.startTime && params.endTime) {
    const startDate = new Date(params.startTime);
    const endDate = new Date(params.endTime);
    if (startDate > endDate) {
      errors.push('开始时间不能晚于结束时间');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default mockActivities;
