"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import {
  IconHeart,
  IconMapPin,
  IconMessageCircle,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

const ListingPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Flat[]>([]);
  const [filteredListings, setFilteredListings] = useState<Flat[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    maxDistance: "",
    priceRange: "",
  });
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listings/allListings");
        setListings(response.data.flats);
        setFilteredListings(response.data.flats);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();

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
    }
  }, []);

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

  useEffect(() => {
    if (userLocation) {
      let sortedListings = listings.map((listing) => {
        const distance = listing.location?.coordinates
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              listing.location.coordinates[0],
              listing.location.coordinates[1]
            )
          : Infinity;
        return { ...listing, distance };
      });
      sortedListings.sort((a, b) => a.distance - b.distance);
      setFilteredListings(sortedListings);
    }
  }, [userLocation, listings]);

  const applyFilters = () => {
    let filtered = listings.filter((listing) => {
      return (
        (!filters.city ||
          listing.location?.city.toLowerCase() ===
            filters.city.toLowerCase()) &&
        (!filters.state ||
          listing.location?.state.toLowerCase() ===
            filters.state.toLowerCase()) &&
        (!filters.priceRange ||
          listing.price <= parseInt(filters.priceRange)) &&
        (!filters.maxDistance ||
          (userLocation && listing.distance <= parseInt(filters.maxDistance)))
      );
    });
    setFilteredListings(filtered);
  };

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

  const handleSearchNow = async () => {
    const response = axios.post("/api/search", { prompt: prompt });
    toast.promise(response, {
      loading: "Searching Flat...",
      success: (data) => {
        setListings(data.data.flats);
        console.log(data.data);
        return "Flat found!!";
      },
      error: (err) => err.response.data.message,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Listings
      </h1>

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          className="input input-bordered w-full"
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="input input-bordered w-full"
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        />
        <input
          type="number"
          name="priceRange"
          placeholder="Max Price (₹)"
          className="input input-bordered w-full"
          onChange={(e) =>
            setFilters({ ...filters, priceRange: e.target.value })
          }
        />
        <input
          type="number"
          name="maxDistance"
          placeholder="Max Distance (km)"
          className="input input-bordered w-full"
          onChange={(e) =>
            setFilters({ ...filters, maxDistance: e.target.value })
          }
        />
        <button
          className="btn btn-primary col-span-2 sm:col-span-1"
          onClick={applyFilters}
        >
          <IconSearch size={16} /> Apply Filters
        </button>
      </div>

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Just tell use about your wish"
          className="input input-bordered w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="btn btn-primary mt-4" onClick={handleSearchNow}>
          <IconSearch size={16} /> Search Now
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
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
                <span className="badge badge-primary absolute top-2 right-2">
                  {Math.round(listing.distance)} km
                </span>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToWishlist(listing._id!)}
                    className="btn btn-sm btn-outline flex items-center gap-1"
                  >
                    <IconHeart size={16} /> Wishlist
                  </button>
                  <button className="btn btn-sm btn-primary flex items-center gap-1">
                    <IconMapPin size={16} /> View on Map
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ListingPage;
