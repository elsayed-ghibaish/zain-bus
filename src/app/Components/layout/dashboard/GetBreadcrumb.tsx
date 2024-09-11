import React from "react";
import NextBreadcrumb from "./NextBreadcrumb";

export default function GetBreadcrumb() {
  return (
    <div className="breadcrumb mb-5">
    <NextBreadcrumb
      homeElement={"Home"}
      separator={""}
      activeClasses="relative bg-gray-100 rounded-l-lg "
      containerClasses=""
      listClasses=""
      capitalizeLinks
    />
    </div>
  );
}
