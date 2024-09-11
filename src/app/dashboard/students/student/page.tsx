import React from "react";
import { Metadata } from "next";
import StudentUi from "@/app/interface/dashboard/students/StudentUi";

export const metadata: Metadata = {
  title: "الزين للرحلات - صفحة الطالب",
  description: "صفحة الطلاب لاستعراض بيانات جميع الطلاب",
};

export default function student(id: any) {
  return <StudentUi id={id} />;
}
