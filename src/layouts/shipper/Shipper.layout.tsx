import React from 'react';
import { Outlet } from 'react-router-dom';

interface ShipperLayoutProps {
    children?: React.ReactNode;
}

const ShipperLayout: React.FC<ShipperLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-black">
            {/* Shipper Header placeholder - can be created later */}
            <header className="bg-black/20 backdrop-blur-md border-b border-orange-500/20 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">Shipper Dashboard</h1>
                    <div className="text-orange-400 text-sm">
                        Horizon Convergia - Delivery
                    </div>
                </div>
            </header>
            <main className="pt-4">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default ShipperLayout; 