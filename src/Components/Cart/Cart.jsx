import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faArrowRight,
  faCheck,
  faMinus,
  faPlus,
  faTrash,
  faTag,
  faLock,
  faShieldAlt,
  faTruck,
  faBoxOpen,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart
} from '../../hooks/useCartHooks';
import {
  useGuestCart,
  useUpdateGuestCartQuantity,
  useRemoveFromGuestCart,
  useClearGuestCart
} from '../../hooks/useGuestState';
import { confirmRemoveItem, confirmClearCart, cartClearedSuccess } from './cartAlerts';

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;

function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <FontAwesomeIcon icon={faBoxOpen} className="text-5xl text-gray-300" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like you haven&rsquo;t added anything to your cart yet.
          <br />
          Start exploring our products!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-600 text-white py-3.5 px-8 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg active:scale-[0.98]"
        >
          Start Shopping
          <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
        </Link>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, totalItems, authenticated }) {
  const shipping = authenticated ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE) : 0;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faShoppingCart} />
          Order Summary
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="p-6 space-y-5">
        {authenticated && shipping > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faTruck} className="text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Add {remaining.toLocaleString()} EGP for free shipping
              </span>
            </div>
            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {authenticated && shipping === 0 && subtotal > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faTruck} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700">Free Shipping!</p>
              <p className="text-sm text-green-600">You qualify for free delivery</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{subtotal.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            {!authenticated ? (
              <span className="font-medium text-green-600">Calculated at checkout</span>
            ) : shipping === 0 ? (
              <span className="font-medium text-green-600">FREE</span>
            ) : (
              <span className="font-medium text-gray-900">{shipping.toLocaleString()} EGP</span>
            )}
          </div>
          <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-900 font-semibold">
                {authenticated ? 'Total' : 'Estimated Total'}
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</span>
                <span className="text-sm text-gray-500 ml-1">EGP</span>
              </div>
            </div>
          </div>
        </div>

        {!authenticated ? (
          <div className="space-y-3">
            <Link
              href="/login?redirect=/cart"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              <FontAwesomeIcon icon={faLock} />
              <span>Login to Checkout</span>
            </Link>
            <Link
              href="/register?redirect=/cart"
              className="w-full border-2 border-primary-600 text-primary-600 py-3.5 px-6 rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center justify-center"
            >
              Create an Account
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all"
            >
              <FontAwesomeIcon icon={faTag} />
              <span className="text-sm font-medium">Apply Promo Code</span>
            </button>
            <Link
              href="/checkout"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              <FontAwesomeIcon icon={faLock} />
              <span>Secure Checkout</span>
            </Link>
          </>
        )}

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FontAwesomeIcon icon={faTruck} className="text-blue-500" />
            <span>Fast Delivery</span>
          </div>
        </div>

        <Link
          href="/products"
          className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium py-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function CartRow({ product, count, price, pending, onIncrease, onDecrease, onRemove }) {
  const lineTotal = price * count;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 ${
        pending ? 'opacity-60' : ''
      }`}
    >
      {pending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-600">Updating...</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex gap-4 sm:gap-6">
          <Link href={`/products/${product._id}`} className="relative shrink-0 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 border border-gray-100 overflow-hidden">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
              In Stock
            </div>
          </Link>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="mb-3">
              <Link href={`/products/${product._id}`} className="group/title">
                <h3 className="font-semibold text-gray-900 group-hover/title:text-primary-600 transition-colors leading-relaxed text-base sm:text-lg">
                  {product.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-primary-50 to-emerald-50 text-primary-700 text-xs font-medium rounded-full">
                  {product.category?.name}
                </span>
                <span className="text-xs text-gray-400">&bull;</span>
                <span className="text-xs text-gray-500">
                  SKU: {product._id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-primary-600 font-bold text-lg">{price.toLocaleString()} EGP</span>
                <span className="text-xs text-gray-400">per unit</span>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={count <= 1 || pending}
                    onClick={onDecrease}
                    className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{count}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={pending}
                    onClick={onIncrease}
                    className="h-8 w-8 rounded-lg bg-primary-600 shadow-sm shadow-primary-600/30 flex items-center justify-center text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {lineTotal.toLocaleString()}{' '}
                    <span className="text-sm font-medium text-gray-400">EGP</span>
                  </p>
                </div>
                <button
                  type="button"
                  title="Remove item"
                  aria-label="Remove from cart"
                  disabled={pending}
                  onClick={onRemove}
                  className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center disabled:opacity-40 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary-600 animate-spin" />
        </div>
      </div>
      <p className="text-gray-600 mt-6 font-medium">Loading your cart...</p>
      <p className="text-gray-400 text-sm mt-1">Just a moment</p>
    </div>
  );
}

export default function Cart() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [pendingId, setPendingId] = useState(null);

  const { data, isLoading } = useCart();
  const updateQty = useUpdateCartQuantity();
  const removeItemMut = useRemoveFromCart();
  const clearCartMut = useClearCart();

  const { items, totalItems, totalPrice } = useGuestCart();
  const { updateQuantity } = useUpdateGuestCartQuantity();
  const { removeItem } = useRemoveFromGuestCart();
  const { clearCart } = useClearGuestCart();

  if (isAuthenticated && isLoading) return <CartSkeleton />;

  const rows = isAuthenticated
    ? (data?.data?.products || []).map((item) => ({
        key: item._id,
        product: item.product,
        count: item.count,
        price: item.price,
        pending: updateQty.isPending && pendingId === item.product._id
      }))
    : items.map((item) => ({
        key: item.productId,
        product: item.product,
        count: item.count,
        price: item.price,
        pending: false
      }));

  const subtotal = isAuthenticated ? (data?.data?.totalCartPrice ?? 0) : totalPrice;
  const count = isAuthenticated ? (data?.numOfCartItems ?? 0) : totalItems;

  if (rows.length === 0) return <EmptyCart />;

  const handleIncrease = async (row) => {
    setPendingId(row.product._id);
    if (isAuthenticated) await updateQty.mutateAsync({ productId: row.product._id, count: row.count + 1 });
    else updateQuantity(row.product._id, row.count + 1);
    setPendingId(null);
  };

  const handleDecrease = async (row) => {
    setPendingId(row.product._id);
    if (isAuthenticated) await updateQty.mutateAsync({ productId: row.product._id, count: row.count - 1 });
    else updateQuantity(row.product._id, row.count - 1);
    setPendingId(null);
  };

  const handleRemove = async (row) => {
    const result = await confirmRemoveItem(row.product.title);
    if (!result.isConfirmed) return;
    setPendingId(row.product._id);
    if (isAuthenticated) await removeItemMut.mutateAsync(row.product._id);
    else removeItem(row.product._id);
    setPendingId(null);
  };

  const handleClear = async () => {
    const result = await confirmClearCart();
    if (!result.isConfirmed) return;
    if (isAuthenticated) await clearCartMut.mutateAsync();
    else clearCart();
    cartClearedSuccess();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-linear-to-r from-primary-600 to-primary-700 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </span>
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">
                You have{' '}
                <span className="font-semibold text-primary-600">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>{' '}
                in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {rows.map((row) => (
                <CartRow
                  key={row.key}
                  product={row.product}
                  count={row.count}
                  price={row.price}
                  pending={row.pending}
                  onIncrease={() => handleIncrease(row)}
                  onDecrease={() => handleDecrease(row)}
                  onRemove={() => handleRemove(row)}
                />
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <Link
                href="/products"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={handleClear}
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-xs group-hover:scale-110 transition-transform"
                />
                Clear all items
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} totalItems={count} authenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </div>
  );
}