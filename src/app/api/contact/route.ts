import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await Message.find({});
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
