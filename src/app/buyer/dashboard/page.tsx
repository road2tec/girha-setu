"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { 
  IconHeart, 
  IconHome, 
  IconMapPin, 
  IconUser,
  IconCurrencyRupee,
  IconBuildingSkyscraper,
  IconStars
} from "@tabler/icons-react";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";

interface Purchase {
  _id: string;
  user: User;
  property: Flat;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const BuyersDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeBookings: 0,
    savedProperties: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchPurchases();
    }
  }, [user]);

  useEffect(() => {
    // Calculate dashboard stats
    if (purchases.length > 0 || wishlist.length > 0) {
      const totalSpent = purchases.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
      const activeBookings = purchases.filter(booking => 
        new Date(booking.endDate) >= new Date() && booking.paymentStatus === 'completed'
      ).length;
      
      setStats({
        totalSpent,
        activeBookings,
        savedProperties: wishlist.length,
        avgRating: 4.5 // This could be calculated from actual ratings if available
      });
    }
  }, [purchases, wishlist]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold uppercase">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <Link href="/buyer/my-account" className="btn btn-ghost btn-circle">
          <IconUser size={24} />
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-primary">
            <IconCurrencyRupee size={36} />
          </div>
          <div className="stat-title">Total Spent</div>
          <div className="stat-value text-primary">₹{stats.totalSpent.toLocaleString()}</div>
          <div className="stat-desc">On Property Bookings</div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-secondary">
            <IconBuildingSkyscraper size={36} />
          </div>
          <div className="stat-title">Active Bookings</div>
          <div className="stat-value text-secondary">{stats.activeBookings}</div>
          <div className="stat-desc">Current Rentals</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-accent">
            <IconHeart size={36} />
          </div>
          <div className="stat-title">Saved Properties</div>
          <div className="stat-value text-accent">{stats.savedProperties}</div>
          <div className="stat-desc">In Wishlist</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-info">
            <IconStars size={36} />
          </div>
          <div className="stat-title">Avg. Rating</div>
          <div className="stat-value text-info">{stats.avgRating}</div>
          <div className="stat-desc">From Property Owners</div>
        </div>
      </div>

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
          <div className="text-center py-8 flex flex-col items-center justify-center gap-4 bg-base-100 rounded-xl shadow-inner">
            <div className="w-40 h-20 relative flex items-center justify-center">
              <div className="absolute animate-ping opacity-75">
                <IconHeart size={50} className="text-primary/20" stroke={1} />
              </div>
              <IconHeart 
                size={64}
                className="text-primary/60 transform transition-all duration-300 hover:scale-110"
                stroke={1.5}
              />
            </div>
            <div className="space-y-3 max-w-sm mx-auto px-4">
              <h3 className="text-2xl font-bold text-base-content">Your Wishlist is Empty</h3>
              <p className="text-base-content/70">
                Discover your dream home! Save your favorites here for quick access.
              </p>
              <Link 
                href="/buyer/listings" 
                className="btn btn-primary gap-2 mt-2 hover:scale-105 transition-transform duration-200 inline-flex"
              >
                <IconHome size={18} />
                Explore Properties
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2 uppercase mb-8">
          <IconHome size={20} /> Booking History
        </h2>
        <div className="overflow-x-auto mt-6 bg-base-300 rounded-xl">
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
                        className="btn btn-primary btn-sm"
                      >
                        View Property
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center justify-center py-16 gap-6">
                      <div className="w-32 h-32 relative flex items-center justify-center">
                        <IconHome 
                          size={80}
                          className="text-primary/60 transform transition-all duration-300 hover:scale-110"
                          stroke={1.5}
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-base-content">No Bookings Yet</h3>
                        <p className="text-base-content/70">
                          Ready to find your perfect stay? Start exploring our properties!
                        </p>
                        <Link 
                          href="/buyer/listings" 
                          className="btn btn-primary btn-md gap-2 mt-4 hover:scale-105 transition-transform duration-200"
                        >
                          Browse Properties
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyersDashboard;
