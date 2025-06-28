import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct, useCategory } from '../../../hooks';
import { ROUTER_URL } from '@consts/router.path.const';

const AddProduct: React.FC = () => {
    const { createProduct, isCreatingProduct } = useProduct();
    const { getCategorys } = useCategory();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        description: '',
        location: '',
        condition: 'NEW',
        quantity: 1,
        sellerId: '', // Will be set from localStorage
        categoryId: ''
    });

    // Load categories and set sellerId from localStorage on component mount
    useEffect(() => {
        // Get userId from localStorage and set as sellerId
        const userId = localStorage.getItem('userId');
        if (userId) {
            setFormData(prev => ({
                ...prev,
                sellerId: userId
            }));
        } else {
            console.warn('No userId found in localStorage');
        }

        const loadCategories = async () => {
            try {
                const result = await getCategorys.mutateAsync();
                if (result?.data) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that sellerId is available
        if (!formData.sellerId) {
            alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            year: parseInt(formData.year.toString()),
            quantity: parseInt(formData.quantity.toString())
        };

        try {
            await createProduct(productData);
            // Redirect to product management page after successful creation
            navigate(ROUTER_URL.SELLER.PRODUCTS);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const conditionOptions = [
        { value: 'NEW', label: 'Mới' },
        { value: 'LIKE_NEW', label: 'Như mới' },
        { value: 'GOOD', label: 'Tốt' },
        { value: 'FAIR', label: 'Khá' },
        { value: 'POOR', label: 'Cũ' }
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Thêm Sản Phẩm Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                        <label className="block text-white mb-2">Thương hiệu *</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            placeholder="Honda, Yamaha, Suzuki..."
                            required
                        />
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-white mb-2">Dòng xe *</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            placeholder="Wave Alpha, Exciter 155..."
                            required
                        />
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-white mb-2">Năm sản xuất *</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            min="1980"
                            max={new Date().getFullYear()}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-white mb-2">Giá (VNĐ) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            placeholder="25000000"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-white mb-2">Địa điểm *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            placeholder="TP.HCM, Hà Nội..."
                            required
                        />
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-white mb-2">Tình trạng *</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            required
                        >
                            {conditionOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-white mb-2">Số lượng *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-white mb-2">Danh mục *</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white mb-2">Mô tả *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        rows={4}
                        placeholder="Mô tả chi tiết về sản phẩm, tình trạng, lịch sử sử dụng..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isCreatingProduct}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                >
                    {isCreatingProduct ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tạo...</span>
                        </div>
                    ) : (
                        'Tạo Sản Phẩm'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;