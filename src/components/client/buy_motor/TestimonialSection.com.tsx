import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dữ liệu lời chứng thực
const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Doanh nhân',
    quote: 'Tôi đã mua chiếc Honda CBR1000RR-R Fireblade tại Horizon Convergia và thực sự hài lòng với chất lượng phục vụ. Nhân viên tư vấn rất chuyên nghiệp và am hiểu sản phẩm.',
    rating: 5,
    product: 'Honda CBR1000RR-R Fireblade'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Kỹ sư phần mềm',
    quote: 'Đây là lần đầu tiên tôi sở hữu một chiếc xe thể thao và tôi đã nhận được rất nhiều lời khuyên hữu ích từ đội ngũ tư vấn. Chiếc Kawasaki Ninja ZX-10R vượt xa mong đợi của tôi!',
    rating: 5,
    product: 'Kawasaki Ninja ZX-10R'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    role: 'Bác sĩ',
    quote: 'Chính sách bảo hành và hậu mãi tại Horizon Convergia rất tốt. Tôi đã mua chiếc BMW S1000RR và được hỗ trợ tận tình mọi lúc tôi cần.',
    rating: 4,
    product: 'BMW S1000RR'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    role: 'Giám đốc marketing',
    quote: 'Tôi thực sự ấn tượng với sự đa dạng của các mẫu xe tại Horizon Convergia. Đội ngũ kỹ thuật rất chuyên nghiệp và giúp tôi tìm được chiếc Ducati Panigale V4 phù hợp nhất với nhu cầu của mình.',
    rating: 5,
    product: 'Ducati Panigale V4'
  }
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 border-4 border-amber-500/10 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-amber-500/10 rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Khách Hàng <span className="text-amber-500">Nói Gì</span> Về Chúng Tôi
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Trải nghiệm thực tế từ những khách hàng đã mua xe tại Horizon Convergia
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main testimonial carousel */}
          <div 
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/5"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <div className="absolute top-0 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-amber-500 rounded-xl rotate-45 z-0 opacity-20"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 text-amber-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Customer image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img 
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Testimonial content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonials[activeIndex].rating ? 'text-amber-400' : 'text-gray-600'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-400">cho {testimonials[activeIndex].product}</span>
                    </div>
                    
                    <blockquote className="text-white text-lg md:text-xl mb-6 leading-relaxed">
                      "{testimonials[activeIndex].quote}"
                    </blockquote>
                    
                    <div>
                      <h4 className="text-white font-bold text-lg">{testimonials[activeIndex].name}</h4>
                      <p className="text-gray-400">{testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <AnimatePresence>
                <motion.div 
                  key={`progress-${activeIndex}`}
                  className="h-full bg-amber-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  exit={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Testimonial navigation */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-amber-500' : 'bg-gray-700'}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Tham gia cùng hơn 5,000+ khách hàng hài lòng đã lựa chọn Horizon Convergia là đối tác tin cậy
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            Khám Phá Xe Ngay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection; 