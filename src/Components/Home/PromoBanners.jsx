import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    gradient: 'bg-linear-to-br from-emerald-500 to-emerald-700',
    badge: { emoji: '🔥', label: 'Deal of the Day' },
    title: 'Fresh Organic Fruits',
    text: 'Get up to 40% off on selected organic fruits',
    offer: '40% OFF',
    code: 'ORGANIC40',
    cta: { label: 'Shop Now', to: '/products', color: 'text-emerald-600' },
    axis: 'x',
    from: -50
  },
  {
    gradient: 'bg-linear-to-br from-orange-400 to-rose-500',
    badge: { emoji: '✨', label: 'New Arrivals' },
    title: 'Exotic Vegetables',
    text: 'Discover our latest collection of premium vegetables',
    offer: '25% OFF',
    code: 'FRESH25',
    cta: { label: 'Explore Now', to: '/products?sort=newest', color: 'text-orange-500' },
    axis: 'x',
    from: 50
  }
];

export default function PromoBanners() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, x: (index) => cards[index].from },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true }
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6" ref={gridRef}>
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-2xl ${card.gradient} p-8 text-white`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  <span>{card.badge.emoji}</span>
                  <span>{card.badge.label}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/80 mb-4">{card.text}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold">{card.offer}</div>
                  <div className="text-sm text-white/70">
                    Use code: <span className="font-bold text-white">{card.code}</span>
                  </div>
                </div>
                <Link
                  href={card.cta.to}
                  className={`inline-flex items-center gap-2 bg-white ${card.cta.color} px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors`}
                >
                  {card.cta.label}
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}