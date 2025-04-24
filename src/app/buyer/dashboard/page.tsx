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
  IconStars,
  IconLoader2,
  IconTrash
} from "@tabler/icons-react";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";
import { useQuery, QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 300000,   // 5 minutes
    },
  },
});

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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-base-100 p-8 rounded-lg shadow-sm animate-pulse">
        <div className="h-10 w-10 rounded-full bg-base-200 mb-4" />
        <div className="h-6 w-32 bg-base-200 rounded mb-2" />
        <div className="h-8 w-36 bg-base-200 rounded" />
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [wishlistItems, setWishlistItems] = useState<Flat[]>([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeBookings: 0,
    savedProperties: 0,
    avgRating: 0
  });

  // Fetch wishlist with React Query
  const { data: wishlist = [], isLoading: isWishlistLoading, refetch: refetchWishlist } = useQuery({
    queryKey: ['wishlist', user?.email],
    queryFn: async () => {
      const response = await axios.get("/api/wishlist/getWishlist");
      const data = response.data.wishlist as Flat[];
      setWishlistItems(data); // Set local state
      return data;
    },
    enabled: !!user?.email,
  });

  // Update the handleRemoveFromWishlist function
  const handleRemoveFromWishlist = async (propertyId: string) => {
    try {
      // Immediately update local state
      const previousWishlist = [...wishlistItems];
      const updatedWishlist = wishlistItems.filter(item => item._id !== propertyId);
      
      // Update UI immediately
      setWishlistItems(updatedWishlist);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        savedProperties: updatedWishlist.length
      }));
      
      // Call API
      const response = await axios.delete(`/api/wishlist/removeFromWishlist?propertyId=${propertyId}&email=${user?.email}`);
      
      // Check if API was successful
      if (response.data.success) {
        toast.success('Property removed from wishlist');
      } else {
        // If API failed, revert state changes
        setWishlistItems(previousWishlist);
        setStats(prev => ({
          ...prev,
          savedProperties: previousWishlist.length
        }));
        toast.error('Failed to remove property from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove property from wishlist');
    }
  };

  // Fetch purchases with React Query
  const { data: purchases = [], isLoading: isPurchasesLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await axios.get(`/api/bookings/getBookings`);
      return response.data.bookings as Purchase[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isWishlistLoading && !isPurchasesLoading) {
      const totalSpent = purchases.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
      const activeBookings = purchases.filter((booking) => 
        new Date(booking.endDate) >= new Date() && booking.paymentStatus === 'completed'
      ).length;
      
      setStats({
        totalSpent,
        activeBookings,
        savedProperties: wishlistItems.length || wishlist.length, // Use local state first
        avgRating: 4.5
      });
    }
  }, [purchases, wishlistItems, wishlist, isWishlistLoading, isPurchasesLoading]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 p-6 bg-base-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-base-content">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <Link href="/buyer/my-account" className="p-2 hover:bg-base-300 rounded-full transition-colors">
          <IconUser size={24} className="text-base-content" />
        </Link>
      </div>

      {/* Stats Section */}
      {isWishlistLoading || isPurchasesLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-base-100 p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-100 rounded-lg">
                <IconCurrencyRupee size={24} className="text-rose-600" />
              </div>
              <div className="text-base font-medium text-rose-600">Total Spent</div>
            </div>
            <div className="text-4xl font-bold text-base-content">₹{stats.totalSpent.toLocaleString()}</div>
            <div className="text-base text-rose-600/80 mt-2">On Property Bookings</div>
          </div>
          
          <div className="bg-base-100 p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IconBuildingSkyscraper size={24} className="text-blue-600" />
              </div>
              <div className="text-base font-medium text-blue-600">Active Bookings</div>
            </div>
            <div className="text-4xl font-bold text-base-content">{stats.activeBookings}</div>
            <div className="text-base text-blue-600/80 mt-2">Current Rentals</div>
          </div>

          <div className="bg-base-100 p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IconHeart size={24} className="text-purple-600" />
              </div>
              <div className="text-base font-medium text-purple-600">Saved Properties</div>
            </div>
            <div className="text-4xl font-bold text-base-content">{stats.savedProperties}</div>
            <div className="text-base text-purple-600/80 mt-2">In Wishlist</div>
          </div>

          <div className="bg-base-100 p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-100 rounded-lg">
                <IconStars size={24} className="text-amber-600" />
              </div>
              <div className="text-base font-medium text-amber-600">Avg. Rating</div>
            </div>
            <div className="text-4xl font-bold text-base-content">{stats.avgRating}</div>
            <div className="text-base text-amber-600/80 mt-2">From Property Owners</div>
          </div>
        </div>
      )}

      {/* Wishlist Section */}
      <div className="bg-base-100 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-base-content flex items-center gap-2">
            <IconHeart size={20} className="text-primary" /> My Wishlist
          </h2>
        </div>
        {isWishlistLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-base-100 rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-base-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-base-200 rounded w-3/4" />
                  <div className="h-4 bg-base-200 rounded w-1/2" />
                  <div className="h-5 bg-base-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((listing: Flat) => (
              <div key={listing._id} className="bg-base-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-base-200">
                <figure className="relative overflow-hidden">
                  <img
                    src={listing.mainImage || "/placeholder.png"}
                    alt={listing.title}
                    className="h-48 w-full object-cover"
                  />
                  <button
                    onClick={() => {
                      if (listing._id) {
                        handleRemoveFromWishlist(listing._id);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-base-100 rounded-full hover:bg-base-200 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <IconTrash size={18} className="text-error" />
                  </button>
                </figure>
                <div className="p-4">
                  <Link href={`property?id=${listing._id}`}>
                    <h3 className="text-lg font-medium text-base-content hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                  </Link>
                  <p className="text-base-content/60 text-sm mt-1">
                    {listing.location?.city}, {listing.location?.state}
                  </p>
                  <p className="text-lg font-semibold text-primary mt-2">
                    ₹ {listing.price.toLocaleString()}/month
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${listing.location?.coordinates?.coordinates[0]},${listing.location?.coordinates?.coordinates[1]}`}
                      className="flex-1 py-2 px-3 bg-primary text-primary-content text-sm rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconMapPin size={16} /> Map
                    </a>
                    <Link
                      href={`property?id=${listing._id}`}
                      className="flex-1 py-2 px-3 border border-base-300 text-base-content text-sm rounded flex items-center justify-center hover:bg-base-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-lg">
            <IconHeart size={48} className="text-base-content/40 mx-auto mb-4" stroke={1.5} />
            <h3 className="text-lg font-medium text-base-content mb-2">Your Wishlist is Empty</h3>
            <p className="text-base-content/60 mb-4">
              Discover your dream home! Save your favorites here for quick access.
            </p>
            <Link 
              href="/buyer/listings" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors"
            >
              <IconHome size={18} />
              Explore Properties
            </Link>
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="bg-base-100 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-base-content flex items-center gap-2">
            <IconHome size={20} className="text-primary" /> Booking History
          </h2>
        </div>
        <div className="overflow-x-auto">
          {isPurchasesLoading ? (
            <div className="p-8">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">#</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Property</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Address</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {purchases.length > 0 ? (
                  purchases.map((booking: Purchase, index) => (
                    <tr key={booking._id} className="hover:bg-base-200/50">
                      <td className="py-4 px-4 text-sm text-base-content/80">{index + 1}</td>
                      <td className="py-4 px-4 text-sm font-medium text-base-content">{booking.property.title}</td>
                      <td className="py-4 px-4 text-sm text-base-content/60">{booking.property.location.address}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-base-content">{new Date(booking.startDate).toLocaleDateString()}</div>
                          <div className="text-base-content/60">to</div>
                          <div className="font-medium text-base-content">{new Date(booking.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-base-content">₹ {booking.totalAmount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          booking.paymentStatus === 'completed' ? 'bg-success/20 text-success' : 
                          booking.paymentStatus === 'pending' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`property?id=${booking.property._id}`}
                          className="inline-flex items-center px-3 py-1 bg-primary text-primary-content text-sm rounded hover:bg-primary/90 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-10">
                        <IconHome size={48} className="text-base-content/40 mb-4" stroke={1.5} />
                        <h3 className="text-lg font-medium text-base-content mb-2">No Bookings Yet</h3>
                        <p className="text-base-content/60 mb-4">
                          Ready to find your perfect stay? Start exploring our properties!
                        </p>
                        <Link 
                          href="/buyer/listings" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors"
                        >
                          Browse Properties
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the dashboard component with QueryClientProvider
const BuyersDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

export default BuyersDashboard;
