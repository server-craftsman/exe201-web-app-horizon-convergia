import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Thực hiện gửi email đăng ký
    setIsSubmitted(true);
    setEmail('');
    
    // Reset state sau 3 giây
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-400 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white opacity-10"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900/30 backdrop-blur-sm p-8 sm:p-12 rounded-2xl max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Đăng Ký Nhận Bản Tin
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/90 max-w-xl mx-auto"
            >
              Đăng ký để nhận những tin tức mới nhất về xe máy, sự kiện, khuyến mãi và mẹo bảo dưỡng hữu ích trực tiếp vào hộp thư của bạn.
            </motion.p>
          </div>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn"
              required
              className="flex-1 px-5 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-300 flex-shrink-0"
            >
              {isSubmitted ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Đã Đăng Ký
                </span>
              ) : (
                "Đăng Ký Ngay"
              )}
            </button>
          </motion.form>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/70 text-sm text-center mt-5"
          >
            Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscribe;