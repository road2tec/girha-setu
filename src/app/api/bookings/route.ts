import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { message: "User ID Is Required" },
      { status: 400 }
    );
  }
  try {
    const bookings = await Booking.find({ user: userId })
      .populate("property")
      .populate("user");
    return NextResponse.json(
      { message: "Bookings Fetched", bookings },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
