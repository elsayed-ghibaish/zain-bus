import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface DashboardIdState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardIdState = {
  data: [],
  loading: true,
  error: null,
};

export const DashboardIdData = createAsyncThunk(
  "DashboardId/fetchData",
  async (id: number) => {
    const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
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

const DashboardIdSlice = createSlice({
  name: "DashboardId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(DashboardIdData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DashboardIdData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(DashboardIdData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to DashboardId data";
      });
  },
});

export default DashboardIdSlice.reducer;
