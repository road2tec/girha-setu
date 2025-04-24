"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconMail, IconPhone, IconUser, IconMapPin, IconHome, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Select from "react-select";

const SignUpPage = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
    profilePicture: "",
    address: {
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
      landmark: "",
    },
    isAdminApproved: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [OTP, setOTP] = useState("");
  const [userOTP, setUserOTP] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Create options for react-select
  const stateOptions = STATES_IN_INDIA.map(state => ({
    value: state,
    label: state
  }));

  const getCityOptions = (state: string) => {
    if (!state) return [];
    const cities = popularCitiesOrDistricts[state as keyof typeof popularCitiesOrDistricts] || [];
    return cities.map(city => ({
      value: city,
      label: city
    }));
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '3rem',
      borderColor: 'hsl(var(--bc) / 0.2)',
      '&:hover': {
        borderColor: 'hsl(var(--p) / 0.5)'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? 'hsl(var(--p))' : state.isFocused ? 'hsl(var(--p) / 0.1)' : 'transparent',
      color: state.isSelected ? 'hsl(var(--pc))' : 'inherit',
      '&:hover': {
        backgroundColor: state.isSelected ? 'hsl(var(--p))' : 'hsl(var(--p) / 0.1)'
      }
    })
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file as Blob);
      try {
        const response = await axios.post("/api/helper/upload-img", formData);
        setUser({
          ...user,
          profilePicture: response.data.data.url,
        });
        toast.success("Image Uploaded Successfully");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          toast.error(`Upload failed: ${err.response.data.error}`);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUser({
          ...user,
          address: {
            ...user.address,
            coordinates: {
              type: "Point",
              coordinates: [position.coords.latitude, position.coords.longitude],
            },
          },
        });
      },
      (error) => {
        toast.error("Unable to retrieve location. Please allow location access.");
        console.error("Geolocation error:", error);
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSubmit = async () => {
    if (!user.name || !user.email || !user.password || !user.profilePicture) {
      toast.error("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", { user });
      toast.success(response.data.message);
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!user.email.includes("@") || !user.email.includes(".")) {
      toast.error("Invalid Email");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/verifyemail", { email: user.email });
      setOTP(response.data.token);
      (document.getElementById("otpContainer") as HTMLDialogElement).showModal();
      toast.success(`Email sent to ${response.data.email}`);
    } catch (error) {
      toast.error("Email verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.8rem)] bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Form */}
        <div className="p-6 lg:p-8 animate-slideInRight">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="mt-2 text-base-content/70">
                Join our community and find your perfect home
              </p>
            </div>

            {/* Form */}
            <div className="space-y-3">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name Field */}
                <div className="form-control w-full">
                  <label htmlFor="name" className="label py-1">
                    <span className="label-text">Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      aria-label="Full name"
                    />
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-control w-full">
                  <label htmlFor="email" className="label py-1">
                    <span className="label-text">Email</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      placeholder="Enter your email"
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      aria-label="Email address"
                    />
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={verifyEmail}
                      disabled={!user.email || isEmailVerified}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm ${
                        isEmailVerified ? 'btn-success' : 'btn-primary'
                      }`}
                    >
                      {isEmailVerified ? 'Verified ✓' : 'Verify Email'}
                    </button>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="form-control w-full">
                  <label htmlFor="phone" className="label py-1">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      aria-label="Phone number"
                    />
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">I want to</span>
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value as "buyer" | "owner" | "admin" })}
                    className="select select-bordered w-full focus:select-primary transition-all duration-300"
                    aria-label="Select your role"
                    title="Role selection"
                  >
                    <option value="buyer">Rent a Property (Buyer)</option>
                    <option value="owner">List my Property (Owner)</option>
                  </select>
                </div>

                {/* Profile Picture */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">Profile Picture</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full pr-10 focus:file-input-primary transition-all duration-300"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      title="Choose profile picture"
                      aria-label="Choose profile picture"
                    />
                    <IconUpload className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-control w-full">
                  <label htmlFor="password" className="label py-1">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-10 pr-10 focus:input-primary transition-all duration-300"
                      aria-label="Password"
                    />
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="divider my-2 mt-4">Address Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Street Address */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">Street Address</span>
                  </label>
                  <div className="relative">
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                    <input
                      type="text"
                      value={user.address.address}
                      onChange={(e) => setUser({
                        ...user,
                        address: { ...user.address, address: e.target.value }
                      })}
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      placeholder="Enter your street address"
                    />
                  </div>
                </div>

                {/* State */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">State</span>
                  </label>
                  <Select
                    instanceId="state-select"
                    options={stateOptions}
                    value={stateOptions.find(option => option.value === user.address.state)}
                    onChange={(option) => setUser({
                      ...user,
                      address: { 
                        ...user.address, 
                        state: option?.value || '',
                        city: '' // Reset city when state changes
                      }
                    })}
                    placeholder="Search state..."
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                    aria-label="Select your state"
                  />
                </div>

                {/* City */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">City</span>
                  </label>
                  <Select
                    instanceId="city-select"
                    options={getCityOptions(user.address.state)}
                    value={getCityOptions(user.address.state).find(option => option.value === user.address.city)}
                    onChange={(option) => setUser({
                      ...user,
                      address: { ...user.address, city: option?.value || '' }
                    })}
                    placeholder="Search city..."
                    isClearable
                    isSearchable
                    isDisabled={!user.address.state}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                    aria-label="Select your city"
                  />
                </div>

                {/* Postal Code */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">Postal Code</span>
                  </label>
                  <input
                    type="text"
                    value={user.address.postalCode}
                    onChange={(e) => setUser({
                      ...user,
                      address: { ...user.address, postalCode: e.target.value }
                    })}
                    className="input input-bordered w-full focus:input-primary transition-all duration-300"
                    placeholder="Enter postal code"
                  />
                </div>

                {/* Landmark */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text">Landmark (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={user.address.landmark}
                    onChange={(e) => setUser({
                      ...user,
                      address: { ...user.address, landmark: e.target.value }
                    })}
                    className="input input-bordered w-full focus:input-primary transition-all duration-300"
                    placeholder="Enter nearby landmark"
                  />
                </div>
              </div>

              {/* Submit Button and Sign In Link */}
              <div className="space-y-3 mt-4">
                <button
                  className={`btn btn-primary w-full ${isLoading ? 'loading' : ''} hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}
                  onClick={handleSubmit}
                  disabled={!isEmailVerified || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-base-content/70">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <dialog id="otpContainer" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Email Verification</h3>
          <p className="py-4">
            Please enter the OTP sent to your email address {user.email}
          </p>
          <div className="form-control">
            <input
              type="text"
              value={userOTP}
              onChange={(e) => setUserOTP(e.target.value)}
              placeholder="Enter OTP"
              className="input input-bordered"
            />
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (userOTP === OTP) {
                    setIsEmailVerified(true);
                    toast.success("Email verified successfully!");
                    (document.getElementById("otpContainer") as HTMLDialogElement).close();
                  } else {
                    toast.error("Invalid OTP");
                  }
                }}
              >
                Verify
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        /* React Select Custom Styles */
        .react-select-container .react-select__control {
          background-color: transparent;
          border-radius: var(--rounded-btn, 0.5rem);
        }
        
        .react-select-container .react-select__control:hover {
          border-color: hsl(var(--p));
        }
        
        .react-select-container .react-select__control--is-focused {
          border-color: hsl(var(--p));
          box-shadow: 0 0 0 1px hsl(var(--p));
        }
        
        .react-select-container .react-select__menu {
          background-color: hsl(var(--b1) / 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 2px solid hsl(var(--p) / 0.2);
          border-radius: 0.75rem;
          box-shadow: 
            0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .react-select-container .react-select__menu-list {
          background-color: transparent;
          padding: 6px;
        }
        
        .react-select-container .react-select__option {
          cursor: pointer;
          background-color: transparent;
          transition: all 0.2s ease;
          border-radius: 0.5rem;
          margin-bottom: 2px;
        }

        .react-select-container .react-select__option:last-child {
          margin-bottom: 0;
        }

        .react-select-container .react-select__option--is-focused {
          background-color: hsl(var(--p) / 0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .react-select-container .react-select__option--is-selected {
          background-color: hsl(var(--p) / 0.85);
          color: hsl(var(--pc));
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        
        .react-select-container .react-select__single-value {
          color: currentColor;
        }
        
        .react-select-container .react-select__placeholder {
          color: hsl(var(--bc) / 0.5);
        }

        .react-select-container .react-select__input-container {
          color: currentColor;
        }

        .react-select-container .react-select__clear-indicator,
        .react-select-container .react-select__dropdown-indicator {
          color: hsl(var(--bc) / 0.5);
        }

        .react-select-container .react-select__clear-indicator:hover,
        .react-select-container .react-select__dropdown-indicator:hover {
          color: hsl(var(--bc) / 0.8);
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
