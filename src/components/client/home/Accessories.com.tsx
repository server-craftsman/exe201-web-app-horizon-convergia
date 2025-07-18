import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { ROUTER_URL } from '@consts/router.path.const';

// Import ProductResponse type
import type { ProductResponse } from '../../../types/product/Product.res.type';

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

  // Fetch products from API
  const { data: products = [], isLoading, error } = useProducts({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 8
  });

  // Filter for accessory products first, fallback to regular products if no accessories
  const accessoryProducts = products.filter(product =>
    product.isVerified &&
    (product.status === 0 || product.status === 3 || product.status === 4) &&
    product.accessoryType // Only accessories
  );

  // If no accessories found, use regular products as fallback
  const displayProducts = accessoryProducts.length > 0
    ? accessoryProducts.slice(0, 4)
    : products
      .filter(product =>
        product.isVerified &&
        (product.status === 0 || product.status === 3 || product.status === 4)
      )
      .slice(0, 4);

  const accessories = displayProducts.map(convertToAccessoryType);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải phụ kiện...</p>
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
            <p className="text-red-600">Có lỗi xảy ra khi tải phụ kiện</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            {accessoryProducts.length > 0 ? 'Phụ Kiện Cao Cấp' : 'Sản Phẩm Nổi Bật'}
          </h2>
          <Link to={ROUTER_URL.CLIENT.ACCESSORIES} className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {accessories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có sản phẩm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {accessories.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-500 group flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {item.discount && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{item.discount}%
                    </div>
                  )}
                  {item.isNew && !item.discount && (
                    <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Mới
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex-grow">
                    <p className="text-amber-600 font-bold text-xl mb-1">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </p>
                    {item.originalPrice && (
                      <p className="text-gray-400 text-sm line-through mb-3">
                        {item.originalPrice.toLocaleString('vi-VN')} ₫
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-800 hover:bg-amber-500 text-white font-medium py-2 rounded-lg transition-colors duration-300 mt-auto"
                  >
                    Thêm vào giỏ
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Accessories; 