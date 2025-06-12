import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Dữ liệu mẫu cho xe máy nổi bật
const featuredMotorcycles = [
  {
    id: 1,
    name: 'Honda CBR1000RR-R Fireblade',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '799,000,000',
    specs: {
      engine: '1000cc',
      power: '214 HP',
      speed: '299 km/h',
      weight: '201 kg'
    },
    color: 'from-red-500 to-red-700'
  },
  {
    id: 2,
    name: 'Ducati Panigale V4',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '950,000,000',
    specs: {
      engine: '1103cc',
      power: '221 HP',
      speed: '305 km/h',
      weight: '195 kg'
    },
    color: 'from-red-600 to-red-800'
  },
  {
    id: 3,
    name: 'Kawasaki Ninja ZX-10R',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '729,000,000',
    specs: {
      engine: '998cc',
      power: '200 HP',
      speed: '300 km/h',
      weight: '207 kg'
    },
    color: 'from-green-500 to-green-700'
  },
  {
    id: 4,
    name: 'BMW S1000RR',
    image: 'https://images.unsplash.com/photo-1547549082-6bc09f2049ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '859,000,000',
    specs: {
      engine: '999cc',
      power: '205 HP',
      speed: '302 km/h',
      weight: '197 kg'
    },
    color: 'from-blue-500 to-blue-700'
  }
];

const FeaturedMotorcycles: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
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
            {featuredMotorcycles.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeIndex === index ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveIndex(index)}
              >
                <h3 className={`font-bold ${activeIndex === index ? 'text-amber-400' : 'text-white'}`}>{bike.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{bike.specs.engine} | {bike.specs.power}</p>
                <p className={`font-medium mt-2 ${activeIndex === index ? 'text-amber-400' : 'text-gray-300'}`}>{bike.price} VND</p>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredMotorcycles[activeIndex].color} opacity-10`}></div>
              <img 
                src={featuredMotorcycles[activeIndex].image} 
                alt={featuredMotorcycles[activeIndex].name}
                className="w-full h-full object-cover rounded-3xl" 
              />
              
              {/* Ring lệch tâm trang trí */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 border-4 border-amber-500/30 rounded-full"></div>
              <div className="absolute -top-16 -left-16 w-40 h-40 border-2 border-amber-500/20 rounded-full"></div>
              
              {/* Badge giá */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-gray-900 font-bold">{featuredMotorcycles[activeIndex].price} VND</p>
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
                  <p className="text-white font-bold">{featuredMotorcycles[activeIndex].specs.engine}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Công suất</p>
                  <p className="text-white font-bold">{featuredMotorcycles[activeIndex].specs.power}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Tốc độ tối đa</p>
                  <p className="text-white font-bold">{featuredMotorcycles[activeIndex].specs.speed}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">Trọng lượng</p>
                  <p className="text-white font-bold">{featuredMotorcycles[activeIndex].specs.weight}</p>
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
              <h3 className="text-xl font-bold text-white mb-4">{featuredMotorcycles[activeIndex].name}</h3>
              <p className="text-gray-400 mb-6">Mẫu xe cao cấp với thiết kế khí động học và công nghệ tiên tiến, mang đến trải nghiệm lái xe tuyệt vời.</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all mb-3"
              >
                Đặt Hàng Ngay
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all"
              >
                Xem Chi Tiết
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
              <p className="text-gray-400 text-sm">Giảm ngay 5% khi thanh toán trước 100% giá trị xe và tặng thêm gói phụ kiện trị giá 20 triệu đồng.</p>
            </motion.div>
          </div>
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {featuredMotorcycles.map((_, index) => (
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