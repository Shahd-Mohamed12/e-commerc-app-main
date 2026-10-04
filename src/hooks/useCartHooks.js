import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../api/endpoints';
import { useGuestCart, useAddToGuestCart } from './useGuestState';

export const useCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 300_000,
    enabled: typeof window !== 'undefined' && Boolean(localStorage.getItem('token'))
  });

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, count }) => updateCartQuantity(productId, count),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, count = 1 }) => addToCart(productId, count),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
}

export function useUnifiedAddToCart() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { addItem } = useAddToGuestCart();
  const mutation = useAddToCartMutation();

  return {
    addToCart: (product, count = 1) => {
      if (isAuthenticated) mutation.mutate({ productId: product._id || product.id, count });
      else addItem(product, count);
    },
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isGuestSuccess: !isAuthenticated
  };
}

export function useCartCount() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { data } = useCart();
  const { totalItems } = useGuestCart();
  return isAuthenticated ? (data?.numOfCartItems ?? 0) : totalItems;
}

export const useWishlist = () =>
  useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    enabled: typeof window !== 'undefined' && Boolean(localStorage.getItem('token'))
  });

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => addToWishlist(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => removeFromWishlist(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  });
}