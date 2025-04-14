import Flat from "@/models/Flat";
import Message from "@/models/Message";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const flats = await Flat.find({}).populate("owner").populate("location");
    const users = await User.countDocuments({});
    const buyers = await User.countDocuments({ role: "buyer" });
    const owners = await User.countDocuments({ role: "owner" });
    const listings = await Flat.countDocuments({});
    const feedback = await Message.countDocuments({});
    return NextResponse.json(
      { flats, users, buyers, owners, listings, feedback },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
