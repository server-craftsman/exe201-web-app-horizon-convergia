import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../../../services/product/product.service';
import type { CreateProduct } from '../../../types/product/Product.req.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategory } from '@hooks/modules/useCategory';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import CourseraEditor from '../../common/CourseraEditor';
import { useVietnamAddress } from '@hooks/other/useVietnamAddress';

interface AddProductAdminProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface FormErrors {
    brand?: string;
    model?: string;
    year?: string;
    price?: string;
    description?: string;
    location?: string;
    condition?: string;
    quantity?: string;
    categoryId?: string;
    general?: string;
}

export const AddProductAdminComponent: React.FC<AddProductAdminProps> = ({
    onClose,
    onSuccess
}) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<CreateProduct>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        location: '',
        condition: 'Mới',
        quantity: 1,
        // sellerId is optional – keep it here for type-safety but
        // make sure it is never sent to the API.
        sellerId: localStorage.getItem('userId') || '',
        categoryId: '',
        imageUrls: [],
        engineCapacity: undefined,
        fuelType: '',
        mileage: undefined,
        color: '',
        accessoryType: '',
        size: '',
        sparePartType: '',
        vehicleCompatible: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [uploadingImages, setUploadingImages] = useState(false);

    /* ---------------- Danh mục ---------------- */
    const [categories, setCategories] = useState<ICategory[]>([]);
    const { getCategorys } = useCategory();

    /* ---------------- Địa chỉ ---------------- */
    const { provinces, getDistricts, getWards, formatAddress } = useVietnamAddress();
    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [wardCode, setWardCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const districtsQuery = getDistricts(provinceCode);
    const wardsQuery = getWards(districtCode);

    /* build full address to formData.location */
    useEffect(() => {
        const provinceName = (provinces.data || []).find((p: any) => String(p.code) === provinceCode)?.name || '';
        const districtName = (districtsQuery.data || []).find((d: any) => String(d.code) === districtCode)?.name || '';
        const wardName = (wardsQuery.data || []).find((w: any) => String(w.code) === wardCode)?.name || '';
        const full = streetAddress || wardName || districtName || provinceName
            ? formatAddress(streetAddress, wardName, districtName, provinceName)
            : '';
        setFormData(prev => ({ ...prev, location: full }));
    }, [
        streetAddress,
        provinceCode,
        districtCode,
        wardCode,
        provinces.data,
        districtsQuery.data,
        wardsQuery.data
    ]);

    /** Lấy danh sách danh mục */
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await getCategorys.mutateAsync();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    }, [getCategorys]);

    // Fetch categories once on mount
    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------------- Mutation ---------------- */
    const createProductMutation = useMutation({
        mutationFn: ProductService.createProductByAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            console.error('Error creating product:', error);
            setErrors({
                general: error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm'
            });
        }
    });

    /* ---------------- Validation ---------------- */
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.brand?.trim()) newErrors.brand = 'Thương hiệu là bắt buộc';
        if (!formData.model?.trim()) newErrors.model = 'Model là bắt buộc';
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)
            newErrors.year = 'Năm sản xuất không hợp lệ';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (!formData.description?.trim()) newErrors.description = 'Mô tả là bắt buộc';
        if (!formData.location?.trim()) newErrors.location = 'Địa điểm là bắt buộc';
        if (!formData.condition?.trim()) newErrors.condition = 'Tình trạng là bắt buộc';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Số lượng phải lớn hơn 0';
        if (!formData.categoryId) newErrors.categoryId = 'Danh mục là bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- Helpers ---------------- */
    const handleInputChange = (field: keyof CreateProduct, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear existing error
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        try {
            // Simulate upload – replace by real upload service if needed.
            const uploadPromises = Array.from(files).map(file => URL.createObjectURL(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            handleInputChange('imageUrls', [...(formData.imageUrls || []), ...uploadedUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            setErrors(prev => ({ ...prev, general: 'Lỗi khi tải lên hình ảnh' }));
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...(formData.imageUrls || [])];
        newImages.splice(index, 1);
        handleInputChange('imageUrls', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setErrors({});

        createProductMutation.mutate(formData);
    };

    /* ---------------- Category-specific fields ---------------- */
    const getCategorySpecificFields = () => {
        const selectedCategoryName = categories.find(c => c.id.toString() === formData.categoryId)?.name || '';

        const isMotorcycle = selectedCategoryName.includes('Xe Máy');
        const isAccessory = selectedCategoryName.includes('Phụ kiện xe máy');
        const isSparePart = selectedCategoryName.includes('Phụ tùng xe máy');

        if (isMotorcycle) {
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dung tích xi-lanh (cc) *
                            </label>
                            <input
                                type="number"
                                value={formData.engineCapacity ?? ''}
                                onChange={e => handleInputChange('engineCapacity', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                placeholder="VD: 150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại nhiên liệu
                            </label>
                            <select
                                value={formData.fuelType}
                                onChange={e => handleInputChange('fuelType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700">
                                <option value="gasoline">Xăng</option>
                                <option value="electric">Điện</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số km đã đi
                            </label>
                            <input
                                type="number"
                                value={formData.mileage ?? ''}
                                onChange={e => handleInputChange('mileage', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                placeholder="VD: 15000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Màu sắc
                            </label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={e => handleInputChange('color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                placeholder="VD: Đỏ"
                            />
                        </div>
                    </div>
                </>
            );
        }

        if (isAccessory) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại phụ kiện
                        </label>
                        <select
                            value={formData.accessoryType}
                            onChange={e => handleInputChange('accessoryType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700">
                            <option value="helmet">Mũ bảo hiểm</option>
                            <option value="clothing">Quần áo bảo hộ</option>
                            <option value="gloves">Găng tay</option>
                            <option value="boots">Giày bảo hộ</option>
                            <option value="bags">Túi đựng đồ</option>
                            <option value="lights">Đèn LED</option>
                            <option value="phone-holder">Giá đỡ điện thoại</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kích thước/Size
                        </label>
                        <input
                            type="text"
                            value={formData.size}
                            onChange={e => handleInputChange('size', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                            placeholder="VD: M, L, XL hoặc kích thước cụ thể"
                        />
                    </div>
                </div>
            );
        }

        if (isSparePart) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại phụ tùng
                        </label>
                        <select
                            value={formData.sparePartType}
                            onChange={e => handleInputChange('sparePartType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus-border-transparent">
                            <option value="engine">Động cơ</option>
                            <option value="brake">Phanh</option>
                            <option value="tire">Lốp xe</option>
                            <option value="battery">Ắc quy</option>
                            <option value="exhaust">Ống xả</option>
                            <option value="filter">Lọc gió/dầu</option>
                            <option value="spark-plug">Bugi</option>
                            <option value="chain">Xích/dây curoa</option>
                            <option value="mirror">Gương chiếu hậu</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tương thích với xe
                        </label>
                        <input
                            type="text"
                            value={formData.vehicleCompatible}
                            onChange={e => handleInputChange('vehicleCompatible', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="VD: Honda Wave, Yamaha Exciter"
                        />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="border-b bg-gradient-to-r from-amber-500 to-amber-600 border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Thêm sản phẩm mới</h2>
                    <button
                        onClick={onClose}
                        disabled={createProductMutation.isPending}
                        className="text-gray-400 hover:text-gray-600 text-3xl font-light"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6">
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin cơ bản</h3>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Danh mục *
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={e => handleInputChange('categoryId', e.target.value)}
                                        disabled={createProductMutation.isPending}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Thương hiệu *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={e => handleInputChange('brand', e.target.value)}
                                        disabled={createProductMutation.isPending}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="VD: Honda, Yamaha"
                                    />
                                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Model *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={e => handleInputChange('model', e.target.value)}
                                        disabled={createProductMutation.isPending}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="VD: Wave, Exciter"
                                    />
                                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Category Specific Fields */}
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin chi tiết</h3>
                            {getCategorySpecificFields()}
                        </div>

                        {/* Product Details */}
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Chi tiết sản phẩm</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Năm sản xuất *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={e => handleInputChange('year', parseInt(e.target.value))}
                                        disabled={createProductMutation.isPending}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Giá (VNĐ) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => handleInputChange('price', parseFloat(e.target.value))}
                                        disabled={createProductMutation.isPending}
                                        min="0"
                                        step="1000"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Số lượng *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={e => handleInputChange('quantity', parseInt(e.target.value))}
                                        disabled={createProductMutation.isPending}
                                        min="1"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Tình trạng *
                                    </label>
                                    <select
                                        value={formData.condition}
                                        onChange={e => handleInputChange('condition', e.target.value)}
                                        disabled={createProductMutation.isPending}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.condition ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="Mới">Mới</option>
                                        <option value="Như mới">Như mới</option>
                                        <option value="Đã sử dụng">Đã sử dụng</option>
                                        <option value="Cần sửa chữa">Cần sửa chữa</option>
                                    </select>
                                    {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                                </div>

                                <div className="space-y-4 mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Tỉnh / Thành phố *
                                            </label>
                                            <select
                                                value={provinceCode}
                                                onChange={e => {
                                                    setProvinceCode(e.target.value);
                                                    setDistrictCode('');
                                                    setWardCode('');
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                            >
                                                <option value="">Chọn tỉnh / thành</option>
                                                {provinces.data?.map((p: any) => (
                                                    <option key={p.code} value={p.code}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Quận / Huyện *
                                            </label>
                                            <select
                                                value={districtCode}
                                                onChange={e => {
                                                    setDistrictCode(e.target.value);
                                                    setWardCode('');
                                                }}
                                                disabled={!provinceCode}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 disabled:opacity-50"
                                            >
                                                <option value="">Chọn quận / huyện</option>
                                                {districtsQuery.data?.map((d: any) => (
                                                    <option key={d.code} value={d.code}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Phường / Xã *
                                            </label>
                                            <select
                                                value={wardCode}
                                                onChange={e => setWardCode(e.target.value)}
                                                disabled={!districtCode}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 disabled:opacity-50"
                                            >
                                                <option value="">Chọn phường / xã</option>
                                                {wardsQuery.data?.map((w: any) => (
                                                    <option key={w.code} value={w.code}>
                                                        {w.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">
                                                Số nhà / Đường *
                                            </label>
                                            <input
                                                type="text"
                                                value={streetAddress}
                                                onChange={e => setStreetAddress(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                                placeholder="Số nhà, đường ..."
                                            />
                                        </div>
                                    </div>
                                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Mô tả *</label>
                                <CourseraEditor
                                    value={formData.description}
                                    onChange={val => handleInputChange('description', val)}
                                    disabled={createProductMutation.isPending}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Hình ảnh</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Tải lên hình ảnh
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => handleImageUpload(e.target.files)}
                                    disabled={createProductMutation.isPending || uploadingImages}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                {uploadingImages && (
                                    <p className="text-sm text-amber-600 mt-1">Đang tải lên...</p>
                                )}
                            </div>

                            {formData.imageUrls && formData.imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.imageUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createProductMutation.isPending}
                                className="px-6 py-2.5 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={createProductMutation.isPending || uploadingImages}
                                className="px-6 py-2.5 bg-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition disabled:opacity-50"
                            >
                                {createProductMutation.isPending ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang tạo...
                                    </div>
                                ) : (
                                    'Tạo sản phẩm'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};
