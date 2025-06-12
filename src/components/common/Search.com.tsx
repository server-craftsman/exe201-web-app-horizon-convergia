import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data cho kết quả tìm kiếm gợi ý
const searchSuggestions = [
  { id: 1, text: 'Honda CBR1000RR-R', category: 'Xe máy' },
  { id: 2, text: 'Yamaha R1', category: 'Xe máy' },
  { id: 3, text: 'Mũ bảo hiểm AGV Pista GP RR', category: 'Phụ kiện' },
  { id: 4, text: 'Găng tay Alpinestar GP Pro R3', category: 'Phụ kiện' },
  { id: 5, text: 'Kawasaki Ninja ZX-10R', category: 'Xe máy' }
];

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Lọc gợi ý dựa trên query
  const filteredSuggestions = searchQuery.length > 0
    ? searchSuggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý submit tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Lưu lịch sử tìm kiếm
      setRecentSearches(prev => {
        const newSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        return newSearches;
      });
      // Logic tìm kiếm thực tế sẽ đặt ở đây
      console.log(`Searching for: ${searchQuery}`);
      setShowSuggestions(false);
    }
  };

  // Xử lý khi chọn một gợi ý
  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    handleSearch(new Event('submit') as any);
  };

  return (
    <motion.div 
      className="hidden md:flex items-center flex-1 mx-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      ref={searchRef}
    >
      <div className="relative w-full max-w-xl mx-auto">
        {/* Outer container with border and glow effect */}
        <motion.div
          className={`relative rounded-full overflow-hidden border-2 ${
            isFocused ? 'border-amber-400' : 'border-amber-500/50'
          } transition-colors duration-300`}
          animate={{ 
            boxShadow: isFocused 
              ? '0 0 15px rgba(251, 191, 36, 0.4)' 
              : '0 0 0 rgba(251, 191, 36, 0)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Search form inside container */}
          <form 
            onSubmit={handleSearch}
            className="flex items-center w-full bg-gray-900/80 backdrop-blur-sm"
          >
            {/* Search icon */}
            <motion.div 
              className="flex items-center justify-center pl-4"
              animate={{ scale: isFocused ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.div>
            
            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm xe, phụ kiện..."
              className="w-full py-2 px-3 bg-transparent text-gray-200 focus:outline-none"
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
            />
            
            {/* Submit button */}
            <motion.button
              type="submit"
              className="flex rounded-full items-center justify-center h-full px-4 text-amber-400 focus:outline-none bg-amber-500/20"
              whileHover={{ backgroundColor: 'rgba(245, 158, 11, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                whileHover={{ scale: 1.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.button>
          </form>
        </motion.div>

        {/* Dropdown suggestions */}
        <AnimatePresence>
          {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 shadow-2xl rounded-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Recent searches */}
              {recentSearches.length > 0 && searchQuery.length === 0 && (
                <div className="p-2">
                  <div className="text-gray-400 text-xs font-medium px-3 py-1.5">Tìm kiếm gần đây</div>
                  {recentSearches.map((text, index) => (
                    <motion.div
                      key={`recent-${index}`}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex items-center"
                      onClick={() => handleSelectSuggestion(text)}
                      whileHover={{ x: 5 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white">{text}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Filtered suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-gray-400 text-xs font-medium px-3 py-1.5">Kết quả gợi ý</div>
                  {filteredSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-md flex justify-between items-center"
                      onClick={() => handleSelectSuggestion(suggestion.text)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-white">{suggestion.text}</span>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{suggestion.category}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchQuery.length > 0 && filteredSuggestions.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  Không tìm thấy kết quả phù hợp
                </div>
              )}

              {/* Popular searches */}
              <div className="px-3 py-2 border-t border-gray-700 flex flex-wrap gap-2">
                <span className="text-gray-400 text-xs">Tìm kiếm phổ biến:</span>
                {['Honda', 'Yamaha', 'Mũ bảo hiểm', 'Ducati'].map((term, index) => (
                  <motion.span
                    key={index}
                    className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                    onClick={() => handleSelectSuggestion(term)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {term}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchComponent;