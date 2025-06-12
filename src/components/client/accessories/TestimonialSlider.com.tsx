// src/components/client/accessories/TestimonialSlider.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Biker chuyên nghiệp',
    quote: 'Phụ kiện tại Horizon Convergia có chất lượng tuyệt vời. Tôi đã mua mũ bảo hiểm AGV Pista GP RR và nó vượt xa mong đợi của tôi về độ an toàn và thoải mái.',
    rating: 5,
    product: 'Mũ Bảo Hiểm AGV Pista GP RR'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Biker nghiệp dư',
    quote: 'Găng tay Alpinestars mà tôi mua từ cửa hàng là sự đầu tư tốt nhất cho việc lái xe của tôi. Chúng mang lại cảm giác thoải mái và độ bám tốt trên tay lái.',
    rating: 5,
    product: 'Găng Tay Alpinestars GP Pro R3'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    role: 'Kỹ sư cơ khí',
    quote: 'Ống xả Akrapovic đã hoàn toàn thay đổi trải nghiệm lái xe của tôi. Âm thanh tuyệt vời và hiệu suất được cải thiện rõ rệt. Dịch vụ lắp đặt cũng rất chuyên nghiệp.',
    rating: 4,
    product: 'Ống Xả Akrapovic Evolution Line'
  }
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    setIsAutoplay(false);
  };

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Khách Hàng <span className="text-amber-500">Đánh Giá</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Xem nhận xét từ những khách hàng đã sử dụng các sản phẩm phụ kiện xe máy của chúng tôi
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/5"
            onMouseEnter={() => setIsAutoplay(false)}
            onMouseLeave={() => setIsAutoplay(true)}
          >
            {/* Quote icon */}
            <div className="absolute -top-6 -left-6 text-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-600'}`}
                  ></div>
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4">
                      <img 
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < testimonials[currentIndex].rating ? 'text-amber-400' : 'text-gray-600'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{testimonials[currentIndex].product}</p>
                  </div>
                  
                  <div className="flex-1">
                    <blockquote className="text-white text-lg md:text-xl mb-6 leading-relaxed">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    
                    <div className="text-center md:text-left">
                      <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <AnimatePresence>
                <motion.div 
                  key={`progress-${currentIndex}`}
                  className="h-full bg-amber-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  exit={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;