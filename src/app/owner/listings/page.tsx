"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Flat } from "@/types/flat";

const ListingPage = () => {
  const [listings, setListings] = useState<Flat[]>([]);

  // Fetch Listings
  const getListings = async () => {
    try {
      const response = await axios.get("/api/listings/allListingsByUser");
      setListings(response.data.flats);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  // Handle Delete Listing
  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`/api/listings/${listingId}`);
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Listings</h1>

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
                <p className="text-gray-500">
                  {listing.location?.city}, {listing.location?.state}
                </p>
                <p className="text-lg font-bold mt-2">
                  ₹ {listing.price.toLocaleString()}
                </p>

                {/* Bedrooms & Bathrooms */}
                <div className="flex items-center gap-4 mt-3 text-gray-600">
                  <span>{listing.bedrooms} 🛏️</span>
                  <span>{listing.bathrooms} 🚿</span>
                  <span>{listing.area} sq.ft 📏</span>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => console.log("Edit", listing._id)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(listing._id)}
                  >
                    <Trash2 size={16} /> Delete
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

export default ListingPage;
