"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit, Search, Building, Plus, Filter, RefreshCw, Settings, Home, MapPin, DollarSign } from "lucide-react";
import axios from "axios";
import { Flat } from "@/types/flat";
import toast from "react-hot-toast";
import Link from "next/link";

const ManageListing = () => {
  const [properties, setProperties] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/listings/allListings");
      setProperties(response.data.flats);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = axios.delete(`/api/listings/delete?id=${listingId}`);
      toast.promise(res, {
        loading: "Deleting listing...",
        success: () => {
          fetchListings();
          return "Listing deleted successfully.";
        },
        error: "Error deleting listing.",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const filteredProperties = properties.filter(property => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = filterType === null || property.type === filterType;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'area-low') {
      return a.area - b.area;
    } else if (sortBy === 'area-high') {
      return b.area - a.area;
    }
    return 0;
  });

  const propertyTypes = ["Apartment", "House", "Villa", "Cottage", "Studio"];
  const sortOptions = [
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Area: Low to High", value: "area-low" },
    { label: "Area: High to Low", value: "area-high" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8 bg-base-200 min-h-screen">
      {/* Header with title and actions */}
      <div className="bg-base-100 rounded-2xl p-7 mb-8 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-1">
            Property Management
          </h1>
          <p className="text-base-content/70">
            View, edit, and manage all property listings
          </p>
        </div>
        <div className="flex items-center gap-3">
      
          <button 
            onClick={() => fetchListings()} 
            className="btn btn-circle btn-ghost"
            aria-label="Refresh property listings"
          >
            <RefreshCw size={20} />
          </button>
          
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-base-100 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Search by title, city, or type..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Filter size={18} />
                Property Type
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setFilterType(null)} className={filterType === null ? 'active' : ''}>All Types</a></li>
                {propertyTypes.map(type => (
                  <li key={type}>
                    <a onClick={() => setFilterType(type)} className={filterType === type ? 'active' : ''}>
                      {type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Filter size={18} />
                Sort By
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setSortBy(null)} className={sortBy === null ? 'active' : ''}>Default</a></li>
                {sortOptions.map(option => (
                  <li key={option.value}>
                    <a onClick={() => setSortBy(option.value)} className={sortBy === option.value ? 'active' : ''}>
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {(searchTerm || filterType !== null || sortBy !== null) && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType(null);
                  setSortBy(null);
                }}
                className="btn btn-outline btn-error gap-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Property stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Total Properties</p>
              <p className="text-2xl font-bold">{properties.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Apartments</p>
              <p className="text-2xl font-bold">{properties.filter(prop => prop.type === 'Apartment').length}</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <Building size={24} className="text-violet-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Houses</p>
              <p className="text-2xl font-bold">{properties.filter(prop => prop.type === 'House').length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Home size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Average Price</p>
              <p className="text-2xl font-bold">₹{properties.length ? Math.round(properties.reduce((acc, prop) => acc + prop.price, 0) / properties.length).toLocaleString() : 0}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <DollarSign size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Properties table */}
      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="bg-base-200">Property</th>
                <th className="bg-base-200">Location</th>
                <th className="bg-base-200">Details</th>
                <th className="bg-base-200">Price</th>
                <th className="bg-base-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <tr key={property._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={property.mainImage || property.images?.[0]?.url || "/placeholder-property.jpg"} alt={property.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm opacity-70">{property.type}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-base-content/60" />
                        <span>{property.location.city}, {property.location.state}</span>
                      </div>
                      <div className="text-xs opacity-70 mt-1">{property.location.address}</div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="text-xs opacity-70">Area:</span>
                            <span className="font-medium">{property.area} sqft</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-xs opacity-70">Bed:</span>
                            <span className="font-medium">{property.bedrooms}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-xs opacity-70">Bath:</span>
                            <span className="font-medium">{property.bathrooms}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-lg font-semibold">₹{property.price.toLocaleString()}</div>
                      <div className="text-xs opacity-70">per month</div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/edit?id=${property._id}`}
                          className="btn btn-sm bg-blue-50 hover:bg-blue-100 text-blue-800 border-none"
                          aria-label={`Edit ${property.title}`}
                        >
                          <Edit size={16} className="text-blue-600" />
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-800 border-none"
                          onClick={() => handleDelete(property._id!)}
                          aria-label={`Delete ${property.title}`}
                        >
                          <Trash2 size={16} className="text-rose-600" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <Building size={48} className="mb-2 opacity-50" />
                      <p className="font-medium">No properties found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-base-200">
          <div className="text-sm text-base-content/70">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-ghost">Previous</button>
            <button className="btn btn-sm btn-primary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageListing;
