import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }
  try {
    const flat = await Flat.findById(id).populate("location");
    return NextResponse.json({ flat }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error deleting Flat" },
      { status: 500 }
    );
  }
}
