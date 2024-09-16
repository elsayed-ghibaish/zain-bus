import React from "react";

export default function SkeletonLoaders() {
  return (
    <section>
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8">
        <div className="animate-pulse">
          {/* Skeleton for form fields */}
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Skeleton for "نقطة التحرك / العودة" */}
            <div className="sm:col-span-3">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Skeleton for "نوع الرحلة" */}
            <div className="sm:col-span-3">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Skeleton for "تاريخ الرحلة" */}
            <div className="sm:col-span-3">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Skeleton for "عدد المقاعد" */}
            <div className="sm:col-span-3">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Skeleton for "العودة" (في حال كانت الرحلة عودة) */}
            <div className="sm:col-span-3">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Skeleton for payment info */}
          <div className="h-5 bg-gray-300 rounded mt-5"></div>

          {/* Skeleton for trip cost */}
          <div className="h-5 bg-gray-300 rounded mt-3"></div>

          {/* Skeleton for submit button */}
          <div className="h-10 bg-gray-300 rounded mt-5 w-full"></div>
        </div>
      </div>
    </section>
  );
}
