"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { Flat } from "@/types/flat";

const ListingPage = () => {
  const [listings, setListings] = useState<Flat[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch Listings
  const getListings = async () => {
    try {
      const response = await axios.get("/api/listings/allListings");
      setListings(response.data.flats);
      console.log(response.data.flats);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Listings
      </h1>

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

                {/* Owner Info */}
                <div className="mt-4 bg-base-200 p-3 rounded-md">
                  <p className="text-sm font-semibold">
                    Owner: {listing.owner?.name}
                  </p>
                  <a
                    href={`tel:${listing.owner?.email}`}
                    className="text-blue-500 flex items-center gap-1 text-sm"
                  >
                    <Phone size={14} /> {listing.owner?.email}
                  </a>
                </div>

                {/* Buttons */}
                <div className="mt-4">
                  <button
                    onClick={() =>
                      setSelectedLocation({
                        lat: listing.location?.coordinates[0],
                        lng: listing.location?.coordinates[1],
                      })
                    }
                    className="btn btn-sm btn-primary flex items-center gap-1 w-full"
                  >
                    <MapPin size={16} /> View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Property Location</h2>
            <iframe
              className="w-full h-64 rounded-md"
              src={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&output=embed`}
              loading="lazy"
            ></iframe>
            <button
              className="btn btn-sm btn-error mt-4 w-full"
              onClick={() => setSelectedLocation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
