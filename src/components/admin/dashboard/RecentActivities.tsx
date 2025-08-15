import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { DashboardTransaction } from '../../../types';

interface RecentActivitiesProps {
    transactions: DashboardTransaction[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ transactions }) => {
    const getActivityIcon = (status: string) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'Failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityDescription = (transaction: DashboardTransaction) => {
        const amount = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(transaction.amount);

        switch (transaction.paymentStatus) {
            case 'Completed':
                return `Thanh toán thành công ${amount}`;
            case 'Pending':
                return `Đang xử lý thanh toán ${amount}`;
            case 'Failed':
                return `Thanh toán thất bại ${amount}`;
            default:
                return `Giao dịch ${amount}`;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        if (date.getTime() === 0) return 'Chưa xác định';
        
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Sắp xếp transactions theo thời gian và chỉ lấy 5 cái gần nhất
    const recentTransactions = transactions
        .filter(t => t.transactionDate !== '0001-01-01T00:00:00')
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
        .slice(0, 5);

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Hoạt động gần đây</h3>
            </div>

            <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-start space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                            <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(transaction.paymentStatus)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {getActivityDescription(transaction)}
                                </p>
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                    <span>Mã giao dịch: {transaction.reference}</span>
                                    <span className="mx-2">•</span>
                                    <span>{transaction.paymentMethod}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-xs text-gray-500">
                                {formatTimeAgo(transaction.transactionDate)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Chưa có hoạt động nào</p>
                    </div>
                )}
            </div>

            {recentTransactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <button className="w-full text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors">
                        Xem tất cả hoạt động
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentActivities;
