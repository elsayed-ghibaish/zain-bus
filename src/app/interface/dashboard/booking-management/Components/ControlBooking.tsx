"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { parse, format, isValid } from "date-fns";

export default function ControlBooking({ Data, Etid }: any) {
  const [friday, setfriday] = useState(true);
  const [openEdit, setOpenEdit] = useState(false); // تم تغيير اسم المتغير ليتبع التسميات القياسية في React
  const C_id = Etid;
  const Control = Data;

  const [booking_name, setBooking_Name] = useState("");
  const [booking_start_date, setBooking_Start_Date] = useState("");
  const [booking_days_count, setBooking_days_count] = useState("");
  const [booking_status, setBooking_status] = useState(true);
  const [end_of_day_time, setEnd_of_day_time] = useState("");
  const [cancel_friday_booking, setCancel_friday_booking] = useState(true);
  const [notes, setNotes] = useState("");
  const [available_bookings_count, setavailable_bookings_count] = useState();

  useEffect(() => {
    if (Control.attributes) {
      const {
        booking_name,
        booking_start_date,
        booking_days_count,
        booking_status,
        end_of_day_time,
        cancel_friday_booking,
        notes,
        available_bookings_count,
      } = Control.attributes;

      setBooking_Name(booking_name || "");
      setBooking_Start_Date(booking_start_date || "");
      setBooking_days_count(booking_days_count || "");
      setBooking_status(booking_status || "");
      setEnd_of_day_time(end_of_day_time || "");
      setCancel_friday_booking(cancel_friday_booking || "");
      setNotes(notes || "");
      setavailable_bookings_count(available_bookings_count || "");
    }
  }, [C_id]);

  // console.log(end_of_day_time);

  // التأكد من وجود end_of_day_time قبل التحليل والتنسيق
  // let formattedTime = "";
  // if (end_of_day_time ) {
  //   try {
  //     const parsedTime = parse(end_of_day_time, 'HH:mm:ss.SSS', new Date());
  //     if (isValid(parsedTime)) {  // التأكد من أن التحليل نجح وأن القيمة صحيحة
  //       formattedTime = format(parsedTime, 'hh:mm aa');
  //     } else {
  //       console.error("Parsed time is invalid:", parsedTime);
  //     }
  //   } catch (error) {
  //     console.error("Error parsing time:", error);
  //   }
  // } else {
  //   console.error("Invalid time format:", end_of_day_time);
  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const Urlc = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    try {
      const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
      const config = {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      };
      const res = await axios.put(
        `${Urlc}/booking-dashboards/${C_id}`,
        {
          data: {
            booking_start_date: booking_start_date || null,
            booking_days_count,
            cancel_friday_booking,
            end_of_day_time,
            booking_status,
            notes,
          },
        },
        config
      );
      if (res.status !== 200) {
        throw new Error(
          `Failed to update booking. Server response: ${res.statusText}`
        );
      }
      // const updatedData = data2.filter((item: any) => item.id !== id);
      toast.success("تم حفظ التعديلات بنجاح");
      handleSave();
      // fetchData();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFilter = () => {
    setCancel_friday_booking(!cancel_friday_booking);
  };

  const openFilter = () => {
    setBooking_status(!booking_status);
  };

  function handelcheckedFriday() {
    console.log("Good");
  }

  function handleEditClick() {
    setOpenEdit(true);
  }

  function handleSave() {
    setOpenEdit(false); // عند الحفظ يتم إغلاق كومبوننت التعديل والعودة للكومبوننت الأصلي
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      {openEdit ? (
        <section>
          <div className="m-auto p-5">
            <span className="flex items-center mb-3">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span className="px-3 font-medium text-red-700">
                تعديل حجز الرحلات
              </span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </span>
            {Control && (
              <form id="form" action="" method="POST" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3 mt-8">
                    <label
                      htmlFor={`booking_status${C_id}`}
                      className="text-sm font-medium leading-6 text-gray-900 flex items-center cursor-pointer"
                    >
                      التحكم فى الحجز
                      <input
                        type="checkbox"
                        id={`booking_status${C_id}`}
                        checked={booking_status}
                        onChange={openFilter}
                        className="mr-5 form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`booking_start_date${C_id}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      التاريخ
                    </label>
                    <input
                      type="date"
                      name={`booking_start_date${C_id}`}
                      id={`booking_start_date_view${C_id}`}
                      className="bg-gray-100 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                      value={booking_start_date}
                      onChange={(e) => setBooking_Start_Date(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`booking_days_count${C_id}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      عدد أيام الحجز
                    </label>
                    <input
                      type="number"
                      name={`booking_days_count${C_id}`}
                      id={`booking_days_count_view${C_id}`}
                      className="bg-gray-100 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                      value={booking_days_count}
                      onChange={(e) => setBooking_days_count(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`end_of_day_time${C_id}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      وقت اغلاق الحجز
                    </label>
                    <input
                      type="time"
                      name={`end_of_day_time${C_id}`}
                      id={`end_of_day_time${C_id}`}
                      className="bg-gray-100 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                      value={end_of_day_time}
                      onChange={(e) => {
                        const time = e.target.value; // قيمة الوقت المدخلة من المستخدم بصيغة HH:mm
                        // إعادة تنسيق الوقت إلى صيغة HH:mm:ss.SSS
                        const formattedTime = format(
                          new Date(`1970-01-01T${time}:00.000`),
                          "HH:mm:ss.SSS"
                        );
                        setEnd_of_day_time(formattedTime); // تحديث الحالة بالوقت المنسق
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`cancel_friday_booking${C_id}`}
                      className="text-sm font-medium leading-6 text-gray-900 flex items-center cursor-pointer"
                    >
                      إلغاء حجز الجمعة
                      <input
                        type="checkbox"
                        id={`cancel_friday_booking${C_id}`}
                        checked={cancel_friday_booking}
                        onChange={toggleFilter}
                        className="mr-5 form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`notes${C_id}`}
                      className="text-sm font-medium leading-6 text-gray-900 flex items-center cursor-pointer"
                    >
                      سبب الغاء الحجز
                      <input
                        type="text"
                        id={`notes${C_id}`}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                      />
                    </label>
                  </div>
                </div>
                <div className="block border-t border-gray-900/10 mt-3 mb-3"></div>

                <div className="flex flex-col-2 gap-x-6 gap-y-8">
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="block w-full rounded-md  py-2 text-center text-sm font-semibold text-white shadow-sm 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 bg-red-700 hover:bg-red-800"
                  >
                    حفظ
                  </button>

                  <button
                    className="block w-full rounded-md  py-2 text-center text-sm font-semibold text-white shadow-sm 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 bg-red-700 hover:bg-red-800"
                    onClick={handleSave}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      ) : (
        <section>
          <div className="m-auto p-5">
            <span className="flex items-center mb-3">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span className="px-3 font-bold text-red-700">
                {booking_name}
              </span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </span>
            {Control && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  حالة الحجز{" "}
                  {booking_status ? (
                    <span className="list-disc text-green-600 font-bold">
                      الحجز متاح
                    </span>
                  ) : (
                    <span className="list-disc text-red-500 font-bold">
                      الحجز غير متاح
                    </span>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <span className="text-sm font-bold">
                    {/* انتهاء يوم الحجز الساعة {formattedTime} */}
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`date${C_id}`}
                    className="block font-medium leading-6 text-gray-900 mb-2"
                  >
                    التاريخ
                  </label>
                  <input
                    type="date"
                    name={`date${C_id}`}
                    id={`date${C_id}`}
                    className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    value={booking_start_date}
                    disabled
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor={`day${C_id}`}
                    className="block font-medium leading-6 text-gray-900 mb-2"
                  >
                    عدد أيام الحجز
                  </label>
                  <input
                    type="number"
                    name={`day${C_id}`}
                    id={`day${C_id}`}
                    className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    value={booking_days_count}
                    disabled
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`Friday${C_id}`}
                    className="text-sm font-medium text-gray-900 flex items-center w-52"
                  >
                    يوم الجمعة
                    <span className="mr-2">
                      {cancel_friday_booking ? (
                        <span className="list-disc text-red-500">
                          ◉ غير متاح للحجز
                        </span>
                      ) : (
                        <span className="list-disc text-green-500">
                          ◉ متاح للحجز
                        </span>
                      )}
                    </span>
                  </label>
                  <input
                    type="text"
                    id={`Friday${C_id}`}
                    name={`Friday${C_id}`}
                    className="m-0 hidden"
                  />
                </div>
              </div>
            )}
            <div className="block border-t border-gray-900/10 mt-3 mb-3"></div>

            <button
              className="block w-full rounded-md  py-2 text-center text-sm font-semibold text-white shadow-sm 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 bg-red-700 hover:bg-red-800"
              onClick={handleEditClick} // تم تغيير الحدث إلى onClick
            >
              تعديل
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
