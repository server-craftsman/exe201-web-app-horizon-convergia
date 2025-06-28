import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';

interface SellerLayoutProps {
    children?: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
            <SellerHeader />
            <main className="pt-16">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default SellerLayout; 