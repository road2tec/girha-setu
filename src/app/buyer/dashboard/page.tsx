"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { IconHeart, IconHome, IconMapPin, IconUser } from "@tabler/icons-react";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";

interface Purchase {
  user: User;
  property: Flat;
  startDate: Date;
  endDate: Date;
  totalAmount: Number;
  createdAt: Date;
}

const BuyersDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchPurchases();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist/getWishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`/api/bookings/getBookings`);
      setPurchases(response.data.bookings);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 uppercase text-center">
        Hello, {user?.name}
      </h1>

      {/* Wishlist Section */}
      <div className="bg-base-300 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2 uppercase mb-8">
          <IconHeart size={20} /> Wishlist
        </h2>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full items-center">
            {wishlist.map((listing: Flat) => (
              <Link href={`property?id=${listing._id}`} key={listing._id}>
                <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden relative">
                  <figure>
                    <img
                      src={listing.mainImage || "/placeholder.png"}
                      alt={listing.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{listing.title}</h2>
                    <p className="text-base-content/50">
                      {listing.location?.city}, {listing.location?.state}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ₹ {listing.price.toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="btn btn-sm btn-primary flex items-center gap-1">
                        <IconMapPin size={16} /> View on Map
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center mx-auto">
            <img
              src="../not-found.svg"
              alt="No Listings"
              className="items-center h-[calc(57vh)]"
            />
            <p className="text-3xl font-semibold uppercase text-base-content">
              No properties in your wishlist.
            </p>
          </div>
        )}
      </div>

      <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2 uppercase mb-8">
          <IconHome size={20} /> Booking History
        </h2>
        <div className="overflow-x-auto mt-6 bg-base-300">
          <table className="table table-zebra">
            <thead className="bg-base-100 text-base">
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
              {purchases.length > 0 ? (
                purchases.map((booking, index) => (
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
      </div>
    </>
  );
};

export default BuyersDashboard;
