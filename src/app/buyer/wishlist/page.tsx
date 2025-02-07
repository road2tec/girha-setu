"use client";
import { useAuth } from "@/context/AuthProvider";
import { Flat } from "@/types/flat";
import axios from "axios";
import { MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Flat[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist/getWishlist");
      setListings(response.data.wishlist);
    } catch (error) {
      toast.error("Error fetching wishlist");
    }
  };
  useEffect(() => {
    fetchWishlist();
  }, []);
  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6">Your Wishlist</h1>
      {/* Listings */}
      {listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden"
            >
              {/* Property Image */}
              <figure>
                <img
                  src={listing.images || "/placeholder.png"}
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />
              </figure>

              {/* Property Info */}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-base-content/50">
                  {listing.location?.city}, {listing.location?.state}
                </p>
                <p className="text-lg font-bold mt-2">
                  ₹ {listing.price.toLocaleString()}
                </p>

                {/* Bedrooms & Bathrooms */}
                <div className="flex items-center gap-4 mt-3 text-base-content/60">
                  <span>{listing.bedrooms} 🛏️</span>
                  <span>{listing.bathrooms} 🚿</span>
                  <span>{listing.area} sq.ft 📏</span>
                </div>

                {/* Owner Info */}
                <div className="mt-4 bg-base-200 p-3 rounded-md">
                  <p className="text-sm font-semibold">
                    Owner: {listing.owner?.name}
                  </p>
                  <a
                    href={`mailto:${listing.owner?.email}`}
                    className="text-primary flex items-center gap-1 text-sm"
                  >
                    <MessageCircle size={14} /> {listing.owner?.email}
                  </a>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedLocation({
                        lat: listing.location?.coordinates[0],
                        lng: listing.location?.coordinates[1],
                      })
                    }
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <MapPin size={16} /> View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;
