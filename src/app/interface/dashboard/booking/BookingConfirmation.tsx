"use client";
import React, { useEffect, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { ar } from "date-fns/locale/ar";
import Link from "next/link";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { HiPencilAlt } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import { FaAmazonPay } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { BookingData } from "@/app/redux/features/strapi-0/BookingSlice";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";

export default function BookingConfirmation() {
  const [data2, setData]: any = useState([]);
  const [BookingDay, setBookingDay] = useState<string | null>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedCities, setselectedCities] = useState<string[]>([]);
  const [selectedTypeOfTrip, setselectedTypeOfTrip] = useState<string | null>(
    null
  );
  const [selectedPayment, setselectedPayment] = useState<string | null>(null);
  const [TimingMov, setTimingMov] = useState<string>("");
  const [TimingEnd, setTimingEnd] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [totalPrice2, settotalPrice2]: any = useState([]);
  const [OperatingCosts, setOperatingCosts]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  let counter = 1; // تهيئة متغير الـ counter لكل بيان

  const dispatch: AppDispatch = useDispatch();
  const Areas = useSelector((state: RootState) => state.Area);
  const Bookings: any = useSelector((state: RootState) => state.Booking);
  const Control: any = useSelector((state: RootState) => state.Control);

  const fetchData = () => {
    dispatch(AreaData());
    dispatch(BookingData(BookingDay));
    dispatch(ControlData(1));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, BookingDay, data2]); // استبدال data2 بـ BookingDay لجلب البيانات عند تغييره

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const handleResponse = (
    res: any,
    successMessage: string,
    id: any,
    updatedData: any[]
  ) => {
    if (res.status !== 200) {
      throw new Error(
        `Failed to update booking. Server response: ${res.statusText}`
      );
    }
    toast.success(successMessage);
    setData(updatedData.filter((item: any) => item.id !== id));
  };

  const PayBooking = async (id: any) => {
    try {
      const res = await axios.put(
        `${apiUrl}/bookings/${id}`,
        { data: { payment_status: true } },
        config
      );
      handleResponse(res, "تم تحويل الحجز الى مدفوع بنجاح", id, data2);
    } catch (error) {
      toast.error("خطاء ليس لديك صلاحيات");
      console.error(error);
    }
  };

  const UnPayBooking = async (id: any) => {
    try {
      const res = await axios.put(
        `${apiUrl}/bookings/${id}`,
        { data: { payment_status: false } },
        config
      );
      handleResponse(res, "تم إلغاء دفع الحجز بنجاح", id, data2);
    } catch (error) {
      toast.error("خطاء ليس لديك صلاحيات");
      console.error(error);
    }
  };

  const ConfirmBooking = async (item: any) => {
    try {
      const res = await axios.put(
        `${apiUrl}/bookings/${item.id}`,
        { data: { trip_status: "confirmed" } },
        config
      );
      handleResponse(res, "تم تأكيد الحجز بنجاح", item.id, data2);
      fetchData();
      sendemail(item);
      sendWhatsapp(item);
    } catch (error) {
      console.error(error);
    }
  };

  const RejectBooking = async (item: any) => {
    if (confirm("هل أنت متاكد من إلغاء الحجز")) {
      try {
        const res = await axios.put(
          `${apiUrl}/bookings/${item.id}`,
          { data: { trip_status: "rejected" } },
          config
        );
        RcjSendWhatsapp(item);
        handleResponse(res, "تم إلغاء الحجز بنجاح", item.id, data2);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const sendemail = async (item: any) => {
    const dayBO =
      item.attributes.date &&
      format(parseISO(item.attributes.date), "eeee, d MMMM yyyy", {
        locale: ar,
      });
    const res = await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        subject: "تم تاكيد حجز الرحلة بنجاح",
        amount: item.attributes.price,
        email: item.attributes.email,
        day: `تاريخ الحجز: ${dayBO}`,
        trip_type: `${
          item.attributes.trip_type
            ? `نوع الرحلة: ${item.attributes.trip_type}`
            : ""
        }`,
        message: "تم تاكيد حجز الرحلة بنجاح ",
        fullName: `${item.attributes.name?.split(" ")[0] || ""} ${
          item.attributes.name?.split(" ").pop() || ""
        }`,
      }),
    });
  };

  const sendWhatsapp = async (item: any) => {
    const bookingday =
      item.attributes.date &&
      format(parseISO(item.attributes.date), "eeee, d MMMM yyyy", {
        locale: ar,
      });

    const api_key = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
    const sender = process.env.NEXT_PUBLIC_WHATSAPP_SENDER;

    const message = `
   *مرحبا* ${item.attributes.first_name.split(" ")[0] || ""}👋🏻،
   ✅ *تم تاكيد حجز رحلتك بنجاح*
   *بيانات الرحلة*
   📅 *تاريخ الرحلة*: ${bookingday}
   🚗 *نوع الرحلة*: ${item.attributes.trip_type}
   👥 *عدد المقاعد*: ${item.attributes.seats}
   ${
     item.attributes.trip_type === "عودة"
       ? `📌 *نقطة التحرك*: جامعة الجلالة`
       : `📌 *نقطة التحرك*: ${item.attributes.start_point}`
   }
   ${
     item.attributes.trip_type !== "عودة"
       ? `🕧 *معاد التحرك*: ${item.attributes.start_time}`
       : ""
   }
   ${
     item.attributes.trip_type !== "ذهاب"
       ? `🕐 *معاد العودة*: ${item.attributes.end_time}`
       : ""
   }   
   📢 نرجو التواجد قبل معاد التحرك بـ 15 دقيقة 
      *مع تحياتنا،*
      Zain Bus
    `;

    try {
      const response = await axios({
        method: "POST",
        url: "https://otp.metaphilia.com/api/send-message",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          api_key: api_key,
          sender: sender,
          number: `2${item.attributes.phone}`,
          message: message,
        },
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const RcjSendWhatsapp = async (item: any) => {
    const bookingday =
      item.attributes.date &&
      format(parseISO(item.attributes.date), "eeee, d MMMM yyyy", {
        locale: ar,
      });

    const api_key = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
    const sender = process.env.NEXT_PUBLIC_WHATSAPP_SENDER;

    const message = `
   *مرحبا* ${item.attributes.first_name.split(" ")[0] || ""}👋🏻،
   ❌ *نأسف لإبلاغك بأنه تم إلغاء حجز رحلتك*
   📅 *المقررة يوم*: ${bookingday} 
    وذلك بسبب عدم استكمال عملية الدفع
   💸 *تكلفة الرحلة*: ${item.attributes.trip_cost} جنيهًا
      *مع تحياتنا،*
      Zain Bus
    `;

    try {
      const response = await axios({
        method: "POST",
        url: "https://otp.metaphilia.com/api/send-message",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          api_key: api_key,
          sender: sender,
          number: `2${item.attributes.phone}`,
          message: message,
        },
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error(error);
    }
  };

  // valed
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDay(event.target.value);
  };

  const handleTypeOfTripSelChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setselectedTypeOfTrip(event.target.value);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedPayment(event.target.value);
  };

  const handleTimeMovChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimingMov(event.target.value);
  };

  const handleEndTimeChange = (Time_r: string) => {
    const updatedTimingEnd = TimingEnd.includes(Time_r)
      ? TimingEnd.filter((t) => t !== Time_r)
      : [...TimingEnd, Time_r];
    setTimingEnd(updatedTimingEnd);
  };

  const handleCityChange = (city: string) => {
    const updatedCities = selectedCities.includes(city)
      ? selectedCities.filter((c) => c !== city)
      : [...selectedCities, city];

    setselectedCities(updatedCities);
  };

  // فلترة البيانات واستبعاد التي لا تستوفي الشرط
  const filteredData = Bookings.data
    .filter((item: any) => {
      // تحقق من التاريخ
      if (
        BookingDay &&
        format(parseISO(item.attributes.date), "yyyy-MM-dd") !== BookingDay
      ) {
        return false;
      }

      // تحقق من الوقت
      if (TimingMov) {
        if (item.attributes.start_time.includes(TimingMov)) {
          return true;
        } else if (item.attributes.start_time.includes(TimingMov)) {
          return true;
        } else {
          return false;
        }
      }
      // تحقق من المنطقة
      if (
        selectedCities.length > 0 &&
        !selectedCities.includes(item.attributes.area)
      ) {
        return false;
      }
      // تحديد نوع الرحلة
      if (selectedTypeOfTrip) {
        if (selectedTypeOfTrip === "ذهاب وعودة") {
          // إذا كان نوع الرحلة هو "ذهاب وعودة"، فقط عرض الحجوزات التي تحمل هذا النوع
          return item.attributes.trip_type === "ذهاب وعودة";
        } else {
          // إذا كان نوع الرحلة هو "ذهاب" أو "عودة"، فقط تجاهل الحجوزات التي تحمل نوع "ذهاب وعودة"
          return (
            item.attributes.trip_type === selectedTypeOfTrip ||
            item.attributes.trip_type === "ذهاب وعودة"
          );
        }
      }

      // البحث عن اسم
      if (
        search.length > 0 &&
        !item.attributes.first_name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // تحقق من نهاية المحاضرة
      if (
        TimingEnd.length > 0 &&
        !TimingEnd.includes(item.attributes.end_time)
      ) {
        return false;
      }

      // تحقق من حالة الدفع
      if (selectedPayment) {
        if (selectedPayment === "false") {
          return item.attributes.payment_status === false;
        } else {
          return (
            item.attributes.payment_status === selectedPayment ||
            item.attributes.payment_status === true
          );
        }
      }

      // العنصر يفي بجميع شروط الفلتر
      return true;
    })
    .filter((item: any) => item.attributes.trip_status === "pending");

  // حساب عدد الصفحات الإجمالي بناءً على البيانات المفلترة
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // حساب مؤشر البداية والنهاية للعناصر في الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // إضافة متغيرات لحساب الصفحة السابقة والتالية
  const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;

  // console.log(currentItems);

  useEffect(() => {
    if (currentItems && currentItems.length > 0) {
      const totalPrice = filteredData.reduce((acc: number, item: any) => {
        // تحويل قيمة السعر إلى عدد وإضافتها إلى الناتج الجزئي
        return acc + parseFloat(item.attributes.trip_cost);
      }, 0);
      settotalPrice2(totalPrice);
    }
  }, [currentItems]);

  const totalSeats = currentItems.reduce(
    (acc: any, booking: any) => acc + booking.attributes.seats,
    0
  );

  if (Bookings.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }
  return (
    <div className="bg-slate-200">
      <div className="flex-1">
        <div className="grid grid-cols-2 print:my-5">
          <h3 className="p-2">
            <span className="text-red-600 font-semibold">اليوم:</span>{" "}
            {BookingDay &&
              format(parseISO(BookingDay), "eeee, d MMMM yyyy", {
                locale: ar,
              })}
          </h3>

          <h3 className="p-2">
            <span className="text-red-600 font-semibold">المنطقة:</span>{" "}
            {selectedCities.join(" - ") ? selectedCities.join(" - ") : "الكل"}
          </h3>
        </div>

        <div className="bg-slate-300 border-2 border-white shadow-sm rounded-t-lg grid grid-cols-1 gap-x-7 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 p-5 print:hidden print:bg-none">
          <div className="sm:col-span-1 md:col-span-4 lg:col-span-2 flex flex-col sm:flex-row justify-center items-center">
            <label
              className="block text-sm w-full sm:w-36 font-medium leading-6 text-gray-900"
              htmlFor="date"
            >
              حسب التاريخ
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full sm:w-auto focus:outline-red-500"
              value={BookingDay || ""}
              onChange={handleDateChange}
            />
          </div>

          <div className="sm:col-span-2 md:col-span-4 lg:flex bg-slate-200 p-1 rounded-md">
            <span className="text-sm font-medium text-gray-900 justify-center flex items-center">
              حسب المدينة
            </span>
            {Areas.data.map((cityName: any) => (
              <label
                htmlFor={`checkboxes-${cityName.id}`}
                key={cityName.id}
                className="flex items-center justify-center cursor-pointer m-1"
              >
                <input
                  type="checkbox"
                  id={`checkboxes-${cityName.id}`}
                  name={`checkboxes-${cityName.id}`}
                  className="ml-2 border shadow form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
                  value={cityName.attributes.name}
                  checked={selectedCities.includes(cityName.attributes.name)}
                  onChange={() => handleCityChange(cityName.attributes.name)}
                />
                {cityName.attributes.name}
              </label>
            ))}
          </div>

          <hr className="sm:col-span-2 md:col-span-6" />
          <div className="sm:col-span-2">
            <label
              htmlFor="checkboxesTwo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              حسب الرحلة
            </label>
            <select
              id="checkboxesTwo"
              name="checkboxesTwo"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={selectedTypeOfTrip || ""}
              onChange={handleTypeOfTripSelChange}
            >
              <option value="">اختر</option>
              <option value="ذهاب">ذهاب</option>
              <option value="عودة">عودة</option>
              <option value="ذهاب وعودة">ذهاب وعودة</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="checkboxesFour"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              حسب معاد الرحلة
            </label>
            <select
              id="checkboxesFour"
              name="checkboxesFour"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={TimingMov || ""}
              onChange={handleTimeMovChange}
            >
              <option value="">اختر</option>
              {Control.data[0]?.attributes?.GoingTime.map(
                (Going: any, index: any) => (
                  <option key={index} value={Going.value}>
                    {Going.label}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <span className="block text-sm font-medium leading-6 text-gray-900">
              نهاية المحاضرة
            </span>
            {Control.data[0]?.attributes?.departure_time.map(
              (Time_r: any, index: any) => (
                <label
                  htmlFor={`checkboxes-5-${index}`}
                  key={index}
                  className="inline-flex items-center cursor-pointer m-1"
                >
                  <input
                    type="checkbox"
                    id={`checkboxes-5-${index}`}
                    name={`checkboxes-5-${index}`}
                    className="mx-3 border shadow form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
                    value={Time_r.value || ""}
                    checked={TimingEnd.includes(Time_r.value)}
                    onChange={() => handleEndTimeChange(Time_r.value)}
                  />
                  {Time_r.label}
                </label>
              )
            )}
          </div>

          <hr className="sm:col-span-2 md:col-span-6" />

          <div className="sm:col-span-2">
            <label
              className="block text-sm w-36 font-medium leading-6 text-gray-900"
              htmlFor="search"
            >
              بـحــــث
            </label>
            <input
              type="text"
              id="search"
              name="search"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              placeholder="البحث عن اسم ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="checkboxesThree"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              الدفع
            </label>
            <select
              id="checkboxesThree"
              name="checkboxesThree"
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
              value={selectedPayment || ""}
              onChange={handlePaymentChange}
            >
              <option value="">اختر</option>
              <option value="true">مدفوعة</option>
              <option value="false">غير مدفوعة</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="connter-3"
              className="block text-sm w-36 font-medium leading-6 text-gray-900"
            >
              عدد الصفوف
            </label>
            <input
              type="number"
              id="connter-3"
              name="connter-3"
              min={1}
              value={itemsPerPage}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                if (!isNaN(newValue) && newValue > 0) {
                  setItemsPerPage(newValue);
                }
              }}
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
            />
          </div>

          <div className="sm:col-span">
            <label
              htmlFor="OperatingCosts"
              className="block text-sm w-36 font-bold leading-6 text-red-600"
            >
              تكاليف تشغيل
            </label>
            <input
              type="number"
              id="OperatingCosts"
              name="OperatingCosts"
              min={0}
              value={OperatingCosts}
              onChange={(e) => setOperatingCosts(Number(e.target.value))}
              className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
            />
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-white shadow-sm rounded-b-lg p-5">
          <table className="table-fixed w-full whitespace-nowrap overflow-auto lg:inline-table md:flow-root sm:inline-table flow-root">
            <thead className="bg-slate-300 text-slate-700">
              <tr className="*:p-3 *:border-l *:font-bold text-sm">
                <th className="w-14">م</th>
                <th className="w-56">الاســـم / عدد المقاعد</th>
                <th>نوع الرحلة</th>
                <th>نهاية المحاضرات</th>
                <th className="w-64">نقطة التحرك</th>
                <th>نوع الدفع</th>
                <th>حالة الدفع</th>
                <th className="w-52 print:hidden">الاجراءات</th>
              </tr>
            </thead>
            <tbody className="*:text-center  *:border-stone-50">
              {currentItems.map((item: any, index: any) => {
                // console.log(item)

                const currentColorClass =
                  index % 2 === 0 ? "bg-zinc-200" : "bg-zinc-300";

                const firstName =
                  item.attributes.first_name
                    ?.split(" ")
                    .slice(0, 3)
                    .join(" ") || [];
                const lastName =
                  item.attributes.last_name?.split(" ").pop() || "";
                // تحقق من الشرط قبل عرض البيانات
                return (
                  <tr
                    className={` *:border-l hover:bg-zinc-500 hover:text-white ${currentColorClass}`}
                    key={index}
                  >
                    <td className="p-2">{counter++}</td>
                    <td className="text-right pr-2">
                      {`${firstName} `}
                      {item.attributes.seats > 1 && (
                        <span className="px-2.5 mr-2 py-0.5 text-xs inline-block font-bold rounded border bg-white border-slate-400 text-slate-500">
                          {item.attributes.seats}
                        </span>
                      )}
                    </td>
                    <td>{item.attributes.trip_type}</td>
                    <td>{item.attributes.end_time}</td>

                    <td className="text-sm">
                      {`${
                        item.attributes.trip_type !== "عودة"
                          ? item.attributes.start_point
                          : item.attributes.area
                      }`}
                    </td>
                    <td>{item.attributes.payment_type}</td>
                    <td
                      className={
                        item.attributes.payment_status
                          ? "text-green-500 font-semibold text-sm"
                          : "text-red-500 font-semibold text-sm"
                      }
                    >
                      {item.attributes.payment_status ? "مدفوعة" : "غير مدفوعة"}
                    </td>
                    <td className="print:hidden">
                      {!item.attributes.payment_status ? (
                        <button
                          onClick={() => PayBooking(item.id)}
                          className="bg-slate-100 text-slate-900 p-2 m-1 rounded hover:bg-slate-300"
                        >
                          <FaAmazonPay title="تحويل الى مدفوعة" />
                        </button>
                      ) : (
                        <button
                          onClick={() => UnPayBooking(item.id)}
                          className="bg-slate-100 text-slate-900 p-2 m-1 rounded hover:bg-slate-300"
                        >
                          <GiPayMoney title="تحويل الى غير مدفوعة" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          ConfirmBooking(item);
                        }}
                        className="bg-slate-100 text-white p-2 m-1 rounded hover:bg-slate-300"
                      >
                        <FcCheckmark />
                      </button>

                      <Link href={`/dashboard/booking-update/${item.id}?id`}>
                        <ol className="bg-slate-100 p-2  rounded hover:bg-slate-300 text-gray-800 inline-flex">
                          <HiPencilAlt />
                        </ol>
                      </Link>

                      <button
                        onClick={() => RejectBooking(item)}
                        className="bg-slate-100 text-white p-2 m-1 rounded hover:bg-slate-300"
                      >
                        <FcCancel />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between p-5 print:hidden">
            <h4 className="text-xl font-bold text-red-500">
              التكلفة: <span>{totalPrice2 - OperatingCosts} ج.م </span>
            </h4>
            <h2 className="text-xl font-bold text-red-500">
              عدد الركاب: {totalSeats}
            </h2>

            <div className="flex justify-end print:hidden">
              <button
                onClick={() => setCurrentPage(prevPage)}
                className={`mx-2 p-2 rounded ${
                  currentPage === prevPage
                    ? "bg-gray-300 text-gray-700"
                    : "bg-red-600 text-white"
                }`}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-2 p-2 px-5 rounded ${
                    currentPage === i + 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                key={nextPage}
                onClick={() => setCurrentPage(nextPage)}
                className={`mx-2 p-2 rounded ${
                  currentPage === nextPage
                    ? "bg-gray-300 text-gray-700"
                    : "bg-red-600 text-white"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
