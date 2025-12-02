// 用户模拟数据
// 定义用户的数据结构和示例数据

/**
 * 用户角色枚举
 * @type {Object}
 */
export const USER_ROLE = {
  ADMIN: 'admin',           // 管理员
  OPERATOR: 'operator',     // 运营人员
  VIEWER: 'viewer',         // 查看人员
};

/**
 * 用户状态枚举
 * @type {Object}
 */
export const USER_STATUS = {
  ACTIVE: 'active',         // 活跃
  INACTIVE: 'inactive',     // 禁用
  PENDING: 'pending',       // 待审核
};

/**
 * 模拟用户数据
 * @type {Array}
 */
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际环境中应该使用加密存储
    realName: '管理员',
    email: 'admin@example.com',
    phoneNumber: '13800138000',
    role: USER_ROLE.ADMIN,
    status: USER_STATUS.ACTIVE,
    department: '技术部',
    position: '系统管理员',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
    lastLoginAt: '2024-06-20T14:30:00',
    permissions: [
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      'activity:create',
      'activity:read',
      'activity:update',
      'activity:delete',
      'banner:create',
      'banner:read',
      'banner:update',
      'banner:delete',
      'system:config',
    ],
    avatarUrl: '/vite.svg',
  },
  {
    id: '2',
    username: 'operator1',
    password: 'operator123',
    realName: '张运营',
    email: 'zhang@example.com',
    phoneNumber: '13800138001',
    role: USER_ROLE.OPERATOR,
    status: USER_STATUS.ACTIVE,
    department: '运营部',
    position: '高级运营',
    createdAt: '2024-01-05T09:20:00',
    updatedAt: '2024-02-10T10:30:00',
    lastLoginAt: '2024-06-20T09:15:00',
    permissions: [
      'activity:create',
      'activity:read',
      'activity:update',
      'banner:create',
      'banner:read',
      'banner:update',
    ],
    avatarUrl: '/vite.svg',
  },
  {
    id: '3',
    username: 'operator2',
    password: 'operator123',
    realName: '李运营',
    email: 'li@example.com',
    phoneNumber: '13800138002',
    role: USER_ROLE.OPERATOR,
    status: USER_STATUS.ACTIVE,
    department: '运营部',
    position: '初级运营',
    createdAt: '2024-03-10T14:15:00',
    updatedAt: '2024-03-10T14:15:00',
    lastLoginAt: '2024-06-19T16:45:00',
    permissions: [
      'activity:read',
      'activity:update',
      'banner:read',
      'banner:update',
    ],
    avatarUrl: '/vite.svg',
  },
  {
    id: '4',
    username: 'viewer1',
    password: 'viewer123',
    realName: '王查看',
    email: 'wang@example.com',
    phoneNumber: '13800138003',
    role: USER_ROLE.VIEWER,
    status: USER_STATUS.ACTIVE,
    department: '市场部',
    position: '市场专员',
    createdAt: '2024-04-01T11:40:00',
    updatedAt: '2024-04-01T11:40:00',
    lastLoginAt: '2024-06-18T10:20:00',
    permissions: [
      'activity:read',
      'banner:read',
    ],
    avatarUrl: '/vite.svg',
  },
  {
    id: '5',
    username: 'viewer2',
    password: 'viewer123',
    realName: '赵查看',
    email: 'zhao@example.com',
    phoneNumber: '13800138004',
    role: USER_ROLE.VIEWER,
    status: USER_STATUS.INACTIVE,
    department: '财务部',
    position: '财务专员',
    createdAt: '2024-05-15T08:30:00',
    updatedAt: '2024-06-01T15:00:00',
    lastLoginAt: '2024-06-01T15:00:00',
    permissions: [
      'activity:read',
      'banner:read',
    ],
    avatarUrl: '/vite.svg',
  },
];

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {string} params.role - 用户角色筛选
 * @param {string} params.status - 用户状态筛选
 * @returns {Array} 用户列表
 */
export const getUsers = ({ role, status }) => {
  let filtered = [...mockUsers];
  
  // 角色筛选
  if (role) {
    filtered = filtered.filter(user => user.role === role);
  }
  
  // 状态筛选
  if (status) {
    filtered = filtered.filter(user => user.status === status);
  }
  
  return filtered;
};

/**
 * 根据ID获取用户详情
 * @param {string} id - 用户ID
 * @returns {Object|null} 用户详情或null
 */
export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id) || null;
};

/**
 * 根据用户名获取用户
 * @param {string} username - 用户名
 * @returns {Object|null} 用户详情或null
 */
export const getUserByUsername = (username) => {
  return mockUsers.find(user => user.username === username) || null;
};

/**
 * 验证用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Object|null} 登录成功返回用户信息，失败返回null
 */
export const validateLogin = (username, password) => {
  const user = getUserByUsername(username);
  
  if (user && user.password === password && user.status === USER_STATUS.ACTIVE) {
    // 实际环境中不应该返回密码等敏感信息
    const { password: _, ...userInfo } = user;
    return userInfo;
  }
  
  return null;
};

/**
 * 更新用户最后登录时间
 * @param {string} id - 用户ID
 * @returns {boolean} 是否成功更新
 */
export const updateLastLoginTime = (id) => {
  const index = mockUsers.findIndex(user => user.id === id);
  
  if (index !== -1) {
    mockUsers[index].lastLoginAt = new Date().toISOString();
    return true;
  }
  
  return false;
};

export default mockUsers;
