import dbConfig from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }
  try {
    await Flat.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error deleting Flat" },
      { status: 500 }
    );
  }
}
