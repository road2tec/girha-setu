"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconCircleChevronRight, IconSearch, IconHome2, IconMapPin } from "@tabler/icons-react";

const Hero = () => {
  const [flats, setFlats] = useState([]);
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await fetch("/api/listings/allListings");
        const data = await response.json();
        setFlats(data.flats);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    };
    fetchFlats();
  }, []);

  const propertyTypes = [
    "Apartment", "House", "Villa", "Penthouse", "Studio",
    "Office", "Building", "Townhouse", "Shop", "Garage",
  ];

  const router = useRouter();
  const [filters, setFilters] = useState({
    keyword: "",
    propertyType: "",
    location: "",
  });

  const propertyType = [
    {
      name: "Apartment",
      image: "img/icon-apartment.png",
      count: flats.filter((flat: any) => flat.type === "Apartment").length,
    },
    {
      name: "Villa",
      image: "img/icon-villa.png",
      count: flats.filter((flat: any) => flat.type === "Villa").length,
    },
    {
      name: "House",
      image: "img/icon-house.png",
      count: flats.filter((flat: any) => flat.type === "House").length,
    },
    {
      name: "Office",
      image: "img/icon-housing.png",
      count: flats.filter((flat: any) => flat.type === "Office").length,
    },
    {
      name: "Building",
      image: "img/icon-building.png",
      count: flats.filter((flat: any) => flat.type === "Building").length,
    },
    {
      name: "Townhouse",
      image: "img/icon-neighborhood.png",
      count: flats.filter((flat: any) => flat.type === "Townhouse").length,
    },
    {
      name: "Shop",
      image: "img/icon-condominium.png",
      count: flats.filter((flat: any) => flat.type === "Shop").length,
    },
    {
      name: "Garage",
      image: "img/icon-luxury.png",
      count: flats.filter((flat: any) => flat.type === "Garage").length,
    },
  ];

  const handleSearch = (e: any) => {
    e.preventDefault();
    const query = new URLSearchParams(filters).toString();
    router.push(`/listings?${query}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-base-300 to-base-200 min-h-[calc(100vh-4.8rem)]">
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Flat-Finder
              <span className="block text-base-content mt-2">घर की तलाश अब हुई आसान !</span>
            </h1>
            <p className="text-lg text-base-content/80 leading-relaxed max-w-xl">
              Flat-Finder is a one-stop destination for finding the perfect home. With AI-powered recommendations, 
              real-time availability, and seamless in-app chat, we bridge the gap between property owners and seekers.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/login" 
                className="btn btn-primary btn-lg group">
                Register to Get Started
                <IconCircleChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" 
                className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <Image 
              src="/bg.png" 
              alt="Flat Finder" 
              width={600} 
              height={500}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-base-200 py-8 shadow-inner">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} 
            className="bg-base-100 rounded-xl shadow-lg p-6 -mt-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="Search amenities..."
                  list="amenities"
                />
                <datalist id="amenities">
                  {["Parking", "Swimming Pool", "Gym", "Balcony", "Security", 
                    "Power Backup", "WiFi", "Garden", "Air Conditioning", "Furnished"]
                    .map((amenity) => (
                      <option value={amenity} key={amenity} />
                    ))}
                </datalist>
              </div>

              <div className="relative">
                <IconHome2 className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="select select-bordered w-full pl-10"
                  aria-label="Select property type"
                >
                  <option value="">Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value.toLowerCase() })}
                  className="input input-bordered w-full pl-10"
                  placeholder="Location"
                />
              </div>

              <button type="submit" 
                className="btn btn-primary w-full">
                Search Properties
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Property Types</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Discover your ideal living space with Flat Finder — your trusted companion in locating 
              affordable, verified flats across your desired location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {propertyType.map((type, index) => (
              <Link
                href={`/properties?type=${type.name}`}
                key={index}
                className="group bg-base-100 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-base-200"
              >
                <div className="mb-4 relative w-20 h-20 mx-auto">
                  <Image
                    src={`/${type.image}`}
                    alt={type.name}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                <p className="text-base-content/70">{type.count} Properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
