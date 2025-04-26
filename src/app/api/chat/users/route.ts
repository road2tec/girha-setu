import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Chat from "@/models/Chat";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as any;
  if (!data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
  }
  try {
    const chats = await Chat.find({ participants: data._id }).populate(
      "participants"
    );

    const users = chats.map((chat) => {
      return chat.participants.find((user : any) => user._id.toString() !== data._id);
    });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
