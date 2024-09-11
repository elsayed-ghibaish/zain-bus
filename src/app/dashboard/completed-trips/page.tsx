import React from "react";
import { Metadata } from "next";
import CompletedBooking from "@/app/interface/dashboard/booking/CompletedBooking";

export const metadata: Metadata = {
  title: "الزين للرحلات - تاكيد الوصول",
  description: "تاكيد الوصول للطالب واتمام الرحلة ",
};
export default function CompletedTrips() {
  return <CompletedBooking />;
}
