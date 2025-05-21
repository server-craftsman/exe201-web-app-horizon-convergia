import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewsSearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tìm kiếm:', searchQuery);
    // Thực hiện tìm kiếm
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-20 z-10"
    >
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tin tức về xe máy..."
          className="w-full px-5 py-4 bg-gray-800 text-white border-none outline-none pr-12"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-amber-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
      
      <div className="px-5 py-3 border-t border-gray-700 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400">Tìm kiếm phổ biến:</span>
        <a href="#" className="text-sm text-amber-400 hover:underline">Yamaha R9</a>
        <a href="#" className="text-sm text-amber-400 hover:underline">Honda CBR1000RR-R</a>
        <a href="#" className="text-sm text-amber-400 hover:underline">Ducati V4</a>
      </div>
    </motion.div>
  );
};

export default NewsSearchBar;