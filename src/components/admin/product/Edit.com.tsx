import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '../../../services/product/product.service';
import type { ProductResponse } from '../../../types/product/Product.res.type';
import type { UpdateProduct } from '../../../types/product/Product.req.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategory } from '@hooks/modules/useCategory';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import CourseraEditor from '../../common/CourseraEditor';
import { useVietnamAddress } from '@hooks/other/useVietnamAddress';
import { MdLocationOn } from 'react-icons/md';
import { MapContainer, TileLayer, Marker as MarkerLeaflet, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { helpers } from '@utils/index';
import { BaseService } from '../../../app/api/base.service';
import { MOTORCYCLE_BRANDS, MOTORCYCLE_BRANDS_MODELS, ACCESSORY_BRANDS, ACCESSORY_MODELS, SPAREPART_BRANDS, SPAREPART_MODELS, ALL_SIZE_OPTIONS } from '../../../consts/productBrandsModels';

interface EditProductAdminProps {
    product: ProductResponse;
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

export const EditProductAdminComponent: React.FC<EditProductAdminProps> = ({
    product,
    onClose,
    onSuccess
}) => {
    const queryClient = useQueryClient();

    // Debug: Log product data
    console.log('EditProductAdminComponent - Product data:', product);

    const [formData, setFormData] = useState<UpdateProduct>({
        brand: product.brand,
        model: product.model,
        year: product.year,
        price: product.price,
        description: product.description,
        location: product.location,
        condition: product.condition,
        quantity: product.quantity,
        categoryId: product.categoryId.toString(),
        imageUrls: product.imageUrls || [],
        engineCapacity: product.engineCapacity || undefined,
        fuelType: product.fuelType || '',
        mileage: product.mileage || undefined,
        color: product.color || '',
        accessoryType: product.accessoryType || '',
        size: product.size || '',
        sparePartType: product.sparePartType || '',
        vehicleCompatible: product.vehicleCompatible || ''
    });

    // Debug: Log initial formData
    console.log('EditProductAdminComponent - Initial formData:', formData);

    const [errors, setErrors] = useState<FormErrors>({});
    const [uploadingImages, setUploadingImages] = useState(false);

    // Category list for dropdown
    const { useGetCategories } = useCategory();
    const { data: categories = [] } = useGetCategories({ pageNumber: 1, pageSize: 1000 });

    // Thêm state cho brands/models động
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

    // const UNIVERSAL_MODELS = [
    //     'Tất cả', 'Xe ga', 'Xe số', 'Xe côn tay', 'Xe phân khối lớn', 'Xe điện', 'Khác'
    // ];

    /* ---------------- Địa chỉ ---------------- */
    const { provinces, getDistricts, getWards, formatAddress } = useVietnamAddress();
    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [wardCode, setWardCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const districtsQuery = getDistricts(provinceCode);
    const wardsQuery = getWards(districtCode);

    // Thêm state cho modal bản đồ và vị trí
    const [showMapModal, setShowMapModal] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapAddress, setMapAddress] = useState('');
    const [mapLoading, setMapLoading] = useState(false);

    // Thêm state tạm cho district/ward name để đồng bộ set code
    const [tempDistrictName, setTempDistrictName] = useState('');
    const [tempWardName, setTempWardName] = useState('');

    // Helper functions to determine category type
    const getCategoryType = (categoryId: string): 'motorcycle' | 'accessory' | 'sparepart' | 'other' => {
        if (!categoryId) return 'other';

        const findCategoryType = (catId: string, visited = new Set()): 'motorcycle' | 'accessory' | 'sparepart' | 'other' => {
            // Prevent infinite loops
            if (visited.has(catId)) return 'other';
            visited.add(catId);

            const category = categories.find((c: ICategory) => c.id.toString() === catId);
            if (!category) return 'other';

            const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            const categoryName = normalizeText(category.name);
            console.log('🔍 Checking category (Edit):', category.name, '→ normalized:', categoryName);

            // Exact match và includes match cho tên tiếng Việt
            if (categoryName === 'xe may' || categoryName.includes('xe may') ||
                categoryName.includes('moto') || categoryName.includes('motorcycle')) {
                console.log('✅ Detected as MOTORCYCLE for:', category.name);
                return 'motorcycle';
            }
            if (categoryName === 'phu kien' || categoryName.includes('phu kien') ||
                categoryName.includes('accessory')) {
                console.log('✅ Detected as ACCESSORY for:', category.name);
                return 'accessory';
            }
            if (categoryName === 'phu tung' || categoryName.includes('phu tung') ||
                categoryName.includes('spare part') || categoryName.includes('linh kien')) {
                console.log('✅ Detected as SPAREPART for:', category.name);
                return 'sparepart';
            }

            // If current category doesn't match, check parent category
            if (category.parentCategoryId) {
                console.log('⬆️ Checking parent category for:', category.name);
                return findCategoryType(String(category.parentCategoryId), visited);
            }

            console.log('❌ No match found for:', category.name, '→ returning OTHER');
            return 'other';
        };

        return findCategoryType(categoryId);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const isInitialMount = useRef(true);

    // Khởi tạo địa chỉ từ product.location hiện tại
    useEffect(() => {
        if (product.location && provinces.data && isInitialMount.current) {
            console.log('Initializing address from product location:', product.location);

            // Parse địa chỉ hiện tại để set các field
            const locationParts = product.location.split(', ').map(part => part.trim());
            console.log('Location parts:', locationParts);

            if (locationParts.length >= 2) {
                // Try different formats
                let street = '', ward = '', district = '', province = '';

                if (locationParts.length >= 4) {
                    // Format: "Số nhà đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành"
                    street = locationParts[0];
                    ward = locationParts[1];
                    district = locationParts[2];
                    province = locationParts[3];
                } else if (locationParts.length === 3) {
                    // Format: "Đường, Quận/Huyện, Tỉnh/Thành"
                    street = locationParts[0];
                    district = locationParts[1];
                    province = locationParts[2];
                } else if (locationParts.length === 2) {
                    // Format: "Đường, Tỉnh/Thành"
                    street = locationParts[0];
                    province = locationParts[1];
                }

                setStreetAddress(street);
                console.log('Setting street address:', street);

                // Tìm và set province code
                if (province) {
                    const foundProvince = provinces.data.find((p: any) =>
                        p.name.toLowerCase().includes(province.toLowerCase()) ||
                        province.toLowerCase().includes(p.name.toLowerCase())
                    );
                    if (foundProvince) {
                        setProvinceCode(foundProvince.code);
                        console.log('Found province:', foundProvince.name, 'code:', foundProvince.code);

                        // Set temp names to trigger district/ward finding
                        if (district) {
                            setTempDistrictName(district);
                        }
                        if (ward) {
                            setTempWardName(ward);
                        }
                    }
                }
            }
            isInitialMount.current = false;
        }
    }, [product.location, provinces.data]);

    // Khởi tạo district và ward khi có province
    useEffect(() => {
        if (provinceCode && districtsQuery.data && product.location) {
            const locationParts = product.location.split(', ');
            if (locationParts.length >= 3) {
                const district = locationParts[2];
                const foundDistrict = districtsQuery.data.find((d: any) =>
                    d.name.toLowerCase().includes(district.toLowerCase()) ||
                    district.toLowerCase().includes(d.name.toLowerCase())
                );
                if (foundDistrict) {
                    setDistrictCode(foundDistrict.code);
                    console.log('Found district:', foundDistrict.name, 'code:', foundDistrict.code);
                }
            }
        }
    }, [provinceCode, districtsQuery.data, product.location]);

    // Khởi tạo ward khi có district
    useEffect(() => {
        if (districtCode && wardsQuery.data && product.location) {
            const locationParts = product.location.split(', ');
            if (locationParts.length >= 2) {
                const ward = locationParts[1];
                const foundWard = wardsQuery.data.find((w: any) =>
                    w.name.toLowerCase().includes(ward.toLowerCase()) ||
                    ward.toLowerCase().includes(w.name.toLowerCase())
                );
                if (foundWard) {
                    setWardCode(foundWard.code);
                    console.log('Found ward:', foundWard.name, 'code:', foundWard.code);
                }
            }
        }
    }, [districtCode, wardsQuery.data, product.location]);

    useEffect(() => {
        const provinceName = (provinces.data || []).find((p: any) => String(p.code) === provinceCode)?.name || '';
        const districtName = (districtsQuery.data || []).find((d: any) => String(d.code) === districtCode)?.name || '';
        const wardName = (wardsQuery.data || []).find((w: any) => String(w.code) === wardCode)?.name || '';
        const full = streetAddress || wardName || districtName || provinceName
            ? formatAddress(streetAddress, wardName, districtName, provinceName)
            : '';
        setFormData(prev => ({ ...prev, location: full }));
    }, [streetAddress, provinceCode, districtCode, wardCode, provinces.data, districtsQuery.data, wardsQuery.data]);

    // Khởi tạo brands và models dựa trên dữ liệu product khi categories được load
    useEffect(() => {
        if (categories.length > 0 && formData.categoryId) {
            console.log('Initializing brands/models for category:', formData.categoryId);
            console.log('Product brand:', formData.brand, 'Product model:', formData.model);

            const catType = getCategoryType(formData.categoryId || '');
            console.log('Category type detected:', catType, 'for category:', formData.categoryId);

            if (catType === 'accessory') {
                const bs = new Set<string>(ACCESSORY_BRANDS);
                if (formData.brand) bs.add(formData.brand);
                setBrands(Array.from(bs));
                const ms = new Set<string>(ACCESSORY_MODELS);
                if (formData.model) ms.add(formData.model);
                setModels(Array.from(ms));
            } else if (catType === 'sparepart') {
                const bs = new Set<string>(SPAREPART_BRANDS);
                if (formData.brand) bs.add(formData.brand);
                setBrands(Array.from(bs));
                const ms = new Set<string>(SPAREPART_MODELS);
                if (formData.model) ms.add(formData.model);
                setModels(Array.from(ms));
            } else {
                const bs = new Set<string>(MOTORCYCLE_BRANDS);
                if (formData.brand) bs.add(formData.brand);
                setBrands(Array.from(bs));
                const msList = new Set<string>(formData.brand ? (MOTORCYCLE_BRANDS_MODELS[formData.brand] || []) : []);
                if (formData.model) msList.add(formData.model);
                setModels(Array.from(msList));
            }
        }
    }, [categories, formData.categoryId, formData.brand, formData.model]);

    // Cập nhật danh sách thương hiệu và model khi thay đổi danh mục
    useEffect(() => {
        if (categories.length > 0 && formData.categoryId) {
            const categoryType = getCategoryType(formData.categoryId);

            if (categoryType === 'accessory') {
                setBrands(ACCESSORY_BRANDS);
                setModels(ACCESSORY_MODELS);
            } else if (categoryType === 'sparepart') {
                setBrands(SPAREPART_BRANDS);
                setModels(SPAREPART_MODELS);
            } else {
                setBrands(MOTORCYCLE_BRANDS);
                setModels(formData.brand ? MOTORCYCLE_BRANDS_MODELS[formData.brand] || [] : []);
            }
            if (categories.length > 0 && !isInitialMount.current) {
                setFormData(prev => ({ ...prev, brand: '', model: '' }));
            }
        }
        if (categories.length > 0) {
            isInitialMount.current = false;
        }
    }, [formData.categoryId, categories, formData.brand, formData.model]);

    // Khi chọn brand, cập nhật models (chỉ với xe máy)
    useEffect(() => {
        if (categories.length > 0 && formData.categoryId) {
            const categoryType = getCategoryType(formData.categoryId);
            if (categoryType === 'motorcycle') {
                setModels(formData.brand ? MOTORCYCLE_BRANDS_MODELS[formData.brand] || [] : []);
                if (!isInitialMount.current) {
                    setFormData(prev => ({ ...prev, model: '' }));
                }
            }
        }
    }, [formData.brand, formData.categoryId, categories]);

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
        const foundProvince = (provinces.data || []).find((p: any) =>
            provinceName && p.name && provinceName.toLowerCase().includes(p.name.toLowerCase())
        );
        const foundProvinceCode = foundProvince?.code || '';

        // Tìm code cho district
        let foundDistrictCode = '';
        let districtList = [];
        if (foundProvinceCode) {
            districtList = (districtsQuery.data || []);
            if (!districtList.length && foundProvince?.districts) districtList = foundProvince.districts;
            const foundDistrict = districtList.find((d: any) =>
                districtName && d.name && districtName.toLowerCase().includes(d.name.toLowerCase())
            );
            foundDistrictCode = foundDistrict?.code || '';
        }

        // Tìm code cho ward
        let foundWardCode = '';
        let wardList = [];
        if (foundDistrictCode) {
            wardList = (wardsQuery.data || []);
            if (!wardList.length && districtList.length) {
                wardList = districtList.find((d: any) => d.code === foundDistrictCode)?.wards || [];
            }
            const foundWard = wardList.find((w: any) =>
                wardName && w.name && wardName.toLowerCase().includes(wardName.toLowerCase())
            );
            foundWardCode = foundWard?.code || '';
        }

        // Cập nhật tất cả state address
        setProvinceCode(foundProvinceCode);
        setDistrictCode(foundDistrictCode);
        setWardCode(foundWardCode);
        setStreetAddress(street);
        setTempDistrictName('');
        setTempWardName('');

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

    // Update product mutation
    const updateProductMutation = useMutation({
        mutationFn: (data: UpdateProduct) => ProductService.updateProduct(product.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            helpers.notificationMessage('Cập nhật sản phẩm thành công!', 'success');
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            console.error('Error updating product:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
            helpers.notificationMessage(errorMessage, 'error');
            setErrors({
                general: errorMessage
            });
        }
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => ProductService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            helpers.notificationMessage('Xóa sản phẩm thành công!', 'success');
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            console.error('Error deleting product:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
            helpers.notificationMessage(errorMessage, 'error');
            setErrors({
                general: errorMessage
            });
        }
    });

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        console.log('Validating form with data:', formData);

        // Brand/model validation động
        const currentCategoryType = getCategoryType(formData.categoryId || '');
        const isCurrentAccessory = currentCategoryType === 'accessory';
        const isCurrentSparePart = currentCategoryType === 'sparepart';

        if (!formData.brand?.trim()) {
            newErrors.brand = 'Thương hiệu là bắt buộc';
        } else if (
            (isCurrentAccessory && !ACCESSORY_BRANDS.includes(formData.brand)) ||
            (isCurrentSparePart && !SPAREPART_BRANDS.includes(formData.brand)) ||
            (!isCurrentAccessory && !isCurrentSparePart && !MOTORCYCLE_BRANDS.includes(formData.brand))
        ) {
            newErrors.brand = 'Thương hiệu không hợp lệ';
        }

        if (!formData.model?.trim()) {
            newErrors.model = 'Model là bắt buộc';
        } else if (!models.includes(formData.model)) {
            newErrors.model = 'Model không hợp lệ';
        }

        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Năm sản xuất không hợp lệ';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'Mô tả là bắt buộc';
        }

        if (!formData.location?.trim()) {
            newErrors.location = 'Địa điểm là bắt buộc';
        }

        if (!formData.condition?.trim()) {
            newErrors.condition = 'Tình trạng là bắt buộc';
        }

        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Danh mục là bắt buộc';
        }

        console.log('Validation errors:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UpdateProduct, value: any) => {
        console.log(`Updating field ${field} with value:`, value);

        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            console.log('New form data:', newData);
            return newData;
        });

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setErrors({});
        updateProductMutation.mutate(formData);
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            deleteProductMutation.mutate(product.id);
        }
    };

    // Get category-specific fields
    const getCategorySpecificFields = () => {
        console.log('🚀 getCategorySpecificFields (Edit) called:');
        console.log('   - categoryId:', formData.categoryId);
        console.log('   - categories loaded:', categories.length);
        console.log('   - categories list:', categories.map((c: ICategory) => ({ id: c.id, name: c.name })));

        if (!formData.categoryId) {
            console.log('❌ No categoryId selected, returning null');
            return null;
        }

        if (categories.length === 0) {
            console.log('❌ Categories not loaded yet, returning null');
            return null;
        }

        const categoryType = getCategoryType(formData.categoryId || '');
        const isMotorcycle = categoryType === 'motorcycle';
        const isAccessory = categoryType === 'accessory';
        const isSparePart = categoryType === 'sparepart';

        console.log('   - categoryType detected:', categoryType);
        console.log('   - isMotorcycle:', isMotorcycle, 'isAccessory:', isAccessory, 'isSparePart:', isSparePart);

        if (isMotorcycle) {
            console.log('🏍️ Returning MOTORCYCLE fields');
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Dung tích xi-lanh (cc) *
                                </span>
                            </label>
                            <select
                                value={formData.engineCapacity ?? ''}
                                onChange={e => handleInputChange('engineCapacity', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
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
                                <p className="text-gray-400 text-xs mt-1">
                                    <span className="inline-flex items-center">
                                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Dung tích: {formData.engineCapacity}cc
                                    </span>
                                </p>
                            )}
                            {formData.engineCapacity?.toString() === 'other' && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        placeholder="Nhập dung tích (cc)"
                                        onChange={e => handleInputChange('engineCapacity', parseInt(e.target.value) || '')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
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
                            <label className="block text-sm font-medium text-white mb-2">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Số km đã đi
                                </span>
                            </label>
                            <select
                                value={formData.mileage ?? ''}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === 'custom') {
                                        // User will input custom value
                                        handleInputChange('mileage', '');
                                    } else {
                                        handleInputChange('mileage', value ? parseInt(value) : undefined);
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                            >
                                <option value="">Chọn số km đã đi</option>
                                <optgroup label="Xe mới">
                                    <option value="0">0 km - Xe hoàn toàn mới</option>
                                    <option value="100">Dưới 100 km - Xe mới chạy thử</option>
                                    <option value="500">Dưới 500 km - Xe mới rời đại lý</option>
                                </optgroup>
                                <optgroup label="Xe ít sử dụng">
                                    <option value="1000">1,000 km - Ít sử dụng</option>
                                    <option value="2000">2,000 km</option>
                                    <option value="3000">3,000 km</option>
                                    <option value="5000">5,000 km</option>
                                </optgroup>
                                <optgroup label="Xe sử dụng bình thường">
                                    <option value="10000">10,000 km</option>
                                    <option value="15000">15,000 km</option>
                                    <option value="20000">20,000 km</option>
                                    <option value="25000">25,000 km</option>
                                    <option value="30000">30,000 km</option>
                                </optgroup>
                                <optgroup label="Xe sử dụng nhiều">
                                    <option value="40000">40,000 km</option>
                                    <option value="50000">50,000 km</option>
                                    <option value="60000">60,000 km</option>
                                    <option value="70000">70,000 km</option>
                                    <option value="80000">80,000 km</option>
                                    <option value="90000">90,000 km</option>
                                    <option value="100000">100,000 km+</option>
                                </optgroup>
                                <optgroup label="Khác">
                                    <option value="custom">Số km khác</option>
                                </optgroup>
                            </select>
                            {formData.mileage && formData.mileage.toString() !== 'custom' && (
                                <p className="text-gray-400 text-xs mt-1">
                                    <span className="inline-flex items-center">
                                        <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {(() => {
                                            const km = parseInt(formData.mileage.toString());
                                            if (km === 0) return "Xe hoàn toàn mới";
                                            if (km <= 1000) return "Xe rất ít sử dụng";
                                            if (km <= 10000) return "Xe ít sử dụng";
                                            if (km <= 30000) return "Xe sử dụng bình thường";
                                            if (km <= 60000) return "Xe sử dụng nhiều";
                                            return "Xe sử dụng rất nhiều";
                                        })()}: {parseInt(formData.mileage.toString()).toLocaleString('vi-VN')} km
                                    </span>
                                </p>
                            )}
                            {(!formData.mileage || formData.mileage.toString() === 'custom') && (
                                <div className="mt-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={typeof formData.mileage === 'number' ? formData.mileage : ''}
                                            onChange={e => handleInputChange('mileage', parseInt(e.target.value) || undefined)}
                                            placeholder="Nhập số km đã đi"
                                            className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
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
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Màu sắc
                            </label>
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
                                                        handleInputChange('color', newColors.join(', '));
                                                    } else {
                                                        // Add color
                                                        const newColors = [...currentColors, colorOption.value];
                                                        handleInputChange('color', newColors.join(', '));
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
                                        value={formData.color}
                                        onChange={e => handleInputChange('color', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                        placeholder="VD: Đỏ, đen hoặc nhập màu tùy chỉnh..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('color', '')}
                                        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                    >
                                        Xóa
                                    </button>
                                </div>
                                {formData.color && (
                                    <div className="text-xs text-gray-400">
                                        <span className="font-medium">Đã chọn:</span> {formData.color}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (isAccessory) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Loại phụ kiện *
                        </label>
                        <select
                            value={formData.accessoryType}
                            onChange={e => {
                                const selectedType = e.target.value;
                                handleInputChange('accessoryType', selectedType);
                                // Tự động set model = accessoryType
                                handleInputChange('model', selectedType);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700">
                            <option value="">Chọn loại phụ kiện</option>
                            {ACCESSORY_MODELS.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Kích thước/Size
                        </label>
                        <select
                            value={formData.size}
                            onChange={e => handleInputChange('size', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700">
                            <option value="">Chọn kích thước</option>
                            {ALL_SIZE_OPTIONS.map(sizeGroup => (
                                <optgroup key={sizeGroup.group} label={sizeGroup.group}>
                                    {sizeGroup.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            );
        }

        if (isSparePart) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Loại phụ tùng *
                        </label>
                        <select
                            value={formData.sparePartType}
                            onChange={e => {
                                const selectedType = e.target.value;
                                handleInputChange('sparePartType', selectedType);
                                // Tự động set model = sparePartType
                                handleInputChange('model', selectedType);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus-border-transparent text-gray-700">
                            <option value="">Chọn loại phụ tùng</option>
                            {SPAREPART_MODELS.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Tương thích với xe
                        </label>
                        <select
                            value={formData.vehicleCompatible}
                            onChange={e => handleInputChange('vehicleCompatible', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                            <option value="">Chọn dòng xe tương thích</option>
                            <option value="Tất cả">Tất cả các dòng xe</option>
                            {MOTORCYCLE_BRANDS.map(brand => (
                                <optgroup key={brand} label={brand}>
                                    <option value={brand}>{brand} - Tất cả model</option>
                                    {MOTORCYCLE_BRANDS_MODELS[brand]?.map(model => (
                                        <option key={`${brand}-${model}`} value={`${brand} ${model}`}>
                                            {brand} {model}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            );
        }

        return null;
    };

    // const getCategoryName = (categoryId: string) => {
    //     const cat = categories.find((c) => c.id.toString() === categoryId);
    //     return cat ? cat.name : 'Không xác định';
    // };

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
                transition={{ type: "spring", damping: 20 }}

                className="bg-gray-700 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE 10+
                }}
            >
                <style>
                    {`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div className="border-b bg-gradient-to-r from-amber-500 to-amber-600 border-gray-700 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-white">Chỉnh sửa sản phẩm</h2>
                        {isInitialMount.current && (
                            <div className="flex items-center text-white text-sm">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang tải dữ liệu...
                            </div>
                        )}
                        {/* <div className="flex items-center space-x-2">
                            {getStatusDisplay(product.status)}
                            <span className="text-sm text-gray-500">ID: {product.id}</span>
                        </div> */}
                    </div>
                    <button
                        onClick={onClose}
                        disabled={updateProductMutation.isPending || deleteProductMutation.isPending}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Danh mục *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.categoryId}
                                            onChange={e => handleInputChange('categoryId', e.target.value)}
                                            disabled={updateProductMutation.isPending}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 max-h-48 overflow-y-auto ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                                            size={1}
                                            style={{ overflowY: 'auto' }}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat: ICategory) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {/* Custom scrollbar for select dropdown */}
                                        <style>
                                            {`
                                                select.max-h-48 {
                                                    scrollbar-width: thin;
                                                    scrollbar-color: #f59e42 #f3f4f6;
                                                }
                                                select.max-h-48::-webkit-scrollbar {
                                                    width: 6px;
                                                    background: #f3f4f6;
                                                }
                                                select.max-h-48::-webkit-scrollbar-thumb {
                                                    background: #f59e42;
                                                    border-radius: 4px;
                                                }
                                                select.max-h-48::-webkit-scrollbar-thumb:hover {
                                                    background: #d97706;
                                                }
                                            `}
                                        </style>
                                    </div>
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
                                        onChange={(e) => handleInputChange('brand', e.target.value)}
                                        disabled={updateProductMutation.isPending || !brands.length}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    {errors.brand && (
                                        <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                                    )}
                                </div>

                                {/* Chỉ hiển thị Model field cho xe máy */}
                                {getCategoryType(formData.categoryId || '') === 'motorcycle' && (
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Mẫu xe *
                                        </label>
                                        <select
                                            value={formData.model}
                                            onChange={(e) => handleInputChange('model', e.target.value)}
                                            disabled={updateProductMutation.isPending || !models.length}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Chọn mẫu xe</option>
                                            {models.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        {errors.model && (
                                            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                                        )}
                                    </div>
                                )}

                                {/* Hiển thị placeholder cho phụ kiện/phụ tùng */}
                                {/* {(getCategoryType(formData.categoryId) === 'accessory' || getCategoryType(formData.categoryId) === 'sparepart') && (
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            {getCategoryType(formData.categoryId) === 'accessory' ? 'Dòng xe tương thích' : 'Dòng xe tương thích'}
                                        </label>
                                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm">
                                            {getCategoryType(formData.categoryId) === 'accessory'
                                                ? 'Model sẽ tự động được đặt theo loại phụ kiện'
                                                : 'Model sẽ tự động được đặt theo loại phụ tùng'
                                            }
                                        </div>
                                    </div>
                                )} */}
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
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Năm sản xuất *
                                        </span>
                                    </label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                        disabled={updateProductMutation.isPending}
                                        className={`w-full px-3 text-gray-700 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Chọn năm sản xuất</option>
                                        {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {errors.year && (
                                        <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
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
                                            onChange={(e) => {
                                                // Remove all non-numeric characters and convert back to number
                                                const numericValue = e.target.value.replace(/[^\d]/g, '');
                                                handleInputChange('price', numericValue ? parseInt(numericValue) : 0);
                                            }}
                                            disabled={updateProductMutation.isPending}
                                            className={`w-full pl-8 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="VD: 50,000,000"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-gray-500 text-sm">₫</span>
                                        </div>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-gray-400 text-xs">VNĐ</span>
                                        </div>
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                    )}
                                    {formData.price && formData.price > 0 && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Giá: {formData.price.toLocaleString('vi-VN')} đồng
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                            Số lượng *
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="flex">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newQty = Math.max(1, (formData.quantity || 1) - 1);
                                                    handleInputChange('quantity', newQty);
                                                }}
                                                disabled={updateProductMutation.isPending || (formData.quantity || 1) <= 1}
                                                className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                                disabled={updateProductMutation.isPending}
                                                min="1"
                                                max="9999"
                                                className={`w-full px-3 text-gray-700 py-2 border-t border-b text-center focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newQty = Math.min(9999, (formData.quantity || 1) + 1);
                                                    handleInputChange('quantity', newQty);
                                                }}
                                                disabled={updateProductMutation.isPending || (formData.quantity || 1) >= 9999}
                                                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {errors.quantity && (
                                        <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                                    )}
                                    <p className="text-gray-400 text-xs mt-1">
                                        {(formData.quantity || 1) === 1 ? 'Sản phẩm duy nhất' : `${formData.quantity || 1} sản phẩm`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Tình trạng *
                                    </label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => handleInputChange('condition', e.target.value)}
                                        disabled={updateProductMutation.isPending}
                                        className={`w-full px-3 text-gray-700 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.condition ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="Mới">Mới</option>
                                        <option value="Như mới">Như mới</option>
                                        <option value="Đã sử dụng">Đã sử dụng</option>
                                        <option value="Cần sửa chữa">Cần sửa chữa</option>
                                    </select>
                                    {errors.condition && (
                                        <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                                    )}
                                </div>
                            </div>

                            {/* Địa chỉ đăng bán - chỉ giữ lại 1 block này */}
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
                                    value={formData.description || ''}
                                    onChange={val => handleInputChange('description', val)}
                                    disabled={updateProductMutation.isPending}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Product Timestamps */}
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin thời gian</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Tạo:</span>
                                    <span className="ml-2 text-gray-600">
                                        {new Date(product.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                                {product.createdAt !== product.createdAt && (
                                    <div>
                                        <span className="font-medium text-gray-700">Cập nhật:</span>
                                        <span className="ml-2 text-gray-600">
                                            {new Date(product.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
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
                                        disabled={updateProductMutation.isPending || uploadingImages}
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
                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={updateProductMutation.isPending || deleteProductMutation.isPending}
                                className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition disabled:opacity-50"
                            >
                                {deleteProductMutation.isPending ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xóa...
                                    </div>
                                ) : (
                                    'Xóa sản phẩm'
                                )}
                            </button>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={updateProductMutation.isPending || deleteProductMutation.isPending}
                                    className="px-6 py-2.5 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateProductMutation.isPending || deleteProductMutation.isPending || uploadingImages}
                                    className="px-6 py-2.5 bg-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition disabled:opacity-50"
                                >
                                    {updateProductMutation.isPending ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Đang cập nhật...
                                        </div>
                                    ) : (
                                        'Cập nhật sản phẩm'
                                    )}
                                </button>
                            </div>
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