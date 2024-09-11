import React from "react";
import DashbordHomeUI from "../interface/dashboard/Home/DashbordHomeUI";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - لوحة التحكم",
  description: "الصفحة الرئيسية للوحة التحكم",
};
export default function dashboard() {
  return <DashbordHomeUI />;
}
