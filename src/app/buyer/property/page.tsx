"use client";
import { Flat } from "@/types/flat";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, MapPin, Phone, Home, Ruler, Users, X, Star, StarHalf, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import Script from "next/script";
import { IconSearch } from "@tabler/icons-react";

const PropertySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-2/3 bg-base-200 rounded mb-4"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="h-[400px] bg-base-200 rounded-lg"></div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-base-200 rounded-lg"></div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-base-200 rounded-lg p-6 space-y-4">
        <div className="h-6 w-1/4 bg-base-300 rounded"></div>
        <div className="h-4 w-1/3 bg-base-300 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-base-300 rounded"></div>
          ))}
        </div>
        <div className="h-4 w-full bg-base-300 rounded mt-4"></div>
        <div className="h-4 w-5/6 bg-base-300 rounded"></div>
      </div>
      <div className="bg-base-200 rounded-lg p-6 space-y-4">
        <div className="h-6 w-1/2 bg-base-300 rounded"></div>
        <div className="h-4 w-2/3 bg-base-300 rounded"></div>
        <div className="h-4 w-2/3 bg-base-300 rounded"></div>
        <div className="space-y-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-base-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingRating, setEditingRating] = useState<any>(null);

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

    try {
      const res = await axios.post("/api/listings/addRating", {
        rating,
        property,
        user,
      });

      // Create new review object
      const newReview = {
        rating: rating.rating,
        comment: rating.comment,
        user: {
          _id: user?._id,
          name: user?.name,
          profilePicture: user?.profilePicture,
        },
        createdAt: new Date().toISOString(),
      };

      // Update local state
      setProperty(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rating: [...prev.rating, newReview]
        };
      });

      // Reset rating form
      setRating({
        rating: 0,
        comment: "",
      });

      // Close modal
      (document.getElementById("addReview") as HTMLDialogElement).close();

      toast.success("Rating Added Successfully");
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error("Error Adding Rating");
    }
  };

  const deleteRating = async (ratingId: string) => {
    try {
      await axios.delete(`/api/listings/deleteRating`, {
        data: {
          propertyId: property?._id,
          ratingId,
        },
      });

      // Update local state
      setProperty(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rating: prev.rating.filter((r: any) => r._id !== ratingId)
        };
      });

      toast.success("Rating deleted successfully");
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
    }
  };

  const editRating = async () => {
    if (!editingRating || editingRating.rating < 0 || editingRating.rating > 5 || !editingRating.comment.trim()) {
      toast.error("Please give a valid rating and comment.");
      return;
    }

    try {
      await axios.put(`/api/listings/updateRating`, {
        propertyId: property?._id,
        ratingId: editingRating._id,
        rating: editingRating.rating,
        comment: editingRating.comment,
      });

      // Update local state
      setProperty(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rating: prev.rating.map((r: any) => 
            r._id === editingRating._id 
              ? { ...r, rating: editingRating.rating, comment: editingRating.comment }
              : r
          )
        };
      });

      // Reset editing state
      setEditingRating(null);
      // Close modal
      (document.getElementById("editReview") as HTMLDialogElement).close();

      toast.success("Rating updated successfully");
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Failed to update rating");
    }
  };

  if (!property && !id) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <IconSearch size={64} className="text-base-content/20 mx-auto" />
          <h1 className="text-2xl font-bold text-base-content">Property Not Found</h1>
          <p className="text-base-content/70">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/buyer/listings" className="btn btn-primary">
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return <PropertySkeleton />;
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-200/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="badge badge-primary py-3 px-4 font-medium">
                {property.type} · {property.bhks} BHK
              </div>
              <div className="badge badge-ghost py-3 px-4">
                {property.area} sq.ft
              </div>
            </div>
            <h1 className="text-4xl font-bold text-base-content">
              {property.title}
            </h1>
            <p className="text-base-content/70 flex items-center gap-2 text-lg">
              <MapPin size={20} className="text-primary" />
              {property.location?.city}, {property.location?.state}
            </p>
          </div>
          <div className="md:text-right bg-base-100 p-4 rounded-lg border border-base-200 md:min-w-[200px]">
            <p className="text-sm text-base-content/70 mb-1">Rent per month</p>
            <p className="text-4xl font-bold text-primary">
              ₹{property.price.toLocaleString()}
            </p>
            <button
              className="btn btn-primary w-full mt-4"
              onClick={() => {
                (document.getElementById("addBooking") as HTMLDialogElement).showModal();
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 lg:col-span-8">
          <div 
            className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-base-200 cursor-pointer"
            onClick={() => setSelectedImage(property.mainImage)}
          >
            <img
              src={property.mainImage || "/placeholder.png"}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {property.images?.slice(0, 4).map((img, index) => (
              <div 
                key={index} 
                className="relative aspect-square cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-base-200">
                  <img
                    src={img || "/placeholder.png"}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
            {property.images && property.images.length > 4 && (
              <div 
                className="relative aspect-square cursor-pointer"
                onClick={() => setSelectedImage(property.images[4])}
              >
                <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-base-200 relative">
                  <img
                    src={property.images[4] || "/placeholder.png"}
                    alt={`${property.title} - More Images`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-xl font-bold">+{property.images.length - 4}</p>
                      <p className="text-sm">More Photos</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-primary"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <div className="relative max-w-7xl w-full">
            <img
              src={selectedImage}
              alt="Property"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 overflow-x-auto">
              <img
                src={property.mainImage || "/placeholder.png"}
                alt="thumbnail"
                className={`h-20 w-20 object-cover rounded-lg cursor-pointer transition-opacity ${
                  selectedImage === property.mainImage ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(property.mainImage);
                }}
              />
              {property.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumbnail ${index + 1}`}
                  className={`h-20 w-20 object-cover rounded-lg cursor-pointer transition-opacity ${
                    selectedImage === img ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-base-200/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-base-content/70">
                  <Home size={18} className="text-primary" />
                  <span className="font-medium">{property.type}</span>
                </div>
              </div>
              <div className="bg-base-200/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-base-content/70">
                  <Users size={18} className="text-primary" />
                  <span className="font-medium">{property.bhks} BHK</span>
                </div>
              </div>
              <div className="bg-base-200/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-base-content/70">
                  <Ruler size={18} className="text-primary" />
                  <span className="font-medium">{property.area} sq.ft</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-base-content mb-3">
                Location Details
              </h3>
              <div className="bg-base-200/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-2 text-base-content/70">
                  <MapPin size={18} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">{property.location.address}</p>
                    <p className="text-sm">{property.location.city}, {property.location.state}, {property.location.country}</p>
                  </div>
                </div>
                {property.distance && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Distance: {property.distance} km from city center</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rental Terms */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-base-content mb-3">
                Rental Terms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-base-content/70">Monthly Rent</p>
                  <p className="text-lg font-semibold text-primary">₹{property.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Security Deposit</p>
                  <p className="text-lg font-semibold">₹{(property.price * 2).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Listed On</p>
                  <p className="text-lg font-semibold">
                    {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Property Type</p>
                  <p className="text-lg font-semibold">{property.type}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-base-content mb-2">
              Description
            </h3>
            <p className="text-base-content/70 mb-6">{property.description}</p>

            <h3 className="text-lg font-medium text-base-content mb-3">
              Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-base-200/50 p-3 rounded-lg text-base-content/70"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {typeof amenity === 'string' ? amenity : amenity.type}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-base-content">
                  Reviews & Ratings
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {property.rating && property.rating.length > 0 ? (
                      <>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => {
                            const averageRating = property.rating.reduce((acc, curr) => acc + curr.rating, 0) / property.rating.length;
                            return (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < Math.floor(averageRating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : i === Math.floor(averageRating) && averageRating % 1 >= 0.5
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-base-content/20"
                                }`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-sm text-base-content/70 ml-2">
                          ({property.rating.length} {property.rating.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-base-content/70">No reviews yet</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  (document.getElementById("addReview") as HTMLDialogElement).showModal();
                }}
              >
                Write a Review
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {property.rating && property.rating.length > 0 ? (
                property.rating.map((rating: any, index: number) => (
                  <div key={index} className="bg-base-200/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={rating.user?.profilePicture || "/placeholder.png"}
                            alt={rating.user?.name}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-base-content">
                              {rating.user?.name}
                            </h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < rating.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-base-content/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-base-content/60">
                              {new Date(rating.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                            {rating.user?._id === user?._id && (
                              <div className="flex items-center gap-1">
                                <button
                                  className="btn btn-ghost btn-xs"
                                  onClick={() => {
                                    setEditingRating(rating);
                                    (document.getElementById("editReview") as HTMLDialogElement).showModal();
                                  }}
                                  title="Edit review"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this review?")) {
                                      deleteRating(rating._id);
                                    }
                                  }}
                                  title="Delete review"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-base-content/70 mt-2">{rating.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 h-fit sticky top-4">
          <h2 className="text-xl font-semibold text-base-content mb-4">
            Contact Owner
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-base-content/70">
              <div className="avatar">
                <div className="w-12 rounded-full bg-base-200">
                  <img src={property.owner?.profilePicture || "/placeholder.png"} alt={property.owner?.name} />
                </div>
              </div>
              <div>
                <p className="font-medium">{property.owner?.name}</p>
                <p className="text-sm">Property Owner</p>
              </div>
            </div>
            {property.owner?.email && (
              <a
                href={`mailto:${property.owner.email}`}
                className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
              >
                <Mail size={16} /> {property.owner.email}
              </a>
            )}
            {property.owner?.phone && (
              <a
                href={`tel:${property.owner.phone}`}
                className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
              >
                <Phone size={16} /> +91 {property.owner.phone}
              </a>
            )}
          </div>

          <div className="space-y-3">
            {property.location?.coordinates?.coordinates && (
              <Link
                className="btn btn-outline w-full"
                href={`https://www.google.com/maps/search/?api=1&query=${property.location.coordinates.coordinates[0]},${property.location.coordinates.coordinates[1]}`}
                target="_blank"
              >
                View on Map
              </Link>
            )}
            {property.owner?.phone && (
              <Link
                className="btn btn-ghost w-full border-base-200"
                href={`https://wa.me/91${property.owner.phone}?text=Hi, I am interested in the property ${property.title}.`}
                target="_blank"
              >
                Chat on WhatsApp
              </Link>
            )}
            {property.owner?._id && (
              <Link
                href={`/messages/${property.owner._id}`}
                className="btn btn-accent w-full"
              >
                Message Owner
              </Link>
            )}
          </div>
        </div>
      </div>

      <dialog id="addReview" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content mb-6">
            Write a Review
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Rating</label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(prev => ({ ...prev, rating: index + 1 }))}
                    className="btn btn-ghost btn-sm p-0 hover:scale-110 transition-transform"
                    title={`Rate ${index + 1} stars`}
                  >
                    <Star
                      size={24}
                      className={`${
                        index < rating.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-base-content/20 hover:text-yellow-400"
                      } transition-colors`}
                    />
                  </button>
                ))}
                {rating.rating > 0 && (
                  <span className="text-sm text-base-content/70 ml-2">
                    {rating.rating} {rating.rating === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="label">Your Review</label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                placeholder="Share your experience..."
                value={rating.comment}
                onChange={(e) => {
                  setRating({ ...rating, comment: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.preventDefault();
                  addRating();
                }}
                disabled={!rating.rating || !rating.comment.trim()}
              >
                Submit Review
              </button>
              <button 
                className="btn"
                onClick={() => {
                  setRating({ rating: 0, comment: "" });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="addBooking" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content mb-6">
            Book {property.title}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                }}
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                }}
              />
            </div>
            <div>
              <label className="label">Total Amount</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={`₹${formData.totalAmount.toLocaleString()}`}
                readOnly
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={addBooking}
                disabled={!formData.startDate || !formData.endDate || formData.totalAmount <= 0}
              >
                Proceed to Payment
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="editReview" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content mb-6">
            Edit Your Review
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Rating</label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setEditingRating(prev => ({ ...prev, rating: index + 1 }))}
                    className="btn btn-ghost btn-sm p-0 hover:scale-110 transition-transform"
                    title={`Rate ${index + 1} stars`}
                  >
                    <Star
                      size={24}
                      className={`${
                        index < (editingRating?.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-base-content/20 hover:text-yellow-400"
                      } transition-colors`}
                    />
                  </button>
                ))}
                {editingRating?.rating > 0 && (
                  <span className="text-sm text-base-content/70 ml-2">
                    {editingRating.rating} {editingRating.rating === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="label">Your Review</label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                placeholder="Share your experience..."
                value={editingRating?.comment || ""}
                onChange={(e) => {
                  setEditingRating(prev => ({ ...prev, comment: e.target.value }));
                }}
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.preventDefault();
                  editRating();
                }}
                disabled={!editingRating?.rating || !editingRating?.comment?.trim()}
              >
                Update Review
              </button>
              <button 
                className="btn"
                onClick={() => {
                  setEditingRating(null);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </div>
  );
};

export default PropertyPage;
