// Danh sách thương hiệu và model chi tiết cho từng loại sản phẩm

// Xe máy
export const MOTORCYCLE_BRANDS_MODELS: Record<string, string[]> = {
    Honda: [
        'Wave Alpha', 'Wave RSX', 'Future', 'Vision', 'Lead', 'SH Mode', 'SH 125i', 'SH 150i', 'SH 350i',
        'Air Blade', 'Vario', 'PCX', 'Winner X', 'CB150R', 'CBR150R', 'CBR250RR', 'CBR650R', 'CB1000R',
        'Africa Twin', 'Gold Wing', 'CRF250L', 'CRF450L', 'Rebel 300', 'Rebel 500', 'Shadow 750',
        'CBR1000RR', 'CBR600RR', 'CB650R', 'CB500F', 'CBR500R', 'CRF1100L', 'NC750X', 'Forza 300',
        'Forza 750', 'X-ADV', 'MSX 125', 'Monkey 125', 'Super Cub C125'
    ],
    Yamaha: [
        'Exciter 150', 'Exciter 155 VVA', 'Jupiter', 'Sirius', 'Grande', 'Janus', 'Latte', 'FreeGo',
        'LEXi', 'NVX 155', 'R15 V4', 'MT-15', 'YZF-R3', 'YZF-R6', 'MT-03', 'MT-07', 'MT-09', 'YZF-R1',
        'TMAX', 'XMAX 300', 'Aerox 155', 'Gear 125', 'Nouvo', 'Mio', 'YZ250F', 'YZ450F', 'WR250R',
        'WR450F', 'Ténéré 700', 'Tracer 900', 'FJR1300', 'VMAX', 'Bolt', 'Star Venture', 'Viking',
        'XSR700', 'XSR900', 'SCR950'
    ],
    Suzuki: [
        'Raider R150', 'Satria F150', 'Address', 'Avenis', 'Burgman Street', 'GSX-R150', 'GSX-S150',
        'GSX-R1000', 'V-Strom 650', 'Hayabusa', 'GSX-R600', 'GSX-R750', 'GSX-S750', 'GSX-S1000',
        'V-Strom 1000', 'Burgman 400', 'Burgman 650', 'SV650', 'Katana', 'DR-Z400SM', 'DR650S',
        'RM-Z250', 'RM-Z450', 'LTR450', 'Intruder', 'Boulevard'
    ],
    SYM: [
        'Abela', 'Passing', 'Angela', 'Elegant', 'Attila', 'Star SR', 'Shark', 'Elizabeth',
        'Husky Classic', 'GTS 300i', 'Citycom 300i', 'MaxSym TL', 'MaxSym 400i', 'Cruisym 300',
        'Jet 14', 'Simply', 'Symphony', 'Magic', 'Wolf Classic', 'Fighter', 'Bonus', 'Galaxy'
    ],
    Piaggio: [
        'Vespa Primavera', 'Vespa Sprint', 'Vespa GTS', 'Vespa LX', 'Liberty', 'Medley', 'Beverly',
        'MP3', 'Vespa Elettrica', 'Vespa 946', 'X7', 'X8', 'X9', 'X10', 'Fly', 'Zip', 'NRG',
        'Typhoon', 'Skipper', 'Hexagon', 'Runner'
    ],
    VinFast: [
        'Klara A1', 'Klara A2', 'Impes', 'Ludo', 'Theon', 'Feliz', 'Evo200', 'Tempest', 'Vento',
        'Klara S', 'Klara S2022', 'Drono HX', 'Drono VX'
    ],
    // ... Thêm các hãng khác tương tự
};

export const MOTORCYCLE_BRANDS = Object.keys(MOTORCYCLE_BRANDS_MODELS);

// Phụ kiện
export const ACCESSORY_BRANDS = [
    'Givi', 'Rizoma', 'Motul', 'Brembo', 'AGV', 'Shoei', 'Arai', 'LS2', 'YOHE', 'GRS', 'Asia',
    'Takei', 'KTC', 'Denso', 'Bosch', 'Castrol', 'Shell', 'Total', 'Repsol', 'Liqui Moly',
    'Mobil 1', 'Valvoline', 'Fuchs', 'Khác'
];
export const ACCESSORY_MODELS = [
    'Mũ bảo hiểm', 'Găng tay', 'Kính chắn gió', 'Thùng xe', 'Quần áo bảo hộ', 'Giày bảo hộ',
    'Túi đựng đồ', 'Đèn LED', 'Giá đỡ điện thoại', 'Khóa xe', 'Gương chiếu hậu', 'Dụng cụ sửa chữa',
    'Dầu nhớt', 'Phụ kiện điện tử', 'Khác'
];

// Phụ tùng
export const SPAREPART_BRANDS = [
    'NGK', 'DID', 'YSS', 'Akrapovic', 'Motul', 'Bosch', 'Brembo', 'Michelin', 'Bridgestone',
    'Pirelli', 'Dunlop', 'Maxxis', 'IRC', 'Swallow', 'Aspira', 'Corsa', 'Yuasa', 'GS', 'Rocket',
    'Hitachi', 'Mahle', 'Mann Filter', 'K&N', 'Champion', 'Iridium', 'Denso Iridium', 'Federal',
    'Bendix', 'TRW', 'Sachs', 'Kenda', 'Shinko', 'Khác'
];
export const SPAREPART_MODELS = [
    'Bugi', 'Xích', 'Phanh', 'Lọc gió', 'Lọc dầu', 'Lốp', 'Ắc quy', 'Ống xả', 'Phuộc',
    'Cảm biến', 'Bơm xăng', 'Bộ lọc', 'Ly hợp', 'Nắp bình', 'Khác'
];

// Size options cho phụ kiện
export const SIZE_OPTIONS = {
    // Kích thước quần áo
    CLOTHING: [
        { value: 'XS', label: 'XS (Extra Small)' },
        { value: 'S', label: 'S (Small)' },
        { value: 'M', label: 'M (Medium)' },
        { value: 'L', label: 'L (Large)' },
        { value: 'XL', label: 'XL (Extra Large)' },
        { value: 'XXL', label: 'XXL (Double Extra Large)' },
        { value: 'XXXL', label: 'XXXL (Triple Extra Large)' }
    ],

    // Size mũ bảo hiểm
    HELMET: [
        { value: '54-55cm', label: '54-55cm (XS)' },
        { value: '56-57cm', label: '56-57cm (S)' },
        { value: '58-59cm', label: '58-59cm (M)' },
        { value: '60-61cm', label: '60-61cm (L)' },
        { value: '62-63cm', label: '62-63cm (XL)' },
        { value: '64-65cm', label: '64-65cm (XXL)' }
    ],

    // Size găng tay
    GLOVES: [
        { value: '6', label: 'Size 6 (XS)' },
        { value: '7', label: 'Size 7 (S)' },
        { value: '8', label: 'Size 8 (M)' },
        { value: '9', label: 'Size 9 (L)' },
        { value: '10', label: 'Size 10 (XL)' },
        { value: '11', label: 'Size 11 (XXL)' }
    ],

    // Size giày
    SHOES: [
        { value: '35', label: '35' },
        { value: '36', label: '36' },
        { value: '37', label: '37' },
        { value: '38', label: '38' },
        { value: '39', label: '39' },
        { value: '40', label: '40' },
        { value: '41', label: '41' },
        { value: '42', label: '42' },
        { value: '43', label: '43' },
        { value: '44', label: '44' },
        { value: '45', label: '45' },
        { value: '46', label: '46' }
    ],

    // Size khác
    UNIVERSAL: [
        { value: 'One Size', label: 'One Size (Một size)' },
        { value: 'Free Size', label: 'Free Size (Size tự do)' },
        { value: 'Universal', label: 'Universal (Phổ thông)' }
    ]
};

// Tất cả size options
export const ALL_SIZE_OPTIONS = [
    { group: 'Kích thước quần áo', options: SIZE_OPTIONS.CLOTHING },
    { group: 'Size mũ bảo hiểm', options: SIZE_OPTIONS.HELMET },
    { group: 'Size găng tay', options: SIZE_OPTIONS.GLOVES },
    { group: 'Size giày', options: SIZE_OPTIONS.SHOES },
    { group: 'Khác', options: SIZE_OPTIONS.UNIVERSAL }
]; 