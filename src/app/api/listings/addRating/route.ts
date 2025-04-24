import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { rating, property, user } = await req.json();
  if (!rating || !property || !user) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const newRating = {
      user: user._id,
      rating: rating.rating,
      comment: rating.comment,
    };
    const newProperty = await Flat.findById(property._id);
    if (!newProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }
    newProperty.rating.push(newRating);
    await newProperty.save();
    return NextResponse.json(
      { message: "Rating added successfully", newProperty },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding rating:", error);
    return NextResponse.json(
      { message: "Error adding rating" },
      { status: 500 }
    );
  }
}
