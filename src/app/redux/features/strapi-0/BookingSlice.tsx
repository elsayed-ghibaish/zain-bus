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

export const BookingData = createAsyncThunk("Booking/fetchData", async (date: any) => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/bookings?populate=*&sort[0]=id:asc&filters[date][$eq]=${date}&pagination[page]=1&pagination[pageSize]=150 `, config);
  return response.data.data;
});

const BookingSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BookingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BookingData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BookingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Booking data";
      });
  },
});

export default BookingSlice.reducer;
