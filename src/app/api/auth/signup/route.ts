import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import User from "@/models/User";
import brcyrpt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { user } = await req.json();
  console.log(user);
  // find exisiting user in database
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }
  // create new user
  const encryptedPassword = await brcyrpt.hash(user.password, 10);
  try {
    const address = new Address({
      ...user.address,
    });
    await address.save();
    const newUser = new User({
      ...user,
      password: encryptedPassword,
      address: address._id,
    });
    await newUser.save();
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
