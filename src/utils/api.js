import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // API基础路径，后续可根据实际需求修改
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 错误处理
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default api;