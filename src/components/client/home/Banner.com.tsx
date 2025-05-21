import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dữ liệu slider
const sliderData = [
  {
    id: 1,
    title: "Nâng Tầm Trải Nghiệm <span>Lái Xe</span> Của Bạn",
    description: "Khám phá bộ sưu tập xe máy và phụ kiện cao cấp, chất lượng hàng đầu",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bgColor: "from-gray-900 via-gray-800 to-gray-900"
  },
  {
    id: 2,
    title: "Đẳng Cấp & <span>Phong Cách</span>",
    description: "Trải nghiệm cảm giác lái xe đỉnh cao với những mẫu xe đẳng cấp nhất",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bgColor: "from-indigo-900 via-purple-800 to-indigo-900"
  },
  {
    id: 3,
    title: "Phụ Kiện <span>Cao Cấp</span> Chính Hãng",
    description: "Nâng cấp xế yêu của bạn với những phụ kiện chất lượng từ các thương hiệu uy tín",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bgColor: "from-amber-900 via-red-800 to-amber-900"
  }
];

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<number | null>(null);
  
  // Xử lý autoplay
  useEffect(() => {
    if (isAutoplay) {
      // Clear any existing interval first
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
      }
      
      // Set new interval
      autoplayRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % sliderData.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isAutoplay]);
  
  // Xử lý dừng autoplay khi hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);
  
  // Chuyển đến slide trước
  const prevSlide = () => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(prev => (prev - 1 + sliderData.length) % sliderData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };
  
  // Chuyển đến slide sau
  const nextSlide = () => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(prev => (prev + 1) % sliderData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };

  // Chuyển đến slide cụ thể
  const goToSlide = (index: number) => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setCurrentSlide(index);
    // Restart autoplay after manual navigation
    setTimeout(() => setIsAutoplay(true), 100);
  };
  
  const currentSlideData = sliderData[currentSlide];

  return (
    <section 
      className="relative h-[500px] overflow-hidden" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Gradient with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.bgColor}`}
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://via.placeholder.com/100')] opacity-10 bg-repeat"></div>
          
          {/* Moving Particles Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%", 
                  scale: Math.random() * 0.5 + 0.5 
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 + "%", 
                    Math.random() * 100 + "%",
                    Math.random() * 100 + "%"
                  ],
                  y: [
                    Math.random() * 100 + "%", 
                    Math.random() * 100 + "%",
                    Math.random() * 100 + "%"
                  ],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full flex items-center overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                dangerouslySetInnerHTML={{ 
                  __html: currentSlideData.title.replace(
                    /<span>(.*?)<\/span>/g, 
                    '<span class="text-amber-400">$1</span>'
                  ) 
                }}
              />
              
              <motion.p 
                className="text-gray-300 text-xl mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {currentSlideData.description}
              </motion.p>
              
              {/* <motion.div 
                className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Tìm kiếm xe máy, phụ kiện..."
                      className="w-full px-5 py-3 rounded-md bg-white/10 border border-gray-500 focus:outline-none focus:border-amber-400 text-white transition-all duration-300 backdrop-blur-md"
                    />
                  </div>
                  <motion.button 
                    className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 font-bold py-3 px-6 rounded-md hover:from-amber-400 hover:to-amber-300 shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Tìm kiếm
                  </motion.button>
                </div>
              </motion.div> */}
              
              {/* Scroll Down Indicator */}
              <motion.div 
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <div className="text-white text-sm font-medium text-center mb-2">Khám phá</div>
                <div className="w-6 h-10 border-2 border-white rounded-full mx-auto flex justify-center">
                  <motion.div 
                    className="w-1 h-2 bg-white rounded-full mt-2"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute right-0 bottom-0 w-1/2 h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="h-full w-full bg-contain bg-no-repeat bg-right-bottom opacity-90"
              style={{ backgroundImage: `url('${currentSlideData.image}')` }}
            />
            
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-30" />
            
            {/* Floating Elements */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-16 h-16 md:w-24 md:h-24 bg-amber-400/20 rounded-full mix-blend-screen"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-8 h-8 md:w-12 md:h-12 bg-blue-500/20 rounded-full mix-blend-screen"
              animate={{ 
                scale: [1, 1.5, 1],
                x: [0, 30, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-lg z-10"
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      
      <motion.button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-lg z-10"
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {sliderData.map((_, index) => (
          <motion.button
            key={index}
            className={`w-4 h-4 rounded-full ${currentSlide === index ? 'bg-amber-400' : 'bg-white/50 hover:bg-white/70'} shadow-md`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            animate={{ 
              scale: currentSlide === index ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              duration: currentSlide === index ? 1.5 : 0.3, 
              repeat: currentSlide === index ? Infinity : 0
            }}
          />
        ))}
      </div>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`progress-${currentSlide}`}
            className="h-full bg-amber-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            exit={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Banner; 