// src/components/client/accessories/PopularCategories.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useCategory } from '@hooks/modules/useCategory';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';

// Category icons mapping
const categoryIcons: Record<string, React.ReactElement> = {
  'default': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  'mũ bảo hiểm': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  'găng tay': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
  'áo giáp': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'ống xả': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  'phụ kiện điện tử': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  'lốp & vành': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Category colors mapping
const categoryColors = [
  'from-red-500 to-red-700',
  'from-blue-500 to-blue-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-yellow-500 to-yellow-700',
  'from-amber-500 to-amber-700',
  'from-indigo-500 to-indigo-700',
  'from-pink-500 to-pink-700'
];

const PopularCategories: React.FC = () => {
  const { getCategorys } = useCategory();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Request categories for display (limit to reasonable number)
        const { data } = await getCategorys.mutateAsync({ pageSize: 20 });
        if (data) {
          // Filter categories that might be related to accessories or all categories
          setCategories(data.slice(0, 6)); // Limit to 6 categories for display
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section id="categories" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white">Đang tải danh mục...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {categories.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400">Chưa có danh mục nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length];
              const icon = categoryIcons[category.name.toLowerCase()] || categoryIcons['default'];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800 rounded-xl overflow-hidden group relative cursor-pointer"
                >
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-30 group-hover:opacity-20 transition-opacity duration-300`}></div>

                  {/* Background image */}
                  <div className="h-48 overflow-hidden">
                    <motion.img
                      src={category.imageUrl || `https://via.placeholder.com/400x200?text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(category.name)}`;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {category.name}
                      </h3>
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                        {icon}
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4">
                      {category.description || `Khám phá các sản phẩm trong danh mục ${category.name}`}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-medium">Xem sản phẩm</span>
                      <Link to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${category.id}`}>
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
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link to={ROUTER_URL.CLIENT.ACCESSORIES}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-amber-500 rounded-lg text-gray-900 font-bold shadow-lg hover:bg-amber-400 transition-all"
            >
              Xem Tất Cả Danh Mục
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;