import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { useProducts } = useProduct();

  // Get product count for display
  const { data: products = [] } = useProducts({
    pageNumber: 1,
    pageSize: 100
  });

  const verifiedProductCount = products.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4)
  ).length;

  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-900">
      {/* Background Image với overlay gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
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
              Trải Nghiệm <span className="text-amber-500">Đẳng Cấp</span> Cùng Xe Máy Mới
            </h1>
            <p className="text-gray-300 text-xl mb-8">
              Khám phá bộ sưu tập xe máy cao cấp và hoàn toàn mới với thiết kế hiện đại, động cơ mạnh mẽ và công nghệ tiên tiến.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#featured">
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
                href="#featured"
                className="px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Xem Video
              </motion.a>
            </div>

            <div className="mt-10 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-200 overflow-hidden">
                    <img
                      src={`https://randomuser.me/api/portraits/men/${i + 30}.jpg`}
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-medium">Hơn {verifiedProductCount} sản phẩm</p>
                <p className="text-amber-400 font-bold">Đang chờ bạn khám phá</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Motorcycle Image */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-0 bottom-0 w-1/2 h-full hidden md:block"
      >
        <img
          src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Luxury Motorcycle"
          className="h-full object-contain object-right-bottom"
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => {
          document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
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