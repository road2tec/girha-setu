"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  IconHome, 
  IconMapPin, 
  IconEdit, 
  IconRuler, 
  IconTrash, 
  IconBed, 
  IconPlus,
  IconLoader2,
  IconBuilding
} from "@tabler/icons-react";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import Link from "next/link";

// Skeleton loader component
const ListingSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card bg-base-300 shadow-md rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 w-full bg-base-200"></div>
          <div className="p-5">
            <div className="h-6 bg-base-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-base-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-base-200 rounded w-1/2 mb-4"></div>
            <div className="h-5 bg-base-200 rounded w-1/3 mb-4"></div>
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-base-200 rounded w-16"></div>
              <div className="h-4 bg-base-200 rounded w-16"></div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="h-8 bg-base-200 rounded w-24"></div>
              <div className="h-8 bg-base-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListingPage = () => {
  const [listings, setListings] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  const getListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/listings/allListingsByUser");
      setListings(response.data.flats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 p-6 bg-base-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-base-content">My Listings</h1>
        <Link href="/owner/add-property" className="btn btn-primary btn-sm flex items-center gap-2">
          <IconPlus size={16} />
          Add New Property
        </Link>
      </div>

      {loading ? (
        <ListingSkeletonLoader />
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-base-100 rounded-lg shadow-sm">
          <IconBuilding size={64} className="text-base-content/30 mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">You don't have any properties yet</h3>
          <p className="text-base-content/60 text-center max-w-md mb-6">
            Add your first property to start receiving bookings and generating revenue
          </p>
          <Link href="/owner/add-property" className="btn btn-primary">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="card bg-base-100 shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md border border-base-200"
            >
              <figure className="relative h-48 overflow-hidden">
                <img
                  src={listing.mainImage || "/placeholder.png"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="badge badge-primary">{listing.type}</span>
                </div>
              </figure>

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{listing.title}</h2>
                <p className="text-base-content/80 text-sm mb-3 line-clamp-2">{listing.description}</p>
                
                <div className="flex items-center gap-1 text-base-content/70 text-sm mb-3">
                  <IconMapPin size={16} />
                  <span className="line-clamp-1">
                    {listing.location?.address || `${listing.location?.city}, ${listing.location?.state}`}
                  </span>
                </div>
                
                <p className="text-lg font-bold mb-4 text-primary">
                  {formatCurrency(listing.price)} <span className="text-xs font-normal text-base-content/60">/ month</span>
                </p>

                <div className="flex items-center justify-between gap-4 mb-4 text-sm text-base-content/80">
                  <div className="flex items-center gap-1">
                    <IconBed size={16} />
                    <span>{listing.bhks} BHK</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconRuler size={16} />
                    <span>{listing.area} sq.ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconHome size={16} />
                    <span>{listing.type}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Link
                    className="flex-1 btn btn-sm btn-outline"
                    href={`/property?id=${listing._id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="flex-1 btn btn-sm btn-outline btn-primary"
                    href={`/owner/edit?id=${listing._id}`}
                  >
                    <IconEdit size={16} /> Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(listing._id!)}
                    title="Delete property"
                  >
                    <IconTrash size={16} />
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
