import React from "react";
import { Metadata } from "next";
import SignIn from "@/app/interface/user/SignIn";

export const metadata: Metadata = {
  title: "الزين للرحلات - تسجيل الدخول",
  description: "مرحبا بك برجاء تسجيل الدخول للتمكن من مشاهدة باقي مزايا الموقع",
};
export default function signin() {
  return <SignIn />;
}
