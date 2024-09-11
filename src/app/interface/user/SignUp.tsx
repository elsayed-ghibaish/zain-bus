"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AreaData } from "@/app/redux/features/strapi-0/AreaSlice";
import { fetchUniversityData } from "@/app/redux/features/strapi-0/UniversitysSlice";

export default function SignUp() {
  const router = useRouter();
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

  const [selectedAreaData, setSelectedAreaData]: any = useState(null);
  const [selectedUniversityData, setSelectedUniversityData]: any =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // إضافة حالة للتحكم في حالة التحميل

  const [selectedTime, setSelectedTime] = useState([]); // إضافة حالة للتحكم في حالة التحميل

  const dispatch: AppDispatch = useDispatch();
  const AreasData = useSelector((state: RootState) => state.Area);
  const UniversityData = useSelector((state: RootState) => state.University);

  useEffect(() => {
    const fetchData = () => {
      dispatch(AreaData());
      dispatch(fetchUniversityData());
    };
    fetchData();
  }, [dispatch]);

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
  }, [area, AreasData.data, university, UniversityData.data]);

  const sendTelegramMessage = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
      const chatId = `${process.env.NEXT_PUBLIC_TELEGRAM_CHATID_NEWUSER}`;

      const message = `طالب جديد 🆕 
      اسم الطالب : ${
        (first_name.split(" ")[0] || "") +
        " " +
        (last_name.split(" ").pop() || "")
      }
        المنطقة : ${area}
        رقم التليفون: ${phone_number}
        الايميل : ${email}
        الكلية: ${faculty}
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !phone_number ||
      !guardian_phone ||
      !address ||
      !area ||
      !start_point ||
      !university ||
      !faculty ||
      !academic_year ||
      !university_accommodation
    ) {
      setError("برجاء استكمال جميع البيانات بشكل صحيح");
      return;
    }

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username:
            (first_name.split(" ")[0] || "") +
            " " +
            (last_name.split(" ").pop() || ""),

          email,
          password,
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
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        sendTelegramMessage();
        router.replace("/sign-in");
        toast.success("تم التسجيل بنجاح");
      } else {
        console.log("برجاء ملء الحقول بشكل صحيح");
      }
    } catch (error) {
      console.log("حدث خطأ أثناء التسجيل: ", error);
    }
  };
  return (
    <section>
      <div className="mt-5"></div>
      <div className="mx-auto max-w-2xl text-center mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-red-600 sm:text-4xl font-tajawal">
          تسجيل بيانات طالب جديد
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600 font-tajawal">
          برجاء تعبئة البيانات التالية بشكل صحيح
        </p>
      </div>

      <form
        id="form"
        action=""
        method="POST"
        className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8"
        onSubmit={handleSubmit}
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
                autoComplete="username"
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
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
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
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
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
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
              htmlFor="phone_number"
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
                name="phone_number"
                id="phone_number"
                autoComplete="phone"
                pattern="[0-5]{3}[0-9]{8}"
                title="من فضلك ادخل رقم الهاتف الصحيح"
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-10 block w-full focus:outline-red-500"
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
                title="الرجاء إدخال الاسم باللغة العربية ويجب أن يكون الأسم ثلاثى على الأقل"
                required
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-900/10 mt-10 mb-10"></div>
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="address"
              className="block font-medium leading-6 text-gray-900"
            >
              {" "}
              العنوان الاساسى{" "}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="address"
                id="address"
                autoComplete="address"
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
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
              htmlFor="guardian_phone"
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
                name="guardian_phone"
                id="guardian_phone"
                autoComplete="tel"
                pattern="[0-5]{3}[0-9]{8}"
                title="من فضلك ادخل رقم الهاتف الصحيح"
                className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-10 block w-full focus:outline-red-500"
                onChange={(e) => setGuardian_Phone(e.target.value)}
                value={guardian_phone}
                required
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="Area"
              className="font-medium leading-6 text-gray-900"
            >
              المنطقة
            </label>
            <select
              name="Area"
              id="Area"
              autoComplete="Area"
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
                  <option key={index} value={point.attributes.place_name}>
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
                onChange={(e) => {
                  setUniversity(e.target.value);
                  // Update the selected time based on the selected college
                  const selecteduniversity_accommodation =
                    UniversityData.data.find(
                      (item: any) =>
                        item.attributes.university_name === e.target.value
                    );
                  if (selecteduniversity_accommodation) {
                    setSelectedTime(
                      selecteduniversity_accommodation.attributes
                        .university_accommodation
                        ? selecteduniversity_accommodation.attributes
                            .university_accommodation
                        : []
                    );
                  } else {
                    setSelectedTime([]);
                  }
                }}
                required
              >
                <option value="" disabled hidden>
                  اختر
                </option>
                {UniversityData.data.map((item: any, index: any) => (
                  <option key={index} value={item?.attributes?.university_name}>
                    {item?.attributes?.university_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 mt-5 ">
              <label
                htmlFor="faculty"
                className="font-medium leading-6 text-gray-900"
              >
                الكلية
              </label>
              <select
                name="faculty"
                id="faculty"
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
                  selectedUniversityData.map((colleges: any, index: any) => (
                    <option
                      key={index}
                      value={colleges.attributes.faculty_name}
                    >
                      {colleges.attributes.faculty_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="academic_year"
                className="font-medium leading-6 text-gray-900"
              >
                الصف الدراسى
              </label>
              <select
                data-te-select-init
                name="academic_year"
                id="academic_year"
                className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full sm:max-w-xs focus:outline-red-500"
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
                className="text-gray-700 mt-2 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full sm:max-w-xs focus:outline-red-500"
                value={university_accommodation}
                onChange={(e) => setUniversity_accommodation(e.target.value)}
                disabled={!selectedUniversityData} // تعطيل حقل نقطة التحرك إذا لم يتم اختيار منطقة
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

        <div className="mt-5">
          <label htmlFor="agree-terms" className="flex items-center">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreeTerms}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-red-700 focus:ring-red-600 accent-red-600"
            />
            <span className="mr-5 text-gray-900 cursor-pointer">
              الموافقة على{" "}
              <span className="text-red-700 font-bold underline">
                <a href="/pages/policy" target="_blank">
                  شروط التسجيل
                </a>
              </span>
            </span>
          </label>
        </div>

        <div className="border-t border-gray-900/10 mt-3"></div>
        <div className="mt-5">
          <button
            type="submit"
            name="submit"
            id="submit"
            className={`block w-full rounded-md px-3.5 py-2.5 text-center font-semibold text-white shadow-sm 
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
            ${
              submitButtonDisabled || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }`}
            disabled={submitButtonDisabled || loading}
          >
            {loading ? "جاري إرسال البيانات..." : "تسجيل"}
          </button>
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
            تم إرسال البيانات بنجاح !
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
        )}
      </form>
      <div>
        <p className="mt-5 text-center text-sm text-gray-500 mb-10">
          لديك حساب بالفعل ؟{" "}
          <a
            href="/sign-in"
            className="font-semibold leading-6 text-red-600 hover:text-red-500"
          >
            تسجيل الدخول الآن
          </a>
        </p>
      </div>
    </section>
  );
}
