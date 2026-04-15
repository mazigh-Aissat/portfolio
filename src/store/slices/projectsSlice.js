import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${Cookies.get('token')}` },
});

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/projects', getConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/projects/${id}`, getConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProjectById.pending, (state) => { state.loading = true; })
      .addCase(fetchProjectById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchProjectById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default projectsSlice.reducer;
