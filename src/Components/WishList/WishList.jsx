import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faTrash,
  faArrowRight,
  faCartPlus,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useWishlist, useRemoveFromWishlist, useUnifiedAddToCart } from '../../hooks/useCartHooks';
import { useGuestWishlist, useRemoveFromGuestWishlist } from '../../hooks/useGuestState';
import { confirmRemoveItem } from '../Cart/cartAlerts';

function WishlistSkeleton() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    </div>
  );
}

export default function WishList() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [addedIds, setAddedIds] = useState([]);

  const { data: wishlistData, isLoading } = useWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { items: guestItems } = useGuestWishlist();
  const { removeItem } = useRemoveFromGuestWishlist();
  const { addToCart } = useUnifiedAddToCart();

  if (isAuthenticated && isLoading) return <WishlistSkeleton />;

  const items = isAuthenticated ? (wishlistData?.data || []) : guestItems.map((i) => i.product);
  const count = items.length;

  const handleRemove = async (product) => {
    const result = await confirmRemoveItem(product.title);
    if (!result.isConfirmed) return;
    if (isAuthenticated) removeFromWishlist(product._id);
    else removeItem(product._id);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product._id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== product._id)), 2000);
  };

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-sm mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faHeart} className="text-3xl text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm mb-6">
              Browse products and save your favorites here.
              {!isAuthenticated && ' Sign in to sync your wishlist across devices.'}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Products
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faHeart} className="text-xl text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm">
                {count} {count === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-5 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="md:col-span-6 flex items-center gap-4">
                  <Link
                    href={`/products/${product._id}`}
                    className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0"
                  >
                    <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain p-2" />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product._id}`}
                      className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                    >
                      {product.title}
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">{product.category?.name}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                  <span className="md:hidden text-sm text-gray-500">Price:</span>
                  <div className="text-right md:text-center">
                    {product.priceAfterDiscount ? (
                      <>
                        <span className="font-semibold text-primary-600">
                          {product.priceAfterDiscount} EGP
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {product.price} EGP
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900">{product.price} EGP</span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex md:justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    In Stock
                  </span>
                </div>

                <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition"
                  >
                    {addedIds.includes(product._id) ? (
                      <>
                        <FontAwesomeIcon icon={faCartPlus} />
                        Added
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCartPlus} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    title="Remove from wishlist"
                    className="w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}