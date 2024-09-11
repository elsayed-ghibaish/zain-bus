"use client";
import React, { useEffect, useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { StudentsData } from "@/app/redux/features/strapi-0/StudentsSlice";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";

export default function StudentsUi() {
  const [selectedCities, setselectedCities] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // تحديد عدد العناصر في كل صفحة

  let counter = 1; // تهيئة متغير الـ counter لكل بيان

  const dispatch: AppDispatch = useDispatch();
  const UserData: any = useSelector((state: RootState) => state.Students);
  const AreasData = useSelector((state: RootState) => state.Area);

  const fetchData = () => {
    dispatch(AreaData());
    dispatch(StudentsData());
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  if (UserData.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }

  const handleCityChange = (city: string) => {
    const updatedCities = selectedCities.includes(city)
      ? selectedCities.filter((c) => c !== city)
      : [...selectedCities, city];

    setselectedCities(updatedCities);
  };

  const handleSubmitactive = async (id: any) => {
    try {
      const Url = process.env.NEXT_PUBLIC_STRAPI_URL_API;
      const res = await axios.put(`${Url}/users/${id}`, {
        confirmed: true,
      });

      if (res.status) {
        fetchData();
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  const handleSubmitcancelled = async (id: any) => {
    try {
      const Url = process.env.NEXT_PUBLIC_STRAPI_URL_API;
      const res = await axios.put(`${Url}/users/${id}`, {
        confirmed: false,
      });

      if (res.status) {
        fetchData();
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  // فلترة البيانات واستبعاد التي لا تستوفي الشرط
  const filteredData = UserData.data?.filter((item: any) => {
    // تحقق من المنطقة
    if (selectedCities.length > 0 && !selectedCities.includes(item.area)) {
      return false;
    }

    // البحث عن اسم

    if (
      search.length > 0 &&
      !item.username.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // العنصر يفي بجميع شروط الفلتر
    return true;
  });

  // حساب عدد الصفحات الإجمالي بناءً على البيانات المفلترة
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // حساب مؤشر البداية والنهاية للعناصر في الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // إضافة متغيرات لحساب الصفحة السابقة والتالية
  const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;

  return (
    <div className="print:bg-white ">
      <div className="flex-1">
        <section>
          <div className="bg-slate-300 border-2 border-white shadow-sm rounded-t-lg grid grid-cols-1 gap-x-7 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 p-5 mt-5 print:hidden print:bg-none">
            <div className="sm:col-span-2 md:col-span-4 lg:flex bg-slate-200 p-1 rounded-md">
              <span className="text-sm font-medium text-gray-900 justify-center flex items-center">
                حسب المدينة
              </span>
              {AreasData.data?.map((cityName: any) => (
                <label
                  htmlFor={`checkboxes-${cityName.id}`}
                  key={cityName.id}
                  className="flex m-auto items-center justify-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`checkboxes-${cityName.id}`}
                    name={`checkboxes-${cityName.id}`}
                    className="ml-2 border shadow form-checkbox h-5 w-5   text-red-700 focus:ring-red-600 accent-red-600 overflow-auto"
                    value={cityName.attributes.name}
                    checked={selectedCities.includes(cityName.attributes.name)}
                    onChange={() => handleCityChange(cityName.attributes.name)}
                  />
                  {cityName.attributes.name}
                </label>
              ))}
            </div>

            <div className="sm:col-span-1">
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
          </div>

          <div className="bg-white border-2 border-white shadow-sm rounded-b-lg p-5 print:rounded-none print:border-none print:p-0 print:shadow-none">
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="text-center bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600">
                  <tr>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500 w-10">
                      <div className="flex items-center h-full"></div>
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      م
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      الاسم
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      المنطقة
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      رقم التليفون
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      تاريخ الانضام
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      الحالة
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="*:text-right  *:border-stone-50">
                  {currentItems.map((item: any) => {
                    const firstName =
                      item.first_name?.split(" ").slice(0, 3).join(" ") || [];
                    const lastName = item.last_name?.split(" ").pop() || "";

                    return (
                      <tr key={item.id}>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          <div className="flex items-center h-full"></div>
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          {counter++}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          <a href={`/dashboard/students/student?id=${item.id}`}>
                            <div className="flex gap-2">
                              <div className="bg-green-100 rounded-full size-10 dark:bg-green-500/20 shrink-0">
                                <img
                                  src={
                                    item.photo?.formats?.small.url ||
                                    "/avatar.webp"
                                  }
                                  alt={firstName}
                                  className="  rounded-full"
                                />
                              </div>
                              <div className="grow">
                                <h6>{`${firstName} ${lastName}`}</h6>
                                <p className="text-slate-500 dark:text-zink-200">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                          </a>
                        </td>
                        <td className="text-center px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          {item.area}
                        </td>
                        <td className="text-center px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          {item.phone_number}
                        </td>
                        <td className="text-center px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          {format(
                            parseISO(item.createdAt),
                            "eeee, d MMMM yyyy",
                            {
                              locale: ar,
                            }
                          )}
                        </td>
                        <td className="text-center px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          {item.confirmed ? (
                            <div className="flex items-center">
                              <span className="p-1.5 rounded-full bg-green-500" />
                              <span className="mx-4">نشط</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="p-1.5 rounded-full bg-red-500" />
                              <span className="mx-4">موقف</span>
                            </div>
                          )}
                        </td>
                        <td className="text-center px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                          <a
                            href={`/dashboard/students/student/${item.id}?id=${item.id}`}
                            id={item.id}
                          >
                            <ol className="bg-slate-100 p-2  rounded hover:bg-slate-300 inline-flex">
                              <HiPencilAlt title="تعديل" />
                            </ol>
                          </a>

                          <button
                            className={`bg-slate-100 text-white p-2 m-1 rounded hover:bg-slate-300 ${
                              item.confirmed ? "bg-red-500" : "bg-green-500"
                            }`}
                            onClick={() =>
                              item.confirmed
                                ? handleSubmitcancelled(item.id)
                                : handleSubmitactive(item.id)
                            }
                          >
                            {item.confirmed ? (
                              <FcCancel title="تغيير الحالة إلى غير نشطة" />
                            ) : (
                              <FcCheckmark title="تغيير الحالة إلى نشطة" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5 print:hidden">
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
        </section>
      </div>
    </div>
  );
}
