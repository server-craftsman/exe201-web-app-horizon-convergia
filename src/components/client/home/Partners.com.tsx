import React from 'react';
import { partners } from '../../../data/homeData';

const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">ĐỐI TÁC CỦA CHÚNG TÔI</h2>
        <div className="flex flex-wrap justify-center items-center gap-10 mt-6">
          {partners.map(partner => (
            <img 
              key={partner.id} 
              src={partner.logo} 
              alt={partner.name} 
              className="h-12 grayscale hover:grayscale-0 transition-all duration-300" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners; 