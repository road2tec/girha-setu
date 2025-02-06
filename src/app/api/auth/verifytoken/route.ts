import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    if (data.name === "Admin") {
      return NextResponse.json({ data, status: 200 });
    }
    const user = await User.findOne({ _id: data._id });
    return NextResponse.json({ data, user, status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
