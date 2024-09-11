import React from "react";
import Image from "next/image";
import HeroHomePage from "./Components/Hero";
import { TbBus } from "react-icons/tb";
import { FaDisease, FaPlane, FaSuitcase } from "react-icons/fa";

export default function HomeUi() {
  return (
    <section className="bg-white px-5 py-20">
      <div className="isolate bg-white px-6  lg:px-8 mb-6">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50% - 40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <HeroHomePage />

        <section>
          <div className="mx-auto px-4 sm:px-12 rounded-md xl:px-20 mt-20 bg-gradient-to-r from-white to-rose-100 p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="md:7/12 lg:w-6/12">
                <h2 className="text-3xl font-bold xl:leading-tight text-red-600 md:text-4xl xl:text-5xl">
                  سيارتنا الأشهر في جميع أنحاء العالم، والمفضلة محليًا
                </h2>
                <p className="mt-8 text-gray-600">
                  مع تويوتا Hiace، تميز بتصميم رحب ومزايا ممتعة، استمتع برحلة
                  مريحة وسلسة الي وجهتك المفضلة مع افضل سيارة رحلات آمنة ومريحة.
                </p>
                {/* <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Nobis minus voluptatibus pariatur dignissimos libero quaerat
                  iure expedita at? Asperiores nemo possimus nesciunt dicta
                  veniam aspernatur quam mollitia.
                </p> */}
              </div>
              <div className="md:5/12 lg:w-6/12">
                <Image
                  src="/hiace-2024.png"
                  alt="tailus stats and login components"
                  loading="lazy"
                  width={1779}
                  height={1592}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="my-5 bg-red-50 rounded-md py-10">
          <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 md:text-4xl xl:text-5xl">
                خدماتنا
              </h2>
              <p className="mx-auto mt-6 text-gray-700 md:w-3/4 lg:w-3/5">
                لدينا مجموعة متنوعة من خدمات النقل والسياحة
              </p>
            </div>
            <div className="mt-12 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
              <div className="group relative bg-white transition-shadow hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                <div className="relative space-y-8 p-8 py-12 text-center">
                  <TbBus className="text-6xl text-red-600 m-auto" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-700 transition group-hover:text-red-600">
                      نقل طلاب الجامعات
                    </h3>
                    <p className="text-gray-600">
                      توصيل طلاب الجامعات بسرعة وأمان من وإلى جامعاتهم
                    </p>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white transition-shadow hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                <div className="relative space-y-8 p-8 py-12 text-center">
                  <FaPlane className="text-6xl text-red-600 m-auto" />

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-700 transition group-hover:text-red-600">
                      توصيل المطارات
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      خدمة توصيل المسافرين من وإلى المطارات بسرعة وراحة
                    </p>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white transition-shadow hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                <div className="relative space-y-8 p-8 py-12 text-center">
                  <FaDisease className="text-6xl text-red-600 m-auto" />

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-700 transition group-hover:text-red-600">
                      الرحلات الصيفية
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      توصيل رحلات صيفية ممتعة وآمنة للجميع
                    </p>
                  </div>
                </div>
              </div>
              <div className="group relative bg-gray-50 transition-shadow hover:z-[1] hover:shadow-2xl lg:hidden">
                <div className="relative space-y-8 p-8 py-12  text-center transition duration-300 group-hover:bg-white">
                  <FaSuitcase className="text-6xl text-red-600 m-auto" />

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-700 transition group-hover:text-primary">
                      توصيل الشنط
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      خدمة توصيل الشنط لطلبة الجامعات بسهولة وأمان
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center pt-10">
            <h2 className="text-3xl font-bold text-gray-800md:text-4xl xl:text-5xl ">
              ادفع بالطريقة اللى تناسبك
            </h2>
            <p className="mx-auto mt-6 text-gray-700 md:w-3/4 lg:w-3/5">
              اختر طريقة الدفع المناسب ليك واحجز رحلتك الآن
            </p>
          </div>
          <div className="border-b border-b-gray-200 my-5"></div>
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <Image
                src="/Meeza.png"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width={100}
                height={100}
              />
            </div>
            <div className="p-4 flex grayscale transition duration-200 hover:grayscale-0">
              <Image
                src="/orange_cash.png"
                className="h-12 w-auto m-auto"
                loading="lazy"
                alt="client logo"
                width={100}
                height={100}
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <Image
                src="/vf-cash.png"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width={100}
                height={100}
              />
            </div>
            <div className="p-4 flex grayscale transition duration-200 hover:grayscale-0">
              <Image
                src="/mastercard-mobile.png"
                className="h-12 w-auto m-auto"
                loading="lazy"
                alt="client logo"
                width={100}
                height={100}
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <Image
                src="/Visa-Logo.png"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width={100}
                height={100}
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
