import React from 'react';
import { motion } from 'framer-motion';
import { useCategory } from '@hooks/modules/useCategory';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';

// Category icons mapping
const categoryIcons: Record<string, React.ReactElement> = {
  'default': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'sport': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'touring': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'cruiser': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  'adventure': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

// Category colors mapping
const categoryColors = [
  'from-red-500 to-red-700',
  'from-blue-500 to-blue-700',
  'from-amber-500 to-amber-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-indigo-500 to-indigo-700'
];

const MotorcycleCategories: React.FC = () => {
  const { getCategorys } = useCategory();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Request all categories for display (no pagination limit)
        const { data } = await getCategorys.mutateAsync({ pageSize: 1000 });
        if (data) {
          // Filter parent categories only
          const parentCategories = data.filter((cat: any) => !cat.parentCategoryId);
          setCategories(parentCategories.slice(0, 8)); // Limit to 8 categories for display
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
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white">Đang tải danh mục...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {categories.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400">Chưa có danh mục nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length];
              const icon = categoryIcons[category.name.toLowerCase()] || categoryIcons['default'];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 rounded-xl overflow-hidden group relative"
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
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
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
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to={ROUTER_URL.CLIENT.BUY_MOTOR}>
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

export default MotorcycleCategories; 