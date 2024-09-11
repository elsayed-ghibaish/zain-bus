import React from "react";

export default function BookingGusetSection() {
  return (
    <section>
      <div className="mx-auto max-w-3xl my-10 p-5 lg:p-0">
        <div className="animate-pulse">
          {/* Skeleton for the title */}
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mt-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mt-2"></div>

          {/* Skeleton for form fields */}
          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="mt-2 h-10 bg-gray-300 rounded"></div>
              </div>

              <div className="sm:col-span-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="mt-2 h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="mt-2 h-10 bg-gray-300 rounded"></div>
              </div>

              <div className="sm:col-span-3">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="mt-2 h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Skeleton for the submit button */}
            <div className="h-10 bg-gray-300 rounded w-full mt-5"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
