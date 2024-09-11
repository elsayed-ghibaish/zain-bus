import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface GetUserState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: GetUserState = {
  data: [],
  loading: true,
  error: null,
};

export const GetUserData = createAsyncThunk(
  "GetUser/fetchData",
  async (id: any) => {
    const token = process.env.NEXT_PUBLIC_REST_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/users/${id}?populate=*`,
      config
    );
    return response.data;
  }
);

const GetUserSlice = createSlice({
  name: "GetUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default GetUserSlice.reducer;
