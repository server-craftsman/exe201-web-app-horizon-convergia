// src/components/client/accessories/ProductCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ProductType {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
}

interface ProductCardProps {
  product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discounted price
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
            Mới
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-medium">
            Nổi bật
          </span>
        )}
        {product.discount && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Quick actions */}
      <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>

      {/* Image */}
      <div className="h-56 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Category badge */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
          {product.category}
        </div>
        
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">Hết Hàng</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < product.rating ? 'text-amber-400' : 'text-gray-600'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-400 text-xs">({product.reviewCount} đánh giá)</span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-amber-400 font-bold text-xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedPrice)}
            </p>
            {product.discount && (
              <p className="text-gray-500 text-sm line-through">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!product.inStock}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${product.inStock ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 hover:shadow-lg hover:shadow-amber-500/20' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            // src/components/client/accessories/ProductCard.tsx
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;