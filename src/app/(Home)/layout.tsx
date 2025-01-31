"use client";
import "../globals.css";
import Navbar from "@/Components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>GrihaSetu | आपके सपनों का घर, अब एक क्लिक दूर!</title>
        <meta
          name="description"
          content="GrihaSetu is your one-stop destination for finding the perfect home. With AI-powered recommendations, real-time availability, and seamless in-app chat, we bridge the gap (Setu) between property owners and seekers. Explore verified listings, interact with agents, and book your dream space effortlessly. Whether you're searching for a cozy flat or a luxury apartment, GrihaSetu makes house hunting easier, smarter, and more intuitive."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
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
