"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaUserShield,
  FaUniversity,
  FaSwatchbook,
  FaUserEdit,
} from "react-icons/fa";
import Image from "next/image";
import ListBooking from "./Components/ListBooking";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { GetUserData } from "@/app/redux/features/strapi-0/GetUserSlice";

export default function StudentUi(id: any) {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");

  const dispatch: AppDispatch = useDispatch();
  const UserData: any = useSelector((state: RootState) => state.GetUser);

  useEffect(() => {
    const fetchData = () => {
      dispatch(GetUserData(studentId));
    };
    fetchData();
  }, [dispatch, studentId]);

  if (UserData.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }

  return (
    <div className=" print:bg-white ">
      <div className="flex-1">
        <section>
          <div className="flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="flex-shrink-0">
                  <img
                    className="rounded-full border-4 border-gray-300 shadow-md ml-3"
                    src={
                      UserData.data?.photo?.formats.medium.url || "/avatar.webp"
                    }
                    alt="User Image"
                    width={150}
                    height={150}
                  />
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 w-full text-center md:text-right">
                  <div className="lg:flex lg:float-end md:flex md:float-end print:hidden">
                    <a
                      href={`/dashboard/students/student/${UserData.data.id}?id=${UserData.data.id}`}
                      className="text-white px-2 w-fit py-1 rounded-md bg-red-500 border-red-500 hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-red-400/20"
                    >
                      <FaUserEdit className="inline" /> تعديل البيانات
                    </a>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {`${UserData.data?.first_name} ${UserData.data?.last_name}`}
                  </h2>

                  <p className="text-gray-700 mt-2 flex items-center justify-center md:justify-start">
                    <FaCheckCircle className="text-green-500 ml-2" />
                    <span className="font-semibold ml-1">الحالة: </span>{" "}
                    {UserData.data?.confirmed === true ? (
                      <span className="list-disc text-green-500">نشط</span>
                    ) : (
                      <span className="list-disc text-red-500">موقوف</span>
                    )}
                  </p>
                  <p className="text-gray-700 mt-1 flex items-center justify-center md:justify-start">
                    <FaUserShield className="text-blue-500 ml-2" />
                    <span className="font-semibold ml-1">الصلاحيات:</span>{" "}
                    {UserData.data?.role?.name}
                  </p>
                  <p className="text-gray-700 mt-1 flex items-center justify-center md:justify-start">
                    <FaCity className="text-purple-500 ml-2" />
                    <span className="font-semibold ml-1">المدينة:</span>{" "}
                    {UserData.data?.area}
                  </p>
                  <p className="text-gray-700 mt-1 flex items-center justify-center md:justify-start">
                    <FaMapMarkerAlt className="text-red-500 ml-2" />
                    <span className="font-semibold ml-1">
                      نقطة التحرك:
                    </span>{" "}
                    {UserData.data?.start_point}
                  </p>
                  <p className="text-gray-700 flex flex-wrap justify-center md:justify-start items-center space-x-3">
                    <span className="flex items-center">
                      <FaSwatchbook className="text-red-500 ml-2" />
                      <span className="font-semibold">عدد الحجوزات:</span>{" "}
                      <span className="bg-slate-100 text-red-600 py-1 px-3 m-2 rounded-md">
                        {UserData?.data?.bookings?.length}
                      </span>
                    </span>

                    <span className="flex items-center">
                      <span className="font-semibold mr-3">فى الانتظار:</span>
                      <span className="bg-slate-100 text-red-600 py-1 px-3 m-2 rounded-md">
                        {UserData.data?.bookings?.filter(
                          (booking: any) => booking.trip_status === "pending"
                        ).length || "0"}
                      </span>
                    </span>

                    <span className="flex items-center">
                      <span className="font-semibold mr-3">مؤكد:</span>
                      <span className="bg-slate-100 text-red-600 py-1 px-3 m-2 rounded-md">
                        {UserData.data?.bookings?.filter(
                          (booking: any) => booking.trip_status === "confirmed"
                        ).length || "0"}
                      </span>
                    </span>

                    <span className="flex items-center">
                      <span className="font-semibold mr-3">ملغى:</span>
                      <span className="bg-slate-100 text-red-600 py-1 px-3 m-2 rounded-md">
                        {UserData.data?.bookings?.filter(
                          (booking: any) => booking.trip_status === "cancelled"
                        ).length || "0"}
                      </span>
                    </span>

                    <span className="flex items-center">
                      <span className="font-semibold mr-3">مرفوض:</span>
                      <span className="bg-slate-100 text-red-600 py-1 px-3 m-2 rounded-md">
                        {UserData.data?.bookings?.filter(
                          (booking: any) => booking.trip_status === "rejected"
                        ).length || "0"}
                      </span>
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                  بيانات الاتصال
                </h3>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-700 flex items-center">
                    <FaPhone className="text-green-500 ml-2" />
                    <span className="font-semibold ml-1">رقم التليفون:</span> EG
                    +2
                    {UserData.data?.phone_number}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaPhone className="text-red-500 ml-2" />
                    <span className="font-semibold ml-1">
                      رقم هاتف ولى الأمر:
                    </span>{" "}
                    EG +2{UserData.data?.guardian_phone}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaEnvelope className="text-blue-500 ml-2" />
                    <span className="font-semibold ml-1">الايميل:</span>{" "}
                    {UserData.data?.email}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaUniversity className="text-purple-500 ml-2" />
                    <span className="font-semibold ml-1">
                      عنوان السكن الجامعى:
                    </span>{" "}
                    {UserData.data?.university_accommodation}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaMapMarkerAlt className="text-red-500 ml-2" />
                    <span className="font-semibold ml-1">
                      العنوان الاساسى:
                    </span>{" "}
                    {UserData.data?.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ListBooking data={UserData.data} loading={UserData.loading} />
        </section>
      </div>
    </div>
  );
}
