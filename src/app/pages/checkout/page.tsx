import React from "react";
import { Metadata } from "next";
import CheckOutUi from "@/app/interface/pages/checkout/CheckOutUi";

export const metadata: Metadata = {
  title: "الزين للرحلات - تاكيد الدفع والحجز",
  description: "صفحة التاكيد للدفع وحجز الرحلة",
};
export default function checkout() {
  return <CheckOutUi />;
}
