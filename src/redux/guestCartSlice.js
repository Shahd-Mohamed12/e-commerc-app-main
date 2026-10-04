import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'guestCart';

const persist = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState: { items: [] },
  reducers: {
    initializeCart: (state) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        state.items = raw ? JSON.parse(raw) : [];
      } catch {
        state.items = [];
      }
    },
    addItem: (state, action) => {
      const { product, count = 1 } = action.payload;
      const index = state.items.findIndex((item) => item.productId === product._id);
      if (index >= 0) {
        state.items[index].count += count;
      } else {
        state.items.push({
          productId: product._id,
          count,
          price: product.priceAfterDiscount || product.price,
          product: {
            _id: product._id,
            id: product.id,
            title: product.title,
            imageCover: product.imageCover,
            category: product.category ? { name: product.category.name } : undefined
          }
        });
      }
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, count } = action.payload;
      const item = state.items.find((entry) => entry.productId === productId);
      if (item) {
        item.count = Math.max(1, count);
        persist(state.items);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    }
  }
});

export const { initializeCart, addItem, updateQuantity, removeItem, clearCart } =
  guestCartSlice.actions;
export const guestCartReducer = guestCartSlice.reducer;