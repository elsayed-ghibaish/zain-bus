import React from "react";
import BookingBagsConfirmationUI from "@/app/interface/dashboard/booking-bag/BookingBagsConfirmationUI";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - تاكيد توصيل الشنط",
  description: "تاكيد حجز توصيل الشنط ",
};
export default function baggageConfirmation() {
  return <BookingBagsConfirmationUI />;
}
