"use client";

import { useState, useEffect } from "react";
import { Trash2Icon, EditIcon, PlusIcon } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import Link from "next/link";

const ManageListing = () => {
  const [properties, setProperties] = useState<Flat[]>([]);
  const [form, setForm] = useState<Flat>({
    title: "",
    description: "",
    price: 0,
    type: "Apartment",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      coordinates: [0, 0],
    },
    owner: "",
    broker: "",
    images: [{ url: "", caption: "" }],
    amenities: [
      {
        type: "Parking",
        enum: [
          "Parking",
          "Swimming Pool",
          "Gym",
          "Balcony",
          "Security",
          "Power Backup",
          "WiFi",
          "Garden",
        ],
      },
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    availability: true,
    availabilityCalendar: [{ date: new Date(), available: true }],
    favoritesCount: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/listings/allListings")
      .then((res) => setProperties(res.data.flats));
  }, []);

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = axios.delete(`/api/listings/delete?id=${listingId}`);
      toast.promise(res, {
        loading: "Deleting listing...",
        success: () => {
          axios
            .get("/api/listings/allListings")
            .then((res) => setProperties(res.data.flats));
          return "Listing deleted successfully.";
        },
        error: "Error deleting listing.",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };
  const handleEdit = (property: Flat) => {
    setForm(property);
    setEditingId(property._id!);
  };

  return (
    <>
      <h1 className="uppercase text-3xl text-center font-semibold mb-6">
        Manage Listings
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-300 rounded-lg w-full">
          <thead>
            <tr className="text-base">
              <th>Title</th>
              <th>Price</th>
              <th>Type</th>
              <th>Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length !== 0 ? (
              properties.map((property) => (
                <tr key={property._id}>
                  <td>{property.title}</td>
                  <td>₹{property.price} /month</td>
                  <td>{property.type}</td>
                  <td>{property.area} sqft</td>
                  <td>
                    <Link
                      href={`/admin/edit?id=${property._id}`}
                      className="btn btn-sm btn-warning mr-2"
                    >
                      <EditIcon size={16} />
                    </Link>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(property._id)}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-base h-[50vh]">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageListing;
