import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
  {
    id: 1,
    title: 'Giá Trị Tốt Nhất',
    description: 'Nhận giá cao hơn thị trường từ 5-10% nhờ mạng lưới đối tác rộng khắp.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-600 to-green-700'
  },
  {
    id: 2,
    title: 'Nhanh Chóng & Tiện Lợi',
    description: 'Quy trình bán xe nhanh chóng và có thể hoàn tất trong vòng 48 giờ.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 3,
    title: 'An Toàn & Bảo Mật',
    description: 'Bảo vệ thông tin cá nhân và đảm bảo giao dịch an toàn qua hệ thống kiểm duyệt.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'from-purple-600 to-purple-700'
  },
  {
    id: 4,
    title: 'Hỗ Trợ Pháp Lý',
    description: 'Đội ngũ chuyên môn hỗ trợ hoàn tất mọi thủ tục pháp lý miễn phí.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'from-red-600 to-red-700'
  },
  {
    id: 5,
    title: 'Tiếp Cận Rộng',
    description: 'Tin đăng được hiển thị cho hàng ngàn người mua tiềm năng trên nền tảng của chúng tôi.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    color: 'from-yellow-600 to-yellow-700'
  },
  {
    id: 6,
    title: 'Dịch Vụ Cao Cấp',
    description: 'Hỗ trợ riêng từ chuyên viên tư vấn để tối ưu hóa giá bán và quy trình giao dịch.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    color: 'from-amber-500 to-amber-700'
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Lợi Ích Khi <span className="text-amber-500">Bán Xe</span> Với Chúng Tôi
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Chúng tôi mang đến trải nghiệm bán xe máy tốt nhất với các lợi ích nổi bật
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group"
            >
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">{benefit.title}</h3>
                </div>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Hơn 90% khách hàng hài lòng với dịch vụ bán xe của chúng tôi và giới thiệu cho bạn bè
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;