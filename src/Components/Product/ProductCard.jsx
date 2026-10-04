import { useSelector } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faArrowsRotate,
  faEye,
  faPlus,
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Rating, { calcDiscount } from '../Common/Rating';
import { useIsInGuestWishlist, useToggleGuestWishlist, useGuestCart } from '../../hooks/useGuestState';
import {
  useWishlist,
  useUnifiedAddToCart,
  useAddToWishlist,
  useRemoveFromWishlist
} from '../../hooks/useCartHooks';

export default function ProductCard({ product }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { toggleItem } = useToggleGuestWishlist();
  const { items } = useGuestCart();
  const { data: wishlistData } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const productId = product._id || product.id;

  const inGuestWishlist = useIsInGuestWishlist(productId);
  const inWishlist = isAuthenticated
    ? Boolean((wishlistData?.data || []).some((item) => item._id === productId))
    : inGuestWishlist;

  const inCart = items.some((item) => item.productId === product._id);
  const outOfStock = product.quantity <= 0;
  const { addToCart, isPending } = useUnifiedAddToCart();

  const discount = calcDiscount(product.price, product.priceAfterDiscount);

  const handleWishlist = () => {
    if (isAuthenticated) {
      if (inWishlist) removeFromWishlist(productId);
      else addToWishlist(productId);
    } else {
      toggleItem(product);
    }
  };

  return (
    <div id="product-card" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={product.imageCover}
          alt={product.title}
          loading="lazy"
          className="w-full h-60 object-contain bg-white"
        />

        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            type="button"
            onClick={handleWishlist}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm ${
              inWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <FontAwesomeIcon icon={inWishlist ? faHeart : faHeartRegular} />
          </button>
          <button
            type="button"
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
          <Link
            href={`/products/${product.id || product._id}`}
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm"
          >
            <FontAwesomeIcon icon={faEye} />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
        <h3 className="font-medium mb-1 cursor-pointer" title={product.title}>
          <Link href={`/products/${product.id || product._id}`} className="line-clamp-2">
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex text-amber-400 mr-2 text-xs">
            <Rating rating={product.ratingsAverage} />
          </div>
          <span className="text-xs text-gray-500">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.priceAfterDiscount ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  {product.priceAfterDiscount} EGP
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  {product.price} EGP
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">{product.price} EGP</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={outOfStock || isPending}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition disabled:opacity-70 ${
              inCart ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <FontAwesomeIcon
              icon={outOfStock || isPending ? faSpinner : inCart ? faCheck : faPlus}
              className={outOfStock || isPending ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>
    </div>
  );
}