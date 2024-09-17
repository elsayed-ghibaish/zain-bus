"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import {
  parseISO,
  format,
  isBefore,
  isAfter,
  addDays,
  getDay,
  eachDayOfInterval,
} from "date-fns";
import { ar } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchUserMeData } from "@/app/redux/features/strapi-1/UserMeSlice";
import { BookingDashboardData } from "@/app/redux/features/strapi-1/BookingDashboardSlice";
import { PlaceData } from "@/app/redux/features/strapi-0/PlacesSlice";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import SkeletonLoaders from "./SkeletonLoaders";

export default function BookingsUx({ Data }: any) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const dispatch: AppDispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const UserData: any = useSelector((state: RootState) => state.UserMe.data);
  const ControlsData: any = useSelector(
    (state: RootState) => state.BookingDashboard
  );
  const AreasData = useSelector((state: RootState) => state.Area.data);
  const PlacesData: any = useSelector((state: RootState) => state.Place.data);

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
  const [selectedAreaData, setSelectedAreaData]: any = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    if (session) {
      const userToken = session.user.token;
      dispatch(fetchUserMeData(userToken));
      dispatch(BookingDashboardData({ token: userToken, id: 1 }));
      dispatch(AreaData());
      dispatch(PlaceData());
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (UserData) {
      setFirst_Name(UserData.first_name);
      setLast_Name(UserData.last_name);
      setPhone(UserData.phone_number);
      setEmail(UserData.email);
      setArea(UserData.area);
      setStart_Point(UserData.start_point);
      setStart_time(GetDataMP?.attributes?.timing[0]);
      setDestination(UserData.university);
      setUser_id(UserData.id);
    }
  }, [UserData]);

  useEffect(() => {
    if (area && AreasData) {
      const selectedArea = AreasData.find(
        (areaItem: any) => areaItem.attributes.name === area
      );
      if (selectedArea) {
        setSelectedAreaData(selectedArea.attributes.places.data);
      } else {
        setSelectedAreaData(null);
      }
    }
    GetCost();
    setStart_time(GetDataMP?.attributes.timing[0]);
  }, [area, trip_type, seats, start_point]);

  const GetDataMP: any = PlacesData?.find(
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
    localStorage.removeItem("booking-success");
    localStorage.setItem("booking", JSON.stringify(data_send));
    toast.success("تم إضافة الحجز للدفع");
    router.replace("/cart");
  };

  return (
    <section>
      {ControlsData.loading ? (
        <SkeletonLoaders />
      ) : (
        <>
          <div className="m-auto text-center">
            {(area === "الحسينية" || area === "أبو حماد") && (
              <div
                className="bg-orange-100 border-r-4 text-right border-orange-500 text-orange-700 p-4"
                role="alert"
              >
                <p className="font-bold">تنبيه هام</p>
                <p>
                  يرجي العلم بان الحجز متاح لنقطة التحرك الخاصة بك فى الذهاب فقط
                  أيام (السبت - الأحد - الأثنين)
                </p>
              </div>
            )}
          </div>

          <form
            id="form"
            action=""
            method="POST"
            className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8"
            onSubmit={handleSubmit}
          >
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

              {trip_type !== "عودة" && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="start_point"
                    className="block font-medium leading-6 text-gray-900 mb-2"
                  >
                    نقطة التحرك
                  </label>
                  <select
                    name="start_point"
                    id="start_point"
                    className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    value={start_point}
                    onChange={(e) => setStart_Point(e.target.value)}
                    // required
                    // disabled={!selectedAreaData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
                  >
                    <option value="" disabled hidden>
                      اختر
                    </option>
                    {selectedAreaData &&
                      selectedAreaData.map((point: any, index: any) => (
                        <option key={index} value={point.attributes.place_name}>
                          {point.attributes.place_name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

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

              <div className="sm:col-span-3">
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

            {payment_type === "فودافون كاش" && (
              <div className="text-sm text-gray-900 mt-2 bg-red-300 p-5">
                {
                  "برجاء ارسال قيمة الحجز على رقم (01012930010) مرفق معاه سكرين شوت للتحويل على واتساب لنفس الرقم"
                }
              </div>
            )}

            <div className="border-t border-gray-900/10 mt-3"></div>
            <div className="mt-3">
              <h3 className="font-bold text-lg">
                <span className="text-lg text-red-500 font-bold">
                  تكلفة الرحلة :{" "}
                </span>
                {`${trip_cost ? trip_cost : "0"} جنيهًا`}
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
        </>
      )}
    </section>
  );
}
