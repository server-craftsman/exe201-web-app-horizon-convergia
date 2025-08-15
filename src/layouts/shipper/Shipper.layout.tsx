import React from 'react';
import { Outlet } from 'react-router-dom';
import ShipperHeader from './ShipperHeader';

interface ShipperLayoutProps {
    children?: React.ReactNode;
}

const ShipperLayout: React.FC<ShipperLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
            {/* Shipper Header */}
            <ShipperHeader />

            {/* Main Content */}
            <main className="pt-20 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children || <Outlet />}
                </div>
            </main>

            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
        </div>
    );
};

export default ShipperLayout; 