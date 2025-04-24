import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const newContact = new Message({
      ...formData,
    });
    await newContact.save();
    return NextResponse.json(
      { message: "Contact added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
