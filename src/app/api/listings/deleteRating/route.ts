import connectDB from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { propertyId, ratingId } = await req.json();

    // Find the property and remove the specific rating
    const property = await Flat.findOneAndUpdate(
      { _id: propertyId },
      { $pull: { rating: { _id: ratingId } } },
      { new: true }
    );

    if (!property) {
      return NextResponse.json(
        { message: "Property or rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Rating deleted successfully", property },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { message: "Error deleting rating" },
      { status: 500 }
    );
  }
} 