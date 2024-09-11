import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ControlState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ControlState = {
  data: [],
  loading: true,
  error: null,
};

export const ControlData = createAsyncThunk(
  "Control/fetchData",
  async (id: any) => {
    const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${apikay}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/booking-dashboards?sort[0]=id:asc`,
      config
    );
    return response.data.data;
  }
);

const ControlSlice = createSlice({
  name: "Control",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ControlData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ControlData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ControlData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to Control data";
      });
  },
});

export default ControlSlice.reducer;
