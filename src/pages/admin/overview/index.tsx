import React, { useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, RefreshCw } from 'lucide-react';
import StatCard from '../../../components/admin/dashboard/StatCard';
import TransactionTable from '../../../components/admin/dashboard/TransactionTable';
import DateFilter from '../../../components/admin/dashboard/DateFilter';
import RevenueChart from '../../../components/admin/dashboard/RevenueChart';
import TransactionStatusChart from '../../../components/admin/dashboard/TransactionStatusChart';
import QuickActions from '../../../components/admin/dashboard/QuickActions';
import RecentActivities from '../../../components/admin/dashboard/RecentActivities';
import { useDashboard } from '../../../hooks/modules/useDashboard';
import type { DashboardQueryParams } from '../../../types';

const OverviewPage: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [queryParams, setQueryParams] = useState<DashboardQueryParams>({});

    const { data: dashboardData, isLoading: loading, error, refetch } = useDashboard(queryParams);

    const handleApplyFilter = () => {
        const params: DashboardQueryParams = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        setQueryParams(params);
    };

    const handleResetFilter = () => {
        setStartDate('');
        setEndDate('');
        setQueryParams({});
    };

    const handleRefresh = () => {
        refetch();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                    <span className="text-gray-300">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">
                        {error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu dashboard'}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-gray-400">Không có dữ liệu</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
                        <p className="text-gray-400">Tổng quan hệ thống và thống kê</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Làm mới</span>
                    </button>
                </div>

                {/* Date Filter */}
                <div className="mb-6 sm:mb-8">
                    <DateFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onApplyFilter={handleApplyFilter}
                        onResetFilter={handleResetFilter}
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <StatCard
                        title="Tổng doanh thu"
                        value={formatCurrency(dashboardData.totalRevenue)}
                        icon={<DollarSign className="w-6 h-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Tổng sản phẩm"
                        value={dashboardData.totalProducts.toLocaleString()}
                        icon={<Package className="w-6 h-6" />}
                        color="blue"
                    />
                    <StatCard
                        title="Tổng đơn hàng"
                        value={dashboardData.totalOrders.toLocaleString()}
                        icon={<ShoppingCart className="w-6 h-6" />}
                        color="purple"
                    />
                    <StatCard
                        title="Giao dịch"
                        value={dashboardData.transactions.length.toLocaleString()}
                        icon={<Users className="w-6 h-6" />}
                        color="orange"
                    />
                </div>

                {/* Charts and Recent Activities */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="xl:col-span-2">
                        <RevenueChart transactions={dashboardData.transactions} />
                    </div>
                    <div className="xl:col-span-1">
                        <RecentActivities transactions={dashboardData.transactions} />
                    </div>
                </div>

                {/* Transaction Status Chart */}
                <div className="mb-6 sm:mb-8">
                    <TransactionStatusChart transactions={dashboardData.transactions} />
                </div>

                {/* Quick Actions */}
                <div className="mb-6 sm:mb-8">
                    <QuickActions />
                </div>

                {/* Transaction Table */}
                <div className="mb-6 sm:mb-8">
                    <TransactionTable transactions={dashboardData.transactions} />
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;