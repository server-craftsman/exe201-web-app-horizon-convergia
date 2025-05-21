// Dữ liệu cho các hãng xe phổ biến
export const popularBrands = [
    { id: 1, name: 'Honda', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg', slug: 'honda' },
    { id: 2, name: 'Yamaha', image: 'https://www.sweelee.com.vn/cdn/shop/collections/yamaha_1200x1200.jpg?v=1661744650', slug: 'yamaha' },
    { id: 3, name: 'Suzuki', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/1200px-Suzuki_logo_2.svg.png', slug: 'suzuki' },
    { id: 4, name: 'SYM', image: 'https://vinadesign.vn/uploads/images/2023/06/logo-sym-vinadesign-03-10-21-08.jpg', slug: 'sym' },
    { id: 5, name: 'Piaggio', image: 'https://images.seeklogo.com/logo-png/10/1/piaggio-logo-png_seeklogo-108646.png', slug: 'piaggio' },
    { id: 6, name: 'Kawasaki', image: 'https://storage.kawasaki.eu/public/kawasaki.eu/en-EU/news/th_black_river_mark.jpg', slug: 'kawasaki' },
];

// Dữ liệu cho xe mới đăng
export const newListings = [
    {
        id: 1,
        title: 'Honda SH 150i ABS 2020',
        image: 'https://xemayanhloc.com.vn/wp-content/uploads/2023/11/z4916587280208_2d69b4d853e40e1c602e0106241474da.jpg',
        price: 88500000,
        year: 2020,
        location: 'TP. Hồ Chí Minh',
        slug: 'honda-sh-150i-abs-2020'
    },
    {
        id: 2,
        title: 'Yamaha Exciter 150 2019',
        image: 'https://thanhnienviet.mediacdn.vn/thumb_w/480/2018/08/07/XForF7yt/yamaha-exciter-150-r-eccb.jpg',
        price: 35000000,
        year: 2019,
        location: 'Hà Nội',
        slug: 'yamaha-exciter-150-2019'
    },
    {
        id: 3,
        title: 'Suzuki Raider R150 Fi 2022',
        image: 'https://i.vietgiaitri.com/2022/12/2/suzuki-raider-r150-2023-trinh-lang-voi-loat-mau-moi-cuc-cool-1ab-6774068.jpg',
        price: 49800000,
        year: 2022,
        location: 'Đà Nẵng',
        slug: 'suzuki-raider-r150-fi-2022'
    },
    {
        id: 4,
        title: 'Piaggio Vespa Sprint 2021',
        image: 'https://file.hstatic.net/200000449245/file/vespa-sprint-s-150-black-opaco-matt-motoplex-hanoi-1a_01d9d5e9524e47f38c6a1302c0759e7d_1024x1024.jpg',
        price: 70500000,
        year: 2021,
        location: 'TP. Hồ Chí Minh',
        slug: 'piaggio-vespa-sprint-2021'
    },
];

// Dữ liệu cho phụ kiện
export const accessories = [
    {
        id: 1,
        title: 'Mũ bảo hiểm Royal M139',
        image: 'https://hifa.vn/wp-content/uploads/2018/10/Royal-M139-Tem-39.jpg',
        price: 1250000,
        originalPrice: 1470000,
        discount: 15,
        slug: 'mu-bao-hiem-royal-m139'
    },
    {
        id: 2,
        title: 'Găng tay Komine GK-228',
        image: 'https://pro-biker.vn/image/cache/catalog/gang-tay/komine/gk-228/gang-tay-komine-gk-228-1-800x800.jpg',
        price: 780000,
        slug: 'gang-tay-komine-gk-228'
    },
    {
        id: 3,
        title: 'Đèn pha LED Projector',
        image: 'https://bulbtek.vn/wp-content/uploads/2024/02/den-projector-la-gi.png',
        price: 1850000,
        isNew: true,
        slug: 'den-pha-led-projector'
    },
    {
        id: 4,
        title: 'Phuộc YSS G-Sport',
        image: 'https://yss.vn/wp-content/uploads/2020/01/Phuoc-YSS-G-SPORT-Click_Vario_Vision-OG302-330TRJ-05-888A-dong-moi-nhat-2024.-YSSVN-gia-tot-nhat-nhap-khau-truc-tiep-tu-Thai-Lan.jpg',
        price: 3950000,
        slug: 'phuoc-yss-g-sport'
    }
];

// Dữ liệu cho tin tức
export const latestNews = [
    {
        id: 1,
        title: 'Top 5 xe máy đáng mua nhất 2023',
        excerpt: 'Tổng hợp những mẫu xe máy được đánh giá là đáng mua nhất trong năm 2023...',
        image: 'https://thegioixedien.com.vn/datafiles/img_data/images/top-5-xe-may-50cc-danh-cho-nu-dang-lua-chon-nhat-nam-2023.jpg',
        date: '15/05/2023',
        slug: 'top-5-xe-may-dang-mua-nhat-2023'
    },
    {
        id: 2,
        title: 'Kinh nghiệm mua xe máy cũ không bị hớ',
        excerpt: 'Những lưu ý quan trọng bạn cần biết khi mua xe máy cũ để tránh mua phải xe dựng...',
        image: 'https://kiemtraxecu.com/wp-content/uploads/2021/10/L%C6%B0u-%C3%BD-khi-mua-xe-m%C3%A1y-c%C5%A9.jpg',
        date: '10/05/2023',
        slug: 'kinh-nghiem-mua-xe-may-cu-khong-bi-ho'
    },
    {
        id: 3,
        title: 'Bảo dưỡng xe máy đúng cách trong mùa mưa',
        excerpt: 'Hướng dẫn cách bảo dưỡng xe máy đúng cách trong mùa mưa để đảm bảo xe luôn hoạt động tốt...',
        image: 'https://lpbi.com.vn/wp-content/uploads/2024/06/740-12.jpg',
        date: '05/05/2023',
        slug: 'bao-duong-xe-may-dung-cach-trong-mua-mua'
    },
];

// Dữ liệu testimonials
export const testimonials = [
    {
        id: 1,
        name: 'Giáo làng',
        location: 'Khách hàng tại TP HCM',
        avatar: 'https://yt3.googleusercontent.com/zlWYSmjS34cnOH94qZYmWEeCkU_DnrFl5G-dCd66i3jqTElMvdwBtsOyMJPpoNXfdpHKPjYrmA=s900-c-k-c0x00ffffff-no-rj',
        content: 'Tôi đã mua xe Honda SH qua Horizon Convergia và cực kỳ hài lòng với dịch vụ. Xe chất lượng, giá hợp lý và thủ tục nhanh gọn.'
    },
    {
        id: 2,
        name: 'Nguyễn Minh Phúc',
        location: 'Khách hàng tại Củ Chi',
        avatar: 'https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/290612422_750526599597283_3367313551794571151_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEXg4eKZV55FcUNSuV4EL_IrjLjKCTuDLCuMuMoJO4MsLZ2-nex5CDASFdzw0c8YXrDBmLbG2wexIljxuQjglyT&_nc_ohc=WFmL2HWFZF0Q7kNvwFicvPW&_nc_oc=AdmoVaN_iyYp0Ew1DME2n5yfzdMAcPylMIBm9GjmpSxI25BXK6hO5pC2CmXALCckNtk&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=Eywd9rPthh7T6L6yBlx1gQ&oh=00_AfIG32Ab6QfJG2_leR9SPpLnowt0ukEl7_W_Q9K8gp-5dw&oe=6833D08D',
        content: 'Phụ kiện chính hãng, chất lượng cao và giá cả hợp lý. Dịch vụ giao hàng nhanh chóng và chuyên nghiệp. Sẽ tiếp tục ủng hộ Horizon Convergia.'
    },
    {
        id: 3,
        name: 'Thích Chân Quang',
        location: 'Khách hàng tại Vũng Tàu',
        avatar: 'https://photo-zmp3.zadn.vn/avatars/2/4/0/9/240912e1fa6461f9f6cfcc57613e7f35.jpg',
        content: 'Nhân viên tư vấn rất nhiệt tình, am hiểu về xe máy. Tôi đã bán được chiếc Wave Alpha với giá tốt thông qua nền tảng này. Cảm ơn Horizon Convergia.'
    }
];

// Dữ liệu đối tác
export const partners = [
    { id: 1, name: 'Partner 1', logo: 'https://cdnphoto.dantri.com.vn/Vv-ZqZWMqHZVqkNEivoCQYYGk34=/zoom/1200_630/2023/07/28/z4555266115062948ac4d4ff1fd19ef382bb706015910a-1690540767946.jpg' },
    { id: 2, name: 'Partner 2', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_nE7QdI_X9-Z_tEn97jmVBaxQz92LjoPZoaGZDAuwHvwA=s900-c-k-c0x00ffffff-no-rj' },
    { id: 3, name: 'Partner 3', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDiLdCT3TOZYaEDAAcuqhsBpsPe4ZjzfI3zQ&s' },
    { id: 4, name: 'Partner 4', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPoyhcYqqQwGa7ju3KNc1bhh3abFOiIebgfw&s' },
    { id: 5, name: 'Partner 5', logo: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/7d/7d/da/the-respectful-sakya.jpg?w=900&h=500&s=1' },

]; 