import React from 'react';
import { Plus, Eye, BarChart3, Settings, Users, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '../../../consts/router.path.const';

const QuickActions: React.FC = () => {
    const actions = [
        {
            title: 'Quản lý người dùng',
            description: 'Xem và quản lý tài khoản người dùng',
            icon: <Users className="w-6 h-6" />,
            link: ROUTER_URL.ADMIN.USERS,
            color: 'blue'
        },
        {
            title: 'Quản lý sản phẩm',
            description: 'Xem và duyệt sản phẩm',
            icon: <Package className="w-6 h-6" />,
            link: ROUTER_URL.ADMIN.PRODUCTS,
            color: 'green'
        },
        {
            title: 'Xem đơn hàng',
            description: 'Theo dõi và xử lý đơn hàng',
            icon: <Eye className="w-6 h-6" />,
            link: ROUTER_URL.ADMIN.ORDERS,
            color: 'purple'
        },
        {
            title: 'Thống kê',
            description: 'Xem báo cáo và thống kê chi tiết',
            icon: <BarChart3 className="w-6 h-6" />,
            link: ROUTER_URL.ADMIN.STATISTICS,
            color: 'orange'
        },
        {
            title: 'Cài đặt',
            description: 'Cấu hình hệ thống',
            icon: <Settings className="w-6 h-6" />,
            link: ROUTER_URL.ADMIN.SETTINGS,
            color: 'gray'
        }
    ];

    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        gray: 'from-gray-500 to-gray-600'
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
                <Plus className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Hành động nhanh</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className="group relative p-4 rounded-lg border border-gray-700 hover:border-amber-500/50 hover:bg-gray-700 transition-all duration-200"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[action.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity`}></div>
                        <div className="relative">
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${colorClasses[action.color as keyof typeof colorClasses]} text-white mb-3`}>
                                {action.icon}
                            </div>
                            <h4 className="font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
                                {action.title}
                            </h4>
                            <p className="text-sm text-gray-400 line-clamp-2">
                                {action.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
