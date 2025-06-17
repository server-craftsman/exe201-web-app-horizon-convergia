import React, {useState} from 'react';
import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import {Outlet} from 'react-router-dom';
import SidebarLayout from './Sidebar.layout';
import {useUserInfo, useAuth} from "../../hooks";

interface AdminLayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({children}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userInfo = useUserInfo();
    const {logout} = useAuth();
    const handleLogout = async () => {
        try {
            await logout.mutate();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    return (
        <div className="flex h-screen bg-gray-800 text-white">
            <SidebarLayout/>
            <main className="flex-1 overflow-y-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <header className="flex justify-end items-center p-10">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none rounded-md hover:bg-gray-700 p-1 transition-colors duration-200"
                                aria-label="User menu"
                            >
  <span className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-gray-300"
    >
      <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  </span>
                            </button>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 z-10"
                                >
                                    <div className="px-4 py-2 text-sm">
                                        {userInfo?.name}
                                        <div className="text-xs text-gray-400">{userInfo?.email}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                                    >
                                        Đăng xuất
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="p-10 h-full">
                        <motion.div
                            className="relative bg-gray-800 h-full"
                        >
                            {children || <Outlet/>}
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;