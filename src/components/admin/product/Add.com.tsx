import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../../../services/product/product.service';
import type { CreateProduct } from '../../../types/product/Product.req.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategory } from '@hooks/modules/useCategory';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import CourseraEditor from '../../common/CourseraEditor';
import { useVietnamAddress } from '@hooks/other/useVietnamAddress';
import { MdLocationOn } from 'react-icons/md';
// XÓA: import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker as MarkerLeaflet, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { helpers } from '@utils/index';
import { BaseService } from '../../../app/api/base.service';
import { MOTORCYCLE_BRANDS, MOTORCYCLE_BRANDS_MODELS, ACCESSORY_BRANDS, ACCESSORY_MODELS, SPAREPART_BRANDS, SPAREPART_MODELS } from '../../../consts/productBrandsModels';

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

    // Thêm state cho brands/models động
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

    const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);
    const isAccessory = selectedCategory?.name?.toLowerCase().includes('phụ kiện');
    const isSparePart = selectedCategory?.name?.toLowerCase().includes('phụ tùng');

    // Cập nhật danh sách thương hiệu và model khi thay đổi danh mục
    useEffect(() => {
        if (isAccessory) {
            setBrands(ACCESSORY_BRANDS);
            setModels(ACCESSORY_MODELS);
        } else if (isSparePart) {
            setBrands(SPAREPART_BRANDS);
            setModels(SPAREPART_MODELS);
        } else {
            setBrands(MOTORCYCLE_BRANDS);
            setModels(formData.brand ? MOTORCYCLE_BRANDS_MODELS[formData.brand] || [] : []);
        }
        setFormData(prev => ({ ...prev, brand: '', model: '' }));
    }, [formData.categoryId, categories]);

    // Khi chọn brand, cập nhật models (chỉ với xe máy)
    useEffect(() => {
        if (!isAccessory && !isSparePart) {
            setModels(formData.brand ? MOTORCYCLE_BRANDS_MODELS[formData.brand] || [] : []);
            setFormData(prev => ({ ...prev, model: '' }));
        }
    }, [formData.brand, isAccessory, isSparePart]);

    /* ---------------- Địa chỉ ---------------- */
    const { provinces, getDistricts, getWards, formatAddress } = useVietnamAddress();
    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [wardCode, setWardCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const districtsQuery = getDistricts(provinceCode);
    const wardsQuery = getWards(districtCode);

    // build full address to formData.location
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

    // Lấy adminId từ localStorage (hoặc context nếu có)
    const adminId = localStorage.getItem('userId') || '';

    /* ---------------- Mutation ---------------- */
    const createProductMutation = useMutation({
        mutationFn: (formData: CreateProduct) => ProductService.createProductByAdmin(adminId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            helpers.notificationMessage('Tạo sản phẩm thành công!', 'success');
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            console.error('Error creating product:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
            helpers.notificationMessage(errorMessage, 'error');
            setErrors({
                general: errorMessage
            });
        }
    });

    /* ---------------- Validation ---------------- */
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        console.log('Validating form with data:', formData);

        // Brand/model validation động
        if (!formData.brand?.trim()) newErrors.brand = 'Thương hiệu là bắt buộc';
        else if (
            (isAccessory && !ACCESSORY_BRANDS.includes(formData.brand)) ||
            (isSparePart && !SPAREPART_BRANDS.includes(formData.brand)) ||
            (!isAccessory && !isSparePart && !MOTORCYCLE_BRANDS.includes(formData.brand))
        ) {
            newErrors.brand = 'Thương hiệu không hợp lệ';
        }
        if (!formData.model?.trim()) newErrors.model = 'Model là bắt buộc';
        else if (!models.includes(formData.model)) newErrors.model = 'Model không hợp lệ';

        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)
            newErrors.year = 'Năm sản xuất không hợp lệ';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (!formData.description?.trim()) newErrors.description = 'Mô tả là bắt buộc';
        if (!formData.location?.trim()) newErrors.location = 'Địa điểm là bắt buộc';
        if (!formData.condition?.trim()) newErrors.condition = 'Tình trạng là bắt buộc';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Số lượng phải lớn hơn 0';
        if (!formData.categoryId) newErrors.categoryId = 'Danh mục là bắt buộc';

        console.log('Validation errors:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- Helpers ---------------- */
    const handleInputChange = (field: keyof CreateProduct, value: any) => {
        console.log(`Updating field ${field} with value:`, value);

        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            console.log('New form data:', newData);
            return newData;
        });

        // Clear existing error
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        try {
            // Upload each file using BaseService.uploadFile
            const uploadPromises = Array.from(files).map(async (file) => {
                const url = await BaseService.uploadFile(file, 'image');
                if (!url) throw new Error('Upload failed');
                return url;
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            handleInputChange('imageUrls', [...(formData.imageUrls || []), ...uploadedUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            helpers.notificationMessage('Lỗi khi tải lên hình ảnh', 'error');
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

    // Khi submit
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

    const modelLabel = (isAccessory || isSparePart)
        ? 'Dòng xe tương thích *'
        : 'Model *';

    // Thêm state cho modal bản đồ và vị trí
    const [showMapModal, setShowMapModal] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapAddress, setMapAddress] = useState('');
    const [mapLoading, setMapLoading] = useState(false);

    // Thêm state tạm cho district/ward name để đồng bộ set code
    const [tempDistrictName, setTempDistrictName] = useState('');
    const [tempWardName, setTempWardName] = useState('');
    // Fix default marker icon for leaflet
    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    // Hàm lấy vị trí hiện tại
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            helpers.notificationMessage('Trình duyệt không hỗ trợ định vị vị trí.', 'error');
            return;
        }
        setMapLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setMapLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setShowMapModal(true);
                setMapLoading(false);
            },
            (err) => {
                console.error('Error getting current location:', err);
                setMapLoading(false);
            }
        );
    };

    // Reverse geocode bằng Nominatim
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            return data.display_name || '';
        } catch {
            return '';
        }
    };

    // Khi chọn vị trí mới trên bản đồ
    function LocationMarker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
        useMapEvents({
            click(e) {
                onChange(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    }

    // Khi kéo marker
    const handleMarkerDragEnd = async (e: L.LeafletEvent) => {
        const marker = e.target as L.Marker;
        const latlng = marker.getLatLng();
        setMapLocation({ lat: latlng.lat, lng: latlng.lng });
        const addr = await reverseGeocode(latlng.lat, latlng.lng);
        setMapAddress(addr);
    };

    // Khi click trên bản đồ
    const handleMapClick = async (lat: number, lng: number) => {
        setMapLocation({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        setMapAddress(addr);
    };

    // Khi xác nhận chọn vị trí trên bản đồ
    const handleConfirmMapLocation = () => {
        // Parse mapAddress để lấy các thành phần
        const parts = mapAddress.split(',').map(s => s.trim());
        let provinceName = '', districtName = '', wardName = '', street = '';
        if (parts.length >= 4) {
            provinceName = parts[parts.length - 1];
            districtName = parts[parts.length - 2];
            wardName = parts[parts.length - 3];
            street = parts.slice(0, parts.length - 3).join(', ');
        } else if (parts.length === 3) {
            provinceName = parts[parts.length - 1];
            districtName = parts[parts.length - 2];
            street = parts.slice(0, parts.length - 2).join(', ');
        } else {
            street = mapAddress;
        }

        // Tìm code cho province
        const province = (provinces.data || []).find((p: any) =>
            provinceName && p.name && provinceName.toLowerCase().includes(p.name.toLowerCase())
        );
        const provinceCode = province?.code || '';

        // Tìm code cho district
        let districtCode = '';
        let districtList = [];
        if (provinceCode) {
            districtList = (districtsQuery.data || []);
            if (!districtList.length && province.districts) districtList = province.districts;
            const district = districtList.find((d: any) =>
                districtName && d.name && districtName.toLowerCase().includes(d.name.toLowerCase())
            );
            districtCode = district?.code || '';
        }

        // Tìm code cho ward
        let wardCode = '';
        let wardList = [];
        if (districtCode) {
            wardList = (wardsQuery.data || []);
            if (!wardList.length && districtList.length) wardList = districtList.find((d: any) => d.code === districtCode)?.wards || [];
            const ward = wardList.find((w: any) =>
                wardName && w.name && wardName.toLowerCase().includes(wardName.toLowerCase())
            );
            wardCode = ward?.code || '';
        }

        setProvinceCode(provinceCode);
        setTempDistrictName(districtName);
        setTempWardName(wardName);
        setStreetAddress(street);

        // Sử dụng địa chỉ đầy đủ từ mapAddress
        setFormData((prev) => ({
            ...prev,
            location: mapAddress
        }));
        setShowMapModal(false);
    };

    // Khi mở modal map, nếu có vị trí thì reverse geocode luôn
    useEffect(() => {
        if (showMapModal && mapLocation) {
            reverseGeocode(mapLocation.lat, mapLocation.lng).then(addr => setMapAddress(addr));
        }
        // eslint-disable-next-line
    }, [showMapModal, mapLocation]);

    // 2. useEffect: khi districtsQuery.data có dữ liệu, set districtCode
    useEffect(() => {
        if (tempDistrictName && districtsQuery.data?.length) {
            const district = districtsQuery.data.find((d: any) =>
                tempDistrictName && d.name && tempDistrictName.toLowerCase().includes(d.name.toLowerCase())
            );
            if (district) {
                setDistrictCode(district.code);
                setTempDistrictName(''); // reset
            }
        }
    }, [districtsQuery.data, tempDistrictName]);

    // 3. useEffect: khi wardsQuery.data có dữ liệu, set wardCode
    useEffect(() => {
        if (tempWardName && wardsQuery.data?.length) {
            const ward = wardsQuery.data.find((w: any) =>
                tempWardName && w.name && tempWardName.toLowerCase().includes(w.name.toLowerCase())
            );
            if (ward) {
                setWardCode(ward.code);
                setTempWardName(''); // reset
            }
        }
    }, [wardsQuery.data, tempWardName]);

    // Thêm ref cho drag & drop
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);

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
                className="bg-gray-700 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="border-b bg-gradient-to-r from-amber-500 to-amber-600 border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Thêm sản phẩm mới</h2>
                    <button
                        onClick={onClose}
                        disabled={createProductMutation.isPending}
                        className="text-white hover:text-gray-600 text-3xl font-light"
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
                                    <select
                                        value={formData.brand}
                                        onChange={e => handleInputChange('brand', e.target.value)}
                                        disabled={createProductMutation.isPending || !brands.length}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        {modelLabel}
                                    </label>
                                    <select
                                        value={formData.model}
                                        onChange={e => handleInputChange('model', e.target.value)}
                                        disabled={createProductMutation.isPending || !models.length}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Chọn model</option>
                                        {models.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
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
                            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
                                <div className="flex items-center mb-4">
                                    <MdLocationOn className="text-amber-400 mr-2 text-xl" />
                                    <h3 className="text-lg font-semibold text-white">Địa chỉ đăng bán</h3>
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        disabled={mapLoading}
                                        className="ml-4 px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 text-sm"
                                    >
                                        {mapLoading ? 'Đang lấy vị trí...' : 'Chọn vị trí trên bản đồ'}
                                    </button>
                                </div>

                                {/* Field địa chỉ chính */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Địa chỉ đầy đủ *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => handleInputChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-200 bg-gray-900"
                                        placeholder="Địa chỉ sẽ được tự động điền khi chọn tỉnh/thành..."
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Địa chỉ này sẽ được tự động cập nhật khi bạn chọn tỉnh/thành hoặc sử dụng bản đồ
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Tỉnh / Thành phố *</label>
                                        <select
                                            value={provinceCode}
                                            onChange={e => {
                                                setProvinceCode(e.target.value);
                                                setDistrictCode('');
                                                setWardCode('');
                                            }}
                                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-200 bg-gray-900"
                                        >
                                            <option value="">Chọn tỉnh / thành</option>
                                            {provinces.data?.map((p: any) => (
                                                <option key={p.code} value={p.code}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Quận / Huyện *</label>
                                        <select
                                            value={districtCode}
                                            onChange={e => {
                                                setDistrictCode(e.target.value);
                                                setWardCode('');
                                            }}
                                            disabled={!provinceCode}
                                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-200 bg-gray-900 disabled:opacity-50"
                                        >
                                            <option value="">Chọn quận / huyện</option>
                                            {districtsQuery.data?.map((d: any) => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Phường / Xã *</label>
                                        <select
                                            value={wardCode}
                                            onChange={e => setWardCode(e.target.value)}
                                            disabled={!districtCode}
                                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-200 bg-gray-900 disabled:opacity-50"
                                        >
                                            <option value="">Chọn phường / xã</option>
                                            {wardsQuery.data?.map((w: any) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Số nhà / Đường *</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            onChange={e => setStreetAddress(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-200 bg-gray-900"
                                            placeholder="Số nhà, đường ..."
                                        />
                                    </div>
                                </div>
                                {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
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
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-gray-900/60 hover:bg-gray-800/80 ${isDragActive ? 'border-amber-500 bg-amber-50/10' : 'border-gray-500'}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                                    onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
                                    onDrop={e => {
                                        e.preventDefault();
                                        setIsDragActive(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                            handleImageUpload(e.dataTransfer.files);
                                        }
                                    }}
                                    style={{ minHeight: 120 }}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={e => handleImageUpload(e.target.files)}
                                        disabled={createProductMutation.isPending || uploadingImages}
                                        className="hidden"
                                    />
                                    <svg className="w-12 h-12 text-amber-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h.01M12 20a4 4 0 100-8 4 4 0 000 8z" />
                                    </svg>
                                    <p className="text-gray-300 text-base font-medium mb-1">Kéo & thả hoặc <span className="text-amber-500 underline">chọn file</span> để tải lên</p>
                                    <p className="text-gray-400 text-xs">Hỗ trợ nhiều ảnh, định dạng JPG, PNG, JPEG. Ảnh đầu tiên là ảnh đại diện.</p>
                                    {uploadingImages && (
                                        <p className="text-sm text-amber-600 mt-2">Đang tải lên...</p>
                                    )}
                                </div>
                            </div>
                            {formData.imageUrls && formData.imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {formData.imageUrls.map((url, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden shadow border border-gray-700 bg-gray-900">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 md:h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                                            />
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); removeImage(index); }}
                                                className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg shadow-lg opacity-80 group-hover:opacity-100 transition"
                                                title="Xoá ảnh"
                                            >
                                                ×
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded shadow">Ảnh đại diện</span>
                                            )}
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

            {/* Modal OpenStreetMap */}
            {showMapModal && mapLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setShowMapModal(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-2">Chọn vị trí trên bản đồ</h2>
                        <MapContainer
                            center={[mapLocation.lat, mapLocation.lng]}
                            zoom={16}
                            style={{ width: '100%', height: '350px' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MarkerLeaflet
                                position={[mapLocation.lat, mapLocation.lng]}
                                draggable={true}
                                eventHandlers={{ dragend: handleMarkerDragEnd }}
                            />
                            <LocationMarker onChange={handleMapClick} />
                        </MapContainer>
                        <div className="mt-4">
                            <div className="mb-2 text-sm text-gray-700">Địa chỉ: <span className="font-semibold">{mapAddress}</span></div>
                            <button
                                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 mr-2"
                                onClick={handleConfirmMapLocation}
                                disabled={!mapAddress}
                            >
                                Xác nhận vị trí này
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                onClick={() => setShowMapModal(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
