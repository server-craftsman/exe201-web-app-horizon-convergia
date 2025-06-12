// src/components/client/accessories/ProductGrid.tsx
import React, { useState } from 'react';
import ProductCard, { type ProductType } from './ProductCard.com';

// Sample data for products
const sampleProducts: ProductType[] = [
  {
    id: 1,
    name: 'Mũ Bảo Hiểm AGV Pista GP RR',
    price: 28000000,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mũ Bảo Hiểm',
    rating: 5,
    reviewCount: 42,
    isNew: true,
    isFeatured: true,
    inStock: true
  },
  {
    id: 2,
    name: 'Găng Tay Alpinestars GP Pro R3',
    price: 4500000,
    image: 'https://imgwebikenet-8743.kxcdn.com/catalogue/images/112167/_files_product_3556719_s_GP_PRO_R3_GLOVES_1_jpg_w500px_h500px_TM.jpg',
    category: 'Găng Tay',
    rating: 4,
    reviewCount: 28,
    isFeatured: true,
    inStock: true
  },
  // Adding more sample products
  {
    id: 7,
    name: 'Mũ Bảo Hiểm Shoei X-Spirit III',
    price: 22000000,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1583421767449-8c37ca0045ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mũ Bảo Hiểm',
    rating: 5,
    reviewCount: 31,
    isNew: true,
    inStock: true
  },
  {
    // src/components/client/accessories/ProductGrid.tsx (continued)
    id: 8,
    name: 'Giày Motor Alpinestars SMX Plus V2',
    price: 7800000,
    image: 'https://images.unsplash.com/photo-1606563286969-467f1d28e6a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Giày Mô Tô',
    rating: 4,
    reviewCount: 19,
    inStock: true
  },
  {
    id: 9,
    name: 'Kính Mũ Bảo Hiểm Bell Race Star DLX',
    price: 3500000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mũ Bảo Hiểm',
    rating: 4,
    reviewCount: 23,
    inStock: true
  },
  {
    id: 10,
    name: 'Lốp Michelin Pilot Power 5 (190/55 ZR17)',
    price: 4600000,
    image: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Lốp & Vành',
    rating: 5,
    reviewCount: 37,
    inStock: true
  },
  {
    id: 11,
    name: 'Bộ Đàm Bluetooth Cardo Packtalk Bold',
    price: 8900000,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1558980394-34764db076b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Phụ Kiện Điện Tử',
    rating: 5,
    reviewCount: 29,
    isNew: true,
    inStock: true
  },
  {
    id: 12,
    name: 'Túi Đeo Hông Kriega R20',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1547549082-6bc09f2049ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Túi Đồ',
    rating: 4,
    reviewCount: 16,
    inStock: true
  }
];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp đến cao' },
  { value: 'price_desc', label: 'Giá: Cao đến thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' }
];

interface ProductGridProps {
  filters?: any;
  onFilterToggle: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onFilterToggle }) => {
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // This would be based on filters in a real app
  const filteredProducts = sampleProducts;
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return b.isFeatured ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="py-8">
      {/* Filter and Sort Bar */}
      <div className="bg-gray-800 rounded-lg mb-8 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={onFilterToggle}
            className="flex items-center text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg mr-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc
          </button>
          <span className="text-gray-400">
            Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} trong {sortedProducts.length} sản phẩm
          </span>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="sort-by" className="text-white mr-2">Sắp xếp:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Empty State */}
      {currentProducts.length === 0 && (
        <div className="py-20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm nào</h3>
          <p className="text-gray-400">Hãy thử điều chỉnh bộ lọc tìm kiếm của bạn</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => paginate(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-amber-500 text-gray-900 font-bold' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;