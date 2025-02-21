import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface Data {
  _id: string;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as Data;
  if (!data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findOne({ _id: data._id })
    .populate("favorites")
    .populate({
      path: "favorites",
      populate: {
        path: "location",
        model: "Address",
      },
    });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ wishlist: user.favorites }, { status: 200 });
}
