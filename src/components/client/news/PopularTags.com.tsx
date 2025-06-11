import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const tags = [
  { id: 1, name: 'Mô tô phân khối lớn', count: 42, slug: 'mo-to-phan-khoi-lon' },
  { id: 2, name: 'Honda', count: 38, slug: 'honda' },
  { id: 3, name: 'Yamaha', count: 29, slug: 'yamaha' },
  { id: 4, name: 'Ducati', count: 24, slug: 'ducati' },
  { id: 5, name: 'Kawasaki', count: 27, slug: 'kawasaki' },
  { id: 6, name: 'BMW Motorrad', count: 19, slug: 'bmw-motorrad' },
  { id: 7, name: 'MotoGP', count: 31, slug: 'motogp' },
  { id: 8, name: 'Xe đua', count: 18, slug: 'xe-dua' },
  { id: 9, name: 'Bảo dưỡng', count: 23, slug: 'bao-duong' },
  { id: 10, name: 'Phụ tùng', count: 15, slug: 'phu-tung' },
  { id: 11, name: 'Mũ bảo hiểm', count: 14, slug: 'mu-bao-hiem' },
  { id: 12, name: 'Kỹ thuật lái', count: 21, slug: 'ky-thuat-lai' }
];

const PopularTags: React.FC = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Chủ Đề <span className="text-amber-500">Phổ Biến</span>
          </h2>
          <p className="text-gray-400">
            Các từ khóa được tìm kiếm nhiều nhất
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/news/tag/${tag.slug}`}
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-amber-400 rounded-full transition-colors duration-300"
            >
              <span>{tag.name}</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-700">{tag.count}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularTags;