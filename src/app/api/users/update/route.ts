import Address from "@/models/Address";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const updatedUser = await User.findByIdAndUpdate(
      formData._id,
      { ...formData },
      { new: true }
    );
    const address = await Address.findByIdAndUpdate(
      formData.address,
      { ...formData.address },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("User updated successfully", updatedUser);
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
