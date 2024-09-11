import React from "react";
import BookingUi from "@/app/interface/user/Profile/BookingUi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - حجز رحلة",
  description: "مرحبا بك برجاء تسجيل الدخول للتمكن من مشاهدة باقي مزايا الموقع",
};
export default function booking() {
  return <BookingUi />;
}
