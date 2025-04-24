"use client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { IconEye, IconEyeOff, IconMail, IconLock } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface ErrorResponse {
  error: string;
}

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useAuth();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = axios.post("/api/auth/login", data);
      toast.promise(res, {
        loading: "Signing in...",
        success: (data: AxiosResponse) => {
          console.log(data.data.message);
          router.push(data.data.route);
          setUser(data.data.exisitingUser);
          return data.data.message;
        },
        error: (error: AxiosError<ErrorResponse>) => {
          console.log(error);
          return error.response?.data?.error || "An error occurred";
        },
      });
    } catch (error: unknown) {
      toast.error(`Failed to login, ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.8rem)] bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="relative hidden md:block md:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative h-full flex items-center justify-center p-8">
              <Image
                src="/login.png"
                alt="Login illustration"
                width={500}
                height={500}
                className="object-contain max-h-[80vh] drop-shadow-xl animate-float"
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 animate-slideInRight">
            <div className="max-w-md mx-auto space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome Back!
                </h1>
                <p className="mt-2 text-base-content/70">
                  Please sign in to your account
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-300"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="label cursor-pointer gap-2">
                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                    <span className="label-text">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  className={`btn btn-primary w-full ${isLoading ? 'loading' : ''} hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}
                  onClick={handleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-base-content/70">
                  Don't have an account?{" "}
                  <Link 
                    href="/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
