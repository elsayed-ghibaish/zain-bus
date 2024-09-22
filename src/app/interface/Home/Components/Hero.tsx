"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function HeroHomePage() {
  const { data: session }: any = useSession();
  return (
    <section>
      <div className="lg:w-2/3 text-center mx-auto">
        <h1 className="text-gray-900 font-bold text-5xl md:text-6xl xl:text-7xl">
          انضم الآن
          <span className="text-red-600 block">للزين للرحلات</span>
        </h1>
        <p className="mt-8 text-gray-700 text-2xl w-4/5 m-auto">
          تسجيلك معنا يضمن لك رحلات مريحة وآمنة من وإلى جامعتك، سجل الآن لتستمتع
          بأفضل خدمات النقل للطلاب.
        </p>
        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
          <a
            href="/profile/booking"
            className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-red-600/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
          >
            <span className="relative text-base font-semibold text-red-600">
              حجز الطلاب
            </span>
          </a>

          <a
            // href={session ? "/profile/booking" : "/sign-in"}
            href="/pages/booking-guest"
            className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-red-600 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
          >
            <span className="relative text-base font-semibold text-white">
              {/* {session ? "حجز رحلة" : "تسجيل الدخول"} */}
              حجز الزوار
            </span>
          </a>
        </div>
        <div className="hidden py-8 mt-16 border-y border-gray-100 sm:flex justify-between">
          <div className="text-right">
            <h6 className="text-lg font-semibold text-gray-700">سهولة الحجز</h6>
            <p className="mt-2 text-gray-500">
              تسجيل حساب يجعل الحجز سهل وسريع
            </p>
          </div>
          <div className="text-right">
            <h6 className="text-lg font-semibold text-gray-700">
              طرق دفع مختلفة
            </h6>
            <p className="mt-2 text-gray-500">لدينا طرق دفع مختلفة تناسبك</p>
          </div>
          <div className="text-right">
            <h6 className="text-lg font-semibold text-gray-700">
              متابعة الحجز
            </h6>
            <p className="mt-2 text-gray-500">تابع تفاصيل حجزك</p>
          </div>
        </div>
      </div>
    </section>
  );
}
