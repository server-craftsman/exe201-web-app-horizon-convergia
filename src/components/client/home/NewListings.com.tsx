import React from 'react';
import { Link } from 'react-router-dom';
import { newListings } from '../../../data/homeData';

const NewListings: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            Xe Mới Đăng
          </h2>
          <Link to="/mua-xe" className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newListings.map(item => (
            <Link key={item.id} to={`/mua-xe/${item.slug}`} className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group-hover:shadow-2xl group-hover:border-amber-200 transition-all duration-500">
                <div className="relative h-48">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.year}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors duration-300">{item.title}</h3>
                  <p className="text-amber-600 font-bold text-xl mb-3">{item.price.toLocaleString()} ₫</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.location}</span>
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">Mới đăng</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewListings; 