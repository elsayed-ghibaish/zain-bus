import React from "react";
import SignUp from "@/app/interface/user/SignUp";
import { Metadata } from "next";
import SignUpSoon from "@/app/interface/user/SignUpSoon";

export const metadata: Metadata = {
  title: "الزين للرحلات - التسجيل",
  description:
    "تسجيل بيانات طالب جديد لتسهيل عملية الحجز والاستفادة من مميزات اخري",
};
export default function signup() {
  return <SignUpSoon />;
}
