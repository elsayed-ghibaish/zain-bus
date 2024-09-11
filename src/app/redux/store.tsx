import { configureStore } from "@reduxjs/toolkit";
import AreasReducer from "./features/strapi-0/AreaSlice";
import UniversitysReducer from "./features/strapi-0/UniversitysSlice";
import UserMesReducer from "./features/strapi-1/UserMeSlice";
import BookingDashboardsReducer from "./features/strapi-1/BookingDashboardSlice";
import ControlsReducer from "./features/strapi-0/BookingControlsSlice";
import PlacesReducer from "./features/strapi-0/PlacesSlice";
import StudentsReducer from "./features/strapi-0/StudentsSlice";
import GetUsersReducer from "./features/strapi-0/GetUserSlice";
import BookingReducer from "./features/strapi-0/BookingSlice";
import BookingsIdsReducer from "./features/strapi-0/BookingsIdSlice";
import DashboardIdsReducer from "./features/strapi-0/DashboardIdSlice";
import BookingBagsReducer from "./features/strapi-0/BookingBagSlice";
import BagIDsReducer from "./features/strapi-0/BagIdSlice";

export const store = configureStore({
  reducer: {
    Area: AreasReducer,
    University: UniversitysReducer,
    UserMe: UserMesReducer,
    BookingDashboard: BookingDashboardsReducer,
    Control: ControlsReducer,
    Place: PlacesReducer,
    Students: StudentsReducer,
    GetUser: GetUsersReducer,
    Booking: BookingReducer,
    Bookings: BookingsIdsReducer,
    DashboardId: DashboardIdsReducer,
    BookingBag: BookingBagsReducer,
    Bags: BagIDsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
