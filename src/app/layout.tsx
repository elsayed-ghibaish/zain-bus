import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import { AuthProvider } from "./Providers";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import Sidebar from "./Components/layout/dashboard/Sidebar";
import ThemeProvider from "./ThemeProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "الزين للرحلات و النقل السياحى",
  description: "مرحبا بكم فى الموقع الرسمى لشركة الزين للرحلات والنقل السياحي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <StoreProvider>
            <ToastContainer position="bottom-right" />
            <Header />
            <ThemeProvider>{children}</ThemeProvider>
            <Footer />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
