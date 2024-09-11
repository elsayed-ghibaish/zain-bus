"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchUserMeData } from "@/app/redux/features/strapi-1/UserMeSlice";
import UserProfileInfo from "./_components/UserProfileInfo";
import DetailsList from "./_components/DetailsList";
import BookingNext from "./_components/BookingNext";
import BookingPrevious from "./_components/BookingPrevious";

export default function ProfileUser() {
  const { data: session }: any = useSession();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const UserData: any = useSelector((state: RootState) => state.UserMe);

  useEffect(() => {
    setLoading(true);
    if (session) {
      const userData = session.user.token;
      const fetchData = () => {
        dispatch(fetchUserMeData(userData));
      };

      fetchData();
    }
  }, [session?.user?.token, dispatch]);

  return (
    <section className="bg-slate-100 flow-root	">
      {UserData.data.confirmed === false && (
        <div className=" mx-auto">
          <div className="bg-red-900 text-center py-4 lg:px-4">
            <div
              className="p-2 bg-red-700 items-center text-red-100 leading-none lg:rounded-full flex lg:inline-flex"
              role="alert"
            >
              <span className="flex rounded-full bg-red-500 uppercase px-2 py-1 text-xs font-bold mr-3">
                الحساب معطل
              </span>
              <span className="font-semibold mr-2 text-left flex-auto">
                تم تعطيل الحساب بسبب مخالفة الشروط والأحكام، برجاء الاتصال
                بإدارة الموقع لاعادة التفعيل
              </span>
              <svg
                className="fill-current opacity-75 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <UserProfileInfo user={UserData.data} loading={UserData.loading} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-5 mb-20 max-w-7xl m-auto">
        <div className="rounded-lg bg-white shadow-md border border-1 border-gray-300 p-5 h-fit order-last md:order-lest lg:order-first">
          <DetailsList user={UserData.data} loading={UserData.loading} />
        </div>
        <div className="rounded-lg bg-white shadow-md border border-1 border-gray-300 p-5 lg:col-span-2 order-first md:order-first lg:order-last">
          <BookingNext
            user={UserData.data}
            loading={UserData.loading}
            session={session}
          />
          <BookingPrevious user={UserData.data} loading={UserData.loading} />
        </div>
      </div>
    </section>
  );
}
