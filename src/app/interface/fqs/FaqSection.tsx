"use client";
import React, { useState } from "react";

const FaqSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index: any) => {
    if (activeQuestion === index) {
      setActiveQuestion(null); // إغلاق السؤال إذا كان مفتوحًا بالفعل
    } else {
      setActiveQuestion(index); // فتح السؤال الجديد
    }
  };

  const questions = [
    {
      question: "ماذا يحدث إذا لم أدفع الرسوم المطلوبة بعد الإلغاء؟",
      answer:
        "إذا لم يتم دفع الرسوم المطلوبة، فلن يتم قبول أي حجوزات مستقبلية حتى يتم سداد كامل المبالغ المستحقة.",
    },
    {
      question: "هل يوجد استثناءات لإلغاء الحجز بدون دفع رسوم؟",
      answer: "نعم، يُسمح بإلغاء الحجز دون دفع رسوم في الظروف القهرية فقط.",
    },
    // {
    //   question: "ماذا يجب أن أفعل إذا أردت إلغاء الحجز بعد الساعة 6 مساءً؟",
    //   answer:
    //     "في حال الإلغاء بعد الساعة 6 مساءً، يتعين عليك دفع مبلغ 100 جنيه مصري عبر فودافون كاش إلى الرقم 01040015600 فورًا.",
    // },
    {
      question: "ما هي الشروط المتعلقة بحجز الشنط ؟ ",
      answer:
        "يسمح بشنطة سفر متوسطة وشنطة كتف صغيرة مجانًا مع المسافر.",
    },
    {
      question: "كيف يمكنني إرسال الشنط للطلبة؟",
      answer:
        "يجب حجز إرسال الشنط عبر الموقع الرسمي فقط، لن يتم قبول أي شنط بدون حجز مسبق.",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-indigo-100 to-red-100 py-20">
      <div className="container max-w-4xl px-6 py-10 mx-auto bg-white ">
        <h1 className="text-2xl font-semibold text-center text-gray-800 lg:text-3xl">
          اسئلة شائعة
        </h1>
        <div className="mt-12 space-y-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`border-2 border-gray-100 rounded-lg ${
                activeQuestion === index ? "border-red-600" : ""
              }`}
            >
              <button
                className="flex items-center justify-between w-full p-8 focus:outline-none"
                onClick={() => toggleQuestion(index)}
              >
                <h1 className="font-semibold text-gray-700">{q.question}</h1>
                <span
                  className={`text-white rounded-full ${
                    activeQuestion === index ? "bg-red-600" : "bg-red-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 transform transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {activeQuestion === index ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    )}
                  </svg>
                </span>
              </button>
              {activeQuestion === index && (
                <div>
                  <hr className="border-gray-200" />
                  <p className="p-8 text-sm text-gray-500">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
