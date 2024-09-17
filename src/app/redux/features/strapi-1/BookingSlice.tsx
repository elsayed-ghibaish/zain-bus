import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BookingState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  data: [],
  loading: true,
  error: null,
};

export const BookingTwoData = createAsyncThunk("Booking/fetchData", async () => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/bookings?pagination[page]=1&pagination[pageSize]=10000 `, config);
  return response.data.data;
});

const BookingTwoSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BookingTwoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BookingTwoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BookingTwoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Booking data";
      });
  },
});

export default BookingTwoSlice.reducer;
