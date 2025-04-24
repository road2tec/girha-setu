"use client";
import { useAuth } from "@/context/AuthProvider";
import { Flat } from "@/types/flat";
import { IconBuilding, IconUser } from "@tabler/icons-react";
import { HomeIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const locations = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
];
const propertyTypes = [
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
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#a4de6c",
  "#8dd1e1",
  "#83a6ed",
  "#ffbb28",
  "#ff8042",
  "#d88884",
];

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    buyers: 0,
    owners: 0,
    listings: 0,
    feedback: 0,
  });
  const [flats, setFlats] = useState<Flat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setFlats(data.flats || []);
      setDashboardData({
        users: data.users,
        buyers: data.buyers,
        owners: data.owners,
        listings: data.listings,
        feedback: data.feedback,
      });
    };
    fetchData();
  }, []);

  const flatLocationData = locations.map((location) => ({
    name: location,
    count: flats.filter((flat) => flat.location.city === location).length,
  }));

  const flatPropertyTypeData = propertyTypes.map((type, index) => ({
    name: type,
    value: flats.filter((flat) => flat.type === type).length,
  }));

  return (
    <>
      <h1 className="text-3xl uppercase text-center font-semibold">
        Admin Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300 mt-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconUser className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{dashboardData.users}</div>
          <div className="stat-desc">Includes buyers and owners</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <UsersIcon className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Buyers</div>
          <div className="stat-value text-secondary">
            {dashboardData.buyers}
          </div>
          <div className="stat-desc">Users looking for flats</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <HomeIcon className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Owners</div>
          <div className="stat-value text-accent">{dashboardData.owners}</div>
          <div className="stat-desc">Flat owners registered</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <IconBuilding className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Listings</div>
          <div className="stat-value text-info">{dashboardData.listings}</div>
          <div className="stat-desc">Available flats</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profilePicture} alt="admin-avatar" />
              </div>
            </div>
          </div>
          <div className="stat-title">Feedbacks</div>
          <div className="stat-value text-warning">
            {dashboardData.feedback}
          </div>
          <div className="stat-desc">Collected from users</div>
        </div>
      </div>

      <div className="flex mt-8 gap-3 w-full">
        <div className="bg-base-200 rounded-xl p-4 shadow-md w-1/2">
          <h2 className="text-xl font-semibold text-center mb-4">
            Flats by Location
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={flatLocationData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Flats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-200 rounded-xl p-4 shadow-md w-1/2">
          <h2 className="text-xl font-semibold text-center mb-4">
            Property Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={flatPropertyTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {flatPropertyTypeData.map((entry, index) => (
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

export default Dashboard;
