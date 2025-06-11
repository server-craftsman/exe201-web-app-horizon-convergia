import React from 'react';
import HeroSection from '../../../components/client/news/HeroSection.com';
import NewsCategories from '../../../components/client/news/NewsCategories.com';
import FeaturedNews from '../../../components/client/news/FeaturedNews.com';
import LatestNews from '../../../components/client/news/LatestNews.com';
import NewsletterSubscribe from '../../../components/client/news/NewsletterSubscribe.com';
import PopularTags from '../../../components/client/news/PopularTags.com';
import NewsSearchBar from '../../../components/client/news/NewsSearchBar.com';

const NewsPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search & Categories */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <NewsSearchBar />
          </div>
        </div>
      </section>
      
      {/* News Categories */}
      <NewsCategories />
      
      {/* Featured News */}
      <FeaturedNews />
      
      {/* Latest News */}
      <LatestNews />
      
      {/* Newsletter Subscribe */}
      <NewsletterSubscribe />
      
      {/* Popular Tags */}
      <PopularTags />
      
      {/* Call to Action */}
      <section className="py-16 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Khám Phá Thêm Những Sản Phẩm Xe Máy Tuyệt Vời Của Chúng Tôi
            </h2>
            <p className="text-gray-300 mb-8">
              Đến với showroom của Horizon Convergia để trải nghiệm những mẫu xe máy mới nhất và phụ kiện cao cấp
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/buy-motor" 
                className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-amber-400 transition-colors duration-300"
              >
                Mua Xe Máy
              </a>
              <a 
                href="/accessories" 
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Phụ Kiện Xe Máy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;