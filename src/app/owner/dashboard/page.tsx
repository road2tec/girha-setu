"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { HomeIcon, EyeIcon, ListIcon } from "lucide-react";
import { IconEye, IconHome, IconMoneybag } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const OwnerDashboard = () => {
  const [flats, setFlats] = useState([]);
  const { user } = useAuth();
  const [viewsData, setViewsData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    rented: 0,
    revenue: 0,
    views: 0,
  });

  useEffect(() => {
    const fetchFlats = async () => {
      const res = await fetch("/api/dashboard/owner");
      const data = await res.json();
      setStats(data);
      setFlats(data.flats);
      setViewsData(data.viewsData);
    };

    fetchFlats();
  }, []);

  const typeData = [
    {
      name: "Apartment",
      value: flats.filter((flat: any) => flat.type === "Apartment").length,
    },
    {
      name: "House",
      value: flats.filter((flat: any) => flat.type === "House").length,
    },
    {
      name: "Villa",
      value: flats.filter((flat: any) => flat.type === "Villa").length,
    },
    {
      name: "Penthouse",
      value: flats.filter((flat: any) => flat.type === "Penthouse").length,
    },
    {
      name: "Studio",
      value: flats.filter((flat: any) => flat.type === "Studio").length,
    },
    {
      name: "Office",
      value: flats.filter((flat: any) => flat.type === "Office").length,
    },
    {
      name: "Building",
      value: flats.filter((flat: any) => flat.type === "Building").length,
    },
    {
      name: "Townhouse",
      value: flats.filter((flat: any) => flat.type === "Townhouse").length,
    },
    {
      name: "Shop",
      value: flats.filter((flat: any) => flat.type === "Shop").length,
    },
    {
      name: "Garage",
      value: flats.filter((flat: any) => flat.type === "Garage").length,
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold text-center uppercase">
        Owner Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300 mt-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconHome className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Lisitings</div>
          <div className="stat-value text-primary">{stats.total}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconMoneybag className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-secondary">{stats.revenue}₹</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-accent">
            <IconEye className="h-8 w-8" />
          </div>
          <div className="stat-title">Flats in Wishlist</div>
          <div className="stat-value text-accent">{stats.views}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profilePicture} />
              </div>
            </div>
          </div>
          <div className="stat-value">
            {Math.round((stats.rented / flats.length) * 100)}%
          </div>
          <div className="stat-title">Flats Rented</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-base-200 p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">
            Flat in Wishlist
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">
            Listing Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
