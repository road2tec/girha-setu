import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { listing, user } = await req.json();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }
  try {
    const { address } = listing;
    const newAddress = new Address({ ...address });
    await newAddress.save();
    const newListing = new Flat({
      ...listing,
      location: newAddress._id,
      owner: user._id,
    });
    await newListing.save();
    return NextResponse.json({ message: "Listing added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
