import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faRightFromBracket,
  faCartShopping,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../redux/authSlice';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '../../api/endpoints';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
    enabled: Boolean(user)
  });

  const orders = ordersData?.data || [];

  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    toast.success('You have been logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">Profile</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <FontAwesomeIcon icon={faUser} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {user?.name || 'My Account'}
              </h1>
              <p className="text-white/80 mt-1">Manage your account information and orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="font-semibold text-gray-900">{user?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 truncate">{user?.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faPhone} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900">{user?.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faBoxOpen} className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">You have no orders yet</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                      Start Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id || order.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Order #{String(order._id || order.id).slice(-8)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-primary-600">
                          {order.totalOrderPrice} EGP
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered
                              ? 'bg-green-50 text-green-700'
                              : order.isPaid
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-red-500" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">Wishlist</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-red-500" />
                  </div>
                  <span className="font-medium text-sm">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}