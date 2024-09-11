import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BookingsIdState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsIdState = {
  data: [],
  loading: true,
  error: null,
};

export const BookingsIdData = createAsyncThunk(
  "BookingsId/fetchData",
  async (id: number) => {
    const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${apikay}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/bookings/${id}?populate=*`,
      config
    );
    return response.data.data;
  }
);

const BookingsIdSlice = createSlice({
  name: "BookingsId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BookingsIdData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BookingsIdData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(BookingsIdData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch BookingsId data";
      });
  },
});

export default BookingsIdSlice.reducer;
