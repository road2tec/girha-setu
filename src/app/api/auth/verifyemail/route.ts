import { NextRequest, NextResponse } from "next/server";
import verifyEmail from "@/middlewares/verifyemail";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  if (!email || !email.includes("@gmail.com")) {
    return NextResponse.json({ message: "Email Not Found" }, { status: 404 });
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(token);
  const response = await verifyEmail(email, token);
  if (response) {
    return NextResponse.json({ token, email }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }
}
