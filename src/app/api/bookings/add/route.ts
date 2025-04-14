import dbConfig from "@/middlewares/db.config";
import Booking from "@/models/Booking";
import Flat from "@/models/Flat";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

dbConfig();
export async function POST(req: NextRequest) {
  const { userId, flatId, startDate, endDate, totalAmount } = await req.json();
  if (!userId || !flatId || !startDate || !endDate || !totalAmount) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const existingBooking = await Booking.findOne({
      property: flatId,
    }).sort({ createdAt: -1 });
    if (existingBooking && existingBooking.endDate >= new Date(startDate)) {
      return NextResponse.json(
        {
          message:
            "Booking conflicts with an existing booking will be available from " +
            existingBooking.endDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
        },
        { status: 409 }
      );
    }
    const amount = totalAmount * 100;
    const currency = "INR";
    var options = {
      amount: amount,
      currency: currency,
      receipt: "rcp1",
    };
    const order = await razorpay.orders.create(options);
    const booking = await Booking.create({
      user: userId,
      property: flatId,
      startDate,
      endDate,
      paymentStatus: "completed",
      totalAmount,
    });
    const user = await User.findById(userId);
    const flat = await Flat.findById(flatId);
    const newNotifiation = new Notification({
      property: flatId,
      message: `New booking for your property ${flat.title} from ${new Date(
        startDate
      ).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} to ${new Date(endDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} by ${user?.name}`,
      type: "Booking Update",
    });
    await newNotifiation.save();
    const owner = await User.findById(flat.owner);
    if (owner) {
      owner.notifications.push(newNotifiation._id);
      await owner.save();
    }
    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
        orderId: order.id,
        amount: amount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
