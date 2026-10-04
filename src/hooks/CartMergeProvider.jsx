import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { addToCart, addToWishlist } from '../api/endpoints';
import { useGuestCart, useGuestWishlist } from './useGuestState';
import { clearCart } from '../redux/guestCartSlice';
import { clearWishlist } from '../redux/guestWishlistSlice';

export default function CartMergeProvider({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { items } = useGuestCart();
  const { items: wishlistItems } = useGuestWishlist();
  const queryClient = useQueryClient();
  const prevAuthRef = useRef(isAuthenticated);
  const hasMergedRef = useRef(false);

  useEffect(() => {
    const justLoggedIn = isAuthenticated && !prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (!justLoggedIn || hasMergedRef.current) return;
    if (items.length === 0 && wishlistItems.length === 0) return;

    hasMergedRef.current = true;

    const mergeCart = async () => {
      if (items.length === 0) return { merged: 0 };
      let merged = 0;
      for (const item of items) {
        try {
          for (let i = 0; i < item.count; i += 1) {
            await addToCart(item.productId);
          }
          merged += 1;
        } catch {
          /* item failed to merge, continue */
        }
      }
      return { merged };
    };

    const mergeWishlist = async () => {
      if (wishlistItems.length === 0) return { merged: 0 };
      let merged = 0;
      for (const item of wishlistItems) {
        try {
          await addToWishlist(item.productId);
          merged += 1;
        } catch {
          /* item failed to merge, continue */
        }
      }
      return { merged };
    };

    Promise.all([mergeCart(), mergeWishlist()])
      .then(([cartResult, wishlistResult]) => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        dispatch(clearCart());
        dispatch(clearWishlist());
        if (cartResult.merged > 0) toast.info('Your cart items have been saved!');
        if (wishlistResult.merged > 0) toast.info('Your wishlist items have been saved!');
      })
      .catch(() => {
        /* ignore merge failures */
      });
  }, [isAuthenticated, items, wishlistItems, dispatch, queryClient]);

  return children;
}