import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { listing } = await req.json();
  if (!listing) {
    return NextResponse.json({ message: "Missing listing" }, { status: 400 });
  }
  try {
    const updatedListing = await Flat.findByIdAndUpdate(listing._id, listing);
    if (!updatedListing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }
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
