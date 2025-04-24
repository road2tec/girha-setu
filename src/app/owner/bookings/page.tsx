"use client";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  IconCalendar, 
  IconUser, 
  IconCash, 
  IconHome,
  IconMapPin,
  IconAlertCircle,
  IconLoader2,
  IconCheck,
  IconClock,
  IconX
} from "@tabler/icons-react";

interface Booking {
  _id: string;
  user: User;
  property: Flat;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentStatus: string;
  createdAt: Date;
}

// Skeleton loader component
const BookingsSkeletonLoader = () => {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 animate-pulse space-y-2">
        <div className="h-8 bg-base-200 rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 bg-base-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                    <td key={`${row}-${col}`} className="px-4 py-3">
                      <div className="h-4 bg-base-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/bookings/getBookingsForOwner");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
            <IconCheck size={14} className="mr-1" />
            {status}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning">
            <IconClock size={14} className="mr-1" />
            {status}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error/20 text-error">
            <IconX size={14} className="mr-1" />
            {status}
          </span>
        );
      default:
        return <span className="text-base-content">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-base-content">My Bookings</h1>
        </div>
        <BookingsSkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-base-content">My Bookings</h1>
        </div>
        <div className="bg-base-100 rounded-xl shadow-sm p-8 text-center">
          <IconAlertCircle size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Bookings</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-base-content">My Bookings</h1>
        <Link href="/owner/dashboard" className="btn btn-outline btn-sm">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-xs font-medium text-base-content/70">#</th>
                  <th className="text-xs font-medium text-base-content/70">
                    <div className="flex items-center gap-1">
                      <IconHome size={14} />
                      Property
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70">
                    <div className="flex items-center gap-1">
                      <IconMapPin size={14} />
                      Location
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70">
                    <div className="flex items-center gap-1">
                      <IconUser size={14} />
                      Tenant
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70">
                    <div className="flex items-center gap-1">
                      <IconCalendar size={14} />
                      Duration
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70">
                    <div className="flex items-center gap-1">
                      <IconCash size={14} />
                      Amount
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70">Status</th>
                  <th className="text-xs font-medium text-base-content/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="hover:bg-base-200/50 border-b border-base-200">
                    <td className="text-sm text-base-content/70">{index + 1}</td>
                    <td className="text-sm font-medium">{booking.property.title}</td>
                    <td className="text-sm text-base-content/80">{booking.property.location.address}</td>
                    <td className="text-sm text-base-content/80">{booking.user.name}</td>
                    <td className="text-sm">
                      <div className="flex flex-col">
                        <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                        <span className="text-xs text-base-content/50">to</span>
                        <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</td>
                    <td>{getStatusBadge(booking.paymentStatus)}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/property?id=${booking.property._id}`}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          View Property
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconCalendar size={64} className="text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No bookings found</h3>
            <p className="text-base-content/60 text-center max-w-md mb-6">
              You don't have any bookings yet. Once your properties are booked, you'll see them here.
            </p>
            <Link href="/owner/listings" className="btn btn-primary">
              View My Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
