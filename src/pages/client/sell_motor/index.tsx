import React from 'react';
import HeroSection from '../../../components/client/sell_motor/HeroSection.com';
import SellProcessSteps from '../../../components/client/sell_motor/SellProcessSteps.com';
import BenefitsSection from '../../../components/client/sell_motor/BenefitsSection.com';
import PricingCalculator from '../../../components/client/sell_motor/PricingCalculator.com';
import SellerForm from '../../../components/client/sell_motor/SellerForm.com';

const SellMotorPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Sell Process Steps */}
      <SellProcessSteps />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Pricing Calculator */}
      <PricingCalculator />
      
      {/* Seller Form */}
      <SellerForm />
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bạn Vẫn Còn <span className="text-amber-500">Thắc Mắc</span>?
            </h2>
            <p className="text-gray-300 mb-8">
              Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để được giải đáp mọi thắc mắc về việc bán xe máy của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:1900123456" 
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Gọi Ngay: 0869 872 830
              </a>
              <a 
                href="mailto:chuahoangphaptrunguongfake@gmail.com" 
                className="px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Hỗ Trợ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellMotorPage;