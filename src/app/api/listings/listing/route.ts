import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");
  try {
    const flats = await Flat.find({ type })
      .populate("location")
      .populate("owner");
    return NextResponse.json({ flats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flats:", error);
    return NextResponse.json(
      { error: "Error fetching flats" },
      { status: 500 }
    );
  }
}
