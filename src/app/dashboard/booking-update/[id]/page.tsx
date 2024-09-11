import React from "react";
import { Metadata } from "next";
import BookingUpdateUI from "@/app/interface/dashboard/booking/BookingUpdateUI";

export const metadata: Metadata = {
  title: "الزين للرحلات - تحديث حجز الطالب",
  description: "تحديث حجز الطلاب ",
};
export default function bookingupdate(id: any) {
  return <BookingUpdateUI id={id} />;
}
