import React from "react";
import { Metadata } from "next";
import BagUpdateUI from "@/app/interface/dashboard/booking-bag/BagUpdateUI";

export const metadata: Metadata = {
  title: "الزين للرحلات - تحديث حجز الشنطة",
  description: "تحديث حجز الشنطة ",
};
export default function bagUpdate(id: any) {
  return <BagUpdateUI id={id} />;
}
