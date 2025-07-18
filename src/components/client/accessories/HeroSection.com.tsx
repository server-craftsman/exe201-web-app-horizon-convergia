// src/components/client/accessories/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { useProducts } = useProduct();

  // Get accessory product count for display
  const { data: products = [] } = useProducts({
    pageNumber: 1,
    pageSize: 100
  });

  // Filter verified accessory products
  const accessoryProducts = products.filter(product =>
    product.isVerified &&
    (product.status === 0 || product.status === 3 || product.status === 4) &&
    product.accessoryType // This field indicates it's an accessory
  );

  const verifiedAccessoryCount = accessoryProducts.length;

  return (
    <section className="relative h-[500px] overflow-hidden bg-gray-900">
      {/* Background Image with overlay gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558980394-0a06c4631733?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-gray-900/70"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-amber-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Nâng Tầm <span className="text-amber-500">Trải Nghiệm</span> Với Phụ Kiện Cao Cấp
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Khám phá bộ sưu tập phụ kiện độc đáo và chất lượng để cá nhân hóa xe máy của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  Khám Phá Ngay
                </motion.button>
              </Link>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#categories"
                className="px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Danh Mục Sản Phẩm
              </motion.a>
            </div>

            <div className="mt-10 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-200 overflow-hidden">
                    <img
                      src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-medium">Hơn {verifiedAccessoryCount} phụ kiện</p>
                <p className="text-amber-400 font-bold">Đang chờ bạn khám phá</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Product Images */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-0 bottom-0 w-1/2 h-full hidden md:flex items-end justify-end"
      >
        <div className="relative h-3/4 w-full">
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            src="https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Motorcycle Helmet"
            className="absolute bottom-10 right-20 h-48 object-contain z-10 drop-shadow-2xl"
          />
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            src="https://images.unsplash.com/photo-1535360196337-b5a58b1ce292?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Motorcycle Gloves"
            className="absolute bottom-40 right-40 h-32 object-contain drop-shadow-2xl"
          />
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            src="https://images.unsplash.com/photo-1552374950-5f719f3a8e31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Motorcycle Jacket"
            className="absolute bottom-20 right-72 h-40 object-contain drop-shadow-2xl"
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => {
          document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <p className="text-white text-sm mb-2">Khám phá thêm</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;