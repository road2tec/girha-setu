"use client";
import { useAuth } from "@/context/AuthProvider";
import { Flat } from "@/types/flat";
import { IconBuilding, IconUser } from "@tabler/icons-react";
import { HomeIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { IconMapPin, IconMessageCircle, IconHome, IconBuildingSkyscraper, IconBuildingCottage, IconBuildingEstate, IconBuildingArch } from "@tabler/icons-react";

const COLORS = [
  "#2563eb", // Royal Blue
  "#16a34a", // Emerald Green
  "#8b5cf6", // Purple
  "#ea580c", // Burnt Orange
  "#0891b2", // Teal
  "#be185d", // Deep Pink
  "#059669", // Green
  "#7c3aed", // Violet
  "#0284c7", // Sky Blue
  "#9333ea", // Bright Purple
  "#15803d", // Forest Green
  "#c2410c", // Dark Orange
];

// Property type icons mapping
const PROPERTY_ICONS: { [key: string]: any } = {
  'Apartment': IconBuildingSkyscraper,
  'House': IconHome,
  'Villa': IconBuildingEstate,
  'Cottage': IconBuildingCottage,
  'Studio': IconBuildingArch,
  'default': IconBuilding
};

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

  // Get unique cities and their property counts
  const cityData = Array.from(
    flats.reduce((map, flat) => {
      const city = flat.location.city;
      map.set(city, (map.get(city) || 0) + 1);
      return map;
    }, new Map())
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Get property type distribution with percentage
  const totalProperties = flats.length;
  const propertyTypeData = Array.from(
    flats.reduce((map, flat) => {
      const type = flat.type;
      map.set(type, (map.get(type) || 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([name, value]) => ({
      name,
      value,
      percentage: (Number(value) / (totalProperties || 1) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  // Get monthly trend data
  const monthlyData = Array.from(
    flats.reduce((map, flat) => {
      const date = new Date(flat.createdAt!);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      map.set(monthYear, (map.get(monthYear) || 0) + 1);
      return map;
    }, new Map())
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const dateA = new Date(a.name).getTime();
      const dateB = new Date(b.name).getTime();
      return dateA - dateB;
    });

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 p-6 bg-base-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-base-content">
          Admin Dashboard
        </h1>
        <div className="avatar online">
          <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={user?.profilePicture} alt="admin-avatar" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <IconUser size={24} className="text-blue-600" />
            </div>
            <div className="text-base font-medium text-blue-600">Total Users</div>
          </div>
          <div className="text-4xl font-bold text-base-content">{dashboardData.users}</div>
          <div className="text-base text-blue-600/80 mt-2">Active on Platform</div>
        </div>

        <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <UsersIcon size={24} className="text-emerald-600" />
            </div>
            <div className="text-base font-medium text-emerald-600">Buyers</div>
          </div>
          <div className="text-4xl font-bold text-base-content">{dashboardData.buyers}</div>
          <div className="text-base text-emerald-600/80 mt-2">Looking for Properties</div>
        </div>

        <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-violet-50 rounded-lg">
              <HomeIcon size={24} className="text-violet-600" />
            </div>
            <div className="text-base font-medium text-violet-600">Owners</div>
          </div>
          <div className="text-4xl font-bold text-base-content">{dashboardData.owners}</div>
          <div className="text-base text-violet-600/80 mt-2">Property Owners</div>
        </div>

        <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 rounded-lg">
              <IconBuilding size={24} className="text-orange-600" />
            </div>
            <div className="text-base font-medium text-orange-600">Listings</div>
          </div>
          <div className="text-4xl font-bold text-base-content">{dashboardData.listings}</div>
          <div className="text-base text-orange-600/80 mt-2">Active Properties</div>
        </div>

        <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-pink-50 rounded-lg">
              <IconMessageCircle size={24} className="text-pink-600" />
            </div>
            <div className="text-base font-medium text-pink-600">Feedback</div>
          </div>
          <div className="text-4xl font-bold text-base-content">{dashboardData.feedback}</div>
          <div className="text-base text-pink-600/80 mt-2">User Reviews</div>
        </div>
      </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
          <h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
            <IconBuilding className="text-primary" size={20} />
            Monthly Property Growth
          </h2>
          <div className="grid gap-4">
            {monthlyData.slice(-6).map((month, index) => (
              <div 
                key={month.name} 
                className="bg-base-200 p-4 rounded-lg text-center transform hover:scale-105 transition-transform"
                style={{ 
                  borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                  background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}10, transparent)`
                }}
              >
                <div className="text-sm font-medium text-base-content/80">{month.name}</div>
                <div className="text-2xl font-bold mt-2 text-base-content">{month.value}</div>
                <div className="text-xs text-base-content/60">Properties</div>
              </div>
            ))}
          </div>
        </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Property Growth Cards */}
      

       

        {/* Property Type Distribution - Cards */}
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
          <h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
            <IconBuilding className="text-primary" size={20} />
            Property Types
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {propertyTypeData.map((type, index) => {
              const IconComponent = PROPERTY_ICONS[type.name] || PROPERTY_ICONS.default;
              const color = COLORS[index % COLORS.length];
              return (
                <div
                  key={type.name}
                  className="bg-base-200 p-4 rounded-lg transform hover:scale-105 transition-transform"
                  style={{ 
                    borderLeft: `4px solid ${color}`,
                    background: `linear-gradient(to right, ${color}10, transparent)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                      <IconComponent size={24} style={{ color }} />
                    </div>
                    <span className="font-medium text-base-content">{type.name}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold text-base-content">{type.value}</div>
                      <div className="text-xs text-base-content/60">Properties</div>
                    </div>
                    <div className="text-sm font-medium" style={{ color }}>
                      {type.percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City-wise Distribution - Modern Layout */}
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
          <h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
            <IconMapPin className="text-primary" size={20} />
            Properties by City
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {cityData.map((city, index) => {
              const color = COLORS[index % COLORS.length];
              const isLargeCard = index < 2;
              
              return (
                <div
                  key={city.name}
                  className="relative group"
                >
                  <div 
                    className="absolute inset-0 rounded-xl opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ 
                      background: `linear-gradient(135deg, ${color}40, transparent)`
                    }}
                  />
                  <div className="
                    relative p-6 rounded-xl border-2 border-transparent bg-base-200
                    hover:border-current transition-colors cursor-pointer
                  "
                  style={{ color }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                          <IconMapPin size={24} />
                        </div>
                        <h3 className="text-lg font-semibold">{city.name}</h3>
                      </div>
                      {isLargeCard && (
                        <div className="text-sm opacity-75">
                          Top City {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        {city.value}
                      </div>
                      <div className="text-sm opacity-75">
                        Available Properties
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
