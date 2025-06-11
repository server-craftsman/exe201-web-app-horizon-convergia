// src/components/client/accessories/FeaturedProducts.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard, { type ProductType } from './ProductCard.com';

// Sample data for featured products
const featuredProducts: ProductType[] = [
  {
    id: 1,
    name: 'Mũ Bảo Hiểm AGV Pista GP RR',
    price: 28000000,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mũ Bảo Hiểm',
    rating: 5,
    reviewCount: 42,
    isNew: true,
    isFeatured: true,
    inStock: true
  },
  {
    id: 2,
    name: 'Găng Tay Alpinestars GP Pro R3',
    price: 4500000,
    image: 'https://imgwebikenet-8743.kxcdn.com/catalogue/images/112167/_files_product_3556719_s_GP_PRO_R3_GLOVES_1_jpg_w500px_h500px_TM.jpg',
    category: 'Găng Tay',
    rating: 4,
    reviewCount: 28,
    isFeatured: true,
    inStock: true
  },
  {
    id: 3,
    name: 'Áo Giáp Dainese D-Air Misano 2',
    price: 45000000,
    discount: 15,
    image: 'https://mainguyen.sgp1.digitaloceanspaces.com/213643/ao-da-tui-khi-dainese-misano-d-air-perf-2.jpg',
    category: 'Áo Giáp',
    rating: 5,
    reviewCount: 16,
    isNew: true,
    inStock: true
  },
  {
    id: 4,
    name: 'Ống Xả Akrapovic Evolution Line Titanium',
    price: 35000000,
    image: 'https://motosaigon.vn/wp-content/uploads/2021/04/Akrapovic-Evolution-Line-Titanium-30th-anniversary-motosaigon.vn2_.jpg',
    category: 'Ống Xả',
    rating: 4,
    reviewCount: 23,
    isFeatured: true,
    inStock: false
  },
  {
    id: 5,
    name: 'Camera Hành Trình GoPro Hero 11 Black Motorcycle Edition',
    price: 12000000,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1558980394-34764db076b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Phụ Kiện Điện Tử',
    rating: 5,
    reviewCount: 38,
    isNew: true,
    inStock: true
  },
  {
    id: 6,
    name: 'Lốp Pirelli Diablo Rosso IV (120/70 ZR17)',
    price: 4200000,
    image: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Lốp & Vành',
    rating: 4,
    reviewCount: 45,
    inStock: true
  }
];

// Product filter categories
const filterCategories = [
  { id: 'all', name: 'Tất Cả' },
  { id: 'helmet', name: 'Mũ Bảo Hiểm' },
  { id: 'gloves', name: 'Găng Tay' },
  { id: 'jacket', name: 'Áo Giáp' },
  { id: 'exhaust', name: 'Ống Xả' },
  { id: 'electronics', name: 'Phụ Kiện Điện Tử' },
  { id: 'tire', name: 'Lốp & Vành' }
];

const FeaturedProducts: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // This would filter products in a real app
  // For now, we'll just return all products
  const filteredProducts = featuredProducts;

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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category.id 
                  ? 'bg-amber-500 text-gray-900' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* "View All" Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;