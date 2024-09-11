import React from "react";
import CartPay from "../interface/cart/CartPay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الزين للرحلات - الدفع",
  description: "الصفحة الخاص باختيار طريقة دفع الرحلات",
};
export default function Cart() {
  return <CartPay />;
}
