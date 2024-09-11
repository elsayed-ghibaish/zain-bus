"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { GetUserData } from "@/app/redux/features/strapi-0/GetUserSlice";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { fetchUniversityData } from "@/app/redux/features/strapi-0/UniversitysSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function EditStudentUi(id: any) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const dispatch: AppDispatch = useDispatch();
  const UserData: any = useSelector((state: RootState) => state.GetUser);
  const AreasData = useSelector((state: RootState) => state.Area);
  const UniversityData = useSelector((state: RootState) => state.University);

  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [phone_number, setPhone_Number] = useState("");
  const [guardian_phone, setGuardian_Phone] = useState("");

  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [start_point, setStart_Point] = useState("");

  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [academic_year, setAcademic_year] = useState("");
  const [university_accommodation, setUniversity_accommodation] = useState("");
  const [confirmed, setConfirmed] = useState("");

  const [selectedAreaData, setSelectedAreaData]: any = useState(null);
  const [selectedUniversityData, setSelectedUniversityData]: any =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // إضافة حالة للتحكم في حالة التحميل

  const [selectedTime, setSelectedTime] = useState([]); // إضافة حالة للتحكم في حالة التحميل
  const fetchData = () => {
    dispatch(GetUserData(studentId));
    dispatch(AreaData());
    dispatch(fetchUniversityData());
  };
  useEffect(() => {
    fetchData();
    if (session) {
      setFirst_Name(UserData.data.first_name);
      setLast_Name(UserData.data.last_name);
      setPhone_Number(UserData.data.phone_number);
      setGuardian_Phone(UserData.data.guardian_phone);
      setEmail(UserData.data.email);
      setArea(UserData.data.area);
      setStart_Point(UserData.data.start_point);
      setUniversity(UserData.data.university);
      setFaculty(UserData.data.faculty);
      setAcademic_year(UserData.data.academic_year);
      setUniversity_accommodation(UserData.data.university_accommodation);
      setAddress(UserData.data.address);
      setConfirmed(UserData.data.confirmed);
    }
  }, [dispatch, studentId, session]);

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
    setSubmitButtonDisabled(!!agreeTerms); // تعطيل زر الإرسال عند عدم الموافقة
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setArea(event.target.value);
    setStart_Point(""); // Reset the selected state when the country changes
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStart_Point(event.target.value);
  };

  useEffect(() => {
    // ابحث عن بيانات المنطقة المحددة في القائمة
    const selectedArea = AreasData.data.find(
      (areas: any) => areas.attributes.name === area
    );
    if (selectedArea) {
      // حدد البيانات المرتبطة بالمنطقة المحددة
      setSelectedAreaData(selectedArea.attributes.places.data);
    } else {
      setSelectedAreaData(null); // قم بمسح البيانات إذا لم يتم اختيار منطقة
    }

    const selectedUniversity = UniversityData.data.find(
      (universitys: any) =>
        universitys.attributes.university_name === university
    );
    if (selectedUniversity) {
      // حدد البيانات المرتبطة بالمنطقة المحددة
      setSelectedUniversityData(selectedUniversity.attributes.colleges.data);
    } else {
      setSelectedUniversityData(null); // قم بمسح البيانات إذا لم يتم اختيار منطقة
    }

    const selectedsecondaryaddress = UniversityData.data.find(
      (item: any) => item.attributes.university_name === university
    );
    if (selectedsecondaryaddress) {
      setSelectedTime(
        selectedsecondaryaddress.attributes.university_accommodation
          ? selectedsecondaryaddress.attributes.university_accommodation
          : []
      );
    } else {
      setSelectedTime([]);
    }
  }, [area, AreasData.data, university]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const Url = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    try {
      const res = await axios.put(
        `${Url}/users/${studentId}`,
        {
          email,
          //   password,
          first_name,
          last_name,
          phone_number,
          guardian_phone,
          address,
          area,
          start_point,
          university,
          faculty,
          academic_year,
          university_accommodation,
          confirmed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (res.status) {
        toast.success("تم تحديث البيانات بنجاح");
        fetchData();
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التعديل: ");
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };

  function cancelled() {
    router.push("/dashboard/students");
  }

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
    <div className="print:bg-white ">
      <div className="flex-1">
        <div className="mx-auto max-w-6xl text-center mt-5">
          <h2 className="text-xl font-medium bg-slate-200 border-2 border-white shadow-sm rounded-t-lg p-5">
            <span className="text-red-600">{`  ${UserData.data.first_name} ${UserData.data.last_name}`}</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-6xl border-2 bg-gray-100 border-white p-5 rounded-b-lg shadow-sm"
        >
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                الاسم الثلاثى{" "}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="first_name"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setFirst_Name(e.target.value)}
                  value={first_name}
                  pattern="[ء-ي\s]+ [ء-ي\s]+ [ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                اسم العائلة{" "}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setLast_Name(e.target.value)}
                  value={last_name}
                  pattern="[ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                البريد الجامعي{" "}
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  // pattern=" " // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="primary phone"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                رقم الهاتف{" "}
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <svg className="pointer-events-none absolute left-3 top-2 h-full w-5 text-gray-400 fill-red-600">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 
                    0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 
                    1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963
                    3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="primary phone"
                  id="primary phone"
                  autoComplete="primary phone"
                  pattern="[0-5]{3}[0-9]{8}"
                  title="من فضلك ادخل رقم الهاتف الصحيح"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-14 block w-full focus:outline-red-500"
                  onChange={(e) => setPhone_Number(e.target.value)}
                  value={phone_number}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="password"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                كلمة المرور{" "}
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  // pattern="[ء-ي\s]+ [ء-ي\s]+ [ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="عفوا لايمكنك تعديل كلمة السر"
                  disabled
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="confirmed"
                className="block font-medium leading-6 text-gray-900 mb-2"
              >
                حالة المستخدم
              </label>
              <select
                data-te-select-init
                name="confirmed"
                id="confirmed"
                className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={confirmed}
                onChange={(e) => setConfirmed(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                <option value="true">نشط</option>
                <option value="false">موقف</option>
              </select>
            </div>
          </div>
          <div className="border-t border-gray-900/10 mt-10 mb-10"></div>
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="primary address"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                العنوان الاساسى{" "}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="primary address"
                  id="primary address"
                  autoComplete="primary address"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  // pattern="[ء-ي\s]+ [ء-ي\s]+ [ء-ي\s]+" // هذا النمط يسمح بإدخال الأحرف العربية فقط
                  title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="secondary phone"
                className="block font-medium leading-6 text-gray-900"
              >
                {" "}
                رقم هاتف ولى الأمر{" "}
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <svg className="pointer-events-none absolute left-3 top-2 h-full w-5 text-gray-400 fill-red-600">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 
                    0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 
                    1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963
                    3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="secondary phone"
                  id="secondary phone"
                  autoComplete="tel"
                  pattern="[0-5]{3}[0-9]{8}"
                  title="من فضلك ادخل رقم الهاتف الصحيح"
                  className="text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-14 block w-full focus:outline-red-500"
                  onChange={(e) => setGuardian_Phone(e.target.value)}
                  value={guardian_phone}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="area"
                className="font-medium leading-6 text-gray-900"
              >
                المنطقة
              </label>
              <select
                name="area"
                id="area"
                autoComplete="area"
                className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                {AreasData.data.map((Area: any, index: any) => {
                  return (
                    <option key={index} value={Area?.attributes?.name}>
                      {Area?.attributes?.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="start_point"
                className="font-medium leading-6 text-gray-900"
              >
                نقطة التحرك
              </label>
              <select
                name="start_point"
                id="start_point"
                className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                value={start_point}
                onChange={(e) => setStart_Point(e.target.value)}
                required
                disabled={!selectedAreaData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                {selectedAreaData &&
                  selectedAreaData.map((point: any, index: any) => (
                    <option key={index} value={point.attributes.name}>
                      {point.attributes.place_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-900/10 mt-10">
            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3 mt-5 ">
                <label
                  htmlFor="university"
                  className="font-medium leading-6 text-gray-900"
                >
                  الجامعة
                </label>
                <select
                  name="university"
                  id="university"
                  className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  {UniversityData.data.map((item: any, index: any) => (
                    <option
                      key={index}
                      value={item?.attributes?.university_name}
                    >
                      {item?.attributes?.university_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 mt-5 ">
                <label
                  htmlFor="college"
                  className="font-medium leading-6 text-gray-900"
                >
                  الكلية
                </label>
                <select
                  name="college"
                  id="college"
                  className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  disabled={!selectedUniversityData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  {selectedUniversityData &&
                    selectedUniversityData.map((college: any, index: any) => (
                      <option
                        key={index}
                        value={college.attributes.faculty_name}
                      >
                        {college.attributes.faculty_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="classroom"
                  className="font-medium leading-6 text-gray-900"
                >
                  الصف الدراسى
                </label>
                <select
                  data-te-select-init
                  name="classroom"
                  id="classroom"
                  className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={academic_year}
                  onChange={(e) => setAcademic_year(e.target.value)}
                  disabled={!selectedUniversityData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  <option value="الصف الأول">الصف الأول</option>
                  <option value="الصف الثانى">الصف الثانى</option>
                  <option value="الصف الثالث">الصف الثالث</option>
                  <option value="الصف الرابع">الصف الرابع</option>
                  <option value="الصف الخامس">الصف الخامس</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="university_accommodation"
                  className="font-medium leading-6 text-gray-900"
                >
                  السكن الجامعى
                </label>
                <select
                  data-te-select-init
                  name="university_accommodation"
                  id="university_accommodation"
                  className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  value={university_accommodation}
                  onChange={(e) => setUniversity_accommodation(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    اختر
                  </option>
                  {selectedTime.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900/10 mt-3"></div>
          <div className="flex gap-4 mt-5">
            <button
              type="submit"
              name="submit"
              id="submit"
              className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
                ${
                  submitButtonDisabled || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              disabled={submitButtonDisabled || loading}
            >
              {loading ? "جاري تحديث البيانات..." : "تحديث البيانات"}
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
              تم تحديث البيانات بنجاح !
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
