"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
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
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { ar } from "date-fns/locale";
import { PlaceTwo } from "@/app/api/PlaceTwo";

export default function BookingsUx({ Data }: any) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const UserData: any = useSelector((state: RootState) => state.UserMe);
  const ControlsData: any = useSelector(
    (state: RootState) => state.BookingDashboard
  );
  const PlacesData: any = useSelector((state: RootState) => state.Place);

  const GetData = Data;

  const [order_number, setOrder_number] = useState();
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [area, setArea] = useState("");
  const [start_point, setStart_Point] = useState("");
  const [destination, setDestination] = useState("");
  const [trip_type, setTrip_type] = useState("");
  const [date, setDate] = useState("");

  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [seats, setseats]: any = useState("");
  const [payment_type, setPayment_type] = useState("");
  const [trip_cost, setTrip_cost]: any = useState();
  const [payment_status, setPayment_status] = useState();
  const [trip_status, setTrip_status] = useState("");
  const [completed, setCompleted] = useState("");
  const [user_id, setUser_id] = useState();

  const [area_two, setArea_Tow] = useState("");
  const [area_three, setArea_Three] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setStart_Point(UserData.data.start_point);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (session) {
      const userData = session.user.token;
      const id = 1;
      const fetchData = () => {
        dispatch(fetchUserMeData(userData));
        dispatch(BookingDashboardData({ token: userData, id }));
        dispatch(PlaceData());
      };
      fetchData();
    }

    setFirst_Name(UserData.data.first_name);
    setLast_Name(UserData.data.last_name);
    setPhone(UserData.data.phone_number);
    setEmail(UserData.data.email);
    setArea(UserData.data.area);
    // setStart_Point(UserData.data.start_point);
    setDestination(UserData.data.university);
    setUser_id(UserData.data.id);
    setStart_time(GetDataMP?.attributes.timing[0]);
    GetCost();
  }, [session.user.token, dispatch, trip_type, seats]);

  // البحث عن العنصر بواسطة الاسم
  const GetDataMP: any =
    PlacesData?.data?.find(
      (item: any) => item.attributes.place_name === start_point
    ) ||
    PlaceTwo.places?.data?.find(
      (item: any) => item.attributes.place_name === start_point
    );

  function GetCost() {
    if (GetDataMP) {
      if (trip_type === "ذهاب") {
        setTrip_cost(GetDataMP.attributes.one_way_price * seats);
      } else if (trip_type === "عودة") {
        setTrip_cost(GetDataMP.attributes.return_price * seats);
      } else if (trip_type === "ذهاب وعودة") {
        setTrip_cost(GetDataMP.attributes.round_trip_price * seats);
      }
    }
  }

  console.log(start_time, start_point);

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
    GetData.attributes.booking_start_date || new Date()
  );
  const inputEndDate = addDays(
    inputStartDate,
    GetData.attributes.booking_days_count
  );

  // الوقت المخزن في متغير نصي
  const timeString = `${GetData.attributes.end_of_day_time}`; // الساعة 6 مساءً

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

  const filterEnabled = GetData.attributes.cancel_friday_booking;

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

  const data_send = {
    order_number,
    first_name,
    last_name,
    phone,
    email,
    area,
    start_point,
    destination,
    trip_type,
    date,
    start_time,
    end_time,
    seats,
    payment_type,
    trip_cost,
    payment_status,
    user_id,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.removeItem("booking");
    localStorage.setItem("booking", JSON.stringify(data_send));
    toast.success("تم إضافة الحجز للدفع");
    router.replace("/cart");
  };

  // const city: any = ["فاقوس", "كوبري القصاصين"];

  const areatwo: any = {
    الحسينية: ["فاقوس"],
    "كوبري القصاصين": ["كوبري القصاصين"],
  };

  return (
    <section>
      <div className="m-auto text-center">
        {area == "الحسينية" || area == "أبو حماد" ? (
          <div
            className="bg-orange-100 border-r-4 text-right border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p className="font-bold">تنبيه هام</p>
            <p>
              يرجي العلم بان الحجز متاح لنقطة التحرك الخاص بك فى الذهاب فقط أيام
              ( السبت - الأحد - الأثنين ){" "}
            </p>
          </div>
        ) : (
          // <div className="grid grid-cols-1 sm:grid-cols-4 bg-yellow-400 rounded-md">
          //   <div className="sm:col-span-1 bg-slate-100 rounded-r-md">
          //     <span>
          //       <IoWarningOutline className="text-6xl text-center m-auto text-yellow-400 items-center animate-pulse" />
          //     </span>
          //   </div>
          //   <div className="sm:col-span-3">
          //     <h2 className="block font-medium p-2 border-r-8 border-yellow-600 ">
          //       الحجز غير متاح لمنطقتك الحالية برجاء اختيار منطقة بدلية من
          //       الخيارات المتاحة
          //     </h2>
          //   </div>
          // </div>
          ""
        )}
      </div>
      <form
        id="form"
        action=""
        method="POST"
        className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8"
        onSubmit={handleSubmit}
      >
       {(() => {
  const currentDay = new Date().getDay(); // 0 هو الأحد، 1 هو الاثنين، وهكذا

  area == "الحسينية" || area == "أبو حماد"
  // التحقق إذا كان اليوم ليس السبت (6)، الأحد (0)، أو الاثنين (1)
  if (![0, 1, 2].includes(currentDay) || trip_type === "ذهاب") {
    return (
      <>
        <div className="sm:col-span-3">
          <label
            htmlFor="areatwo"
            className="block mb-2 font-medium leading-6 text-gray-900"
          >
            اختيار نقطة التحرك
          </label>
          <select
            name="areatwo"
            id="areatwo"
            className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
            value={start_point}
            onChange={(e) => setStart_Point(e.target.value)}
            required
          >
            <option value="">اختر</option>
            {PlaceTwo.places.data.map((item: any, index: any) => {
              return (
                <option value={item.attributes.place_name} key={index}>
                  {item.attributes.place_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="border-t border-gray-900/10 mt-5"></div>
      </>
    );
  }
  return null; // لا يعرض شيئاً في حالة كان اليوم السبت، الأحد، أو الاثنين
})()}

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="TripType"
              className="block font-medium leading-6 text-gray-900 mb-2"
            >
              نوع الرحلة
            </label>
            <select
              name="TripType"
              id="TripType"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={trip_type}
              onChange={(e) => setTrip_type(e.target.value)}
              required
            >
              <option disabled hidden></option>
              <option value="ذهاب">ذهاب</option>
              <option value="عودة">عودة</option>
              <option value="ذهاب وعودة">ذهاب وعودة</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="date"
              className="block font-medium leading-6 text-gray-900 mb-2"
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

          {trip_type !== "عودة" && (
            <div className="sm:col-span-3">
              <label
                htmlFor="timing"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                التوقيت
              </label>
              <select
                name="timing"
                id="timing"
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={GetDataMP?.attributes.timing[0]}
                onChange={(e) => setStart_time(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                {GetDataMP?.attributes.timing.map((item: any, index: any) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {trip_type !== "ذهاب" && (
            <div className="sm:col-span-3">
              <label
                htmlFor="time"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                العودة
              </label>
              <select
                name="time"
                id="time"
                value={end_time}
                onChange={(e) => setEnd_time(e.target.value)}
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                required
              >
                <option value="" disabled hidden>
                  نهاية المحاضرات
                </option>
                {ControlsData?.data?.attributes?.departure_time.map(
                  (time: any) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>

        <div className="sm:col-span-3 mt-5">
          <label
            htmlFor="seats"
            className="block font-medium leading-6 text-gray-900 mb-2"
          >
            عدد المقاعد
          </label>
          <select
            name="seats"
            id="seats"
            className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
            value={seats}
            onChange={(e) => setseats(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              اختر
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {payment_type === "فودافون كاش" && (
          <div className="text-sm text-gray-900 mt-2 bg-red-300 p-5">
            {
              "برجاء ارسال قيمة الحجز على رقم (01012930010) مرفق معاه سكرين شوت للتحويل على واتساب لنفس الرقم"
            }
          </div>
        )}

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
            className="block w-full rounded-md px-3.5 py-2.5 text-lg text-center text-white shadow-sm 
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
