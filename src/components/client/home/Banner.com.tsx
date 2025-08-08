import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategory } from '@hooks/modules/useCategory';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';
import { MOTORCYCLE_BRANDS_MODELS, MOTORCYCLE_BRANDS } from '@consts/productBrandsModels';

// Import horizon-khung images
import voChinhHang from '@assets/horizon-khung/vo chinh hang@2x.png';
import nhotChinhHang from '@assets/horizon-khung/nhot chinh hang@2x.png';
import phuKienBiker from '@assets/horizon-khung/phu kien biker@2x.png';
import phuTungChinhHang from '@assets/horizon-khung/phu tung chinh hang@2x.png';
// Dữ liệu slider
const sliderData = [
  {
    id: 1,
    title: "Vỏ Xe <span>Chính Hãng</span> Chất Lượng",
    description: "Khám phá bộ sưu tập vỏ xe cao cấp từ các thương hiệu uy tín, đảm bảo an toàn và hiệu suất tối ưu",
    image: voChinhHang,
    bgColor: "from-gray-900 via-gray-800 to-gray-900",
    category: "vỏ xe"
  },
  {
    id: 2,
    title: "Dầu Nhớt <span>Premium</span> Bảo Vệ Động Cơ",
    description: "Dầu nhớt chất lượng cao giúp bảo vệ và tăng tuổi thọ động cơ xe máy của bạn",
    image: nhotChinhHang,
    bgColor: "from-indigo-900 via-purple-800 to-indigo-900",
    category: "dầu nhớt"
  },
  {
    id: 3,
    title: "Phụ Kiện <span>Cao Cấp</span> Chính Hãng",
    description: "Nâng cấp xế yêu của bạn với những phụ kiện chất lượng từ các thương hiệu uy tín",
    image: phuKienBiker,
    bgColor: "from-amber-900 via-red-800 to-amber-900",
    category: "phụ kiện"
  }
];

// Category mapping for better background selection
const categoryBackgroundMap = {
  // Vỏ xe categories
  'vỏ xe': voChinhHang,
  'lốp xe': voChinhHang,
  'tire': voChinhHang,
  'vo xe': voChinhHang,
  'lop xe': voChinhHang,
  'vỏ chính hãng': voChinhHang,
  'vo chinh hang': voChinhHang,

  // Dầu nhớt categories
  'dầu nhớt': nhotChinhHang,
  'dầu': nhotChinhHang,
  'nhớt': nhotChinhHang,
  'oil': nhotChinhHang,
  'lubricant': nhotChinhHang,
  'dau nhot': nhotChinhHang,
  'dau': nhotChinhHang,
  'nhot': nhotChinhHang,
  'dầu nhớt chính hãng': nhotChinhHang,
  'dau nhot chinh hang': nhotChinhHang,

  // Phụ kiện categories
  'phụ kiện': phuKienBiker,
  'phụ kiện xe': phuKienBiker,
  'đồ chơi xe': phuKienBiker,
  'accessories': phuKienBiker,
  'phu kien': phuKienBiker,
  'do choi': phuKienBiker,

  // Phụ tùng categories
  'phụ tùng': phuTungChinhHang,
  'phụ tùng xe': phuTungChinhHang,
  'phụ tùng theo xe': phuTungChinhHang,
  'spare parts': phuTungChinhHang,
  'parts': phuTungChinhHang,
  'phu tung': phuTungChinhHang,
  'theo xe': phuTungChinhHang,

  // Xe máy categories
  'xe máy': phuKienBiker,
  'motorcycle': phuKienBiker,
  'xe may': phuKienBiker,

  // Dịch vụ categories
  'dịch vụ': nhotChinhHang,
  'sửa chữa': nhotChinhHang,
  'maintenance': nhotChinhHang,
  'dich vu': nhotChinhHang,
  'sua chua': nhotChinhHang
};

interface CategoryNode extends ICategory {
  children?: CategoryNode[];
}

type CategoryWithChildren = CategoryNode;

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<number | null>(null);
  const { useGetAllCategories } = useCategory();

  // Fetch categories with static query to prevent re-fetching
  const { data: fetchedCategories = [], isLoading: categoriesLoading } = useGetAllCategories({
    pageSize: 1000,
    pageNumber: 1
  });

  const [activeParentCategory, setActiveParentCategory] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize categories tree to prevent unnecessary re-calculations
  const categories = useMemo(() => {
    if (!fetchedCategories || fetchedCategories.length === 0) return [];

    const parentCats = fetchedCategories.filter((c: ICategory) => !c.parentCategoryId);
    const mapToTree: CategoryWithChildren[] = parentCats.map((p: ICategory) => ({
      ...p,
      children: fetchedCategories.filter((c: ICategory) => c.parentCategoryId === p.id),
    }));

    // Add special categories
    const specialCategories: CategoryWithChildren[] = [
      {
        id: 'vo-chinh-hang-special',
        name: 'Vỏ chính hãng',
        description: 'Vỏ xe chính hãng chất lượng cao',
        imageUrl: '',
        parentCategoryId: null,
        children: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'dau-nhot-chinh-hang-special',
        name: 'Dầu nhớt chính hãng',
        description: 'Dầu nhớt chính hãng bảo vệ động cơ',
        imageUrl: '',
        parentCategoryId: null,
        children: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'phu-tung-theo-xe-special',
        name: 'Phụ tùng theo xe',
        description: 'Phụ tùng chính hãng theo từng dòng xe',
        imageUrl: '',
        parentCategoryId: null,
        children: MOTORCYCLE_BRANDS.map(brand => ({
          id: `brand-${brand.toLowerCase().replace(/\s+/g, '-')}`,
          name: brand,
          description: `Phụ tùng chính hãng cho ${brand}`,
          imageUrl: '',
          parentCategoryId: 'phu-tung-theo-xe-special',
          children: MOTORCYCLE_BRANDS_MODELS[brand]?.map(model => ({
            id: `model-${brand.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase().replace(/\s+/g, '-')}`,
            name: model,
            description: `Phụ tùng cho ${brand} ${model}`,
            imageUrl: '',
            parentCategoryId: `brand-${brand.toLowerCase().replace(/\s+/g, '-')}`,
            children: [],
            createdAt: new Date(),
            updatedAt: new Date()
          })) || [],
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return [...specialCategories, ...mapToTree];
  }, [fetchedCategories]);

  // Xử lý autoplay
  useEffect(() => {
    if (isAutoplay) {
      // Clear any existing interval first
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
      }

      // Set new interval
      autoplayRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliderData.length);
      }, 5000);
    }

    return () => {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isAutoplay]);

  // Cleanup menu timeout on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
        menuTimeoutRef.current = null;
      }
    };
  }, []);

  // Keyboard support for closing megamenu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeParentCategory) {
        closeMegamenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeParentCategory]);

  // Xử lý dừng autoplay khi hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Handle category menu hover with timeout
  const handleCategoryMouseEnter = (categoryId: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveParentCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveParentCategory(null);
    }, 150); // Small delay to prevent menu from disappearing when moving to submenu
  };

  // Close megamenu function
  const closeMegamenu = () => {
    setActiveParentCategory(null);
  };

  // Chuyển đến slide trước
  const prevSlide = () => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(prev => (prev - 1 + sliderData.length) % sliderData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };

  // Chuyển đến slide sau
  const nextSlide = () => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(prev => (prev + 1) % sliderData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };

  // Chuyển đến slide cụ thể
  const goToSlide = (index: number) => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(index);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };

  const currentSlideData = sliderData[currentSlide];

  // Function to get background image based on category name
  const getCategoryBackgroundImage = (categoryName: string) => {
    if (!categoryName) return voChinhHang; // Fallback

    const lowerName = categoryName.toLowerCase();

    // Check exact matches first
    for (const [key, background] of Object.entries(categoryBackgroundMap)) {
      if (lowerName.includes(key)) {
        return background;
      }
    }

    // Additional specific mappings
    if (lowerName.includes('lốp') || lowerName.includes('lop') || lowerName.includes('vỏ') || lowerName.includes('vo')) {
      return voChinhHang;
    }
    else if (lowerName.includes('dầu nhớt') || lowerName.includes('dau nhot') || lowerName.includes('nhớt') || lowerName.includes('nhot') || lowerName.includes('dầu') || lowerName.includes('dau')) {
      return nhotChinhHang;
    }
    else if (lowerName.includes('phụ kiện') || lowerName.includes('phu kien') || lowerName.includes('đồ chơi') || lowerName.includes('do choi')) {
      return phuKienBiker;
    }
    else if (
      lowerName.includes('phụ tùng') ||
      lowerName.includes('phu tung') ||
      lowerName.includes('thay thế') ||
      lowerName.includes('thay the') ||
      lowerName.includes('theo xe') ||
      lowerName.includes('parts')
    ) {
      return phuTungChinhHang; // Use genuine parts image for parts-related categories
    } else if (lowerName.includes('xe máy') || lowerName.includes('xe may') || lowerName.includes('motorcycle')) {
      return phuKienBiker; // Use accessories image for motorcycles
    } else if (lowerName.includes('dịch vụ') || lowerName.includes('dich vu') || lowerName.includes('sửa chữa') || lowerName.includes('sua chua')) {
      return nhotChinhHang; // Use oil image for services
    }

    // Default background for other categories
    return voChinhHang;
  };

  return (
    <section
      className="relative h-[520px] overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SIDEBAR - category menu */}
      <aside className="absolute z-[100] top-0 left-0 h-full w-full pointer-events-none">
        <div className="relative h-full w-72 pointer-events-auto">
          <div className="absolute top-0 left-0 h-full w-72 bg-white">
            <h3 className="py-4 px-5 font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Danh mục sản phẩm
            </h3>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <ul className="space-y-1 px-2 py-4 overflow-y-auto custom-scrollbar max-h-[calc(100%-60px)]">
                {categories.map((parent, index) => (
                  <motion.li
                    key={parent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onMouseEnter={() => handleCategoryMouseEnter(parent.id)}
                    onMouseLeave={handleCategoryMouseLeave}
                    className="group relative category-item-hover"
                  >
                    <Link
                      to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${parent.id}`}
                      className="flex justify-between items-center px-4 py-3 hover:bg-amber-50 transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-amber-700 flex items-center transition-colors duration-300 relative z-10">
                        {/* Category image or icon */}
                        {parent.imageUrl ? (
                          <img
                            src={parent.imageUrl}
                            alt={parent.name}
                            className="w-4 h-4 mr-2 object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          // Enhanced fallback icon based on category name
                          (() => {
                            const lowerName = parent.name.toLowerCase();
                            if (lowerName.includes('lốp') || lowerName.includes('lop') || lowerName.includes('vỏ') || lowerName.includes('vo') || lowerName.includes('vỏ chính hãng') || lowerName.includes('vo chinh hang')) {
                              return (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              );
                            } else if (lowerName.includes('dầu nhớt') || lowerName.includes('dau nhot') || lowerName.includes('nhớt') || lowerName.includes('nhot') || lowerName.includes('dầu') || lowerName.includes('dau') || lowerName.includes('dầu nhớt chính hãng') || lowerName.includes('dau nhot chinh hang')) {
                              return (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                              );
                            } else if (lowerName.includes('phụ kiện') || lowerName.includes('phu kien')) {
                              return (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              );
                            } else if (lowerName.includes('phụ tùng') || lowerName.includes('phu tung') || lowerName.includes('theo xe')) {
                              return (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500 group-hover:text-green-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                              );
                            } else {
                              return (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              );
                            }
                          })()
                        )}
                        <span className="text-sm font-medium truncate">{parent.name}</span>
                      </span>

                      {(parent.children?.length ?? 0) > 0 && (
                        <motion.svg
                          className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors duration-300 relative z-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      )}
                    </Link>

                    {/* MEGAMENU - positioned to overlay the entire screen */}
                    {(parent.children?.length ?? 0) > 0 && activeParentCategory === parent.id && parent.children && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[1000]"
                        onMouseEnter={() => handleCategoryMouseEnter(parent.id)}
                        onMouseLeave={handleCategoryMouseLeave}
                      >
                        {/* Full screen overlay */}
                        <div
                          className="absolute inset-0"
                          onClick={closeMegamenu}
                        ></div>

                        {/* Megamenu content positioned to the right of sidebar */}
                        <motion.div
                          className="absolute top-[72px] left-72 h-[520px] w-[900px] bg-white overflow-hidden"
                          initial={{ scale: 0.95, opacity: 0, x: -20 }}
                          animate={{ scale: 1, opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {/* Main content overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-sm"></div>

                          {/* Content with full height scrolling */}
                          <div className="relative z-20 h-full overflow-y-auto custom-scrollbar p-10">
                            {/* Header section */}
                            <div className="flex items-center justify-between mb-4">
                              {/* set background image is right */}
                              <div className="absolute inset-0 z-0">
                                <img
                                  src={getCategoryBackgroundImage(parent.name)}
                                  alt={parent.name}
                                  className="w-[1400px] h-[520px] ml-15 mt-5 object-cover object-right-bottom"
                                />
                              </div>
                              <div className="flex items-center space-x-3">
                                {parent.imageUrl ? (
                                  <div className="w-8 h-8 overflow-hidden flex-shrink-0 rounded">
                                    <img
                                      src={parent.imageUrl}
                                      alt={parent.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        // Show fallback icon
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.innerHTML = `
                                            <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded flex items-center justify-center">
                                              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                              </svg>
                                            </div>
                                          `;
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 overflow-hidden flex-shrink-0">
                                    {/* Enhanced fallback icon based on category name */}
                                    {(() => {
                                      const lowerName = parent.name.toLowerCase();
                                      if (lowerName.includes('lốp') || lowerName.includes('lop') || lowerName.includes('vỏ') || lowerName.includes('vo') || lowerName.includes('vỏ chính hãng') || lowerName.includes('vo chinh hang')) {
                                        return (
                                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          </div>
                                        );
                                      } else if (lowerName.includes('dầu nhớt') || lowerName.includes('dau nhot') || lowerName.includes('nhớt') || lowerName.includes('nhot') || lowerName.includes('dầu') || lowerName.includes('dau') || lowerName.includes('dầu nhớt chính hãng') || lowerName.includes('dau nhot chinh hang')) {
                                        return (
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                          </div>
                                        );
                                      } else if (lowerName.includes('phụ kiện') || lowerName.includes('phu kien')) {
                                        return (
                                          <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                          </div>
                                        );
                                      }
                                    })()}
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{parent.name}</h4>
                                  <p className="text-gray-600 text-sm">
                                    <span className="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded">
                                      {parent.children?.length} danh mục con
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Main content area with fixed image background and overlay grid */}
                            <div className="relative min-h-[320px]">
                              {/* Categories grid overlay - more compact */}
                              <div className="relative z-10 grid grid-cols-3 gap-3">
                                {parent.children?.map((child, index) => (
                                  <motion.div
                                    key={child.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md border border-gray-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={{ y: -3, scale: 1.01 }}
                                  >
                                    <div className="relative z-10">
                                      <motion.div
                                        whileHover={{ x: 3 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Link
                                          to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${child.id}`}
                                          className="block"
                                        >
                                          <div className="flex items-center space-x-2 mb-2">
                                            {child.imageUrl ? (
                                              <div className="w-6 h-6 overflow-hidden flex-shrink-0 rounded">
                                                <img
                                                  src={child.imageUrl}
                                                  alt={child.name}
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                  onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    // Show fallback icon
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                      parent.innerHTML = `
                                                        <div class="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded flex items-center justify-center">
                                                          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                          </svg>
                                                        </div>
                                                      `;
                                                    }
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded flex items-center justify-center duration-300">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                              </div>
                                            )}
                                            <div className="flex-1">
                                              <h5 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors text-sm leading-tight truncate">
                                                {child.name}
                                              </h5>
                                              {(child.children?.length ?? 0) > 0 && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                  {child.children?.length} danh mục
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </Link>
                                      </motion.div>

                                      {/* Subcategories - rendered as compact list */}
                                      {(child.children?.length ?? 0) > 0 && (
                                        <div className="space-y-0.5 pt-1.5 border-t border-gray-100">
                                          {child.children?.slice(0, 3).map(c3 => (
                                            <Link
                                              key={c3.id}
                                              to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${c3.id}`}
                                              className="flex items-center space-x-1.5 text-xs text-gray-600 hover:text-amber-600 transition-colors py-1 px-1.5 rounded hover:bg-amber-50 group/item"
                                            >
                                              <div className="w-1 h-1 bg-amber-400 rounded-full opacity-60"></div>
                                              <span className="truncate flex-1">{c3.name}</span>
                                              <svg className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                            </Link>
                                          ))}
                                          {(child.children?.length ?? 0) > 3 && (
                                            <Link
                                              to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${child.id}`}
                                              className="block text-xs text-amber-600 hover:text-amber-700 font-medium mt-1 pl-3 hover:underline transition-colors py-0.5"
                                            >
                                              +{(child.children?.length ?? 0) - 3} khác →
                                            </Link>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* SLIDER - positioned behind the category menu */}
      <div className="h-full relative">
        {/* component Slider ở đây */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.bgColor}`}
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Moving Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    x: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ],
                    y: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Content Container - đã điều chỉnh vị trí */}
        <div className="relative h-full flex items-center overflow-hidden pl-72">
          <div className="container mx-auto px-4 z-10 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl"
              >
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  dangerouslySetInnerHTML={{
                    __html: currentSlideData.title.replace(
                      /<span>(.*?)<\/span>/g,
                      '<span class="text-amber-400">$1</span>'
                    )
                  }}
                />

                <motion.p
                  className="text-gray-300 text-xl mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {currentSlideData.description}
                </motion.p>

                {/* Scroll Down Indicator */}
                <motion.div
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => {
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <div className="text-white text-sm font-medium text-center mb-2">Khám phá</div>
                  <div className="w-6 h-10 border-2 border-white rounded-full mx-auto flex justify-center">
                    <motion.div
                      className="w-1 h-2 bg-white rounded-full mt-2"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image Slider - đã điều chỉnh vị trí */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="absolute right-0 bottom-0 w-[40%] h-full"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="h-full w-full bg-contain bg-no-repeat bg-right-bottom opacity-90"
                style={{ backgroundImage: `url('${currentSlideData.image}')` }}
              />

              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-30" />

              {/* Floating Elements */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-amber-400/20 rounded-full mix-blend-screen"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute top-1/2 right-1/3 w-8 h-8 md:w-12 md:h-12 bg-blue-500/20 rounded-full mix-blend-screen"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, 30, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - đã điều chỉnh vị trí */}
        <motion.button
          className="absolute left-[calc(72px+1rem)] top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-lg z-20"
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-lg z-20"
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Navigation Dots - đã điều chỉnh vị trí */}
        <div className="absolute bottom-4 left-[calc(50%+36px)] transform -translate-x-1/2 flex space-x-3 z-20">
          {sliderData.map((_, index) => (
            <motion.button
              key={index}
              className={`w-4 h-4 rounded-full ${currentSlide === index ? 'bg-amber-400' : 'bg-white/50 hover:bg-white/70'} shadow-md`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              animate={{
                scale: currentSlide === index ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: currentSlide === index ? 1.5 : 0.3,
                repeat: currentSlide === index ? Infinity : 0
              }}
            />
          ))}
        </div>

        {/* Animated Progress Bar - đã điều chỉnh vị trí */}
        <div className="absolute bottom-0 left-72 right-0 h-1 bg-white/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`progress-${currentSlide}`}
              className="h-full bg-amber-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              exit={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </AnimatePresence>
        </div>
      </div>
      {/* Custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
        
        /* Hover effect for category items */
        .category-item-hover {
          transition: all 0.3s ease;
        }
        .category-item-hover:hover {
          transform: translateX(5px);
        }
      `}</style>
    </section>
  );
};

export default Banner;