"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BookingDashboardData } from "@/app/redux/features/strapi-1/BookingDashboardSlice";
import { fetchUserMeData } from "@/app/redux/features/strapi-1/UserMeSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { BsBag } from "react-icons/bs";
import { TbBus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import BookingsUx from "./Booking/BookingsUx";
import BookingBags from "./Booking/BookingBags";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";
import {
  addDays,
  eachDayOfInterval,
  isBefore,
  format,
  getDay,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { ar } from "date-fns/locale";

export default function BookingUI() {
  const [openTab, setOpenTab] = useState(1);
  const { data: session }: any = useSession();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const UserData: any = useSelector((state: RootState) => state.UserMe);
  const ControlsData: any = useSelector((state: RootState) => state.Control);

  useEffect(() => {
    setLoading(true);
    if (session) {
      const userData = session.user.token;
      const id = 1;
      const fetchData = () => {
        dispatch(fetchUserMeData(userData));
        dispatch(ControlData(1));
      };
      fetchData();
    }
  }, [session?.user?.token, dispatch]);

  // إنشاء قائمة بالأيام المتاحة
  const inputStartDate = new Date(
    ControlsData.data[0]?.attributes.booking_start_date || new Date()
  );
  const inputEndDate = addDays(
    inputStartDate,
    ControlsData.data[0]?.attributes.booking_days_count
  );

  // الوقت المخزن في متغير نصي
  const timeString = `${ControlsData.data[0]?.attributes.end_of_day_time}`; // الساعة 6 مساءً

  // تقسيم الوقت النصي إلى أجزاء
  const [hours, minutes, seconds] = timeString
    .split(":")
    .map((part) => parseInt(part, 10));

  // تاريخ اليوم
  const today = new Date();

  // إنشاء كائن تاريخ جديد بالوقت المحدد
  const specificTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes,
    seconds
  );

  // تاريخ البداية
  const startDate = inputStartDate;

  // تاريخ النهاية
  const endDate = inputEndDate;

  const filterEnabled = ControlsData.data[0]?.attributes.cancel_friday_booking;

  // تحديد الساعة السادسة مساءً في اليوم الحالي
  const todaySixPm = specificTime;

  // إنشاء قائمة بالأيام المتاحة
  const availableDays = eachDayOfInterval({ start: startDate, end: endDate })
    .filter((day) => {
      // حذف الأيام التي انتهت والجمعة (إذا كان الخيار مفعل)
      const isDayValid =
        isBefore(new Date(), day) && (filterEnabled ? getDay(day) !== 5 : true);

      // إخفاء اليوم الحالي إذا كان الوقت بعد السادسة مساءً
      const isAfterSixPm = isAfter(new Date(), todaySixPm);
      const isToday =
        format(new Date(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      const isTomorrow =
        format(addDays(new Date(), 1), "yyyy-MM-dd") ===
        format(day, "yyyy-MM-dd");

      return isDayValid && !(isAfterSixPm && (isToday || isTomorrow));
    })
    .map((day) => ({
      value: format(day, "yyyy-MM-dd"),
      label: format(day, "EEEE, d MMMM yyyy", { locale: ar }),
    }));

  // يمكن استخدام availableDays حسب الحاجة

  if (ControlsData.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="/booking.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="/">
              <span className="sr-only">Home</span>
              <img
                src="/logo.svg"
                className="max-w-32 p-10 bg-white"
                alt=""
              />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              جدولة رحلتك القادمة
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              حجز رحلتك الى الجامعة أصبح اسهل من الماضى
            </p>
          </div>
        </section>

        {ControlsData.loading ||
        (ControlsData.data[0].attributes?.booking_status === true &&
          availableDays.length > 0 &&
          UserData.data.confirmed === true) ? (
          <main className="lg:flex md:flex sm:block items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="w-full">
              <div className="relative -mt-16 block lg:hidden">
                <a
                  className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                  href="/"
                >
                  <span className="sr-only">Home</span>
                  <img src="/logo.svg" className="h-16" alt="Zain Travel" />
                </a>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  احجز رحلتك القادمة
                </h1>

                <p className="mt-4 leading-relaxed text-gray-500">
                  حجز رحلتك الى الجامعة أصبح اسهل من الماضى
                </p>
              </div>

              <div className="mx-auto">
                <div className="mb-4 flex space-x-4 p-2 gap-5 bg-white rounded-lg shadow-md">
                  <button
                    onClick={() => setOpenTab(1)}
                    className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-red transition-all duration-300 ${
                      openTab === 1 ? "bg-red-600 text-white" : ""
                    }`}
                  >
                    <TbBus className="inline ml-2" /> حجز رحلة
                  </button>
                  <button
                    onClick={() => setOpenTab(2)}
                    className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-red transition-all duration-300 ${
                      openTab === 2 ? "bg-red-600 text-white" : ""
                    }`}
                  >
                    <BsBag className="inline ml-2" /> حجز توصيل شنطة
                  </button>
                </div>

                <div
                  className={`transition-all duration-300 bg-white p-4 rounded-lg shadow-md ${
                    openTab === 1 ? "border-red-600" : ""
                  }`}
                  style={{ display: openTab === 1 ? "block" : "none" }}
                >
                  <BookingsUx Data={ControlsData.data[0]} />
                </div>

                <div
                  className={`transition-all duration-300 bg-white p-4 rounded-lg shadow-md ${
                    openTab === 2 ? "border-blue-600" : ""
                  }`}
                  style={{ display: openTab === 2 ? "block" : "none" }}
                >
                  <BookingBags Data={ControlsData.data[1]} />
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div className="lg:flex md:flex sm:block items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            {ControlsData.data[0].attributes?.booking_status === false ? (
              <div className="container px-6 py-16 mx-auto text-center">
                <div className="max-w-lg mx-auto">
                  <h1 className="text-3xl font-semibold text-red-600 lg:text-4xl">
                    عذراً، الحجز مغلق حالياً
                  </h1>
                  <p className="mt-6 text-lg text-gray-500">
                    {ControlsData.data[0].attributes?.notes}
                  </p>
                  <a
                    href="/profile"
                    className="px-5 py-2 mt-6 inline-block   font-medium leading-5 text-center text-white capitalize bg-red-600 rounded-lg hover:bg-red-700 lg:mx-0 lg:w-auto focus:outline-none"
                  >
                    العودة الي حسابي
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {availableDays.length === 0
                  ? "الحجز انتهاء"
                  : UserData.data.confirmed === false && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-8">
                        <strong className="font-bold">تنبيه!</strong>
                        <span className="block sm:inline">
                          {" "}
                          حسابك موقوف. يرجى الاتصال بإدارة الموقع للمزيد من
                          المعلومات.
                        </span>
                      </div>
                    )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
