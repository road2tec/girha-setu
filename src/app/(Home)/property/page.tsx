"use client";
import { Flat } from "@/types/flat";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, MapPin, Phone, Home, Ruler, Users } from "lucide-react";
import Link from "next/link";

const PropertyPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [property, setProperty] = useState<Flat>();
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-primary mb-4 uppercase">
        {property.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <img
          src={property.mainImage || "/placeholder.png"}
          alt={property.title}
          className="w-full h-80 object-contain rounded-lg shadow-lg bg-base-300"
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

          <button
            className="btn btn-primary w-full mt-6"
            onClick={() => router.push("/login")}
          >
            Rent Now
          </button>
          <Link
            className="btn btn-secondary w-full mt-2"
            href={`https://www.google.com/maps/search/?api=1&query=${property.location?.coordinates?.coordinates[0]},${property.location?.coordinates?.coordinates[1]}`}
            target="_blank"
          >
            View Location
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
