"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Home, MapPin, Pencil, Ruler, Trash2 } from "lucide-react";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import Link from "next/link";

const ListingPage = () => {
  const [listings, setListings] = useState<Flat[]>([]);

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
      const res = axios.delete(`/api/listings/delete?id=${listingId}`);
      toast.promise(res, {
        loading: "Deleting listing...",
        success: () => {
          getListings();
          return "Listing deleted successfully.";
        },
        error: "Error deleting listing.",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 uppercase">
        My Listings
      </h1>

      {listings.length === 0 ? (
        <div className="text-center py-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-primary uppercase text-center mt-4">
            Available Properties
          </h1>
          <img
            src="../not-found.svg"
            alt="No Listings"
            className="mx-auto h-[calc(70vh)] rounded-lg shadow-md"
          />
          <p className="text-3xl font-semibold uppercase text-base-content">
            No listings found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="card bg-base-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300"
            >
              <figure>
                <img
                  src={listing.mainImage || "/placeholder.png"}
                  alt={listing.title}
                  className="h-48 w-full object-contain"
                />
              </figure>

              <div className="p-5">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-base-content">{listing.description}</p>
                <p className="text-base-content flex items-center gap-2 mt-2">
                  <MapPin size={16} /> {listing.location?.city},{" "}
                  {listing.location?.state}
                </p>
                <p className="text-lg font-bold mt-2 text-secondary">
                  ₹ {listing.price.toLocaleString()} / month
                </p>

                <div className="flex items-center gap-4 mt-3 text-base-content">
                  <span>{listing.bhks} 🛏️</span>
                  <span>{listing.area} sq.ft 📏</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-base-content/80">
                  <span className="flex items-center gap-1">
                    <Home size={16} /> {listing.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler size={16} /> {listing.area} sq.ft
                  </span>
                </div>

                <div className="flex justify-between mt-4">
                  <Link
                    className="btn btn-accent btn-outline"
                    href={`/owner/edit?id=${listing._id}`}
                  >
                    <Pencil size={16} /> Edit
                  </Link>
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(listing._id!)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ListingPage;
