import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategory } from '../../../hooks/modules/useCategory';
import { useNews } from '../../../hooks';

// Static data for category styling
const categoryStyles: Record<string, { 
  icon: React.ReactNode; 
  color: string; 
  image: string;
}> = {
  'default': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'from-gray-600/20 to-gray-500/10',
    image: 'https://images.unsplash.com/photo-1558980394-dbb977039a2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  'san-pham': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'from-green-600/20 to-green-500/10',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  'dua-xe': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
    color: 'from-blue-600/20 to-blue-500/10',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH-NAQHyxJyJ9M1ikS6S9b1uYG5soRPN-avQ&s'
  },
  'danh-gia': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'from-red-600/20 to-red-500/10',
    image: 'https://images.unsplash.com/photo-1603102859961-64b17d43580d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  'bao-duong': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-amber-600/20 to-amber-500/10',
    image: 'https://images.unsplash.com/photo-1596638787647-904d822d751e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  'phu-kien': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: 'from-purple-600/20 to-purple-500/10',
    image: 'https://hanoicar.vn/pictures/editor/images/phu-kien-o-to-1.jpg'
  },
  'video': {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-indigo-600/20 to-indigo-500/10',
    image: 'https://images.unsplash.com/photo-1617529497471-9218633199c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
};

const NewsCategories: React.FC = () => {
  const { useGetAllCategories } = useCategory();
  const { useBlogList } = useNews();
  
  // Get all categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategories({ pageSize: 100 });
  
  // Get blog list to count blogs per category
  const { data: blogListData } = useBlogList({ pageSize: 1000 });
  
  // Calculate categories with blog counts
  const categoriesWithCounts = useMemo(() => {
    if (!categoriesData || !blogListData?.data) return [];
    
    // Backend trả về trực tiếp array trong data
    const blogs = blogListData.data;
    
    if (!Array.isArray(blogs)) {
      return [];
    }
    
    const categories = categoriesData;
    
    const result = categories
      .map(category => {
        const blogCount = blogs.filter((blog: any) => blog.categoryId === category.id).length;
        return {
          ...category,
          blogCount
        };
      })
      .filter(category => category.blogCount > 0); // Only show categories with blogs
    
    return result;
  }, [categoriesData, blogListData]);

  // Helper function to get category style
  const getCategoryStyle = (categoryName: string) => {
    const normalized = categoryName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd');
    
    for (const [key, style] of Object.entries(categoryStyles)) {
      if (normalized.includes(key)) {
        return style;
      }
    }
    return categoryStyles.default;
  };

  // Loading state
  if (isCategoriesLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Khám Phá Theo <span className="text-amber-500">Chủ Đề</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tìm kiếm các bài viết theo chủ đề yêu thích của bạn từ sản phẩm mới đến kỹ thuật bảo dưỡng
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl overflow-hidden h-full">
                  <div className="h-40 bg-gray-700"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No categories with blogs
  if (categoriesWithCounts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Khám Phá Theo <span className="text-amber-500">Chủ Đề</span>
            </h2>
            <p className="text-gray-400">Chưa có danh mục nào có bài viết</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Khám Phá Theo <span className="text-amber-500">Chủ Đề</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tìm kiếm các bài viết theo chủ đề yêu thích của bạn từ sản phẩm mới đến kỹ thuật bảo dưỡng
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category: any, index: number) => {
            const style = getCategoryStyle(category.name);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={`/tin-tuc/category/${category.id}`}
                  className="group block rounded-xl overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-300 h-full"
                >
                  <div className="relative h-40 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} z-10`}></div>
                    <img 
                      src={category.imageUrl || style.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to default image if category image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = style.image;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="bg-gray-900/70 backdrop-blur-sm text-gray-300 text-sm px-3 py-1 rounded-full">
                        {category.blogCount} bài viết
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center text-amber-500">
                      {style.icon}
                      <span className="ml-2 text-white group-hover:text-amber-400 transition-colors font-medium">
                        Xem tất cả
                      </span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsCategories;