"use client";
import { useAuth } from "@/context/AuthProvider";
import { Flat } from "@/types/flat";
import { IconBuilding, IconUser, IconCash, IconCreditCard, IconBed, IconSwimming, IconCheck, IconClock, IconBellRinging, IconAlertCircle, IconChartBar, IconChartPie, IconMap } from "@tabler/icons-react";
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

// Amenity icons mapping
const AMENITY_ICONS: { [key: string]: any } = {
  'Parking': IconCash,
  'Swimming Pool': IconSwimming,
  'Gym': IconUser,
  'Balcony': IconHome,
  'Security': IconCheck,
  'Power Backup': IconClock,
  'WiFi': IconBellRinging,
  'Garden': IconBuilding,
  'Air Conditioning': IconCreditCard,
  'Furnished': IconBed,
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
  const [amenitiesData, setAmenitiesData] = useState<{name: string, count: number}[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<{name: string, count: number}[]>([]);
  const [bhkDistributionData, setBhkDistributionData] = useState<{name: string, count: number}[]>([]);
  const [userRegistrationData, setUserRegistrationData] = useState<{name: string, total: number, buyers: number, owners: number}[]>([]);
  const [approvalStatus, setApprovalStatus] = useState({approved: 0, pending: 0});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'analytics'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/dashboard");
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} - ${await response.text()}`);
        }
        
        const data = await response.json();
        setFlats(data.flats || []);
        setDashboardData({
          users: data.users || 0,
          buyers: data.buyers || 0,
          owners: data.owners || 0,
          listings: data.listings || 0,
          feedback: data.feedback || 0,
        });
        
        // Set additional data
        setAmenitiesData(data.amenitiesDistribution || []);
        setPriceRangeData(data.priceRanges || []);
        setBhkDistributionData(data.bhkDistribution || []);
        setUserRegistrationData(data.userRegistrationByMonth || []);
        setApprovalStatus(data.approvalStatus || {approved: 0, pending: 0});
        setRecentBookings(data.recentBookings || []);
        setRecentNotifications(data.recentNotifications || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh the page or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique cities and their property counts
  const cityData = Array.from(
    flats.reduce((map, flat) => {
      const city = flat.location.city;
      map.set(city, (map.get(city) || 0) + 1);
      return map;
    }, new Map<string, number>())
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
    }, new Map<string, number>())
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const dateA = new Date(a.name).getTime();
      const dateB = new Date(b.name).getTime();
      return dateA - dateB;
    });

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Dashboard sections in 3 clear columns */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {/* Left column - Main data */}
              <div className="lg:col-span-3 space-y-8">
                {/* Recent Activity Section first - most important */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconCreditCard className="text-primary" size={20} />
                    Recent Bookings
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.length > 0 ? (
                          recentBookings.map((booking) => (
                            <tr key={booking._id} className="hover">
                              <td className="flex items-center gap-2">
                                <div className="avatar">
                                  <div className="w-8 h-8 rounded">
                                    <img src={booking.property?.mainImage} alt={booking.property?.title} />
                                  </div>
                                </div>
                                <div className="truncate max-w-[180px]">{booking.property?.title}</div>
                              </td>
                              <td>{booking.user?.name}</td>
                              <td className="font-semibold">₹{booking.totalAmount}</td>
                              <td>
                                <span className={`badge ${booking.paymentStatus === 'completed' ? 'badge-success' : booking.paymentStatus === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                  {booking.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-base-content/60">No recent bookings</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* User Registration Timeline */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconUser className="text-primary" size={20} />
                    User Registration Timeline
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Total Users</th>
                          <th>Buyers</th>
                          <th>Owners</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userRegistrationData.slice(0, 5).map((month, index) => (
                          <tr key={month.name} className="hover">
                            <td>{month.name}</td>
                            <td className="font-semibold">{month.total}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-emerald-100">
                                  <UsersIcon size={14} className="text-emerald-600" />
                                </div>
                                {month.buyers}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-violet-100">
                                  <HomeIcon size={14} className="text-violet-600" />
                                </div>
                                {month.owners}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Middle column */}
              <div className="lg:col-span-3 space-y-8">
                {/* New notifications panel */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconBellRinging className="text-primary" size={20} />
                    Recent Notifications
                  </h2>
                  <div className="space-y-5 max-h-[390px] overflow-y-auto pr-1">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification) => (
                        <div key={notification._id} className="bg-base-200 p-4 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-base-100 rounded-lg">
                              <IconBellRinging size={16} className="text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{notification.type}</div>
                              <p className="text-xs text-base-content/80 line-clamp-2 mt-1">{notification.message}</p>
                              <div className="text-xs text-base-content/60 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-base-content/60 py-8">No notifications</div>
                    )}
                  </div>
                </div>
                
                {/* Monthly property growth in more compact view */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconChartBar className="text-primary" size={20} />
                    Monthly Growth
                  </h2>
                  <div className="space-y-4">
                    {monthlyData.slice(-4).map((month, index) => (
                      <div 
                        key={month.name} 
                        className="bg-base-200 p-4 rounded-lg flex justify-between items-center hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-10 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div className="text-sm font-medium">{month.name}</div>
                        </div>
                        <div className="text-xl font-bold">{month.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-3 space-y-8">
                {/* User approval status in compact cards */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconCheck className="text-primary" size={20} />
                    User Approval
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-green-700">Approved</p>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconCheck size={16} className="text-green-700" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-700">{approvalStatus.approved}</p>
                      <div className="mt-1 text-xs text-green-700/80">
                        {((approvalStatus.approved / (approvalStatus.approved + approvalStatus.pending || 1)) * 100).toFixed(0)}% of total
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-amber-700">Pending</p>
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <IconClock size={16} className="text-amber-700" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-amber-700">{approvalStatus.pending}</p>
                      <div className="mt-1 text-xs text-amber-700/80">
                        {((approvalStatus.pending / (approvalStatus.approved + approvalStatus.pending || 1)) * 100).toFixed(0)}% of total
                      </div>
                    </div>
                  </div>
                </div>
                
             
              </div>

              <div className="lg:col-span-3 space-y-8">
                {/* Top cities in a compact list */}
                <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <IconMap className="text-primary" size={20} />
                    Top Cities
                  </h2>
                  <div className="space-y-4">
                    {cityData.slice(0, 4).map((city, index) => (
                      <div 
                        key={city.name}
                        className="bg-base-200 p-4 rounded-lg flex justify-between items-center hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-10 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="font-medium text-sm">{city.name}</span>
                        </div>
                        <span className="font-bold">{city.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range & Amenities in a combined panel */}
                
            </div>
            
            {/* Second row - Additional property analytics in a cleaner 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Property Type Distribution */}
              <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <IconChartPie className="text-primary" size={20} />
                  Property Types
                </h2>
                <div className="grid grid-cols-2 gap-5">
                  {propertyTypeData.map((type, index) => {
                    const IconComponent = PROPERTY_ICONS[type.name] || PROPERTY_ICONS.default;
                    const color = COLORS[index % COLORS.length];
                    return (
                      <div
                        key={type.name}
                        className="bg-base-200 p-5 rounded-lg hover:bg-base-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                            <IconComponent size={20} style={{ color }} />
                          </div>
                          <span className="font-medium text-sm">{type.name}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xl font-bold">{type.value}</div>
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

              {/* Price Range & Amenities in a combined panel */}
              <div className="bg-base-100 p-7 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <IconCash className="text-primary" size={20} />
                  Price Ranges
                </h2>
                <div className="space-y-4">
                  {priceRangeData.map((range, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = ((range.count / totalProperties) * 100).toFixed(1);
                    
                    return (
                      <div key={range.name} className="bg-base-200 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-sm">{range.name}</span>
                          <span className="text-xs" style={{ color }}>{percentage}%</span>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: color
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-base-content/60 mt-1 text-right">
                          {range.count} properties
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );
      
      case 'properties':
        return (
          <div className="bg-base-100 p-7 rounded-xl shadow-sm mt-2">
            <h2 className="text-xl font-semibold mb-6">Property Management</h2>
            <div className="alert alert-info">
              <span>Property management features are coming soon.</span>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="bg-base-100 p-7 rounded-xl shadow-sm mt-2">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="alert alert-info">
              <span>User management features are coming soon.</span>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="bg-base-100 p-7 rounded-xl shadow-sm mt-2">
            <h2 className="text-xl font-semibold mb-6">Advanced Analytics</h2>
            <div className="alert alert-info">
              <span>Advanced analytics features are coming soon.</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <IconAlertCircle size={50} className="text-error mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Error Loading Dashboard</h2>
        <p className="text-base-content/80 text-center max-w-md mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8 bg-base-200 min-h-screen">
      {/* Header with greeting and profile */}
      <div className="bg-base-100 rounded-2xl p-7 mb-8 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-1">
            Welcome, Admin
          </h1>
          <p className="text-base-content/70">
            Here's what's happening with your properties today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="text-right">
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-xs text-base-content/70">Administrator</p>
            </div>
          </div>
          <div className="avatar online">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user?.profilePicture} alt="admin-avatar" />
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics in a cleaner layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconUser size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">Total</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-base-content">{dashboardData.users}</h3>
            <p className="text-sm text-base-content/70">Users</p>
          </div>
        </div>
        
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <UsersIcon size={24} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-50 text-emerald-600">Buyers</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-base-content">{dashboardData.buyers}</h3>
            <p className="text-sm text-base-content/70">Active Users</p>
          </div>
        </div>
        
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <div className="p-2 bg-violet-100 rounded-lg">
              <HomeIcon size={24} className="text-violet-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-violet-50 text-violet-600">Owners</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-base-content">{dashboardData.owners}</h3>
            <p className="text-sm text-base-content/70">Property Owners</p>
          </div>
        </div>
        
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <IconBuilding size={24} className="text-orange-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-orange-50 text-orange-600">Listings</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-base-content">{dashboardData.listings}</h3>
            <p className="text-sm text-base-content/70">Active Properties</p>
          </div>
        </div>
        
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <IconMessageCircle size={24} className="text-pink-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-pink-50 text-pink-600">Feedback</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-base-content">{dashboardData.feedback}</h3>
            <p className="text-sm text-base-content/70">User Reviews</p>
          </div>
        </div>
      </div>

      {/* Dashboard navigation tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-1 mb-8 inline-flex">
        {/* <button 
          onClick={() => setActiveTab('overview')} 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('properties')} 
          className={`tab ${activeTab === 'properties' ? 'tab-active' : ''}`}
        >
          Properties
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
        >
          Analytics
        </button> */}
      </div>

      {/* Render content based on active tab */}
      {renderTabContent()}
    </div>
  );
};

export default Dashboard;
