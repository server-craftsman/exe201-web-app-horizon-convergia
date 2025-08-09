// src/components/client/sell_motor/PricingCalculator.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductService } from '@services/product/product.service';
import { useUserInfo } from '@hooks/index';
import { notificationMessage } from '@utils/helper';
import { MOTORCYCLE_BRANDS, MOTORCYCLE_BRANDS_MODELS } from '@consts/productBrandsModels';

// Dữ liệu thương hiệu & model lấy từ @productBrandsModels.ts
// MOTORCYCLE_BRANDS: string[]; MOTORCYCLE_BRANDS_MODELS: Record<string, string[]>

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => ({ value: currentYear - i, label: `${currentYear - i}` }));
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
  const user = useUserInfo();
  const [brand, setBrand] = useState(''); // tên brand như 'Honda', 'Yamaha', ...
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [mileage, setMileage] = useState<number | null>(null);
  const [condition, setCondition] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // AI states
  const [aiImage, setAiImage] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<{ suggestionTitle?: string; suggestionDescription?: string; estimatedPrice?: number; tags?: string[]; reasoning?: string } | null>(null);

  // Reset model when brand changes
  useEffect(() => {
    setModel('');
  }, [brand]);

  const buildDescription = () => {
    const mil = mileageRanges.find(m => m.value === mileage)?.label || '';
    const condLabel = conditions.find(c => c.value === condition)?.label || '';
    return [
      `Thương hiệu: ${brand}`,
      `Model: ${model}`,
      `Năm: ${year ?? ''}`,
      `Số km: ${mil}`,
      `Tình trạng: ${condLabel}`
    ].filter(Boolean).join(' | ');
  };

  const handleCalculate = async () => {
    // Validate required fields and show which ones missing
    const missing: string[] = [];
    if (!brand) missing.push('Thương hiệu');
    if (!model) missing.push('Model');
    if (!year) missing.push('Năm');
    if (!mileage) missing.push('Số km');
    if (!condition) missing.push('Tình trạng');

    if (missing.length > 0) {
      notificationMessage(`Bạn chưa nhập: ${missing.join(', ')}`, 'warning');
      return;
    }

    try {
      setIsCalculating(true);

      // AI analyze with combined description
      const description = buildDescription();
      const resp = await ProductService.analyzeProductWithAI({
        image: aiImage,
        description,
        userId: user?.id || undefined,
      });
      const payload = (resp as any)?.data;
      const data = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;
      setAiResult(data || null);
      if (!data) notificationMessage('AI không trả về dữ liệu gợi ý', 'warning');
    } catch (e: any) {
      notificationMessage(e?.message || 'Không thể định giá', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

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
                  {MOTORCYCLE_BRANDS.map((name) => (
                    <option key={name} value={name}>{name}</option>
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
                  {brand && (MOTORCYCLE_BRANDS_MODELS[brand] || []).map((m) => (
                    <option key={m} value={m}>{m}</option>
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
                  value={year ?? ''}
                  onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Chọn năm</option>
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
                  value={mileage ?? ''}
                  onChange={(e) => setMileage(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Chọn số km</option>
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
                  <option value="">Chọn tình trạng</option>
                  {conditions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Image upload for AI (optional) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Ảnh sản phẩm (tùy chọn)</label>
                <input type="file" accept="image/*" onChange={(e) => setAiImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-900 hover:file:bg-amber-400" />
              </div>

              {/* Calculate Button */}
              <div className="md:col-span-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang Định Giá...
                    </span>
                  ) : (
                    'Định Giá Xe'
                  )}
                </motion.button>
              </div>
            </div>

            {/* Results */}
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 border-t border-gray-700 pt-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Kết quả gợi ý</h3>
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
                  {aiResult.suggestionTitle && (<div className="mb-3"><div className="text-sm text-gray-400">Tiêu đề (AI)</div><div className="text-white font-semibold">{aiResult.suggestionTitle}</div></div>)}
                  {aiResult.estimatedPrice !== undefined && (<div className="mb-3"><div className="text-sm text-gray-400">Giá ước tính (AI)</div><div className="text-amber-400 font-bold text-xl">{aiResult.estimatedPrice.toLocaleString()} VND</div></div>)}
                  {aiResult.suggestionDescription && (<div className="mb-3"><div className="text-sm text-gray-400">Mô tả (AI)</div><div className="text-gray-300 whitespace-pre-wrap">{aiResult.suggestionDescription}</div></div>)}
                  {aiResult.tags && aiResult.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aiResult.tags.map((t, i) => (<span key={i} className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">#{t}</span>))}
                    </div>
                  )}
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