import React from 'react';
import { Link } from 'react-router-dom';
import { accessories } from '../../../data/homeData';

const Accessories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            Phụ Kiện Cao Cấp
          </h2>
          <Link to="/phu-kien" className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {accessories.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-500 group">
              <div className="relative h-48">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {item.discount && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{item.discount}%
                  </div>
                )}
                {item.isNew && (
                  <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Mới
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-amber-600 font-bold text-xl mb-1">{item.price.toLocaleString()} ₫</p>
                {item.originalPrice && (
                  <p className="text-gray-400 text-sm line-through mb-3">{item.originalPrice.toLocaleString()} ₫</p>
                )}
                <button className="w-full bg-gray-800 hover:bg-amber-500 text-white font-medium py-2 rounded-lg transition-colors duration-300">Thêm vào giỏ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories; 