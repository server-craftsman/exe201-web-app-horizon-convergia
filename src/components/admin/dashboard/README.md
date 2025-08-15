# Admin Dashboard Components

## Tổng quan

Dashboard Admin là một trang tổng quan chuyên nghiệp được xây dựng với React và TypeScript, sử dụng Tailwind CSS để tạo giao diện đẹp mắt và responsive.

## Cấu trúc Components

### 1. StatCard.tsx
- **Mục đích**: Hiển thị các thống kê quan trọng (doanh thu, sản phẩm, đơn hàng, v.v.)
- **Tính năng**: 
  - Hiển thị icon và màu sắc phân biệt
  - Hỗ trợ hiển thị trend (tăng/giảm)
  - Responsive design

### 2. TransactionTable.tsx
- **Mục đích**: Hiển thị danh sách giao dịch dưới dạng bảng
- **Tính năng**:
  - Format tiền tệ Việt Nam
  - Hiển thị trạng thái giao dịch với màu sắc
  - Hover effects
  - Empty state

### 3. DateFilter.tsx
- **Mục đích**: Bộ lọc theo thời gian
- **Tính năng**:
  - DateTime picker
  - Apply và Reset filter
  - Responsive layout

### 4. RevenueChart.tsx
- **Mục đích**: Biểu đồ doanh thu theo thời gian
- **Tính năng**:
  - Area chart với gradient
  - Custom tooltip
  - Xử lý dữ liệu theo ngày
  - Responsive

### 5. TransactionStatusChart.tsx
- **Mục đích**: Biểu đồ tròn hiển thị tỷ lệ trạng thái giao dịch
- **Tính năng**:
  - Pie chart với màu sắc phân biệt
  - Custom legend
  - Responsive

### 6. QuickActions.tsx
- **Mục đích**: Các hành động nhanh để điều hướng
- **Tính năng**:
  - Navigation links
  - Hover effects
  - Icon và gradient

### 7. RecentActivities.tsx
- **Mục đích**: Hiển thị hoạt động gần đây
- **Tính năng**:
  - Timeline format
  - Time ago display
  - Activity icons

## API Integration

### Dashboard Service
- **File**: `src/services/dashboard/dashboard.service.ts`
- **API Endpoint**: `/api/Dashboard/admin`
- **Parameters**: `startDate`, `endDate` (optional)

### Custom Hook
- **File**: `src/hooks/modules/useDashboard.ts`
- **Tính năng**: React Query integration với cache 5 phút

## Types

### DashboardResponse
```typescript
interface DashboardResponse {
    totalRevenue: number;
    totalProducts: number; 
    totalOrders: number;
    transactions: DashboardTransaction[];
}
```

### DashboardTransaction
```typescript
interface DashboardTransaction {
    id: string;
    reference: string;
    amount: number;
    transactionDate: string;
    paymentMethod: string;
    paymentStatus: "Completed" | "Pending" | "Failed";
}
```

## Responsive Design

Dashboard được thiết kế responsive với các breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## Thư viện sử dụng

- **React Query**: Data fetching và caching
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **React Router**: Navigation

## Cách sử dụng

1. Import component vào trang admin:
```typescript
import OverviewPage from '../../../pages/admin/overview';
```

2. Đảm bảo API endpoint `/api/Dashboard/admin` hoạt động

3. Component sẽ tự động fetch data và hiển thị

## Tính năng nổi bật

- ⚡ **Performance**: Sử dụng React Query cho caching
- 📱 **Responsive**: Hoạt động mượt mà trên mọi thiết bị
- 🎨 **Modern UI**: Giao diện đẹp mắt với Tailwind CSS
- 📊 **Data Visualization**: Biểu đồ tương tác với Recharts
- 🔄 **Real-time**: Refresh data theo thời gian thực
- 🌐 **Localization**: Hỗ trợ định dạng tiền tệ và ngày tháng Việt Nam
