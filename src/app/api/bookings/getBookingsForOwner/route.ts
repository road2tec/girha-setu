import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Booking from "@/models/Booking";
import Flat from "@/models/Flat";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const flats = await Flat.find({ owner: data._id });
    var bookings;
    if (flats.length > 0) {
      const flatIds = flats.map((flat) => flat._id);
      bookings = await Booking.find({ property: { $in: flatIds } })
        .populate("property")
        .populate("user")
        .populate({
          path: "property",
          populate: {
            path: "location",
          },
        });
    } else {
      bookings = [];
    }
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
