// src/pages/client/accessories/index.tsx
import React, { useState } from 'react';
import HeroSection from '../../../components/client/accessories/HeroSection.com';
import PopularCategories from '../../../components/client/accessories/PopularCategories.com';
import FeaturedProducts from '../../../components/client/accessories/FeaturedProducts.com';
import PromotionBanner from '../../../components/client/accessories/PromotionBanner.com';
import FilterSidebar from '../../../components/client/accessories/FilterSidebar.com';
import ProductGrid from '../../../components/client/accessories/ProductGrid.com';
import BrandShowcase from '../../../components/client/accessories/BrandShowcase.com';
import TestimonialSlider from '../../../components/client/accessories/TestimonialSlider.com';

const AccessoriesPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Popular Categories */}
      <PopularCategories />
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* Promotion Banner */}
      <PromotionBanner />
      
      {/* Products Catalog with Filter */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">
              Khám Phá <span className="text-amber-500">Phụ Kiện</span> Chất Lượng Cao
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Bộ sưu tập phụ kiện xe máy đa dạng và cao cấp để nâng tầm trải nghiệm lái xe của bạn
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-1/4">
              <FilterSidebar 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilter={handleFilterChange}
              />
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <ProductGrid 
                filters={filters}
                onFilterToggle={toggleFilter}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Slider */}
      <TestimonialSlider />
      
      {/* Brand Showcase */}
      <BrandShowcase />
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Nâng Cấp Trải Nghiệm Lái Xe Của Bạn Ngay Hôm Nay</h2>
            <p className="text-gray-800 text-lg mb-8">
              Từ mũ bảo hiểm cao cấp đến phụ kiện trang trí, chúng tôi cung cấp mọi thứ bạn cần để nâng tầm chiếc xe máy của mình. Mua sắm ngay để nhận ưu đãi độc quyền!
            </p>
            <a 
              href="#featured-products" 
              className="inline-block px-8 py-4 bg-gray-900 text-white font-medium rounded-lg shadow-lg hover:bg-gray-800 transition-colors transform hover:scale-105 duration-300"
            >
              Khám Phá Phụ Kiện
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccessoriesPage;