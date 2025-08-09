import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@hooks/modules/useProduct';
import { ROUTER_URL } from '@consts/router.path.const';
import { MOTORCYCLE_BRANDS } from '@consts/productBrandsModels';
import { useVietnamAddress } from '@hooks/other/useVietnamAddress';
import { useCartStore } from '@hooks/modules/useCartStore';
import { useUserInfo } from '@hooks/index';
import { ProductService } from '@services/product/product.service';
import { notificationMessage } from '@utils/helper';

const NEW_BADGE_HOURS = 72; // cấu hình: hiển thị "Mới đăng" trong 72 giờ từ createdAt

// Engine capacity options (cc)
const ENGINE_CAP_OPTIONS = [50, 110, 125, 150, 155, 160, 175, 250, 300, 350, 400, 500, 600, 650, 750, 1000];

// Color swatches (label + colors for swatch rendering)
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
  // Hai tông phổ biến
  { label: 'Đen, Đỏ', colors: ['#000000', '#e11d48'] },
  { label: 'Đen, Trắng', colors: ['#000000', '#ffffff'] },
  { label: 'Đỏ, Trắng', colors: ['#ef4444', '#ffffff'] },
  { label: 'Xanh, Trắng', colors: ['#2563eb', '#ffffff'] },
  { label: 'Xám, Đen', colors: ['#6b7280', '#111827'] },
  { label: 'Bạc, Đen', colors: ['#c0c0c0', '#111827'] },
];

// Tập từ khóa giúp khớp nhiều biến thể màu sắc (không dấu/tiếng Anh)
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
  'Đen, Đỏ': ['đen', 'den', 'đỏ', 'do', 'black', 'red'],
  'Đen, Trắng': ['đen', 'den', 'trắng', 'trang', 'black', 'white'],
  'Đỏ, Trắng': ['đỏ', 'do', 'trắng', 'trang', 'red', 'white'],
  'Xanh, Trắng': ['xanh', 'xanh dương', 'xanh duong', 'trắng', 'trang', 'blue', 'white'],
  'Xám, Đen': ['xám', 'xam', 'đen', 'den', 'gray', 'black'],
  'Bạc, Đen': ['bạc', 'bac', 'đen', 'den', 'silver', 'black'],
};

const NewListings: React.FC = () => {
  const { useProducts } = useProduct();
  const { provinces } = useVietnamAddress();

  // local filter state
  const [filters, setFilters] = useState<{ province?: string; brand?: string; minYear?: string; maxMileage?: string; condition?: string; colorLabels: string[]; engineCapacity?: number }>({ colorLabels: [] });
  const [page, setPage] = useState(1);

  const apiFilter = useMemo(() => ({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 8,
    brand: filters.brand || undefined,
    location: filters.province || undefined,
    condition: filters.condition || undefined,
    color: filters.colorLabels[0] || undefined,
    year: filters.minYear ? Number(filters.minYear) : undefined,
    mileage: filters.maxMileage ? Number(filters.maxMileage) : undefined,
    engineCapacity: typeof filters.engineCapacity === 'number' ? filters.engineCapacity : undefined,
  }), [filters]);

  // Fetch latest products
  const { data: products = [], isLoading, error } = useProducts(apiFilter);
  const { addItem } = useCartStore();
  const user = useUserInfo();

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.id) { setFavoriteIds(new Set()); return; }
        const resp = await ProductService.getFavorites(user.id);
        const list = (resp as any)?.data || [];
        if (mounted) setFavoriteIds(new Set(list.map((p: any) => p.id)));
      } catch (e: any) {
        // ignore silently
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const toggleFavorite = async (productId: string, name: string) => {
    try {
      if (!user?.id) { notificationMessage('Vui lòng đăng nhập để yêu thích', 'warning'); return; }
      const isFav = favoriteIds.has(productId);
      if (isFav) {
        await ProductService.removeFavorite(productId, user.id);
        setFavoriteIds(prev => { const ns = new Set(prev); ns.delete(productId); return ns; });
        notificationMessage(`Đã bỏ yêu thích: ${name}`, 'success');
      } else {
        await ProductService.addFavorite(productId, user.id);
        setFavoriteIds(prev => new Set([...prev, productId]));
        notificationMessage(`Đã thêm vào yêu thích: ${name}`, 'success');
      }
    } catch (e: any) {
      notificationMessage(e?.message || 'Lỗi thao tác yêu thích', 'error');
    }
  };

  // helpers
  const shortLocation = (full?: string) => {
    if (!full) return '';
    const parts = full.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : full;
  };

  const isNew = (createdAt?: string | Date) => {
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    const diffHours = (Date.now() - created) / (1000 * 60 * 60);
    return diffHours <= NEW_BADGE_HOURS;
  };

  // Phát hiện sản phẩm phụ kiện/phụ tùng dựa trên tên danh mục/tiêu đề
  const isAccessoryLike = (p: any): boolean => {
    const haystack = `${p.categoryName || ''} ${p.category?.name || ''} ${p.title || ''}`.toLowerCase();
    const keys = ['phụ kiện', 'phu kien', 'phụ tùng', 'phu tung', 'accessory', 'spare'];
    return keys.some(k => haystack.includes(k));
  };

  // server base + client refine
  const activeProductsBase = products.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4) &&
    !(product as any).accessoryType && !(product as any).sparePartType && !isAccessoryLike(product)
  );

  const activeProducts = activeProductsBase.filter(p => {
    if (filters.province && shortLocation(p.location) !== filters.province) return false;
    if (filters.maxMileage) {
      const m = (p as any).mileage as number | undefined;
      if (typeof m === 'number' && m > Number(filters.maxMileage)) return false;
    }
    if (filters.minYear) {
      const y = (p as any).year as number | undefined;
      if (typeof y === 'number' && y < Number(filters.minYear)) return false;
    }
    if (typeof filters.engineCapacity === 'number') {
      const ec = (p as any).engineCapacity as number | undefined;
      if (typeof ec === 'number' && ec !== filters.engineCapacity) return false;
    }
    if (filters.condition && (p.condition || '').toLowerCase() !== filters.condition.toLowerCase()) return false;
    if (filters.colorLabels.length > 0) {
      const prodColor = (p.color || '').toLowerCase();
      const ok = filters.colorLabels.some(lbl => prodColor.includes(lbl.toLowerCase()) || COLOR_KEYWORDS[lbl]?.some(kw => prodColor.includes(kw)));
      if (!ok) return false;
    }
    return true;
  });

  // Phân trang client-side
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(activeProducts.length / pageSize));
  const pagedProducts = activeProducts.slice((page - 1) * pageSize, page * pageSize);

  // Reset về trang 1 khi thay đổi filter
  useEffect(() => { setPage(1); }, [filters]);

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.province) chips.push(filters.province);
    if (filters.brand) chips.push(filters.brand);
    if (filters.maxMileage) chips.push(`≤ ${Number(filters.maxMileage).toLocaleString()} km`);
    if (filters.minYear) chips.push(`≥ năm ${filters.minYear}`);
    if (typeof filters.engineCapacity === 'number') chips.push(`${filters.engineCapacity}cc`);
    if (filters.condition) chips.push(filters.condition);
    if (filters.colorLabels.length) chips.push(`Màu: ${filters.colorLabels.join(', ')}`);
    return chips;
  }, [filters]);

  const toggleColor = (label: string) => {
    setFilters(f => {
      const exists = f.colorLabels.includes(label);
      const colorLabels = exists ? f.colorLabels.filter(x => x !== label) : [...f.colorLabels, label];
      return { ...f, colorLabels };
    });
  };

  if (error) console.error('Error fetching products:', error);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">XE MỚI ĐĂNG</h2>
          <Link to={ROUTER_URL.CLIENT.BUY_MOTOR} className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </Link>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar filter */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold flex items-center justify-between">
                <span>Bộ lọc</span>
                <button onClick={() => { setFilters({ colorLabels: [] }); setPage(1); }} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">Xóa</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Tỉnh/Thành</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.province || ''} onChange={(e) => setFilters(f => ({ ...f, province: e.target.value || undefined }))}>
                    <option value="">Tất cả</option>
                    {(provinces.data || []).map((p: any) => (<option key={p.code} value={p.name}>{p.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Thương hiệu</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.brand || ''} onChange={(e) => setFilters(f => ({ ...f, brand: e.target.value || undefined }))}>
                    <option value="">Tất cả</option>
                    {MOTORCYCLE_BRANDS.map(b => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Năm từ</label>
                    <input className="mt-1 w-full border rounded-lg p-2 text-sm" placeholder="2018" type="number" min={1990} max={new Date().getFullYear()} value={filters.minYear || ''} onChange={(e) => setFilters(f => ({ ...f, minYear: e.target.value || undefined }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Tối đa Km</label>
                    <input className="mt-1 w-full border rounded-lg p-2 text-sm" placeholder="30000" type="number" min={0} value={filters.maxMileage || ''} onChange={(e) => setFilters(f => ({ ...f, maxMileage: e.target.value || undefined }))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Dung tích xi-lanh (cc)</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={typeof filters.engineCapacity === 'number' ? filters.engineCapacity : ''} onChange={(e) => setFilters(f => ({ ...f, engineCapacity: e.target.value ? Number(e.target.value) : undefined }))}>
                    <option value="">Tất cả</option>
                    {ENGINE_CAP_OPTIONS.map(cc => (<option key={cc} value={cc}>{cc}cc</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tình trạng</label>
                  <select className="mt-1 w-full border rounded-lg p-2 text-sm" value={filters.condition || ''} onChange={(e) => setFilters(f => ({ ...f, condition: e.target.value || undefined }))}>
                    <option value="">Tất cả</option>
                    {['Mới', 'Đã qua sử dụng', 'Like New'].map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Màu sắc</label>
                    {filters.colorLabels.length > 0 && (
                      <span className="text-[11px] text-amber-700">{filters.colorLabels.join(' , ')}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_SWATCHES.map(s => (
                      <button key={s.label} type="button" onClick={() => toggleColor(s.label)} className={`relative w-8 h-8 rounded-full border-2 ${filters.colorLabels.includes(s.label) ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-300'}`} aria-label={s.label} title={s.label}>
                        <span className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${s.colors[0]} 50%, ${s.colors[1]} 50%)` }} />
                      </button>
                    ))}
                  </div>
                </div>

                {activeChips.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-2">Đang áp dụng:</div>
                    <div className="flex flex-wrap gap-2">
                      {activeChips.map((chip, idx) => (
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
            {isLoading ? (
              <div className="text-center py-12"><p className="text-gray-600">Đang tải sản phẩm...</p></div>
            ) : activeProducts.length === 0 ? (
              <div className="text-center py-12"><p className="text-gray-600">Không tìm thấy sản phẩm phù hợp.</p></div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-2xl hover:border-amber-200 transition-all duration-500">
                      <Link to={ROUTER_URL.CLIENT.PRODUCT_DETAIL.replace(':id', product.id)} className="block">
                        <div className="relative h-48">
                          <img src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://via.placeholder.com/300x200?text=No+Image'} alt={`${product.brand} ${product.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
                          <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">{product.year}</div>
                          {isNew(product.createdAt) && (<div className="absolute top-3 left-3 bg-amber-400/90 text-white text-xs font-bold px-2 py-1 rounded-full">Mới đăng</div>)}
                          {favoriteIds.has(product.id) && (
                            <div className="absolute bottom-3 left-3 bg-rose-500/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">Đã thích</div>
                          )}
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id, `${product.brand} ${product.model}`); }} className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${favoriteIds.has(product.id) ? 'text-rose-600' : 'text-gray-400'}`}>
                              <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.187 25.18 25.18 0 01-4.244-2.62C4.688 16.182 2.25 13.555 2.25 10.5 2.25 7.462 4.714 5 7.75 5a5.5 5.5 0 013.9 1.64A5.5 5.5 0 0115.55 5c3.036 0 5.5 2.462 5.5 5.5 0 3.055-2.438 5.682-4.739 7.59a25.175 25.175 0 01-4.244 2.62 15.247 15.247 0 01-.383.187l-.022.01-.007.003a.75.75 0 01-.61 0z" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 truncate">{product.brand} {product.model}</h3>
                          <p className="text-amber-600 font-bold text-xl mb-3">{product.price.toLocaleString('vi-VN')} ₫</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 truncate max-w-[60%]">{shortLocation(product.location)}</span>
                            {product.condition && (<span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{product.condition}</span>)}
                          </div>
                        </div>
                      </Link>
                      <div className="px-5 pb-4">
                        <button onClick={() => user?.id && addItem(user.id, product.id, 1, `${product.brand} ${product.model}`)} className="w-full text-sm bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-2 font-medium">Thêm vào giỏ</button>
                      </div>
                    </div>
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

export default NewListings; 