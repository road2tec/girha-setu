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
    price: 0,
    type: "",
    bhks: 0,
    area: 0,
    amenities: [""],
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
        coordinates: [0.0, 0.0],
      },
    },
  });
  useEffect(() => {
    fetchFlat();
  }, []);
  const fetchFlat = async () => {
    const response = await axios.get(`/api/listings/get?id=${id}`);
    setListing(response.data.flat);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = axios.patch("/api/listings/edit", { listing });
    toast.promise(response, {
      loading: "Updating Listing...",
      success: "Listing Updated Successfully",
      error: "Failed to Update Listing",
    });
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          setListing((prev) => ({
            ...prev,
            address: {
              ...prev.location,
              coordinates: {
                type: "Point",
                coordinates: [
                  position.coords.latitude,
                  position.coords.longitude,
                ],
              },
            },
          }));
          toast.success("Location fetched successfully!");
        },
        (error) => console.error("Geolocation error:", error)
      );
      console.log(listing);
    } else {
      toast.error("Geolocation is not supported by this browser.");
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
          value={listing.title}
          onChange={(e) => {
            setListing({ ...listing, title: e.target.value });
          }}
          className="input input-bordered w-full"
          placeholder="Enter property title"
          required
        />
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-medium">Description</span>
        </div>
        <textarea
          value={listing.description}
          onChange={(e) => {
            setListing({ ...listing, description: e.target.value });
          }}
          className="textarea textarea-bordered w-full"
          placeholder="Enter property description"
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-medium">Price (₹)</span>
          </div>
          <input
            type="number"
            value={listing.price}
            onChange={(e) => {
              setListing({ ...listing, price: parseInt(e.target.value) });
            }}
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
            value={listing.type}
            onChange={(e) => {
              setListing({ ...listing, type: e.target.value });
            }}
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
          value={listing.location?.address}
          onChange={(e) => {
            setListing({
              ...listing,
              location: { ...listing.location, address: e.target.value },
            });
          }}
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
            onChange={(e) => {
              setListing({ ...listing, bhks: parseInt(e.target.value) });
            }}
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
            onChange={(e) => {
              setListing({ ...listing, area: parseInt(e.target.value) });
            }}
            className="input input-bordered w-full"
            min={100}
            required
          />
        </label>
      </div>

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
            onChange={(e) => {
              setListing({
                ...listing,
                location: { ...listing.location, city: e.target.value },
              });
            }}
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
            onChange={(e) => {
              setListing({
                ...listing,
                location: { ...listing.location, postalCode: e.target.value },
              });
            }}
            placeholder="Postal Code"
            className="input input-bordered w-full"
            required
          />
        </label>
      </div>

      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={fetchLocation}
      >
        Use My Current Location
      </button>

      <button type="submit" className="btn btn-primary w-full">
        Update Listing
      </button>
    </form>
  );
};

export default EditPage;
