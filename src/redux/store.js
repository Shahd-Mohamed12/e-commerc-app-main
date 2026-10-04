import { configureStore } from '@reduxjs/toolkit';
import { authReducer, readAuth } from './authSlice';
import { guestCartReducer } from './guestCartSlice';
import { guestWishlistReducer } from './guestWishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guestCart: guestCartReducer,
    guestWishlist: guestWishlistReducer
  },
  preloadedState: {
    auth: readAuth()
  }
});