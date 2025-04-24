import connectDB from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { propertyId, ratingId, rating, comment } = await req.json();

    // Find the property and update the specific rating
    const property = await Flat.findOneAndUpdate(
      { 
        _id: propertyId,
        "rating._id": ratingId 
      },
      { 
        $set: { 
          "rating.$.rating": rating,
          "rating.$.comment": comment,
          "rating.$.updatedAt": new Date()
        } 
      },
      { new: true }
    );

    if (!property) {
      return NextResponse.json(
        { message: "Rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Rating updated successfully", property },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { message: "Error updating rating" },
      { status: 500 }
    );
  }
} 