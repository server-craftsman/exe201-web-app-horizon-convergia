// src/components/client/accessories/BrandShowcase.tsx
import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  {
    id: 1,
    name: 'Shoei',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQHTJ6iT-Lx-xqhDj9n-H_JtfqnCNDFAPgGg&s'
  },
  {
    id: 2,
    name: 'AGV',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInNIpybLp0q829zVpN8Y6qnJy-EZ-zv2tPQ&s'
  },
  {
    id: 3,
    name: 'Alpinestars',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStkuIizhBFFSfggSoLaD_JeBPYTxqnzeAzIA&s'
  },
  {
    id: 4,
    name: 'Dainese',
    logo: 'https://mainguyen.sgp1.digitaloceanspaces.com/207771/Dainese-Logo.png'
  },
  {
    id: 5,
    name: 'Akrapovic',
    logo: 'https://images-cdn.ubuy.co.in/DM69BDI-akrapovic-exhaust-spring-p-s2-60mm.jpg'
  },
  {
    id: 6,
    name: 'Pirelli',
    logo: 'https://lopxemay.vn/images/2020/08/20200817_99851e492f166aa0dc72001c6dbd1e6a_1597646992.jpg'
  },
  {
    id: 7,
    name: 'Michelin',
    logo: 'https://shop2banh.vn/images/2020/04/20200407_aaab49dc0cea32eb60c46dd7e114f9ba_1586226427.jpeg'
  },
  {
    id: 8,
    name: 'GoPro',
    logo: 'https://brandmediacoalition.com/wp-content/uploads/2020/03/GoPro-logo-BMS-2020.png'
  }
];

const BrandShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white text-center mb-12"
        >
          Các Thương Hiệu <span className="text-amber-500">Đối Tác</span> Của Chúng Tôi
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-700/50 rounded-lg p-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-h-12"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;