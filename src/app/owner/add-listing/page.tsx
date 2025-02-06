"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { Flat } from "@/types/flat";
import { useAuth } from "@/context/AuthProvider";

const AddListing = () => {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    amenities: [],
    images: "",
    address: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });
  const { user } = useAuth();

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  // Handle address input
  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setListing((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // Handle multi-image upload
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }
    console.log(file);
    const formData = new FormData();
    formData.append("file", file as Blob);
    const imageResponse = axios.post("/api/helper/upload-img", formData);
    toast.promise(imageResponse, {
      loading: "Uploading Image...",
      success: (data: AxiosResponse) => {
        setListing({
          ...listing,
          images: data.data.data.url,
        });
        return "Image Uploaded Successfully";
      },
      error: (err: unknown) => `This just happened: ${err}`,
    });
  };

  // Handle geolocation API
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setListing((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              coordinates: {
                type: "Point",
                coordinates: [
                  position.coords.latitude,
                  position.coords.longitude,
                ],
              },
            },
          }));
        },
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(listing);
    try {
      const response = axios.post("/api/listings", { listing, user });
      toast.promise(response, {
        loading: "Listing Property...",
        success: "Property listed successfully!",
        error: "An error occurred while listing property.",
      });
      //   setListing({
      //     title: "",
      //     description: "",
      //     price: "",
      //     type: "",
      //     bedrooms: "",
      //     bathrooms: "",
      //     area: "",
      //     amenities: [],
      //     images: [],
      //     address: {
      //       address: "",
      //       city: "",
      //       state: "",
      //       country: "",
      //       postalCode: "",
      //       coordinates: [0, 0],
      //     },
      //   });
    } catch (error) {
      toast.error("An error occurred while listing property.");
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-6">
        List Your Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-base-content p-10 rounded-md"
      >
        {/* Title */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Title</span>
          </div>
          <input
            type="text"
            name="title"
            value={listing.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter property title"
            required
          />
        </label>

        {/* Description */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Description</span>
          </div>
          <textarea
            name="description"
            value={listing.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter property description"
            required
          />
        </label>

        {/* Price & Type */}
        <div className="grid grid-cols-2 gap-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Price (₹)</span>
            </div>
            <input
              type="number"
              name="price"
              value={listing.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Property Type</span>
            </div>
            <select
              name="type"
              value={listing.type}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
            </select>
          </label>
        </div>

        {/* <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Amenities</span>
          </div>
          <select
            name="type"
            onChange={(e) => {
              setListing({
                ...listing,
                amenities: amenities.push(e.target.value),
              });
            }}
            multiple
            className="select select-bordered w-full"
            required
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
        </label> */}

        <label htmlFor="" className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Address</span>
          </div>
          <input
            type="text"
            name="address"
            value={listing.address.address}
            onChange={handleAddressChange}
            placeholder="Address"
            className="input input-bordered w-full"
            required
          />
        </label>

        {/* Bedrooms, Bathrooms & Area */}
        <div className="grid grid-cols-3 gap-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Bedrooms</span>
            </div>
            <input
              type="number"
              name="bedrooms"
              value={listing.bedrooms}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Bathrooms</span>
            </div>
            <input
              type="number"
              name="bathrooms"
              value={listing.bathrooms}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Area (sq. ft.)</span>
            </div>
            <input
              type="number"
              name="area"
              value={listing.area}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </label>
        </div>

        {/* Address Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">City</span>
            </div>
            <input
              type="text"
              name="city"
              value={listing.address.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="input input-bordered w-full"
              required
            />
          </label>
          <label htmlFor="">
            <div className="label">
              <span className="label-text font-medium">State</span>
            </div>
            <input
              type="text"
              name="state"
              value={listing.address.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="input input-bordered w-full"
              required
            />
          </label>
        </div>

        {/* Country and postal code */}
        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Country</span>
            </div>
            <input
              type="text"
              name="country"
              value={listing.address.country}
              onChange={handleAddressChange}
              placeholder="Country"
              className="input input-bordered w-full"
              required
            />
          </label>
          <label htmlFor="">
            <div className="label">
              <span className="label-text font-medium">Postal Code</span>
            </div>
            <input
              type="text"
              name="postalCode"
              value={listing.address.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              className="input input-bordered w-full"
              required
            />
          </label>
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={fetchLocation}
        >
          Use My Current Location
        </button>

        {/* Image Upload */}
        <label className="block text-sm font-medium text-base-content">
          <div className="label">
            <span className="label-text font-medium">Upload an Image</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          {"List Property"}
        </button>
      </form>
    </div>
  );
};

export default AddListing;
