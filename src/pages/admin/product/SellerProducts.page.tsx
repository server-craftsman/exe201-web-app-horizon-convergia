import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks/modules/useCategory';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { DisplayDetailComponent } from '../../../components/admin/product/DisplayDetail.com';
import { UserSerice } from '../../../services/user/user.service';

interface SellerProductsFilter {
    categoryId: string;
    brand: string;
    model: string;
    year?: number;
    minPrice?: number;
    maxPrice?: number;
    description: string;
    location: string;
    condition: string;
    quantity?: number;
    engineCapacity?: number;
    fuelType: string;
    mileage?: number;
    color: string;
    accessoryType: string;
    size: string;
    sparePartType: string;
    vehicleCompatible: string;
    sortField: string;
    ascending: boolean;
    pageNumber: number;
    pageSize: number;
}

const SellerProductsPage: React.FC = () => {
    const { getCategorys } = useCategory();
    const [categories, setCategories] = useState<any[]>([]);
    const [sellers, setSellers] = useState<any[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<string>('');
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [filter, setFilter] = useState<SellerProductsFilter>({
        categoryId: '',
        brand: '',
        model: '',
        year: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        description: '',
        location: '',
        condition: '',
        quantity: undefined,
        engineCapacity: undefined,
        fuelType: '',
        mileage: undefined,
        color: '',
        accessoryType: '',
        size: '',
        sparePartType: '',
        vehicleCompatible: '',
        sortField: 'createdAt',
        ascending: false,
        pageNumber: 1,
        pageSize: 10,
    });

    // Load categories and sellers on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await getCategorys.mutateAsync({ pageSize: 1000 });
                if (result?.data) setCategories(result.data);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        
        const loadSellers = async () => {
            try {
                // Cách 1: Sử dụng UserService để search sellers
                const result = await UserSerice.searchUsers({
                    role: 1, // 1 = SELLER role integer
                    pageIndex: 1,
                    pageSize: 1000
                });

                if (result?.data?.data?.items) {
                    const sellerList = result.data.data.items.map((user: any) => ({
                        id: user.id,
                        name: user.name || user.email || user.username || 'Không có tên'
                    }));
                    setSellers(sellerList);
                } else {
                    throw new Error('No sellers found in search result');
                }
            } catch (searchError) {
                console.warn('UserService.searchUsers failed, trying direct API call:', searchError);
                
                try {
                    // Cách 2: Thử gọi trực tiếp API với endpoint khác
                    const token = localStorage.getItem('accessToken');
                    const response = await fetch(
                        'https://horizon-convergia.onrender.com/api/Users/search?role=1&pageIndex=1&pageSize=1000',
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'accept': '*/*'
                            }
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data?.data?.items) {
                            const sellerList = data.data.items.map((user: any) => ({
                                id: user.id,
                                name: user.name || user.email || 'Seller ' + user.id.slice(0, 8)
                            }));
                            setSellers(sellerList);
                        } else {
                            throw new Error('Invalid API response structure');
                        }
                    } else {
                        throw new Error(`API returned ${response.status}`);
                    }
                } catch (directApiError) {
                    console.error('Both API approaches failed:', directApiError);
                    // Fallback to mock data if all APIs fail
                    setSellers([
                        { id: 'be4f601e-ec6d-4ac4-8c33-2a687846e326', name: 'Seller Thượng Đẳng' },
                        { id: 'seller-2', name: 'Seller Demo 2' },
                        { id: 'seller-3', name: 'Seller Demo 3' },
                    ]);
                }
            }
        };
        
        loadCategories();
        loadSellers();
    }, []);

    const fetchSellerProducts = async (sellerId: string) => {
        if (!sellerId) return;
        
        setLoading(true);
        setError('');
        
        try {
            // Build query parameters
            const params = new URLSearchParams();
            
            // Required parameters
            params.append('Ascending', filter.ascending.toString());
            params.append('PageNumber', filter.pageNumber.toString());
            params.append('PageSize', filter.pageSize.toString());
            
            // Optional filters
            if (filter.categoryId) params.append('CategoryId', filter.categoryId);
            if (filter.brand) params.append('Brand', filter.brand);
            if (filter.model) params.append('Model', filter.model);
            if (filter.year) params.append('Year', filter.year.toString());
            if (filter.minPrice) params.append('MinPrice', filter.minPrice.toString());
            if (filter.maxPrice) params.append('MaxPrice', filter.maxPrice.toString());
            if (filter.description) params.append('Description', filter.description);
            if (filter.location) params.append('Location', filter.location);
            if (filter.condition) params.append('Condition', filter.condition);
            if (filter.quantity) params.append('Quantity', filter.quantity.toString());
            if (filter.engineCapacity) params.append('EngineCapacity', filter.engineCapacity.toString());
            if (filter.fuelType) params.append('FuelType', filter.fuelType);
            if (filter.mileage) params.append('Mileage', filter.mileage.toString());
            if (filter.color) params.append('Color', filter.color);
            if (filter.accessoryType) params.append('AccessoryType', filter.accessoryType);
            if (filter.size) params.append('Size', filter.size);
            if (filter.sparePartType) params.append('SparePartType', filter.sparePartType);
            if (filter.vehicleCompatible) params.append('VehicleCompatible', filter.vehicleCompatible);
            if (filter.sortField) params.append('SortField', filter.sortField);

            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                `https://horizon-convergia.onrender.com/api/Products/unverified-unpaid/${sellerId}?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch seller products:', error);
            setError('Không thể tải sản phẩm người bán. Vui lòng thử lại.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSellerChange = (sellerId: string) => {
        setSelectedSeller(sellerId);
        if (sellerId) {
            fetchSellerProducts(sellerId);
        } else {
            setProducts([]);
        }
    };

    const handleFilterChange = () => {
        if (selectedSeller) {
            fetchSellerProducts(selectedSeller);
        }
    };

    const conditionMap: { [key: string]: string } = {
        'NEW': 'Mới',
        'LIKE_NEW': 'Như mới',
        'GOOD': 'Tốt',
        'FAIR': 'Khá',
        'POOR': 'Cũ'
    };

    const getConditionText = (condition: string) => conditionMap[condition] || condition;

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Khả dụng';
            case 1: return 'Không khả dụng';
            case 2: return 'Chờ thanh toán';
            case 3: return 'Đã thanh toán';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'text-green-400';
            case 1: return 'text-red-400';
            case 2: return 'text-yellow-400';
            case 3: return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Quản lý Sản phẩm Người bán</h1>
                <p className="text-gray-400">Xem và quản lý các sản phẩm chưa xác minh và chưa thanh toán của người bán</p>
            </div>

            {/* Seller Selection */}
            <div className="mb-6 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                <label className="block text-white mb-2 font-medium">Chọn người bán:</label>
                <select
                    value={selectedSeller}
                    onChange={(e) => handleSellerChange(e.target.value)}
                    className="w-full max-w-md p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-amber-500 focus:outline-none"
                >
                    <option value="">-- Chọn người bán --</option>
                    {sellers.map(seller => (
                        <option key={seller.id} value={seller.id}>{seller.name}</option>
                    ))}
                </select>
            </div>

            {/* Filters */}
            {selectedSeller && (
                <div className="mb-6 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Bộ lọc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Danh mục</label>
                            <select
                                value={filter.categoryId}
                                onChange={(e) => setFilter(prev => ({ ...prev, categoryId: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Thương hiệu</label>
                            <input
                                type="text"
                                value={filter.brand}
                                onChange={(e) => setFilter(prev => ({ ...prev, brand: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                                placeholder="Honda, Yamaha..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Mẫu xe</label>
                            <input
                                type="text"
                                value={filter.model}
                                onChange={(e) => setFilter(prev => ({ ...prev, model: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                                placeholder="Wave, Winner..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Tình trạng</label>
                            <select
                                value={filter.condition}
                                onChange={(e) => setFilter(prev => ({ ...prev, condition: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            >
                                <option value="">Tất cả tình trạng</option>
                                <option value="NEW">Mới</option>
                                <option value="LIKE_NEW">Như mới</option>
                                <option value="GOOD">Tốt</option>
                                <option value="FAIR">Khá</option>
                                <option value="POOR">Cũ</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Sắp xếp theo</label>
                            <select
                                value={filter.sortField}
                                onChange={(e) => setFilter(prev => ({ ...prev, sortField: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            >
                                <option value="createdAt">Ngày tạo</option>
                                <option value="price">Giá</option>
                                <option value="year">Năm sản xuất</option>
                                <option value="brand">Thương hiệu</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Thứ tự</label>
                            <select
                                value={filter.ascending ? 'asc' : 'desc'}
                                onChange={(e) => setFilter(prev => ({ ...prev, ascending: e.target.value === 'asc' }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            >
                                <option value="desc">Giảm dần</option>
                                <option value="asc">Tăng dần</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">Số lượng/trang</label>
                            <select
                                value={filter.pageSize}
                                onChange={(e) => setFilter(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
                                className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                onClick={handleFilterChange}
                                className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Áp dụng lọc
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-white flex items-center space-x-2">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải sản phẩm...</span>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {!loading && selectedSeller && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">
                            Sản phẩm chưa xác minh ({products.length})
                        </h3>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-lg mb-2">Không có sản phẩm nào được tìm thấy.</p>
                            <p className="text-sm">Thử thay đổi bộ lọc hoặc chọn người bán khác.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-all duration-300">
                                    {/* Product Image Gallery */}
                                    <div className="relative">
                                        {/* Main Image */}
                                        <div className="h-48 relative">
                                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                                <img
                                                    src={product.imageUrls[0]}
                                                    alt={`${product.brand} ${product.model}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                    <span className="text-gray-400 text-4xl">📸</span>
                                                </div>
                                            )}
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)} bg-black/50`}>
                                                    {getStatusText(product.status)}
                                                </span>
                                            </div>
                                            
                                            {/* Verification Badge */}
                                            <div className="absolute top-2 right-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isVerified ? 'text-green-400' : 'text-red-400'} bg-black/50`}>
                                                    {product.isVerified ? '✓ Đã xác minh' : '✗ Chưa xác minh'}
                                                </span>
                                            </div>

                                            {/* Image Count Badge */}
                                            {product.imageUrls && product.imageUrls.length > 1 && (
                                                <div className="absolute bottom-2 right-2">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black/70 text-white">
                                                        +{product.imageUrls.length - 1} ảnh
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnail Gallery */}
                                        {product.imageUrls && product.imageUrls.length > 1 && (
                                            <div className="px-3 py-2 bg-gray-800">
                                                <div className="flex space-x-2 overflow-x-auto">
                                                    {product.imageUrls.slice(1, 4).map((url, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={url}
                                                            alt={`thumbnail-${idx}`}
                                                            className="w-12 h-12 object-cover rounded-md border border-gray-600 flex-shrink-0"
                                                        />
                                                    ))}
                                                    {product.imageUrls.length > 4 && (
                                                        <div className="w-12 h-12 bg-gray-700 rounded-md border border-gray-600 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs text-gray-300">+{product.imageUrls.length - 4}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-4">
                                        <h4 className="text-lg font-bold text-white mb-2">
                                            {product.brand} {product.model} ({product.year})
                                        </h4>
                                        
                                        <div className="text-2xl font-bold text-emerald-400 mb-3">
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Tình trạng:</span>
                                                <span className="text-white">{getConditionText(product.condition || '')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Số lượng:</span>
                                                <span className="text-white">{product.quantity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Dung tích:</span>
                                                <span className="text-white">{product.engineCapacity}cc</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Màu sắc:</span>
                                                <span className="text-white">{product.color}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Tạo lúc:</span>
                                                <span className="text-white">
                                                    {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-gray-300 text-xs mb-2">Địa điểm:</p>
                                            <p className="text-white text-sm truncate">{product.location}</p>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="mt-4 space-y-2">
                                            <button 
                                                onClick={() => setSelectedProductId(product.id)}
                                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                            >
                                                Xem chi tiết
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                                                    Xác minh
                                                </button>
                                                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                                                    Từ chối
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        disabled={filter.pageNumber === 1}
                        onClick={() => setFilter(prev => ({ ...prev, pageNumber: 1 }))}
                        className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
                    >
                        ««
                    </button>
                    <button
                        disabled={filter.pageNumber === 1}
                        onClick={() => setFilter(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
                        className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
                    >
                        ‹
                    </button>
                    <span className="px-4 py-2 bg-gray-800 text-white rounded">
                        Trang {filter.pageNumber}
                    </span>
                    <button
                        disabled={products.length < filter.pageSize}
                        onClick={() => setFilter(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
                        className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
                    >
                        ›
                    </button>
                </div>
            )}

            {/* Product Detail Popup */}
            <DisplayDetailComponent
                productId={selectedProductId}
                onClose={() => setSelectedProductId(null)}
                categories={categories}
            />
        </div>
    );
};

export default SellerProductsPage;
