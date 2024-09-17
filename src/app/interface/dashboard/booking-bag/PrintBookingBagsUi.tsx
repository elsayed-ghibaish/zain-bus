"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns/format";
import { addDays, parseISO } from "date-fns";
import { HiPencilAlt } from "react-icons/hi";
import Link from "next/link";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";
import { BookingBag } from "@/app/redux/features/strapi-0/BookingBagSlice";

export default function PrintBookingBagsUi() {
  // const { data, loading, error }: any = useFetch("/regions");

  const [datatwo, setdatatwo]: any = useState([]);
  const [dataThree, setDataThree]: any = useState();
  const [dataFour, setDataFour]: any = useState([]);
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
  const [TimingEnd, setTimingEnd] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // تحديد عدد العناصر في كل صفحة

  let counter = 1; // تهيئة متغير الـ counter لكل بيان

  const dispatch: AppDispatch = useDispatch();
  const Areas = useSelector((state: RootState) => state.Area);
  const Bookings: any = useSelector((state: RootState) => state.BookingBag);
  const Control: any = useSelector((state: RootState) => state.Control);

  const fetchData = () => {
    dispatch(AreaData());
    dispatch(BookingBag());
    dispatch(ControlData(1));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, datatwo]);

  // Reject Booking item
  const RejectBooking = async (id: any) => {
    const confirmed = confirm("هل أنت متاكد من إلغاء الحجز");
    if (confirmed) {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_API;
      const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
      const config = {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      };
      try {
        const res = await axios.put(
          `${apiUrl}/booking-bags/${id}`,
          {
            data: {
              trip_status: "rejected",
            },
          },
          config
        );

        if (res.status !== 200) {
          throw new Error(
            `Failed to delete booking. Server response: ${res.statusText}`
          );
        }
        toast.success("تم إلغاء الحجز بنجاح");
        // تحديث حالة البيانات بعد الحذف
        const updatedData = datatwo.filter((item: any) => item.id !== id);
        setdatatwo(updatedData);
      } catch (error) {
        console.error(error);
      }
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

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimingEnd(event.target.value);
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

      // تحقق من المنطقة
      if (
        selectedCities.length > 0 &&
        !selectedCities.includes(item.attributes.area)
      ) {
        return false;
      }

      // العنصر يفي بجميع شروط الفلتر
      return true;
    })
    .filter((item: any) => item.attributes.trip_status === "confirmed");

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
    <div className="print:my-10">
      <div className="flex my-5">
        <h2 className="m-auto items-center text-center text-red-600 font-bold">
          كشف حجز توصيل الشنط
        </h2>
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
        <div className="sm:col-span">
          <label
            htmlFor="connter-6"
            className="block text-sm w-36 font-medium leading-6 text-gray-900"
          >
            عدد الصفوف
          </label>
          <input
            type="number"
            id="connter-6"
            name="connter-6"
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
            htmlFor="OperatingCosts-2"
            className="block text-sm w-36 font-medium leading-6 text-gray-900"
          >
            تكاليف تشغيل
          </label>
          <input
            type="number"
            id="OperatingCosts-2"
            name="OperatingCosts-2"
            min={0}
            value={OperatingCosts}
            onChange={(e) => setOperatingCosts(Number(e.target.value))}
            className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
          />
        </div>
      </div>

      <div className="bg-slate-50 border-2 border-white shadow-sm rounded-b-lg p-5 print:rounded-none print:border-none print:p-0 print:shadow-none">
        <div className="overflow-hidden rounded-t-lg">
          <table className="table-fixed w-full whitespace-nowrap overflow-auto lg:inline-table md:flow-root sm:inline-table flow-root">
            <thead className="bg-red-700 text-white">
              <tr className="*:p-3 *:border-l *:font-bold">
                <th className="w-10">م</th>
                <th className="w-52">الاسم</th>
                <th>نوع الشنطة</th>
                <th className="w-40">نقطة التحرك</th>
                <th>رقم التليفون</th>
                <th>الحجز</th>
                <th className="print:hidden">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="*:text-center  *:border-stone-50">
              {currentItems?.map((item: any) => {
                if (item.attributes.trip_status === "confirmed") {
                  const currentColorClass =
                    item.id % 2 === 0 ? "bg-zinc-200" : "bg-zinc-300";

                  const firstName =
                    item.attributes.first_name
                      ?.split(" ")
                      .slice(0,2)
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
                      <td className="pr-2 text-right">{`${firstName} ${lastName}`}</td>
                      <td>{item.attributes.bag_type}</td>
                      <td className="text-sm">
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
                        {item.attributes.payment_status ? "مدفوع" : "غير مدفوع"}
                      </td>
                      <td className="print:hidden">
                        <Link
                          href={`/dashboard/bag-update/${item.id}`}
                          id={item.id}
                        >
                          <ol className="bg-slate-100 p-2  rounded hover:bg-slate-300 inline-flex">
                            <HiPencilAlt title="تعديل" />
                          </ol>
                        </Link>

                        <button
                          onClick={() => RejectBooking(item.id)}
                          className="bg-slate-100 text-white p-2 m-1 rounded hover:bg-slate-300"
                        >
                          <FcCancel title="إلغاء الحجز" />
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
          <h4 className="text-xl font-bold text-red-500">
            التكلفة: <span>{totalPrice2 - OperatingCosts} ج.م </span>
          </h4>

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
  );
}
