"use client";
import React, { useEffect, useState } from "react";
import ControlBooking from "./Components/ControlBooking";
import { ControlData } from "@/app/redux/features/strapi-0/BookingControlsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSession } from "next-auth/react";

export default function BookingManagementUi() {
  const { data: session }: any = useSession();

  const dispatch: AppDispatch = useDispatch();
  const pagevop = 1;
  const Control: any = useSelector((state: RootState) => state.Control);

  const fetchData = () => {
    dispatch(ControlData(pagevop));
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [dispatch, session?.user?.token]);

  if (Control.loading) {
    return (
      <img
        src="/Spinner.svg"
        className="flex m-auto items-center justify-center"
        alt="loading"
      />
    );
  }

  return (
    <div className=" bg-slate-200">
      <div className="flex-1">
        <section>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-2">
            <div className="rounded-lg bg-slate-50">
              <ControlBooking Data={Control.data[0]} Etid={1} />
            </div>
            <div className="rounded-lg bg-slate-50">
              <ControlBooking Data={Control.data[1]} Etid={2} />
            </div>
            <div className="rounded-lg bg-slate-50">
              <ControlBooking Data={Control.data[2]} Etid={3} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
