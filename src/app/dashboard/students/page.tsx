import React from "react";
import StudentsUi from "@/app/interface/dashboard/students/StudentsUi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - الطلاب",
  description: "صفحة الطلاب لاستعراض بيانات جميع الطلاب",
};

export default function students() {
  return <StudentsUi />;
}
