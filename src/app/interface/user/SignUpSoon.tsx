import React from "react";

export default function SignUpSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-gradient-to-bl from-gray-100 to-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">قريباً</h1>
      <p className="text-gray-600 text-lg mb-8">
        سيتم فتح التسجيل للطلاب قريبا
      </p>
      <div className="flex space-x-4">
        <a
          href="/pages/booking-guest"
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full shadow-lg transition duration-300"
        >
          حجز رحلة
        </a>
      </div>
    </div>
  );
}
