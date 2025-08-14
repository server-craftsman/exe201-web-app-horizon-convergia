import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { useUserInfo } from '../../hooks';
import logo from '../../assets/logo.png';

const SidebarLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const user = useUserInfo();


    const menuItems = [
        {
            path: ROUTER_URL.ADMIN.BASE,
            label: 'Tổng quan',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.USERS,
            label: 'Quản lý người dùng',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 7.5h14a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            icon: (
                <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
            ),
        },
        {
            path: ROUTER_URL.ADMIN.CATEGORIES,
            label: 'Quản lý danh mục',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zm-10 10h6v6H4v-6zm10 0h6v6h-6v-6z" />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.PRODUCTS,
            label: 'Quản lý sản phẩm',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16a3 3 0 100-6 3 3 0 000 6zm-8 0a3 3 0 100-6 3 3 0 000 6zm2-6h6m-9 3h3m-6-6h3a2 2 0 012 2v2m6-6v2a2 2 0 01-2 2h-3"
                    />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.SELLER_PRODUCTS,
            label: 'Sản phẩm người bán',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.NEWS,
            label: 'Quản lý tin tức',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875v12.75c0 .621.504 1.125 1.125 1.125h2.25a2.25 2.25 0 002.25-2.25V7.5" />
                </svg>
            ),
        },
        {
            icon: (
                <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
            ),
        },
        {
            path: ROUTER_URL.ADMIN.ORDERS,
            label: 'Quản lý đơn hàng',
            icon: (
                <svg width="800px" height="800px" viewBox="0 0 1024 1024" fill="#FFFFFF" className="icon h-6 w-6" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M53.6 1023.2c-6.4 0-12.8-2.4-17.6-8-4.8-4.8-7.2-11.2-6.4-18.4L80 222.4c0.8-12.8 11.2-22.4 24-22.4h211.2v-3.2c0-52.8 20.8-101.6 57.6-139.2C410.4 21.6 459.2 0.8 512 0.8c108 0 196.8 88 196.8 196.8 0 0.8-0.8 1.6-0.8 2.4v0.8H920c12.8 0 23.2 9.6 24 22.4l49.6 768.8c0.8 2.4 0.8 4 0.8 6.4-0.8 13.6-11.2 24.8-24.8 24.8H53.6z m25.6-48H944l-46.4-726.4H708v57.6h0.8c12.8 8.8 20 21.6 20 36 0 24.8-20 44.8-44.8 44.8s-44.8-20-44.8-44.8c0-14.4 7.2-27.2 20-36h0.8v-57.6H363.2v57.6h0.8c12.8 8.8 20 21.6 20 36 0 24.8-20 44.8-44.8 44.8-24.8 0-44.8-20-44.8-44.8 0-14.4 7.2-27.2 20-36h0.8v-57.6H125.6l-46.4 726.4zM512 49.6c-81.6 0-148.8 66.4-148.8 148.8v3.2h298.4l-0.8-1.6v-1.6c0-82.4-67.2-148.8-148.8-148.8z" fill="" />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.REVIEWS,
            label: 'Quản lý đánh giá',
            icon: (
                <svg viewBox="0 0 1024 1024" fill="#FFFFFF" className="icon h-6 w-6" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M679.964 943.91H8.106c-4.422 0-8-3.578-8-7.998v-67.206c0-49.458 25.386-68.33 72.228-85.858 8.998-3.374 20.814-6.716 34.492-10.592 46.686-13.214 117.234-33.18 117.234-71.484a7.992 7.992 0 0 1 7.998-7.998 7.994 7.994 0 0 1 7.998 7.998c0 50.394-74.484 71.484-128.872 86.888-13.334 3.764-24.856 7.03-33.236 10.17-41.904 15.684-61.846 30.274-61.846 70.876v59.208h655.864v-59.208c0-40.602-19.95-55.192-61.846-70.86-8.404-3.156-19.918-6.422-33.26-10.202-54.378-15.404-128.848-36.494-128.848-86.874a7.992 7.992 0 0 1 7.998-7.998 7.994 7.994 0 0 1 7.998 7.998c0 38.29 70.534 58.27 117.21 71.484 13.684 3.876 25.494 7.218 34.508 10.608 46.85 17.512 72.234 36.382 72.234 85.842v67.206a7.99 7.99 0 0 1-7.996 8z"
                        fill="" />
                    <path
                        d="M344.036 735.954c-75.062 0-184.792-112.024-198.466-231.03a8.004 8.004 0 0 1 7.03-8.858 7.964 7.964 0 0 1 8.858 7.046c9.624 83.654 97.082 216.846 182.58 216.846 85.506 0 172.956-133.208 182.564-216.862 0.508-4.39 4.74-7.436 8.85-7.046a8.014 8.014 0 0 1 7.044 8.858c-13.672 119.006-123.39 231.046-198.46 231.046z"
                        fill="" />
                    <path
                        d="M232.058 708.772a7.992 7.992 0 0 1-7.998-7.998v-35.898c0-4.422 3.576-8 7.998-8a7.994 7.994 0 0 1 7.998 8v35.898a7.994 7.994 0 0 1-7.998 7.998zM456.012 708.772a7.992 7.992 0 0 1-7.998-7.998v-35.898c0-4.422 3.576-8 7.998-8a7.994 7.994 0 0 1 7.998 8v35.898a7.994 7.994 0 0 1-7.998 7.998zM679.964 416.02c-1.466 0-2.92-0.406-4.202-1.188a8.028 8.028 0 0 1-3.796-6.81v-23.996h-39.992a7.994 7.994 0 0 1-7.998-8V88.088a7.994 7.994 0 0 1 7.998-7.998h383.922a7.994 7.994 0 0 1 7.998 7.998v287.94c0 4.422-3.578 8-7.998 8H745.842l-62.298 31.15c-1.126 0.56-2.36 0.842-3.58 0.842z m-39.99-47.99h39.99a7.994 7.994 0 0 1 7.998 7.998v19.058l52.412-26.212a8.148 8.148 0 0 1 3.576-0.844h263.946V96.086H639.974v271.944z"
                        fill="" />
                    <path
                        d="M747.716 272.018a7.916 7.916 0 0 1-3.734-0.92l-16.028-8.436-16.028 8.436a7.968 7.968 0 0 1-8.436-0.61 7.992 7.992 0 0 1-3.188-7.812l3.062-17.886-12.982-12.654a8.002 8.002 0 0 1 4.436-13.654l17.934-2.594 8.03-16.262c2.688-5.436 11.654-5.436 14.342 0l8.028 16.262 17.936 2.594a8 8 0 1 1 4.434 13.654l-12.98 12.654 3.06 17.886a7.996 7.996 0 0 1-3.186 7.812 7.964 7.964 0 0 1-4.7 1.53z m-19.76-26.4c1.282 0 2.562 0.312 3.734 0.922l5.42 2.86-1.046-6.062a8.022 8.022 0 0 1 2.312-7.078l4.376-4.264-6.046-0.874a8.014 8.014 0 0 1-6.03-4.376l-2.718-5.514-2.718 5.514c-1.17 2.36-3.42 4-6.03 4.376l-6.044 0.874 4.374 4.264a8.014 8.014 0 0 1 2.312 7.078l-1.046 6.062 5.422-2.86a8.04 8.04 0 0 1 3.728-0.922zM843.698 272.018a7.916 7.916 0 0 1-3.734-0.92l-16.028-8.436-16.028 8.436a7.968 7.968 0 0 1-8.436-0.61 7.992 7.992 0 0 1-3.188-7.812l3.062-17.886-12.982-12.654a8.002 8.002 0 0 1 4.436-13.654l17.934-2.594 8.03-16.262c2.686-5.436 11.654-5.436 14.34 0l8.03 16.262 17.934 2.594a8 8 0 1 1 4.436 13.654l-12.98 12.654 3.06 17.886a7.996 7.996 0 0 1-3.186 7.812 7.972 7.972 0 0 1-4.7 1.53z m-19.762-26.4c1.282 0 2.562 0.312 3.734 0.922l5.42 2.86-1.046-6.062a8.016 8.016 0 0 1 2.312-7.078l4.374-4.264-6.044-0.874a8.014 8.014 0 0 1-6.03-4.376l-2.718-5.514-2.718 5.514c-1.172 2.36-3.42 4-6.03 4.376l-6.044 0.874 4.374 4.264a8.014 8.014 0 0 1 2.312 7.078l-1.046 6.062 5.42-2.86a8.06 8.06 0 0 1 3.73-0.922zM939.678 272.018a7.916 7.916 0 0 1-3.734-0.92l-16.028-8.436-16.028 8.436a7.972 7.972 0 0 1-8.438-0.61 7.996 7.996 0 0 1-3.186-7.812l3.06-17.886-12.98-12.654a8.002 8.002 0 0 1 4.434-13.654l17.936-2.594 8.028-16.262c2.688-5.436 11.656-5.436 14.342 0l8.03 16.262 17.934 2.594a8 8 0 1 1 4.436 13.654l-12.982 12.654 3.062 17.886a7.992 7.992 0 0 1-3.188 7.812 7.962 7.962 0 0 1-4.698 1.53z m-19.762-26.4c1.282 0 2.562 0.312 3.734 0.922l5.42 2.86-1.046-6.062a8.016 8.016 0 0 1 2.312-7.078l4.374-4.264-6.044-0.874a8.01 8.01 0 0 1-6.03-4.376l-2.718-5.514-2.718 5.514a8.014 8.014 0 0 1-6.03 4.376l-6.044 0.874 4.374 4.264a8.014 8.014 0 0 1 2.312 7.078l-1.046 6.062 5.42-2.86a8.06 8.06 0 0 1 3.73-0.922zM567.988 464.01a7.994 7.994 0 0 1-7.998-7.998c0-119.084-96.878-215.956-215.956-215.956-119.078 0-215.956 96.87-215.956 215.956a7.994 7.994 0 0 1-7.998 7.998c-4.422 0-8-3.578-8-7.998 0-127.896 104.056-231.952 231.954-231.952 127.894 0 231.952 104.056 231.952 231.952a7.994 7.994 0 0 1-7.998 7.998z"
                        fill="" />
                    <path
                        d="M120.082 751.95c-4.422 0-8-3.576-8-7.998v-287.94a7.994 7.994 0 0 1 8-7.998 7.994 7.994 0 0 1 7.998 7.998v287.94a7.994 7.994 0 0 1-7.998 7.998zM567.988 751.95a7.994 7.994 0 0 1-7.998-7.998v-287.94a7.994 7.994 0 0 1 7.998-7.998 7.992 7.992 0 0 1 7.998 7.998v287.94a7.992 7.992 0 0 1-7.998 7.998z"
                        fill="" />
                    <path
                        d="M120.082 496.002a8.01 8.01 0 0 1-7.648-5.656 8.008 8.008 0 0 1 5.304-9.998c280.192-85.904 362.924-199.334 363.728-200.474a8 8 0 0 1 11.138-1.92 7.988 7.988 0 0 1 1.954 11.122c-3.376 4.812-85.858 118.804-372.134 206.584a8.146 8.146 0 0 1-2.342 0.342z"
                        fill="" />
                    <path
                        d="M567.988 496.002a7.78 7.78 0 0 1-2.888-0.546c-124.272-48.288-177.378-121.084-179.582-124.162a7.996 7.996 0 0 1 1.852-11.154 7.968 7.968 0 0 1 11.154 1.844c0.516 0.704 52.856 72.11 172.356 118.568a7.976 7.976 0 0 1 4.56 10.342 7.992 7.992 0 0 1-7.452 5.108zM344.036 815.938c-115.578 0-149.922-65.598-151.328-68.392a7.988 7.988 0 0 1 3.554-10.732 7.986 7.986 0 0 1 10.722 3.516c1.282 2.5 31.97 59.612 137.05 59.612 105.12 0 135.588-57.158 136.83-59.596a8.04 8.04 0 0 1 10.74-3.516 7.986 7.986 0 0 1 3.554 10.702c-1.396 2.792-35.53 68.406-151.122 68.406z"
                        fill="" />
                </svg>
            ),
        },
        // {
        //     icon: (
        //         <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
        //     ),
        // },
        {
            path: ROUTER_URL.ADMIN.STATISTICS,
            label: 'Thống kê',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 15v3m4-6v6m4-9v9" />
                </svg>
            ),
        },
        {
            path: ROUTER_URL.ADMIN.SETTINGS,
            label: 'Cài đặt',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className={`relative h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-[350px]'} shadow-lg`}
        >
            {/* Collapse/Expand Button */}
            <button
                className={`absolute top-4 right-2 z-20 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors ${collapsed ? 'rotate-180' : ''}`}
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            {/* Logo and User Info */}
            <div className={`p-3 flex flex-col justify-start items-start ${collapsed ? 'px-1' : ''}`}>
                <Link
                    to={ROUTER_URL.COMMON.HOME}
                    className={`flex items-center w-full group transition-all duration-300 justify-center`}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        className={`
                            object-contain
                            ${collapsed ? 'w-10 h-10' : 'w-16 h-10'}
                            transition-all duration-300
                            block
                        `}
                        style={{
                            margin: '0 auto',
                            display: 'block',
                            maxHeight: collapsed ? 32 : 40,
                            maxWidth: collapsed ? 32 : 64,
                        }}
                    />
                </Link>
                {user && (
                    <div className={`mt-3 flex items-center ${collapsed ? 'flex-col space-x-0 space-y-1' : 'space-x-2'} bg-gray-700/40 rounded-lg p-1.5 w-full justify-start transition-all duration-300`}>
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold text-base">
                                {user.name?.[0] || user.email?.[0]}
                            </div>
                        )}
                        {!collapsed && (
                            <div className="flex flex-col justify-center">
                                <div className="font-semibold leading-tight text-base">{user.name}</div>
                                <div className="text-xs text-gray-300 leading-tight">{user.email}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Menu */}
            <nav className={`mt-1 flex-1 px-4 py-4 rounded-lg flex flex-col gap-0.5 ${collapsed ? 'items-center' : ''}`}>
                {menuItems.map((item, idx) =>
                    item.path ? (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg relative ${location.pathname === item.path ? 'bg-gray-700 text-white border-l-4 border-amber-400' : ''}`}
                        >
                            <span className="mr-2 flex-shrink-0">{item.icon}</span>
                            {!collapsed && <span className="text-sm">{item.label}</span>}
                            {collapsed && (
                                <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg pointer-events-none transition-opacity duration-200 z-30">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    ) : (
                        <div key={idx} className={`my-1 w-full ${collapsed ? 'w-8' : ''}`}>{item.icon}</div>
                    )
                )}
            </nav>
            {/* Logout Button Fixed at Bottom */}
            {/* <div className={`absolute bottom-0 left-0 w-full pb-6 px-4 ${collapsed ? 'justify-center flex' : ''}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!collapsed && 'Đăng xuất'}
                </button>
            </div> */}
        </div>
    );
};

export default SidebarLayout;
