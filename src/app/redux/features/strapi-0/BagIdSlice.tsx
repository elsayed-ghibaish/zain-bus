import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BagIDState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BagIDState = {
  data: [],
  loading: true,
  error: null,
};

export const BagID = createAsyncThunk("BagID/fetchData", async (id: any) => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(
    `${apiUrl}/booking-bags/${id}?populate=*`,
    config
  );
  return response.data.data;
});

const BagIDSlice = createSlice({
  name: "BagID",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BagID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BagID.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BagID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch BagID data";
      });
  },
});

export default BagIDSlice.reducer;
