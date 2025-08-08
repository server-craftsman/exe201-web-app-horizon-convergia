import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { ROUTER_URL } from '@consts/router.path.const';

// Import ProductResponse type
import type { ProductResponse } from '../../../types/product/Product.res.type';
import { MOTORCYCLE_BRANDS, ACCESSORY_BRANDS, SPAREPART_BRANDS, ACCESSORY_MODELS, SPAREPART_MODELS, ALL_SIZE_OPTIONS, MOTORCYCLE_BRANDS_MODELS } from '@consts/productBrandsModels';
import { useVietnamAddress } from '@hooks/other/useVietnamAddress';

const COLOR_SWATCHES: { label: string; colors: [string, string] }[] = [
  { label: 'Đen', colors: ['#000000', '#000000'] },
  { label: 'Trắng', colors: ['#ffffff', '#f3f4f6'] },
  { label: 'Đỏ', colors: ['#ef4444', '#dc2626'] },
  { label: 'Xanh dương', colors: ['#3b82f6', '#1d4ed8'] },
  { label: 'Xanh lá', colors: ['#22c55e', '#16a34a'] },
  { label: 'Vàng', colors: ['#facc15', '#eab308'] },
  { label: 'Cam', colors: ['#fb923c', '#f97316'] },
  { label: 'Tím', colors: ['#a855f7', '#7c3aed'] },
  { label: 'Hồng', colors: ['#ec4899', '#db2777'] },
  { label: 'Nâu', colors: ['#92400e', '#78350f'] },
  { label: 'Be', colors: ['#f5f5dc', '#e5e7eb'] },
  { label: 'Xám', colors: ['#6b7280', '#111827'] },
  { label: 'Bạc', colors: ['#c0c0c0', '#9ca3af'] },
  { label: 'Vàng đồng', colors: ['#b45309', '#92400e'] },
  { label: 'Đen nhám', colors: ['#0f0f0f', '#1f2937'] },
  { label: 'Đen-Đỏ', colors: ['#000000', '#e11d48'] },
  { label: 'Đen-Trắng', colors: ['#000000', '#ffffff'] },
  { label: 'Đỏ-Trắng', colors: ['#ef4444', '#ffffff'] },
  { label: 'Xanh-Trắng', colors: ['#2563eb', '#ffffff'] },
  { label: 'Xám-Đen', colors: ['#6b7280', '#111827'] },
  { label: 'Bạc-Đen', colors: ['#c0c0c0', '#111827'] },
];

const COLOR_KEYWORDS: Record<string, string[]> = {
  'Đen': ['đen', 'den', 'black', 'matt black', 'đen nhám', 'den nham'],
  'Trắng': ['trắng', 'trang', 'white'],
  'Đỏ': ['đỏ', 'do', 'red'],
  'Xanh dương': ['xanh dương', 'xanh duong', 'blue'],
  'Xanh lá': ['xanh lá', 'xanh la', 'green'],
  'Vàng': ['vàng', 'vang', 'yellow'],
  'Cam': ['cam', 'orange'],
  'Tím': ['tím', 'tim', 'purple'],
  'Hồng': ['hồng', 'hong', 'pink'],
  'Nâu': ['nâu', 'nau', 'brown'],
  'Be': ['be', 'beige'],
  'Xám': ['xám', 'xam', 'gray', 'grey'],
  'Bạc': ['bạc', 'bac', 'silver'],
  'Vàng đồng': ['vàng đồng', 'vang dong', 'gold', 'bronze'],
  'Đen nhám': ['đen nhám', 'den nham', 'matt black', 'matte black'],
  'Đen-Đỏ': ['đen', 'den', 'đỏ', 'do', 'black', 'red'],
  'Đen-Trắng': ['đen', 'den', 'trắng', 'trang', 'black', 'white'],
  'Đỏ-Trắng': ['đỏ', 'do', 'trắng', 'trang', 'red', 'white'],
  'Xanh-Trắng': ['xanh', 'xanh dương', 'xanh duong', 'trắng', 'trang', 'blue', 'white'],
  'Xám-Đen': ['xám', 'xam', 'đen', 'den', 'gray', 'black'],
  'Bạc-Đen': ['bạc', 'bac', 'đen', 'den', 'silver', 'black'],
};

// Convert ProductResponse to AccessoryType for compatibility
interface AccessoryType {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  slug: string;
}

const convertToAccessoryType = (product: ProductResponse): AccessoryType => {
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
  const discountPercent = Math.floor(Math.random() * 25) + 5; // Random discount 5-30%
  const hasDiscount = Math.random() > 0.6; // 40% chance of discount

  return {
    id: product.id,
    title: `${product.brand} ${product.model}`,
    image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '',
    price: hasDiscount ? Math.floor(product.price * (1 - discountPercent / 100)) : product.price,
    originalPrice: hasDiscount ? product.price : undefined,
    discount: hasDiscount ? discountPercent : undefined,
    isNew,
    slug: `${product.brand}-${product.model}`.toLowerCase().replace(/\s+/g, '-')
  };
};

const Accessories: React.FC = () => {
  const { useProducts } = useProduct();
  const { provinces } = useVietnamAddress();

  // productGroup: 'all' | 'accessory' | 'spare'
  const [filters, setFilters] = useState<{ province?: string; brand?: string; condition?: string; colorLabels: string[]; productGroup: 'all' | 'accessory' | 'spare'; accessoryType?: string; sparePartType?: string; vehicleBrand?: string; vehicleModel?: string; size?: string }>({ colorLabels: [], productGroup: 'all' });

  const allBrands = useMemo(() => {
    const set = new Set<string>([...ACCESSORY_BRANDS, ...SPAREPART_BRANDS, ...MOTORCYCLE_BRANDS]);
    return Array.from(set);
  }, []);

  const apiFilter = useMemo(() => ({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 100, // lấy nhiều để lọc client + phân trang phía UI
    brand: filters.brand || undefined,
    location: filters.province || undefined,
    condition: filters.condition || undefined,
    color: filters.colorLabels[0] || undefined,
    accessoryType: filters.productGroup !== 'spare' ? (filters.accessoryType || undefined) : undefined,
    sparePartType: filters.productGroup !== 'accessory' ? (filters.sparePartType || undefined) : undefined,
    vehicleCompatible: filters.vehicleBrand && filters.vehicleModel ? `${filters.vehicleBrand} ${filters.vehicleModel}` : undefined,
    size: filters.size || undefined,
  }), [filters]);

  // Fetch products from API
  const { data: products = [], isLoading, error } = useProducts(apiFilter);

  const shortLocation = (full?: string) => {
    if (!full) return '';
    const parts = full.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : full;
  };

  // Include both accessories and spare parts; refine by productGroup if chosen
  const productsRaw = products.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4) &&
    (product.accessoryType || product.sparePartType)
  );

  const refined = productsRaw.filter(p => {
    if (filters.productGroup === 'accessory' && !p.accessoryType) return false;
    if (filters.productGroup === 'spare' && !p.sparePartType) return false;
    if (filters.colorLabels.length > 0) {
      const prodColor = (p.color || '').toLowerCase();
      const ok = filters.colorLabels.some(lbl => prodColor.includes(lbl.toLowerCase()) || COLOR_KEYWORDS[lbl]?.some(kw => prodColor.includes(kw)));
      if (!ok) return false;
    }
    if (filters.vehicleBrand && filters.vehicleModel) {
      const v = (p as any).vehicleCompatible as string | undefined;
      const expect = `${filters.vehicleBrand} ${filters.vehicleModel}`.toLowerCase();
      if (!v || !v.toLowerCase().includes(expect)) return false;
    }
    if (filters.size) {
      const s = (p as any).size as string | undefined;
      if (!s || !s.toLowerCase().includes(filters.size.toLowerCase())) return false;
    }
    if (filters.accessoryType && p.accessoryType) {
      if (!p.accessoryType.toLowerCase().includes(filters.accessoryType.toLowerCase())) return false;
    }
    if (filters.sparePartType && p.sparePartType) {
      if (!p.sparePartType.toLowerCase().includes(filters.sparePartType.toLowerCase())) return false;
    }
    if (filters.province && shortLocation(p.location) !== filters.province) return false;
    if (filters.condition && (p.condition || '').toLowerCase() !== filters.condition.toLowerCase()) return false;
    return true;
  });

  // Pagination (client-side)
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(refined.length / pageSize));
  const currentItems = refined.slice((page - 1) * pageSize, page * pageSize);

  const accessories = currentItems.map(convertToAccessoryType);

  const chips = useMemo(() => {
    const xs: string[] = [];
    if (filters.productGroup !== 'all') xs.push(filters.productGroup === 'accessory' ? 'Phụ kiện' : 'Phụ tùng');
    if (filters.province) xs.push(filters.province);
    if (filters.brand) xs.push(filters.brand);
    if (filters.condition) xs.push(filters.condition);
    if (filters.colorLabels.length) xs.push(`Màu: ${filters.colorLabels.join(', ')}`);
    if (filters.vehicleBrand && filters.vehicleModel) xs.push(`Xe: ${filters.vehicleBrand} ${filters.vehicleModel}`);
    if (filters.size) xs.push(`Size: ${filters.size}`);
    if (filters.accessoryType) xs.push(`Loại PK: ${filters.accessoryType}`);
    if (filters.sparePartType) xs.push(`Loại PT: ${filters.sparePartType}`);
    return xs;
  }, [filters]);

  const vehicleModels = useMemo(() => {
    if (!filters.vehicleBrand) return [] as string[];
    return MOTORCYCLE_BRANDS_MODELS[filters.vehicleBrand] || [];
  }, [filters.vehicleBrand]);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600">Có lỗi xảy ra khi tải sản phẩm</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            Phụ kiện & Phụ tùng nổi bật
          </h2>
          <Link to={ROUTER_URL.CLIENT.ACCESSORIES} className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </Link>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar filter */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="px-5 py-4 bg-gradient-to-r from-gray-800 to-amber-600 text-white font-semibold flex items-center justify-between">
                <span>Bộ lọc</span>
                <button onClick={() => { setFilters({ colorLabels: [], productGroup: 'all' }); setPage(1); }} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">Xóa</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Loại hàng</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.productGroup} onChange={(e) => { setFilters(f => ({ ...f, productGroup: e.target.value as any })); setPage(1); }}>
                    <option value="all">Tất cả</option>
                    <option value="accessory">Phụ kiện</option>
                    <option value="spare">Phụ tùng</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tỉnh/Thành</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.province || ''} onChange={(e) => { setFilters(f => ({ ...f, province: e.target.value || undefined })); setPage(1); }}>
                    <option value="">Tất cả</option>
                    {(provinces.data || []).map((p: any) => (<option key={p.code} value={p.name}>{p.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Thương hiệu</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.brand || ''} onChange={(e) => { setFilters(f => ({ ...f, brand: e.target.value || undefined })); setPage(1); }}>
                    <option value="">Tất cả</option>
                    {allBrands.map(b => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
                {filters.productGroup !== 'spare' && (
                  <div>
                    <label className="text-xs text-gray-500">Loại phụ kiện</label>
                    <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.accessoryType || ''} onChange={(e) => { setFilters(f => ({ ...f, accessoryType: e.target.value || undefined })); setPage(1); }}>
                      <option value="">Tất cả</option>
                      {ACCESSORY_MODELS.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                )}
                {filters.productGroup !== 'accessory' && (
                  <div>
                    <label className="text-xs text-gray-500">Loại phụ tùng</label>
                    <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.sparePartType || ''} onChange={(e) => { setFilters(f => ({ ...f, sparePartType: e.target.value || undefined })); setPage(1); }}>
                      <option value="">Tất cả</option>
                      {SPAREPART_MODELS.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Hãng xe</label>
                    <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.vehicleBrand || ''} onChange={(e) => { setFilters(f => ({ ...f, vehicleBrand: e.target.value || undefined, vehicleModel: undefined })); setPage(1); }}>
                      <option value="">Tất cả</option>
                      {MOTORCYCLE_BRANDS.map(b => (<option key={b} value={b}>{b}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Model</label>
                    <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.vehicleModel || ''} onChange={(e) => { setFilters(f => ({ ...f, vehicleModel: e.target.value || undefined })); setPage(1); }} disabled={!filters.vehicleBrand}>
                      <option value="">Tất cả</option>
                      {vehicleModels.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Kích cỡ/Size</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.size || ''} onChange={(e) => { setFilters(f => ({ ...f, size: e.target.value || undefined })); setPage(1); }}>
                    <option value="">Tất cả</option>
                    {ALL_SIZE_OPTIONS.flatMap(group => group.options.map(opt => ({ label: `${opt.label}`, value: opt.value }))).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tình trạng</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.condition || ''} onChange={(e) => { setFilters(f => ({ ...f, condition: e.target.value || undefined })); setPage(1); }}>
                    <option value="">Tất cả</option>
                    {['Mới', 'Đã qua sử dụng', 'Like New'].map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Màu sắc</label>
                    {filters.colorLabels.length > 0 && (<span className="text-[11px] text-amber-700">{filters.colorLabels.join(' , ')}</span>)}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_SWATCHES.map(s => (
                      <button key={s.label} type="button" onClick={() => { setFilters(f => ({ ...f, colorLabels: f.colorLabels.includes(s.label) ? f.colorLabels.filter(x => x !== s.label) : [...f.colorLabels, s.label] })); setPage(1); }} className={`relative w-8 h-8 rounded-full border-2 ${filters.colorLabels.includes(s.label) ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-300'}`} aria-label={s.label} title={s.label}>
                        <span className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${s.colors[0]} 50%, ${s.colors[1]} 50%)` }} />
                      </button>
                    ))}
                  </div>
                </div>

                {chips.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-2">Đang áp dụng:</div>
                    <div className="flex flex-wrap gap-2">
                      {chips.map((chip, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{chip}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="lg:col-span-9">
            {accessories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {accessories.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-500 group flex flex-col h-full">
                      <div className="relative h-48">
                        <img src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
                        {item.discount && (<div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{item.discount}%</div>)}
                        {item.isNew && !item.discount && (<div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">Mới</div>)}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">{item.title}</h3>
                        <div className="flex-grow">
                          <p className="text-amber-600 font-bold text-xl mb-1">{item.price.toLocaleString('vi-VN')} ₫</p>
                          {item.originalPrice && (<p className="text-gray-400 text-sm line-through mb-3">{item.originalPrice.toLocaleString('vi-VN')} ₫</p>)}
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gray-800 hover:bg-amber-500 text-white font-medium py-2 rounded-lg transition-colors duration-300 mt-auto">Thêm vào giỏ</motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button className="px-3 py-1 rounded border text-sm hover:bg-gray-50 disabled:opacity-50" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Trước</button>
                  <span className="text-sm">Trang {page}/{totalPages}</span>
                  <button className="px-3 py-1 rounded border text-sm hover:bg-gray-50 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Sau</button>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accessories; 