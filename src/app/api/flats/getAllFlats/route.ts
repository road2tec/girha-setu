import dbConfig from "@/middlewares/db.config";
import Flat from "@/models/Flat";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const flats = await Flat.find();
  return NextResponse.json(flats);
}
