"use client";
import axios, { AxiosResponse } from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
          setUser({
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
              coordinates: [
                position.coords.latitude,
                position.coords.longitude,
              ],
            },
          },
        });
      },
      (error) => {
        toast.error(
          "Unable to retrieve location. Please allow location access."
        );
        console.error("Geolocation error:", error);
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Handle Submit
  const handleSubmit = () => {
    if (
      user.name === "" ||
      user.email === "" ||
      user.password === "" ||
      user.profilePicture === ""
    ) {
      toast.error("All fields are required");
      return;
    }
    const response = axios.post("/api/auth/signup", { user });
    toast
      .promise(response, {
        loading: "Creating Account...",
        success: (res: AxiosResponse) => {
          router.push("/signin");
          return res.data.message;
        },
        error: (res: unknown) => {
          return res.response.data.message;
        },
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verifyEmail = () => {
    const response = axios.post("/api/auth/verifyemail", {
      email: user.email,
    });
    toast
      .promise(response, {
        loading: "Verifying Email...",
        success: (res: AxiosResponse) => {
          setOTP(res.data.token);
          (
            document.getElementById("otpContainer") as HTMLDialogElement
          ).showModal();
          return `Email Send to ${res.data.email}`;
        },
        error: "Email Verification Failed",
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex items-center justify-center my-10">
      <section className="relative z-10 overflow-hidden max-w-xl">
        <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
          Create your account
        </h3>
        <p className="text-center">Your data is secured with us.</p>
        <div className="px-12 py-5 mt-3 border border-base-content rounded-xl space-y-4">
          {/* Full Name */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Full Name</span>
            </div>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Enter your full name"
              className="input input-bordered w-full"
            />
          </label>
          {/* Email */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your Email"
                className="input input-bordered w-full"
              />
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (!user.email.includes("@") || !user.email.includes(".")) {
                    toast.error("Invalid Email");
                  } else {
                    verifyEmail();
                  }
                }}
              >
                Verify
              </button>
            </div>
          </label>
          {/* Phone */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Phone</span>
            </div>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="Enter your Phone Number"
              className="input input-bordered w-full"
              maxLength={10}
              minLength={10}
            />
          </label>
          {/* Role */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Role</span>
            </div>
            <select
              name="role"
              id=""
              onChange={(e) => {
                setUser({
                  ...user,
                  role: e.target.value as "buyer" | "owner" | "agent" | "admin",
                });
              }}
              className="input input-bordered w-full"
            >
              <option defaultChecked disabled>
                Select Role
              </option>
              <option value="buyer">Buyer</option>
              <option value="owner">Owner</option>
            </select>
          </label>
          {/* Profile Image Url */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Upload Your Nice Photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/* .png .jpeg .jpg"
              onChange={handleProfileImageChange}
            />
          </label>
          {/* Address Fields */}
          <label className="mb-3 block text-sm text-base-conten">
            <div className="label">
              <span className="label-text">Address</span>
            </div>
            <input
              type="text"
              name="address"
              value={user.address.address}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: {
                    ...user.address,
                    address: e.target.value,
                  },
                })
              }
              placeholder="Street Address"
              className="input input-bordered w-full"
            />
          </label>

          {/* City, State, Country */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <select
              name="state"
              value={user.address.state}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: {
                    ...user.address,
                    state: e.target.value,
                  },
                })
              }
              className="input input-bordered w-full"
            >
              <option disabled defaultChecked>
                Select State
              </option>
              {STATES_IN_INDIA.map((state: string) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select
              name="city"
              value={user.address.city}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: {
                    ...user.address,
                    city: e.target.value,
                  },
                })
              }
              className="input input-bordered w-full"
            >
              <option disabled defaultChecked>
                Select Your Location
              </option>
              {user.address.state &&
                popularCitiesOrDistricts[user.address.state].map(
                  (city: string) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  )
                )}
            </select>
            <input
              type="text"
              name="country"
              value={user.address.country}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          {/* Postal Code & Landmark */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              name="postalCode"
              value={user.address.postalCode}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: {
                    ...user.address,
                    postalCode: e.target.value,
                  },
                })
              }
              placeholder="Postal Code"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="landmark"
              value={user.address.landmark}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: {
                    ...user.address,
                    landmark: e.target.value,
                  },
                })
              }
              placeholder="Landmark (Optional)"
              className="input input-bordered w-full"
            />
          </div>

          {/* Password */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
                className="input input-bordered w-full"
                placeholder="Enter Password"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-base-content"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </label>

          {/* Sign UP Protocol */}
          <div className="mb-6">
            <button
              className="btn btn-primary w-full"
              onClick={handleSubmit}
              disabled={!isEmailVerified}
            >
              Sign up
            </button>
          </div>
          <p className="text-center text-base font-medium text-body-color">
            Already using Flat-Finder?{" "}
            <Link className="text-primary hover:underline" href="/signin">
              Sign in
            </Link>
          </p>
          <div className="absolute left-0 top-0 z-[-1]">
            <svg
              width="1440"
              height="969"
              viewBox="0 0 1440 969"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_95:1005"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1440"
                height="969"
              >
                <rect width="1440" height="969" fill="#090E34" />
              </mask>
              <g mask="url(#mask0_95:1005)">
                <path
                  opacity="0.1"
                  d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                  fill="url(#paint0_linear_95:1005)"
                />
                <path
                  opacity="0.1"
                  d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                  fill="url(#paint1_linear_95:1005)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_95:1005"
                  x1="1178.4"
                  y1="151.853"
                  x2="780.959"
                  y2="453.581"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_95:1005"
                  x1="160.5"
                  y1="220"
                  x2="1099.45"
                  y2="1192.04"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>
      <dialog id="otpContainer" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box space-y-5">
          <h1 className="mt-5 text-2xl text-center">Verify Your Email</h1>
          <label htmlFor="name" className="form-control w-full">
            <div className="label">
              <span className="label-text">Please Enter the OTP</span>
            </div>
            <input
              type="text"
              value={userOTP}
              onChange={(e) => setUserOTP(e.target.value)}
              placeholder="Enter OTP"
              className="input input-bordered w-full"
            />
          </label>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              if (OTP === userOTP) {
                setIsEmailVerified(true);
                toast.success("Email Verified Successfully");
                (
                  document.getElementById("otpContainer") as HTMLDialogElement
                ).close();
              } else {
                toast.error("Invalid OTP");
              }
            }}
          >
            Verify
          </button>
        </div>
      </dialog>
    </div>
  );
};
export default SignUpPage;
