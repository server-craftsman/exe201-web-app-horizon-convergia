import React from 'react';
import { Link } from 'react-router-dom';
import { useUserInfo } from '@hooks/index';
import { useProduct } from '@hooks/modules/useProduct';
import { ProductService } from '@services/product/product.service';
import { useCartStore } from '@hooks/modules/useCartStore';
import { notificationMessage } from '@utils/helper';
import { ROUTER_URL } from '@consts/router.path.const';

const Favorite: React.FC = () => {
  const user = useUserInfo();
  const { useFavorites } = useProduct();
  const { data: favorites = [], isLoading, refetch } = useFavorites(user?.id || '');
  const { addItem } = useCartStore();

  const remove = async (productId: string, name: string) => {
    if (!user?.id) { notificationMessage('Vui lòng đăng nhập', 'warning'); return; }
    try {
      await ProductService.removeFavorite(productId, user.id);
      notificationMessage(`Đã bỏ yêu thích: ${name}`, 'success');
      refetch();
    } catch (e: any) {
      notificationMessage(e?.message || 'Không thể bỏ yêu thích', 'error');
    }
  };

  if (!user?.id) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center text-gray-600">Vui lòng đăng nhập để xem danh sách yêu thích</div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
          <Link to={ROUTER_URL.COMMON.HOME} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Về trang chủ</Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Đang tải...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.187 25.18 25.18 0 01-4.244-2.62C4.688 16.182 2.25 13.555 2.25 10.5 2.25 7.462 4.714 5 7.75 5a5.5 5.5 0 013.9 1.64A5.5 5.5 0 0115.55 5c3.036 0 5.5 2.462 5.5 5.5 0 3.055-2.438 5.682-4.739 7.59a25.175 25.175 0 01-4.244 2.62 15.247 15.247 0 01-.383.187l-.022.01-.007.003a.75.75 0 01-.61 0z" /></svg>
            </div>
            <p className="text-gray-600">Chưa có sản phẩm nào trong danh sách yêu thích</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-2xl hover:border-amber-200 transition-all duration-500">
                <Link to={ROUTER_URL.CLIENT.PRODUCT_DETAIL.replace(':id', p.id)} className="block">
                  <div className="relative h-48">
                    <img src={(p.imageUrls && p.imageUrls[0]) || 'https://via.placeholder.com/300x200?text=No+Image'} alt={`${p.brand} ${p.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
                    <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">{p.year}</div>
                    <div className="absolute top-3 left-3 bg-rose-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">Yêu thích</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 truncate">{p.brand} {p.model}</h3>
                    <p className="text-amber-600 font-bold text-xl mb-3">{p.price.toLocaleString('vi-VN')} ₫</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 truncate max-w-[60%]">{p.location?.split(',').slice(-1)[0]}</span>
                      {p.condition && (<span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{p.condition}</span>)}
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                  <button onClick={() => remove(p.id, `${p.brand} ${p.model}`)} className="text-sm border border-gray-300 hover:bg-gray-50 rounded-lg py-2 font-medium">Bỏ yêu thích</button>
                  <button onClick={() => addItem(user.id!, p.id, 1, `${p.brand} ${p.model}`)} className="text-sm bg-gray-900 hover:bg-amber-600 text-white rounded-lg py-2 font-medium">Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorite;
