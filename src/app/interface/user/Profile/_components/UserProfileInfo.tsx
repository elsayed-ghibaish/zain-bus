import { format } from "date-fns/format";
import { ar } from "date-fns/locale/ar";
import { parseISO } from "date-fns/parseISO";
import React, { useState } from "react";
import { AiOutlineEnvironment } from "react-icons/ai";
import { MdAddAPhoto, MdOutlineDateRange } from "react-icons/md";
import UserProfileInfoSection from "./UserProfileInfoSection";
import { LuSendHorizonal } from "react-icons/lu";
import UploadedImage from "./uploadedImage";
import { FaCheckCircle, FaCity } from "react-icons/fa";

export default function UserProfileInfo({ user, loading }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const firstName = user?.username?.split(" ")[0] || "";
  const lastName = user?.lastname?.split(" ").pop() || "";

  const Popup = ({ isOpen, onClose, bookingId }: any) => {
    return (
      <>
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-xl font-bold mb-4">تحديث الصورة الشخصية</div>

              <UploadedImage id={user.id} />

              <div className="m-auto float-left">
                <button
                  onClick={onClose}
                  className="mt-4 px-4 ml-5 py-2 bg-white border border-gray-200 text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  إغلاق
                </button>
                {/* <button
                  onClick={() => CancelBooking(bookingId)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  موافق
                </button> */}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Popup isOpen={isOpen} onClose={togglePopup} />
      <div>
        {!loading ? (
          <div className=" ">
            <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 mb-4 max-w-7xl m-auto mt-10">
              {/* <div className="w-100 h-[150px] object-cover bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t"></div> */}
              <div className="sm:text-right flex flex-col sm:flex-row text-sm-start text-center">
                <div className="flex-shrink-0 mt-n2 sm:mx-0 p-2 mx-auto">
                  <img
                    src={`${
                      user?.photo?.formats?.small.url || "/avatar.webp"
                    }`}
                    alt={user.username}
                    className="block h-[120px] ms-0 sm:ms-6 max-w-lg rounded border"
                  />
                </div>
                <div className="flex-grow mt-3 sm:mt-12">
                  <div className="flex md:items-end sm:items-start items-center md:justify-between justify-start mx-4 md:flex-row flex-col gap-4">
                    <div className="">
                      <h4 className="font-bold text-2xl mb-2">
                        مرحبا,{" "}
                        <span className="text-red-500">{user.username}</span>
                      </h4>
                      <ul className="list-inline mb-0 flex items-center flex-wrap sm:justify-start justify-center gap-2">
                        <li className="list-inline-item text-sm flex items-center">
                          <FaCheckCircle
                            className={
                              user.confirmed ? "text-green-500" : "text-red-500"
                            }
                          />
                          <span className="font-medium mx-1 text-heading">
                            الحالة:
                          </span>
                          <span>
                            {user.confirmed ? (
                              <span className="list-disc text-green-500">
                                {" "}
                                نشط
                              </span>
                            ) : (
                              <span className="list-disc text-red-500">
                                {" "}
                                موقوف
                              </span>
                            )}
                          </span>
                        </li>
                        <li className="list-inline-item text-sm flex gap-1">
                          <MdOutlineDateRange className="mt-1 text-red-600" />{" "}
                          {user.createdAt &&
                            `${`انضم فى `}
                      ${format(parseISO(user.createdAt), "MMMM yyyy", {
                        locale: ar,
                      })}`}
                        </li>
                        <li className="list-inline-item text-sm flex gap-1">
                          <FaCity className="text-purple-500 mt-1" />
                          {user.area}
                        </li>
                      </ul>
                    </div>
                    {user?.confirmed === true && (
                      <div className="flex">
                        <button
                          onClick={() => togglePopup()}
                          className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-500 waves-effect waves-light"
                        >
                          <i className="ti ti-check me-1" />
                          تحديث الصورة
                          <MdAddAPhoto className="inline-block mr-2 mb-1" />
                        </button>

                        <a
                          href="/profile/booking"
                          className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-500 waves-effect waves-light"
                        >
                          <i className="ti ti-check me-1" />
                          حجز رحلة
                          <LuSendHorizonal className="inline-block mr-2 mb-1 -rotate-45" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <UserProfileInfoSection />
        )}
      </div>
    </>
  );
}
