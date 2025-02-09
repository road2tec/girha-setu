"use client";
import axios, { AxiosResponse } from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

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
        error: (error) => {
          console.log(error);
          return error.response.data.error;
        },
      });
    } catch (error: unknown) {
      toast.error(`Failed to logout, ${String(error)}`);
    }
  };
  return (
    <div className="flex items-center justify-center h-[calc(100vh-5.7rem)]">
      <section className="relative z-10 overflow-hidden max-w-lg">
        <h3 className="mb-3 text-center text-4xl font-bold sm:text-3xl">
          Sign in to your account
        </h3>
        <p className="text-center">Welcome back User!</p>
        <div className="px-12 py-5 mt-3 border border-base-content rounded-xl space-y-4">
          {/* Email */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Enter your Email"
                className="input input-bordered w-full"
              />
            </div>
          </label>

          {/* Password */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
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
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </label>

          {/* Sign UP Protocol */}
          <div className="mb-6">
            <button className="btn btn-primary w-full" onClick={handleSignIn}>
              Sign up
            </button>
          </div>
          <p className="text-center text-base font-medium text-body-color">
            Don&apos;t you have an account?{" "}
            <Link className="text-primary hover:underline" href="/signup">
              Sign Up
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
    </div>
  );
};
export default SignInPage;
