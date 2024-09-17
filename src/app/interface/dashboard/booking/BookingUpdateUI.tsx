"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { PlaceData } from "@/app/redux/features/strapi-0/PlacesSlice";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { format } from "date-fns/format";
import axios from "axios";
import { BookingsIdData } from "@/app/redux/features/strapi-0/BookingsIdSlice";

export default function BookingUpdateUI(id: any) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const id_return = id.id.params.id;

  const dispatch: AppDispatch = useDispatch();
  const Bookings: any = useSelector((state: RootState) => state.Bookings);
  const Control: any = useSelector((state: RootState) => state.Control);
  const Places: any = useSelector((state: RootState) => state.Place);

  const [order_number, setOrder_number] = useState();
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [area, setArea] = useState("");
  const [start_point, setStart_Point] = useState("");
  const [destination, setDestination] = useState("");
  const [trip_type, setTrip_type] = useState("");
  const [date, setDate] = useState("");

  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [seats, setseats]: any = useState("");
  const [payment_type, setPayment_type] = useState("");
  const [trip_cost, setTrip_cost]: any = useState();
  const [payment_status, setPayment_status] = useState();
  const [trip_status, setTrip_status] = useState("");
  const [completed, setCompleted] = useState("");
  const [user_id, setUser_id] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    dispatch(ControlData(1));
    dispatch(BookingsIdData(id_return));
    dispatch(AreaData());
    dispatch(PlaceData());
  };

  useEffect(() => {
    if (session && Bookings.data.attributes) {
      const {
        order_number,
        first_name,
        last_name,
        phone,
        email,
        area,
        start_point,
        destination,
        trip_type,
        date,
        start_time,
        end_time,
        seats,
        payment_type,
        trip_cost,
        payment_status,
        trip_status,
      } = Bookings.data.attributes;

      setOrder_number(order_number || "");
      setFirst_Name(first_name || "");
      setLast_Name(last_name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setArea(area || "");
      setStart_Point(start_point || "");
      setDestination(destination || "");
      setTrip_type(trip_type || "");
      setDate(date || "");
      setStart_time(start_time || "");
      setEnd_time(end_time || "");
      setseats(seats || "");
      setPayment_type(payment_type || "");
      setTrip_cost(trip_cost || "");
      setPayment_status(payment_status || "");
      setTrip_status(trip_status || "");
    }
  }, [session, Bookings.data.attributes]);

  useEffect(() => {
    GetCost();
  }, [trip_type, seats]);
  // البحث عن العنصر بواسطة الاسم
  const GetDataMP: any = Places.data.find(
    (item: any) => item.attributes.place_name === start_point
  );

  function GetCost() {
    if (trip_type === "ذهاب") {
      setTrip_cost(GetDataMP?.attributes.one_way_price * seats);
    } else if (trip_type === "عودة") {
      setTrip_cost(GetDataMP?.attributes.return_price * seats);
    } else if (trip_type === "ذهاب وعودة") {
      setTrip_cost(GetDataMP?.attributes.round_trip_price * seats);
    }
  }

  const handleDateChange = (event: any) => {
    // استقبال التاريخ من حقل الإدخال
    const selectedDate = event.target.value;

    // تحويل التاريخ إلى الصيغة المطلوبة
    const date = format(new Date(selectedDate), "yyyy-MM-dd");

    // تعيين التاريخ بالصيغة المحولة إلى الحالة
    setDate(date);
  };

  const handleTimeChange = (event: any) => {
    // استقبال الوقت من حقل الإدخال
    const selectedTime = event.target.value;

    // تحويل الوقت إلى الصيغة المطلوبة
    const formattedTime = format(new Date(`${selectedTime}`), "HH:mm:ss");

    // تعيين الوقت بالصيغة المحولة إلى الحالة
    setStart_time(formattedTime);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const Urlc = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    try {
      const res = await axios.put(`${Urlc}/bookings/${id.id.params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          date,
          start_time,
          trip_type,
          end_time,
          seats,
          payment_type,
          trip_cost,
          trip_status,
        },
      });

      if (res.status) {
        toast.success("تم تحديث الحجز بنجاح");
        setSuccess(true);
        router.push("/dashboard/booking-confirmation");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  function cancelled() {
    router.push("/dashboard/booking-confirmation");
  }

  // console.log(Control.data[0].attributes.departure_time);

  const firstName = first_name?.split(" ").slice(0, 3).join(" ") || [];
  const lastName = last_name?.split(" ").pop() || "";

  if (Bookings.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }
  return (
    <div className="print:bg-white ">
      <div className="flex-1">
        <section>
          <div className="mx-auto max-w-3xl text-center mt-5">
            <h2 className="text-xl font-medium bg-slate-200 border-2 border-white shadow-sm rounded-t-lg p-5">
              تحديث حجز{" "}
              <span className="text-red-600">{`  ${firstName} ${lastName}`}</span>
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl border-2 bg-gray-100 border-white p-5 rounded-b-lg shadow-sm"
          >
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="TripType"
                  className="block mb-2 font-medium leading-6 text-gray-900"
                >
                  نوع الرحلة
                </label>
                <select
                  name="TripType"
                  id="TripType"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={trip_type}
                  onChange={(e) => setTrip_type(e.target.value)}
                  required
                >
                  <option disabled hidden></option>
                  <option value="ذهاب">ذهاب</option>
                  <option value="عودة">عودة</option>
                  <option value="ذهاب وعودة">ذهاب وعودة</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block mb-2 font-medium leading-6 text-gray-900"
                >
                  تاريخ الرحلة
                </label>
                <div className="sm:col-span-3">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    required
                  />
                </div>
              </div>

              {/* {trip_type !== "عودة" && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="start_time"
                    className="block mb-2 font-medium leading-6 text-gray-900"
                  >
                    التوقيت
                  </label>
                  <select
                    name="start_time"
                    id="start_time"
                    className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    value={start_time}
                    onChange={(e) => setStart_time(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      اختر
                    </option>
                    {GetDataMP?.attributes.timing.map(
                      (item: any, index: any) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )} */}

              {trip_type !== "ذهاب" && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="time"
                    className="block font-medium leading-6 text-gray-900 mb-2"
                  >
                    موعد نهاية المحاضرات
                  </label>
                  <div className="sm:col-span-3">
                    <select
                      name="time"
                      id="time"
                      value={end_time}
                      onChange={(e) => setEnd_time(e.target.value)}
                      className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                      required
                    >
                      <option value="" disabled hidden>
                        نهاية المحاضرات
                      </option>
                      {Control.data[0].attributes.departure_time.map(
                        (time: any) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="sm:col-span-3">
                <label
                  htmlFor="seats"
                  className="block font-medium leading-6 text-gray-900 mb-2"
                >
                  عدد المقاعد
                </label>
                <select
                  name="seats"
                  id="seats"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={seats}
                  onChange={(e) => setseats(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="trip_status"
                  className="block font-medium leading-6 text-gray-900 mb-2"
                >
                  حالة الرحلة
                </label>
                <select
                  name="trip_status"
                  id="trip_status"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={trip_status}
                  onChange={(e) => setTrip_status(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  <option value="pending">فى الانتظار</option>
                  <option value="confirmed">مؤكدة</option>
                  <option value="cancelled">ملغي</option>
                  <option value="rejected">مرفوضة</option>
                  <option value="completed">مكتملة</option>
                </select>
              </div>

              {/* <div className="sm:col-span-3">
                <label
                  htmlFor="paymenttype"
                  className="block font-medium leading-6 text-gray-900 mb-2"
                >
                  الدفع
                </label>
                <div className="sm:col-span-3">
                  <select
                    name="paymenttype"
                    id="paymenttype"
                    value={payment_type}
                    onChange={(e) => setPayment_type(e.target.value)}
                    className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                    required
                  >
                    <option value="" disabled hidden>
                      اختر
                    </option>
                    <option value="visa">visa</option>
                    <option value="wallet">wallet</option>
                    <option value="cash">cash</option>
                    <option value="MasterCard">MasterCard</option>
                  </select>
                </div>
              </div> */}
            </div>
            <div className="border-t border-gray-900/10 mt-3"></div>
            <div className="mt-3">
              <h3>
                <span className="text-red-500 font-medium">
                  تكلفة الرحلة :{" "}
                </span>
                {`${trip_cost ? trip_cost : "0"} ج.م`}
              </h3>
            </div>
            <div className="border-t border-gray-900/10 mt-3"></div>

            <div className="flex gap-4 mt-3">
              <button
                type="submit"
                className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
            bg-red-700 hover:bg-red-800"
              >
                {loading ? "جاري تحديث البيانات..." : "تحديث الحجز"}
              </button>

              <div
                className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
                        bg-gray-500 hover:bg-gray-600 cursor-pointer"
                onClick={cancelled} // استبدال href بـ onClick
              >
                إلغاء
              </div>
            </div>

            {success && (
              <div
                className="mb-3 mt-5 inline-flex w-full items-center rounded-lg bg-green-100 px-6 py-5 text-base text-green-700"
                role="alert"
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                تم تحديث الحجز بنجاح
              </div>
            )}

            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
