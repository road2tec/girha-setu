import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Missing id parameter" },
      { status: 400 }
    );
  }
  // delete notification by id
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    if (!data) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(data._id);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }
    user.notifications = user.notifications.filter((n) => n.toString() !== id);
    await user.save();
    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.log("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Error deleting notification" },
      { status: 500 }
    );
  }
}
