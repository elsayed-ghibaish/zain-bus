import React, { useState } from "react";
import { format } from "date-fns/format";
import { ar } from "date-fns/locale/ar";
import { parseISO } from "date-fns/parseISO";
import { AiOutlineClose, AiOutlineExclamation } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import BookingSection from "./BookingSection";
import { MdPayment } from "react-icons/md";
import { VscArrowSwap } from "react-icons/vsc";
import axios from "axios";
import { toast } from "react-toastify";
import { IoTicketOutline, IoTicketSharp } from "react-icons/io5";

export default function BookingNext({ user, loading, session }: any) {
  const currentDate = new Date();
  const [massge, setmassge] = useState("");
  const [idItem, setidItem] = useState("");
  const [error, setError] = useState("");

  const InfoBooking = (time: any, dateV: any, id: any, exittiming: any) => {
    const gettime_one = time || exittiming === "قبل كدة" ? "19:00": exittiming;
    var parts = gettime_one?.split(":"); // قسم النص إلى جزئين باستخدام الفاصلة
    var hours = parseInt(parts[0]); // الساعات
    var minutes = parseInt(parts[1].split(" ")[0]); // الدقائق

    setidItem(id);

    // تحقق من الفترة (صباحًا أم مساءً)
    var period = parts[1].split(" ")[1];
    if (period === "م") {
      // إذا كان المساء، قم بإضافة 12 ساعة
      hours += 12;
    }

    // إنشاء كائن التاريخ
    var date: any = new Date(dateV);
    date.setHours(hours);
    date.setMinutes(minutes);

    var timeFormat = date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });

    console.log(date); // الإخراج: وقت صحيح يمثل "05:30 ص" ككائن Date
    // حساب الفارق بين التوقيت الحالي والتوقيت المحدد بالساعات
    var currentTime: any = new Date(); // التوقيت الحالي

    var timeDifferenceHours = (currentTime - date) / (1000 * 60 * 60);

    // إذا كان الفارق أقل من 8 ساعات وأقل من 3 ساعات، قم بعرض رسالة تحذير 2
    if (Math.abs(timeDifferenceHours) <= 8) {
      setmassge(
        "برجاء العلم انه سيتم خصم تكلفة الرحلة فى حالة إلغاء الحجز قبل الموعد بـ 10 ساعات"
      );
    } else {
      setmassge(
        "! تحذير : هل انت موافق على إلغاء الحجز لن يتم خصم تكلفة الرحلة "
      );
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const Popup = ({ isOpen, onClose, bookingId }: any) => {
    // Cancel Booking
    const CancelBooking = async () => {
      const Url = process.env.NEXT_PUBLIC_STRAPI_URL_API;
      try {
        const res = await axios.put(
          `${Url}/bookings/${idItem}`,
          {
            data: {
              trip_status: "cancelled",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        if (res.status !== 200) {
          throw new Error(
            `Failed to update booking. Server response: ${res.statusText}`
          );
        }
        toast.success("تم إلغاء حجز الرحلة بنجاح");
        onClose();
      } catch (error) {
        toast.error("لا يمكنك إلغاء الحجز");
        console.error(error);
      }
    };

    return (
      <>
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-xl font-bold mb-4">تحذير</div>
              <p>{massge}</p>
              {}
              <div className="m-auto float-left">
                <button
                  onClick={onClose}
                  className="mt-4 px-4 ml-5 py-2 bg-white border border-gray-200 text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => CancelBooking()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  موافق
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Popup isOpen={isOpen} onClose={togglePopup} />

      <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 card-action mb-4">
        <div className="py-3 px-6 mb-0 bg-gray-200 border-b-1 border-gray-300 text-gray-900 items-center">
          <h5 className="font-bold mb-0">الحجوزات القادمة</h5>
        </div>

        <div className="container">
          <div className="flex flex-col md:grid grid-cols-12 text-gray-50 overflow-auto max-h-64">
            {!loading ? (
              <>
                {user.bookings

                  ?.filter(
                    (booking: any) => new Date(booking.date) >= currentDate
                  )
                  // فرز الحجوزات بناءً على التاريخ
                  .sort((a: any, b: any) => b.id - a.id)
                  .slice(0, 3)
                  // تحويل الحجوزات إلى عناصر JSX
                  .map((booking: any) => (
                    <div className="flex md:contents" key={booking.id}>
                      <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
                        <div className="h-full w-6 flex items-center justify-center">
                          <div
                            className={
                              booking.trip_status === "pending"
                                ? "h-full w-1 bg-amber-500 pointer-events-none"
                                : booking.trip_status === "confirmed"
                                ? "h-full w-1 bg-green-500 pointer-events-none"
                                : booking.trip_status === "cancelled"
                                ? "h-full w-1 bg-gray-500 pointer-events-none"
                                : booking.trip_status === "rejected"
                                ? "h-full w-1 bg-red-500 pointer-events-none"
                                : "h-full w-1 bg-green-500 pointer-events-none"
                            }
                          />
                        </div>
                        <div
                          className={
                            booking.trip_status === "pending"
                              ? "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-amber-500 shadow text-center"
                              : booking.trip_status === "confirmed"
                              ? "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center"
                              : booking.trip_status === "cancelled"
                              ? "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-500 shadow text-center"
                              : booking.trip_status === "rejected"
                              ? "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-red-500 shadow text-center"
                              : "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center"
                          }
                        >
                          {booking.trip_status === "pending" && (
                            <div className="text-xl absolute bottom-[-3px] right-1 animate-pulse">
                              ◉
                            </div>
                          )}
                          {booking.trip_status === "confirmed" && (
                            <FaCheck className="mt-1 mr-1" />
                          )}
                          {booking.trip_status === "cancelled" && (
                            <AiOutlineClose className="mt-1 mr-1" />
                          )}
                          {booking.trip_status === "rejected" && (
                            <AiOutlineClose className="mt-1 mr-1" />
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          booking.trip_status === "pending"
                            ? "bg-amber-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"
                            : booking.trip_status === "confirmed"
                            ? "bg-green-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"
                            : booking.trip_status === "cancelled"
                            ? "bg-gray-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"
                            : booking.trip_status === "rejected"
                            ? "bg-red-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"
                            : "bg-green-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"
                        }
                      >
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.date &&
                            format(
                              parseISO(booking.date),
                              "eeee, d MMMM yyyy",
                              {
                                locale: ar,
                              }
                            )}
                        </h3>

                        {(booking.trip_status === "pending" ||
                          booking.trip_status === "confirmed") && (
                          <button
                            onClick={() => {
                              InfoBooking(
                                booking.start_time,
                                booking.date,
                                booking.id,
                                booking.end_time
                              );
                              togglePopup();
                            }}
                            className="mr-5 text-justify w-fit bg-red-600 text-white font-medium p-2 shadow-sm text-sm rounded-lg float-left"
                          >
                            إلغاء الحجز
                          </button>
                        )}

                        <p className="leading-tight text-justify w-fit bg-gray-600 text-white font-medium p-2 shadow-sm border text-sm rounded-lg float-left">
                          {booking.trip_status === "pending" &&
                            "في انتظار التأكيد"}
                          {booking.trip_status === "confirmed" && "الحجز مؤكد"}
                          {booking.trip_status === "cancelled" && "الحجز ملغي"}
                          {booking.trip_status === "rejected" && "الحجز مرفوض"}
                        </p>

                        <p className="leading-tight text-justify w-full">
                          <VscArrowSwap className="inline text-white m-3" />
                          {booking.trip_type}{" "}
                          <MdPayment className="inline text-white m-3" />
                          {booking.payment_status ? "مدفوعة" : "غير مدفوعة"}
                        </p>
                      </div>
                    </div>
                  ))}
                {user.bookings?.filter(
                  (booking: any) => new Date(booking.date) >= currentDate
                ).length === 0 && (
                  <div className="lg:col-start-3 sm:col-start-5 col-end-12 h-32 mt-10 text-center text-gray-700 flex flex-col items-center">
                    <div className="relative">
                      <IoTicketOutline className="text-5xl text-red-500 " />
                      <IoTicketSharp className="text-5xl absolute top-0 left-5 transform -rotate-0 text-red-500" />
                    </div>
                    <h2 className="text-center text-xl font-bold mt-2">
                      لاتوجد حجوزات قادمة
                    </h2>
                  </div>
                )}
              </>
            ) : (
              <BookingSection />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
