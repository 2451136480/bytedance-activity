# 运营平台首页组件文档

## 概述

本组件库提供了运营平台首页的完整实现，支持宫格和轮播两种布局模式，包含丰富的活动卡片组件和完善的错误处理机制。

## 组件结构

```
src/components/home/
├── LayoutSwitcher.jsx      # 布局切换器
├── ActivityGrid.jsx        # 宫格布局组件
├── ActivityCarousel.jsx    # 轮播布局组件
├── ActivityCard.jsx        # 基础活动卡片
├── PromotionCard.jsx       # 促销卡片（内置于ActivityCard）
├── NormalCard.jsx          # 普通卡片（内置于ActivityCard）
├── styles.css             # 组件样式
└── README.md             # 本文档
```

## 组件详解

### 1. HomePage.jsx (主页面)

**位置**: `src/pages/HomePage.jsx`

**功能**:
- 整合所有首页组件
- 管理数据获取和状态
- 处理布局切换逻辑
- 提供错误边界和加载状态

**主要属性**:
- `activities`: 活动数据数组
- `loading`: 加载状态
- `error`: 错误信息
- `layout`: 当前布局模式 ('grid' | 'carousel')

### 2. LayoutSwitcher (布局切换器)

**功能**:
- 提供宫格和轮播布局切换
- 支持自定义样式和图标
- 平滑的切换动画

**属性**:
```javascript
LayoutSwitcher.propTypes = {
  currentLayout: PropTypes.oneOf(['grid', 'carousel']).isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  gridIcon: PropTypes.node,
  carouselIcon: PropTypes.node,
  gridLabel: PropTypes.string,
  carouselLabel: PropTypes.string
};
```

**使用示例**:
```jsx
<LayoutSwitcher 
  currentLayout={layout} 
  onLayoutChange={handleLayoutChange}
  gridLabel="宫格视图"
  carouselLabel="轮播视图"
/>
```

### 3. ActivityGrid (宫格布局)

**功能**:
- 响应式网格布局
- 自动适配屏幕尺寸
- 支持加载和空状态
- 集成ActivityCard组件

**属性**:
```javascript
ActivityGrid.propTypes = {
  activities: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onActivityClick: PropTypes.func,
  renderEmptyState: PropTypes.func,
  renderLoadingState: PropTypes.func,
  minWidth: PropTypes.string,
  gap: PropTypes.string
};
```

**使用示例**:
```jsx
<ActivityGrid 
  activities={activities}
  loading={loading}
  error={error}
  onActivityClick={handleActivityClick}
  minWidth="280px"
  gap="16px"
/>
```

### 4. ActivityCarousel (轮播布局)

**功能**:
- 自动轮播功能
- 手动切换控制
- 指示器显示
- 键盘导航支持
- 暂停轮播功能

**属性**:
```javascript
ActivityCarousel.propTypes = {
  activities: PropTypes.array,
  loading: PropTypes.bool,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showIndicators: PropTypes.bool,
  showControls: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  onActivityClick: PropTypes.func,
  renderEmptyState: PropTypes.func,
  renderLoadingState: PropTypes.func
};
```

**使用示例**:
```jsx
<ActivityCarousel 
  activities={activities}
  loading={loading}
  autoPlay={true}
  interval={5000}
  showIndicators={true}
  showControls={true}
  onActivityClick={handleActivityClick}
/>
```

### 5. ActivityCard (活动卡片)

**功能**:
- 基础活动卡片组件
- 支持不同类型活动渲染
- 响应式设计
- 丰富的hover效果
- 状态标签显示

**属性**:
```javascript
ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    status: PropTypes.oneOf(['active', 'upcoming', 'ended']),
    type: PropTypes.oneOf(['normal', 'promotion']),
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    participantCount: PropTypes.number,
    location: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    organizer: PropTypes.string,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    promotionInfo: PropTypes.string,
    coupons: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      condition: PropTypes.string
    })),
    participants: PropTypes.number
  }).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  renderCustomContent: PropTypes.func
};
```

**使用示例**:
```jsx
<ActivityCard 
  activity={activity}
  onClick={() => handleActivityClick(activity)}
  style={{ margin: '8px' }}
/>
```

## 数据结构

### 活动数据格式

```javascript
const activity = {
  id: 'activity_001',
  title: '春季大促销',
  description: '全场商品8折起，限时优惠不容错过',
  coverImage: '/images/spring-sale.jpg',
  status: 'active', // 'active' | 'upcoming' | 'ended'
  type: 'promotion', // 'normal' | 'promotion'
  startTime: '2024-03-01T00:00:00Z',
  endTime: '2024-03-31T23:59:59Z',
  participantCount: 1250,
  location: '线上商城',
  tags: ['促销', '春季', '限时'],
  organizer: '运营部',
  discount: '8折',
  promotionInfo: '满减优惠，买越多省越多',
  coupons: [
    { value: '满100减20', condition: '满100元可用' },
    { value: '满200减50', condition: '满200元可用' }
  ],
  participants: 1250
};
```

## 样式系统

### CSS变量

组件使用CSS变量系统，支持主题定制：

```css
:root {
  /* 颜色系统 */
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --text-primary: #292f36;
  --text-secondary: #6d6d6d;
  
  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  
  /* 圆角系统 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影系统 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* 动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

## 响应式设计

组件支持多种响应式断点：

- **桌面端**: 1200px+，多列网格布局
- **平板端**: 768px-1199px，双列网格布局
- **移动端**: 480px-767px，单列布局
- **小屏移动端**: <480px，优化触摸交互

## 可访问性

组件包含以下可访问性特性：

- 语义化HTML结构
- ARIA标签支持
- 键盘导航
- 高对比度模式支持
- 减少动画模式支持
- 屏幕阅读器优化

## 性能优化

- 虚拟滚动支持（大数据量）
- 图片懒加载
- 组件懒加载
- 防抖和节流
- 内存泄漏防护

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 移动端浏览器

## 使用示例

### 完整首页实现

```jsx
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import { generateMockData } from './hooks/useActivityFilters';

function App() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = generateMockData(50);
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <HomePage 
      activities={activities}
      loading={loading}
      error={error}
    />
  );
}

export default App;
```

## 扩展接口

组件提供以下扩展接口：

### 自定义渲染

```jsx
<ActivityGrid 
  activities={activities}
  renderEmptyState={() => <CustomEmptyState />}
  renderLoadingState={() => <CustomLoadingState />}
/>
```

### 自定义卡片内容

```jsx
<ActivityCard 
  activity={activity}
  renderCustomContent={(activity) => (
    <div className="custom-content">
      {/* 自定义内容 */}
    </div>
  )}
/>
```

## 错误处理

组件包含完善的错误处理机制：

- 网络错误处理
- 数据格式验证
- 组件错误边界
- 用户友好的错误提示
- 重试机制

## 测试

组件包含完整的测试用例：

- 单元测试
- 集成测试
- 快照测试
- 性能测试
- 可访问性测试

## 更新日志

### v1.0.0
- 初始版本发布
- 支持宫格和轮播布局
- 完整的组件化设计
- 响应式支持
- 错误边界处理