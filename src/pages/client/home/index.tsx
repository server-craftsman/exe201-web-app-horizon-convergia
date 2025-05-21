import React from 'react';
import Banner from '../../../components/client/home/Banner.com';
import PopularBrands from '../../../components/client/home/PopularBrands.com';
import NewListings from '../../../components/client/home/NewListings.com';
import Accessories from '../../../components/client/home/Accessories.com';
import WhyChooseUs from '../../../components/client/home/WhyChooseUs.com';
import LatestNews from '../../../components/client/home/LatestNews.com';
import SellingCta from '../../../components/client/home/SellingCta.com';
import Testimonials from '../../../components/client/home/Testimonials.com';
import Partners from '../../../components/client/home/Partners.com';

const HomePage: React.FC = () => {
  return (
    <div>
      <Banner />
      <PopularBrands />
      <NewListings />
      <Accessories />
      <WhyChooseUs />
      <LatestNews />
      <SellingCta />
      <Testimonials />
      <Partners />
    </div>
  );
};

export default HomePage;