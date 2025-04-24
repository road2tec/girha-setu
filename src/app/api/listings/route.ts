import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import Flat from "@/models/Flat";
import Notification from "@/models/Notification";
import User from "@/models/User";
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
    // Create new Notification and add to all user
    const notification = new Notification({
      property: newListing._id,
      message: "New Listing",
      type: "New Listing",
    });
    await notification.save();
    const users = await User.find({ role: "buyer" });
    users.forEach(async (u) => {
      u.notifications.push(notification._id);
      await u.save();
    });
    return NextResponse.json({ message: "Listing added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
