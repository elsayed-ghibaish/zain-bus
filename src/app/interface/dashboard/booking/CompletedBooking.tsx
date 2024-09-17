"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns/format";
import { addDays, parseISO } from "date-fns";
import { HiPencilAlt } from "react-icons/hi";
import Link from "next/link";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { toast } from "react-toastify";
import axios, { isCancel } from "axios";
import { ar } from "date-fns/locale/ar";
import {
  FaAmazonPay,
  FaEdge,
  FaFacebook,
  FaInstagram,
  FaInternetExplorer,
  FaWhatsapp,
} from "react-icons/fa";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { BookingData } from "@/app/redux/features/strapi-0/BookingSlice";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";
import { IoIosCall } from "react-icons/io";
import PrintBookingBagsUi from "../booking-bag/PrintBookingBagsUi";
import { GiPayMoney } from "react-icons/gi";

export default function CompletedBooking() {
  const [datatwo, setdatatwo]: any = useState([]);
  const [totalPrice2, settotalPrice2]: any = useState([]);
  const [OperatingCosts, setOperatingCosts]: any = useState([]);

  const [BookingDay, setBookingDay] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedCities, setselectedCities] = useState<string[]>([]);
  const [selectedTypeOfTrip, setselectedTypeOfTrip] = useState<string | null>(
    null
  );
  const [TimingMov, setTimingMov] = useState<string>("");
  const [TimingEnd, setTimingEnd] = useState<string[]>([]);
  const [selectedPayment, setselectedPayment] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // تحديد عدد العناصر في كل صفحة
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

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
  }, [dispatch, datatwo]);

  const Stapi_Url = process.env.NEXT_PUBLIC_STRAPI_URL_API;
  const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  // Pay Booking
  const PayBooking = async (id: any) => {
    const Urlc = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    try {
      const res = await axios.put(
        `${Urlc}/bookings/${id}`,
        {
          data: {
            payment_status: true,
          },
        },
        config
      );
      if (res.status !== 200) {
        throw new Error(
          `Failed to update booking. Server response: ${res.statusText}`
        );
      }
      const updatedData = datatwo.filter((item: any) => item.id !== id);
      toast.success("تم تحويل الحجز الى مدفوع بنجاح");
      setdatatwo(updatedData);
    } catch (error) {
      toast.error("خطاء ليس لديك صلاحيات");
      console.error(error);
    }
  };

  // تاكيد الوصول
  const handleBookingUpdate = async (
    id: any,
    completed: boolean,
    successMessage: string
  ) => {
    try {
      const res = await axios.put(
        `${Stapi_Url}/bookings/${id}`,
        {
          data: { completed },
        },
        config
      );

      if (res.status !== 200) {
        throw new Error(
          `Failed to update booking. Server response: ${res.statusText}`
        );
      }

      const updatedData = datatwo.filter((item: any) => item.id !== id);
      setdatatwo(updatedData);
      fetchData();
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const ConfirmBooking = async (id: any) => {
    await handleBookingUpdate(id, true, "تم تأكيد الوصول بنجاح");
  };

  const RejectBooking = async (id: any) => {
    const confirmed = confirm("هل أنت متاكد من إلغاء الوصول");
    if (confirmed) {
      await handleBookingUpdate(id, false, "تم إلغاء الوصول بنجاح");
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

  const handleTimeMovChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimingMov(event.target.value);
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedPayment(event.target.value);
  };

  const handleEndTimeChange = (Time_r: string) => {
    const updatedTimingEnd = TimingEnd.includes(Time_r)
      ? TimingEnd.filter((t) => t !== Time_r)
      : [...TimingEnd, Time_r];

    // setselectedCities(updatedCities);
    setTimingEnd(updatedTimingEnd);
  };

  const handleCityChange = (city: string) => {
    const updatedCities = selectedCities.includes(city)
      ? selectedCities.filter((c) => c !== city)
      : [...selectedCities, city];

    setselectedCities(updatedCities);
  };

  // Print Page Button
  const handlePrint = () => {
    // يمكنك وضع الكود الذي يتم تنفيذه عند النقر على الزر هنا
    window.print();
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
    .filter(
      (item: any) =>
        item.attributes.trip_status === "confirmed" &&
        item.attributes.completed === false
    );

  // حساب عدد الصفحات الإجمالي بناءً على البيانات المفلترة
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // حساب مؤشر البداية والنهاية للعناصر في الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // إضافة متغيرات لحساب الصفحة السابقة والتالية
  const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;

  useEffect(() => {
    if (currentItems && currentItems.length > 0) {
      const totalPrice = filteredData.reduce((acc: number, item: any) => {
        // تحويل قيمة السعر إلى عدد وإضافتها إلى الناتج الجزئي
        return acc + parseFloat(item.attributes.trip_cost);
      }, 0);
      settotalPrice2(totalPrice);
    }
  }, [currentItems]);

  return (
    <div className="bg-slate-200 print:bg-white ">
      <div className="flex-1">
        <div className="items-center hidden gap-5 flex-row justify-between print:flex border-b border-slate-100">
          <div className="items-center justify-center print:block">
            <div className="relative z-20 w-full flex justify-between lg:w-max md:px-0">
              <div
                aria-label="logo"
                className="flex space-x-2 items-center mb-3"
              >
                <img src="/logo.svg" className="w-32" alt="الزين للرحلات" />
              </div>
            </div>
          </div>
          <div className=" justify-end">
            <span className="block mr-3">
              01012930010{" "}
              <IoIosCall size={20} className="inline mb-1 text-red-600 mr-2" />
            </span>
            <span className="block">
              zaintravel.com{" "}
              <FaEdge size={20} className="inline mb-1 text-red-600 mr-2" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 print:mt-5">
          <h3 className="p-2 mb-2">
            <span className="text-red-600 font-semibold">اليوم:</span>{" "}
            {BookingDay &&
              format(parseISO(BookingDay), "eeee, d MMMM yyyy", {
                locale: ar,
              })}
          </h3>

          <h3 className="p-2 mb-2">
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

          <div className="sm:col-span mt-4">
            <button
              className="bg-slate-700 text-white hover:bg-slate-800 p-2 m-2 rounded"
              onClick={handlePrint}
            >
              طباعة
            </button>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-white shadow-sm rounded-b-lg p-5 print:rounded-none print:border-none print:p-0 print:shadow-none">
          <div className="overflow-hidden rounded-t-lg">
            <table className="table-fixed w-full whitespace-nowrap overflow-auto lg:inline-table md:flow-root sm:inline-table flow-root">
              <thead className="bg-slate-300 text-slate-700">
                <tr className="*:p-3 *:border-l *:font-bold text-sm">
                  <th className="w-10">م</th>
                  <th className="w-56">الاســـم / عدد المقاعد</th>
                  <th>نوع الرحلة</th>
                  <th className="w-20">العودة</th>
                  <th className="w-36">التحرك</th>
                  <th className="w-auto">التليفون</th>
                  <th>الحجز</th>
                  <th className="print:hidden">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="*:text-center  *:border-stone-50">
                {currentItems?.map((item: any) => {
                  if (item.attributes) {
                    const currentColorClass =
                      item.id % 2 === 0 ? "bg-zinc-200" : "bg-zinc-300";

                    const firstName =
                      item.attributes.first_name
                        ?.split(" ")
                        .slice(0, 3)
                        .join(" ") || [];
                    const lastName =
                      item.attributes.last_name?.split(" ").pop() || "";

                    return (
                      <tr
                        className={` *:border *:border-l *:border-gray-100 ${currentColorClass}`}
                        key={item.id}
                      >
                        <td className="border border-l border-gray-100 p-2">
                          {counter++}
                        </td>
                        <td className="pr-2 text-right">
                          {`${firstName} ${lastName}`}
                          {item.attributes.seats > 1 && (
                            <span className="px-2.5 mr-2 py-0.5 text-xs inline-block font-bold rounded border bg-white border-slate-400 text-slate-500">
                              {item.attributes.seats}
                            </span>
                          )}
                        </td>
                        <td>{`${
                          selectedTypeOfTrip
                            ? selectedTypeOfTrip
                            : item.attributes.trip_type
                        }`}</td>
                        <td>{item.attributes.end_time}</td>
                        <td className="text-xs">
                          {`${
                            item.attributes.start_point
                              ? item.attributes.start_point +
                                ` - ${
                                  item.attributes.start_time?.split("-")[0]
                                    ? item.attributes.start_time?.split("-")[0]
                                    : ""
                                }`
                              : item.attributes.area
                          }`}
                        </td>
                        <td>{item.attributes.phone}</td>
                        <td className="bolder border-l border-gray-100 text-xs">
                          {item.attributes.payment_status
                            ? "مدفوع"
                            : "غير مدفوع"}
                        </td>
                        <td className="print:hidden">
                          {item.attributes.payment_status === false && (
                            <button
                              onClick={() => PayBooking(item.id)}
                              className="bg-slate-100 text-slate-900 p-2 m-1 rounded hover:bg-slate-300"
                            >
                              <FaAmazonPay title="تحويل الى مدفوعة" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              ConfirmBooking(item.id);
                            }}
                            className="bg-slate-100 text-white p-2 m-1 rounded hover:bg-slate-300"
                          >
                            <FcCheckmark title="تاكيد الوصول" />
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    // إذا لم يتوافق مع الشرط، يمكنك إرجاع شيء آخر أو تركه فارغًا

                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between p-5 print:hidden">
            {/* <h4 className="text-xl font-bold text-red-500">
              التكلفة: <span>{totalPrice2 - OperatingCosts} ج.م </span>
            </h4> */}

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

        <div className={show == true ? "block" : "hidden"}>
          <PrintBookingBagsUi />
        </div>

        <div className="hidden flex-col items-center border-t border-slate-400/10 py-5 sm:flex-row-reverse sm:justify-between absolute bottom-0 w-full print:flex">
          <div className="flex gap-x-6 ml-10">
            <div
              className="flex justify-center items-center space-x-4"
              dir="ltr"
            >
              <FaFacebook size={20} />
              <span>zaintravel.2020</span>

              <FaInstagram size={20} />
              <span>zaintravel2020</span>

              <FaWhatsapp size={20} />
              <span>+201012930010</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            العلامة التجارية وجميع الحقوق محفوظة ©{" "}
            {`${format(new Date(), "yyyy")}`}
          </p>
        </div>
      </div>
    </div>
  );
}
