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
  LineChart,
  Line,
  Legend,
  AreaChart, 
  Area
} from "recharts";
import { 
  IconHome, 
  IconMoneybag, 
  IconEye,
  IconBuilding,
  IconBuildingSkyscraper,
  IconUser,
  IconCalendar,
  IconCheck,
  IconClock,
  IconMapPin,
  IconAlertCircle,
  IconBell,
  IconChartBar,
  IconChartPie,
  IconArrowUpRight,
  IconLoader2,
  IconBuildingEstate
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import axios from "axios";
import { Flat } from "@/types/flat";
import { Notification } from "@/types/Notification";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 300000,
    },
  },
});

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

interface Booking {
  _id: string;
  user: any;
  property: Flat;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Define the view data interface to fix the linter error
interface ViewData {
  name: string;
  views: number;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const Dashboard = () => {
  const [flats, setFlats] = useState<any[]>([]);
  const { user } = useAuth();
  const [viewsData, setViewsData] = useState<ViewData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings' | 'analytics'>('overview');
  const [stats, setStats] = useState({
    total: 0,
    rented: 0,
    revenue: 0,
    views: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings with React Query
  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ['owner-bookings'],
    queryFn: async () => {
      const response = await axios.get('/api/bookings/getBookingsForOwner');
      return response.data.bookings as Booking[];
    },
    enabled: !!user,
  });

  // Fetch notifications with React Query
  const { data: notifications = [], isLoading: isNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data.notifications as Notification[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/owner");
        const data = await res.json();
        setStats(data);
        setFlats(data.flats);
        setViewsData(data.viewsData);

        // Generate monthly revenue data (simulated for now)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        
        const revenueData = monthNames.map((month, index) => {
          // Create simulated data (in a real app, this would come from the backend)
          const isCurrentMonth = index === currentMonth;
          const isPastMonth = index < currentMonth;
          
          // Only show data for past months and current month
          const value = isPastMonth || isCurrentMonth 
            ? Math.floor(Math.random() * 25000) + 5000 
            : 0;
            
          return {
            name: month,
            revenue: value,
            target: 20000 // Example target
          };
        });
        
        setMonthlyRevenue(revenueData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
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
  ];

  // Create BHK distribution data
  const bhkDistribution = flats.reduce((acc: any, flat: any) => {
    const bhk = flat.bhks || 0;
    acc[bhk] = (acc[bhk] || 0) + 1;
    return acc;
  }, {});

  const bhkData = Object.entries(bhkDistribution).map(([bhk, count]) => ({
    name: `${bhk} BHK`,
    value: count as number,
  }));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconBuilding size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">Total</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-base-content">{stats.total || 0}</h3>
                  <p className="text-sm text-base-content/70">Properties Listed</p>
                </div>
              </div>
              
              <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IconCheck size={24} className="text-green-600" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-green-50 text-green-600">Rented</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-base-content">{stats.rented || 0}</h3>
                  <p className="text-sm text-base-content/70">Properties Rented</p>
                </div>
              </div>
              
              <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <IconMoneybag size={24} className="text-indigo-600" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-50 text-indigo-600">Revenue</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-base-content">{formatCurrency(stats.revenue || 0)}</h3>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                </div>
              </div>
              
              <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between mb-2">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <IconEye size={24} className="text-rose-600" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-rose-50 text-rose-600">Wishlist</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-base-content">{stats.views || 0}</h3>
                  <p className="text-sm text-base-content/70">Wishlist Adds</p>
                </div>
              </div>
            </div>

            {/* First row of charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trend */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconChartBar size={20} className="text-primary" />
                    Monthly Revenue
                  </h2>
                  <div className="badge badge-primary">This Year</div>
                </div>
                {monthlyRevenue.some(item => item.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${(value/1000)}k`} />
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Line type="monotone" dataKey="target" stroke="#ff7300" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-base-200 rounded-lg">
                    <IconChartBar size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No revenue data available yet</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      Revenue data will appear here once you start receiving bookings
                    </p>
                  </div>
                )}
              </div>

              {/* Property Type Distribution */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconChartPie size={20} className="text-primary" />
                    Property Type Distribution
                  </h2>
                </div>
                {typeData.some(item => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-base-200 rounded-lg">
                    <IconChartPie size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No property type data available</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      Add properties to see type distribution stats
                    </p>
                    <Link href="/owner/add-property" className="btn btn-sm btn-primary mt-4">
                      Add Property
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Second row of charts/data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Wishlist Views */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconEye size={20} className="text-primary" />
                    Property Wishlist Activity
                  </h2>
                </div>
                {viewsData.length > 0 && viewsData.some(item => item.views > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={viewsData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-base-200 rounded-lg">
                    <IconEye size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No wishlist activity yet</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      When users add your properties to their wishlist, you'll see activity here
                    </p>
                  </div>
                )}
              </div>

              {/* BHK Distribution */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconBuildingEstate size={20} className="text-primary" />
                    BHK Distribution
                  </h2>
                </div>
                {bhkData.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {bhkData.map((item, index) => {
                      const percentage = (item.value / flats.length) * 100;
                      return (
                        <div key={item.name} className="bg-base-200 p-4 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-sm">{item.name}</span>
                            <span className="text-xs" style={{ color: COLORS[index % COLORS.length] }}>
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-base-300 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length] 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-base-content/60 mt-1 text-right">
                            {item.value} properties
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[270px] bg-base-200 rounded-lg">
                    <IconBuildingEstate size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No BHK data available</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      Add properties with different BHK configurations to see distribution
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent bookings and notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconCalendar size={20} className="text-primary" />
                    Recent Bookings
                  </h2>
                  <Link href="/owner/bookings" className="btn btn-sm btn-outline btn-primary">
                    View All
                  </Link>
                </div>
                
                {isBookingsLoading ? (
                  <LoadingSpinner />
                ) : bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr className="bg-base-200">
                          <th className="text-xs">Property</th>
                          <th className="text-xs">Booked By</th>
                          <th className="text-xs">Amount</th>
                          <th className="text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking._id} className="hover:bg-base-200/50">
                            <td className="text-sm font-medium">{booking.property.title}</td>
                            <td className="text-sm">{booking.user.name}</td>
                            <td className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</td>
                            <td>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                booking.paymentStatus === 'completed' ? 'bg-success/20 text-success' : 
                                booking.paymentStatus === 'pending' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                              }`}>
                                {booking.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-base-200 rounded-lg">
                    <IconCalendar size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No bookings yet</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      You'll see your recent bookings here once your properties are booked
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Notifications */}
              <div className="bg-base-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <IconBell size={20} className="text-primary" />
                    Recent Notifications
                  </h2>
                  <Link href="/owner/notifications" className="btn btn-sm btn-outline btn-primary">
                    View All
                  </Link>
                </div>
                
                {isNotificationsLoading ? (
                  <LoadingSpinner />
                ) : notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification: any) => (
                      <div key={notification._id} className="bg-base-200 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <div className="p-2 bg-blue-100 rounded-full self-start mt-1">
                            <IconBell size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-base-content">{notification.message}</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-xs text-base-content/60">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                              <span className="badge badge-sm">{notification.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-base-200 rounded-lg">
                    <IconBell size={48} className="text-base-content/30 mb-3" />
                    <p className="text-base-content/60 text-center">No notifications yet</p>
                    <p className="text-xs text-base-content/40 mt-1 max-w-xs text-center">
                      You'll receive notifications about your properties here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'properties':
        return (
          <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Property Management</h2>
            
            {flats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="text-xs">Title</th>
                      <th className="text-xs">Type</th>
                      <th className="text-xs">Price</th>
                      <th className="text-xs">Location</th>
                      <th className="text-xs">Wishlist</th>
                      <th className="text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flats.map((flat: any) => (
                      <tr key={flat._id} className="hover:bg-base-200/50">
                        <td className="text-sm font-medium">{flat.title}</td>
                        <td className="text-sm">{flat.type}</td>
                        <td className="text-sm font-medium">{formatCurrency(flat.price)}</td>
                        <td className="text-sm">{flat.location?.address || 'N/A'}</td>
                        <td className="text-sm">
                          {viewsData.find((v: ViewData) => v.name === flat.title)?.views || 0}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link 
                              href={`/property?id=${flat._id}`} 
                              className="btn btn-xs btn-outline btn-primary"
                            >
                              View
                            </Link>
                            <Link 
                              href={`/owner/edit-property?id=${flat._id}`} 
                              className="btn btn-xs btn-outline"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-base-200 rounded-lg">
                <IconBuilding size={64} className="text-base-content/30 mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">You don't have any properties yet</h3>
                <p className="text-base-content/60 text-center max-w-md mb-6">
                  Add your first property to start receiving bookings and generating revenue
                </p>
                <Link href="/owner/add-property" className="btn btn-primary">
                  Add Your First Property
                </Link>
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Bookings Management</h2>
            
            {isBookingsLoading ? (
              <LoadingSpinner />
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="text-xs">Property</th>
                      <th className="text-xs">Booked By</th>
                      <th className="text-xs">Dates</th>
                      <th className="text-xs">Amount</th>
                      <th className="text-xs">Status</th>
                      <th className="text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-base-200/50">
                        <td className="text-sm font-medium">{booking.property.title}</td>
                        <td className="text-sm">{booking.user.name}</td>
                        <td className="text-sm">
                          <div>
                            <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-base-content/60">to</div>
                            <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</td>
                        <td>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            booking.paymentStatus === 'completed' ? 'bg-success/20 text-success' : 
                            booking.paymentStatus === 'pending' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <Link 
                            href={`/property?id=${booking.property._id}`} 
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            View Property
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-base-200 rounded-lg">
                <IconCalendar size={64} className="text-base-content/30 mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">No bookings found</h3>
                <p className="text-base-content/60 text-center max-w-md mb-6">
                  You don't have any bookings yet. Once your properties are booked, you'll see them here.
                </p>
                {flats.length === 0 && (
                  <Link href="/owner/add-property" className="btn btn-primary">
                    Add Property
                  </Link>
                )}
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Property Analytics</h2>
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
    <div className="max-w-[1600px] mx-auto space-y-6 p-6 bg-base-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-base-content">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <div className="flex items-center gap-3">
          {user?.profilePicture && (
            <div className="avatar online">
              <div className="w-10 rounded-full">
                <img src={user.profilePicture} alt={`${user.name}'s avatar`} />
              </div>
            </div>
          )}
          <Link href="/owner/my-account" className="p-2 hover:bg-base-300 rounded-full transition-colors">
            <IconUser size={24} className="text-base-content" />
          </Link>
        </div>
      </div>

      {/* Dashboard navigation tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-1 mb-4 inline-flex">
        <button 
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
          onClick={() => setActiveTab('bookings')} 
          className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
        >
          Bookings
        </button>
        {/* <button 
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

// Wrap the dashboard component with QueryClientProvider
const OwnerDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

export default OwnerDashboard;
