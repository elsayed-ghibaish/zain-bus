"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns/format";
import { addDays, parseISO } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BookingTwoData } from "@/app/redux/features/strapi-1/BookingSlice";
import {
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUserPlus,
} from "react-icons/fa";
export default function CardsOne() {
  const dispatch: AppDispatch = useDispatch();
  const Bookings: any = useSelector((state: RootState) => state.BookingTwo);

  const fetchData = () => {
    dispatch(BookingTwoData());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let dailyEarnings = 0;
  let monthlyEarnings = 0;
  let totalEarnings = 0;

  Bookings.data.forEach((booking: any) => {
    const tripCost = booking.attributes.trip_cost;
    const tripStatus = booking.attributes.trip_status;
    const tripDate = new Date(booking.attributes.date);

    // فقط إذا كانت الرحلة مؤكدة
    if (tripStatus === "confirmed") {
      // إجمالي الأرباح
      totalEarnings += tripCost;

      // أرباح اليوم
      if (booking.attributes.date === todayDate) {
        dailyEarnings += tripCost;
      }

      // أرباح الشهر
      if (
        tripDate.getMonth() === currentMonth &&
        tripDate.getFullYear() === currentYear
      ) {
        monthlyEarnings += tripCost;
      }
    }
  });

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div>
          <p className="font-medium text-gray-500">أرباح اليوم</p>
          <div className="flex items-end">
            <h2 className="mt-1 text-2xl font-medium text-gray-800">
              {`${dailyEarnings} ج.م`}
            </h2>

            <span className="mx-2 text-red-500">-5% مصاريف تشغيل</span>
          </div>
        </div>
        <div className="p-2 text-white bg-red-500 rounded-lg">
          <FaMoneyBillWave className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div>
          <p className="font-medium text-gray-500">أرباح الشهر</p>
          <div className="flex items-end">
            <h2 className="mt-1 text-2xl font-medium text-gray-800">{`${monthlyEarnings} ج.م`}</h2>
            <span className="mx-2 text-red-500">-14% مصاريف تشغيل</span>
          </div>
        </div>
        <div className="p-2 text-white bg-red-500 rounded-lg">
          <FaMoneyBillAlt className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div>
          <p className="font-medium text-gray-500">إجمالي الأرباح</p>
          <div className="flex items-end">
            <h2 className="mt-1 text-2xl font-medium text-gray-800">{`${totalEarnings} ج.م`}</h2>
            <span className="mx-2 text-red-500">-25% مصاريف تشغيل</span>
          </div>
        </div>
        <div className="p-2 text-white bg-red-500 rounded-lg">
          <FaMoneyCheckAlt className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div>
          <p className="font-medium text-gray-500">إجمالي عدد الحجوزات</p>
          <div className="flex items-end">
            <h2 className="mt-1 text-2xl font-medium text-gray-800">
              {Bookings.data.length}
            </h2>
            <span className="mx-2 text-red-500">+8%</span>
          </div>
        </div>
        <div className="p-2 text-white bg-red-500 rounded-lg">
          <FaUserPlus className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
