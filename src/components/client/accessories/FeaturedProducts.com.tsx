// src/components/client/accessories/FeaturedProducts.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';

// Import ProductResponse type
import type { ProductResponse } from '../../../types/product/Product.res.type';

// Convert ProductResponse to ProductType for compatibility
interface ProductType {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
}

// Helper function to determine product category
const getProductCategory = (product: ProductResponse): string => {
  // If it has accessoryType, it's an accessory
  if (product.accessoryType) {
    return product.accessoryType;
  }

  // If it has engineCapacity, it's a motorcycle - categorize by type
  if (product.engineCapacity) {
    if (product.engineCapacity <= 125) {
      return 'Xe Số & Tay Ga';
    } else if (product.engineCapacity <= 200) {
      return 'Xe Thể Thao';
    } else {
      return 'Xe Phân Khối Lớn';
    }
  }

  // Default fallback
  return 'Sản Phẩm Khác';
};

const convertToProductType = (product: ProductResponse): ProductType => ({
  id: product.id,
  name: `${product.brand} ${product.model}`,
  price: product.price,
  image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '',
  category: getProductCategory(product),
  rating: 4.5, // Default rating since it's not in API
  reviewCount: Math.floor(Math.random() * 50) + 10, // Random review count
  isNew: new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000, // New if created within 30 days
  isFeatured: true,
  inStock: product.quantity > 0
});

// Product filter categories - updated to be more inclusive
const filterCategories = [
  { id: 'all', name: 'Tất Cả' },
  { id: 'xe số', name: 'Xe Số & Tay Ga' },
  { id: 'xe thể thao', name: 'Xe Thể Thao' },
  { id: 'mũ bảo hiểm', name: 'Mũ Bảo Hiểm' },
  { id: 'găng tay', name: 'Găng Tay' },
  { id: 'áo giáp', name: 'Áo Giáp' },
  { id: 'ống xả', name: 'Ống Xả' },
  { id: 'phụ kiện điện tử', name: 'Phụ Kiện Điện Tử' }
];

const FeaturedProducts: React.FC = () => {
  const { useProducts } = useProduct();
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch products from API
  const { data: products = [], isLoading } = useProducts({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 20
  });

  // Filter verified products (both accessories and motorcycles for featured display)
  const featuredProducts = products
    .filter(product =>
      product.isVerified &&
      (product.status === 0 || product.status === 3 || product.status === 4)
      // Remove the accessoryType filter to include motorcycles too
    )
    .slice(0, 6)
    .map(convertToProductType);

  // Filter products based on active filter
  const filteredProducts = activeFilter === 'all'
    ? featuredProducts
    : featuredProducts.filter(product =>
      product.category.toLowerCase().includes(activeFilter.toLowerCase())
    );

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white">Đang tải sản phẩm nổi bật...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Sản Phẩm <span className="text-amber-500">Nổi Bật</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Khám phá bộ sưu tập phụ kiện cao cấp được ưa chuộng nhất hiện nay
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === category.id
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chưa có sản phẩm phụ kiện nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group relative"
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                      Mới
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-medium">
                      Nổi bật
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                    {product.category}
                  </div>

                  {/* Out of stock overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">Hết Hàng</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < product.rating ? 'text-amber-400' : 'text-gray-600'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">({product.reviewCount} đánh giá)</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-amber-400 font-bold text-xl">
                        {product.price.toLocaleString('vi-VN')} ₫
                      </p>
                      {product.discount && (
                        <p className="text-gray-500 text-sm line-through">
                          {(product.price / (1 - product.discount / 100)).toLocaleString('vi-VN')} ₫
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!product.inStock}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${product.inStock ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 hover:shadow-lg hover:shadow-amber-500/20' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* "View All" Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link to={ROUTER_URL.CLIENT.ACCESSORIES}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center mx-auto"
            >
              Xem Tất Cả Sản Phẩm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;