import React from 'react';
import { motion } from 'framer-motion';

// Dữ liệu các danh mục xe máy
const categories = [
  {
    id: 1,
    name: 'Xe Thể Thao',
    image: 'https://images.unsplash.com/photo-1558979159-2b18a4070a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    count: 24,
    description: 'Dành cho những người yêu thích tốc độ và cảm giác mạnh',
    color: 'from-red-500 to-red-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'Xe Touring',
    image: 'https://baogiaothong.mediacdn.vn/603483875699699712/2023/11/21/top-10-xe-touring-thoai-mai-nhat-2023-6-17005617107411433386382.jpg',
    count: 18,
    description: 'Thiết kế tối ưu cho những chuyến đi đường dài',
    color: 'from-blue-500 to-blue-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 3,
    name: 'Xe Cruiser',
    image: 'https://motosaigon.vn/wp-content/uploads/2022/09/keeway-v302-c-v-twin-gia-xe-motosaigon-2.jpg',
    count: 15,
    description: 'Phong cách cổ điển với thiết kế đẳng cấp',
    color: 'from-amber-500 to-amber-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )
  },
  {
    id: 4,
    name: 'Xe Adventure',
    image: 'https://chrunix.com/pub/media/blog_media/bang-gia-xe-adventure/TRK502.jpg',
    count: 12,
    description: 'Dành cho những chuyến phiêu lưu khám phá',
    color: 'from-green-500 to-green-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

const MotorcycleCategories: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white"
          >
            Danh Mục <span className="text-amber-500">Xe Máy</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Khám phá các dòng xe máy theo phong cách và mục đích sử dụng phù hợp với nhu cầu của bạn
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl overflow-hidden group relative"
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
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4">{category.description}</p>
                
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
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
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

export default MotorcycleCategories; 