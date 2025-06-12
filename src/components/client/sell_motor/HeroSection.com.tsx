import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-900">
      {/* Background Image with overlay gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1571480161267-84e11d5c7aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
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
              Bán Xe Máy <span className="text-amber-500">Nhanh Chóng</span> & Hiệu Quả
            </h1>
            <p className="text-gray-300 text-xl mb-8">Đăng tin, định giá và kết nối với người mua tiềm năng một cách dễ dàng với dịch vụ bán xe máy của chúng tôi.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
              >
                Đăng Bán Ngay
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#calculator"
                className="px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Định Giá Xe
              </motion.a>
            </div>
            
            <div className="mt-10 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="bg-amber-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-medium">Bán xe trong <span className="text-amber-400 font-bold">48 giờ</span></p>
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
          src="https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Motorcycle for sale" 
          className="h-full object-contain object-right-bottom"
        />
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => {
          document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <p className="text-white text-sm mb-2">Tìm hiểu thêm</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;