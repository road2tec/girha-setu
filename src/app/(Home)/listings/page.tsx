"use client";
import { Flat } from "@/types/flat";
import axios from "axios";
import { MessageCircle, Phone, MapPin, Home, Ruler } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Properties = () => {
  const searchParams = useSearchParams();
  const amenities = searchParams.get("keyword");
  const location = searchParams.get("location");
  const propertyType = searchParams.get("propertyType");
  const [properties, setProperties] = useState<Flat[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.post("/api/listings/getListingByParams", {
          location,
          propertyType,
          amenities,
        });
        setProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  if (properties.length === 0)
    return (
      <Suspense fallback>
        <div className="text-center py-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-primary uppercase text-center mt-4">
            Available Properties
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
      </Suspense>
    );

  return (
    <Suspense fallback>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary uppercase text-center mb-8">
          Available Properties
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="card bg-base-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300"
            >
              <figure>
                <img
                  src={property.mainImage || "/placeholder.png"}
                  alt={property.title}
                  className="h-48 w-full object-contain"
                />
              </figure>
              <div className="p-5">
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-base-content">{property.description}</p>
                <p className="text-base-content flex items-center gap-2 mt-2">
                  <MapPin size={16} /> {property.location?.city},{" "}
                  {property.location?.state}
                </p>
                <p className="text-lg font-bold mt-2 text-secondary">
                  ₹ {property.price.toLocaleString()} / month
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4 text-base-content/80">
                  <span className="flex items-center gap-1">
                    <Home size={16} /> {property.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler size={16} /> {property.area} sq.ft
                  </span>
                </div>

                <div className="mt-4 bg-base-200 p-3 rounded-md">
                  <p className="text-sm font-semibold">
                    Owner: {property.owner?.name}
                  </p>
                  <a
                    href={`mailto:${property.owner?.email}`}
                    className="text-primary flex items-center gap-1 text-sm"
                  >
                    <MessageCircle size={14} /> {property.owner?.email}
                  </a>
                  <a
                    href={`tel:${property.owner?.phone}`}
                    className="text-primary flex items-center gap-1 text-sm mt-1"
                  >
                    <Phone size={14} /> {property.owner?.phone || "N/A"}
                  </a>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/property?id=${property._id}`}
                    className="btn btn-primary w-full flex items-center justify-center gap-1"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading listings...</div>}>
      <Properties />
    </Suspense>
  );
}

export default Page;
