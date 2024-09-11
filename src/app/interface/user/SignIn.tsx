"use client";
import React from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [identifier, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/profile");
    }
  }, [status, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonData = Object.fromEntries(formData);
    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("البريد الالكتروني او كلمة المرور غير صحيحة");
        return;
      }
      const userRes = await fetch("/api/auth/session"); // Fetch session info from NextAuth
      const session = await userRes.json();
      if (session?.user?.role_sign === "administrator") {
        router.replace("/dashboard");
      } else if (session?.user?.role_sign === "student") {
        router.replace("/profile");
      } else {
        router.replace("/");
      }
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section>
      <div className="py-16">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div className="w-full p-8 lg:w-1/2">
            <a href="/">
              <Image
                src="/logo.svg"
                className="h-16 flex items-center m-auto"
                alt="Zain Travel"
                width={933}
                height={300}
              />
            </a>
            <p className="text-xl text-gray-600 text-center mt-5">
              الزين للرحلات و النقل السياحي
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/4 lg:w-1/3" />
              تسجيل الدخول
              <span className="border-b w-1/4 lg:w-1/3" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="email"
                >
                  البريد الجامعى
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  type="text"
                  name="identifier"
                  id="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="password"
                  >
                    كلمة المرور
                  </label>
                  <a href="#" className="text-xs text-red-500">
                    استعادة كلمة المرور؟
                  </a>
                </div>
                <input
                  className="bg-gray-200 text-gray-700 focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full focus:outline-red-500"
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="bg-red-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-red-600"
                >
                  تسجيل الدخول
                </button>
              </div>
              {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {error}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-10 md:w-15 lg:w-1/5" />
                <p className="text-center text-sm text-gray-500">
                  ليس لديك حساب ؟{" "}
                  <a
                    href="/sign-up"
                    className="font-semibold leading-6 text-red-600 hover:text-red-500"
                  >
                    قم بالتسجيل الآن
                  </a>
                </p>
                <span className="border-b w-10 md:w-15 lg:w-1/5" />
              </div>
            </form>
          </div>
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage: 'url("Student.jpg")',
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
