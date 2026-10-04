import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart
} from '../redux/guestCartSlice';
import {
  initializeWishlist,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist
} from '../redux/guestWishlistSlice';

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

export function useInitializeGuestCart() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);
}

export function useInitializeGuestWishlist() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeWishlist());
  }, [dispatch]);
}

export function useGuestCart() {
  const items = useSelector((state) => state.guestCart.items);
  return {
    items,
    totalItems: items.reduce((total, item) => total + item.count, 0),
    totalPrice: items.reduce((total, item) => total + item.price * item.count, 0)
  };
}

export function useAddToGuestCart() {
  const dispatch = useDispatch();
  return { addItem: (product, count = 1) => dispatch(addItem({ product, count })) };
}

export function useUpdateGuestCartQuantity() {
  const dispatch = useDispatch();
  return { updateQuantity: (productId, count) => dispatch(updateQuantity({ productId, count })) };
}

export function useRemoveFromGuestCart() {
  const dispatch = useDispatch();
  return { removeItem: (productId) => dispatch(removeItem(productId)) };
}

export function useClearGuestCart() {
  const dispatch = useDispatch();
  return { clearCart: () => dispatch(clearCart()) };
}

export function useGuestWishlist() {
  const items = useSelector((state) => state.guestWishlist.items);
  return {
    items,
    count: items.length,
    productIds: items.map((item) => item.productId)
  };
}

export function useIsInGuestWishlist(productId) {
  const items = useSelector((state) => state.guestWishlist.items);
  return items.some((item) => item.productId === productId);
}

export function useToggleGuestWishlist() {
  const dispatch = useDispatch();
  return { toggleItem: (product) => dispatch(toggleWishlistItem({ product })) };
}

export function useRemoveFromGuestWishlist() {
  const dispatch = useDispatch();
  return { removeItem: (productId) => dispatch(removeWishlistItem(productId)) };
}

export function useClearGuestWishlist() {
  const dispatch = useDispatch();
  return { clearWishlist: () => dispatch(clearWishlist()) };
}