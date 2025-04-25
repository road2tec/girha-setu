"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import {
  IconHeart,
  IconMapPin,
  IconMessageCircle,
  IconSearch,
  IconLoader2
} from "@tabler/icons-react";
import Link from "next/link";
import { Home, MapPin, MessageCircle, Phone, Ruler } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const PropertySkeleton = () => (
  <div className="card bg-base-300 shadow-md rounded-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-base-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-base-200 rounded w-3/4" />
      <div className="h-4 bg-base-200 rounded w-full" />
      <div className="h-4 bg-base-200 rounded w-1/2" />
      <div className="h-6 bg-base-200 rounded w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-4 bg-base-200 rounded" />
        <div className="h-4 bg-base-200 rounded" />
      </div>
      <div className="bg-base-200 p-3 rounded-md space-y-2">
        <div className="h-4 bg-base-100 rounded w-2/3" />
        <div className="h-4 bg-base-100 rounded w-1/2" />
        <div className="h-4 bg-base-100 rounded w-1/2" />
      </div>
      <div className="flex gap-2 justify-around mt-4">
        <div className="h-8 bg-base-200 rounded w-24" />
        <div className="h-8 bg-base-200 rounded w-24" />
      </div>
    </div>
  </div>
);

const ListingPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Flat[]>([]);
  const [filteredListings, setFilteredListings] = useState<Flat[]>([]);
  const [wishlist, setWishlist] = useState<Flat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/listings/allListings");
      setListings(response.data.flats);
      setFilteredListings(response.data.flats);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist/getWishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchWishlist();

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
              listing.location.coordinates.coordinates[0],
              listing.location.coordinates.coordinates[1]
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
          (userLocation && listing.distance! <= parseInt(filters.maxDistance)))
      );
    });
    setFilteredListings(filtered);
  };

  const handleAddToWishlist = async (listingId: string) => {
    try {
      const response = axios.post(`/api/wishlist/add`, { listingId, user });
      toast.promise(response, {
        loading: "Adding to wishlist...",
        success: () => {
          fetchWishlist();
          fetchListings();
          return "Added to wishlist!";
        },
        error: "Error adding to wishlist.",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  const handleRemoveFromWishlist = async (listingId: string) => {
    try {
      const response = axios.post(`/api/wishlist/remove`, { listingId, user });
      toast.promise(response, {
        loading: "Removing from wishlist...",
        success: () => {
          fetchWishlist();
          fetchListings();
          return "Removed from wishlist!";
        },
        error: "Error removing from wishlist.",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleSearchNow = async () => {
    const response = axios.post("/api/search", { prompt: prompt });
    toast.promise(response, {
      loading: "Searching Flat...",
      success: (data: AxiosResponse) => {
        setListings(data.data.flats);
        console.log(data.data);
        return "Flat found!!";
      },
      error: (err: any) => err.response.data.message,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100/50">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-base-content">
          Find Your Perfect Home
        </h1>
        <p className="text-base-content/70 mt-3">
          Discover properties that match your lifestyle and preferences
        </p>
      </div>

      <div className="bg-base-100 rounded-lg shadow-sm border border-base-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by your preferences..."
              className="input input-bordered w-full pl-12 bg-base-200/50 hover:bg-base-200 focus:bg-base-200 transition-colors"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
          </div>
          <button 
            className="btn btn-neutral"
            onClick={handleSearchNow}
          >
            Search Now
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="input input-bordered w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 transition-colors"
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
            <IconMapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50" size={16} />
          </div>
          <div className="relative">
            <input
              type="text"
              name="state"
              placeholder="State"
              className="input input-bordered w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 transition-colors"
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            />
            <IconMapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50" size={16} />
          </div>
          <div className="relative">
            <input
              type="number"
              name="priceRange"
              placeholder="Max Price (₹)"
              className="input input-bordered w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 transition-colors"
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50">₹</span>
          </div>
          <div className="relative">
            <input
              type="number"
              name="maxDistance"
              placeholder="Max Distance (km)"
              className="input input-bordered w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-200 transition-colors"
              onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50">km</span>
          </div>
        </div>
        <button
          className="btn btn-primary w-full mt-4"
          onClick={applyFilters}
        >
          <IconSearch size={16} className="mr-2" /> Apply Filters
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PropertySkeleton key={index} />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg border border-base-200">
          <IconSearch 
            size={64}
            className="text-base-content/20 mx-auto mb-4"
            stroke={1}
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">No Properties Found</h3>
            <p className="text-base-content/70 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => {
                setFilters({
                  city: "",
                  state: "",
                  maxDistance: "",
                  priceRange: "",
                });
                setFilteredListings(listings);
              }}
              className="btn btn-neutral btn-sm mt-4"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <div key={index} className="group">
              <div className="bg-base-100 border border-base-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg shadow-md">
                <Link href={`property?id=${listing._id}`} className="block cursor-pointer">
                  <figure className="relative h-48 overflow-hidden">
                    <img
                      src={listing.mainImage || "/placeholder.png"}
                      alt={listing.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* <span className="absolute top-3 right-3 bg-base-100/90 text-base-content px-2 py-1 rounded text-sm font-medium backdrop-blur-sm">
                      {Math.round(listing.distance!)} km
                    </span> */}
                  </figure>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold text-base-content line-clamp-1">{listing.title}</h2>
                      <p className="text-lg font-semibold text-base-content">
                        ₹{listing.price.toLocaleString()}
                        <span className="text-xs text-base-content/60 block text-right">/month</span>
                      </p>
                    </div>
                    <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    <div className="flex items-center gap-3 text-base-content/70 text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {listing.location?.city}, {listing.location?.state}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <span className="flex items-center gap-1.5 bg-base-200/50 rounded px-2 py-1.5 text-base-content/70">
                        <Home size={14} /> {listing.type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-base-200/50 rounded px-2 py-1.5 text-base-content/70">
                        <Ruler size={14} /> {listing.area} sq.ft
                      </span>
                    </div>
                    <div className="bg-base-200/50 rounded p-3 mb-4 text-sm">
                      <p className="font-medium text-base-content mb-1.5">Owner Details</p>
                      <div className="space-y-1">
                        <p className="text-base-content/70">{listing.owner?.name}</p>
                        <p className="text-base-content/70 flex items-center gap-1.5">
                          <MessageCircle size={14} /> {listing.owner?.email}
                        </p>
                        <p className="text-base-content/70 flex items-center gap-1.5">
                          <Phone size={14} /> {listing.owner?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {wishlist.some((item) => item._id === listing._id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFromWishlist(listing._id!);
                        }}
                        className="btn btn-error btn-sm"
                      >
                        <IconHeart size={14} className="mr-1" /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(listing._id!);
                        }}
                        className={`btn btn-ghost btn-sm ${
                          wishlist.some((item) => item._id === listing._id) &&
                          "btn-disabled"
                        }`}
                        disabled={wishlist.some(
                          (item) => item._id === listing._id
                        )}
                      >
                        <IconHeart size={14} className="mr-1" /> Wishlist
                      </button>
                    )}
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${listing.location?.coordinates?.coordinates[0]},${listing.location?.coordinates?.coordinates[1]}`}
                      className="btn btn-neutral btn-sm"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconMapPin size={14} className="mr-1" /> View Map
                    </Link>
                  </div>
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
