import { useState, useEffect, useRef } from 'react';
import { useUser } from "@hooks/modules/useUser";
// @ts-ignore
import type { UserSearchItem } from '../../../types/user/User.res.type';
import { motion } from 'framer-motion';
import { helpers } from "@utils/index.ts";
import type { UserSearchAllParams } from '../../../types/user/User.req.type';
import { AddUserModal } from './Create';
import { UserSerice } from '@services/user/user.service';
import { DeleteUser } from './Delete';
import { Detail } from './Detail';
import { UpdateUserModal } from './Update';
import SearchCommon from '../../common/SearchCommon.com';

export const DisplayCom = () => {
    const [users, setUsers] = useState<UserSearchItem[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [openUpdateUserId, setOpenUpdateUserId] = useState<string | null>(null);

    const { searchUsers } = useUser();
    const searchUsersRef = useRef(searchUsers);

    useEffect(() => {
        searchUsersRef.current = searchUsers;
    }, [searchUsers]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchData = async () => {
            try {
                const params: UserSearchAllParams = {
                    pageIndex: currentPage,
                    pageSize: pageSize,
                    sortBy: 'CreatedAt',
                    sortOrder: 'desc',
                };
                if (searchTerm.trim() !== '') {
                    params.keyword = searchTerm.trim();
                }
                const response = await searchUsersRef.current.mutateAsync(params);
                if (!isMounted) return;
                if (response.data.isSuccess) {
                    setUsers(response.data.data.items || []);
                    setTotalRecords(response.data.data.totalRecords || 0);
                } else {
                    helpers.notificationMessage(response.data.message || "Lỗi khi tải danh sách người dùng", "error");
                }
            } catch (error) {
                if (!isMounted) return;
                console.error('Error fetching users:', error);
                helpers.notificationMessage("Lỗi khi tải danh sách người dùng", "error");
            } finally {
                if (!isMounted) return;
                setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [searchTerm, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const getRoleLabel = (role: number) => {
        switch (role) {
            case 0: return 'Admin';
            case 1: return 'Seller';
            case 2: return 'Shipper';
            case 3: return 'Buyer';
            default: return 'Unknown';
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return 'Active';
            case 1: return 'Inactive';
            case 2: return 'Blocked';
            default: return 'Unknown';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'bg-green-500/20 text-green-400';
            case 1: return 'bg-yellow-500/20 text-yellow-400';
            case 2: return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getRoleColor = (role: number) => {
        switch (role) {
            case 0: return 'bg-purple-500/20 text-purple-400';
            case 1: return 'bg-amber-500/20 text-amber-400';
            case 2: return 'bg-green-500/20 text-green-400';
            case 3: return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    // Thêm hàm để thêm user mới vào danh sách
    const handleAddUser = (newUser: Partial<UserSearchItem> & { id: string; email: string; role: number }) => {
        setUsers(prev => [{
            id: newUser.id,
            name: newUser.name || '',
            email: newUser.email,
            phoneNumber: newUser.phoneNumber || '',
            avatarUrl: null,
            status: 0, // mặc định là Active
            role: newUser.role,
        }, ...prev]);
        setTotalRecords(prev => prev + 1);
    };

    // Block user
    const handleBlockUser = async (id: string) => {
        try {
            await UserSerice.deleteUser(id);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 2 } : u));
            helpers.notificationMessage('Block người dùng thành công!', 'success');
        } catch (error) {
            helpers.notificationMessage('Block người dùng thất bại!', 'error');
        }
    };

    const handleUpdateUserSuccess = (updatedUser: UserSearchItem) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    };

    const blockedCount = users.filter(u => u.status === 2).length;
    const activeCount = users.filter(u => u.status === 0).length;

    if (selectedUserId) {
        return <Detail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
    }

    return (
        <div className="min-h-screen p-6 rounded-lg">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Quản Lý Người Dùng
                            </h1>
                            <p className="text-gray-400">
                                Quản lý tài khoản người dùng trong hệ thống
                            </p>
                        </div>
                        <button
                            onClick={() => setOpenAddUser(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:from-amber-600 hover:to-amber-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm người dùng
                        </button>
                    </div>
                </motion.div>

                {/* Add User Modal */}
                <AddUserModal
                    open={openAddUser}
                    onCancel={() => setOpenAddUser(false)}
                    onSuccess={() => setOpenAddUser(false)}
                    onAddUser={handleAddUser}
                />

                {/* Search and Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    {/* Search Row */}
                    <div className="mb-6">
                        <SearchCommon
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onSearch={() => { setSearchTerm(searchInput); setCurrentPage(1); }}
                            placeholder="Tìm kiếm người dùng theo tên, email..."
                        />
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tổng người dùng */}
                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Tổng người dùng</p>
                                    <p className="text-2xl font-bold text-white">{totalRecords}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-white">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Đã bị block */}
                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Đã bị block</p>
                                    <p className="text-2xl font-bold text-white">{blockedCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L5.636 18.364" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {searchTerm ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
                            </h3>
                            <p className="text-gray-400">
                                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có người dùng nào trong hệ thống'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Người Dùng
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Thông Tin Liên Hệ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Vai Trò
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Trạng Thái
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Thao Tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-700/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">
                                                                {user.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                ID: {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">{user.email}</div>
                                                    <div className="text-sm text-gray-400">{user.phoneNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                                        {getStatusLabel(user.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                                            title="Xem chi tiết"
                                                            onClick={() => setSelectedUserId(user.id)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                                                            title="Chỉnh sửa"
                                                            onClick={() => setOpenUpdateUserId(user.id)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <DeleteUser userId={user.id} onBlock={handleBlockUser} disabled={user.status === 2} />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-400">
                                                Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalRecords)} của {totalRecords} kết quả
                                            </span>
                                            <select
                                                value={pageSize}
                                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:border-amber-500"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 transition-colors"
                                            >
                                                Trước
                                            </button>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-gray-800 border border-gray-700 text-white hover:border-amber-500'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 transition-colors"
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
                {/* Update User Modal */}
                {openUpdateUserId && (
                    <UpdateUserModal
                        user={users.find(u => u.id === openUpdateUserId)!}
                        open={!!openUpdateUserId}
                        onClose={() => setOpenUpdateUserId(null)}
                        onSuccess={handleUpdateUserSuccess}
                    />
                )}
            </div>
        </div>
    );
};
