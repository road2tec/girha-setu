"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setUser } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await axios.get("/api/auth/verifytoken");
    if (res.data) {
      setUser(res.data.user);
    }
  };
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>FlatFinder | आपके सपनों का घर, अब एक क्लिक दूर!</title>
        <meta
          name="description"
          content="FlatFinder is your one-stop destination for finding the perfect home. With AI-powered recommendations, real-time availability, and seamless in-app chat, we bridge the gap (Setu) between property owners and seekers. Explore verified listings, interact with agents, and book your dream space effortlessly. Whether you're searching for a cozy flat or a luxury apartment, FlatFinder makes house hunting easier, smarter, and more intuitive."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
