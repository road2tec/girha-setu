"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";

const AddListing = () => {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    bhks: "",
    area: "",
    amenities: [],
    mainImage: "",
    images: [],
    address: {
      address: "",
      city: "",
      state: "",
      country: "India",
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

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setListing((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

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
          mainImage: data.data.data.url,
        });
        return "Image Uploaded Successfully";
      },
      error: (err: unknown) => `This just happened: ${err}`,
    });
  };
  // Handle multi-image upload
  const handleMultipleImageChange = async (e: any) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate number of images
    if (files.length > 5) {
      toast.error("You can upload only 5 images at a time");
      return;
    }

    const uploadedImages: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB`);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await toast.promise(
          axios.post("/api/helper/upload-img", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: `Uploading ${file.name}...`,
            success: `${file.name} uploaded successfully!`,
            error: `Failed to upload ${file.name}`,
          }
        );

        const imageUrl = response.data.data.secure_url;
        uploadedImages.push(imageUrl);

        // Update state after each upload
        setListing((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
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
    try {
      const response = axios.post("/api/listings", { listing, user });
      toast.promise(response, {
        loading: "Listing Property...",
        success: "Property listed successfully!",
        error: "An error occurred while listing property.",
      });
    } catch (error) {
      toast.error("An error occurred while listing property.");
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        List Your Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-base-content p-10 rounded-md"
      >
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
              min={0}
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
              <option value="">Select Property Type</option>
              {[
                "Apartment",
                "House",
                "Villa",
                "Penthouse",
                "Studio",
                "Office",
                "Building",
                "Townhouse",
                "Shop",
                "Garage",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Amenities</span>
          </div>
          <div className="flex flex-wrap gap-4 flex-row">
            {[
              "Parking",
              "Swimming Pool",
              "Gym",
              "Balcony",
              "Security",
              "Power Backup",
              "WiFi",
              "Garden",
              "Air Conditioning",
              "Furnished",
            ].map((amenity) => (
              <label className="form-control" key={amenity}>
                <div className="label">
                  <span className="label-text font-medium">{amenity}</span>
                </div>
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setListing({
                        ...listing,
                        amenities: [...listing.amenities, e.target.value],
                      });
                    } else {
                      setListing({
                        ...listing,
                        amenities: listing.amenities.filter(
                          (a) => a !== e.target.value
                        ),
                      });
                    }
                  }}
                  className="checkbox checkbox-primary"
                />
              </label>
            ))}
          </div>
        </label>

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
              <span className="label-text font-medium">No. Of BHKs</span>
            </div>
            <input
              type="number"
              name="bhks"
              value={listing.bhks}
              onChange={handleChange}
              className="input input-bordered w-full"
              min={1}
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
              min={100}
              required
            />
          </label>
        </div>

        {/* Address Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="">
            <div className="label">
              <span className="label-text font-medium">State</span>
            </div>
            <select
              value={listing.address.state}
              onChange={(e) => {
                setListing({
                  ...listing,
                  address: { ...listing.address, state: e.target.value },
                });
              }}
              className="input input-bordered w-full"
            >
              <option defaultChecked>Select State</option>
              {STATES_IN_INDIA.map((state: string) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">City</span>
            </div>
            <input
              name="city"
              value={listing.address.city}
              onChange={(e) => {
                setListing({
                  ...listing,
                  address: {
                    ...listing.address,
                    city: e.target.value.toLowerCase(),
                  },
                });
              }}
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
              name="country"
              value={listing.address.country}
              disabled
              readOnly
              placeholder="Country"
              className="input input-bordered w-full"
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
            <span className="label-text font-medium">This is Main Image</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </label>
        <label className="block text-sm font-medium text-base-content">
          <div className="label">
            <span className="label-text font-medium">
              Upload Multiple Images
            </span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleMultipleImageChange}
            accept="image/*"
            multiple
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          {"List Property"}
        </button>
      </form>
    </>
  );
};

export default AddListing;
