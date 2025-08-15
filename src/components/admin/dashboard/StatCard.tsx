import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500', 
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    const bgColorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/20',
        green: 'bg-green-500/10 border-green-500/20',
        purple: 'bg-purple-500/10 border-purple-500/20', 
        orange: 'bg-orange-500/10 border-orange-500/20'
    };

    return (
        <div className={`bg-gray-800 border ${bgColorClasses[color]} rounded-xl p-6 hover:bg-gray-700 transition-all duration-200`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                            )}
                            <span
                                className={`text-sm font-medium ${
                                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                                }`}
                            >
                                {trend.value}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                    <div className="text-white">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
