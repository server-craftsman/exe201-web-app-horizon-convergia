import React from 'react';
import { testimonials } from '../../../data/homeData';

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 relative">
          <span className="relative z-10">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</span>
          <span className="absolute w-20 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl shadow border border-gray-100 relative">
              <div className="text-amber-400 absolute -top-5 left-6">
                <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7984 0.139C12.9984 0.139 13.9984 0.439 14.7984 1.039C15.5984 1.639 16.1984 2.339 16.5984 3.139C16.9984 3.839 17.1984 4.639 17.1984 5.539C17.1984 6.439 16.9984 7.339 16.5984 8.239C16.1984 9.039 15.5984 9.839 14.7984 10.539C13.9984 11.239 13.0984 11.839 12.0984 12.339L11.0984 12.839C11.3984 13.339 11.8984 13.839 12.5984 14.339C13.2984 14.839 14.1984 15.339 15.2984 15.839C16.3984 16.339 17.5984 16.839 18.9984 17.339L16.7984 22.139C14.7984 21.539 12.9984 20.839 11.3984 20.039C9.79844 19.239 8.39844 18.339 7.19844 17.339C5.99844 16.339 4.99844 15.239 4.19844 14.039C3.39844 12.839 2.79844 11.639 2.39844 10.439C1.99844 9.239 1.79844 8.039 1.79844 6.839C1.79844 5.639 1.99844 4.539 2.39844 3.539C2.79844 2.539 3.39844 1.739 4.19844 1.139C4.99844 0.439 6.09844 0.039 7.49844 -0.0610001C8.09844 -0.0610001 8.69844 -0.00100008 9.29844 0.139C9.89844 0.279 10.4984 0.539 10.9984 0.939C11.1984 0.439 11.4984 0.239 11.7984 0.139ZM34.4984 0.139C35.6984 0.139 36.6984 0.439 37.4984 1.039C38.2984 1.639 38.8984 2.339 39.2984 3.139C39.6984 3.839 39.8984 4.639 39.8984 5.539C39.8984 6.439 39.6984 7.339 39.2984 8.239C38.8984 9.039 38.2984 9.839 37.4984 10.539C36.6984 11.239 35.7984 11.839 34.7984 12.339L33.7984 12.839C34.0984 13.339 34.5984 13.839 35.2984 14.339C35.9984 14.839 36.8984 15.339 37.9984 15.839C39.0984 16.339 40.2984 16.839 41.6984 17.339L39.4984 22.139C37.4984 21.539 35.6984 20.839 34.0984 20.039C32.4984 19.239 31.0984 18.339 29.8984 17.339C28.6984 16.339 27.6984 15.239 26.8984 14.039C26.0984 12.839 25.4984 11.639 25.0984 10.439C24.6984 9.239 24.4984 8.039 24.4984 6.839C24.4984 5.639 24.6984 4.539 25.0984 3.539C25.4984 2.539 26.0984 1.739 26.8984 1.139C27.6984 0.439 28.7984 0.039 30.1984 -0.0610001C30.7984 -0.0610001 31.3984 -0.00100008 31.9984 0.139C32.5984 0.279 33.1984 0.539 33.6984 0.939C33.8984 0.439 34.1984 0.239 34.4984 0.139Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="mt-8">
                <p className="text-gray-600 italic mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-amber-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 