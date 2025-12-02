// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '2025新年大型促销活动',
    description: '迎接2025新年，全场商品5折起，更有神秘礼品等你来拿！',
    category: '促销',
    status: 'ongoing', // ongoing, upcoming, ended
    startTime: '2025-01-01T00:00:00',
    endTime: '2025-01-15T23:59:59',
    createdAt: '2024-12-20T10:00:00',
    createdBy: '张三',
    rules: [
      '活动时间：2025年1月1日至1月15日',
      '全场商品5折起',
      '单笔订单满199元免运费',
      '活动最终解释权归本平台所有'
    ],
    participationData: {
      totalParticipants: 12345,
      totalOrders: 8765,
      totalSales: 1234567
    },
    bannerImage: '/banner/new-year.jpg'
  },
  {
    id: 2,
    title: '春季新品发布会',
    description: '2025春季新品重磅发布，限时预售享8折优惠！',
    category: '发布',
    status: 'upcoming',
    startTime: '2025-02-10T00:00:00',
    endTime: '2025-02-28T23:59:59',
    createdAt: '2025-01-05T14:30:00',
    createdBy: '李四',
    rules: [
      '活动时间：2025年2月10日至2月28日',
      '新品预售享8折优惠',
      '预售商品3月1日起陆续发货',
      '预售商品不支持退换货'
    ],
    participationData: {
      totalParticipants: 0,
      totalOrders: 0,
      totalSales: 0
    },
    bannerImage: '/banner/spring-new.jpg'
  },
  {
    id: 3,
    title: '年终感恩回馈',
    description: '感谢一路有你，年终大促，多重好礼送不停！',
    category: '回馈',
    status: 'ended',
    startTime: '2024-12-15T00:00:00',
    endTime: '2024-12-31T23:59:59',
    createdAt: '2024-12-01T09:15:00',
    createdBy: '王五',
    rules: [
      '活动时间：2024年12月15日至12月31日',
      '满300减50，满500减100',
      '会员享额外95折优惠',
      '活动期间下单即送精美礼品一份'
    ],
    participationData: {
      totalParticipants: 23456,
      totalOrders: 15678,
      totalSales: 2345678
    },
    bannerImage: '/banner/thanksgiving.jpg'
  },
  {
    id: 4,
    title: '会员专享日',
    description: '每月18日会员专享日，全场商品会员专享7折优惠！',
    category: '会员',
    status: 'ongoing',
    startTime: '2025-01-18T00:00:00',
    endTime: '2025-01-18T23:59:59',
    createdAt: '2025-01-10T16:45:00',
    createdBy: '赵六',
    rules: [
      '活动时间：2025年1月18日全天',
      '仅限会员参与，全场商品7折起',
      '会员积分双倍累积',
      '会员专享礼品限量领取'
    ],
    participationData: {
      totalParticipants: 5678,
      totalOrders: 4321,
      totalSales: 567890
    },
    bannerImage: '/banner/member-day.jpg'
  }
];

// 模拟Banner数据
const mockBanners = [
  {
    id: 1,
    title: '新年大促',
    imageUrl: '/banner/new-year.jpg',
    link: '/activities/1',
    priority: 1,
    isActive: true
  },
  {
    id: 2,
    title: '春季新品',
    imageUrl: '/banner/spring-new.jpg',
    link: '/activities/2',
    priority: 2,
    isActive: true
  },
  {
    id: 3,
    title: '会员专享',
    imageUrl: '/banner/member-day.jpg',
    link: '/activities/4',
    priority: 3,
    isActive: true
  }
];

// 模拟活动分类
const mockCategories = [
  { id: 'all', name: '全部活动' },
  { id: 'promotion', name: '促销活动' },
  { id: 'launch', name: '新品发布' },
  { id: 'member', name: '会员专享' },
  { id: 'feedback', name: '用户回馈' }
];

// 模拟公告
const mockAnnouncements = [
  {
    id: 1,
    title: '系统维护通知',
    content: '系统将于2025年1月20日凌晨2:00-4:00进行维护，请提前做好准备。',
    publishTime: '2025-01-15T10:00:00',
    isActive: true
  },
  {
    id: 2,
    title: '活动规则更新',
    content: '新年促销活动规则已更新，请查看最新活动详情。',
    publishTime: '2025-01-05T14:30:00',
    isActive: true
  }
];

export { mockActivities, mockBanners, mockCategories, mockAnnouncements };