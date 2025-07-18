import React from 'react';
import { useProduct } from '@hooks/modules/useProduct';

// Brand logos mapping - you can replace these with actual brand logos
const brandLogos: Record<string, string> = {
  'Yamaha': 'https://logos-world.net/wp-content/uploads/2020/12/Yamaha-Logo.png',
  'Honda': 'https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png',
  'Suzuki': 'https://logos-world.net/wp-content/uploads/2020/11/Suzuki-Logo.png',
  'Kawasaki': 'https://logos-world.net/wp-content/uploads/2020/11/Kawasaki-Logo.png',
  'Ducati': 'https://logos-world.net/wp-content/uploads/2020/11/Ducati-Logo.png',
  'BMW': 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png',
  'KTM': 'https://logoeps.com/wp-content/uploads/2013/12/ktm-vector-logo.png',
  'Harley-Davidson': 'https://logos-world.net/wp-content/uploads/2020/11/Harley-Davidson-Logo.png'
};

const Partners: React.FC = () => {
  const { useProducts } = useProduct();

  // Fetch products to get available brands
  const { data: products = [], isLoading } = useProducts({
    pageNumber: 1,
    pageSize: 100 // Get more products to ensure we capture all brands
  });

  // Extract unique brands from verified products
  const uniqueBrands = React.useMemo(() => {
    const brands = products
      .filter(product => product.isVerified)
      .map(product => product.brand)
      .filter((brand, index, array) => array.indexOf(brand) === index);

    return brands.slice(0, 8); // Limit to 8 brands for better display
  }, [products]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 relative">
          <span className="relative z-10">THƯƠNG HIỆU ĐỐI TÁC</span>
          <span className="absolute w-20 h-1 bg-amber-400 bottom-0 left-1/2 transform -translate-x-1/2 -mb-2"></span>
        </h2>

        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-500">Đang tải thương hiệu...</p>
          </div>
        ) : uniqueBrands.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Chưa có thương hiệu nào được đăng ký.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {uniqueBrands.map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="group flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full h-20"
              >
                {brandLogos[brand] ? (
                  <img
                    src={brandLogos[brand]}
                    alt={brand}
                    className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const img = e.currentTarget;
                      const textSpan = img.parentElement?.querySelector('span');
                      if (textSpan) {
                        img.style.display = 'none';
                        textSpan.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <span
                  className={`text-lg font-bold text-gray-700 group-hover:text-amber-600 transition-colors duration-300 ${brandLogos[brand] ? 'hidden' : 'block'}`}
                  style={{ display: brandLogos[brand] ? 'none' : 'block' }}
                >
                  {brand}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Chúng tôi tự hào hợp tác cùng các thương hiệu xe máy hàng đầu thế giới để mang đến cho khách hàng
            những sản phẩm chất lượng cao và dịch vụ tốt nhất.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners; 