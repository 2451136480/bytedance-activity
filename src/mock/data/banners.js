// Banner模拟数据
// 定义Banner的数据结构和示例数据

/**
 * Banner状态枚举
 * @type {Object}
 */
export const BANNER_STATUS = {
  ACTIVE: 'active',       // 启用
  INACTIVE: 'inactive',   // 禁用
};

/**
 * Banner类型枚举
 * @type {Object}
 */
export const BANNER_TYPE = {
  PROMOTION: 'promotion',  // 促销活动
  NEW_PRODUCT: 'newProduct', // 新品发布
  ANNOUNCEMENT: 'announcement', // 公告
  EXTERNAL_LINK: 'externalLink', // 外部链接
};

/**
 * 模拟Banner数据
 * @type {Array}
 */
const mockBanners = [
  {
    id: '1',
    title: '618电商大促',
    description: '年中最大规模促销活动，全场低至5折',
    imageUrl: '/vite.svg',
    linkUrl: '/activities/1',
    type: BANNER_TYPE.PROMOTION,
    status: BANNER_STATUS.ACTIVE,
    sortOrder: 1,
    startTime: '2025-06-16T00:00:00',
    endTime: '2025-06-20T23:59:59',
    targetActivityId: '1',
    clickCount: 12543,
    displayCount: 56789,
    createdAt: '2025-06-01T10:00:00',
    updatedAt: '2025-06-15T14:30:00',
    createdBy: 'system',
    isFullWidth: false,
    backgroundColor: '#276EF1',
    
    // 响应式配置
    responsiveConfig: {
      mobile: {
        imageUrl: '/vite.svg',
        height: '180px',
      },
      tablet: {
        imageUrl: '/vite.svg',
        height: '240px',
      },
      desktop: {
        imageUrl: '/vite.svg',
        height: '320px',
      },
    },
  },
  {
    id: '2',
    title: '新品发布会',
    description: '全新系列产品正式发布，首发享优惠价',
    imageUrl: '/vite.svg',
    linkUrl: '/activities/2',
    type: BANNER_TYPE.NEW_PRODUCT,
    status: BANNER_STATUS.ACTIVE,
    sortOrder: 2,
    startTime: '2025-06-20T00:00:00',
    endTime: '2025-07-07T23:59:59',
    targetActivityId: '2',
    clickCount: 8901,
    displayCount: 45678,
    createdAt: '2025-06-10T15:20:00',
    updatedAt: '2025-06-18T09:30:00',
    createdBy: 'system',
    isFullWidth: true,
    backgroundColor: '#00B42A',
    
    responsiveConfig: {
      mobile: {
        imageUrl: '/vite.svg',
        height: '180px',
      },
      tablet: {
        imageUrl: '/vite.svg',
        height: '240px',
      },
      desktop: {
        imageUrl: '/vite.svg',
        height: '400px',
      },
    },
  },
  {
    id: '3',
    title: '限时秒杀活动',
    description: '每日限量秒杀，超值商品低至1折',
    imageUrl: '/vite.svg',
    linkUrl: '/activities/3',
    type: BANNER_TYPE.PROMOTION,
    status: BANNER_STATUS.ACTIVE,
    sortOrder: 3,
    startTime: '2025-06-10T00:00:00',
    endTime: '2025-06-30T23:59:59',
    targetActivityId: '3',
    clickCount: 15678,
    displayCount: 78901,
    createdAt: '2025-06-05T11:30:00',
    updatedAt: '2025-06-18T10:15:00',
    createdBy: 'system',
    isFullWidth: false,
    backgroundColor: '#F53F3F',
    
    responsiveConfig: {
      mobile: {
        imageUrl: '/vite.svg',
        height: '180px',
      },
      tablet: {
        imageUrl: '/vite.svg',
        height: '240px',
      },
      desktop: {
        imageUrl: '/vite.svg',
        height: '320px',
      },
    },
  },
  {
    id: '4',
    title: '平台公告',
    description: '关于系统升级维护的公告',
    imageUrl: '/vite.svg',
    linkUrl: '/announcements/1',
    type: BANNER_TYPE.ANNOUNCEMENT,
    status: BANNER_STATUS.ACTIVE,
    sortOrder: 4,
    startTime: '2025-06-15T00:00:00',
    endTime: '2025-06-30T23:59:59',
    targetActivityId: null,
    clickCount: 5678,
    displayCount: 34567,
    createdAt: '2025-06-14T16:45:00',
    updatedAt: '2025-06-15T09:20:00',
    createdBy: 'system',
    isFullWidth: true,
    backgroundColor: '#86909C',
    
    responsiveConfig: {
      mobile: {
        imageUrl: '/vite.svg',
        height: '120px',
      },
      tablet: {
        imageUrl: '/vite.svg',
        height: '160px',
      },
      desktop: {
        imageUrl: '/vite.svg',
        height: '200px',
      },
    },
  },
  {
    id: '5',
    title: '外部合作活动',
    description: '与知名品牌联合推出的限定活动',
    imageUrl: '/vite.svg',
    linkUrl: 'https://example.com/campaign',
    type: BANNER_TYPE.EXTERNAL_LINK,
    status: BANNER_STATUS.INACTIVE,
    sortOrder: 5,
    startTime: '2025-05-01T00:00:00',
    endTime: '2025-05-31T23:59:59',
    targetActivityId: null,
    clickCount: 9876,
    displayCount: 45678,
    createdAt: '2025-04-20T13:20:00',
    updatedAt: '2025-05-31T23:59:59',
    createdBy: 'system',
    isFullWidth: false,
    backgroundColor: '#FF7D00',
    
    responsiveConfig: {
      mobile: {
        imageUrl: '/vite.svg',
        height: '180px',
      },
      tablet: {
        imageUrl: '/vite.svg',
        height: '240px',
      },
      desktop: {
        imageUrl: '/vite.svg',
        height: '320px',
      },
    },
  },
];

/**
 * 获取Banner列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - Banner状态筛选
 * @param {boolean} params.onlyActive - 是否只返回激活状态且在有效期内的Banner
 * @returns {Array} Banner列表
 */
export const getBanners = ({ status, onlyActive = false }) => {
  let filtered = [...mockBanners];
  
  // 状态筛选
  if (status) {
    filtered = filtered.filter(banner => banner.status === status);
  }
  
  // 只返回激活且在有效期内的Banner
  if (onlyActive) {
    const now = new Date();
    filtered = filtered.filter(banner => {
      const start = new Date(banner.startTime);
      const end = new Date(banner.endTime);
      return banner.status === BANNER_STATUS.ACTIVE && start <= now && now <= end;
    });
  }
  
  // 按排序号排序
  filtered.sort((a, b) => a.sortOrder - b.sortOrder);
  
  return filtered;
};

/**
 * 根据ID获取Banner详情
 * @param {string} id - Banner ID
 * @returns {Object|null} Banner详情或null
 */
export const getBannerById = (id) => {
  return mockBanners.find(banner => banner.id === id) || null;
};

/**
 * 记录Banner点击
 * @param {string} id - Banner ID
 * @returns {boolean} 是否成功记录
 */
export const recordBannerClick = (id) => {
  const index = mockBanners.findIndex(banner => banner.id === id);
  
  if (index !== -1) {
    mockBanners[index].clickCount += 1;
    return true;
  }
  
  return false;
};

/**
 * 记录Banner展示
 * @param {string} id - Banner ID
 * @returns {boolean} 是否成功记录
 */
export const recordBannerDisplay = (id) => {
  const index = mockBanners.findIndex(banner => banner.id === id);
  
  if (index !== -1) {
    mockBanners[index].displayCount += 1;
    return true;
  }
  
  return false;
};

export default mockBanners;
