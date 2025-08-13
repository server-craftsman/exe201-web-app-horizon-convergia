import { useState, useEffect } from 'react';
import { useNews } from "@hooks/modules/useNews";
import { useCategory } from '../../../hooks/modules/useCategory';
import type { NewsResponse } from '../../../types/news/News.res.type';
import { motion } from 'framer-motion';
import { helpers } from "@utils/index.ts";
import SearchCommon from '../../common/SearchCommon.com';
import { CreateNewsModal } from './Create';
import { UpdateNewsModal } from './Update';
import { DeleteNews } from './Delete';
import { memo } from 'react';

export const NewsDisplayCom = () => {
    const [news, setNews] = useState<NewsResponse[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState<string>('');

    const { getAllNews } = useNews();
    const { useGetAllCategories } = useCategory();

    // Get all categories
    const { data: categoriesData } = useGetAllCategories({ pageSize: 100 });

    // Sử dụng data trực tiếp từ react-query
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Call API với pageSize lớn để lấy tất cả bài viết
                const response = await fetch("https://horizon-convergia.onrender.com/api/Blog?pageSize=1000", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                if (response.ok) {
                    const newsData = await response.json();
                    console.log('News data from direct API call:', newsData);
                    setNews(newsData);
                } else {
                    throw new Error("Failed to fetch news");
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                helpers.notificationMessage("Lỗi khi tải danh sách tin tức", "error");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchNews();
        
        // Backup approach using react-query
        if (getAllNews.data && Array.isArray(getAllNews.data)) {
            console.log('News data from query:', getAllNews.data);
            setNews(getAllNews.data);
        }
        setIsLoading(getAllNews.isLoading);
        
        if (getAllNews.error) {
            console.error('Error fetching news:', getAllNews.error);
            helpers.notificationMessage("Lỗi khi tải danh sách tin tức", "error");
        }
    }, [getAllNews.data, getAllNews.isLoading, getAllNews.error]);

    // Load categories
    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData);
        }
    }, [categoriesData]);

    // Trigger initial fetch
    useEffect(() => {
        getAllNews.refetch();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const getStatusLabel = (isDeleted: boolean) => {
        return isDeleted ? 'Đã xóa' : 'Hoạt động';
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Không có danh mục';
    };

    const filteredNews = news.filter(item => {
        const matchesSearch = searchTerm === '' || 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true; // Mặc định hiển thị tất cả
        if (statusFilter === 'active') {
            matchesStatus = !item.isDeleted;
        } else if (statusFilter === 'deleted') {
            matchesStatus = item.isDeleted;
        }
        // Nếu statusFilter === '' thì matchesStatus = true (hiển thị tất cả)

        const matchesCategory = categoryFilter === '' || item.categoryId === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    console.log('Total news:', news.length);
    console.log('Filtered news:', filteredNews.length);
    console.log('Search term:', searchTerm);
    console.log('Status filter:', statusFilter);

    const paginatedNews = filteredNews.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredNews.length / pageSize);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Quản lý tin tức ({news.length} bài viết)</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm tin tức
                </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                <SearchCommon
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onSearch={() => setSearchTerm(searchInput)}
                    placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                />
                
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="deleted">Đã xóa</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5 / trang</option>
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                    <option value={50}>50 / trang</option>
                </select>
            </div>

            {/* News Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Tiêu đề
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Nội dung
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                                        Đang tải... (Loading: {getAllNews.isLoading ? 'true' : 'false'}, Error: {getAllNews.error ? 'có lỗi' : 'không'})
                                    </td>
                                </tr>
                            ) : paginatedNews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                                        Không có tin tức nào (Total: {news.length}, Filtered: {filteredNews.length})
                                    </td>
                                </tr>
                            ) : (
                                paginatedNews.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white max-w-xs truncate">
                                                {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div 
                                                className="text-sm text-gray-300 max-w-xs truncate"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: (() => {
                                                        // Convert markdown to HTML for display
                                                        let htmlContent = item.content
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                            .replace(/__(.*?)__/g, '<u>$1</u>')
                                                            .replace(/~~(.*?)~~/g, '<strike>$1</strike>')
                                                            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                                                            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                                                            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                                                            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                                                            .replace(/^- (.*$)/gm, '<li>$1</li>')
                                                            .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                                                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                                                            .replace(/\n/g, '<br>');
                                                        
                                                        // Remove HTML tags for character count
                                                        const textOnly = htmlContent.replace(/<[^>]*>/g, '');
                                                        
                                                        // Truncate and add ellipsis if needed
                                                        if (textOnly.length > 20) {
                                                            const truncatedText = textOnly.substring(0, 20);
                                                            return truncatedText + '...';
                                                        }
                                                        return htmlContent;
                                                    })()
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300 max-w-xs truncate">
                                                {getCategoryName(item.categoryId)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.isDeleted 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {getStatusLabel(item.isDeleted)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {helpers.formatDate(new Date(item.createdAt))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedNewsId(item.id);
                                                        setIsUpdateModalOpen(true);
                                                    }}
                                                    className="text-yellow-400 hover:text-yellow-300"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <DeleteNews newsId={item.id} />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 bg-gray-700 border-t border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-300">
                                Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, filteredNews.length)} của {filteredNews.length} tin tức
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-600 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Create News Modal */}
            <CreateNewsModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            
            {/* Update News Modal */}
            <UpdateNewsModal 
                newsId={selectedNewsId}
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedNewsId('');
                }}
            />
        </div>
    );
};

export default memo(NewsDisplayCom);
