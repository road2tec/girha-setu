"use client";

import { useState, useEffect } from "react";
import { Trash2Icon, EditIcon, PlusIcon } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";

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
    axios.get("/api/flats").then((res) => setProperties(res.data));
  }, []);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/flats/${editingId}`, form);
    } else {
      await axios.post("/api/flats", form);
    }
    setEditingId(null);
    setForm(null);
    axios.get("/api/flats").then((res) => setProperties(res.data));
  };

  // Delete Property
  const handleDelete = async (id: string) => {
    await axios.delete(`/api/flats/${id}`);
    setProperties(properties.filter((p) => p._id !== id));
  };

  // Edit Property
  const handleEdit = (property: Flat) => {
    setForm(property);
    setEditingId(property._id!);
  };
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file as Blob);
      const imageResponse = axios.post("/api/helper/upload-img", formData);
      (document.getElementById("signup") as HTMLDialogElement).close();
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setForm({
            ...form,
            images: { url: data.data.data.url, caption: form.images.caption },
          });
          (document.getElementById("signup") as HTMLDialogElement).showModal();
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) =>
          `This just happened: ${err.response.data.error}`,
      });
    }
  };

  return (
    <div className="px-10 py-4">
      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="my_tabs"
          role="tab"
          className="tab text-lg checked:bg-base-100"
          style={{ width: "calc(70vw/3)", height: "50px", textAlign: "center" }}
          defaultChecked
          aria-label="View Listings"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-300 p-6 rounded-box space-y-4"
        >
          <h2 className="text-xl font-semibold">Existing Listings</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
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
                      <td>${property.price}</td>
                      <td>{property.type}</td>
                      <td>{property.area} sqft</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning mr-2"
                          onClick={() => handleEdit(property)}
                        >
                          <EditIcon size={16} />
                        </button>
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
        </div>

        {/* Add/Edit Property Tab */}
        <input
          type="radio"
          name="my_tabs"
          role="tab"
          className="tab text-lg checked:bg-base-100"
          style={{ width: "calc(70vw/3)", height: "50px", textAlign: "center" }}
          aria-label="Add/Edit Property"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-300 p-6 rounded-box"
        >
          <h2 className="text-xl font-semibold py-2 text-center">
            {editingId ? "Edit Property" : "Add New Property"}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Title */}
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="input input-bordered w-full"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              required
            ></textarea>

            {/* Price */}
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="input input-bordered w-full"
              required
            />

            {/* Property Type */}
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
            </select>

            {/* Location Fields */}
            <input
              type="text"
              name="location.address"
              value={form.location.address}
              onChange={handleChange}
              placeholder="Address"
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="location.city"
              value={form.location.city}
              onChange={handleChange}
              placeholder="City"
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="location.state"
              value={form.location.state}
              onChange={handleChange}
              placeholder="State"
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="location.country"
              value={form.location.country}
              onChange={handleChange}
              placeholder="Country"
              className="input input-bordered w-full"
              required
            />

            {/* Coordinates (Lat, Long) */}
            <div className="flex space-x-2">
              <input
                type="number"
                name="location.coordinates[0]"
                value={form.location.coordinates[0]}
                onChange={handleChange}
                placeholder="Latitude"
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                name="location.coordinates[1]"
                value={form.location.coordinates[1]}
                onChange={handleChange}
                placeholder="Longitude"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Owner */}
            <input
              type="text"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              placeholder="Owner"
              className="input input-bordered w-full"
              required
            />

            {/* Broker */}
            <input
              type="text"
              name="broker"
              value={form.broker}
              onChange={handleChange}
              placeholder="Broker"
              className="input input-bordered w-full"
            />

            {/* Images */}
            <div className="mb-8">
              <label
                htmlFor="profileImageUrl"
                className="mb-3 block text-sm text-base-content"
              >
                Upload Your Nice Photo
              </label>
              <div className="w-full rounded-sm border border-stroke bg-base-200 text-base-content px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary">
                <p>Drag & drop an image here, or click to upload</p>
                <input
                  type="file"
                  name="profileImageUrl"
                  id="profileImageUrl"
                  accept="image/* .png .jpeg .jpg"
                  onChange={handleProfileImageChange}
                />
              </div>
            </div>
            <input
              type="text"
              name="images[0].caption"
              value={form.images.caption}
              onChange={handleChange}
              placeholder="Image Caption"
              className="input input-bordered w-full"
            />

            {/* Amenities */}
            <select
              name="amenities"
              multiple
              value={form.amenities.map((amenity) => amenity.type)}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Parking">Parking</option>
              <option value="Swimming Pool">Swimming Pool</option>
              <option value="Gym">Gym</option>
              <option value="Balcony">Balcony</option>
              <option value="Security">Security</option>
              <option value="Power Backup">Power Backup</option>
              <option value="WiFi">WiFi</option>
              <option value="Garden">Garden</option>
            </select>

            {/* Bedrooms */}
            <input
              type="number"
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              placeholder="Bedrooms"
              className="input input-bordered w-full"
              required
            />

            {/* Bathrooms */}
            <input
              type="number"
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              placeholder="Bathrooms"
              className="input input-bordered w-full"
              required
            />

            {/* Area (sqft) */}
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Area (sqft)"
              className="input input-bordered w-full"
              required
            />

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability"
                checked={form.availability}
                onChange={handleChange}
                className="checkbox"
              />
              <label htmlFor="availability" className="text-sm">
                Available
              </label>
            </div>

            {/* Availability Calendar */}
            <input
              type="date"
              name="availabilityCalendar[0].date"
              value={
                form.availabilityCalendar[0].date.toISOString().split("T")[0]
              }
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <select
              name="availabilityCalendar[0].available"
              value={form.availabilityCalendar[0].available.toString()}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              {editingId ? "Update Property" : "Add Property"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageListing;
