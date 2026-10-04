import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faPhone,
  faCity,
  faCreditCard,
  faMoneyBillWave,
  faLock,
  faTruck,
  faCircleCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { cashOrder } from '../../api/endpoints';
import { useCart, useCartCount } from '../../hooks/useCartHooks';
import { useGuestCart } from '../../hooks/useGuestState';

function SummaryRow({ label, value, strong }) {
  return (
    <div className={`flex items-center justify-between ${strong ? 'text-lg font-bold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span className={strong ? '' : 'font-medium text-gray-900'}>{value}</span>
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const cartCount = useCartCount();
  const { items: guestItems, totalPrice: guestTotal } = useGuestCart();
  const { data: cartData } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: user?.email || '',
      details: '',
      phone: user?.phone || '',
      city: ''
    }
  });

  const cartItems = isAuthenticated ? cartData?.data?.cartItems || [] : guestItems.map((i) => i.product);
  const totalPrice = isAuthenticated
    ? cartData?.data?.totalCartPrice || 0
    : guestTotal || 0;
  const shipping = 0;
  const total = totalPrice + shipping;

  const onSubmit = async (values) => {
    if (!isAuthenticated) {
      setError('Please sign in to complete your order.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const shippingAddress = {
        details: values.details,
        phone: values.phone,
        city: values.city
      };
      const res = await cashOrder(cartData?.data?._id, shippingAddress);
      if (res.success) {
        router.push('/orders');
      } else {
        setError(res.message || 'Failed to place order. Please try again.');
      }
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faTruck} className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add products to your cart before checkout.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
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
            <Link href="/cart" className="hover:text-primary-600 transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faCreditCard} className="text-xl text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 text-sm">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Address</h2>

              <div className="space-y-5">
                {!isAuthenticated && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      aria-invalid={!!errors.email}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-2">* {errors.email.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Details
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="details"
                      placeholder="Street address, building, apartment"
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      aria-invalid={!!errors.details}
                      {...register('details', { required: 'Address details are required' })}
                    />
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {errors.details && (
                    <p className="text-sm text-red-600 mt-2">* {errors.details.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                        aria-invalid={!!errors.phone}
                        {...register('phone', { required: 'Phone number is required' })}
                      />
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-2">* {errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="city"
                        placeholder="Cairo"
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                        aria-invalid={!!errors.city}
                        {...register('city', { required: 'City is required' })}
                      />
                      <FontAwesomeIcon
                        icon={faCity}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-2">* {errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                  {paymentMethod === 'cash' && (
                    <FontAwesomeIcon icon={faCircleCheck} className="text-primary-600" />
                  )}
                </button>

                <button
                  type="button"
                  disabled
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 text-left opacity-60 cursor-not-allowed"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCreditCard} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Credit Card</p>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                {cartItems.map((product) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {product.cartItem?.count || product.count || 1}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {(
                        (product.priceAfterDiscount || product.price) *
                        (product.cartItem?.count || product.count || 1)
                      ).toFixed(2)}{' '}
                      EGP
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <SummaryRow label="Subtotal" value={`${totalPrice.toFixed(2)} EGP`} />
                <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : `${shipping} EGP`} />
                <SummaryRow label="Total" value={`${total.toFixed(2)} EGP`} strong />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isAuthenticated || !token}
                className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} />
                    Place Order
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Please{' '}
                  <Link href="/login" className="text-primary-600 hover:underline font-medium">
                    sign in
                  </Link>{' '}
                  to place your order
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}