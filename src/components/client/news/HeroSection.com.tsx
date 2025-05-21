import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558980394-dbb977039a2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Motorcycle News Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-amber-500 text-gray-900 text-sm font-semibold rounded-full mb-4">
              Tin Tức Nổi Bật
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Yamaha Tiết Lộ Mẫu R9 2023 Với Công Nghệ Đột Phá
            </h1>
            <p className="text-gray-300 text-xl mb-8 max-w-xl">
              Yamaha vừa ra mắt mẫu xe R9 2023 với thiết kế khí động học hoàn toàn mới, sức mạnh động cơ vượt trội cùng hệ thống điện tử tiên tiến.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">15 Tháng 5, 2023</span>
              </div>
              <div className="flex items-center text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-gray-300">2.4K lượt xem</span>
              </div>
              <div className="flex items-center text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-gray-300">32 bình luận</span>
              </div>
            </div>
            
            <Link 
              to="/news/yamaha-r9-2023" 
              className="inline-flex items-center px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-amber-400 transition-colors duration-300"
            >
              Đọc Tiếp
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-tr from-amber-500 to-amber-300 absolute -inset-0.5 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-gray-800 p-2 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Yamaha R9 2023" 
                className="rounded-xl w-full h-80 sm:h-96 object-cover"
              />
              
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                  Mới Nhất
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-amber-500/20 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-amber-500/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-10 h-10 border border-amber-500/20 rounded-full"></div>
    </section>
  );
};

export default HeroSection;