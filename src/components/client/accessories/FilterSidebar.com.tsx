// src/components/client/accessories/FilterSidebar.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, onFilter }) => {
  // Filter state
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  
  // Sample filter data
  const brands = [
    { id: 'shoei', name: 'Shoei' },
    { id: 'agv', name: 'AGV' },
    { id: 'alpinestars', name: 'Alpinestars' },
    { id: 'dainese', name: 'Dainese' },
    { id: 'akrapovic', name: 'Akrapovic' },
    { id: 'pirelli', name: 'Pirelli' },
    { id: 'michelin', name: 'Michelin' },
    { id: 'gopro', name: 'GoPro' }
  ];
  
  const categories = [
    { id: 'helmet', name: 'Mũ Bảo Hiểm' },
    { id: 'gloves', name: 'Găng Tay' },
    { id: 'jacket', name: 'Áo Giáp' },
    { id: 'exhaust', name: 'Ống Xả' },
    { id: 'electronics', name: 'Phụ Kiện Điện Tử' },
    { id: 'tire', name: 'Lốp & Vành' },
    { id: 'boots', name: 'Giày Mô Tô' },
    { id: 'luggage', name: 'Túi Đồ' }
  ];
  
  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = newValue;
      return newRange;
    });
  };
  
  const handleRatingSelect = (value: number) => {
    setRating(prev => prev === value ? null : value);
  };
  
  const applyFilters = () => {
    onFilter({
      priceRange,
      brands: selectedBrands,
      categories: selectedCategories,
      rating
    });
    
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  
  const resetFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setRating(null);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-full w-80 bg-gray-800 z-50 shadow-xl overflow-y-auto lg:sticky lg:top-20 lg:h-screen lg:transform-none"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Bộ Lọc</h3>
            <button 
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">Khoảng Giá</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])}</span>
                <span className="text-gray-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}</span>
              </div>
              
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full accent-amber-500"
                />
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">Danh Mục</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-700 rounded bg-gray-700"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-3 text-gray-300 cursor-pointer">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Brands */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">Thương Hiệu</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {brands.map(brand => (
                <div key={brand.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                    className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-700 rounded bg-gray-700"
                  />
                  <label htmlFor={`brand-${brand.id}`} className="ml-3 text-gray-300 cursor-pointer">
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ratings */}
          <div className="mb-8">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">Đánh Giá</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => (
                <div 
                  key={star}
                  onClick={() => handleRatingSelect(star)}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${rating === star ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                >
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`h-5 w-5 ${i < star ? 'text-amber-400' : 'text-gray-600'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-300">& Trở Lên</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className="w-1/2 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Đặt Lại
            </button>
            <button
              onClick={applyFilters}
              className="w-1/2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all"
            >
              Áp Dụng
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;