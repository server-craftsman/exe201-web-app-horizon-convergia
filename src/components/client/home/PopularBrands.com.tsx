import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { useCategory } from '@hooks/modules/useCategory';
import { ROUTER_URL } from '@consts/router.path.const';

const PopularBrands: React.FC = () => {
  const { getCategorys } = useCategory();
  const [brands, setBrands] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const { data } = await getCategorys.mutateAsync();
        setBrands(data || []);
      } catch (error) {
        console.error('Fetch brands error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 relative">
          <span className="relative z-10">DANH MỤC NỔI BẬT</span>
          <span className="absolute w-20 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2"></span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.id}
                to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${brand.id}`}
                className="flex flex-col items-center group"
              >
                <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center p-2 mb-3 border border-gray-200 group-hover:border-amber-400 group-hover:shadow-amber-200/50 transition-all duration-300 transform group-hover:scale-110">
                  {brand.imageUrl ? (
                    <img src={brand.imageUrl} alt={brand.name} className="w-14 h-14 object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularBrands; 