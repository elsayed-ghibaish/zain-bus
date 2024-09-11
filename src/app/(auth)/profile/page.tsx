import React from "react";
import ProfileUser from "@/app/interface/user/Profile/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - حسابي",
  description:
    "مرحبا في الصفحة الخاص بك، يمكنك إدارة حسابك والحجوزات الخاصة بك هنا",
};

export default function Profile() {
  return <ProfileUser />;
}
