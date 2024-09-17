"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
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
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { LuSendHorizonal } from "react-icons/lu";
import BookingGusetSection from "./BookingGusetSection";
import { DashboardIdData } from "@/app/redux/features/strapi-0/DashboardIdSlice";

export default function BookingGuestUi() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const Control: any = useSelector((state: RootState) => state.DashboardId);
  const AreasData = useSelector((state: RootState) => state.Area);
  const PlacesData: any = useSelector((state: RootState) => state.Place);
  const [selectedAreaData, setSelectedAreaData]: any = useState(null);
  const [order_number, setOrder_number] = useState();
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [area, setArea] = useState("");
  const [start_point, setStart_Point] = useState("");
  const [destination, setDestination] = useState("جامعة الجلالة");
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (Control.loading) {
      setInitialLoad(false);
    }
    const fetchData = () => {
      dispatch(DashboardIdData(3));
      dispatch(AreaData());
      dispatch(PlaceData());
    };
    fetchData();
    GetCost();
    // setStart_time(GetDataMP?.attributes.timing[0]);
  }, []);

  useEffect(() => {
    // ابحث عن بيانات المنطقة المحددة في القائمة
    const selectedRegion = AreasData.data.find(
      (area: any) => area.attributes.name === area
    );
    // ابحث عن بيانات المنطقة المحددة في القائمة
    const selectedArea = AreasData.data.find(
      (areas: any) => areas.attributes.name === area
    );
    if (selectedArea) {
      // حدد البيانات المرتبطة بالمنطقة المحددة
      setSelectedAreaData(selectedArea.attributes.places.data);
    } else {
      setSelectedAreaData(null); // قم بمسح البيانات إذا لم يتم اختيار منطقة
    }
    setStart_time(GetDataMP?.attributes.timing[0]);
    GetCost();
  }, [area, trip_type, seats, start_point]);

  // البحث عن العنصر بواسطة الاسم
  const GetDataMP: any = PlacesData.data.find(
    (item: any) => item.attributes.place_name === start_point
  );

  function GetCost() {
    if (trip_type === "ذهاب") {
      setTrip_cost(GetDataMP?.attributes.one_way_price * seats);
    } else if (trip_type === "عودة") {
      setTrip_cost(GetDataMP?.attributes.return_price * seats);
    } else if (trip_type === "ذهاب وعودة") {
      setTrip_cost(GetDataMP?.attributes.round_trip_price * seats);
    }
  }

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
    setSubmitButtonDisabled(!!agreeTerms); // تعطيل زر الإرسال عند عدم الموافقة
  };

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
    Control.data.attributes?.booking_start_date || new Date()
  );
  const inputEndDate = addDays(inputStartDate, Control.data.attributes?.booking_days_count);

  // الوقت المخزن في متغير نصي
  const timeString = `${Control.data.attributes?.end_of_day_time}`; // الساعة 6 مساءً

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

  const filterEnabled = Control.data.attributes?.cancel_friday_booking;

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

  //   باقة البيانات المرسلة
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
      {Control.loading ? (
        <div className="mx-auto max-w-3xl my-10 p-5 lg:p-0 ">
          <BookingGusetSection />
        </div>
      ) : Control.data.attributes?.booking_status === true &&
        availableDays.length !== 0 ? (
        <form
          id="form"
          action=""
          method="POST"
          className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8"
          onSubmit={handleSubmit}
        >
          <div className="mt-5"></div>
          <div className="mx-auto max-w-2xl text-center mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-red-600 sm:text-4xl font-tajawal">
              حجز الزوار
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 font-tajawal">
              برجاء تعبئة البيانات التالية بشكل صحيح
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                الاسم{" "}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="first_name"
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setFirst_Name(e.target.value)}
                  value={first_name}
                  pattern="[ء-ي\s]+ [ء-ي\s]+ [ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                  required
                />
              </div>
            </div>

            {/* <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                اسم العائلة{" "}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setLast_Name(e.target.value)}
                  value={last_name}
                  pattern="[ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية"
                  required
                />
              </div>
            </div> */}

            {/* <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                البريد الالكتروني{" "}
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  // pattern=" " // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء ادخال بريد الكتروني بشكل صحيح"
                  required
                  dir="ltr"
                />
              </div>
            </div> */}

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                رقم الهاتف{" "}
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <svg className="pointer-events-none absolute left-3 top-2 h-full w-5 text-gray-400 fill-red-600">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 
                0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 
                1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963
                3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="phone"
                  pattern="[0-5]{3}[0-9]{8}"
                  title="من فضلك ادخل رقم الهاتف الصحيح"
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-10 block w-full focus:outline-red-500"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900/10 mt-5 mb-5"></div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="trip_type"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                نوع الرحلة
              </label>
              <select
                name="trip_type"
                id="trip_type"
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

            <div className="sm:col-span-3">
              <label
                htmlFor="Area"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                المنطقة
              </label>
              <select
                name="Area"
                id="Area"
                autoComplete="Area"
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setStart_Point("");
                }}
                required
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                {AreasData.data.map((Area: any, index: any) => {
                  return (
                    <option key={index} value={Area?.attributes?.name}>
                      {Area?.attributes?.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="start_point"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                {trip_type === "عودة" ? "نقطة العودة" : "نقطة التحرك"}
              </label>
              <select
                name="start_point"
                id="start_point"
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={start_point}
                onChange={(e) => setStart_Point(e.target.value)}
                required
                disabled={!selectedAreaData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
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
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            {/* {trip_type !== "عودة" && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="start_time"
                  className="block font-medium leading-6 text-gray-900 mb-2"
                >
                  التوقيت
                </label>
                <select
                  name="start_time"
                  id="start_time"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={start_time}
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
            )} */}

            {trip_type !== "ذهاب" && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="end_time"
                  className="block font-medium leading-6 text-gray-900 mb-2"
                >
                  توقيت العودة
                </label>
                <select
                  name="end_time"
                  id="end_time"
                  value={end_time}
                  onChange={(e) => setEnd_time(e.target.value)}
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  {Control?.data?.attributes?.departure_time.map(
                    (time: any) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

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
          </div>

          <div className="border-t border-gray-900/10 mt-3"></div>
          <div className="mt-3">
            <h3 className="font-bold text-lg">
              <span className="text-lg text-red-500 font-bold">تكلفة الرحلة : </span>
              {`${trip_cost ? trip_cost : "0"} جنيهًا`}
            </h3>
          </div>
          <div className="border-t border-gray-900/10 mt-3"></div>

          <div className="mt-5">
            <label htmlFor="agree-terms" className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
              />
              <span className="mr-5 text-gray-900 cursor-pointer">
                الموافقة على{" "}
                <span className="text-red-700 font-bold underline">
                  <a href="/pages/policy" target="_blank">
                    شروط التسجيل
                  </a>
                </span>
              </span>
            </label>
          </div>

          <div className="border-t border-gray-900/10 mt-3"></div>
          <div className="mt-5 mb-10">
            <button
              type="submit"
              name="submit"
              id="submit"
              className={`block w-full rounded-md px-3.5 py-2.5 text-center text-white shadow-sm 
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
            ${
              submitButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }`}
              disabled={submitButtonDisabled}
            >
              متابعة الحجز
              <LuSendHorizonal className="inline-block mr-3 mb-2 -rotate-45" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="lg:flex md:flex sm:block items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          {Control.data.attributes?.booking_status === false ? (
            <div className="container px-6 py-16 mx-auto text-center">
              <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-semibold text-red-600 lg:text-4xl">
                  عذراً، الحجز مغلق حالياً
                </h1>
                <p className="mt-6 text-lg text-gray-500">
                  {Control.data.attributes?.notes}
                </p>
                <a
                  href="/"
                  className="px-5 py-2 mt-6 inline-block   font-medium leading-5 text-center text-white capitalize bg-red-600 rounded-lg hover:bg-red-700 lg:mx-0 lg:w-auto focus:outline-none"
                >
                  الرئيسية
                </a>
              </div>
            </div>
          ) : (
            <div className="text-3xl font-semibold text-red-600 lg:text-4xl">
              {availableDays.length === 0 && (
                <div className="container px-6 py-16 mx-auto text-center">
                  <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-semibold text-red-600 lg:text-4xl">
                      عذراً، الحجز مغلق حالياً
                    </h1>
                    <p className="mt-6 text-lg text-gray-500">
                      {Control.data.attributes?.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
