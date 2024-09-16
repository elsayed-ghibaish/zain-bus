"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LuSendHorizonal } from "react-icons/lu";
import { parseISO } from "date-fns/parseISO";

import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchUserMeData } from "@/app/redux/features/strapi-1/UserMeSlice";
import { BookingDashboardData } from "@/app/redux/features/strapi-1/BookingDashboardSlice";
import { PlaceData } from "@/app/redux/features/strapi-0/PlacesSlice";
import {
  addDays,
  eachDayOfInterval,
  isBefore,
  format,
  getDay,
  isAfter,
} from "date-fns";
import { ar } from "date-fns/locale";

export default function BookingBags({ Data }: any) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const UserData: any = useSelector((state: RootState) => state.UserMe);
  const Places: any = useSelector((state: RootState) => state.Place);

  const GetData = Data;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [order_number, setOrder_number] = useState();
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [area, setArea] = useState("");
  const [start_point, setStart_Point] = useState("");
  const [destination, setDestination] = useState("");
  const [bag_type, setBag_Type] = useState("");
  const [date, setDate] = useState("");

  const [start_time, setStart_time] = useState("");
  // const [end_time, setEnd_time] = useState("");
  const [seats, setseats]: any = useState("");
  const [payment_type, setPayment_type] = useState("");
  const [trip_cost, setTrip_cost]: any = useState();
  const [payment_status, setPayment_status] = useState();
  const [trip_status, setTrip_status] = useState("");
  const [completed, setCompleted] = useState("");
  const [user_id, setUser_id] = useState();

  useEffect(() => {
    setLoading(true);
    if (session) {
      const userData = session.user.token;
      const id = 2;
      const fetchData = () => {
        dispatch(fetchUserMeData(userData));
        dispatch(PlaceData());
      };
      fetchData();
    }

    setFirst_Name(UserData.data.first_name);
    setLast_Name(UserData.data.last_name);
    setPhone(UserData.data.phone_number);
    setEmail(UserData.data.email);
    setArea(UserData.data.area);
    setStart_Point(UserData.data.start_point);
    setStart_time(GetDataMP?.attributes.timing[0]);
    setDestination(UserData.data.university);
    setUser_id(UserData.data.id);
    GetCost();
  }, [session, bag_type]);

  function GetCost() {
    if (bag_type === "شنطة أكل صغيرة") {
      setTrip_cost("40");
    } else if (bag_type === "شنطة سفر") {
      setTrip_cost("60");
    } else if (bag_type === "أخري") {
      setTrip_cost("75");
    }
  }

  // البحث عن العنصر بواسطة الاسم
  const GetDataMP: any = Places.data.find(
    (item: any) => item.attributes.place_name === start_point
  );

  const handleDateChange = (event: any) => {
    // استقبال التاريخ من حقل الإدخال
    const selectedDate = event.target.value;

    // تحويل التاريخ إلى الصيغة المطلوبة
    const date = format(new Date(selectedDate), "yyyy-MM-dd");

    // تعيين التاريخ بالصيغة المحولة إلى الحالة
    setDate(date);
  };

  const handleTimeChange = (event: any) => {
    // استقبال الوقت من حقل الإدخال
    const selectedTime = event.target.value;

    // تحويل الوقت إلى الصيغة المطلوبة
    const formattedTime = format(new Date(`${selectedTime}`), "HH:mm:ss");

    // تعيين الوقت بالصيغة المحولة إلى الحالة
    setStart_time(formattedTime);
  };

  // إنشاء قائمة بالأيام المتاحة
  const inputStartDate = new Date(
    GetData?.attributes.booking_start_date || new Date()
  );
  const inputEndDate = addDays(
    inputStartDate,
    GetData?.attributes.booking_days_count
  );

  // الوقت المخزن في متغير نصي
  const timeString = `${GetData?.attributes.end_of_day_time}`; // الساعة 6 مساءً

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

  const filterEnabled = GetData?.attributes.cancel_friday_booking;

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

  const data_send_bag = {
    order_number,
    first_name,
    last_name,
    phone,
    email,
    area,
    start_point,
    destination,
    bag_type,
    date,
    start_time,
    payment_type,
    trip_cost,
    user_id,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !email ||
      !area ||
      !start_point ||
      !destination ||
      !bag_type ||
      !date ||
      !start_time ||
      !trip_cost ||
      !user_id
    ) {
      setError("جميع الحقول ضرورية");
      return;
    }
    localStorage.removeItem("booking");
    localStorage.setItem("booking", JSON.stringify(data_send_bag));
    toast.success("تم اضافة الحجز لقائمة الدفع");
    router.replace("/cart");
  };

  return (
    <section>
      <form
        id="form"
        action=""
        method="POST"
        className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8"
        onSubmit={handleSubmit}
      >
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="bag_type"
              className="block mb-3 font-medium leading-6 text-gray-900"
            >
              نوع الشنطة
            </label>
            <select
              name="bag_type"
              id="bag_type"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={bag_type}
              onChange={(e) => setBag_Type(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                اختر الشنطة
              </option>
              <option value="شنطة أكل صغيرة">شنطة أكل صغيرة</option>
              <option value="شنطة سفر">شنطة سفر</option>
              <option value="أخري">أخري</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="date"
              className="block mb-3 font-medium leading-6 text-gray-900"
            >
              تاريخ الرحلة
            </label>
            <div className="sm:col-span-3">
              <select
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                required
              >
                <option value="" disabled hidden>
                  اختر التاريخ
                </option>
                {availableDays.map((day: any) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="start_time_2"
              className="block mb-3 font-medium leading-6 text-gray-900"
            >
              التوقيت
            </label>
            <select
              name="start_time_2"
              id="start_time_2"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={start_time}
              onChange={(e) => setStart_time(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                اختر
              </option>

              {/* <option value="">{GetDataMP?.attributes.time}</option> */}

              {GetDataMP?.attributes.timing.map((item: any, index: any) => {
                if (index === 1) {
                  return null;
                }
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}

              {/* {GetDataMP?.attributes.time.map((item: any, index: any) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))} */}
            </select>
          </div>
        </div>
        <div className="border-t border-gray-900/10 mt-3"></div>
        <div className="mt-3">
          <h3>
            <span className="text-red-500 font-medium">تكلفة الرحلة : </span>
            {`${trip_cost ? trip_cost : "0"} ج.م`}
          </h3>
        </div>
        <div className="border-t border-gray-900/10 mt-3"></div>

        <div className="mt-5">
          <button
            type="submit"
            name="submit"
            id="submit"
            className="block w-full rounded-md px-3.5 py-2.5 text-center text-lg  text-white shadow-sm 
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
            bg-red-700 hover:bg-red-800"
          >
            {!loading ? "جاري إرسال البيانات..." : "متابعة الحجز"}
            <LuSendHorizonal className="inline-block mr-3 mb-2 -rotate-45" />
          </button>
        </div>

        {success && (
          <div
            className="mb-3 mt-5 inline-flex w-full items-center rounded-lg bg-green-100 px-6 py-5 text-base text-green-700"
            role="alert"
          >
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            تم تسجيل الحجز بنجاح
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
