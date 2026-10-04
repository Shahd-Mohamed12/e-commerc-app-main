import MainSlider from './MainSlider';
import ServicesStrip from './ServicesStrip';
import ShopByCategory from './ShopByCategory';
import PromoBanners from './PromoBanners';
import FeaturedProducts from './FeaturedProducts';
import Newsletter from './Newsletter';

export default function Home() {
  return (
    <>
      <MainSlider />
      <ServicesStrip />
      <ShopByCategory />
      <PromoBanners />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}