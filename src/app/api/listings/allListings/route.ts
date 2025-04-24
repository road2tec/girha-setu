import dbConfig from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const flats = await Flat.find().populate("owner").populate("location");
  return NextResponse.json({ flats });
}
