"use client";
import React, { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns/format";
import { parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { IoBagHandle, IoLocationSharp } from "react-icons/io5";
import { BsBox, BsCalendar, BsClock } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { MdMergeType } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function PaySuccess() {
  const { data: session }: any = useSession();
  const [booking, setBooking] = useState<any>();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    const data: any = localStorage.getItem("booking-success");
    const parsedData = JSON.parse(data);
    setBooking(parsedData);
  };
  useEffect(() => {
    fetchData();
    setLoading(true);
  }, []);

  if (loading === false) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }

  if (!booking) {
    return (
      <div className="flex m-auto items-center justify-center my-20">
        <h2 className="text-2xl text-red-600 font-bold">وصول غير مسموح</h2>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-5 mt-4">
        <Image
          src="/booking-successful.gif"
          alt="check"
          width={130}
          height={130}
          style={{ width: "auto", height: "auto" }} // الحفاظ على نسبة العرض إلى الارتفاع
          priority
        />
        <h2 className="text-2xl text-center font-bold">
          تم استلام طلبك بنجاح،
          <p>يرجى إتمام عملية الدفع لتأكيد الحجز</p>
        </h2>
        {/* <h2 className="text-xl text-center mt-6 text-gray-500 flex w-96">
          يرجى إرسال قيمة الحجز على الرقم (01040015600) مع إرفاق سكرين شوت
          للتحويل عبر واتساب لنفس الرقم.
        </h2> */}
      </div>

      <div className="flex flex-col items-center justify-center px-5 mt-4">
        <div className="rounded-lgp-5 w-full lg:w-1/3 order-first md:order-first">
          <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-md border border-1 border-white p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-xl text-white">بيانات الرحلة </div>
              <BsBox className="text-white" size={30} />
            </div>

            <div className="text-white mb-2 flex items-center">
              <FaUserGraduate className="text-white ml-2" />
              {booking.first_name}
            </div>

            <div className="text-white mb-2 flex items-center">
              <BsCalendar className="text-white ml-2" />
              التاريخ:{" "}
              {booking.date &&
                format(parseISO(booking.date), "eeee, d MMMM yyyy", {
                  locale: ar,
                })}
            </div>

            {booking.trip_type && (
              <div className="text-white mb-2 flex items-center">
                <IoLocationSharp className="text-white ml-2" />
                نقطة التحرك: {booking.start_point}
              </div>
            )}

            {booking.trip_type && (
              <div className="text-white mb-2 flex items-center">
                <MdMergeType className="text-white ml-2" />
                نوع الرحلة: {booking.trip_type}
              </div>
            )}
            {booking.seats && (
              <div className="text-white mb-2 flex items-center">
                <HiUsers className="text-white ml-2" />
                عدد المقاعد: {booking.seats}
              </div>
            )}
            <div className="text-white mb-2 flex items-center">
              <BsClock className="text-white ml-2" />
              توقيت التحرك:{" "}
              {booking.start_time ? booking.start_time : booking.end_time}
            </div>
            {booking.bag_type && (
              <div className="text-white mb-2 flex items-center">
                <IoBagHandle className="text-white ml-2" />
                {booking.bag_type}
              </div>
            )}
            <hr className="my-4" />
            <div className="mt-3">
              <div className="font-bold inline text-white text-lg">
                تكلفة الرحلة :{" "}
              </div>
              <div className="text-white inline text-xl font-semibold">
                {booking.trip_cost}
                {" جنيه"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 mt-5">
          <p className="font-bold">سياسة التعديل والإلغاء</p>
          <p className="text-sm">
            لا يمكن إلغاء الحجز أو تعديله أو استرداد قيمة الرحلة إذا كان المتبقي
            على موعد الرحلة أقل من 10 ساعات.
          </p>
          <p className="text-sm">
            في حال إلغاء الرحلة قبل موعدها بأقل من 10 ساعات، سيتم خصم تكلفة
            الرحلة بالكامل.
          </p>
          <p className="text-sm">
            أما إذا تم إلغاء الرحلة قبل موعدها بـ12 ساعة أو أكثر، فسيتم استرداد
            قيمة الرحلة مع خصم 10% من ثمن التذكرة.
          </p>
          <p className="text-sm">
            يرجى إرسال رسالة إلغاء عبر الواتساب إلى الرقم 01040015600.
          </p>
          <p className="text-sm">
            نود التنويه بأنه في حال عدم سداد تكلفة الرحلة قبل الساعة السادسة
            مساءً من اليوم السابق للرحلة، سيتم إلغاء الحجز تلقائيًا.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 mt-4">
          {!session ? (
            <Link
              href="/pages/booking-guest"
              className="p-2 my-6 text-white rounded-md bg-red-600"
            >
              حجز رحلة جديدة
            </Link>
          ) : (
            <Link
              href="/profile"
              className="p-2 my-6 text-white rounded-md bg-red-600"
            >
              العودة إلى حسابي
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
