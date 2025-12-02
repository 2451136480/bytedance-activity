import { render, screen, fireEvent } from '@testing-library/react';
import ActivityCard from '../../../components/home/ActivityCard';

const mockActivity = {
  id: '1',
  title: 'Test Activity',
  type: 'normal',
  status: 'ongoing',
  startTime: '2024-01-01T00:00:00',
  endTime: '2024-12-31T23:59:59',
  location: 'Beijing',
  participantCount: 100,
  imageUrl: 'test.jpg',
};

describe('ActivityCard Component', () => {
  test('should render normal activity card', () => {
    render(<ActivityCard activity={mockActivity} />);
    
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('进行中')).toBeInTheDocument();
    expect(screen.getByText('北京')).toBeInTheDocument();
    expect(screen.getByText('100人参与')).toBeInTheDocument();
  });

  test('should render promotion activity card', () => {
    const promotionActivity = {
      ...mockActivity,
      type: 'promotion',
      discount: 85,
      couponCode: 'TEST10',
    };
    
    render(<ActivityCard activity={promotionActivity} />);
    
    expect(screen.getByText('8.5折')).toBeInTheDocument();
    expect(screen.getByText('TEST10')).toBeInTheDocument();
  });

  test('should call onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    render(<ActivityCard activity={mockActivity} onClick={handleClick} />);
    
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledWith(mockActivity);
  });

  test('should handle image error', () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    render(<ActivityCard activity={{ ...mockActivity, imageUrl: 'invalid.jpg' }} />);
    
    const img = screen.getByAltText('Test Activity');
    fireEvent.error(img);
    
    // 检查是否设置了默认图片
    expect(img.src).toContain('default-activity.jpg');
    
    console.error = originalError;
  });

  test('should render different status colors', () => {
    // 测试进行中状态
    render(<ActivityCard activity={mockActivity} />);
    const statusOngoing = screen.getByText('进行中');
    expect(statusOngoing).toHaveClass('activity-card__status--ongoing');
    
    // 测试即将开始状态
    render(<ActivityCard activity={{ ...mockActivity, status: 'upcoming' }} />);
    const statusUpcoming = screen.getByText('即将开始');
    expect(statusUpcoming).toHaveClass('activity-card__status--upcoming');
    
    // 测试已结束状态
    render(<ActivityCard activity={{ ...mockActivity, status: 'ended' }} />);
    const statusEnded = screen.getByText('已结束');
    expect(statusEnded).toHaveClass('activity-card__status--ended');
  });
});