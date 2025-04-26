import dbConfig from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const data = jwt.verify(token!, process.env.JWT_SECRET!) as any;
  if (!token) {
    return NextResponse.json({ message: "Unautorized" }, { status: 401 });
  }
  const flats = await Flat.find({ owner: data._id })
    .populate("owner")
    .populate("location");
  return NextResponse.json({ flats });
}
