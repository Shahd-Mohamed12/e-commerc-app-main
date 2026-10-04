import instance from './axiosInstance';

const clean = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

export async function getCategories() {
  const { data } = await instance.get('/categories');
  return { data: data.data };
}

export async function getCategoryById(id) {
  const { data } = await instance.get(`/categories/${id}`);
  return data;
}

export async function getBrands() {
  const { data } = await instance.get('/brands');
  return { data: data.data };
}

export async function getSubcategories() {
  const { data } = await instance.get('/subcategories');
  return { data: data.data };
}

export async function getSubcategoriesByCategoryId(categoryId) {
  const { data } = await instance.get('/subcategories', { params: { category: categoryId } });
  return { data: data.data };
}

export async function getProductById(id) {
  const { data } = await instance.get(`/products/${id}`);
  return data;
}

export async function getProductsByCategory(categoryId, limit = 10) {
  const { data } = await instance.get('/products', {
    params: clean({ category: categoryId, limit, page: 1 })
  });
  return { data: data.data };
}

export async function getFilteredProducts(filters = {}) {
  const { category, subcategory, brand, limit } = filters;
  const { data } = await instance.get('/products', {
    params: clean({ category, subcategory, brand, limit })
  });
  return data;
}

export async function searchProducts(filters = {}) {
  const { keyword, categories, brands, minPrice, maxPrice, sort, page, limit } = filters;
  const { data } = await instance.get('/products', {
    params: clean({
      q: keyword,
      category: categories?.length ? categories[0] : undefined,
      brand: brands?.length ? brands[0] : undefined,
      'price[gte]': minPrice,
      'price[lte]': maxPrice,
      sort,
      page,
      limit
    })
  });
  return data;
}

export async function getCart() {
  const { data } = await instance.get('/cart');
  return data;
}

export async function addToCart(productId, count = 1) {
  const { data } = await instance.post('/cart', { productId, count: Number(count) || 1 });
  return data;
}

export async function updateCartQuantity(productId, count) {
  const { data } = await instance.put(`/cart/${productId}`, { count });
  return data;
}

export async function removeFromCart(productId) {
  const { data } = await instance.delete(`/cart/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await instance.delete('/cart');
  return data;
}

export const WISHLIST_QUERY_KEY = ['wishlist'];

export async function getWishlist() {
  const { data } = await instance.get('/wishlist');
  return data;
}

export async function addToWishlist(productId) {
  const { data } = await instance.post('/wishlist', { productId });
  return data;
}

export async function removeFromWishlist(productId) {
  const { data } = await instance.delete(`/wishlist/${productId}`);
  return data;
}

export async function loginAction({ email, password }) {
  try {
    const { data } = await instance.post('/auth/signIn', { email, password });
    return { success: true, message: 'Login successful', data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
    };
  }
}

export async function signupAction(values) {
  try {
    const { data } = await instance.post('/auth/signup', values);
    return { success: true, message: 'Account created successfully', data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      errors: error.response?.data?.errors
    };
  }
}

export async function forgotPasswordAction(email) {
  try {
    const { data } = await instance.post('/auth/forgotPassword', { email });
    return { success: true, message: data.message || 'Reset code sent to your email!', data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.'
    };
  }
}

export async function verifyResetCodeAction(resetCode) {
  try {
    const { data } = await instance.post('/auth/verifyResetCode', { resetCode });
    return { success: true, message: data.message || 'Code verified!', data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.'
    };
  }
}

export async function resetPasswordAction(email, password) {
  try {
    const { data } = await instance.post('/auth/resetPassword', { email, password });
    return { success: true, message: data.message || 'Password reset successfully!', data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.'
    };
  }
}

export async function cashOrder(cartId, shippingAddress) {
  const { data } = await instance.post(`/orders/${cartId}`, { shippingAddress });
  return data;
}

export async function getUserOrders() {
  const { data } = await instance.get('/orders', { params: { sort: 'createdAt' } });
  return data;
}