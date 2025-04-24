"use client";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useAuth();
  const handleSignIn = async () => {
    try {
      const res = axios.post("/api/auth/login", data);
      toast.promise(res, {
        loading: "Signing in...",
        success: (data: AxiosResponse) => {
          console.log(data.data.message);
          router.push(data.data.route);
          setUser(data.data.exisitingUser);
          return data.data.message;
        },
        error: (error: unknown) => {
          console.log(error);
          return error.response.data.error;
        },
      });
    } catch (error: unknown) {
      toast.error(`Failed to logout, ${String(error)}`);
    }
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 h-[calc(100vh-4.8rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 min-h-full flex flex-col items-center justify-center">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Login to your account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Email <span className="text-primary">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                  required
                />
              </div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">
                    Password <span className="text-primary">*</span>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({
                        ...data,
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
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSignIn}
                >
                  Login
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Don't have an account ?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/signup")}
                >
                  signup
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
