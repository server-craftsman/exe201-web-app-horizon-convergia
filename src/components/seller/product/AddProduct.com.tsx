import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useProduct, useCategory, useVietnamAddress } from '../../../hooks';
import { ROUTER_URL } from '@consts/router.path.const';
import type { CreateProduct } from '../../../types/product/Product.req.type';
import CourseraEditor from '../../common/CourseraEditor';
import { BaseService } from '../../../app/api/base.service';

// Thêm type cho prop onSuccess
interface AddProductProps {
    onSuccess?: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onSuccess }) => {
    const {
        createProductBySeller,
        isCreatingProduct,
        isUploadingFile,
        // createProductError
    } = useProduct();
    const { getCategorys } = useCategory();
    const { provinces, getDistricts, getWards } = useVietnamAddress();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<any[]>([]);
    // Sửa lại uploadedImages: chỉ lưu mảng string url (sau khi upload xong), mảng preview riêng cho preview tạm
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imagePreviews, setImagePreviews] = useState<{ preview: string; uploading: boolean }[]>([]);
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
        imageUrls: [],
        videoUrl: '',
        engineCapacity: undefined,
        fuelType: '',
        mileage: undefined,
        color: '',
        accessoryType: '',
        size: '',
        sparePartType: '',
        vehicleCompatible: '',
    });

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    // Thêm state lưu tên tỉnh/huyện/xã đã chọn
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

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
                const result = await getCategorys.mutateAsync({
                    pageNumber: 1,
                    pageSize: 1000
                });
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

    // Lấy districts/wards từ hook, KHÔNG gọi trong render/effect
    const districtsQuery = getDistricts(selectedProvince);
    const wardsQuery = getWards(selectedDistrict);
    const districts = districtsQuery.data || [];
    const wards = wardsQuery.data || [];

    // Địa chỉ động: cập nhật location khi đủ thông tin
    useEffect(() => {
        if (
            selectedProvince && selectedDistrict && selectedWard && streetAddress &&
            selectedProvinceName && selectedDistrictName && selectedWardName
        ) {
            setFormData(prev => ({
                ...prev,
                location: `${streetAddress}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`
            }));
        }
    }, [selectedProvince, selectedDistrict, selectedWard, streetAddress, selectedProvinceName, selectedDistrictName, selectedWardName]);

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

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file);
                setImagePreviews(prev => [...prev, { preview, uploading: true }]);
                try {
                    // Upload file dùng BaseService.uploadFile (trả về url string)
                    const url = await BaseService.uploadFile(file, 'image');
                    if (url) {
                        setUploadedImages(prev => [...prev, url]);
                        setImagePreviews(prev => {
                            // Đánh dấu đã upload xong
                            const idx = prev.findIndex(p => p.preview === preview && p.uploading);
                            if (idx !== -1) {
                                const updated = [...prev];
                                updated[idx] = { preview, uploading: false };
                                return updated;
                            }
                            return prev;
                        });
                    } else {
                        // Upload lỗi, xóa preview
                        setImagePreviews(prev => prev.filter(p => p.preview !== preview));
                    }
                } catch (error) {
                    setImagePreviews(prev => prev.filter(p => p.preview !== preview));
                }
            }
        }
    };

    // Khi uploadedImages thay đổi, cập nhật formData.imageUrls
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            imageUrls: uploadedImages
        }));
    }, [uploadedImages]);

    // Xóa ảnh: xóa cả url và preview
    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const img = prev[index];
            if (img && img.preview) URL.revokeObjectURL(img.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // imageUrls đã luôn là mảng string url
        const submitData = { ...formData, imageUrls: uploadedImages };

        try {
            await createProductBySeller(submitData);
            // Gọi callback nếu có
            if (onSuccess) onSuccess();
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
            [name]: name === 'price' || name === 'year' || name === 'quantity' || name === 'engineCapacity' || name === 'mileage'
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

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {cat.imageUrl && (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                )}
                <span>{cat.name}</span>
            </div>
        ),
        cat, // giữ lại object gốc nếu cần
    }));

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

                    {/* Location - Địa chỉ động */}
                    <div>
                        <label className="block text-white mb-2">Địa chỉ *</label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                                type="text"
                                name="streetAddress"
                                value={streetAddress}
                                onChange={e => setStreetAddress(e.target.value)}
                                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                                placeholder="Số nhà, tên đường..."
                            />
                            <select
                                name="province"
                                value={selectedProvince}
                                onChange={e => {
                                    setSelectedProvince(e.target.value);
                                    setSelectedDistrict('');
                                    setSelectedWard('');
                                    setSelectedProvinceName(e.target.options[e.target.selectedIndex].text);
                                }}
                                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            >
                                <option value="">Tỉnh/Thành phố</option>
                                {provinces.data?.map((p: any) => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                            <select
                                name="district"
                                value={selectedDistrict}
                                onChange={e => {
                                    setSelectedDistrict(e.target.value);
                                    setSelectedWard('');
                                    setSelectedDistrictName(e.target.options[e.target.selectedIndex].text);
                                }}
                                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                                disabled={!selectedProvince}
                            >
                                <option value="">Quận/Huyện</option>
                                {districts.map((d: any) => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>
                            <select
                                name="ward"
                                value={selectedWard}
                                onChange={e => {
                                    setSelectedWard(e.target.value);
                                    setSelectedWardName(e.target.options[e.target.selectedIndex].text);
                                }}
                                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                                disabled={!selectedDistrict}
                            >
                                <option value="">Phường/Xã</option>
                                {wards.map((w: any) => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                        {formData.location && (
                            <div className="mt-2 text-xs text-gray-300">Địa chỉ đầy đủ: <span className="text-amber-300">{formData.location}</span></div>
                        )}
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

                    {/* Category - Hiển thị cả ảnh */}
                    <div>
                        <label className="block text-white mb-2">Danh mục *</label>
                        <Select
                            options={categoryOptions}
                            value={categoryOptions.find(opt => opt.value === formData.categoryId) || null}
                            onChange={option => setFormData(prev => ({ ...prev, categoryId: option?.value || '' }))}
                            placeholder="Chọn danh mục"
                            isClearable
                            styles={{
                                option: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                                singleValue: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                            }}
                        />
                        {/* Hiển thị ảnh khi chọn */}
                        {formData.categoryId && (() => {
                            const cat = categories.find(c => c.id === formData.categoryId);
                            return cat && cat.imageUrl ? (
                                <div className="mt-2 flex items-center gap-2">
                                    <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 object-cover rounded" />
                                    <span className="text-white text-sm">{cat.name}</span>
                                </div>
                            ) : null;
                        })()}
                        {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
                    </div>
                </div>

                {/* Description - CourseraEditor */}
                <div>
                    <label className="block text-white mb-2">Mô tả *</label>
                    <CourseraEditor
                        value={formData.description}
                        onChange={val => setFormData(prev => ({ ...prev, description: val }))}
                        placeholder="Mô tả chi tiết về sản phẩm..."
                        className="bg-gray-800"
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>
                {/* Engine Capacity */}
                <div>
                    <label className="block text-white mb-2">Dung tích động cơ (cc)</label>
                    <input
                        type="number"
                        name="engineCapacity"
                        value={formData.engineCapacity || ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="110, 125, 150..."
                    />
                </div>

                {/* Fuel Type */}
                <div>
                    <label className="block text-white mb-2">Loại nhiên liệu</label>
                    <select
                        name="fuelType"
                        value={formData.fuelType || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                    >
                        <option value="">Chọn loại nhiên liệu</option>
                        <option value="Xăng">Xăng</option>
                        <option value="Điện">Điện</option>
                        <option value="Dầu">Dầu</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                {/* Mileage */}
                <div>
                    <label className="block text-white mb-2">Số km đã đi</label>
                    <input
                        type="number"
                        name="mileage"
                        value={formData.mileage || ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="10000, 20000..."
                    />
                </div>

                {/* Color */}
                <div>
                    <label className="block text-white mb-2">Màu sắc</label>
                    <input
                        type="text"
                        name="color"
                        value={formData.color || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="Đỏ, Đen, Trắng..."
                    />
                </div>

                {/* Accessory Type */}
                <div>
                    <label className="block text-white mb-2">Loại phụ kiện (nếu là phụ kiện)</label>
                    <input
                        type="text"
                        name="accessoryType"
                        value={formData.accessoryType || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="Gương, Đèn, ..."
                    />
                </div>

                {/* Size */}
                <div>
                    <label className="block text-white mb-2">Kích thước (nếu là phụ tùng/phụ kiện)</label>
                    <input
                        type="text"
                        name="size"
                        value={formData.size || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="M, L, XL, 17 inch..."
                    />
                </div>

                {/* Spare Part Type */}
                <div>
                    <label className="block text-white mb-2">Loại phụ tùng (nếu là phụ tùng)</label>
                    <input
                        type="text"
                        name="sparePartType"
                        value={formData.sparePartType || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="Lọc gió, Lốp, ..."
                    />
                </div>

                {/* Vehicle Compatible */}
                <div>
                    <label className="block text-white mb-2">Phù hợp với xe (nếu là phụ tùng/phụ kiện)</label>
                    <input
                        type="text"
                        name="vehicleCompatible"
                        value={formData.vehicleCompatible || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                        placeholder="Wave, Sirius, ..."
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-white mb-2">Hình ảnh sản phẩm</label>
                    <div className="mb-2">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="product-image-upload"
                            disabled={isUploadingFile}
                        />
                        <label htmlFor="product-image-upload" className="block w-full cursor-pointer">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500 rounded-lg p-6 bg-gray-900/40 hover:bg-gray-900/60 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z" />
                                </svg>
                                <span className="text-amber-300 font-medium">Kéo thả hoặc bấm để chọn nhiều ảnh</span>
                                <span className="text-xs text-gray-400 mt-1">Hỗ trợ định dạng JPG, PNG, JPEG. Tối đa 10 ảnh.</span>
                            </div>
                        </label>
                    </div>
                    {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}

                    {/* Image Preview */}
                    {imagePreviews.length > 0 && (
                        <div className="mt-4">
                            <p className="text-white text-sm mb-2">Hình ảnh đã tải lên:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviews.map((img, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
                                        <img
                                            src={img.uploading ? img.preview : uploadedImages[index]}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <span className="absolute top-1 left-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg opacity-80 hover:opacity-100 transition-opacity z-10 shadow-lg"
                                            title="Xóa ảnh"
                                        >
                                            ×
                                        </button>
                                        {img.uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
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