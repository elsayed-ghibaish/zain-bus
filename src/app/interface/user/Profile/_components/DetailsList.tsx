import React from "react";
import {
  FaCheckCircle,
  FaCity,
  FaCrown,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import DetailsListSection from "./DetailsListSection";

export default function DetailsList({ user, loading }: any) {
  return (
    <main>
      {!loading ? (
        <div className="flex-auto p-6">
          <h2 className="mb-0 text-2xl font-bold">بياناتي</h2>
          <ul className="list-unstyled mb-4 mt-3">
            <li className="flex items-center mb-3">
              <FaUser className="text-blue-500" />
              <span className="font-medium mx-2 text-heading">الاسم:</span>
              <span>{`${user.first_name} ${user.last_name}`}</span>
            </li>
            <li className="flex items-center mb-3">
              <FaCheckCircle
                className={user.confirmed ? "text-green-500" : "text-red-500"}
              />
              <span className="font-medium mx-2 text-heading">الحالة:</span>
              <span>
                {user.confirmed ? (
                  <span className="list-disc text-green-500"> نشط</span>
                ) : (
                  <span className="list-disc text-red-500"> موقوف</span>
                )}
              </span>
            </li>
            {/* <li className="flex items-center mb-3">
          <FaCrown className="text-yellow-500" />
          <span className="font-medium mx-2 text-heading">الصلاحيات:</span>
          <span>{user.role?.name}</span>
        </li> */}
            <li className="flex items-center mb-3">
              <FaCity className="text-purple-500" />
              <span className="font-medium mx-2 text-heading">المدينة:</span>
              <span>{user.area}</span>
            </li>
            <li className="flex items-center mb-3">
              <GiModernCity className="text-orange-500" />
              <span className="font-medium mx-2 text-heading">
                نقطة التحرك:
              </span>
              <span>{user.start_point}</span>
            </li>
          </ul>
          <small className="mb-0 font-bold text-lg uppercase">
            بيانات الاتصال
          </small>
          <ul className="list-unstyled mb-4 mt-3">
            <li className="flex items-center mb-3">
              <FaPhone className="text-green-500" />
              <span className="font-medium mx-2 text-heading">
                رقم التليفون:
              </span>
              <span>{user.phone_number}</span>
            </li>
            <li className="flex items-center mb-3">
              <FaPhone className="text-blue-500" />
              <span className="font-medium mx-2 text-heading">
                رقم هاتف ولي الأمر:
              </span>
              <span>{user.guardian_phone}</span>
            </li>
            <li className="flex items-center mb-3">
              <MdEmail className="text-red-500" />
              <span className="font-medium mx-2 text-heading">الإيميل:</span>
              <span>{user.email}</span>
            </li>
            <li className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-orange-500" />
              <span className="font-medium mx-2 text-heading">
                عنوان السكن الجامعي:
              </span>
              <span>{user.university_accommodation}</span>
            </li>
            <li className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-purple-500" />
              <span className="font-medium mx-2 text-heading">
                العنوان الأساسي:
              </span>
              <span>{user.address}</span>
            </li>
          </ul>
        </div>
      ) : (
        <DetailsListSection />
      )}
    </main>
  );
}
