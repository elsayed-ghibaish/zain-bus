import React from "react";

export default function UserProfileInfoSection() {
  return (
    <div className=" ">
      <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 mb-4 max-w-7xl m-auto mt-10">
        {/* <div className="w-100 h-[150px] object-cover bg-gray-500 animate-pulse  ">
          <div className="bg-gray-200 animate-pulse rounded-t"></div>
        </div> */}
        <div className="sm:text-right flex flex-col sm:flex-row text-sm-start text-center">
          <div className="flex-shrink-0 mt-n2 sm:mx-0 p-2 mx-auto">
            <div className="block h-[120px] w-40 bg-gray-400 ms-0 sm:ms-6 max-w-lg rounded-md animate-pulse" />
          </div>
          <div className="flex-grow mt-3 sm:mt-12">
            <div className="flex md:items-end sm:items-start items-center md:justify-between justify-start mx-4 md:flex-row flex-col gap-4">
              <div className="">
                <h4 className="font-bold text-xl mr-2 w-72 h-5 rounded-md mb-1 bg-gray-400 animate-pulse">
                  ,{" "}
                </h4>
                <ul className="list-inline mb-0 flex items-center flex-wrap sm:justify-start justify-center gap-2">
                  <li className="list-inline-item flex gap-1 w-96 h-5 rounded-md bg-gray-500 animate-pulse">
                    <i className="ti ti-color-swatch" />{" "}
                  </li>
                  <li className="list-inline-item flex gap-1"></li>
                  <li className="list-inline-item flex gap-1"></li>
                </ul>
              </div>
              <a
                href="/profile/booking"
                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline w-20 h-7 bg-gray-500 animate-pulse text-white hover:bg-blue-500 waves-effect waves-light"
              >
                <i className="ti ti-check me-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
