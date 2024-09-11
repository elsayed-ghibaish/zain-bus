import React from "react";
import { format } from "date-fns/format";
import { ar } from "date-fns/locale/ar";
import { parseISO } from "date-fns/parseISO";
import { AiOutlineClose, AiOutlineExclamation } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import BookingSection from "./BookingSection";
import { VscArrowSwap } from "react-icons/vsc";
import { IoTicketOutline, IoTicketSharp } from "react-icons/io5";
import { MdPayment } from "react-icons/md";

export default function BookingPrevious({ user, loading }: any) {
  const currentDate = new Date();
  return (
    <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 card-action mb-4">
      <div className="py-3 px-6 mb-0 bg-gray-200 border-b-1 border-gray-300 text-gray-900 items-center">
        <h5 className="font-bold mb-0">الحجوزات السابقة</h5>
      </div>

      <div className="container">
        <div className="flex flex-col md:grid grid-cols-12 text-gray-50 overflow-auto max-h-64">
          {!loading ? (
            <>
              {user.bookings

                ?.filter(
                  (booking: any) => new Date(booking.date) <= currentDate
                )
                // فرز الحجوزات بناءً على التاريخ
                .sort((a: any, b: any) => b.id - a.id)
                .slice(0, 1)
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
                          <div className="text-xl absolute bottom-[-3.5px] right-1 animate-pulse">
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
                          format(parseISO(booking.date), "eeee, d MMMM yyyy", {
                            locale: ar,
                          })}
                      </h3>
                      <p className="leading-tight text-justify w-fit bg-gray-600 text-white font-medium p-2 shadow-sm border text-sm rounded-lg float-left">
                        {booking.trip_status === "pending" && "الحجز منتهي"}
                        {booking.trip_status === "confirmed" && "الحجز مكتمل"}
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
                (booking: any) => new Date(booking.date)  <= currentDate
              ).length === 0 && (
                <div className="lg:col-start-3 sm:col-start-5 col-end-12 h-32 mt-10 text-center text-gray-700 flex flex-col items-center">
                  <div className="relative">
                    <IoTicketOutline className="text-5xl text-red-500 " />
                    <IoTicketSharp className="text-5xl absolute top-0 left-5 transform -rotate-0 text-red-500" />
                  </div>
                  <h2 className="text-center text-xl font-bold mt-2">
                    لاتوجد حجوزات سابقة
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
  );
}
