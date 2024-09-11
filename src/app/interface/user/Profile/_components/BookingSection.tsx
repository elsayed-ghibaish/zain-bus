import React from "react";

export default function BookingSection() {
  return (
    <div className="flex md:contents">
      <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
        <div className="h-full w-6 flex items-center justify-center">
          <div className="h-full w-1 bg-gray-400 pointer-events-none animate-pulse" />
        </div>
        <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-400 shadow text-center animate-pulse">
          <i className="fas fa-check-circle text-white animate-pulse" />
        </div>
      </div>
      <div className="bg-gray-400 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full animate-pulse">
        <h3 className="font-semibold text-lg mb-1 bg-gray-600 w-60 h-8 animate-pulse"></h3>
        <p className="leading-tight text-justify bg-gray-500 w-52 h-3  animate-pulse"></p>
        <p className="leading-tight text-justify bg-gray-500 w-28 h-4 float-left animate-pulse"></p>
      </div>
    </div>
  );
}
