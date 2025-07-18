import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@hooks/modules/useProduct';
import { ROUTER_URL } from '@consts/router.path.const';

const NewListings: React.FC = () => {
  const { useProducts } = useProduct();

  // Fetch latest products with pagination (8 items for grid display)
  const { data: products = [], isLoading, error } = useProducts({
    sortField: 'createdAt',
    ascending: false, // Get newest first
    pageNumber: 1,
    pageSize: 8
  });

  // Filter only verified and active products for public display
  const activeProducts = products.filter(product =>
    product.isVerified && (product.status === 0 || product.status === 3 || product.status === 4)
  );

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            XE MỚI ĐĂNG
          </h2>
          <Link
            to={ROUTER_URL.CLIENT.BUY_MOTOR}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300"
          >
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có sản phẩm nào được đăng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeProducts.map((product) => (
              <Link
                key={product.id}
                to={`${ROUTER_URL.CLIENT.PRODUCT_LIST_BY_CATEGORY_ID}/${product.categoryId}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group-hover:shadow-2xl group-hover:border-amber-200 transition-all duration-500">
                  <div className="relative h-48">
                    <img
                      src={product.imageUrls && product.imageUrls.length > 0
                        ? product.imageUrls[0]
                        : 'https://via.placeholder.com/300x200?text=No+Image'
                      }
                      alt={`${product.brand} ${product.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.year}
                    </div>
                    <div className="absolute top-3 left-3 bg-amber-400/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.condition}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                      {product.brand} {product.model}
                    </h3>
                    <p className="text-amber-600 font-bold text-xl mb-3">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{product.location}</span>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                        Mới đăng
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewListings; 