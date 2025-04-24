import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json(
      { message: "Prompt is required" },
      { status: 500 }
    );
  }
  try {
    const flats = await Flat.find(
      { $text: { $search: prompt } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("location")
      .exec();

    return NextResponse.json({ flats }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong!!" });
  }
}
