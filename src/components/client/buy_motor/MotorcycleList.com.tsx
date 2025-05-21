import React, { useState } from 'react';
import MotorcycleCard, { type MotorcycleType } from './MotorcycleCard.com';

// Dữ liệu mẫu cho danh sách xe máy
const motorcyclesData: MotorcycleType[] = [
  {
    id: 1,
    name: 'Honda CBR1000RR-R Fireblade',
    brand: 'Honda',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '799,000,000',
    specs: {
      engine: '1000cc',
      power: '214 HP',
      speed: '299 km/h',
      weight: '201 kg'
    },
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    name: 'Ducati Panigale V4',
    brand: 'Ducati',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '950,000,000',
    specs: {
      engine: '1103cc',
      power: '221 HP',
      speed: '305 km/h',
      weight: '195 kg'
    },
    discount: 5
  },
  {
    id: 3,
    name: 'Kawasaki Ninja ZX-10R',
    brand: 'Kawasaki',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '729,000,000',
    specs: {
      engine: '998cc',
      power: '200 HP',
      speed: '300 km/h',
      weight: '207 kg'
    },
    isFeatured: true
  },
  {
    id: 4,
    name: 'BMW S1000RR',
    brand: 'BMW',
    image: 'https://images.unsplash.com/photo-1547549082-6bc09f2049ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '859,000,000',
    specs: {
      engine: '999cc',
      power: '205 HP',
      speed: '302 km/h',
      weight: '197 kg'
    },
    isNew: true
  },
  {
    id: 5,
    name: 'Yamaha YZF-R1',
    brand: 'Yamaha',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '789,000,000',
    specs: {
      engine: '998cc',
      power: '198 HP',
      speed: '299 km/h',
      weight: '199 kg'
    },
    discount: 8
  },
  {
    id: 6,
    name: 'Triumph Street Triple RS',
    brand: 'Triumph',
    image: 'https://triumph-saigon.com/wp-content/uploads/2021/10/street-triple-765-rs-step-carousel-2-1410x793-1.jpg',
    price: '450,000,000',
    specs: {
      engine: '765cc',
      power: '121 HP',
      speed: '258 km/h',
      weight: '168 kg'
    },
    isFeatured: true
  },
  {
    id: 7,
    name: 'Harley-Davidson Road King',
    brand: 'Harley-Davidson',
    image: 'https://images.ctfassets.net/5vy1mse9fkav/5B23fhAuNkfUUt8wW7E5Or/a2ccc40ceaee24239a1a535fa74a6afa/2025-road-king-special-kf1-slc-1_1_.jpg',
    price: '843,000,000',
    specs: {
      engine: '1746cc',
      power: '87 HP',
      speed: '180 km/h',
      weight: '372 kg'
    }
  },
  {
    id: 8,
    name: 'KTM 1290 Super Duke R',
    brand: 'KTM',
    image: 'https://autobike.com.vn/wp-content/uploads/2023/03/ktm-11290-super-duke-r-xemay24g-anhdaidien-3.jpg',
    price: '659,000,000',
    specs: {
      engine: '1301cc',
      power: '180 HP',
      speed: '270 km/h',
      weight: '189 kg'
    },
    isNew: true
  }
];

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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 6;

  // Filtering function
  const filterMotorcycles = (motorcycles: MotorcycleType[]) => {
    if (!filters || Object.keys(filters).length === 0) {
      return motorcycles;
    }

    return motorcycles.filter(motorcycle => {
      let match = true;
      
      // Filter by brand
      if (filters.brands && filters.brands.length > 0) {
        match = match && filters.brands.includes(motorcycle.brand);
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const price = parseInt(motorcycle.price.replace(/,/g, ''));
        match = match && price >= filters.priceRange[0] && price <= filters.priceRange[1];
      }
      
      // Filter by features
      if (filters.features) {
        if (filters.features.isNew && !motorcycle.isNew) {
          match = false;
        }
        if (filters.features.isFeatured && !motorcycle.isFeatured) {
          match = false;
        }
        if (filters.features.hasDiscount && !motorcycle.discount) {
          match = false;
        }
      }

      // Filter by engine size (cc)
      if (filters.engineSize && filters.engineSize.length > 0) {
        const engineCc = parseInt(motorcycle.specs.engine.replace('cc', ''));
        let engineMatch = false;
        
        filters.engineSize.forEach((range: string) => {
          if (range === '1000+' && engineCc >= 1000) {
            engineMatch = true;
          } else if (range === '600-1000' && engineCc >= 600 && engineCc < 1000) {
            engineMatch = true;
          } else if (range === '400-600' && engineCc >= 400 && engineCc < 600) {
            engineMatch = true;
          } else if (range === '<400' && engineCc < 400) {
            engineMatch = true;
          }
        });
        
        match = match && engineMatch;
      }
      
      return match;
    });
  };

  // Apply filtering
  const filteredMotorcycles = filterMotorcycles(motorcyclesData);

  // Sorting function
  const sortMotorcycles = (sortType: string, data: MotorcycleType[]) => {
    let sortedData = [...data];
    
    switch (sortType) {
      case 'price_asc':
        sortedData.sort((a, b) => 
          parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))
        );
        break;
      case 'price_desc':
        sortedData.sort((a, b) => 
          parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))
        );
        break;
      case 'name_asc':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // Assuming id represents the newest items (higher id = newer)
        sortedData.sort((a, b) => b.id - a.id);
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
            
            <div className="flex space-x-2">
              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button className="bg-amber-500 text-gray-900 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((motorcycle) => (
            <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
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