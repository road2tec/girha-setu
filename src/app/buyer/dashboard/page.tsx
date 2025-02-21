"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { IconHeart, IconHome, IconMapPin, IconUser } from "@tabler/icons-react";
import { Flat } from "@/types/flat";

const BuyersDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchPurchases();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist/getWishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`/api/purchases?userId=${user?.id}`);
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 uppercase text-center">
        Hello, {user?.name}
      </h1>

      {/* Wishlist Section */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 uppercase">
          <IconHeart size={20} /> Wishlist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {wishlist.length > 0 ? (
            wishlist.map((listing: Flat) => (
              <Link href={`property?id=${listing._id}`} key={listing._id}>
                <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden relative">
                  <figure>
                    <img
                      src={listing.mainImage || "/placeholder.png"}
                      alt={listing.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{listing.title}</h2>
                    <p className="text-base-content/50">
                      {listing.location?.city}, {listing.location?.state}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ₹ {listing.price.toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="btn btn-sm btn-primary flex items-center gap-1">
                        <IconMapPin size={16} /> View on Map
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No items in wishlist.</p>
          )}
        </div>
      </div>

      {/* Purchase History Section */}
      {/* <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconHome size={20} /> Purchase History
        </h2>
        <div className="mt-4">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <div key={purchase._id} className="p-3 border-b border-gray-300">
                <h3 className="text-lg font-medium">
                  {purchase.propertyTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  Purchased on {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No purchases yet.</p>
          )}
        </div>
      </div> */}
    </>
  );
};

export default BuyersDashboard;
