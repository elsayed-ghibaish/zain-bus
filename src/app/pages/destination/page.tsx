import React from "react";

const DestinationPage = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-100 to-red-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          جامعة الجلالة
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4  ">
            <img
              src="/university-image.jpg"
              alt="صورة لجامعة الجلالة"
              className="rounded-lg"
            />
            <img
              src="/university-image_2.jpg"
              alt="صورة لجامعة الجلالة"
              className="rounded-lg mt-3"
            />
          </div>
          <div className="p-4 ">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              عن جامعة الجلالة
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              جامعة الجلالة هي جامعة مصرية أهلية جديدة من الجيل الرابع، تم
              توحيدها بموجب قرار رئيس جمهورية مصر العربية بإصدار القانون رقم 12
              لسنة 2009 بتنظيم الجامعات الخاصة والأهلية واللوائح التنفيذية. تعمل
              جامعة الجلالة منذ أكتوبر 2020، وتقدم برامج درجة البكالوريوس في
              تخصصات متعددة مثل؛ الطب وطب الأسنان والصيدلة والهندسة وعلوم الحاسب
              والعلوم الإدارية والفنون والتصميم، وأكثر من ذلك بكثير.
            </p>
            <p className="text-lg text-gray-800 leading-relaxed mt-4">
              الزين للرحلات والنقل السياحي تقدم خدمات نقل مريحة وآمنة لطلاب
              جامعة الجلالة من محافظة الشرقية إلى الجامعة يوميًا، مما يضمن
              وصولهم بأمان وفي الوقت المحدد.
            </p>
            <div className="text-center mt-6">
              <a
                href="/profile/booking"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
              >
                احجز رحلتك الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
