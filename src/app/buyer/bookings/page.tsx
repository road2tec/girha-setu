"use client";
import { IconLoader2, IconCalendar, IconClock, IconBuilding, IconMapPin } from "@tabler/icons-react";
import { Flat } from "@/types/flat";
import { User } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const BookingSkeleton = () => (
  <div className="animate-pulse bg-base-100 rounded-xl p-6 mb-4 shadow-sm">
    <div className="h-7 bg-base-200 rounded-lg w-1/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-5 bg-base-200 rounded-lg w-3/4"></div>
      <div className="h-5 bg-base-200 rounded-lg w-1/2"></div>
      <div className="h-5 bg-base-200 rounded-lg w-2/3"></div>
    </div>
  </div>
);

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/bookings/getBookings");
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success/10 text-success border border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'failed':
        return 'bg-error/10 text-error border border-error/20';
      default:
        return 'bg-info/10 text-info border border-info/20';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">My Bookings</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-12  pt-2">
      <h1 className="text-4xl font-bold text-center mb-3">My Bookings</h1>
      <p className="text-base-content/60 text-center mb-12">Manage and track your property bookings</p>
      
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl shadow-sm">
          <IconBuilding className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
          <h3 className="text-2xl font-semibold mb-3">No Bookings Found</h3>
          <p className="text-base-content/60 mb-6">You haven't made any bookings yet. Start exploring properties now!</p>
          <Link 
            href="/buyer/listings" 
            className="btn btn-primary btn-lg normal-case"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="group bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-base-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {booking.property.title}
                      </h2>
                      <div className="flex items-center text-base-content/70 text-sm">
                        <IconMapPin className="w-4 h-4 mr-1" />
                        {booking.property.location.address}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200/50 rounded-lg p-3">
                        <div className="flex items-center text-sm font-medium mb-1">
                          <IconCalendar className="w-4 h-4 mr-2" />
                          Booking Period
                        </div>
                        <p className="text-base-content/70 text-sm pl-6">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="bg-base-200/50 rounded-lg p-3">
                        <div className="flex items-center text-sm font-medium mb-1">
                          <IconClock className="w-4 h-4 mr-2" />
                          Booked On
                        </div>
                        <p className="text-base-content/70 text-sm pl-6">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-base-content/70 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">₹{booking.totalAmount.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>

                      <Link
                        href={`property?id=${booking.property._id}`}
                        className="btn btn-primary btn-sm normal-case"
                      >
                        View Property
                      </Link>
                    </div>
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

export default MyBookings;
