import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryById,
  getBrands,
  getSubcategories,
  getSubcategoriesByCategoryId,
  getProductById,
  getProductsByCategory,
  getFilteredProducts,
  searchProducts
} from '../api/endpoints';

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: getCategories });

export const useCategory = (id) =>
  useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id)
  });

export const useBrands = () => useQuery({ queryKey: ['brands'], queryFn: getBrands });

export const useSubcategories = () =>
  useQuery({ queryKey: ['subcategories'], queryFn: getSubcategories });

export const useSubcategoriesByCategory = (categoryId) =>
  useQuery({
    queryKey: ['subcategories', 'category', categoryId],
    queryFn: () => getSubcategoriesByCategoryId(categoryId),
    enabled: Boolean(categoryId)
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id)
  });

export const useProductsByCategory = (categoryId, excludeId, limit = 10) =>
  useQuery({
    queryKey: ['products', 'category', categoryId, limit],
    queryFn: () => getProductsByCategory(categoryId, limit),
    enabled: Boolean(categoryId),
    select: (data) => ({
      ...data,
      data: (data?.data || []).filter((product) => product._id !== excludeId)
    })
  });

export const useFilteredProducts = (filters) =>
  useQuery({
    queryKey: ['products', 'filtered', filters],
    queryFn: () => getFilteredProducts(filters),
    placeholderData: (previous) => previous
  });

export const useSearchProducts = (filters) =>
  useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: () => searchProducts(filters),
    placeholderData: (previous) => previous
  });

export function useQueryInvalidate() {
  const queryClient = useQueryClient();
  return {
    invalidateCart: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    invalidateWishlist: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  };
}