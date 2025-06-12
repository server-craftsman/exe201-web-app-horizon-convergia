// src/components/client/sell_motor/PricingCalculator.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data for the calculator
const brands = [
  { id: 'honda', name: 'Honda' },
  { id: 'yamaha', name: 'Yamaha' },
  { id: 'suzuki', name: 'Suzuki' },
  { id: 'kawasaki', name: 'Kawasaki' },
  { id: 'ducati', name: 'Ducati' },
  { id: 'bmw', name: 'BMW' },
  { id: 'harley', name: 'Harley-Davidson' }
];

const models = {
  honda: [
    { id: 'cbr1000rr', name: 'CBR1000RR-R Fireblade' },
    { id: 'cb650r', name: 'CB650R' },
    { id: 'africa-twin', name: 'Africa Twin' },
    { id: 'gold-wing', name: 'Gold Wing' }
  ],
  yamaha: [
    { id: 'yzf-r1', name: 'YZF-R1' },
    { id: 'mt-10', name: 'MT-10' },
    { id: 'tracer-9', name: 'Tracer 9 GT' }
  ],
  // Other brands have similar model structure
};

const years = Array.from({ length: 21 }, (_, i) => ({ value: 2023 - i, label: `${2023 - i}` }));
const mileageRanges = [
  { value: 1000, label: '< 1,000 km' },
  { value: 5000, label: '1,000 - 5,000 km' },
  { value: 10000, label: '5,000 - 10,000 km' },
  { value: 20000, label: '10,000 - 20,000 km' },
  { value: 50000, label: '20,000 - 50,000 km' },
  { value: 100000, label: '> 50,000 km' }
];

const conditions = [
  { value: 'excellent', label: 'Rất tốt' },
  { value: 'good', label: 'Tốt' },
  { value: 'fair', label: 'Khá' },
  { value: 'poor', label: 'Cần sửa chữa' }
];

const PricingCalculator: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [mileage, setMileage] = useState(5000);
  const [condition, setCondition] = useState('good');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Simplified price calculation function - in a real app, this would be more complex
  const calculatePrice = () => {
    if (!brand || !model || !year || !mileage || !condition) return null;
    
    // Base price depending on brand and model
    let basePrice = 500000000; // Example base price
    
    // Age factor (newer motorcycles cost more)
    const ageFactor = Math.pow(0.9, 2023 - year);
    
    // Mileage factor (lower mileage is better)
    const mileageFactor = 1 - (mileage / 100000);
    
    // Condition factor
    const conditionFactors = {
      excellent: 1.1,
      good: 1.0,
      fair: 0.85,
      poor: 0.7
    };
    
    // Calculate final price
    const finalPrice = basePrice * ageFactor * (mileageFactor + 0.5) * conditionFactors[condition as keyof typeof conditionFactors];
    
    return Math.round(finalPrice);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate API call delay
    setTimeout(() => {
      setEstimatedPrice(calculatePrice());
      setIsCalculating(false);
    }, 1500);
  };

  // Reset model when brand changes
  useEffect(() => {
    setModel('');
  }, [brand]);

  return (
    <section id="calculator" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Định Giá <span className="text-amber-500">Xe Máy</span> Của Bạn
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Nhận định giá nhanh chóng và chính xác dựa trên thông số thực tế của thị trường hiện tại
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Select */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                  Thương Hiệu
                </label>
                <select
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Model Select */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Chọn model</option>
                  {brand && models[brand as keyof typeof models]?.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Year Select */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                  Năm Sản Xuất
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {years.map((y) => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
              </div>

              {/* Mileage Select */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-2">
                  Số Km Đã Đi
                </label>
                <select
                  id="mileage"
                  value={mileage}
                  onChange={(e) => setMileage(parseInt(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {mileageRanges.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Condition Select */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-2">
                  Tình Trạng Xe
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {conditions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Calculate Button */}
              <div className="md:col-span-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalculate}
                  disabled={!brand || !model || isCalculating}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang Tính Toán...
                    </span>
                  ) : (
                    'Định Giá Xe'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Results */}
            {estimatedPrice !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 border-t border-gray-700 pt-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Định Giá Của Chúng Tôi</h3>
                
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-400/10 p-6 rounded-xl border border-amber-500/20">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <p className="text-gray-400 mb-2">Giá bán ước tính:</p>
                      <p className="text-3xl font-bold text-amber-400">{estimatedPrice.toLocaleString()} VND</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all">
                        Đăng Tin Ngay
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-400">
                    * Đây là giá ước tính dựa trên dữ liệu thị trường. Giá cuối cùng có thể thay đổi sau khi có sự đánh giá trực tiếp từ chuyên viên của chúng tôi.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;