import Image from "next/image";
import { format } from "date-fns/format";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { PoweredBySite } from "@/app/types/layout/basic";
export default function Footer() {
  const PoweredBy: string = PoweredBySite;
  return (
    <footer className="bg-slate-50 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-5">
          <Image
            src="/logo.svg"
            width={933}
            height={300}
            className="mx-auto h-10 w-auto"
            alt="الزين باص"
          />

          <nav className="mt-5 text-sm print:hidden" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/"
              >
                الصفحة الرئيسية
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/pages/policy"
              >
                الشروط والأحكام
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/pages/faqs"
              >
                اسئلة شائعة
              </a>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-5 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <div
              className="flex justify-center items-center space-x-4"
              dir="ltr"
            >
              <a
                href="https://www.facebook.com/zainbusegy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/zainbusegy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/+201040015600"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition duration-300"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            العلامة التجارية وجميع الحقوق محفوظة ©{" "}
            {`${format(new Date(), "yyyy")}`} | <span>برمجة وتصميم</span>
            <a
              href="https://wa.me/+201017732845"
              target="_blank"
              className="text-red-600 font-bold hover:text-red-900"
            >{` ${PoweredBy} `}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
