import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useProduct, useCategory, useVietnamAddress } from '../../../hooks';
import { ROUTER_URL } from '@consts/router.path.const';
import type { CreateProduct } from '../../../types/product/Product.req.type';
import CourseraEditor from '../../common/CourseraEditor';
import { BaseService } from '../../../app/api/base.service';
import { MOTORCYCLE_BRANDS_MODELS, MOTORCYCLE_BRANDS } from '@consts/productBrandsModels';

// Function to convert number to Vietnamese words
const numberToVietnamese = (num: number): string => {
    if (num === 0) return 'không đồng';
    
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const scales = ['', 'nghìn', 'triệu', 'tỷ'];
    
    const convertThreeDigits = (n: number): string => {
        if (n === 0) return '';
        
        let result = '';
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        const tensDigit = Math.floor(remainder / 10);
        const unitsDigit = remainder % 10;
        
        if (hundreds > 0) {
            result += units[hundreds] + ' trăm ';
        }
        
        if (tensDigit === 1) {
            result += 'mười ';
            if (unitsDigit > 0) {
                result += units[unitsDigit] + ' ';
            }
        } else if (tensDigit > 1) {
            result += units[tensDigit] + ' mười ';
            if (unitsDigit > 0) {
                result += units[unitsDigit] + ' ';
            }
        } else if (unitsDigit > 0) {
            if (hundreds > 0) result += 'lẻ ';
            result += units[unitsDigit] + ' ';
        }
        
        return result.trim();
    };
    
    const groups = [];
    let tempNum = num;
    
    while (tempNum > 0) {
        groups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }
    
    let result = '';
    for (let i = groups.length - 1; i >= 0; i--) {
        if (groups[i] > 0) {
            result += convertThreeDigits(groups[i]);
            if (i > 0) {
                result += ' ' + scales[i] + ' ';
            }
        }
    }
    
    return result.trim() + ' đồng';
};

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

    // Thêm state cho brands/models động
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

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

    // Cập nhật danh sách thương hiệu khi thay đổi danh mục (chỉ xe máy)
    useEffect(() => {
        if (categories.length > 0 && formData.categoryId) {
            // Vì seller chỉ bán xe máy, luôn set brands cho xe máy
            setBrands(MOTORCYCLE_BRANDS);
            // Reset brand và model khi thay đổi category
            setFormData(prev => ({ ...prev, brand: '', model: '' }));
            setModels([]);
        }
    }, [formData.categoryId, categories]);

    // Khi chọn brand, cập nhật models
    useEffect(() => {
        if (formData.brand && MOTORCYCLE_BRANDS_MODELS[formData.brand]) {
            setModels(MOTORCYCLE_BRANDS_MODELS[formData.brand]);
            // Reset model khi thay đổi brand
            setFormData(prev => ({ ...prev, model: '' }));
        } else {
            setModels([]);
        }
    }, [formData.brand]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.brand.trim()) {
            newErrors.brand = 'Thương hiệu không được để trống';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Dòng xe không được để trống';
        }

        if (!formData.year || formData.year < 1980 || formData.year > new Date().getFullYear()) {
            newErrors.year = 'Năm sản xuất không hợp lệ (1980 - ' + new Date().getFullYear() + ')';
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

        // Prepare submit data with proper type conversion and cleanup
        const { videoUrl, ...cleanFormData } = formData;
        const submitData = { 
            ...cleanFormData, 
            imageUrls: uploadedImages,
            year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
            // Ensure numeric fields are proper numbers or 0
            engineCapacity: formData.engineCapacity || 0,
            mileage: formData.mileage || 0,
            // Ensure string fields are proper strings or empty
            fuelType: formData.fuelType || "",
            color: formData.color || "",
            accessoryType: formData.accessoryType || "",
            size: formData.size || "",
            sparePartType: formData.sparePartType || "",
            vehicleCompatible: formData.vehicleCompatible || ""
        };

        console.log('Submitting product data:', submitData);

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

        // Skip price handling here as it has custom logic in the component
        if (name === 'price') return;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' 
                ? (value === '' ? new Date().getFullYear() : parseInt(value) || new Date().getFullYear())
                : name === 'quantity' || name === 'engineCapacity' || name === 'mileage'
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

    // Lọc chỉ danh mục xe máy (seller chỉ được bán xe máy)
    const motorcycleCategories = categories.filter(cat => {
        // Kiểm tra tên danh mục có chứa từ "xe máy", "mô tô", "motor" (không phân biệt hoa thường)
        const normalizedName = cat.name.toLowerCase();
        return normalizedName.includes('xe máy') || 
               normalizedName.includes('mô tô') || 
               normalizedName.includes('motor') ||
               normalizedName.includes('xe moto') ||
               normalizedName.includes('xe mo to');
    });

    const categoryOptions = motorcycleCategories.map(cat => ({
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

    // Tự động chọn danh mục xe máy đầu tiên khi load categories
    useEffect(() => {
        if (motorcycleCategories.length > 0 && !formData.categoryId) {
            setFormData(prev => ({
                ...prev,
                categoryId: motorcycleCategories[0].id
            }));
        }
    }, [categories]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Thêm Sản Phẩm Mới</h2>
            
            {/* Note for sellers */}
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-blue-400">ℹ️</div>
                    <p className="text-blue-300 text-sm">
                        <strong>Lưu ý:</strong> Người bán chỉ có thể tạo sản phẩm xe máy. Danh mục đã được tự động chọn cho bạn.
                    </p>
                </div>
            </div>

            {/* Display general errors */}
            {(errors.sellerId || errors.categories || errors.submit) && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    {errors.sellerId && <p className="text-red-400 mb-2">{errors.sellerId}</p>}
                    {errors.categories && <p className="text-red-400 mb-2">{errors.categories}</p>}
                    {errors.submit && <p className="text-red-400">{errors.submit}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Thông tin cơ bản */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                        <span>📝</span> Thông tin cơ bản
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category - Chỉ xe máy */}
                        <div>
                            <label className="block text-white mb-2">Danh mục xe máy *</label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(opt => opt.value === formData.categoryId) || null}
                                onChange={option => setFormData(prev => ({ ...prev, categoryId: option?.value || '' }))}
                                placeholder="Chọn loại xe máy"
                                isClearable={false}
                                isDisabled={categoryOptions.length === 1}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937',
                                        borderColor: '#374151',
                                        '&:hover': { borderColor: '#10b981' }
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151'
                                    })
                                }}
                            />
                            <p className="text-gray-400 text-xs mt-1">
                                Chỉ hiển thị danh mục xe máy cho người bán
                            </p>
                            {/* Hiển thị ảnh khi chọn */}
                            {formData.categoryId && (() => {
                                const cat = motorcycleCategories.find(c => c.id === formData.categoryId);
                                return cat && cat.imageUrl ? (
                                    <div className="mt-2 flex items-center gap-2">
                                        <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 object-cover rounded" />
                                        <span className="text-white text-sm">{cat.name}</span>
                                    </div>
                                ) : null;
                            })()}
                            {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-white mb-2">Thương hiệu *</label>
                            {brands.length > 0 ? (
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.brand ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                        } focus:outline-none`}
                                    required
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            ) : (
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
                            )}
                            {errors.brand && <p className="text-red-400 text-sm mt-1">{errors.brand}</p>}
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-white mb-2">Mẫu xe *</label>
                            {models.length > 0 ? (
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.model ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                        } focus:outline-none`}
                                    required
                                    disabled={!formData.brand}
                                >
                                    <option value="">Chọn mẫu xe</option>
                                    {models.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.model ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                        } focus:outline-none`}
                                    placeholder="Wave Alpha, Exciter 155..."
                                    required
                                    disabled={!formData.brand}
                                />
                            )}
                            {errors.model && <p className="text-red-400 text-sm mt-1">{errors.model}</p>}
                        </div>
                    </div>
                </div>

                {/* Thông số sản phẩm */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                        <span>⚙️</span> Thông số sản phẩm
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Engine Capacity */}
                        <div>
                            <label className="block text-white mb-2">Dung tích xi-lanh (cc)</label>
                            <select
                                name="engineCapacity"
                                value={formData.engineCapacity || ''}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                            >
                                <option value="">Chọn dung tích xi-lanh</option>
                                <optgroup label="Xe số & Tay ga">
                                    <option value="50">50cc - Xe máy điện/50cc</option>
                                    <option value="110">110cc - Wave Alpha, Future Neo</option>
                                    <option value="125">125cc - Wave RSX, Janus, Grande</option>
                                </optgroup>
                                <optgroup label="Xe ga & Scooter">
                                    <option value="110">110cc - Vision, Vario, Lead</option>
                                    <option value="125">125cc - SH Mode, PCX 125</option>
                                    <option value="150">150cc - SH 150i, PCX 150</option>
                                    <option value="160">160cc - FreeGo, Latte</option>
                                </optgroup>
                                <optgroup label="Xe thể thao">
                                    <option value="150">150cc - Exciter 150, Winner X</option>
                                    <option value="155">155cc - NVX 155, Exciter 155 VVA</option>
                                    <option value="175">175cc - CBR150R, GSX-R150</option>
                                </optgroup>
                                <optgroup label="Xe phân khối lớn">
                                    <option value="250">250cc - CBR250RR, Ninja 250</option>
                                    <option value="300">300cc - Ninja 300, Duke 390</option>
                                    <option value="350">350cc - SH 350i, Forza 350</option>
                                    <option value="400">400cc - CB400, Ninja 400</option>
                                    <option value="500">500cc - CB500F, Rebel 500</option>
                                    <option value="600">600cc - CBR600RR, GSX-R600</option>
                                    <option value="650">650cc - Ninja 650, MT-07</option>
                                    <option value="750">750cc - Forza 750, GSX-S750</option>
                                    <option value="1000">1000cc - CBR1000RR, GSX-R1000</option>
                                </optgroup>
                                <optgroup label="Khác">
                                    <option value="other">Dung tích khác</option>
                                </optgroup>
                            </select>
                            {formData.engineCapacity && formData.engineCapacity.toString() !== 'other' && (
                                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Dung tích: {formData.engineCapacity}cc
                                </p>
                            )}
                            {formData.engineCapacity?.toString() === 'other' && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        placeholder="Nhập dung tích (cc)"
                                        onChange={e => setFormData(prev => ({ ...prev, engineCapacity: parseInt(e.target.value) || undefined }))}
                                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                                    />
                                </div>
                            )}
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
                                <option value="Hybrid">Hybrid</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        {/* Mileage */}
                        <div>
                            <label className="block text-white mb-2">Số km đã đi</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage || ''}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Nhập số km đã đi"
                                    className="w-full pl-10 pr-12 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-gray-400 text-xs">km</span>
                                </div>
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-white mb-2">Màu sắc</label>
                            <div className="space-y-3">
                                {/* Color Picker Grid */}
                                <div className="grid grid-cols-6 gap-2">
                                    {[
                                        { name: 'Đen', value: 'Đen', color: '#000000' },
                                        { name: 'Trắng', value: 'Trắng', color: '#FFFFFF' },
                                        { name: 'Vàng', value: 'Vàng', color: '#FFD700' },
                                        { name: 'Hồng', value: 'Hồng', color: '#FF69B4' },
                                        { name: 'Xanh dương', value: 'Xanh dương', color: '#1E90FF' },
                                        { name: 'Xanh lá', value: 'Xanh lá', color: '#32CD32' },
                                        { name: 'Cam', value: 'Cam', color: '#FF6347' },
                                        { name: 'Đỏ', value: 'Đỏ', color: '#DC143C' },
                                        { name: 'Xám', value: 'Xám', color: '#808080' },
                                        { name: 'Nâu', value: 'Nâu', color: '#8B4513' },
                                        { name: 'Bạc', value: 'Bạc', color: '#C0C0C0' },
                                        { name: 'Xanh', value: 'Xanh', color: '#008B8B' }
                                    ].map((colorOption) => {
                                        const selectedColors = formData.color ? formData.color.split(', ').map(c => c.trim()) : [];
                                        const isSelected = selectedColors.includes(colorOption.value);

                                        return (
                                            <button
                                                key={colorOption.value}
                                                type="button"
                                                onClick={() => {
                                                    const currentColors = formData.color ? formData.color.split(', ').map(c => c.trim()).filter(c => c) : [];

                                                    if (isSelected) {
                                                        // Remove color
                                                        const newColors = currentColors.filter(c => c !== colorOption.value);
                                                        setFormData(prev => ({ ...prev, color: newColors.join(', ') }));
                                                    } else {
                                                        // Add color
                                                        const newColors = [...currentColors, colorOption.value];
                                                        setFormData(prev => ({ ...prev, color: newColors.join(', ') }));
                                                    }
                                                }}
                                                className={`w-8 h-8 rounded-full border-2 transition-all relative ${isSelected
                                                    ? 'border-amber-500 scale-110 shadow-lg'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                style={{ backgroundColor: colorOption.color }}
                                                title={colorOption.name}
                                            >
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Custom Color Input */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={formData.color || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        placeholder="Hoặc nhập màu tùy chỉnh"
                                        className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none text-sm"
                                    />
                                </div>
                                {formData.color && (
                                    <p className="text-gray-400 text-xs mt-1">
                                        Màu đã chọn: <span className="text-amber-300">{formData.color}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chi tiết sản phẩm */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                        <span>📋</span> Chi tiết sản phẩm
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Year */}
                        <div>
                            <label className="block text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Năm sản xuất *
                                </span>
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year || ''}
                                onChange={e => {
                                    // Clear error for year field
                                    if (errors.year) {
                                        setErrors(prev => {
                                            const { year: removed, ...rest } = prev;
                                            return rest;
                                        });
                                    }
                                    
                                    const value = e.target.value;
                                    // Allow empty or valid numbers
                                    if (value === '' || !isNaN(Number(value))) {
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            year: value === '' ? '' as any : parseInt(value) || ''
                                        }));
                                    }
                                }}
                                min="1980"
                                max={new Date().getFullYear()}
                                className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${errors.year ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                    } focus:outline-none`}
                                placeholder={`VD: ${new Date().getFullYear()}`}
                                required
                            />
                            {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tình trạng *
                                </span>
                            </label>
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

                        {/* Price - Admin style with formatting */}
                        <div>
                            <label className="block text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Giá (VNĐ) *
                                </span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.price ? formData.price.toLocaleString('vi-VN') : ''}
                                    onChange={e => {
                                        // Clear error for price field
                                        if (errors.price) {
                                            setErrors(prev => {
                                                const { price: removed, ...rest } = prev;
                                                return rest;
                                            });
                                        }
                                        
                                        // Remove all non-numeric characters and convert back to number
                                        const numericValue = e.target.value.replace(/[^\d]/g, '');
                                        setFormData(prev => ({
                                            ...prev,
                                            price: numericValue ? parseInt(numericValue) : 0
                                        }));
                                    }}
                                    className={`w-full pl-8 pr-12 p-3 rounded-lg bg-gray-800 text-white border ${errors.price ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                                        } focus:outline-none`}
                                    placeholder="VD: 50,000,000"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-gray-400 text-sm">₫</span>
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-gray-400 text-xs">VNĐ</span>
                                </div>
                            </div>
                            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                            {formData.price && formData.price > 0 && (
                                <p className="text-gray-400 text-xs mt-1">
                                    <span className="text-amber-300 font-medium">
                                        {numberToVietnamese(formData.price)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Số lượng *
                                </span>
                            </label>
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
                    </div>

                    {/* Location - Địa chỉ động */}
                    <div className="mt-6">
                        <label className="block text-white mb-2">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Địa chỉ *
                            </span>
                        </label>
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

                    {/* Description - Full width */}
                    <div className="mt-6">
                        <label className="block text-white mb-2">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Mô tả *
                            </span>
                        </label>
                        <CourseraEditor
                            value={formData.description}
                            onChange={val => setFormData(prev => ({ ...prev, description: val }))}
                            placeholder="Mô tả chi tiết về sản phẩm..."
                            className="bg-gray-800"
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                    </div>
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