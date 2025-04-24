import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { userId, ownerId } = await req.json();
    let chat = await Chat.findOne({
      participants: { $all: [userId, ownerId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, ownerId],
        messages: [],
      });
      await chat.save();
    }

    return NextResponse.json({ chat, message: chat.messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
