import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Data types
type Brand = {
  id: number;
  name: string;
};

type PriceRange = {
  id: number;
  label: string;
  min: number;
  max: number | null;
};

type EngineType = {
  id: number;
  label: string;
};

// Sample data
const brands: Brand[] = [
  { id: 1, name: 'Honda' },
  { id: 2, name: 'Yamaha' },
  { id: 3, name: 'Kawasaki' },
  { id: 4, name: 'Suzuki' },
  { id: 5, name: 'Ducati' },
  { id: 6, name: 'BMW' },
  { id: 7, name: 'Harley-Davidson' },
  { id: 8, name: 'KTM' },
];

const priceRanges: PriceRange[] = [
  { id: 1, label: 'Dưới 50 triệu', min: 0, max: 50000000 },
  { id: 2, label: '50 - 100 triệu', min: 50000000, max: 100000000 },
  { id: 3, label: '100 - 200 triệu', min: 100000000, max: 200000000 },
  { id: 4, label: '200 - 500 triệu', min: 200000000, max: 500000000 },
  { id: 5, label: 'Trên 500 triệu', min: 500000000, max: null },
];

const engineTypes: EngineType[] = [
  { id: 1, label: '100cc - 175cc' },
  { id: 2, label: '175cc - 400cc' },
  { id: 3, label: '400cc - 750cc' },
  { id: 4, label: '750cc - 1000cc' },
  { id: 5, label: 'Trên 1000cc' },
];

interface FilterProps {
  onFilter: (filters: any) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedEngineTypes, setSelectedEngineTypes] = useState<number[]>([]);

  const handleBrandChange = (brandId: number) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceRangeChange = (rangeId: number) => {
    setSelectedPriceRange(prev => prev === rangeId ? null : rangeId);
  };

  const handleEngineTypeChange = (engineId: number) => {
    setSelectedEngineTypes(prev => 
      prev.includes(engineId)
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId]
    );
  };

  const applyFilters = () => {
    onFilter({
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      engineTypes: selectedEngineTypes
    });
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setSelectedEngineTypes([]);
    onFilter({
      brands: [],
      priceRange: null,
      engineTypes: []
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
      {/* Filter header */}
      <div 
        className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h3>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 text-gray-900 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Filter content */}
      <motion.div 
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brands */}
            <div>
              <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Thương hiệu</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {brands.map(brand => (
                  <div key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-700 rounded bg-gray-700"
                    />
                    <label htmlFor={`brand-${brand.id}`} className="ml-3 text-gray-300">
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Khoảng giá</h4>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`price-${range.id}`}
                      name="price-range"
                      checked={selectedPriceRange === range.id}
                      onChange={() => handlePriceRangeChange(range.id)}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-700 bg-gray-700"
                    />
                    <label htmlFor={`price-${range.id}`} className="ml-3 text-gray-300">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine Type */}
            <div>
              <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Phân khúc động cơ</h4>
              <div className="space-y-2">
                {engineTypes.map(engine => (
                  <div key={engine.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`engine-${engine.id}`}
                      checked={selectedEngineTypes.includes(engine.id)}
                      onChange={() => handleEngineTypeChange(engine.id)}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-700 rounded bg-gray-700"
                    />
                    <label htmlFor={`engine-${engine.id}`} className="ml-3 text-gray-300">
                      {engine.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="px-6 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-600 transition-all"
            >
              Đặt lại
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applyFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
            >
              Áp dụng
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterComponent; 