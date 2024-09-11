"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns/format";
import { parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import crypto from "crypto";

function CheckOutUi() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchParams = useSearchParams();
  const payment_status = searchParams.get("success");
  const payment_type = searchParams.get("source_data.sub_type");
  const errorOccurred = searchParams.get("error_occured");

  const amount_cents = searchParams.get("amount_cents");
  const created_at = searchParams.get("created_at");
  const currency = searchParams.get("currency");
  const error_occured = searchParams.get("error_occured");
  const has_parent_transaction = searchParams.get("has_parent_transaction");
  const id = searchParams.get("id");
  const integration_id = searchParams.get("integration_id");
  const is_3d_secure = searchParams.get("is_3d_secure");
  const is_auth = searchParams.get("is_auth");
  const is_capture = searchParams.get("is_capture");
  const is_refunded = searchParams.get("is_refunded");
  const is_standalone_payment = searchParams.get("is_standalone_payment");
  const is_voided = searchParams.get("is_voided");
  const order = searchParams.get("order");
  const owner = searchParams.get("owner");
  const pending = searchParams.get("pending");
  const source_data_pan = searchParams.get("source_data.pan"); //
  const source_data_sub_type = searchParams.get("source_data.sub_type");
  const source_data_type = searchParams.get("source_data.type");
  const success = searchParams.get("success");
  const hmac_p = searchParams.get("hmac");

  const [executed, setExecuted] = useState(false);
  const [apps, setapps] = useState(false);

  const fetchData = () => {
    const data: any = localStorage.getItem("booking");
    const parsedData = JSON.parse(data);
    setBooking(parsedData);
  };
  useEffect(() => {
    fetchData();
    setLoading(true);
    if (!executed) {
      const very = verify();
      if (payment_status === "true" && very === true) {
        setapps(true);
      } else if (errorOccurred === "true") {
        toast.error("حدث خطأ أثناء الدفع");
      }
      setExecuted(true);
    }
  }, [executed]);

  const verify = () => {
    const paymob_hmac = `${process.env.NEXT_PUBLIC_PAYMOB_HMAC}` as string;

    const string = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;

    const hmac = crypto
      .createHmac("sha512", paymob_hmac as string)
      .update(string)
      .digest("hex");

    return hmac === hmac_p;
  };

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
        <h2 className="text-2xl text-red-600 font-bold">
          لاتوجد حجوزات في قائمة الدفع
        </h2>
      </div>
    );
  }

  const sendemail = async () => {
    const bookingday =
      booking.date &&
      format(parseISO(booking.date), "eeee, d MMMM yyyy", {
        locale: ar,
      });
    const res = await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        subject: `${
          booking.bag_type ? "تم حجز توصيل شنطة" : "تم حجز رحلة جديدة"
        }`,
        fullName: `${booking.first_name?.split(" ")[0] || ""} ${
          booking.last_name?.split(" ").pop() || ""
        }`,
        day: `تاريخ الحجز: ${bookingday}`,
        email: booking.email,
        message: `${
          booking.bag_type
            ? "تم حجز توصيل الشنطة بنجاح سيتم ارسال رسالة اخري بتاكيد الحجز"
            : "تم حجز الرحلة بنجاح فى انتظار تاكيد حجز الرحلة"
        }
        `,
        trip_type: `${
          booking.trip_type ? `نوع الرحلة: ${booking.trip_type}` : ""
        }`,
        seats: `${booking.seats ? `عدد المقاعد: ${booking.seats}` : ""}`,
        bag_type: `${
          booking.bag_type ? `نوع الشنطة: ${booking.bag_type}` : ""
        }`,
        start_time: `توقيت التحرك: ${booking.start_time}`,
        amount: booking.trip_cost,
      }),
    });
  };

  const sendTelegramMessage = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
      const chatId = `${process.env.NEXT_PUBLIC_TELEGRAM_CHATID}`;

      const message = `${
        booking.bag_type ? "🧰 حجز توصيل شنطة" : "🚌 حجز رحلة جديدة"
      }
        👤 الاسم: ${booking.first_name}
        📞 الهاتف: ${booking.phone}
        📅 تاريخ الرحلة: ${booking.date}
        ${booking.trip_type ? `➰ نوع الرحلة: ${booking.trip_type}` : ""}
        ${booking.start_time ? `🕧 التوقيت : ${booking.start_time}` : ""}
        ${booking.end_time ? `🕐 العودة : ${booking.end_time}` : ""}
        ${booking.bag_type ? `🧰 نوع الشنطة : ${booking.bag_type}` : ""}
        ${booking.seats ? `1️⃣ عدد المقاعد : ${booking.seats}` : ""}
        🏬 المنطقة: ${booking.area}
         ${booking.start_point ? `📌 نقطة التحرك: ${booking.start_point}` : ""}
        🏧 الدفع : ${payment_type}
        🫰🏻 الرحلة :  ${payment_status ? "🟢 مدفوع" : "🔴 غير مدفوع"}
        💲 ${booking.trip_cost && `المبلغ : ${booking.trip_cost} جنيه`}
      `;

      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const params = new URLSearchParams({
        chat_id: chatId,
        text: message,
      });

      await fetch(url, {
        method: "POST",
        body: params,
      });
    } catch (error) {
      console.error("Failed to send message to Telegram:", error);
      throw error; // يمكنك رمي الخطأ مرة أخرى للتأكد من تماسكه للأقسام اللاحقة من الكود
    }
  };

  const handleSubmit = async () => {
    try {
      const strapi_kay = process.env.NEXT_PUBLIC_REST_API_KEY;
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${strapi_kay}`,
        },
        body: JSON.stringify({
          order_number: order,
          first_name: booking.first_name,
          last_name: booking.last_name,
          phone: booking.phone,
          email: booking.email,
          area: booking.area,
          start_point: booking.start_point,
          destination: booking.destination,
          trip_type: booking.trip_type,
          date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          seats: booking.seats,
          payment_type: payment_type,
          trip_status: "confirmed",
          trip_cost: booking.trip_cost,
          payment_status: payment_status,
          user_id: booking.user_id,
        }),
      });

      if (res.ok) {
        // إعادة تعيين النموذج بعد نجاح الحجز
        sendemail();
        sendTelegramMessage();
        localStorage.removeItem("booking");
        toast.success("تم الدفع بنجاح");
        toast.success("تم حجز الرحلة بنجاح");
        router.push("/profile");
      } else if (res.status === 500) {
        toast.error("غير مسموح بالحجز الرجاء الاتصال بإدارة الموقع");
        // setError("غير مسموح بالحجز الرجاء الاتصال بإدارة الموقع");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  const data_send_bag = {
    order_number: order,
    first_name: booking.first_name,
    last_name: booking.last_name,
    phone: booking.phone,
    email: booking.email,
    area: booking.area,
    start_point: booking.start_point,
    destination: booking.destination,
    bag_type: booking.bag_type,
    date: booking.date,
    start_time: booking.start_time,
    payment_type: payment_type,
    payment_status: payment_status,
    trip_cost: booking.trip_cost,
    trip_status: "confirmed",
    user_id: booking.user_id,
  };

  const handleSubmitBag = async () => {
    try {
      const strapi_kay = process.env.NEXT_PUBLIC_REST_API_KEY;
      const res = await fetch("/api/booking-bag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${strapi_kay}`,
        },
        body: JSON.stringify(data_send_bag),
      });

      if (res.ok) {
        sendemail();
        sendTelegramMessage();
        toast.success("تم الدفع بنجاح");
        toast.success("تم حجز توصيل الشنة بنجاح");
        localStorage.removeItem("booking");
        router.replace("/profile");
      } else if (res.status === 500) {
        toast.error("غير مسموح بالحجز الرجاء الاتصال بإدارة الموقع");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  if (apps === true) {
    if (!booking.bag_type) {
      handleSubmit();
      setapps(false);
      setExecuted(true);
      console.log("send booking data");
    } else if (booking.bag_type) {
      handleSubmitBag();
      setapps(false);
      setExecuted(true);
      console.log("send bag data");
    }
    setapps(false);
    setExecuted(true);
  }
  return (
    <section>
      {payment_status === "true" ? (
        <div className="flex flex-col items-center justify-center px-5 mt-4">
          <Image
            src="/verifiedtwo.gif"
            alt="check"
            width={130}
            height={130}
            style={{ width: "auto", height: "auto" }} // الحفاظ على نسبة العرض إلى الارتفاع
            priority
          />
          <h2 className="text-[24px] font-bold">تم الدفع بنجاح</h2>
          <h2 className="text-[17px] text-center mt-6 text-gray-500">
            لقد أرسلنا بريدًا إلكترونيًا يتضمن تأكيد طلبك{" "}
          </h2>
          <Link
            href="/profile"
            className="p-2 my-6 text-white rounded-md bg-red-600"
          >
            الذهاب الي حسابك
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-5 mt-4">
          <Image
            src="/payment_failed.gif"
            alt="check"
            width={130}
            height={130}
            style={{ width: "auto", height: "auto" }} // الحفاظ على نسبة العرض إلى الارتفاع
            priority
          />
          <h2 className="text-[24px] font-bold">فشلت عملية الدفع</h2>
          <h2 className="text-[17px] text-center mt-6 text-gray-500">
            برجاء التأكد من استخدام بيانات صحيحة صالحة للدفع{" "}
          </h2>
          <Link
            href="/profile"
            className="p-2 my-6 text-white rounded-md bg-red-600"
          >
            الذهاب الي حسابك
          </Link>
        </div>
      )}
    </section>
  );
}

export default function WrappedCheckOutUi() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckOutUi />
    </Suspense>
  );
}
