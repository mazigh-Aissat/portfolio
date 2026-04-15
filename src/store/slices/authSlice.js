import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/login', credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { errors: { general: 'Erreur réseau.' } });
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { errors: { general: 'Erreur réseau.' } });
  }
});

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    if (token && user) return JSON.parse(user);
  } catch {}
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: typeof window !== 'undefined' ? Cookies.get('token') || null : null,
    loading: false,
    errors: {},
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.errors = {};
      Cookies.remove('token');
      Cookies.remove('user');
    },
    hydrateAuth(state) {
      const token = Cookies.get('token');
      const user = Cookies.get('user');
      if (token && user) {
        state.token = token;
        try { state.user = JSON.parse(user); } catch {}
      }
    },
    clearErrors(state) {
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.errors = {}; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        Cookies.set('token', action.payload.token, { expires: 7 });
        Cookies.set('user', JSON.stringify(action.payload.user), { expires: 7 });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload?.errors || {};
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.errors = {}; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        Cookies.set('token', action.payload.token, { expires: 7 });
        Cookies.set('user', JSON.stringify(action.payload.user), { expires: 7 });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload?.errors || {};
      });
  },
});

export const { logout, hydrateAuth, clearErrors } = authSlice.actions;
export default authSlice.reducer;
