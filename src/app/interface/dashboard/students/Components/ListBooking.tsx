import { addDays } from "date-fns";
import { format } from "date-fns/format";
import { ar } from "date-fns/locale";
import { parseISO } from "date-fns/parseISO";
import React, { useState } from "react";
import { BsPrinter } from "react-icons/bs";
import { IoTicketOutline, IoTicketSharp } from "react-icons/io5";

export default function ListBooking({ data, loading }: any) {
  const [search, setSearch] = useState("");
  const currentDate = new Date();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // تحديد عدد العناصر في كل صفحة
  const [BookingDay, setBookingDay] = useState<string>("");

  let counter = 1; // تهيئة متغير الـ counter لكل بيان

  // valed
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDay(event.target.value);
  };
  // فلترة البيانات واستبعاد التي لا تستوفي الشرط
  const filteredData =
    data?.bookings?.filter((item: any) => {
      // تحقق من التاريخ
      if (
        BookingDay &&
        format(parseISO(item.date), "yyyy-MM-dd") !== BookingDay
      ) {
        return false;
      }

      // العنصر يفي بجميع شروط الفلتر
      return true;
    }) || [];

  // حساب عدد الصفحات الإجمالي بناءً على البيانات المفلترة
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // حساب مؤشر البداية والنهاية للعناصر في الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // إضافة متغيرات لحساب الصفحة السابقة والتالية
  const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;

  // Print Page Button
  const handlePrint = () => {
    // يمكنك وضع الكود الذي يتم تنفيذه عند النقر على الزر هنا
    window.print();
  };

  return (
    <div className="flex items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
        <div className="xl:col-span-9 lg:col-span-12">
          <div className="card">
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-2 xl:grid-cols-12 print:hidden">
                {/*end col*/}
                <div className="xl:col-span-5">
                  <div>
                    <label
                      className="text-sm font-medium text-gray-900 flex w-full items-center"
                      htmlFor="date"
                    >
                      البحث بالتاريخ
                      <input
                        type="date"
                        className="mr-3 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-fit focus:outline-red-500"
                        placeholder="البحث عن يوم"
                        value={BookingDay || ""}
                        onChange={handleDateChange}
                      />
                    </label>
                  </div>
                </div>
                {/*end col*/}
                <div className="flex justify-end lg:col-span-2 xl:col-span-4 xl:col-start-10">
                  <button
                    onClick={handlePrint}
                    className="text-white px-2 w-fit py-1 rounded-md bg-red-500 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-red-400/20"
                  >
                    <BsPrinter className="inline" /> طباعة
                  </button>
                </div>
              </div>

              {/*end grid*/}
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600">
                    <tr>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        م
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        التاريخ
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        نوع الرحلة
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        نوع الدفع
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        حالة الرحلة
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                        حالة الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((booking: any, index: any) => (
                      <tr key={index}>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          {index + 1}
                        </td>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-white border-slate-400 text-slate-500 dark:bg-zink-700 dark:border-zink-400 dark:text-zink-200 ltr:mr-1 rtl:ml-1 align-middle">
                            {booking.date &&
                              format(parseISO(booking.date), "eeee", {
                                locale: ar,
                              })}
                          </span>
                          {booking.date &&
                            format(parseISO(booking.date), "d MMMM yyyy", {
                              locale: ar,
                            })}
                        </td>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          {booking.trip_type}
                        </td>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          {booking.payment_type}
                        </td>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          <span
                            className={
                              booking.trip_status === "pending"
                                ? "px-2.5 p-1 inline-block text-xs font-medium rounded border bg-yellow-100 border-transparent text-yellow-500 dark:bg-yellow-500/20 dark:border-transparent"
                                : booking.trip_status === "confirmed"
                                ? "ppx-2.5 p-1 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent"
                                : booking.trip_status === "cancelled"
                                ? "px-2.5 p-1 inline-block text-xs font-medium rounded border bg-red-100 border-transparent text-gray-500 dark:bg-gray-500/20 dark:border-transparent"
                                : booking.trip_status === "rejected"
                                ? "px-2.5 p-1 inline-block text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent"
                                : "ppx-2.5 p-1 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent"
                            }
                          >
                            {booking.trip_status === "pending" &&
                              "في الانتظار "}
                            {booking.trip_status === "confirmed" && "مؤكد"}
                            {booking.trip_status === "cancelled" && "ملغي"}
                            {booking.trip_status === "rejected" && "مرفوض"}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                          <span
                            className={
                              booking.payment_status
                                ? "ppx-2.5 p-1 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent"
                                : "px-2.5 p-1 inline-block text-xs font-medium rounded border bg-yellow-100 border-transparent text-yellow-500 dark:bg-yellow-500/20 dark:border-transparent"
                            }
                          >
                            {booking.payment_status ? "مدفوعة" : "غير مدفوعة"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-center mt-5 md:flex-row">
                <div className="mb-4 grow md:mb-0">
                  <p className="text-slate-500 dark:text-zink-200">
                    يعرض <b>{currentItems.length}</b> من{" "}
                    <b>{data?.booking?.length}</b> من النتائج
                  </p>
                </div>
                <ul className="flex flex-wrap items-center gap-2 shrink-0">
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
