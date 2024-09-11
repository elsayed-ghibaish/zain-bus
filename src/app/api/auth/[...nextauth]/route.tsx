import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      authorize: async (credentials) => {
        const { identifier, password }: any = credentials;
        // تواصل مع Strapi للتحقق من الاعتمادات
        try {
          const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL_API;
          const response = await axios.post(
            `${STRAPI_URL}/auth/local`,
            {
              identifier,
              password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            const data = response.data;
            const user = {
              id: data.user.id,
              name: data.user.username, // افترض أن هناك حقل يسمى "name" في بيانات المستخدم
              email: data.user.email,
              image: data.jwt,
              role_sign: data.user.role_sign,
              token: data.jwt,
              // يمكنك تضمين المزيد من المعلومات هنا إذا كانت متوفرة
            };
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        } catch (error) {
          console.error("An error occurred while fetching data:", error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }: any) {
      // إضافة المتغيرات الإضافية إلى الجلسة هنا
      session.user.id = token.id;
      session.user.role_sign = token.role_sign;
      session.user.token = token.token;
      return session;
    },
    async jwt({ token, user }: any) {
      // إضافة المتغيرات الإضافية إلى الـ token هنا
      if (user) {
        token.id = user.id;
        token.role_sign = user.role_sign;
        token.token = user.token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
