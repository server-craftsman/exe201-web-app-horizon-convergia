import React from 'react';
import { Link } from 'react-router-dom';

const SellingCta: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/100')] bg-repeat"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full translate-x-1/3 translate-y-1/3 backdrop-blur-xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Biến Xe Máy Của Bạn Thành Tiền Mặt</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Đăng tin miễn phí và tiếp cận hàng ngàn người mua tiềm năng trên nền tảng của chúng tôi.</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/ban-xe" className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 font-bold px-10 py-4 rounded-lg hover:from-amber-400 hover:to-amber-300 transition-colors duration-300 shadow-xl shadow-amber-500/20 transform hover:-translate-y-1">
            Đăng Bán Xe Ngay
          </Link>
          <Link to="/huong-dan-ban-xe" className="inline-block bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-lg hover:bg-white/10 transition-all duration-300">
            Hướng Dẫn Bán Xe
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellingCta; 