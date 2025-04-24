import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const flats = await Flat.find({ owner: data._id! });
    const flatIds = flats.map((flat) => flat._id.toString());

    const total = flats.length;

    const bookings = await Booking.find({ property: { $in: flatIds } });
    const rented = bookings.length;

    const revenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    const views = await User.countDocuments({
      favorites: { $in: flatIds },
    });
    const viewsData = await Promise.all(
      flats.map(async (flat) => {
        const count = await User.countDocuments({ favorites: flat._id });
        return {
          name: flat.title || `Flat ${flat._id.toString().slice(-4)}`,
          views: count,
        };
      })
    );
    return NextResponse.json({
      total,
      rented,
      revenue,
      views,
      flats,
      viewsData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
