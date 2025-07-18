// src/components/client/accessories/BrandShowcase.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '@hooks/modules/useProduct';

// Brand logos mapping - you can replace these with actual brand logos
const brandLogos: Record<string, string> = {
  'Yamaha': 'https://logos-world.net/wp-content/uploads/2020/12/Yamaha-Logo.png',
  'Honda': 'https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png',
  'Suzuki': 'https://logos-world.net/wp-content/uploads/2020/11/Suzuki-Logo.png',
  'Kawasaki': 'https://logos-world.net/wp-content/uploads/2020/11/Kawasaki-Logo.png',
  'Ducati': 'https://logos-world.net/wp-content/uploads/2020/11/Ducati-Logo.png',
  'BMW': 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png',
  'KTM': 'https://logoeps.com/wp-content/uploads/2013/12/ktm-vector-logo.png',
  'Harley-Davidson': 'https://logos-world.net/wp-content/uploads/2020/11/Harley-Davidson-Logo.png',
  'Shoei': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQHTJ6iT-Lx-xqhDj9n-H_JtfqnCNDFAPgGg&s',
  'AGV': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInNIpybLp0q829zVpN8Y6qnJy-EZ-zv2tPQ&s',
  'Alpinestars': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStkuIizhBFFSfggSoLaD_JeBPYTxqnzeAzIA&s',
  'Dainese': 'https://mainguyen.sgp1.digitaloceanspaces.com/207771/Dainese-Logo.png',
  'Akrapovic': 'https://images-cdn.ubuy.co.in/DM69BDI-akrapovic-exhaust-spring-p-s2-60mm.jpg',
  'Pirelli': 'https://lopxemay.vn/images/2020/08/20200817_99851e492f166aa0dc72001c6dbd1e6a_1597646992.jpg',
  'Michelin': 'https://shop2banh.vn/images/2020/04/20200407_aaab49dc0cea32eb60c46dd7e114f9ba_1586226427.jpeg',
  'GoPro': 'https://brandmediacoalition.com/wp-content/uploads/2020/03/GoPro-logo-BMS-2020.png'
};

const BrandShowcase: React.FC = () => {
  const { useProducts } = useProduct();

  // Fetch products to get available brands
  const { data: products = [], isLoading } = useProducts({
    pageNumber: 1,
    pageSize: 100
  });

  // Extract unique brands from verified products
  const uniqueBrands = React.useMemo(() => {
    const brands = products
      .filter(product => product.isVerified)
      .map(product => product.brand)
      .filter((brand, index, array) => array.indexOf(brand) === index);

    return brands.slice(0, 8); // Limit to 8 brands for better display
  }, [products]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white">Đang tải thương hiệu...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {uniqueBrands.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400">Chưa có thương hiệu nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {uniqueBrands.map((brand, index) => (
              <motion.div
                key={`${brand}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-lg p-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group"
              >
                {brandLogos[brand] ? (
                  <img
                    src={brandLogos[brand]}
                    alt={brand}
                    className="max-h-12 max-w-full object-contain"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const img = e.currentTarget;
                      const textSpan = img.parentElement?.querySelector('span');
                      if (textSpan) {
                        img.style.display = 'none';
                        textSpan.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <span
                  className={`text-lg font-bold text-gray-300 group-hover:text-amber-400 transition-colors duration-300 ${brandLogos[brand] ? 'hidden' : 'block'}`}
                  style={{ display: brandLogos[brand] ? 'none' : 'block' }}
                >
                  {brand}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandShowcase;