"use client";
import { Flat } from "@/types/flat";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";
import axios, { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
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
    location: {
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
  useEffect(() => {
    fetchFlat();
  }, []);
  const fetchFlat = async () => {
    const response = await axios.get(`/api/listings/get?id=${id}`);
    setListing(response.data.flat);
    console.log(response.data.flat);
  };
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = axios.put("/api/listings/edit", { listing });
    toast.promise(response, {
      loading: "Updating Listing...",
      success: "Listing Updated Successfully",
      error: "Failed to Update Listing",
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

  return (
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
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Studio">Studio</option>
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
          value={listing.location?.address}
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
            value={listing.location?.state}
            onChange={(e) => {
              setListing({
                ...listing,
                location: { ...listing.location, state: e.target.value },
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
          <select
            name="city"
            value={listing.location?.city}
            onChange={handleAddressChange}
            className="input input-bordered w-full"
            required
          >
            <option defaultChecked>Select Your Location</option>
            {listing.location?.state &&
              popularCitiesOrDistricts[listing.location.state].map(
                (city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                )
              )}
          </select>
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
            value={listing.location?.country}
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
            value={listing.location?.postalCode}
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

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-full">
        {"List Property"}
      </button>
    </form>
  );
};

export default EditPage;
