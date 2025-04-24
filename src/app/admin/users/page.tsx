"use client";
import { User } from "@/types/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { Check, Trash2, Search, UserCircle, Filter, RefreshCw, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { ObjectId } from "mongoose";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (user: User) => {
    const updatedUser = { ...user, isAdminApproved: true };
    try {
      const response = axios.patch(`/api/users/approve`, {
        updatedUser,
      });
      toast.promise(response, {
        loading: "Approving user...",
        success: () => {
          fetchUsers();
          return "User approved successfully";
        },
        error: "Error approving user",
      });
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleDelete = async (userId: ObjectId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = axios.delete(`/api/users/delete?id=${userId}`);
      toast.promise(res, {
        loading: "Deleting user...",
        success: () => {
          fetchUsers();
          return "User deleted successfully";
        },
        error: "Error deleting user",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply role filter
    const matchesRole = filterRole === null || user.role === filterRole;
    
    // Apply status filter
    const matchesStatus = filterStatus === null || user.isAdminApproved === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleOptions = ["owner", "buyer", "admin"];
  const statusOptions = [
    { label: "Approved", value: true },
    { label: "Pending", value: false }
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
            User Management
          </h1>
          <p className="text-base-content/70">
            View, approve, and manage all user accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUsers()} 
            className="btn btn-circle btn-ghost"
            aria-label="Refresh user data"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            className="btn btn-circle btn-ghost"
            aria-label="User settings"
          >
            <Settings size={20} />
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
              placeholder="Search by name, email or city..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Filter size={18} />
                Role
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setFilterRole(null)} className={filterRole === null ? 'active' : ''}>All Roles</a></li>
                {roleOptions.map(role => (
                  <li key={role}>
                    <a onClick={() => setFilterRole(role)} className={filterRole === role ? 'active' : ''}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Filter size={18} />
                Status
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setFilterStatus(null)} className={filterStatus === null ? 'active' : ''}>All Status</a></li>
                {statusOptions.map(status => (
                  <li key={status.label}>
                    <a onClick={() => setFilterStatus(status.value)} className={filterStatus === status.value ? 'active' : ''}>
                      {status.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {(searchTerm || filterRole !== null || filterStatus !== null) && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole(null);
                  setFilterStatus(null);
                }}
                className="btn btn-outline btn-error gap-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <UserCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Approved</p>
              <p className="text-2xl font-bold">{users.filter(user => user.isAdminApproved).length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Check size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Pending</p>
              <p className="text-2xl font-bold">{users.filter(user => !user.isAdminApproved).length}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Filter size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Search Results</p>
              <p className="text-2xl font-bold">{filteredUsers.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Search size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="bg-base-200">#</th>
                <th className="bg-base-200">User</th>
                <th className="bg-base-200">Contact</th>
                <th className="bg-base-200">Role</th>
                <th className="bg-base-200 text-center">Status</th>
                <th className="bg-base-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index} className="hover">
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img src={user.profilePicture || "/placeholder-user.jpg"} alt={user.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm opacity-70">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm opacity-70">{user.address?.city || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${
                        user.role === 'owner' 
                          ? 'bg-violet-100 text-violet-800 border-violet-200' 
                          : user.role === 'admin' 
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      } py-2 px-3 font-medium capitalize`}>
                        {user.role}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`badge ${
                        user.isAdminApproved 
                          ? 'badge-success' 
                          : 'badge-warning'
                      } py-2 px-3`}>
                        {user.isAdminApproved ? "Approved" : "Pending"}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {!user.isAdminApproved && (
                          <button
                            onClick={() => handleApprove(user)}
                            className="btn btn-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-none"
                          >
                            <Check size={16} className="text-emerald-600" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id!)}
                          className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-800 border-none"
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
                  <td colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <UserCircle size={48} className="mb-2 opacity-50" />
                      <p className="font-medium">No users found</p>
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
            Showing {filteredUsers.length} of {users.length} users
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

export default UserPage;
