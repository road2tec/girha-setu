"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";
import { 
  IconHome, 
  IconMapPin, 
  IconRuler, 
  IconBuildingSkyscraper,
  IconArmchair,
  IconCurrentLocation,
  IconUpload,
  IconPhoto,
  IconBed,
  IconBuildingEstate
} from "@tabler/icons-react";
import Link from "next/link";

interface ListingState {
  title: string;
  description: string;
  price: string;
  type: string;
  bhks: string;
  area: string;
  amenities: string[];
  mainImage: string;
  images: string[];
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  };
}

const initialListingState: ListingState = {
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
};

const AddListing = () => {
  const [listing, setListing] = useState<ListingState>({...initialListingState});
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    const imageResponse = axios.post("/api/helper/upload-img", formData);
    toast.promise(imageResponse, {
      loading: "Uploading Image...",
      success: (data: AxiosResponse) => {
        setListing(prev => ({
          ...prev,
          mainImage: data.data.data.url,
        }));
        setIsUploading(false);
        return "Image Uploaded Successfully";
      },
      error: (err: unknown) => {
        setIsUploading(false);
        return `This just happened: ${err}`;
      },
    });
  };

  const handleMultipleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 5) {
      toast.error("You can upload only 5 images at a time");
      return;
    }

    setIsUploading(true);
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB`);
        setIsUploading(false);
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
        setListing(prev => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
    setIsUploading(false);
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
          toast.success("Location captured successfully!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to get location. Please ensure location permissions are enabled.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = axios.post("/api/listings", { listing, user });
      toast.promise(response, {
        loading: "Listing Property...",
        success: () => {
          // Reset form after successful submission
          setListing({...initialListingState});
          return "Property listed successfully!";
        },
        error: "An error occurred while listing property.",
      });
    } catch (error) {
      toast.error("An error occurred while listing property.");
      console.log(error);
    }
  };

  const amenitiesList = [
    { name: "Parking", icon: <IconHome size={16} /> },
    { name: "Swimming Pool", icon: <IconHome size={16} /> },
    { name: "Gym", icon: <IconHome size={16} /> },
    { name: "Balcony", icon: <IconHome size={16} /> },
    { name: "Security", icon: <IconHome size={16} /> },
    { name: "Power Backup", icon: <IconHome size={16} /> },
    { name: "WiFi", icon: <IconHome size={16} /> },
    { name: "Garden", icon: <IconHome size={16} /> },
    { name: "Air Conditioning", icon: <IconHome size={16} /> },
    { name: "Furnished", icon: <IconArmchair size={16} /> },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 p-6 bg-base-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-base-content">List Your Property</h1>
        <Link href="/owner/listings" className="btn btn-outline btn-sm">
          View My Listings
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 rounded-xl shadow-sm p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Property Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <IconBuildingEstate size={20} className="text-primary" />
              Property Details
            </h2>

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
                className="textarea textarea-bordered w-full min-h-[120px]"
                placeholder="Enter property description"
                required
              />
            </label>

            {/* Price & Type */}
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Price (₹/month)</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={listing.price}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  min={0}
                  placeholder="e.g., 15000"
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

            {/* Bedrooms & Area */}
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium flex items-center gap-1">
                    <IconBed size={16} /> No. Of BHKs
                  </span>
                </div>
                <input
                  type="number"
                  name="bhks"
                  value={listing.bhks}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  min={1}
                  placeholder="e.g., 2"
                  required
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium flex items-center gap-1">
                    <IconRuler size={16} /> Area (sq. ft.)
                  </span>
                </div>
                <input
                  type="number"
                  name="area"
                  value={listing.area}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  min={100}
                  placeholder="e.g., 1200"
                  required
                />
              </label>
            </div>

            {/* Amenities */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Amenities</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {amenitiesList.map((amenity) => (
                  <label className="flex items-center gap-2 p-2 border border-base-300 rounded-lg hover:bg-base-200 transition-colors cursor-pointer" key={amenity.name}>
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity.name}
                      checked={listing.amenities.includes(amenity.name)}
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
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <div className="flex items-center gap-1.5">
                      {amenity.icon}
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Address & Images */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <IconMapPin size={20} className="text-primary" />
              Location & Media
            </h2>
          
            {/* Address */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Full Address</span>
              </div>
              <input
                type="text"
                name="address"
                value={listing.address.address}
                onChange={handleAddressChange}
                placeholder="Enter complete address"
                className="input input-bordered w-full"
                required
              />
            </label>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
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
                  className="select select-bordered w-full"
                  required
                  aria-label="Select state"
                  title="State selection"
                >
                  <option value="">Select State</option>
                  {STATES_IN_INDIA.map((state: string) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-control w-full">
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
                  placeholder="Enter city name"
                  required
                  aria-label="City name"
                  title="City name"
                />
              </label>
            </div>

            {/* Country and postal code */}
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Country</span>
                </div>
                <input
                  name="country"
                  value={listing.address.country}
                  disabled
                  readOnly
                  placeholder="Country"
                  className="input input-bordered w-full bg-base-200"
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Postal Code</span>
                </div>
                <input
                  type="text"
                  name="postalCode"
                  value={listing.address.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Enter postal code"
                  className="input input-bordered w-full"
                  required
                />
              </label>
            </div>

            {/* Geolocation Button */}
            <button
              type="button"
              className="btn btn-outline w-full flex items-center gap-2"
              onClick={fetchLocation}
            >
              <IconCurrentLocation size={18} />
              Use My Current Location
            </button>

            {/* Image Upload */}
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium border-b pb-2">Property Images</h3>
              
              <div className="flex flex-col gap-3">
                <label className="border border-dashed border-base-300 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <IconPhoto size={18} className="text-primary" />
                    Main Property Image
                  </div>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {listing.mainImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img src={listing.mainImage} alt="Main" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-success">Uploaded successfully</span>
                    </div>
                  )}
                </label>
                
                <label className="border border-dashed border-base-300 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <IconUpload size={18} className="text-primary" />
                    Additional Images (Max 5)
                  </div>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleMultipleImageChange}
                    accept="image/*"
                    multiple
                    max={5}
                  />
                  {listing.images.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-2 flex-wrap">
                        {listing.images.map((img, idx) => (
                          <div key={idx} className="w-10 h-10 rounded overflow-hidden">
                            <img src={img} alt={`Additional ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-success">{listing.images.length} additional image(s) uploaded</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-base-200">
          <button 
            type="submit" 
            className="btn btn-primary min-w-40"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </>
            ) : (
              "List Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListing;
