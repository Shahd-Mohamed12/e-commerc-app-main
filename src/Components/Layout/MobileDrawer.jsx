import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';
const logo = '/freshcart-logo.svg';

const navLink =
  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors';

export default function MobileDrawer({ open, onClose }) {
  const [term, setTerm] = useState('');
  const router = useRouter();

  const submitSearch = (event) => {
    event.preventDefault();
    onClose();
    router.push(`/search${term.trim() ? `?q=${encodeURIComponent(term.trim())}` : ''}`);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <Link href="/" onClick={onClose}>
            <img src={logo} alt="FreshCart" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={submitSearch} className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
            </button>
          </div>
        </form>

        <nav className="p-4">
          <div className="space-y-1">
            <Link href="/" onClick={onClose} className={navLink}>
              Home
            </Link>
            <Link href="/products" onClick={onClose} className={navLink}>
              Shop
            </Link>
            <Link href="/categories" onClick={onClose} className={navLink}>
              Categories
            </Link>
            <Link href="/brands" onClick={onClose} className={navLink}>
              Brands
            </Link>
          </div>
        </nav>

        <div className="mx-4 border-t border-gray-100"></div>

        <div className="p-4 space-y-1">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              </div>
              <span className="font-medium text-gray-700">Wishlist</span>
            </div>
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faCartShopping} className="text-primary-600" />
              </div>
              <span className="font-medium text-gray-700">Cart</span>
            </div>
          </Link>
        </div>

        <div className="mx-4 border-t border-gray-100"></div>

        <div className="p-4 space-y-1">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <Link
          href="/contact"
          onClick={onClose}
          className="mx-4 mt-2 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-primary-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faHeadset} className="text-primary-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700">Need Help?</div>
            <div className="text-sm text-primary-600">Contact Support</div>
          </div>
        </Link>
      </div>
    </div>
  );
}