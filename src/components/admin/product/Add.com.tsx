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

    // Hardcode brands/models
    const BRANDS = ['Honda', 'Yamaha', 'Suzuki', 'SYM', 'Piaggio', 'Kymco', 'Peugeot', 'VinFast', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Harley-Davidson', 'Triumph', 'Aprilia', 'Moto Guzzi', 'Indian', 'Can-Am', 'Benelli', 'CFMoto', 'Zongshen', 'Lifan', 'TVS', 'Bajaj', 'Hero', 'Royal Enfield', 'Husqvarna', 'GasGas', 'Beta', 'Sherco', 'TM Racing', 'Khác'];
    const MODELS = {
        'Honda': ['Wave Alpha', 'Wave RSX', 'Future', 'Vision', 'Lead', 'SH Mode', 'SH 125i', 'SH 150i', 'SH 350i', 'Air Blade', 'Vario', 'PCX', 'Winner X', 'CB150R', 'CBR150R', 'CBR250RR', 'CBR650R', 'CB1000R', 'Africa Twin', 'Gold Wing', 'CRF250L', 'CRF450L', 'Rebel 300', 'Rebel 500', 'Shadow 750', 'CBR1000RR', 'CBR600RR', 'CB650R', 'CB500F', 'CBR500R', 'CRF1100L', 'NC750X', 'Forza 300', 'Forza 750', 'X-ADV', 'MSX 125', 'Monkey 125', 'Super Cub C125'],
        'Yamaha': ['Exciter 150', 'Exciter 155 VVA', 'Jupiter', 'Sirius', 'Grande', 'Janus', 'Latte', 'FreeGo', 'LEXi', 'NVX 155', 'R15 V4', 'MT-15', 'YZF-R3', 'YZF-R6', 'MT-03', 'MT-07', 'MT-09', 'YZF-R1', 'TMAX', 'XMAX 300', 'Aerox 155', 'Gear 125', 'Nouvo', 'Mio', 'YZ250F', 'YZ450F', 'WR250R', 'WR450F', 'Ténéré 700', 'Tracer 900', 'FJR1300', 'VMAX', 'Bolt', 'Star Venture', 'Viking', 'XSR700', 'XSR900', 'SCR950'],
        'Suzuki': ['Raider R150', 'Satria F150', 'Address', 'Avenis', 'Burgman Street', 'GSX-R150', 'GSX-S150', 'GSX-R1000', 'V-Strom 650', 'Hayabusa', 'GSX-R600', 'GSX-R750', 'GSX-S750', 'GSX-S1000', 'V-Strom 1000', 'Burgman 400', 'Burgman 650', 'SV650', 'Katana', 'DR-Z400SM', 'DR650S', 'RM-Z250', 'RM-Z450', 'LTR450', 'Intruder', 'Boulevard'],
        'SYM': ['Abela', 'Passing', 'Angela', 'Elegant', 'Attila', 'Star SR', 'Shark', 'Elizabeth', 'Husky Classic', 'GTS 300i', 'Citycom 300i', 'MaxSym TL', 'MaxSym 400i', 'Cruisym 300', 'Jet 14', 'Simply', 'Symphony', 'Magic', 'Wolf Classic', 'Fighter', 'Bonus', 'Galaxy'],
        'Piaggio': ['Vespa Primavera', 'Vespa Sprint', 'Vespa GTS', 'Vespa LX', 'Liberty', 'Medley', 'Beverly', 'MP3', 'Vespa Elettrica', 'Vespa 946', 'X7', 'X8', 'X9', 'X10', 'Fly', 'Zip', 'NRG', 'Typhoon', 'Skipper', 'Hexagon', 'Runner'],
        'Kymco': ['Many 110', 'Many 125', 'People GTi', 'Like 125', 'X-Town', 'Downtown', 'AK 550', 'Xciting 400', 'Super 8', 'Agility', 'Yup', 'Bet & Win', 'Grand Dink', 'MXU 300', 'MXU 500', 'UXV 450i', 'UXV 700i'],
        'Peugeot': ['Django', 'Speedfight', 'Kisbee', 'Citystar', 'Metropolis', 'Tweet', 'Vivacity', 'Ludix', 'Looxor', 'Satelis', 'Geopolis', 'SV', 'XP6', 'XR6', 'TKR', 'Squab'],
        'VinFast': ['Klara A1', 'Klara A2', 'Impes', 'Ludo', 'Theon', 'Feliz', 'Evo200', 'Tempest', 'Vento', 'Klara S', 'Klara S2022', 'Drono HX', 'Drono VX'],
        'Kawasaki': ['Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja H2', 'Z125 Pro', 'Z250', 'Z300', 'Z400', 'Z650', 'Z900', 'Z1000', 'Versys 300', 'Versys 650', 'Versys 1000', 'KLX150', 'KLX230', 'KLX250', 'KLX300', 'KX250F', 'KX450F', 'Vulcan S', 'Vulcan 900', 'W800'],
        'Ducati': ['Panigale V2', 'Panigale V4', 'Monster 797', 'Monster 821', 'Monster 1200', 'Multistrada 950', 'Multistrada 1260', 'Multistrada V4', 'Hypermotard 950', 'Scrambler Icon', 'Scrambler Desert Sled', 'Diavel 1260', 'XDiavel', 'SuperSport 950', 'StreetFighter V4'],
        'BMW': ['G310R', 'G310GS', 'C400X', 'C400GT', 'CE 04', 'F750GS', 'F850GS', 'R1250GS', 'S1000RR', 'S1000XR', 'R1250R', 'K1600GTL', 'R18', 'R nineT'],
        'KTM': ['Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'Duke 690', 'Duke 790', 'Duke 890', 'Duke 1290', 'RC 125', 'RC 200', 'RC 390', 'Adventure 390', 'Adventure 790', 'Adventure 890', 'Adventure 1290', '250 SX-F', '350 SX-F', '450 SX-F', '250 EXC-F', '350 EXC-F', '450 EXC-F'],
        'Harley-Davidson': ['Street 750', 'Street Rod', 'Iron 883', 'Iron 1200', 'Forty-Eight', 'Sportster 1200', 'Street Glide', 'Road Glide', 'Road King', 'Fat Boy', 'Heritage Classic', 'Low Rider', 'Breakout', 'Deluxe', 'Livewire'],
        'Triumph': ['Street Twin', 'Bonneville T100', 'Bonneville T120', 'Scrambler 900', 'Scrambler 1200', 'Speed Twin', 'Thruxton R', 'Street Triple R', 'Speed Triple', 'Tiger 900', 'Tiger 1200', 'Rocket 3', 'Trident 660'],
        'Aprilia': ['RS 125', 'RS 660', 'Tuono 125', 'Tuono 660', 'Tuono V4', 'RSV4', 'Shiver 900', 'Dorsoduro 900', 'Caponord 1200', 'SXV 550', 'RXV 550'],
        'Moto Guzzi': ['V7 III', 'V9 Roamer', 'V9 Bobber', 'V85 TT', 'California 1400', 'Audace', 'Eldorado', 'MGX-21'],
        'Indian': ['Scout', 'Scout Sixty', 'Scout Bobber', 'Chief', 'Chieftain', 'Roadmaster', 'Challenger', 'FTR 1200'],
        'Can-Am': ['Spyder F3', 'Spyder RT', 'Spyder F3-S', 'Ryker 600', 'Ryker 900'],
        'Benelli': ['TNT 135', 'TNT 150i', 'TNT 249S', 'TNT 302S', 'TNT 600i', 'TRK 251', 'TRK 502', 'Leoncino 249', 'Leoncino 500', 'Imperiale 400'],
        'CFMoto': ['150NK', '250NK', '300NK', '400NK', '650NK', '300SR', '650GT', '250CL-X', '650MT', '700CL-X'],
        'Zongshen': ['RX1', 'RX3', 'RC3', 'RA3', 'ZS250GY-3', 'ZS150-58'],
        'Lifan': ['KP150', 'KP200', 'KPR150', 'KPR200', 'LF150-2E', 'LF200-16C'],
        'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Ntorq 125', 'Jupiter', 'Star City+', 'Radeon', 'Sport'],
        'Bajaj': ['Pulsar 125', 'Pulsar 150', 'Pulsar 180', 'Pulsar 200NS', 'Pulsar 220F', 'Pulsar RS200', 'Dominar 250', 'Dominar 400', 'Avenger 160', 'Avenger 220'],
        'Hero': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Super Splendor', 'Glamour', 'Xtreme 200R', 'XPulse 200'],
        'Royal Enfield': ['Classic 350', 'Classic 500', 'Bullet 350', 'Bullet 500', 'Thunderbird 350', 'Thunderbird 500', 'Himalayan', 'Continental GT 650', 'Interceptor 650'],
        'Husqvarna': ['Vitpilen 125', 'Vitpilen 250', 'Vitpilen 401', 'Svartpilen 125', 'Svartpilen 250', 'Svartpilen 401', 'TE 125', 'TE 250', 'TE 300', 'FE 250', 'FE 350', 'FE 450', 'FC 250', 'FC 350', 'FC 450'],
        'GasGas': ['EC 125', 'EC 250', 'EC 300', 'EX 250', 'EX 300', 'MC 125', 'MC 250', 'MC 350', 'MC 450'],
        'Beta': ['RR 125', 'RR 200', 'RR 250', 'RR 300', 'RR 350', 'RR 390', 'RR 430', 'RR 480', 'X-Trainer 300'],
        'Sherco': ['SE 125', 'SE 250', 'SE 300', 'SEF 250', 'SEF 300', 'SEF 450', 'ST 250', 'ST 300'],
        'TM Racing': ['EN 125', 'EN 250', 'EN 300', 'MX 125', 'MX 250', 'MX 300', 'SMX 125', 'SMX 250', 'SMX 300'],
        'Khác': ['Khác']
    };

    const ACCESSORY_BRANDS = [
        'Givi',           // Thương hiệu thùng xe, kính chắn gió
        'Rizoma',         // Phụ kiện cao cấp từ Italy
        'Motul',          // Dầu nhớt và chất bôi trơn
        'Brembo',         // Phanh cao cấp
        'NGK',            // Bugi và phụ kiện điện
        'DID',            // Xích xe máy
        'YSS',            // Phuộc và giảm xóc
        'Akrapovic',      // Ống xả thể thao
        'Puig',           // Kính chắn gió và phụ kiện
        'Yoshimura',      // Ống xả và phụ kiện hiệu suất
        'Vario',          // Phụ kiện đa dạng
        'KYT',            // Mũ bảo hiểm
        'AGV',            // Mũ bảo hiểm cao cấp
        'Arai',           // Mũ bảo hiểm premium
        'Shoei',          // Mũ bảo hiểm Nhật Bản
        'LS2',            // Mũ bảo hiểm giá rẻ
        'YOHE',           // Mũ bảo hiểm phổ thông
        'GRS',            // Mũ bảo hiểm Việt Nam
        'Asia',           // Mũ bảo hiểm nội địa
        'Anbull',         // Khóa xe và phụ kiện bảo mật
        'Takei',          // Gương chiếu hậu
        'KTC',            // Dụng cụ sửa chữa
        'Denso',          // Phụ kiện điện tử
        'Bosch',          // Hệ thống điện và phụ kiện
        'Castrol',        // Dầu nhớt
        'Shell',          // Dầu nhớt và phụ gia
        'Total',          // Dầu nhớt Pháp
        'Repsol',         // Dầu nhớt Tây Ban Nha
        'Liqui Moly',     // Dầu nhớt và phụ gia Đức
        'Mobil 1',        // Dầu nhớt tổng hợp
        'Valvoline',      // Dầu nhớt Mỹ
        'Fuchs',          // Dầu nhớt Đức
        'Khác'
    ];

    const SPAREPART_BRANDS = [
        'NGK',            // Bugi và hệ thống đánh lửa
        'DID',            // Xích và dây curoa
        'Brembo',         // Đĩa phanh, má phanh
        'YSS',            // Phuộc, giảm xóc
        'Akrapovic',      // Ống xả thể thao
        'Motul',          // Dầu nhớt chuyên dụng
        'Denso',          // Hệ thống điện, cảm biến
        'Bosch',          // Bơm xăng, hệ thống phun xăng
        'Continental',    // Lốp xe cao cấp
        'Michelin',       // Lốp xe premium
        'Bridgestone',    // Lốp xe Nhật Bản
        'Pirelli',        // Lốp xe thể thao
        'Dunlop',         // Lốp xe đa dụng
        'Maxxis',         // Lốp xe giá rẻ
        'IRC',            // Lốp xe Nhật Bản
        'Swallow',        // Lốp xe Thái Lan
        'Aspira',         // Lốp xe Indonesia
        'Corsa',          // Lốp xe địa phương
        'Yuasa',          // Ắc quy cao cấp
        'GS',             // Ắc quy phổ thông
        'Rocket',         // Ắc quy Việt Nam
        'Hitachi',        // Phụ tùng điện
        'Mahle',          // Lọc gió, lọc dầu
        'Mann Filter',    // Bộ lọc cao cấp
        'K&N',            // Lọc gió thể thao
        'Champion',       // Bugi và phụ kiện
        'Iridium',        // Bugi cao cấp
        'Denso Iridium',  // Bugi iridium
        'Federal',        // Má phanh
        'Bendix',         // Hệ thống phanh
        'TRW',            // Phụ tùng châu âu
        'Sachs',          // Phuộc và ly hợp
        'Kenda',          // Lốp xe
        'Shinko',         // Lốp xe Nhật
        'Khác'
    ];

    const UNIVERSAL_MODELS = [
        'Tất cả',         // Phù hợp với mọi loại xe
        'Xe ga',          // Dành cho xe ga/scooter
        'Xe số',          // Dành cho xe số
        'Xe côn tay',     // Dành cho xe côn tay
        'Xe phân khối lớn', // Dành cho xe PKL
        'Xe điện',        // Dành cho xe điện
        'Khác'            // Loại khác
    ];

    // Xác định loại sản phẩm dựa vào danh mục được chọn
    const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);
    const isAccessory = selectedCategory?.name?.toLowerCase().includes('phụ kiện');
    const isSparePart = selectedCategory?.name?.toLowerCase().includes('phụ tùng');

    // Cập nhật danh sách thương hiệu và model khi thay đổi danh mục
    useEffect(() => {
        if (isAccessory) {
            // Nếu là phụ kiện xe máy
            setBrands(ACCESSORY_BRANDS);
            setModels(UNIVERSAL_MODELS);
        } else if (isSparePart) {
            // Nếu là phụ tùng xe máy
            setBrands(SPAREPART_BRANDS);
            setModels(UNIVERSAL_MODELS);
        } else {
            // Nếu là xe máy hoặc danh mục khác
            setBrands(BRANDS);
            setModels(formData.brand ? MODELS[formData.brand as keyof typeof MODELS] || [] : []);
        }
        // Reset brand và model khi thay đổi danh mục
        setFormData(prev => ({ ...prev, brand: '', model: '' }));
    }, [formData.categoryId, categories]);

    // Khi chọn brand, cập nhật models
    useEffect(() => {
        if (!isAccessory && !isSparePart) {
            setModels(formData.brand ? MODELS[formData.brand as keyof typeof MODELS] || [] : []);
            setFormData(prev => ({ ...prev, model: '' }));
        }
        // Nếu là phụ kiện/phụ tùng thì không làm gì, giữ nguyên models = UNIVERSAL_MODELS
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

        // Brand/model validation động
        if (!formData.brand?.trim()) newErrors.brand = 'Thương hiệu là bắt buộc';
        else if (
            (isAccessory && !ACCESSORY_BRANDS.includes(formData.brand)) ||
            (isSparePart && !SPAREPART_BRANDS.includes(formData.brand)) ||
            (!isAccessory && !isSparePart && !BRANDS.includes(formData.brand))
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
        // VD: "123 Đường ABC, Phường 1, Quận 3, Thành phố Hồ Chí Minh, ..."
        const parts = mapAddress.split(',').map(s => s.trim());
        let provinceName = '', districtName = '', wardName = '', street = '';
        if (parts.length >= 3) {
            provinceName = parts[parts.length - 1];
            districtName = parts[parts.length - 2];
            wardName = parts[parts.length - 3];
            street = parts.slice(0, parts.length - 3).join(', ');
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
                wardName && w.name && wardName.toLowerCase().includes(w.name.toLowerCase())
            );
            wardCode = ward?.code || '';
        }

        setProvinceCode(provinceCode);
        setTempDistrictName(districtName); // tạo state tạm
        setTempWardName(wardName);         // tạo state tạm
        setStreetAddress(street);

        setFormData((prev) => ({ ...prev, location: mapAddress }));
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
