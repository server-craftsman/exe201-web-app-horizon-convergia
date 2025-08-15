import React from 'react';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';
import type { DashboardTransaction } from '../../../types';

interface TransactionTableProps {
    transactions: DashboardTransaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (date.getTime() === 0) return 'Chưa xác định';
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'Pending':
                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'Failed':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'Hoàn thành';
            case 'Pending':
                return 'Đang xử lý';
            case 'Failed':
                return 'Thất bại';
            default:
                return status;
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Giao dịch gần đây</h3>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Mã giao dịch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Phương thức
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm font-medium text-white">
                                            {transaction.reference}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-white">
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">
                                        {transaction.paymentMethod}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-400">
                                            {formatDate(transaction.transactionDate)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                            transaction.paymentStatus
                                        )}`}
                                    >
                                        {getStatusText(transaction.paymentStatus)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Chưa có giao dịch nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionTable;
