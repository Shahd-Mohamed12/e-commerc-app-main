import { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faXmark } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../Product/ProductCard';
import { useFilteredProducts, useCategories, useBrands, useSubcategories } from '../../hooks/useApi';

const pillBase =
  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors';

function Breadcrumb({ current }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      <span className="text-white/40">/</span>
      <span className="text-white font-medium">{current}</span>
    </nav>
  );
}

export default function Products() {
  const { categoryId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || categoryId;
  const subcategory = searchParams.get('subcategory');
  const brand = searchParams.get('brand');

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: subcategoriesData } = useSubcategories();

  const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);
  const brands = useMemo(() => brandsData?.data || [], [brandsData]);
  const subcategories = useMemo(() => subcategoriesData?.data || [], [subcategoriesData]);

  const activeCategory = useMemo(
    () => categories.find((item) => item._id === category),
    [categories, category]
  );
  const activeSubcategory = useMemo(
    () => subcategories.find((item) => item._id === subcategory),
    [subcategories, subcategory]
  );
  const activeBrand = useMemo(() => brands.find((item) => item._id === brand), [brands, brand]);

  const filters = useMemo(
    () => ({ category: category || undefined, subcategory: subcategory || undefined, brand: brand || undefined, limit: 40 }),
    [category, subcategory, brand]
  );

  const { data, isLoading } = useFilteredProducts(filters);
  const products = data?.data || [];

  const title = activeCategory?.name || activeBrand?.name || 'All Products';
  const subtitle = activeCategory
    ? `Explore our complete ${activeCategory.name} collection`
    : activeBrand
      ? `Shop from ${activeBrand.name}`
      : 'Explore your complete product collection';

  const clearAll = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('category');
    next.delete('subcategory');
    next.delete('brand');
    router.replace(`/products${next.toString() ? `?${next.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <Breadcrumb current={title} />
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
              <p className="text-white/80 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {(activeCategory || activeSubcategory || activeBrand) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-gray-600">Active Filters:</span>

            {activeCategory && (
              <Link href={`/products?subcategory=${activeCategory._id === category ? (subcategory || '') : activeCategory._id}${activeBrand ? `&brand=${brand}` : ''}`} className={`${pillBase} bg-primary-100 text-primary-700 hover:bg-primary-200`}>
                {activeCategory.name}
                <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
              </Link>
            )}

            {activeSubcategory && (
              <Link href={`/products?category=${activeSubcategory.category}${activeBrand ? `&brand=${brand}` : ''}`} className={`${pillBase} bg-emerald-100 text-emerald-700 hover:bg-emerald-200`}>
                {activeSubcategory.name}
                <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
              </Link>
            )}

            {activeBrand && (
              <Link
                href={`/products${activeCategory ? `?category=${category}` : ''}${activeSubcategory ? `${activeCategory ? '&' : '?'}subcategory=${subcategory}` : ''}`}
                className={`${pillBase} bg-violet-100 text-violet-700 hover:bg-violet-200`}
              >
                {activeBrand.name}
                <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
              </Link>
            )}

            <button type="button" onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Clear all
            </button>
          </div>
        )}

        <div className="mb-6 text-sm text-gray-500">Showing {products.length} products</div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-100"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                  <div className="h-3 w-full bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">No products match your criteria.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}