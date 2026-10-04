import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageGallery from 'react-image-gallery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import {
  faTruckFast,
  faShieldHalved,
  faArrowRotateLeft,
  faBox,
  faStar,
  faCartPlus,
  faHeart,
  faShareNodes,
  faSpinner,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'swiper/css';
import 'swiper/css/navigation';
import Rating, { calcDiscount } from '../Common/Rating';
import ProductCard from '../Product/ProductCard';
import { useProduct, useProductsByCategory } from '../../hooks/useApi';
import {
  useUnifiedAddToCart,
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist
} from '../../hooks/useCartHooks';
import { useToggleGuestWishlist, useIsInGuestWishlist } from '../../hooks/useGuestState';
import { useSelector } from 'react-redux';

const tabs = [
  { id: 'details', label: 'Product Details', icon: faBox },
  { id: 'reviews', label: 'Reviews', icon: faStar },
  { id: 'shipping', label: 'Shipping & Returns', icon: faTruckFast }
];

function Breadcrumbs({ product }) {
  const category = product.category;
  const sub = Array.isArray(product.subcategory) ? product.subcategory[0] : product.subcategory;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/categories/${category._id}`} className="hover:text-primary-600 transition-colors">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          {sub && (
            <>
              <Link
                href={`/categories/${category?._id}/${sub._id}`}
                className="hover:text-primary-600 transition-colors"
              >
                {sub.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
      </div>
    </nav>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useProduct(id);
  const product = data?.data;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { toggleItem } = useToggleGuestWishlist();
  const inGuestWishlist = useIsInGuestWishlist(id);
  const { data: wishlistData } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { addToCart, isPending } = useUnifiedAddToCart();

  const { data: related } = useProductsByCategory(product?.category?._id, id, 10);
  const similar = related?.data || [];

  const galleryItems = useMemo(() => {
    if (!product) return [];
    return [product.imageCover, ...(product.images || [])].filter(Boolean);
  }, [product]);

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="w-full h-96 lg:h-[500px] bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-4 animate-pulse">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-24 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
        <Link href="/products" className="text-primary-600 font-medium">
          Back to products
        </Link>
      </div>
    );
  }

  const discount = calcDiscount(product.price, product.priceAfterDiscount);
  const currentPrice = product.priceAfterDiscount || product.price;
  const inStock = product.quantity > 0;
  const lowStock = product.quantity > 0 && product.quantity <= 10;

  const stockPill = !inStock
    ? 'bg-red-100 text-red-700'
    : lowStock
      ? 'bg-orange-100 text-orange-700'
      : 'bg-green-100 text-green-700';
  const stockText = !inStock
    ? 'Out of Stock'
    : lowStock
      ? `Only ${product.quantity} left - Order soon!`
      : 'In Stock';

  const inWishlist = isAuthenticated
    ? Boolean((wishlistData?.data || []).some((item) => item._id === product._id))
    : inGuestWishlist;

  const handleWishlist = () => {
    if (isAuthenticated) {
      if (inWishlist) removeFromWishlist(product._id);
      else addToWishlist(product._id);
    } else {
      toggleItem(product);
    }
  };

  return (
    <>
      <Breadcrumbs product={product} />

      <section id="product-detail" className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div id="product-images" className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ImageGallery
                  items={galleryItems}
                  showThumbnails
                  showFullscreenButton={false}
                  showNav={false}
                  showPlayButton={false}
                  thumbnailPosition="bottom"
                  additionalClass="product-gallery"
                />
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faTruckFast} className="text-primary-600" />
                    Free Shipping
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-primary-600" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faArrowRotateLeft} className="text-primary-600" />
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>

            <div id="product-info" className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <Link
                      href={`/categories/${product.category._id}`}
                      className="bg-primary-50 text-primary-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary-100 transition"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.brand && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex text-amber-400 text-sm">
                    <Rating rating={product.ratingsAverage} />
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary-600">{currentPrice} EGP</span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">{product.price} EGP</span>
                      <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">
                        -{discount}%
                      </span>
                    </>
                  )}
                  <span className={`text-sm px-2 py-1 rounded-full ${stockPill}`}>{stockText}</span>
                </div>

                <div className="border-t border-gray-100 pt-5 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      id="decrease-qty"
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      min={1}
                      max={product.quantity}
                      onChange={(event) =>
                        setQuantity(Math.min(product.quantity, Math.max(1, Number(event.target.value) || 1)))
                      }
                      className="w-16 h-10 text-center border-x border-gray-300 focus:outline-none"
                    />
                    <button
                      id="increase-qty"
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Price</span>
                    <span className="text-xl font-bold text-primary-600">
                      {currentPrice * quantity} EGP
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    id="add-to-cart"
                    type="button"
                    disabled={!inStock || isPending}
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCartPlus} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    id="buy-now"
                    type="button"
                    disabled={!inStock}
                    onClick={() => {
                      addToCart(product, quantity);
                      router.push('/cart');
                    }}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCartPlus} />
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <button
                    id="wishlist-button"
                    type="button"
                    onClick={handleWishlist}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faShareNodes} />
                    Share
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FontAwesomeIcon icon={faTruckFast} className="text-primary-600 text-lg" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                      <div className="text-xs text-gray-500">Free shipping on orders over 500 EGP</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-primary-600 text-lg" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Secure Payment</div>
                      <div className="text-xs text-gray-500">100% secure payment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FontAwesomeIcon icon={faArrowRotateLeft} className="text-primary-600 text-lg" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                      <div className="text-xs text-gray-500">7 days easy returns</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-details-tabs" className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map(({ id: tabId, label, icon }) => {
                  const active = activeTab === tabId;
                  const text = tabId === 'reviews' ? `Reviews (${product.ratingsQuantity})` : label;
                  return (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                        active
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FontAwesomeIcon icon={icon} />
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{product.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="font-medium text-gray-900">{product.category?.name}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">Brand</div>
                      <div className="font-medium text-gray-900">{product.brand?.name}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                    >
                      Write Review
                    </button>
                  </div>
                  <p className="text-gray-500">No reviews yet for this product.</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping &amp; Returns</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We offer fast and reliable shipping on all orders. Orders placed before 2 PM are
                    shipped on the same business day. Free shipping is available on all orders over
                    500 EGP. If you are not satisfied with your purchase, you can return the item
                    within 7 days of delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section id="similar-products" className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  You May Also <span className="text-emerald-600">Like</span>
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="swiper-button-prev-custom w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="button"
                  className="swiper-button-next-custom w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>

            <Swiper
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={12}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom'
              }}
              breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
              className="py-4"
            >
              {similar.map((item) => (
                <SwiperSlide key={item._id}>
                  <ProductCard product={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
}