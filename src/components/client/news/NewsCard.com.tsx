import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  slug: string;
  featured?: boolean;
  views?: number;
  isNew?: boolean;
}

interface NewsCardProps {
  news: NewsItem;
  variant?: 'large' | 'medium' | 'small';
  index?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, variant = 'medium', index = 0 }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group overflow-hidden ${
        variant === 'large' ? 'col-span-2 row-span-2' : 
        variant === 'small' ? '' : 
        ''
      }`}
    >
      <Link to={`/news/${news.slug}`} className="block">
        <div className={`relative rounded-xl overflow-hidden bg-gray-800 transition-all duration-300 
          ${variant === 'large' ? 'h-80' : variant === 'small' ? 'h-48' : 'h-60'}`}>
          {/* Image */}
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80"></div>
          
          {/* Category */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-amber-500 text-gray-900 text-xs font-semibold rounded-full">
              {news.category}
            </span>
            {news.isNew && (
              <span className="inline-block ml-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                Mới
              </span>
            )}
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={`font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors ${
              variant === 'large' ? 'text-2xl' : variant === 'small' ? 'text-base' : 'text-xl'
            }`}>
              {news.title}
            </h3>
            
            {variant !== 'small' && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {news.summary}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <span>{news.date}</span>
                <span className="mx-2">•</span>
                <span>{news.readTime} phút đọc</span>
              </div>
              
              {news.views && (
                <div className="flex items-center text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {news.views}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;