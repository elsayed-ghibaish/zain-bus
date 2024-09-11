import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const {
      order_number,
      first_name,
      last_name,
      phone,
      email,
      area,
      start_point,
      destination,
      trip_type,
      date,
      start_time,
      end_time,
      seats,
      payment_type,
      trip_cost,
      payment_status,
      trip_status,
      user_id,
    } = await req.json();

    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is missing." },
        { status: 401 }
      );
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL_API;
    await axios.post(
      `${STRAPI_URL}/bookings`,
      {
        data: {
          order_number,
          first_name,
          last_name,
          phone,
          email,
          area,
          start_point,
          destination,
          trip_type,
          date,
          start_time,
          end_time,
          seats,
          payment_type,
          trip_cost,
          payment_status,
          trip_status,
          user_id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(
      { message: "bookings registered." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the bookings." },
      { status: 500 }
    );
  }
}
