import React from 'react';
import { motion } from 'framer-motion';

export type MotorcycleType = {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: string;
  specs: {
    engine: string;
    power: string;
    speed: string;
    weight: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
};

interface MotorcycleCardProps {
  motorcycle: MotorcycleType;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group relative"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {motorcycle.isNew && (
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
            Mới
          </div>
        )}
        {motorcycle.isFeatured && (
          <div className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-medium">
            Nổi bật
          </div>
        )}
        {motorcycle.discount && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
            -{motorcycle.discount}%
          </div>
        )}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30 z-0"></div>
        
        <img 
          src={motorcycle.image} 
          alt={motorcycle.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Brand badge */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
          {motorcycle.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
          {motorcycle.name}
        </h3>
        
        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-gray-400 text-sm">{motorcycle.specs.engine}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400 text-sm">{motorcycle.specs.speed}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400 text-sm">{motorcycle.specs.power}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span className="text-gray-400 text-sm">{motorcycle.specs.weight}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700 my-4"></div>

        {/* Price and action */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-amber-400 font-bold text-xl">
              {motorcycle.price} VND
            </p>
            {motorcycle.discount && (
              <p className="text-gray-500 text-sm line-through">
                {(parseInt(motorcycle.price.replace(/,/g, '')) * (100 / (100 - motorcycle.discount))).toLocaleString()} VND
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-sm font-bold text-gray-900 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            Chi tiết
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MotorcycleCard; 