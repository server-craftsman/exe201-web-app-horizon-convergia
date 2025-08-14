import React, { useState } from 'react';
import { useProduct } from '@hooks/modules/useProduct';
import { Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';
import { motion } from 'framer-motion';

// Import ProductResponse type
import type { ProductResponse } from '../../../types/product/Product.res.type';

const sortOptions = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'price_asc', label: 'Giá: Thấp đến cao' },
  { id: 'price_desc', label: 'Giá: Cao đến thấp' },
  { id: 'name_asc', label: 'Tên: A-Z' },
  { id: 'name_desc', label: 'Tên: Z-A' }
];

interface MotorcycleListProps {
  filters?: any;
}

const MotorcycleList: React.FC<MotorcycleListProps> = ({ filters }) => {
  const { useProducts } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 6;

  // Fetch products
  const { data: allProducts = [], isLoading, error } = useProducts({
    sortField: 'createdAt',
    ascending: false,
    pageNumber: 1,
    pageSize: 100 // Get more products for filtering
  });

  // Filter verified products
  const verifiedProducts = allProducts.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4)
  );

  // Filtering function
  const filterMotorcycles = (motorcycles: ProductResponse[]) => {
    if (!filters || Object.keys(filters).length === 0) {
      return motorcycles;
    }

    return motorcycles.filter(motorcycle => {
      let match = true;

      // Filter by brand
      if (filters.brands && filters.brands.length > 0) {
        match = match && filters.brands.includes(motorcycle.brand);
      }

      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        match = match && filters.categories.includes(motorcycle.categoryId);
      }

      // Filter by price range
      if (filters.priceRange) {
        const price = motorcycle.price;
        match = match && price >= filters.priceRange.min;
        if (filters.priceRange.max !== null) {
          match = match && price <= filters.priceRange.max;
        }
      }

      // Filter by engine size (cc)
      if (filters.engineTypes && filters.engineTypes.length > 0) {
        const engineCc = motorcycle.engineCapacity || 0;
        let engineMatch = false;

        filters.engineTypes.forEach((engineTypeId: number) => {
          switch (engineTypeId) {
            case 1: // 100cc - 175cc
              if (engineCc >= 100 && engineCc <= 175) engineMatch = true;
              break;
            case 2: // 175cc - 400cc
              if (engineCc > 175 && engineCc <= 400) engineMatch = true;
              break;
            case 3: // 400cc - 750cc
              if (engineCc > 400 && engineCc <= 750) engineMatch = true;
              break;
            case 4: // 750cc - 1000cc
              if (engineCc > 750 && engineCc <= 1000) engineMatch = true;
              break;
            case 5: // Trên 1000cc
              if (engineCc > 1000) engineMatch = true;
              break;
          }
        });

        match = match && engineMatch;
      }

      return match;
    });
  };

  // Apply filtering
  const filteredMotorcycles = filterMotorcycles(verifiedProducts);

  // Sorting function
  const sortMotorcycles = (sortType: string, data: ProductResponse[]) => {
    let sortedData = [...data];

    switch (sortType) {
      case 'price_asc':
        sortedData.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedData.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        sortedData.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
      case 'name_desc':
        sortedData.sort((a, b) => `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`));
        break;
      case 'newest':
      default:
        sortedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sortedData;
  };

  // Apply sorting
  const sortedMotorcycles = sortMotorcycles(sortBy, filteredMotorcycles);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(sortedMotorcycles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMotorcycles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-white">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-red-400">Có lỗi xảy ra khi tải sản phẩm.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Actions bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <p className="text-white font-medium">
              Hiển thị {sortedMotorcycles.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, sortedMotorcycles.length)} trong {sortedMotorcycles.length} sản phẩm
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center mt-4 md:mt-0 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="sort-by" className="text-white mr-2 whitespace-nowrap">Sắp xếp theo:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((motorcycle) => (
            <motion.div
              key={motorcycle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group relative"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-medium">
                  {motorcycle.condition}
                </div>
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                  {motorcycle.year}
                </div>
              </div>

              {/* Favorite button */}
              <motion.button
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>

              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30 z-0"></div>

                <img
                  src={motorcycle.imageUrls && motorcycle.imageUrls.length > 0
                    ? motorcycle.imageUrls[0]
                    : 'https://via.placeholder.com/400x200?text=No+Image'
                  }
                  alt={`${motorcycle.brand} ${motorcycle.model}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                />

                {/* Brand badge */}
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                  {motorcycle.brand}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {motorcycle.brand} {motorcycle.model}
                </h3>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{motorcycle.engineCapacity}cc</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{motorcycle.year}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{motorcycle.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{motorcycle.color}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 my-4"></div>

                {/* Price and action */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-amber-400 font-bold text-xl">
                      {motorcycle.price.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <Link to={ROUTER_URL.CLIENT.PRODUCT_DETAIL.replace(':id', motorcycle.id)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-sm font-bold text-gray-900 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                    >
                      Chi tiết
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {currentItems.length === 0 && (
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
    </section>
  );
};

export default MotorcycleList; 