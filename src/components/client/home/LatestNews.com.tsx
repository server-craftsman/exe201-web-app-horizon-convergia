import React from 'react';
import { Link } from 'react-router-dom';
import { latestNews } from '../../../data/homeData';

const LatestNews: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            Tin Tức & Kiến Thức
          </h2>
          <Link to="/tin-tuc" className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map(news => (
            <Link key={news.id} to={`/tin-tuc/${news.slug}`} className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-transparent hover:border-amber-200">
                <div className="relative h-52">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-xs font-medium text-white bg-amber-500 rounded-full inline-block px-3 py-1">
                      {news.date}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm flex-grow">{news.excerpt}</p>
                  <div className="flex items-center text-amber-600 font-medium text-sm mt-auto">
                    <span>Đọc tiếp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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

export default LatestNews;