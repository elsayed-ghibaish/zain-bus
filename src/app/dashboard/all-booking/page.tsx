import React from "react";
import { Metadata } from "next";
import AllBookingUi from "@/app/interface/dashboard/booking/AllBookingUi";

export const metadata: Metadata = {
  title: "الزين للرحلات - كل الرحلات",
  description: "استعرض كل الرحلات",
};
export default function allBooking() {
  return <AllBookingUi />;
}
