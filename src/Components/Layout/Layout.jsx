'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Navbar from './Navbar';
import FeaturesStrip from './FeaturesStrip';
import Footer from './Footer';
import { useInitializeGuestCart } from '../../hooks/useGuestState';
import { useInitializeGuestWishlist } from '../../hooks/useGuestState';

export default function Layout({ children }) {
  const pathname = usePathname();
  useInitializeGuestCart();
  useInitializeGuestWishlist();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <TopBar />
      <Navbar />
      <main>{children}</main>
      <FeaturesStrip />
      <Footer />
    </>
  );
}
