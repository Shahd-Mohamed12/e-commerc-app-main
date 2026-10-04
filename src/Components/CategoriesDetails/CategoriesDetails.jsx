import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCategory, useSubcategoriesByCategory } from '../../hooks/useApi';

export default function CategoryDetails() {
  const { categoryId } = useParams();
  const { data: categoryData, isLoading: categoryLoading } = useCategory(categoryId);
  const { data: subData, isLoading: subLoading } = useSubcategoriesByCategory(categoryId);

  const category = categoryData?.data;
  const subcategories = subData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">{category?.name || 'Category'}</span>
          </nav>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30 overflow-hidden">
              {category?.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faLayerGroup} className="text-3xl" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {category?.name || 'Category'}
              </h1>
              <p className="text-white/80 mt-1">Browse all subcategories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Subcategories</h2>
          <Link
            href={`/products?category=${categoryId}`}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All Products
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
        </div>

        {categoryLoading || subLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 w-2/3 mx-auto bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : subcategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Subcategories Found</h3>
            <Link
              href={`/products?category=${categoryId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/products?category=${categoryId}&subcategory=${sub._id}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {sub.name}
                </h3>
                <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-primary-600 flex items-center gap-1">
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    <span>View Products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}