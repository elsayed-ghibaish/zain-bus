import React from "react";
import { Metadata } from "next";
import BookingConfirmation from "@/app/interface/dashboard/booking/BookingConfirmation";

export const metadata: Metadata = {
  title: "الزين للرحلات - تاكيد الحجز",
  description: "تاكيد حجز الطلاب ",
};
export default function bookingConfirmation() {
  return <BookingConfirmation />;
}
