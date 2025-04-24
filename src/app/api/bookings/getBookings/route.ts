import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string);
    const bookings = await Booking.find({ user: data._id })
      .populate("property")
      .populate("user")
      .populate({
        path: "property",
        populate: {
          path: "location",
        },
      });
    return NextResponse.json(
      { message: "Bookings Fetched", bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
