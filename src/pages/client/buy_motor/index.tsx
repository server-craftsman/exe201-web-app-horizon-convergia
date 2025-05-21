import React, { useState } from 'react';
import HeroSection from '../../../components/client/buy_motor/HeroSection.com';
import FeaturedMotorcycles from '../../../components/client/buy_motor/FeaturedMotorcycles.com';
import MotorcycleCategories from '../../../components/client/buy_motor/MotorcycleCategories.com';
import FilterComponent from '../../../components/client/buy_motor/FilterComponent.com';
import MotorcycleList from '../../../components/client/buy_motor/MotorcycleList.com';
import TestimonialSection from '../../../components/client/buy_motor/TestimonialSection.com';

const BuyMotorPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Motorcycles */}
      <FeaturedMotorcycles />
      
      {/* Motorcycle Categories */}
      <MotorcycleCategories />
      
      {/* Main Content with Filters and Product List */}
      <section className="py-12 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">
              Khám Phá <span className="text-amber-500">Bộ Sưu Tập</span> Xe Máy
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Tìm kiếm và lựa chọn mẫu xe phù hợp với nhu cầu và phong cách của bạn
            </p>
          </div>
          
          {/* Filter Component */}
          <FilterComponent onFilter={handleFilterChange} />
          
          {/* Product Grid */}
          <MotorcycleList filters={activeFilters} />
        </div>
      </section>
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn Sàng Để <span className="text-amber-500">Lái Thử</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Đặt lịch ngay hôm nay để trải nghiệm cảm giác lái xe tuyệt vời và được tư vấn bởi đội ngũ chuyên nghiệp của chúng tôi
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all">
                Đặt Lịch Lái Thử
              </button>
              <button className="px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all">
                Liên Hệ Tư Vấn
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-20">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 text-center">Bảo Hành Chính Hãng</h3>
                <p className="text-gray-400 text-center">Tất cả sản phẩm đều được bảo hành chính hãng theo tiêu chuẩn quốc tế</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 text-center">Đội Ngũ Chuyên Nghiệp</h3>
                <p className="text-gray-400 text-center">Nhân viên tư vấn và kỹ thuật viên được đào tạo bài bản, chuyên nghiệp</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 text-center">Trả Góp 0% Lãi Suất</h3>
                <p className="text-gray-400 text-center">Hỗ trợ mua xe trả góp với nhiều gói ưu đãi hấp dẫn và lãi suất thấp</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyMotorPage;