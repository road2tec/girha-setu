import Flat from "@/models/Flat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { listingId, user } = await req.json();
  const listing = await Flat.findOne({ _id: listingId });
  const existingUser = await User.findOne({ _id: user._id });
  if (!listing || !existingUser) {
    return NextResponse.json(
      { message: "Invalid listing or user" },
      { status: 400 }
    );
  }
  if (existingUser.favorites.includes(listingId)) {
    return NextResponse.json(
      { message: "Listing already in wishlist" },
      { status: 400 }
    );
  }
  try {
    existingUser.favorites.push(listingId);
    await existingUser.save();
    return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error adding to wishlist" },
      { status: 500 }
    );
  }
}
