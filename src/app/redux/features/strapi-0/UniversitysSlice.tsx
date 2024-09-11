import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UniversityState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  data: [],
  loading: true,
  error: null,
};

export const fetchUniversityData = createAsyncThunk(
  "University/fetchData",
  async () => {
    const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${apikay}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/universities?populate=*`,
      config
    );
    return response.data.data;
  }
);

const UniversitySlice = createSlice({
  name: "University",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversityData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversityData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUniversityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default UniversitySlice.reducer;
