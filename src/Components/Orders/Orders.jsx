import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { getUserOrders } from '../../api/endpoints';

export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: getUserOrders });
  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-24 text-center">
          <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-primary-400 mb-4" />
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">My Orders</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Orders</h1>
              <p className="text-white/80 mt-1">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                Once you place an order it will show up here with its status.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
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
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Order Number</p>
                    <p className="font-bold text-gray-900">
                      #{String(order._id || order.id).slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold text-primary-600">{order.totalOrderPrice} EGP</p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
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

                {order.cartItems?.length > 0 && (
                  <div className="pt-4 space-y-3">
                    {order.cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                          <img
                            src={item.product?.imageCover}
                            alt={item.product?.title}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product?._id}`}
                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                          >
                            {item.product?.title}
                          </Link>
                          <p className="text-xs text-gray-400 mt-1">Qty: {item.count}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(item.product?.priceAfterDiscount || item.product?.price || 0) *
                            item.count}{' '}
                          EGP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}