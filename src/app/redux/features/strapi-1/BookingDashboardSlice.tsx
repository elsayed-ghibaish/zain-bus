import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BookingDashboardState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingDashboardState = {
  data: [],
  loading: true,
  error: null,
};

export const BookingDashboardData = createAsyncThunk(
  "BookingDashboard/fetchData",
  async ({ token, id }: { token: string; id: number }) => {
    const apikay = token;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${apikay}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/booking-dashboards/${id}`,
      config
    );
    return response.data.data;
  }
);

const BookingDashboardSlice = createSlice({
  name: "BookingDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BookingDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BookingDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BookingDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to BookingDashboard data";
      });
  },
});

export default BookingDashboardSlice.reducer;
