"use client";
import React, { useEffect, useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import {
  FaHome,
  FaCog,
  FaBars,
  FaTimes,
  FaCheckCircle,
  FaSuitcaseRolling,
} from "react-icons/fa";
import { MdFlightLand, MdOutlineTravelExplore } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="print:hidden">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden p-4"
      >
        {isMobileOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </button>

      {/* Sidebar للشاشات الكبيرة */}
      <div
        className={`hidden md:flex flex-col p-5 bg-gray-800 text-white transition-all duration-300 h-full ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`text-2xl font-bold transition-all duration-300 ${
              !isOpen && "hidden"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                className="w-24 flex items-center justify-center m-10"
                src="/logo.svg"
                alt="الزين ترافل"
              />
            </div>
            لوحة التحكم
            <div className="border-b border-b-gray-700 mt-5 w-full"></div>{" "}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <span className="text-2xl">{isOpen ? "→" : "←"}</span>
          </button>
        </div>
        <ul className="space-y-6">
          <li>
            <a
              href="/dashboard"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaHome className="text-2xl" />
              {isOpen && <span className="text-xl">الصفحة الرئيسية</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/booking-management"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCog className="text-2xl" />
              {isOpen && <span className="text-xl">التحكم في الحجز</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/booking-confirmation"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCheckCircle className="text-2xl" />
              {isOpen && <span className="text-xl">تأكيد الرحلات</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/baggage-confirmation"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaSuitcaseRolling className="text-2xl" />
              {isOpen && <span className="text-xl">تأكيد توصيل الشنط</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/print-bookings"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <AiOutlinePrinter className="text-2xl" />
              {isOpen && <span className="text-xl">طباعة الرحلات</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/completed-trips"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <MdFlightLand className="text-2xl" />
              {isOpen && <span className="text-xl">تأكيد الوصول</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/all-booking"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <MdOutlineTravelExplore className="text-2xl" />
              {isOpen && <span className="text-xl">كل الرحلات</span>}
            </a>
          </li>
          <li>
            <a
              href="/dashboard/students"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <PiStudentFill className="text-2xl" />
              {isOpen && <span className="text-xl">الطلاب</span>}
            </a>
          </li>
          {/* <li>
            <a
              href="#"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCog className="text-2xl" />
              {isOpen && <span className="text-xl">الإعدادات</span>}
            </a>
          </li> */}
        </ul>
      </div>

      {/* Sidebar للشاشات الصغيرة */}
      <div
        className={`md:hidden z-50 flex flex-col bg-gray-800 mt-20 text-white transition-transform duration-300 fixed ${
          isMobileOpen ? "top-0" : "-top-full"
        } w-full`}
      >
        <div className="flex items-center justify-between p-5">
          <h2 className="text-2xl font-bold">لوحة التحكم</h2>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="focus:outline-none"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <ul className="space-y-6 p-5">
          <li>
            <a
              href="/dashboard"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaHome className="text-2xl" />
              <span className="text-xl">الصفحة الرئيسية</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/booking-management"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCog className="text-2xl" />
              <span className="text-xl">التحكم في الحجز</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/booking-confirmation"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCheckCircle className="text-2xl" />
              <span className="text-xl">تأكيد الرحلات</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/baggage-confirmation"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaSuitcaseRolling className="text-2xl" />
              <span className="text-xl">تأكيد توصيل الشنط</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/print-bookings"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <AiOutlinePrinter className="text-2xl" />
              <span className="text-xl">طباعة الرحلات</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/completed-trips"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <MdFlightLand className="text-2xl" />
              <span className="text-xl">تأكيد الوصول</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/all-booking"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <MdOutlineTravelExplore className="text-2xl" />
              <span className="text-xl">كل الرحلات</span>
            </a>
          </li>
          <li>
            <a
              href="/dashboard/students"
              className="flex items-center space-x-4 gap-3 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <PiStudentFill className="text-2xl" />
              <span className="text-xl">الطلاب</span>
            </a>
          </li>
          {/* <li>
            <a
              href="#"
              className="flex items-center space-x-4 hover:bg-red-600 p-2 rounded-md transition-colors duration-200"
            >
              <FaCog className="text-2xl" />
              <span className="text-xl">الإعدادات</span>
            </a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
