"use client";
import { User } from "@/types/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve User
  const handleApprove = async (user: User) => {
    const updatedUser = { ...user, isAdminApproved: true };
    try {
      const response = axios.patch(`/api/users/approve`, {
        updatedUser,
      });
      toast.promise(response, {
        loading: "Approving user...",
        success: "User approved successfully",
        error: "Error approving user",
      });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdminApproved: true } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Delete User
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-base-content shadow-lg rounded-lg">
          {/* Table Head */}
          <thead>
            <tr className="bg-base-100 text-base-content uppercase text-sm leading-normal border-b border-base-content">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-base-content text-sm font-medium">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 flex items-center gap-3">
                    <img
                      src={user.profilePicture || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border"
                    />
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-base-content/50">
                        {user.address.state}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                    <div className="text-xs text-base-content/50">
                      {user.address.city}
                    </div>
                  </td>
                  <td className="py-3 px-6 capitalize">{user.role}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.isAdminApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.isAdminApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex items-center justify-center gap-2">
                    {/* Approve Button */}
                    {!user.isAdminApproved && (
                      <button
                        onClick={() => handleApprove(user)}
                        className="btn btn-success transition"
                      >
                        <Check size={16} /> Approve
                      </button>
                    )}
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-error transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-base-content/50"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
