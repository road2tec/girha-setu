import dbConfig from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { location, propertyType, amenities } = await req.json();
  if (!location || !propertyType || !amenities) {
    return NextResponse.json(
      { message: "Please provide all the required fields" },
      { status: 400 }
    );
  }
  try {
    const lisitings = await Flat.find({
      type: propertyType,
    })
      .populate("location")
      .populate("owner");
    var properties = [];
    for (const listing of lisitings) {
      if (
        listing.location.city === location &&
        listing.amenities.includes(amenities)
      ) {
        properties.push(listing);
      }
    }
    console.log(properties);
    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
