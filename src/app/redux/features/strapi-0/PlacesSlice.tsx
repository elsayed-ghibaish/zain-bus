import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface PlaceState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  data: [],
  loading: true,
  error: null,
};

export const PlaceData = createAsyncThunk("Place/fetchData", async () => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/places?populate=*`, config);
  return response.data.data;
});

const PlaceSlice = createSlice({
  name: "Place",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PlaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PlaceData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PlaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default PlaceSlice.reducer;
