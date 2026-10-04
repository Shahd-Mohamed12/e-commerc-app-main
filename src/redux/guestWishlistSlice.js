import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'guestWishlist';

const persist = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

const snapshot = (product) => ({
  _id: product._id,
  id: product.id,
  title: product.title,
  imageCover: product.imageCover,
  price: product.price,
  priceAfterDiscount: product.priceAfterDiscount,
  ratingsAverage: product.ratingsAverage,
  category: product.category ? { name: product.category.name } : undefined,
  brand: product.brand ? { name: product.brand.name } : undefined
});

const guestWishlistSlice = createSlice({
  name: 'guestWishlist',
  initialState: { items: [] },
  reducers: {
    initializeWishlist: (state) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        state.items = raw ? JSON.parse(raw) : [];
      } catch {
        state.items = [];
      }
    },
    addItem: (state, action) => {
      const { product } = action.payload;
      if (!state.items.some((item) => item.productId === product._id)) {
        state.items.push({ productId: product._id, product: snapshot(product), addedAt: Date.now() });
        persist(state.items);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      persist(state.items);
    },
    toggleItem: (state, action) => {
      const { product } = action.payload;
      const index = state.items.findIndex((item) => item.productId === product._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({ productId: product._id, product: snapshot(product), addedAt: Date.now() });
      }
      persist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      persist(state.items);
    }
  }
});

export const {
  initializeWishlist,
  addItem: addWishlistItem,
  removeItem: removeWishlistItem,
  toggleItem: toggleWishlistItem,
  clearWishlist
} = guestWishlistSlice.actions;
export const guestWishlistReducer = guestWishlistSlice.reducer;