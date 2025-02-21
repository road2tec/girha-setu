"use client";
import { Flat } from "@/types/flat";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, MapPin, Phone, Home, Ruler, Users } from "lucide-react";

const PropertyPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [property, setProperty] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Flat Details
  useEffect(() => {
    if (!id) return;
    const fetchFlat = async () => {
      try {
        const response = await axios.get(`/api/listings/get?id=${id}`);
        setProperty(response.data.flat);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlat();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!property) return <p className="text-center py-10">Property Not Found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-primary mb-4">{property.title}</h1>

      {/* Images Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <img
          src={property.mainImage || "/placeholder.png"}
          alt={property.title}
          className="w-full h-80 object-cover rounded-lg shadow-lg"
        />
        <div className="grid grid-cols-2 gap-2">
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

      {/* Flat Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 bg-base-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            Details
          </h2>
          <p className="text-lg font-bold text-gray-700">
            ₹ {property.price.toLocaleString()}/month
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-600 mt-4">
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
          <p className="text-gray-600 mt-2">{property.description}</p>

          <h2 className="text-xl font-semibold text-secondary mt-6">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {property.amenities.map((amenity, index) => (
              <span key={index} className="badge badge-outline">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Owner & Rent Now Section */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Owner Details
          </h2>
          <p className="flex items-center gap-2 text-gray-700">
            <Mail size={18} /> {property.owner?.email}
          </p>
          <p className="flex items-center gap-2 text-gray-700 mt-2">
            <Phone size={18} /> +91 9876543210 {/* Mock Phone */}
          </p>

          <button
            className="btn btn-primary w-full mt-6"
            onClick={() => router.push("/login")}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
