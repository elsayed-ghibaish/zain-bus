import React from "react";
import { Metadata } from "next";
import BookingManagementUi from "@/app/interface/dashboard/booking-management/BookingManagementUi";

export const metadata: Metadata = {
  title: "الزين للرحلات - التحكم فى الحجز",
  description: "التحكم فى حجز الطلاب ",
};
export default function bookingmanagement() {
  return <BookingManagementUi />;
}
