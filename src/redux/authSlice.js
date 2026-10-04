import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const readAuth = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
  const token = localStorage.getItem(TOKEN_KEY);
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    user = null;
  }
  return { isAuthenticated: Boolean(token), user };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      if (typeof window !== 'undefined' && action.payload.isAuthenticated) {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user ?? null));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authActions = { setAuth, logout };