import dbConfig from "@/middlewares/db.config";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
export async function PUT(req: NextRequest) {
  try {
    const { chatId, senderId, content } = await req.json();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    chat.messages.push({ sender: senderId, content });
    await chat.save();

    return NextResponse.json({ message: chat.messages }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
