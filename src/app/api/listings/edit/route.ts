import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { listing } = await req.json();
  if (!listing) {
    return NextResponse.json({ message: "Missing listing" }, { status: 400 });
  }
  try {
    // Update listing
    const updatedListing = await Flat.findByIdAndUpdate(listing.id, listing);
    return NextResponse.json(
      { message: "Listing updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating listing" },
      { status: 500 }
    );
  }
}
