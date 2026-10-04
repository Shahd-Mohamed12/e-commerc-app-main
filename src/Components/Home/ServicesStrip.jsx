import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faShieldHalved,
  faArrowRotateLeft,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  { icon: faTruck, bubble: 'bg-blue-50 text-blue-500', title: 'Free Shipping', text: 'On orders over 500 EGP' },
  { icon: faShieldHalved, bubble: 'bg-emerald-50 text-emerald-500', title: 'Secure Payment', text: '100% secure transactions' },
  { icon: faArrowRotateLeft, bubble: 'bg-orange-50 text-orange-500', title: 'Easy Returns', text: '14-day return policy' },
  { icon: faHeadset, bubble: 'bg-purple-50 text-purple-500', title: '24/7 Support', text: 'Dedicated support team' }
];

export default function ServicesStrip() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true }
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" ref={gridRef}>
          {items.map(({ icon, bubble, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${bubble} w-12 h-12 rounded-full flex items-center justify-center shrink-0`}>
                <FontAwesomeIcon icon={icon} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}