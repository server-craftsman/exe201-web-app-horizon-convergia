import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import type { DashboardTransaction } from '../../../types';

interface TransactionStatusChartProps {
    transactions: DashboardTransaction[];
}

const TransactionStatusChart: React.FC<TransactionStatusChartProps> = ({ transactions }) => {
    const processStatusData = () => {
        const statusCount: { [key: string]: number } = {};
        
        transactions.forEach(transaction => {
            const status = transaction.paymentStatus;
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const colors = {
            'Completed': '#10B981',
            'Pending': '#F59E0B',
            'Failed': '#EF4444'
        };

        const statusLabels = {
            'Completed': 'Hoàn thành',
            'Pending': 'Đang xử lý',
            'Failed': 'Thất bại'
        };

        return Object.entries(statusCount).map(([status, count]) => ({
            name: statusLabels[status as keyof typeof statusLabels] || status,
            value: count,
            color: colors[status as keyof typeof colors] || '#6B7280'
        }));
    };

    const data = processStatusData();
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-white">
                        {`${payload[0].name}: ${payload[0].value} giao dịch`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
                <Activity className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Trạng thái giao dịch</h3>
            </div>

            {data.length > 0 ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Chưa có dữ liệu để hiển thị</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionStatusChart;
