import React from "react";
import PaySuccess from "@/app/interface/pages/success/paysuccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - تم الحجز بنجاح",
  description: "تم تسجيل الحجز بنجاح",
};
export default function BookingSuccess() {
  return <PaySuccess />;
}
