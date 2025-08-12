import React from 'react';
import { Outlet } from 'react-router-dom';
import BuyerHeader from './BuyerHeader';

interface BuyerLayoutProps {
    children?: React.ReactNode;
}

const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <BuyerHeader />
            <main className="pt-16">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default BuyerLayout; 