import React from "react";
import { Metadata } from "next";
import EditStudentUi from "@/app/interface/dashboard/students/EditStudentUi";

export const metadata: Metadata = {
  title: "الزين للرحلات - تعديل بيانات الطالب",
  description: "تعديل بيانات الطلاب",
};
export default function edituser(id: any) {
  return <EditStudentUi id={id} />;
}
