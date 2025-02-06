import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await User.find().populate("address");
  return NextResponse.json(user);
}
