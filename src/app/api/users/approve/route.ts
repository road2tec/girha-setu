import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { updatedUser } = await req.json();
  try {
    await User.findByIdAndUpdate(updatedUser._id, updatedUser);
    return NextResponse.json({ message: "User approved successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error approving user" },
      { status: 500 }
    );
  }
}
