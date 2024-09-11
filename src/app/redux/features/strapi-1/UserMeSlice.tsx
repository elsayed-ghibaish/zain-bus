import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserMeState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserMeState = {
  data: [],
  loading: true,
  error: null,
};

export const fetchUserMeData = createAsyncThunk(
  "UserMe/fetchData",
  async (token: any) => {
    const apikay = token;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/users/me?populate=*`,
      config
    );
    return response.data;
  }
);

const UserMeSlice = createSlice({
  name: "UserMe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserMeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default UserMeSlice.reducer;
