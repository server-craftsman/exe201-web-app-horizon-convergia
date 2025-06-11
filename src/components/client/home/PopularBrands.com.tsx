import React from 'react';
import { Link } from 'react-router-dom';
import { popularBrands } from '../../../data/homeData';

const PopularBrands: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 relative">
          <span className="relative z-10">THƯƠNG HIỆU NỔI BẬT</span>
          <span className="absolute w-20 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2"></span>
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {popularBrands.map(brand => (
            <Link key={brand.id} to={`/thuong-hieu/${brand.slug}`} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center p-2 mb-3 border border-gray-200 group-hover:border-amber-400 group-hover:shadow-amber-200/50 transition-all duration-300 transform group-hover:scale-110">
                <img src={brand.image} alt={brand.name} className="w-14 h-14 object-contain" />
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors duration-300">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands; 