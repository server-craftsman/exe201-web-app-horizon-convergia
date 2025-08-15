import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { DashboardTransaction } from '../../../types';

interface RevenueChartProps {
    transactions: DashboardTransaction[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ transactions }) => {
    // Xử lý dữ liệu để tạo biểu đồ theo ngày
    const processChartData = () => {
        const chartData: { [key: string]: { date: string; amount: number; count: number } } = {};
        
        transactions.forEach(transaction => {
            if (transaction.transactionDate === '0001-01-01T00:00:00') return;
            
            const date = new Date(transaction.transactionDate);
            const dateStr = date.toLocaleDateString('vi-VN', { 
                month: '2-digit', 
                day: '2-digit' 
            });
            
            if (!chartData[dateStr]) {
                chartData[dateStr] = {
                    date: dateStr,
                    amount: 0,
                    count: 0
                };
            }
            
            if (transaction.paymentStatus === 'Completed') {
                chartData[dateStr].amount += transaction.amount;
            }
            chartData[dateStr].count += 1;
        });
        
        return Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date));
    };

    const chartData = processChartData();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact'
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-white mb-2">{`Ngày: ${label}`}</p>
                    <p className="text-sm text-blue-400">
                        {`Doanh thu: ${formatCurrency(payload[0].value)}`}
                    </p>
                    <p className="text-sm text-green-400">
                        {`Số giao dịch: ${payload[1].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Biểu đồ doanh thu</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        <span className="text-gray-400">Doanh thu</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        <span className="text-gray-400">Số giao dịch</span>
                    </div>
                </div>
            </div>

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <YAxis 
                            yAxisId="left"
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickFormatter={formatCurrency}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="count"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-300 flex items-center justify-center">
                    <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Chưa có dữ liệu để hiển thị biểu đồ</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueChart;
