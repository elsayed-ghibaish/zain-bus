"use client";
import React, { ReactNode } from "react";
import Sidebar from "./Components/layout/dashboard/Sidebar";
import { usePathname } from "next/navigation";
import GetBreadcrumb from "./Components/layout/dashboard/GetBreadcrumb";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="">
      {pathname.startsWith("/dashboard") && (
        <div className="lg:flex md:flex print:bg-white bg-slate-200">
          {pathname.startsWith("/dashboard") && <Sidebar />}
          <div className="lg:container md:container m-5">
            <GetBreadcrumb />
            {children}
          </div>
        </div>
      )}
       {!pathname.startsWith("/dashboard") && children}
    </div>
  );
};

export default ThemeProvider;
