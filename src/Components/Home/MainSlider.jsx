import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import gsap from 'gsap';
const sliderBg = '/home-slider-1.png';

const slides = [
  {
    title: 'Fresh Products Delivered to your Door',
    subtitle: 'Get 20% off your first order',
    primary: { label: 'Shop Now', to: '/products', className: 'text-green-500' },
    secondary: { label: 'View Deals', to: '/deals', className: 'text-white' }
  },
  {
    title: 'Premium Quality Guaranteed',
    subtitle: 'Fresh from farm to your table',
    primary: { label: 'Shop Now', to: '/products', className: 'text-blue-500' },
    secondary: { label: 'Learn More', to: '/about', className: 'text-white' }
  },
  {
    title: 'Fast & Free Delivery',
    subtitle: 'Same day delivery available',
    primary: { label: 'Order Now', to: '/products', className: 'text-purple-500' },
    secondary: { label: 'Delivery Info', to: '/delivery', className: 'text-white' }
  }
];

export default function MainSlider() {
  const swiperRef = useRef(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const animateSlide = (index) => {
      const swiper = swiperRef.current?.swiper;
      if (!swiper) return;
      const slide = swiper.slides?.[index];
      if (!slide) return;
      const elements = slide.querySelectorAll('h2, p, .mt-4');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
      );
    };

    animateSlide(0);

    const swiper = swiperRef.current?.swiper;
    if (!swiper) return undefined;

    const onSlideChange = () => {
      animateSlide(swiper.activeIndex);
    };

    swiper.on('slideChange', onSlideChange);
    return () => swiper.off('slideChange', onSlideChange);
  }, []);

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{ prevEl: '.custom-prev', nextEl: '.custom-next' }}
        onSwiper={(swiper) => {
          activeIndexRef.current = swiper.activeIndex;
        }}
        className="home-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              style={{ backgroundImage: `url(${sliderBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              className="h-[400px] flex items-center justify-center"
            >
              <div className="overlay py-20 text-white p-4 w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50">
                <div className="container h-full content-center">
                  <h2 className="text-white text-3xl font-bold mb-4 max-w-96">{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                  <div className="mt-4">
                    <Link
                      href={slide.primary.to}
                      className={`btn bg-white border-2 border-white/50 ${slide.primary.className} inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform`}
                    >
                      {slide.primary.label}
                    </Link>
                    <Link
                      href={slide.secondary.to}
                      className={`btn bg-transparent border-2 border-white/50 ${slide.secondary.className} ml-2 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform`}
                    >
                      {slide.secondary.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination"></div>
      </Swiper>

      <div className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
        <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
      </div>
      <div className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
        <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
      </div>
    </div>
  );
}