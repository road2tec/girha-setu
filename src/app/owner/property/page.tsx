"use client";
import { Flat } from "@/types/flat";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, MapPin, Phone, Home, Ruler, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import Script from "next/script";

const PropertyPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const router = useRouter();
  const [rating, setRating] = useState({
    rating: 0,
    comment: "",
  });
  const [property, setProperty] = useState<Flat>();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    totalAmount: 0,
  });
  useEffect(() => {
    if (!id) return;
    const fetchFlat = async () => {
      try {
        const response = await axios.get(`/api/listings/get?id=${id}`);
        setProperty(response.data.flat);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };
    fetchFlat();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && property?.price) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffInMonths = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      setFormData((prev) => ({
        ...prev,
        totalAmount: diffInMonths > 0 ? diffInMonths * property.price : 0,
      }));
    }
  }, [formData.startDate, formData.endDate, property?.price]);

  const addRating = async () => {
    if (rating.rating < 0 || rating.rating > 5 || !rating.comment.trim()) {
      toast.error("Please give a valid rating and comment.");
      return;
    }
    const res = axios.post("/api/listings/addRating", {
      rating,
      property,
      user,
    });
    toast.promise(res, {
      loading: "Adding Rating...",
      success: "Rating Added",
      error: "Error Adding Rating",
    });
  };

  if (!property) {
    return (
      <div className="text-center py-4 h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-primary uppercase text-center mt-4">
          Property Not Found
        </h1>
        <img
          src="not-found.svg"
          alt="No Listings"
          className="mx-auto h-[calc(70vh)] rounded-lg shadow-md"
        />
        <p className="text-3xl font-semibold uppercase text-base-content">
          No listings found.
        </p>
      </div>
    );
  }

  const addBooking = async () => {
    if (!formData.startDate || !formData.endDate || !formData.totalAmount) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = axios.post("/api/bookings/add", {
        userId: user?._id,
        flatId: property._id,
        ...formData,
      });

      toast.promise(response, {
        loading: "Processing Payment...",
        success: (data: AxiosResponse) => {
          const options = {
            key: "rzp_test_cXJvckaWoN0JQx",
            amount: data.data.amount,
            currency: "INR",
            name: "Flat-Finder",
            description: "Test Transaction",
            image: "/bg.png",
            order_id: data.data.orderId,
            callback_url: "http://localhost:3000/buyer/dashboard",
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phone,
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.on("payment.failed", function (response: any) {
            alert(response.error.description);
          });
          paymentObject.open();
          return "Booking created successfully";
        },
        error: (err: any) => {
          console.log(err);
          return err?.response.data.message;
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Error processing booking.");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <h1 className="text-3xl font-bold text-primary mb-4 uppercase">
        {property.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <img
          src={property.mainImage || "/placeholder.png"}
          alt={property.title}
          className="w-full h-full object-contain rounded-lg shadow-lg bg-base-300"
        />
        <div className="grid grid-cols-2 gap-2 bg-base-300 p-4 rounded-lg shadow-md">
          {property.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Flat Image ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            Details
          </h2>
          <p className="text-lg font-bold text-base-content/70">
            ₹ {property.price.toLocaleString()}/month
          </p>

          <div className="grid grid-cols-2 gap-4 text-base-content/60 mt-4">
            <div className="flex items-center gap-2">
              <Home size={20} /> {property.type}
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} /> {property.bhks} BHK
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={20} /> {property.area} sq.ft
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} /> {property.location?.city},{" "}
              {property.location?.state}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-secondary mt-6">
            Description
          </h2>
          <p className="text-base-content/60 mt-2">{property.description}</p>

          <h2 className="text-xl font-semibold text-secondary mt-6">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {property.amenities.map((amenity: any, index) => (
              <span key={index} className="badge badge-outline">
                {amenity}
              </span>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-secondary mt-6">Rating</h2>
          <div className="h-40 overflow-auto mb-4 py-4">
            {property.rating.length > 0 ? (
              property.rating.map((rating: any, index: number) => (
                <div className="chat chat-start" key={index}>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt={rating.user?.name}
                        src={rating.user?.profilePicture || "/placeholder.png"}
                      />
                    </div>
                  </div>
                  <div className="chat-header">{rating.user?.name}</div>
                  <div className="chat-bubble">{rating.comment}</div>
                  <div className="chat-footer opacity-50">
                    {rating.rating} / 5
                  </div>
                </div>
              ))
            ) : (
              <p className="text-base-content/70 mt-2">No ratings yet.</p>
            )}
          </div>
        </div>

        <div className="bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Owner Details
          </h2>
          <p className="flex items-center gap-2 text-base-content/70">
            <Mail size={18} /> {property.owner?.email}
          </p>
          <p className="flex items-center gap-2 text-base-content/70 mt-2">
            <Phone size={18} /> +91 {property.owner?.phone}
          </p>

          <Link
            className="btn btn-secondary w-full mt-2"
            href={`https://www.google.com/maps/search/?api=1&query=${property.location?.coordinates?.coordinates[0]},${property.location?.coordinates?.coordinates[1]}`}
            target="_blank"
          >
            View Location
          </Link>
        </div>
      </div>
      <dialog id="addReview" className="modal">
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg uppercase mb-4">
            Add Review for {property.title}
          </h3>

          <input
            type="number"
            placeholder="Give Rating out of 5"
            min={0}
            max={5}
            className="input input-bordered input-primary w-full max-w-xs"
            value={rating.rating}
            onChange={(e) => {
              setRating({ ...rating, rating: parseInt(e.target.value) });
            }}
          />
          <input
            type="text"
            placeholder="Comments..."
            className="input input-bordered input-primary w-full max-w-xs mt-6"
            value={rating.comment}
            onChange={(e) => {
              setRating({ ...rating, comment: e.target.value });
            }}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mx-3" onClick={addRating}>
                Add Rating
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="addBooking" className="modal">
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg uppercase mb-4">
            Book {property.title}
          </h3>
          <input
            type="date"
            placeholder="Start Date"
            className="input input-bordered input-primary w-full max-w-xs"
            value={formData.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value });
            }}
          />
          <input
            type="date"
            placeholder="End Date"
            className="input input-bordered input-primary w-full max-w-xs mt-6"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e) => {
              setFormData({ ...formData, endDate: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Total Amount"
            className="input input-bordered input-primary w-full max-w-xs mt-6"
            value={formData.totalAmount}
            readOnly
          />
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-primary mx-3"
                onClick={addBooking}
                disabled={
                  !formData.startDate ||
                  !formData.endDate ||
                  formData.totalAmount <= 0
                }
              >
                Pay Now and Book
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PropertyPage;
