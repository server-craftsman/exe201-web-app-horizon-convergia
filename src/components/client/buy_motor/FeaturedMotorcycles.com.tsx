import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';

const FeaturedMotorcycles: React.FC = () => {
  const { useProducts } = useProduct();

  // Fetch featured products (verified and status 0)
  const { data: products = [], isLoading } = useProducts({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 4 // Only show 4 featured products
  });

  // Filter verified products for featured display
  const featuredProducts = products.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4)
  ).slice(0, 4);

  const [activeIndex, setActiveIndex] = React.useState(0);

  // Auto-rotate featured products
  React.useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  if (isLoading) {
    return (
      <section id="featured" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white">Đang tải sản phẩm nổi bật...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section id="featured" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">Chưa có sản phẩm nổi bật nào.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentProduct = featuredProducts[activeIndex];

  return (
    <section id="featured" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white"
          >
            Xe Máy <span className="text-amber-500">Nổi Bật</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Khám phá những mẫu xe cao cấp nhất, được thiết kế dành riêng cho những người đam mê tốc độ và đẳng cấp
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Danh sách xe bên trái */}
          <div className="lg:col-span-1 space-y-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeIndex === index ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveIndex(index)}
              >
                <h3 className={`font-bold ${activeIndex === index ? 'text-amber-400' : 'text-white'}`}>
                  {product.brand} {product.model}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {product.engineCapacity}cc | {product.condition}
                </p>
                <p className={`font-medium mt-2 ${activeIndex === index ? 'text-amber-400' : 'text-gray-300'}`}>
                  {product.price.toLocaleString('vi-VN')} ₫
                </p>
              </motion.div>
            ))}
          </div>

          {/* Hiển thị xe được chọn ở giữa */}
          <div className="lg:col-span-3 relative">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden aspect-[16/9]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-gray-900/50"></div>
              <img
                src={currentProduct.imageUrls && currentProduct.imageUrls.length > 0
                  ? currentProduct.imageUrls[0]
                  : 'https://via.placeholder.com/800x450?text=No+Image'
                }
                alt={`${currentProduct.brand} ${currentProduct.model}`}
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x450?text=No+Image';
                }}
              />

              {/* Ring lệch tâm trang trí */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 border-4 border-amber-500/30 rounded-full"></div>
              <div className="absolute -top-16 -left-16 w-40 h-40 border-2 border-amber-500/20 rounded-full"></div>

              {/* Badge giá */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-gray-900 font-bold">{currentProduct.price.toLocaleString('vi-VN')} ₫</p>
              </div>
            </motion.div>

            {/* Specifications overlay at bottom */}
            <motion.div
              key={`specs-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/80 backdrop-blur-sm absolute bottom-0 left-0 right-0 px-6 py-4 rounded-b-3xl"
            >
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Động cơ</p>
                  <p className="text-white font-bold">{currentProduct.engineCapacity}cc</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Năm sản xuất</p>
                  <p className="text-white font-bold">{currentProduct.year}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Tình trạng</p>
                  <p className="text-white font-bold">{currentProduct.condition}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Màu sắc</p>
                  <p className="text-white font-bold">{currentProduct.color}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action panel bên phải */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {currentProduct.brand} {currentProduct.model}
              </h3>
              <div
                className="text-gray-400 mb-6"
                dangerouslySetInnerHTML={{
                  __html: currentProduct.description.replace(/<!--.*?-->/g, '').substring(0, 150) + '...'
                }}
              />

              <Link
                to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${currentProduct.categoryId}`}
                className="block w-full"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all mb-3"
                >
                  Xem Chi Tiết
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all"
              >
                Liên Hệ Tư Vấn
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-bold">Ưu đãi đặc biệt</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Miễn phí giao xe tận nơi và bảo dưỡng định kỳ trong năm đầu tiên.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {featuredProducts.map((_, index) => (
            <motion.button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-amber-500' : 'bg-gray-700'}`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMotorcycles; 