'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faHouse,
  faArrowLeft,
  faLeaf
} from '@fortawesome/free-solid-svg-icons';

const destinations = [
  { label: 'All Products', to: '/products', className: 'bg-primary-50 text-primary-700 hover:bg-primary-100' },
  { label: 'Categories', to: '/categories', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { label: 'Contact Us', to: '/contact', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' }
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-primary-100 text-2xl animate-[float_5s_ease-in-out_infinite_1.5s]">
          <FontAwesomeIcon icon={faLeaf} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/30 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-xl w-full">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 w-64 h-52 sm:w-72 sm:h-60 bg-primary-100/50 rounded-[32px] blur-2xl"></div>
            <div className="relative w-64 h-52 sm:w-72 sm:h-60">
              <div className="absolute inset-x-0 top-4 mx-auto w-52 h-40 sm:w-60 sm:h-44 bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-primary-100/40"></div>
                <FontAwesomeIcon icon={faCartShopping} className="relative text-6xl sm:text-7xl text-primary-400/80" />
              </div>
              <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-white shadow-lg"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/40">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">404</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-400"></div>
                <div className="w-8 h-4 border-b-[3px] border-primary-400 rounded-b-full"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary-400"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Oops! Nothing Here
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
            Looks like this page went out of stock! Don't worry, there's plenty more fresh content to
            explore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-1"
          >
            <FontAwesomeIcon
              icon={faHouse}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            Go to Homepage
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:-translate-y-1"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Go Back
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {destinations.map((destination) => (
              <Link
                key={destination.to}
                href={destination.to}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${destination.className}`}
              >
                {destination.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}