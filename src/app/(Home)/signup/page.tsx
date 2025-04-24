"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { popularCitiesOrDistricts, STATES_IN_INDIA } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

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
        error: (res: any) => {
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
    <>
      <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5rem)]">
        <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
          <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
            <img src="login.png" alt="login" className="h-[500px]" />
          </div>
          <div className="mx-auto w-full lg:w-1/2 flex flex-col items-center justify-center md:p-10 md:py-0">
            <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
              Create Account
            </h1>
            <div className="w-full mt-5 sm:mt-8">
              <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-3">
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
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      placeholder="Enter your Email"
                      className="input input-bordered w-full"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          !user.email.includes("@") ||
                          !user.email.includes(".")
                        ) {
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
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
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
                    onChange={(e) => {
                      setUser({
                        ...user,
                        role: e.target.value as "buyer" | "owner" | "admin",
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
                    <option defaultChecked>Select State</option>
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
                    <option defaultChecked>Select Your Location</option>
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
                      {showPassword ? (
                        <IconEyeOff size={20} />
                      ) : (
                        <IconEye size={20} />
                      )}
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
              </div>
            </div>
          </div>
        </div>
        <dialog
          id="otpContainer"
          className="modal modal-bottom sm:modal-middle "
        >
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
              className="btn btn-primary w-full mt-10"
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
    </>
  );
};
export default SignUpPage;
