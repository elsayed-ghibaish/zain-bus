import React from "react";
import PrintBookingsUi from "@/app/interface/dashboard/booking/PrintBookingsUi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - طباعة الرحلات",
  description: "طباعة كشف الرحلات اليومي ",
};
export default function PrintBookings() {
  return <PrintBookingsUi />;
}
