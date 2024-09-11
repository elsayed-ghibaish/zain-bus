import React from "react";
import BookingGuestUi from "@/app/interface/pages/Booking/BookingGuestUi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - حجز الزوار",
  description: "حجز الزوار بدون تسجيل فى الموقع",
};
export default function BookingGuest() {
  return <BookingGuestUi />;
}
