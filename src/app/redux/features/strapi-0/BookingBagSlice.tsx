import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BookingBagState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingBagState = {
  data: [],
  loading: true,
  error: null,
};

export const BookingBag = createAsyncThunk("BookingBag/fetchData", async () => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/booking-bags?populate=*&sort[0]=id:asc`, config);
  return response.data.data;
});

const BookingBagSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BookingBag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BookingBag.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BookingBag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch BookingBag data";
      });
  },
});

export default BookingBagSlice.reducer;
