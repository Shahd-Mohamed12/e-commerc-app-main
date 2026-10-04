import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../Product/ProductCard';
import { useSearchProducts, useCategories, useBrands } from '../../hooks/useApi';

export default function Search() {
  const searchParams = useSearchParams();
  const term = (searchParams.get('q') || '').trim();

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const filters = useMemo(
    () => ({
      q: term || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      limit: 40
    }),
    [term, searchParams]
  );

  const { data, isLoading } = useSearchProducts(filters);
  const products = data?.data || [];

  const category = categories.find((item) => item._id === searchParams.get('category'));
  const brand = brands.find((item) => item._id === searchParams.get('brand'));

  const title = term ? `Search results for "${term}"` : 'Search Products';
  const subtitle = category
    ? `in ${category.name}`
    : brand
      ? `in ${brand.name}`
      : term
        ? `${products.length} ${products.length === 1 ? 'product' : 'products'} found`
        : 'Type a keyword to find what you are looking for';

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">Search</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
              <p className="text-white/80 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {(searchParams.get('category') || searchParams.get('brand')) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                {category.name}
                <Link href={`/search?q=${encodeURIComponent(term)}`} aria-label="Remove category filter">
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </Link>
              </span>
            )}
            {brand && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                {brand.name}
                <Link href={`/search?q=${encodeURIComponent(term)}`} aria-label="Remove brand filter">
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </Link>
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-primary-400 mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-6">
                {term
                  ? `We couldn't find any products matching "${term}". Try a different search term.`
                  : 'Start typing in the search bar to find products.'}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}