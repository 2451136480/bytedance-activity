import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import { getHomeData } from '../../services/activityService';

// Mock服务
jest.mock('../../services/activityService', () => ({
  getHomeData: jest.fn(),
}));

const mockHomeData = {
  banners: [
    { id: '1', title: 'Test Banner 1', imageUrl: 'test1.jpg', linkUrl: '/test1', isActive: true },
    { id: '2', title: 'Test Banner 2', imageUrl: 'test2.jpg', linkUrl: '/test2', isActive: true },
  ],
  ongoingActivities: [
    {
      id: '1',
      title: 'Test Activity 1',
      type: 'normal',
      status: 'ongoing',
      startTime: '2024-01-01T00:00:00',
      endTime: '2024-12-31T23:59:59',
      location: 'Online',
      participantCount: 100,
      imageUrl: 'activity1.jpg',
    },
  ],
  upcomingActivities: [],
  categories: [],
  announcements: [],
};

describe('HomePage Component', () => {
  beforeEach(() => {
    getHomeData.mockResolvedValue(mockHomeData);
    jest.clearAllMocks();
  });

  test('should render loading state initially', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/加载中/i)).toBeInTheDocument();
  });

  test('should render home page with data', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.getByText('Test Activity 1')).toBeInTheDocument();
    });
    
    // 检查活动统计
    expect(screen.getByText(/进行中/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 活动数量
  });

  test('should handle layout switching', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Activity 1')).toBeInTheDocument();
    });
    
    // 切换到轮播布局
    const carouselButton = screen.getByText(/轮播/i);
    fireEvent.click(carouselButton);
    
    // 验证轮播布局已激活
    expect(carouselButton).toHaveClass('active');
  });

  test('should handle banner click', async () => {
    // Mock window.open
    const originalOpen = window.open;
    window.open = jest.fn();
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const banner = screen.getByAltText('Test Banner 1');
      expect(banner).toBeInTheDocument();
      fireEvent.click(banner);
    });
    
    expect(window.open).toHaveBeenCalledWith('/test1', '_blank');
    
    // 恢复原始window.open
    window.open = originalOpen;
  });

  test('should handle API error', async () => {
    const errorMessage = 'API Error';
    getHomeData.mockRejectedValue(new Error(errorMessage));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/数据加载失败/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // 测试重试按钮
    const retryButton = screen.getByText(/重新加载/i);
    fireEvent.click(retryButton);
    
    expect(getHomeData).toHaveBeenCalledTimes(2);
  });
});