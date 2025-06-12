// src/components/client/accessories/PromotionBanner.tsx
import React from 'react';
import { motion } from 'framer-motion';

const PromotionBanner: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1626450448848-d79bc577a4fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/70"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mb-10 lg:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ưu Đãi <span className="text-amber-500">Tháng 7</span> - Giảm Đến 40%
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Nhân dịp hè, chúng tôi mang đến cho bạn chương trình khuyến mãi đặc biệt với hàng trăm sản phẩm phụ kiện cao cấp được giảm giá đến 40%. Cơ hội nâng cấp xe máy của bạn với mức giá tốt nhất trong năm.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
              >
                Khám Phá Ngay
              </motion.button>
              <div className="flex items-center">
                <svg className="animate-pulse text-red-500 h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">Ưu đãi kết thúc sau: 5 ngày</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl"
          >
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-amber-500 text-gray-900 text-sm font-bold rounded-full mb-2">GIẢM GIÁ ĐẶC BIỆT</span>
              <h3 className="text-2xl font-bold text-white">Bộ Phụ Kiện Cao Cấp</h3>
              <p className="text-gray-400 mt-1">Mũ bảo hiểm + Găng tay + Áo giáp</p>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <span className="text-gray-400 text-lg line-through mr-3">12,000,000 VND</span>
              <span className="text-3xl font-bold text-amber-400">7,990,000 VND</span>
            </div>
            
            <ul className="mb-8 space-y-3">
              {['Mũ bảo hiểm Shoei X-Spirit III', 'Găng tay Alpinestars SP-8 v2', 'Áo giáp Dainese Racing 4', 'Giao hàng miễn phí', 'Bảo hành 2 năm'].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
            >
              Mua Ngay
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;