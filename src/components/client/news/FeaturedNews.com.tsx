import React from 'react';
import { motion } from 'framer-motion';
import NewsCard, { type NewsItem } from './NewsCard.com';

const featuredNews: NewsItem[] = [
  {
    id: '1',
    title: 'Honda Công Bố Hàng Loạt Mẫu Xe Mới Tại Triển Lãm EICMA 2023',
    summary: 'Honda gây bất ngờ với loạt xe mô tô mới tại triển lãm EICMA 2023, bao gồm CBR1000RR-R Fireblade thế hệ mới và Africa Twin 2024.',
    image: 'https://xehay.vn/uploads/images/2022/11/03/XH_Transalp_181122_4.jpg',
    date: '10/11/2023',
    author: 'Nguyễn Văn A',
    category: 'Sự Kiện',
    readTime: '5',
    slug: 'honda-cong-bo-hang-loat-mau-xe-moi',
    featured: true,
    views: 3250,
    isNew: true
  },
  {
    id: '2',
    title: 'BMW Motorrad Kỷ Niệm 100 Năm Với Phiên Bản Đặc Biệt Giới Hạn',
    summary: 'Nhân dịp kỷ niệm 100 năm thành lập, BMW Motorrad ra mắt các phiên bản đặc biệt giới hạn với thiết kế độc đáo và trang bị cao cấp.',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '05/11/2023',
    author: 'Trần Thị B',
    category: 'Sản Phẩm',
    readTime: '7',
    slug: 'bmw-motorrad-ky-niem-100-nam',
    views: 2180
  },
  {
    id: '3',
    title: 'Giải Đua MotoGP 2023: Marc Marquez Trở Lại Đỉnh Cao',
    summary: 'Sau thời gian dài chấn thương, Marc Marquez đã có màn trở lại ấn tượng tại giải đua MotoGP 2023 với chiến thắng tại GP Ý.',
    image: 'https://daunhothuynhchau.com/wp-content/uploads/2023/11/JRB3458-scaled-1.jpg',
    date: '02/11/2023',
    author: 'Lê Văn C',
    category: 'Đua Xe',
    readTime: '6',
    slug: 'marc-marquez-tro-lai-dinh-cao',
    views: 4120
  },
  {
    id: '4',
    title: 'Ducati Streetfighter V4 2024: Nâng Cấp Mạnh Mẽ Với Công Nghệ Từ MotoGP',
    summary: 'Ducati vừa ra mắt phiên bản nâng cấp cho Streetfighter V4 2024 với nhiều cải tiến từ công nghệ MotoGP và thiết kế sắc sảo hơn.',
    image: 'https://xedoisong.vn/uploads/user_4/2024/11-2024/29/ducati/xedoisong_ducati_streetfighter_v4-2.jpg',
    date: '28/10/2023',
    author: 'Phạm Thị D',
    category: 'Sản Phẩm',
    readTime: '4',
    slug: 'ducati-streetfighter-v4-2024',
    isNew: true,
    views: 2780
  },
  {
    id: '5',
    title: 'Kawasaki Ninja ZX-10R 2023: Tinh Chỉnh Để Tối Ưu Hiệu Suất',
    summary: 'Kawasaki đã tinh chỉnh mẫu superbike Ninja ZX-10R 2023 với nhiều cải tiến về khí động học và điện tử để tối ưu hiệu suất.',
    image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '25/10/2023',
    author: 'Hoàng Văn E',
    category: 'Sản Phẩm',
    readTime: '5',
    slug: 'kawasaki-ninja-zx-10r-2023',
    views: 1950
  }
];

const FeaturedNews: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Tin Tức <span className="text-amber-500">Nổi Bật</span>
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Cập nhật những tin tức mới nhất và đáng chú ý nhất trong thế giới mô tô
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNews.map((news, index) => (
            <NewsCard 
              key={news.id} 
              news={news}
              variant={index === 0 ? 'large' : index < 3 ? 'medium' : 'small'}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;