import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NewsCard, { type NewsItem } from './NewsCard.com';

const latestNews: NewsItem[] = [
  {
    id: '6',
    title: 'Triumph Trident 660 2024: Thiết Kế Mới, Nhiều Tùy Chọn Màu Sắc',
    summary: 'Triumph vừa công bố mẫu Trident 660 phiên bản 2024 với nhiều tùy chọn màu sắc mới cùng một số cải tiến về thiết kế.',
    image: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '22/10/2023',
    author: 'Nguyễn Minh F',
    category: 'Sản Phẩm',
    readTime: '4',
    slug: 'triumph-trident-660-2024',
    views: 1240
  },
  {
    id: '7',
    title: 'Harley-Davidson Tri Glide Ultra 2023: Nâng Cấp Đáng Kể Cho Mẫu Xe Ba Bánh',
    summary: 'Harley-Davidson đã nâng cấp mẫu xe ba bánh Tri Glide Ultra 2023 với nhiều cải tiến về động cơ, hệ thống treo và tiện nghi.',
    image: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '20/10/2023',
    author: 'Lê Văn G',
    category: 'Sản Phẩm',
    readTime: '6',
    slug: 'harley-davidson-tri-glide-ultra-2023',
    views: 980
  },
  {
    id: '8',
    title: 'KTM Phát Triển Hệ Thống Tự Động Điều Chỉnh Độ Sáng Đèn Pha',
    summary: 'KTM đang phát triển hệ thống đèn pha thông minh có khả năng tự động điều chỉnh độ sáng và phạm vi chiếu sáng dựa trên tình hình giao thông.',
    image: 'https://vcdn1-vnexpress.vnecdn.net/2017/01/05/2-5604-1483600232.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=nhBCUXCoHA9dCoZbKZPvuw',
    date: '18/10/2023',
    author: 'Trần Văn H',
    category: 'Công Nghệ',
    readTime: '5',
    slug: 'ktm-phat-trien-he-thong-den-pha-thong-minh',
    views: 1560
  },
  {
    id: '9',
    title: 'Suzuki Hayabusa 2024: Phiên Bản Kỷ Niệm 25 Năm',
    summary: 'Suzuki chuẩn bị ra mắt phiên bản Hayabusa 2024 đặc biệt để kỷ niệm 25 năm dòng siêu mô tô này xuất hiện trên thị trường.',
    image: 'https://cdn.tuoitrethudo.vn/stores/news_dataimages/2024/052024/03/17/xehay-suzuki-110423-920240503172115.2638960.jpg',
    date: '15/10/2023',
    author: 'Phạm Thị I',
    category: 'Sản Phẩm',
    readTime: '7',
    slug: 'suzuki-hayabusa-2024-phien-ban-ky-niem-25-nam',
    views: 2350
  },
  {
    id: '10',
    title: 'Bảo Dưỡng Xe Máy Mùa Mưa: Những Điều Cần Lưu Ý',
    summary: 'Hướng dẫn chi tiết về cách bảo dưỡng xe máy trong mùa mưa để đảm bảo xe vận hành tốt và tránh hư hỏng do thời tiết.',
    image: 'https://images.unsplash.com/photo-1605164597341-44dee3c7ad0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '12/10/2023',
    author: 'Hoàng Văn J',
    category: 'Bảo Dưỡng',
    readTime: '8',
    slug: 'bao-duong-xe-may-mua-mua',
    views: 3120
  },
  {
    id: '11',
    title: 'Indian Scout Bobber 2023: Phong Cách Mới, Sức Mạnh Ấn Tượng',
    summary: 'Indian Motorcycle vừa giới thiệu mẫu Scout Bobber 2023 với nhiều cải tiến về phong cách và động cơ mạnh mẽ hơn.',
    image: 'https://images.unsplash.com/photo-1563692712050-3e68350add0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '10/10/2023',
    author: 'Nguyễn Văn K',
    category: 'Sản Phẩm',
    readTime: '5',
    slug: 'indian-scout-bobber-2023',
    views: 870
  }
];

const LatestNews: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, latestNews.length));
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex justify-between items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Tin Tức <span className="text-amber-500">Mới Nhất</span>
            </h2>
            <p className="text-gray-400">
              Cập nhật những tin tức mới nhất về thế giới xe máy
            </p>
          </div>
          <a 
            href="/news" 
            className="hidden md:flex items-center text-amber-500 hover:text-amber-400 transition-colors"
          >
            <span className="mr-2">Xem tất cả tin tức</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.slice(0, visibleCount).map((news, index) => (
            <NewsCard 
              key={news.id} 
              news={news}
              variant="medium"
              index={index}
            />
          ))}
        </div>
        
        {visibleCount < latestNews.length && (
          <div className="text-center mt-10">
            <motion.button
              onClick={loadMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-amber-400 transition-colors duration-300"
            >
              Xem Thêm Tin Tức
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestNews;