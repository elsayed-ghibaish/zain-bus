"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <nav aria-label="Breadcrumb" className={containerClasses}>
      <ol
        className={`flex overflow-hidden rounded-lg border border-gray-200 text-gray-600 print:hidden ${listClasses}`}
      >
        <li className="flex items-center">
          <a href="/">
            <div
              className={`flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900 ${listClasses}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {homeElement}
            </div>
          </a>
        </li>

        {pathNames.map((segment, index) => {
          const fullPath = `/${pathNames.slice(0, index + 1).join("/")}`;
          const itemClasses =
            paths === fullPath
              ? `${listClasses} ${activeClasses}`
              : listClasses;
          const itemLink = capitalizeLinks
            ? segment.charAt(0).toUpperCase() + segment.slice(1)
            : segment;
          return (
            <React.Fragment key={index}>
              <li
                className={`${itemClasses} ${
                  index === 0 ? "relative flex items-center" : ""
                } `}
              >
                <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>
                <a href={fullPath}>
                  <div
                    className={`flex h-10 items-center ${
                      index !== pathNames.length - 1 ? "bg-white" : ""
                    } pe-4 ps-8 text-xs font-medium transition hover:text-gray-900 ${listClasses}`}
                  >
                    {itemLink}
                  </div>
                </a>
              </li>
              {index !== pathNames.length - 1 && separator}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default NextBreadcrumb;
