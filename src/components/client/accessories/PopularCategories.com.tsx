// src/components/client/accessories/PopularCategories.tsx
import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Mũ Bảo Hiểm',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    count: 124,
    color: 'from-red-500 to-red-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'Găng Tay',
    image: 'https://imgwebikenet-8743.kxcdn.com/catalogue/images/112167/_files_product_3556719_s_GP_PRO_R3_GLOVES_1_jpg_w500px_h500px_TM.jpg',
    count: 89,
    color: 'from-blue-500 to-blue-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    )
  },
  {
    id: 3,
    name: 'Áo Giáp',
    image: 'https://mainguyen.sgp1.digitaloceanspaces.com/213643/ao-da-tui-khi-dainese-misano-d-air-perf-2.jpg',
    count: 76,
    color: 'from-green-500 to-green-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 4,
    name: 'Ống Xả',
    image: 'https://motosaigon.vn/wp-content/uploads/2021/04/Akrapovic-Evolution-Line-Titanium-30th-anniversary-motosaigon.vn2_.jpg',
    count: 52,
    color: 'from-purple-500 to-purple-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  {
    id: 5,
    name: 'Phụ Kiện Điện Tử',
    image: 'https://images.unsplash.com/photo-1558980394-34764db076b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    count: 93,
    color: 'from-yellow-500 to-yellow-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 6,
    name: 'Lốp & Vành',
    image: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    count: 67,
    color: 'from-amber-500 to-amber-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const PopularCategories: React.FC = () => {
  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Danh Mục <span className="text-amber-500">Phụ Kiện</span> Phổ Biến
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Khám phá các danh mục phụ kiện cao cấp giúp nâng tầm trải nghiệm lái xe của bạn
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden group relative cursor-pointer"
            >
              {/* Overlay gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Background image */}
              <div className="h-48 overflow-hidden">
                <motion.img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Content */}
              <div className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{category.name}</h3>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-medium">{category.count} sản phẩm</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all flex items-center"
                  >
                    Xem Thêm
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-amber-500 rounded-lg text-gray-900 font-bold shadow-lg hover:bg-amber-400 transition-all"
          >
            Xem Tất Cả Danh Mục
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;