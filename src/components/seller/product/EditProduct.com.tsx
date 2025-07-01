import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useCategory } from '../../../hooks';
import { ROUTER_URL } from '@consts/router.path.const';
import type { UpdateProduct } from '../../../types/product/Product.req.type';
// import type { ProductResponse } from '../../../types/product/Product.res.type';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        updateProduct,
        isUpdatingProduct,
        uploadFileAsync,
        isUploadingFile,
        // updateProductError,
        useProductById
    } = useProduct();
    const { getCategorys } = useCategory();

    // Get product data
    const {
        data: product,
        isLoading: isLoadingProduct,
        error: productError
    } = useProductById(id || '');

    const [categories, setCategories] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<UpdateProduct>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        location: '',
        condition: 'NEW',
        quantity: 1,
        categoryId: '',
        imageUrls: []
    });

    // Load categories on component mount
    useEffect(() => {
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

    // Populate form when product data is loaded
    useEffect(() => {
        if (product) {
            setFormData({
                brand: product.brand,
                model: product.model,
                year: product.year,
                price: product.price,
                description: product.description,
                location: product.location,
                condition: product.condition,
                quantity: product.quantity,
                categoryId: product.categoryId,
                imageUrls: product.imageUrls || []
            });
            setUploadedImages(product.imageUrls || []);
        }
    }, [product]);

    // Update formData when uploaded images change
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            imageUrls: uploadedImages
        }));
    }, [uploadedImages]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (formData.brand && !formData.brand.trim()) {
            newErrors.brand = 'Thương hiệu không được để trống';
        }

        if (formData.model && !formData.model.trim()) {
            newErrors.model = 'Dòng xe không được để trống';
        }

        if (formData.year && (formData.year < 1980 || formData.year > new Date().getFullYear())) {
            newErrors.year = 'Năm sản xuất không hợp lệ';
        }

        if (formData.price && formData.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (formData.description && !formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống';
        }

        if (formData.location && !formData.location.trim()) {
            newErrors.location = 'Địa điểm không được để trống';
        }

        if (formData.quantity && formData.quantity < 1) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
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

        if (!validateForm() || !id) {
            return;
        }

        // Only send fields that have been modified
        const updateData: UpdateProduct = {};
        if (formData.brand !== product?.brand) updateData.brand = formData.brand;
        if (formData.model !== product?.model) updateData.model = formData.model;
        if (formData.year !== product?.year) updateData.year = formData.year;
        if (formData.price !== product?.price) updateData.price = formData.price;
        if (formData.description !== product?.description) updateData.description = formData.description;
        if (formData.location !== product?.location) updateData.location = formData.location;
        if (formData.condition !== product?.condition) updateData.condition = formData.condition;
        if (formData.quantity !== product?.quantity) updateData.quantity = formData.quantity;
        if (formData.categoryId !== product?.categoryId) updateData.categoryId = formData.categoryId;
        if (JSON.stringify(formData.imageUrls) !== JSON.stringify(product?.imageUrls)) {
            updateData.imageUrls = formData.imageUrls;
        }

        try {
            await updateProduct({ id, data: updateData });
            navigate(ROUTER_URL.SELLER.PRODUCTS);
        } catch (error) {
            console.error('Failed to update product:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Không thể cập nhật sản phẩm. Vui lòng thử lại.'
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

    // Show loading state
    if (isLoadingProduct) {
        return (
            <div className="p-6 text-center">
                <div className="text-white flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải thông tin sản phẩm...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (productError || !product) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-400 mb-4">
                    {productError ? 'Có lỗi xảy ra khi tải sản phẩm' : 'Không tìm thấy sản phẩm'}
                </div>
                <button
                    onClick={() => navigate(ROUTER_URL.SELLER.PRODUCTS)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Chỉnh Sửa Sản Phẩm</h2>

            {/* Display general errors */}
            {(errors.categories || errors.submit) && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    {errors.categories && <p className="text-red-400 mb-2">{errors.categories}</p>}
                    {errors.submit && <p className="text-red-400">{errors.submit}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                        <label className="block text-white mb-2">Thương hiệu</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand || ''}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.brand ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="Honda, Yamaha, Suzuki..."
                        />
                        {errors.brand && <p className="text-red-400 text-sm mt-1">{errors.brand}</p>}
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-white mb-2">Dòng xe</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model || ''}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.model ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="Wave Alpha, Exciter 155..."
                        />
                        {errors.model && <p className="text-red-400 text-sm mt-1">{errors.model}</p>}
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-white mb-2">Năm sản xuất</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year || ''}
                            onChange={handleChange}
                            min="1980"
                            max={new Date().getFullYear()}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.year ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                        />
                        {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-white mb-2">Giá (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.price ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="25000000"
                        />
                        {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-white mb-2">Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.location ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                            placeholder="TP. HCM, Hà Nội..."
                        />
                        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-white mb-2">Tình trạng</label>
                        <select
                            name="condition"
                            value={formData.condition || 'NEW'}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
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
                        <label className="block text-white mb-2">Số lượng</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity || ''}
                            onChange={handleChange}
                            min="1"
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.quantity ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
                        />
                        {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-white mb-2">Danh mục</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId || ''}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.categoryId ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                } focus:outline-none`}
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
                    <label className="block text-white mb-2">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.description ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                            } focus:outline-none resize-none`}
                        placeholder="Mô tả chi tiết về sản phẩm..."
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
                            <p className="text-white text-sm mb-2">Hình ảnh hiện tại:</p>
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
                        disabled={isUpdatingProduct}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        {isUpdatingProduct ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang cập nhật...</span>
                            </>
                        ) : (
                            <span>Cập Nhật Sản Phẩm</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct; 