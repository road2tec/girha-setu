import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(data._id).populate({
      path: "notifications",
      populate: {
        path: "property",
        model: "Flat",
        populate: {
          path: "location",
          model: "Address",
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ notifications: user.notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Error fetching notifications" },
      { status: 500 }
    );
  }
}
