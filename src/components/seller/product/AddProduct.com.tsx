import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct, useCategory } from '../../../hooks';
import { ROUTER_URL } from '@consts/router.path.const';
import type { CreateProduct } from '../../../types/product/Product.req.type';

const AddProduct: React.FC = () => {
    const {
        createProductBySeller,
        isCreatingProduct,
        uploadFileAsync,
        isUploadingFile,
        // createProductError
    } = useProduct();
    const { getCategorys } = useCategory();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<CreateProduct>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        location: '',
        condition: 'NEW',
        quantity: 1,
        sellerId: '', // Will be set from localStorage
        categoryId: '',
        imageUrls: []
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
            setErrors(prev => ({
                ...prev,
                sellerId: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.'
            }));
        }

        const loadCategories = async () => {
            try {
                const result = await getCategorys.mutateAsync();
                if (result?.data) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
                setErrors(prev => ({
                    ...prev,
                    categories: 'Không thể tải danh sách danh mục'
                }));
            }
        };
        loadCategories();
    }, []);

    // Update formData when uploaded images change
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            imageUrls: uploadedImages
        }));
    }, [uploadedImages]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.brand.trim()) {
            newErrors.brand = 'Thương hiệu không được để trống';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Dòng xe không được để trống';
        }

        if (formData.year < 1980 || formData.year > new Date().getFullYear()) {
            newErrors.year = 'Năm sản xuất không hợp lệ';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Địa điểm không được để trống';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Vui lòng chọn danh mục';
        }

        if (formData.quantity < 1) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }

        if (!formData.sellerId) {
            newErrors.sellerId = 'Thông tin người dùng không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImageUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const result = await uploadFileAsync({ file, type: 'image' });
                    if (result?.data?.url) {
                        newImageUrls.push(result.data.url);
                    }
                }
            }

            setUploadedImages(prev => [...prev, ...newImageUrls]);

            // Clear any previous image upload errors
            if (errors.images) {
                setErrors(prev => {
                    const { images, ...rest } = prev;
                    return rest;
                });
            }
        } catch (error) {
            console.error('Failed to upload images:', error);
            setErrors(prev => ({
                ...prev,
                images: 'Không thể tải lên hình ảnh'
            }));
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await createProductBySeller(formData);
            // Redirect to product management page after successful creation
            navigate(ROUTER_URL.SELLER.PRODUCTS);
        } catch (error) {
            console.error('Failed to create product:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Không thể tạo sản phẩm. Vui lòng thử lại.'
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: removed, ...rest } = prev;
                return rest;
            });
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'year' || name === 'quantity'
                ? parseFloat(value) || 0
                : value
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

            {/* Display general errors */}
            {(errors.sellerId || errors.categories || errors.submit) && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    {errors.sellerId && <p className="text-red-400 mb-2">{errors.sellerId}</p>}
                    {errors.categories && <p className="text-red-400 mb-2">{errors.categories}</p>}
                    {errors.submit && <p className="text-red-400">{errors.submit}</p>}
                </div>
            )}

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
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.brand ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="Honda, Yamaha, Suzuki..."
                            required
                        />
                        {errors.brand && <p className="text-red-400 text-sm mt-1">{errors.brand}</p>}
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-white mb-2">Dòng xe *</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.model ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="Wave Alpha, Exciter 155..."
                            required
                        />
                        {errors.model && <p className="text-red-400 text-sm mt-1">{errors.model}</p>}
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
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.year ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            required
                        />
                        {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-white mb-2">Giá (VNĐ) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.price ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="25000000"
                            required
                        />
                        {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-white mb-2">Địa điểm *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.location ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="TP. HCM, Hà Nội..."
                            required
                        />
                        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
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
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.quantity ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            required
                        />
                        {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-white mb-2">Danh mục *</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.categoryId ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white mb-2">Mô tả *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.description ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                            } focus:outline-none resize-none`}
                        placeholder="Mô tả chi tiết về sản phẩm..."
                        required
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-white mb-2">Hình ảnh sản phẩm</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        disabled={isUploadingFile}
                    />
                    {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}

                    {isUploadingFile && (
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-white text-sm">Đang tải lên hình ảnh...</span>
                        </div>
                    )}

                    {/* Image Preview */}
                    {uploadedImages.length > 0 && (
                        <div className="mt-4">
                            <p className="text-white text-sm mb-2">Hình ảnh đã tải lên:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTER_URL.SELLER.PRODUCTS)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isCreatingProduct || !formData.sellerId}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        {isCreatingProduct ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang tạo...</span>
                            </>
                        ) : (
                            <span>Thêm Sản Phẩm</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;