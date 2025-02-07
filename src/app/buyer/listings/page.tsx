"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, MessageCircle, Heart, Search } from "lucide-react";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

const ListingPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Flat[]>([]);
  const [filteredListings, setFilteredListings] = useState<Flat[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    maxDistance: "",
    priceRange: "",
  });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch Listings
  const getListings = async () => {
    try {
      const response = await axios.get("/api/listings/allListings");
      setListings(response.data.flats);
      setFilteredListings(response.data.flats);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let filtered = listings;

    if (filters.city) {
      filtered = filtered.filter(
        (listing) =>
          listing.location?.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    if (filters.state) {
      filtered = filtered.filter(
        (listing) =>
          listing.location?.state.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.priceRange) {
      const maxPrice = parseInt(filters.priceRange);
      filtered = filtered.filter((listing) => listing.price <= maxPrice);
    }

    if (filters.maxDistance && userLocation) {
      const maxDist = parseInt(filters.maxDistance);
      filtered = filtered.filter((listing) => {
        const lat = listing.location?.coordinates[0];
        const lng = listing.location?.coordinates[1];
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng
        );
        return distance <= maxDist;
      });
    }
    setFilteredListings(filtered);
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Handle Wishlist
  const handleAddToWishlist = async (listingId: string) => {
    try {
      const response = axios.post(`/api/wishlist/add`, { listingId, user });
      toast.promise(response, {
        loading: "Adding to wishlist...",
        success: "Added to wishlist!",
        error: "Error adding to wishlist.",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Listings
      </h1>

      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          className="input input-bordered w-full"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="input input-bordered w-full"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceRange"
          placeholder="Max Price (₹)"
          className="input input-bordered w-full"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxDistance"
          placeholder="Max Distance (km)"
          className="input input-bordered w-full"
          onChange={handleFilterChange}
        />
        <button
          className="btn btn-primary col-span-2 sm:col-span-1"
          onClick={applyFilters}
        >
          <Search size={16} /> Apply Filters
        </button>
      </div>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
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
                    onClick={() => handleAddToWishlist(listing._id!)}
                    className="btn btn-sm btn-outline flex items-center gap-1"
                  >
                    <Heart size={16} /> Wishlist
                  </button>
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

export default ListingPage;
