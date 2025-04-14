"use client";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  user: User;
  property: Flat;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentStatus: string;
  createdAt: Date;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch("/api/bookings/getBookingsForOwner");
      const data = await response.json();
      setBookings(data.bookings);
    };
    fetchBookings();
  }, []);
  return (
    <>
      <h1 className="text-4xl uppercase font-bold text-center mb-6">
        My Bookings
      </h1>
      <div className="overflow-x-auto mt-6 bg-base-300">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Property Name</th>
              <th>Address</th>
              <th>From</th>
              <th>To</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Rented On</th>
              <th>Property</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.property.title}</td>
                  <td>{booking.property.location.address}</td>
                  <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td>₹ {booking.totalAmount}</td>
                  <td className="uppercase">{booking.paymentStatus}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      href={`property?id=${booking.property._id}`}
                      className="btn btn-primary"
                    >
                      View Property
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyBookings;
