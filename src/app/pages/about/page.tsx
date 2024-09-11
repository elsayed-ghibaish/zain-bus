import React from "react";
import { Metadata } from "next";
import {
  FaBullseye,
  FaBus,
  FaClipboardList,
  FaShieldAlt,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "الزين للرحلات - عن الزين للرحلات",
  description: "تعرف اكثر علي شركة الزين للرحلات و النقل السياحي",
};
export default function About() {
  return (
    <section className="bg-gradient-to-r from-indigo-100 to-red-100">
      <div className=" min-h-screen flex items-center justify-center py-10">
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
            الزين للرحلات و النقل السياحي
          </h1>
          <p className="text-lg leading-relaxed text-center mb-6">
            نحن نقدم أفضل الخدمات في مجال النقل السياحي
          </p>
          <div className="flex justify-center mb-8">
            <img
              src="/hiace-2024.png"
              alt="car"
              className=" "
            />
          </div>
          <div className="text-lg leading-relaxed mb-8">
            <p>
              الزين للرحلات و النقل السياحي هي شركة رائدة في مجال تقديم خدمات
              النقل السياحي باستخدام الباصات، نحن نهتم بتقديم تجربة سفر مميزة
              لعملائنا، حيث نقدم رحلات نقل طلاب الجامعات بسرعة وأمان من وإلى
              جامعاتهم وخدمة توصيل المسافرين من وإلى المطارات بسرعة وراحة بأسعار
              مناسبة وخدمة عالية الجودة.
            </p>
            <p>
              سواء كنت تخطط لرحلة مع عائلتك أو مجموعة من الأصدقاء، يمكنك
              الاعتماد علينا لنقدم لكم تجربة سفر لا تُنسى تتميز بالراحة والأمان.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaBus className="text-6xl text-blue-600" />
              <div className="mr-6">
                <h2 className="text-2xl font-bold mb-2">مهمتنا</h2>
                <p className="text-lg text-gray-700">
                  نسعى لتوفير أعلى مستويات الخدمة في مجال النقل السياحي، وتقديم
                  تجربة سفر فريدة ومميزة لعملائنا.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="text-6xl text-green-600" />
              <div className="mr-6">
                <h2 className="text-2xl font-bold mb-2">السلامة</h2>
                <p className="text-lg text-gray-700">
                  نحن ملتزمون بتوفير بيئة آمنة ومريحة لجميع ركابنا، ونضمن
                  الالتزام بأعلى معايير السلامة والأمان.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaBullseye className="text-6xl text-red-600" />
              <div className="mr-6">
                <h2 className="text-2xl font-bold mb-2">أهدافنا</h2>
                <p className="text-lg text-gray-700">
                  نسعى لتحقيق رضا العملاء والتميز في تقديم خدمات النقل السياحي،
                  ونسعى للنمو والتطور المستمر.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaClipboardList className="text-6xl text-purple-600" />
              <div className="mr-6">
                <h2 className="text-2xl font-bold mb-2">مهمتنا</h2>
                <p className="text-lg text-gray-700">
                  نسعى لتوفير أعلى مستويات الخدمة في مجال النقل السياحي، وتقديم
                  تجربة سفر فريدة ومميزة لعملائنا.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
