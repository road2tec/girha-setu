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
  const [property, setProperty] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <p className="text-center py-10 text-base-content">Loading...</p>;
  if (!property)
    return (
      <p className="text-center py-10 text-base-content">Property Not Found</p>
    );

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-6">
        {property.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <img
          src={property.mainImage || "/placeholder.png"}
          alt={property.title}
          className="w-full h-96 object-cover rounded-xl shadow-xl"
        />
        <div className="grid grid-cols-2 gap-3">
          {property.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Flat Image ${index + 1}`}
              className="w-full h-44 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-base-300 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Property Details
          </h2>
          <p className="text-2xl font-bold text-base-content">
            ₹ {property.price.toLocaleString()}/month
          </p>

          <div className="grid grid-cols-2 gap-4 text-lg text-base-content/80 mt-6">
            <div className="flex items-center gap-2">
              <Home size={22} /> {property.type}
            </div>
            <div className="flex items-center gap-2">
              <Users size={22} /> {property.bhks} BHK
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={22} /> {property.area} sq.ft
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={22} /> {property.location?.city},{" "}
              {property.location?.state}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-secondary mt-8">
            Description
          </h2>
          <p className="text-base-content/80 mt-2 leading-relaxed">
            {property.description}
          </p>

          <h2 className="text-xl font-semibold text-secondary mt-8">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-3 mt-3">
            {property.amenities.map((amenity, index) => (
              <span
                key={index}
                className="badge badge-outline py-2 px-3 text-base-content"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-base-200 p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Owner Details
          </h2>
          <p className="flex items-center gap-2 text-base-content/90">
            <Mail size={20} /> {property.owner?.email}
          </p>
          <p className="flex items-center gap-2 text-base-content/90 mt-3">
            <Phone size={20} /> {property.owner.phone}
          </p>

          <button
            className="btn btn-primary w-full mt-6 text-lg font-semibold rounded-lg"
            onClick={() => router.push("/login")}
          >
            Rent Now
          </button>
          <Link
            href={`messages/${property.owner._id}`}
            className="btn btn-accent mt-3"
          >
            Chat Now and book
          </Link>
        </div>
      </div>
    </>
  );
};

export default PropertyPage;
