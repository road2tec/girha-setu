import { NextResponse } from "next/server";
import connectDB from "@/middlewares/db.config";
import User from "@/models/User";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  // Check if already connected to avoid connection leaks
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  
  try {
    // Get propertyId from query params
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const userEmail = searchParams.get("email");

    if (!propertyId || !userEmail) {
      return NextResponse.json({ error: "Property ID and email are required" }, { status: 400 });
    }

    // Use updateOne for direct operation without fetching the document first
    const result = await User.updateOne(
      { email: userEmail },
      { $pull: { favorites: propertyId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made to wishlist", success: false }, { status: 200 });
    }

    return NextResponse.json({ message: "Property removed from wishlist", success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing property from wishlist:", error);
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
} 