import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AreaState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AreaState = {
  data: [],
  loading: true,
  error: null,
};

export const AreaData = createAsyncThunk("Area/fetchData", async () => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/areas?populate=*`, config);
  return response.data.data;
});

const AreaSlice = createSlice({
  name: "Area",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AreaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AreaData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(AreaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Area data";
      });
  },
});

export default AreaSlice.reducer;
