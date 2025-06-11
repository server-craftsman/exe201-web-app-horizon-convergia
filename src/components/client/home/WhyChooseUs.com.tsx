import React from 'react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white relative">
          <span className="relative z-10">TẠI SAO CHỌN HORIZON CONVERGIA</span>
          <span className="absolute w-20 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-2xl border border-gray-700 hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-400/20">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-amber-400">Đảm Bảo Chất Lượng</h3>
            <p className="text-gray-300 text-center">Mỗi xe và phụ kiện đều được kiểm tra kỹ lưỡng, đảm bảo chất lượng và độ tin cậy cao nhất.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-2xl border border-gray-700 hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-400/20">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-amber-400">Dịch Vụ Chuyên Nghiệp</h3>
            <p className="text-gray-300 text-center">Đội ngũ tư vấn chuyên nghiệp, tận tâm hỗ trợ bạn tìm được sản phẩm phù hợp nhất.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-2xl border border-gray-700 hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-400/20">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-amber-400">Uy Tín Hàng Đầu</h3>
            <p className="text-gray-300 text-center">Với hàng ngàn khách hàng hài lòng, chúng tôi tự hào là đối tác đáng tin cậy trong lĩnh vực xe máy.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 