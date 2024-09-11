import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface StudentsState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  data: [],
  loading: true,
  error: null,
};

export const StudentsData = createAsyncThunk("Students/fetchData", async () => {
  const apikay = process.env.NEXT_PUBLIC_REST_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const config = {
    headers: {
      Authorization: `Bearer ${apikay}`,
    },
  };
  const response = await axios.get(`${apiUrl}/users?populate=*`, config);
  return response.data;
});

const StudentsSlice = createSlice({
  name: "Students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(StudentsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StudentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(StudentsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Students data";
      });
  },
});

export default StudentsSlice.reducer;
