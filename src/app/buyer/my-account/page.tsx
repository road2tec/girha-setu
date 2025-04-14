"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@/context/AuthProvider";
import { User } from "@/types/user";
import toast from "react-hot-toast";
import { IconCloudUpload } from "@tabler/icons-react";

const MyAccount = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;
  const [formData, setFormData] = useState<User>(user);
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    try {
      const res = axios.post("/api/users/update", { formData });
      toast.promise(res, {
        loading: "Updating your information...",
        success: "Information Updated Successfully",
        error: "Oops!! Something went wrong",
      });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file as Blob);
      const imageResponse = axios.post("/api/helper/upload-img", formData);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...user,
            profilePicture: data.data.data.url,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => {
          if (axios.isAxiosError(err) && err.response) {
            return `This just happened: ${err.response.data.error}`;
          }
          return "An unknown error occurred";
        },
      });
    }
  };

  return (
    <div className="-m-7">
      <div className="grid grid-cols-1 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-base-200 border border-base-content rounded-lg shadow-sm 2xl:col-span-2">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                src={user.profilePicture}
                alt={user.name}
              />
              <div>
                <h3 className="mb-1 text-xl font-bold text-base-content">
                  Profile picture
                </h3>
                <div className="mb-4 text-sm text-base-content/50">
                  JPG Max size of 800K
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="profileImageInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                  <button
                    className="btn btn-primary flex items-center space-x-2"
                    disabled={!editing}
                    onClick={() =>
                      document.getElementById("profileImageInput")?.click()
                    }
                  >
                    <IconCloudUpload size={20} />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 bg-base-300 border border-base-content rounded-lg shadow-sm 2xl:col-span-2">
            <h3 className="mb-3 text-xl font-semibold text-base-content">
              General information
            </h3>
            <div className="flex flex-wrap gap-3">
              <div>
                <label
                  htmlFor="first-name"
                  className="block mb-2 text-sm font-medium text-base-content"
                >
                  Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  disabled={!editing}
                  className="input input-primary w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block mb-2 text-sm font-medium text-base-content"
                >
                  Mobile Number <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  disabled={!editing}
                  className="input input-primary w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-base-content">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  value={formData.email || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  disabled={!editing}
                  className="input input-primary w-full"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12">
        <div className="p-8 bg-base-300 border border-base-content rounded-lg shadow-sm 2xl:col-span-2">
          <h3 className="mb-3 text-xl font-semibold text-base-content">
            Address
          </h3>
          <div>
            <label
              htmlFor="first-name"
              className="block mb-2 text-sm font-medium text-base-content"
            >
              Address <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.address.address || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  address: {
                    ...formData.address,
                    address: e.target.value,
                  },
                });
              }}
              disabled={!editing}
              className="textarea textarea-primary w-full"
              required
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full">
            <div>
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                City <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.address.city || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      city: e.target.value,
                    },
                  });
                }}
                disabled={!editing}
                className="input input-primary w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                State <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.address.state || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      state: e.target.value,
                    },
                  });
                }}
                disabled={!editing}
                className="input input-primary w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                Country <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.address.country || ""}
                readOnly
                disabled={!editing}
                className="input input-primary w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                LandMark <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.address.landmark || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      landmark: e.target.value,
                    },
                  });
                }}
                disabled={!editing}
                className="input input-primary w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-base-content"
              >
                Pin Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                minLength={6}
                maxLength={6}
                value={formData.address.postalCode || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      postalCode: e.target.value,
                    },
                  });
                }}
                disabled={!editing}
                className="input input-primary w-full"
                required
              />
            </div>
          </div>
        </div>
      </div>
      {editing ? (
        <button
          className="btn btn-outline btn-success mt-3 w-full"
          onClick={handleSave}
        >
          Save
        </button>
      ) : (
        <button
          className="btn btn-outline btn-accent mt-3 w-full"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default MyAccount;
