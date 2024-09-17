"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaUniversity, FaUserGraduate } from "react-icons/fa";
import { startCardProcess, startWalletProcess } from "paymob-react"; // Import the startCardProcess function
import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
import { ar } from "date-fns/locale/ar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BsCalendar, BsPerson, BsClock, BsBox } from "react-icons/bs";
import { MdMergeType } from "react-icons/md";
import { IoBagHandle, IoLocationSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import axios from "axios";
import { subDays } from "date-fns";

const PaymentPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const { data: session }: any = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("booking");
    setLoading(true);
    if (data) {
      const parsedData = JSON.parse(data);
      setBooking(parsedData);
      if (parsedData && parsedData.phone) {
        setPhone(parsedData.phone);
      }
    }
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
        <h2 className="text-2xl text-red-600 font-bold">
          لاتوجد حجوزات في قائمة الدفع
        </h2>
      </div>
    );
  }

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
  };
  // Define payment details for card payment
  const paymentDetails = {
    amount: booking.trip_cost,
    currency: "EGP",
    courseTitle: "Travel",
    courseDescription: booking.destination,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phoneNumber: phone,
    userId: booking.user_id || "512",
    country: 789012,
    paymobApiKey: `${process.env.NEXT_PUBLIC_PAYMOBE_API_KEY}`,
    cardIntegrationId: 4544707,
    iframeId: 834403,
  };

  // Function to handle card payment
  const handleCardPayment = async () => {
    try {
      // Start the card payment process
      await startCardProcess(
        paymentDetails.amount,
        paymentDetails.currency,
        paymentDetails.courseTitle,
        paymentDetails.courseDescription,
        paymentDetails.firstName,
        paymentDetails.lastName,
        paymentDetails.email,
        paymentDetails.phoneNumber,
        paymentDetails.userId,
        paymentDetails.country,
        paymentDetails.paymobApiKey,
        paymentDetails.cardIntegrationId,
        paymentDetails.iframeId
      );
      console.log("Card payment process started successfully.");
    } catch (error) {
      console.error("Error starting card payment process:", error);
    }
  };

  // Define payment details for wallet payment
  const walletPaymentDetails = {
    amount: booking.trip_cost, // Replace with the amount in your currency (e.g., 1000 for 10.00 EGP)
    currency: "EGP", // Replace with your currency code (e.g., "EGP" for Egyptian Pound)
    courseTitle: "Travel", // Replace with the name of your product or course
    courseDescription: booking.destination, // Replace with the description of your product or course
    firstName: booking.first_name, // Replace with the first name of the customer
    lastName: booking.last_name, // Replace with the last name of the customer
    email: booking.email, // Replace with the email address of the customer
    phoneNumber: booking.phone, // Replace with the phone number of the customer (including country code)
    userId: booking.user_id || "512", // Replace with a unique identifier for the customer (e.g., user ID)
    courseId: 789012, // Replace with a unique identifier for the course or product
    paymobApiKey: `${process.env.NEXT_PUBLIC_PAYMOBE_API_KEY}`, // Replace with your Paymob API key
    walletIntegrationId: 4624956, // Replace with the ID of your wallet integration
    iframeId: 834404, // Replace with the ID of your iframe
    mobileNumber: "01010101010", // Replace with the mobile number associated with the wallet
  };

  // Function to handle wallet payment
  const handleWalletPayment = async () => {
    try {
      // Start the wallet payment process
      await startWalletProcess(
        walletPaymentDetails.amount,
        walletPaymentDetails.currency,
        walletPaymentDetails.courseTitle,
        walletPaymentDetails.courseDescription,
        walletPaymentDetails.firstName,
        walletPaymentDetails.lastName,
        walletPaymentDetails.email,
        walletPaymentDetails.phoneNumber,
        walletPaymentDetails.userId,
        walletPaymentDetails.courseId,
        walletPaymentDetails.paymobApiKey,
        walletPaymentDetails.walletIntegrationId,
        walletPaymentDetails.iframeId,
        walletPaymentDetails.mobileNumber
      );
      console.log("Wallet payment process started successfully.");
    } catch (error) {
      console.error("Error starting wallet payment process:", error);
    }
  };

  const sendWhatsapp = async () => {
    const bookingday =
      booking.date &&
      format(parseISO(booking.date), "eeee, d MMMM yyyy", {
        locale: ar,
      });

    const api_key = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
    const sender = process.env.NEXT_PUBLIC_WHATSAPP_SENDER;

    const message = `
   *مرحبا* ${booking.first_name.split(" ")[0] || ""}👋🏻،
   ✅ *تم استلام طلبك بنجاح*
   💰 *يرجى الدفع لتأكيد الحجز*
   📅 *تاريخ الرحلة*: ${bookingday}
   💸 *تكلفة الرحلة*: ${booking.trip_cost} جنيهًا
   📱 *رقم التحويل*: 01040015600 
   *مع تحياتنا،*
   zainbus.com
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
          number: `2${booking.phone}`,
          message: message,
        },
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error(error);
    }
  };

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
        fullName: `${booking.first_name?.split(" ")[0] || ""}${
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

  const data_send = {
    // order_number: order,
    first_name: booking.first_name,
    last_name: "محمد حسن غبيش",
    phone: booking.phone,
    email: "elsayedghibaish@gmail.com",
    area: booking.area,
    start_point: booking.start_point,
    destination: booking.destination,
    trip_type: booking.trip_type,
    date: booking.date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    seats: booking.seats,
    payment_type: selectedPaymentMethod,
    trip_cost: booking.trip_cost,
    user_id: booking.user_id,
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
        },
        body: JSON.stringify(data_send),
      });

      if (res.ok) {
        // sendemail();
        sendWhatsapp();
        sendTelegramMessage();
        localStorage.setItem("booking-success", JSON.stringify(data_send));
        localStorage.removeItem("booking");
        router.replace("/pages/booking-success");
        toast.success("تم حجز الرحلة بنجاح");
      } else if (res.status === 500) {
        toast.error("غير مسموح بالحجز الرجاء الاتصال بإدارة الموقع");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  const sendTelegramMessage = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
      const chatId = `${process.env.NEXT_PUBLIC_TELEGRAM_CHATID}`;

      const message = `${
        booking.bag_type ? "🧰 حجز توصيل شنطة" : "🚌 حجز رحلة جديدة"
      }
        👤 الاسم: ${booking.first_name}
        📞 الهاتف: ${phone}
        📅 تاريخ الرحلة: ${booking.date}
        ${booking.trip_type ? `➰ نوع الرحلة: ${booking.trip_type}` : ""}
        ${booking.start_time ? `🕧 التوقيت : ${booking.start_time}` : ""}
        ${booking.end_time ? `🕐 العودة : ${booking.end_time}` : ""}
        ${booking.bag_type ? `🧰 نوع الشنطة : ${booking.bag_type}` : ""}
        ${booking.seats ? `1️⃣ عدد المقاعد : ${booking.seats}` : ""}
        🏬 المنطقة: ${booking.area}
         ${booking.start_point ? `📌 نقطة التحرك: ${booking.start_point}` : ""}
        🏧 الدفع : ${selectedPaymentMethod}
        🫰🏻 الرحلة :  ${booking.payment_status ? "🟢 مدفوع" : "🔴 غير مدفوع"}
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

  const data_send_bag = {
    // order_number: order,
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
    payment_type: selectedPaymentMethod,
    trip_cost: booking.trip_cost,
    user_id: booking.user_id,
  };

  const handleSubmitBag = async () => {
    try {
      const res = await fetch("/api/booking-bag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(data_send_bag),
      });

      if (res.ok) {
        // sendemail();
        sendWhatsapp();
        sendTelegramMessage();
        router.replace("/profile");
        toast.success("تم حجز توصيل الشنة بنجاح");
        localStorage.setItem("booking-success", JSON.stringify(data_send_bag));
        localStorage.removeItem("booking");
      } else if (res.status === 500) {
        toast.error("غير مسموح بالحجز الرجاء الاتصال بإدارة الموقع");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  function handleCashPayment() {
    // تنفيذ الخطوات الخاصة بالدفع نقداً
    handleSubmit();
    console.log("Processing cash payment...");
  }

  // الدالة التي تحدد كيفية التعامل مع كل طريقة دفع
  function handlePayment(paymentMethod: any) {
    if (paymentMethod === "credit_card") {
      handleCardPayment();
    } else if (paymentMethod === "wallet") {
      handleWalletPayment();
    } else if (paymentMethod === "VodafoneCash" && !booking.bag_type) {
      if (!isClicked) {
        setIsClicked(true);
        handleCashPayment();
        // ضع هنا الكود الخاص بعملية الدفع
        console.log("تم الضغط على الزر ومعالجة الدفع");
      } else {
        console.log("تم الضغط بالفعل");
      }
      console.log("send booking data");
    } else if (paymentMethod === "VodafoneCash" && booking.bag_type) {
      if (!isClicked) {
        setIsClicked(true);
        handleSubmitBag();
        // ضع هنا الكود الخاص بعملية الدفع
        console.log("تم الضغط على الزر ومعالجة الدفع");
      } else {
        console.log("تم الضغط بالفعل");
      }
      console.log("send bag data");
    } else {
      toast.warning("برجاء اختيار طريقة دفع");
      console.error("Unsupported payment method.");
    }
  }

  const handlePaymentMethodChange = (method: any) => {
    setSelectedPaymentMethod(method);
    console.log(`Selected Payment Method: ${method}`);
  };

  const getBoxClasses = (method: any) => {
    return `cursor-pointer p-6 rounded-xl shadow-md ${
      selectedPaymentMethod === method ? "border-2 border-red-600" : "border"
    }`;
  };

  const bookingday =
    booking.date &&
    format(subDays(parseISO(booking.date), 1), "eeee, d MMMM yyyy", {
      locale: ar,
    });
  return (
    <section className="bg-slate-100 flow-root">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-5 m-3 lg:m-10">
        <div className="rounded-lg bg-white shadow-md border border-1 border-gray-300 p-2 lg:p-5 w-full lg:w-2/3 order-last md:order-lest lg:order-first">
          {/* طرق الدفع */}
          <div className="space-y-6">
            {/* الدفع بالبطاقة الائتمانية */}

            {/* الدفع عن طريق فودافون كاش */}
            <div
              className={`${getBoxClasses("VodafoneCash")} bg-white`}
              onClick={() => handlePaymentMethodChange("VodafoneCash")}
            >
              <div className="flex items-center space-x-4 lg:py-10">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 ml-2"
                  onChange={() => handlePaymentMethodChange("VodafoneCash")}
                  checked={selectedPaymentMethod === "VodafoneCash"}
                />
                <span className="text-gray-700 font-bold">
                  الدفع عن طريق فودافوان كاش
                </span>
                <Image
                  src="/VodafoneCash.webp"
                  alt="Wallet"
                  width={500}
                  height={250}
                  className="w-28"
                />
              </div>
              {selectedPaymentMethod === "VodafoneCash" && (
                <div className="mt-4">
                  <div className="mt-4 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-gray-700">
                      يرجى إرسال قيمة الحجز على الرقم
                      <span className="text-yellow-600 font-bold">
                        {" "}
                        (01040015600){" "}
                      </span>
                      مع إرفاق سكرين شوت للتحويل عبر واتساب لنفس الرقم.
                    </p>
                    <p className="mt-3 text-base text-gray-700 leading-relaxed font-medium">
                      يجب الدفع خلال 3 ساعات وبحد أقصى قبل الساعة السادسة مساء
                      يوم
                      <span className="text-yellow-700 font-semibold">
                        {" "}
                        {bookingday}{" "}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* الدفع نقدا
            
            <div
              className={`${getBoxClasses("cash")} bg-white`}
              onClick={() => handlePaymentMethodChange("cash")}
            >
              <div className="flex items-center space-x-4 lg:py-10">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 ml-2"
                  onChange={() => handlePaymentMethodChange("cash")}
                  checked={selectedPaymentMethod === "cash"}
                />
                <span className="text-gray-700 font-bold">الدفع نقدا</span>
                <Image
                  src="/VodafoneCash.webp"
                  alt="Wallet"
                  width={500}
                  height={250}
                  className="w-28"
                />
              </div>
              {selectedPaymentMethod === "cash" && <div className="mt-4"></div>}
            </div> */}

            <div
              className={`${getBoxClasses("credit_card")} bg-white`}
              // onClick={() => handlePaymentMethodChange("credit_card")}
            >
              <span className="text-red-600 font-bold text-2xl border-r-4 border-red-600 flex justify-center bg-slate-50 p-3 text-center">
                قريبا
              </span>
              <div className="flex items-center space-x-4 py-5 ">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 ml-2 text-red-600"
                  onChange={() => handlePaymentMethodChange("credit_card")}
                  checked={selectedPaymentMethod === "credit_card"}
                  disabled
                />
                <span className="text-gray-700 font-bold">
                  الدفع عن طريق البطاقة الائتمانية / الخصم المباشر
                </span>
                <Image
                  src="/mastercard-visa.png"
                  alt="Credit Card"
                  width={250}
                  height={100}
                  className="w-28"
                />
              </div>
            </div>

            {/* الدفع عن طريق المحفظة الذكية
            <div
              className={`${getBoxClasses("wallet")} bg-white`}
              // onClick={() => handlePaymentMethodChange("wallet")}
            >
              <span className="text-red-600 font-bold text-2xl border-r-4 border-red-600 flex justify-center bg-slate-50 p-3 text-center">
                قريبا
              </span>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 ml-2"
                  onChange={() => handlePaymentMethodChange("wallet")}
                  checked={selectedPaymentMethod === "wallet"}
                  disabled
                />
                <span className="text-gray-700 font-bold">
                  الدفع عن طريق المحفظة الذكية
                </span>
                <Image
                  src="/wallet.jpg"
                  alt="Wallet"
                  width={500}
                  height={250}
                  className="w-48"
                />
              </div>
              {selectedPaymentMethod === "wallet" && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="أدخل رقم المحفظة"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-gray-300"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}
            </div> */}

            {/* الدفع عن طريق انستاباي */}
            <div
              className={`${getBoxClasses("instapay")} bg-white`}
              // onClick={() => handlePaymentMethodChange("instapay")}
            >
              <span className="text-red-600 font-bold text-2xl border-r-4 border-red-600 flex justify-center bg-slate-50 p-2 text-center mb-2">
                قريبا
              </span>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 ml-2"
                  onChange={() => handlePaymentMethodChange("instapay")}
                  checked={selectedPaymentMethod === "instapay"}
                  disabled
                />
                <span className="text-gray-700 font-bold">
                  الدفع عن طريق انستاباي
                </span>
                <Image
                  src="/instapay.png"
                  alt="instapay"
                  width={500}
                  height={250}
                  className="w-48"
                />
              </div>
              {selectedPaymentMethod === "instapay" && (
                <div className="mt-4">
                  <div className="font-semibold text-white mt-2 bg-red-600 rounded-md p-5">
                    يرجي مسح الكود ودفع قيمة الحجز، مع العلم ان سيتم تاكيد الحجز
                    خلال 3 ساعات من وقت الدفع، يرجي العلم ايضا فى حالة عدم دفع
                    تكلفة الرحلة خلال 3 ساعات سيتم إلغاء الحجز
                  </div>
                </div>
              )}
            </div>

            {/* الدفع عن طريق فوري
            <div
              className={`${getBoxClasses("fawry")} bg-white`}
              // onClick={() => handlePaymentMethodChange("fawry")}
            >
              <span className="text-red-600 font-bold text-2xl border-r-4 border-red-600 flex justify-center bg-slate-50 p-3 text-center">
                قريبا
              </span>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 ml-2"
                  onChange={() => handlePaymentMethodChange("fawry")}
                  checked={selectedPaymentMethod === "fawry"}
                  disabled
                />
                <span className="text-gray-700 font-bold">
                  الدفع عن طريق فوري
                </span>
                <Image
                  src="/fawry.webp"
                  alt="Fawry"
                  width={500}
                  height={300}
                  className="w-48"
                />
              </div>
            </div> */}

            {/* الدفع عن طريق خيارات الدفع التالية
            <div
              className={`${getBoxClasses("other_options")} bg-white`}
              // onClick={() => handlePaymentMethodChange("other_options")}
            >
              <span className="text-red-600 font-bold text-2xl border-r-4 border-red-600 flex justify-center bg-slate-50 p-3 text-center">
                قريبا
              </span>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment_method"
                  className="form-radio h-5 w-5 text-red-600 focus:outline-red-500 focus:ring-red-600  ml-2"
                  onChange={() => handlePaymentMethodChange("other_options")}
                  checked={selectedPaymentMethod === "other_options"}
                  disabled
                />
                <span className="text-gray-700 font-bold">
                  ادفع بأحد خيارات الدفع التالية
                </span>
                <Image
                  src="/aman.jpeg"
                  alt="Other Payment Options"
                  width={100}
                  height={30}
                  className="w-16"
                />
              </div>
            </div> */}

            {/* كود الخصم */}
            {/* <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="أدخل كود الخصم"
                  className="w-full p-3 rounded-lg border border-gray-300 ml-3"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  تفعيل
                </button>
              </div>
            </div> */}

            {/* زر الدفع والإجمالي */}

            {/* زر الدفع */}

            <div className="flex justify-center space-y-0">
              <h3 className="text-xl text-red-600 font-bold inline">
                تكلفة الرحلة:{" "}
                <p className="inline">{booking.trip_cost} جنيهًا</p>
              </h3>
            </div>

            <div className="flex justify-center">
              <button
                className={`${
                  !selectedPaymentMethod ? "mt-5" : ""
                } align-middle text-center select-none border font-bold whitespace-no-wrap rounded py-2 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-500 waves-effect waves-light`}
                onClick={() => handlePayment(selectedPaymentMethod)}
                disabled={isClicked}
              >
                {selectedPaymentMethod === "wallet" ||
                selectedPaymentMethod === "credit_card" ||
                selectedPaymentMethod === "fawry"
                  ? "الدفع الآن"
                  : "تأكيد الحجز"}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="rounded-lgp-5 w-full lg:w-1/3 order-first md:order-first lg:order-last">
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
                {" جنيهًا"}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default PaymentPage;
