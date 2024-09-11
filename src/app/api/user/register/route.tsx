import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone_number,
      guardian_phone,
      address,
      area,
      start_point,
      university,
      faculty,
      academic_year,
      university_accommodation,
    } = await req.json();

    // استخدام axios لإرسال الطلب لتسجيل المستخدم في Strapi
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    await axios.post(`${STRAPI_URL}/auth/local/register`, {
      username,
      email,
      password,
      first_name,
      last_name,
      phone_number,
      guardian_phone,
      address,
      area,
      start_point,
      university,
      faculty,
      academic_year,
      university_accommodation,
    });

    return NextResponse.json(
      { message: "المستخدم مسجل من قبل" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل المستخدم" },
      { status: 500 }
    );
  }
}
