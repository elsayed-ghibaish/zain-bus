import React from "react";
import FaqSection from "@/app/interface/fqs/FaqSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - اسئلة شائعة",
  description: "الصفحة الخاصة بالاسئلة الشائعة عن خدمتنا",
};
export default function fqs() {
  return (
    <section>
      <FaqSection />
    </section>
  );
}
