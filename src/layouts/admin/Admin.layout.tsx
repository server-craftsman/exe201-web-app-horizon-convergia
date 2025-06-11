import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from './Sidebar.layout';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarLayout />
      <main className="flex-1 overflow-y-auto p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
