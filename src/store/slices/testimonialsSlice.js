import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${Cookies.get('token')}` },
});

export const fetchTestimonials = createAsyncThunk('testimonials/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/testimonials', getConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createTestimonial = createAsyncThunk('testimonials/create', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/testimonials', data, getConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updateTestimonial = createAsyncThunk('testimonials/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/testimonials/${id}`, data, getConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteTestimonial = createAsyncThunk('testimonials/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/testimonials/${id}`, getConfig());
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: { list: [], loading: false, error: null, errors: {} },
  reducers: {
    clearTestimonialErrors(state) { state.errors = {}; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => { state.loading = true; })
      .addCase(fetchTestimonials.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTestimonials.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTestimonial.fulfilled, (state, action) => { state.list.unshift(action.payload); state.errors = {}; })
      .addCase(createTestimonial.rejected, (state, action) => { state.errors = action.payload?.errors || {}; })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.errors = {};
      })
      .addCase(updateTestimonial.rejected, (state, action) => { state.errors = action.payload?.errors || {}; })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearTestimonialErrors } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
