"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconCircleChevronRight } from "@tabler/icons-react";

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
    "Apartment",
    "House",
    "Villa",
    "Penthouse",
    "Studio",
    "Office",
    "Building",
    "Townhouse",
    "Shop",
    "Garage",
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
      <section className="bg-base-300 h-[calc(100vh-4.8rem)] flex items-center">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Flat-Finder - घर की तलाश अब हुई आसान !
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              Flat-Finder is a one-stop destination for finding the perfect
              home. With AI-powered recommendations, real-time availability, and
              seamless in-app chat, we bridge the gap between property owners
              and seekers. Explore verified listings, interact with agents, and
              book your dream space effortlessly. Whether you're searching for a
              cozy flat or a luxury apartment, Flat-Finder makes house hunting
              easier, smarter, and more intuitive.
            </p>
            <a
              href="/login"
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Register to Get Started
              <IconCircleChevronRight />
            </a>
            <a
              href="/about"
              className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
            >
              Learn More
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/bg.png" alt="Blockchain Voting" />
          </div>
        </div>
      </section>
      <section>
        <div className="bg-base-200 py-5 w-full">
          <div className="">
            <form
              onSubmit={handleSearch}
              className="w-full px-10 py-4 flex flex-wrap justify-between items-center gap-4"
            >
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
                className="input w-1/4 h-16 py-4 px-6 bg-base-content text-base-300 text-lg placeholder:text-base-300"
                placeholder="Search for amenities..."
                list="amenities"
              />
              <datalist id="amenities">
                {[
                  "Parking",
                  "Swimming Pool",
                  "Gym",
                  "Balcony",
                  "Security",
                  "Power Backup",
                  "WiFi",
                  "Garden",
                  "Air Conditioning",
                  "Furnished",
                ].map((amenity) => (
                  <option value={amenity} key={amenity}>
                    {amenity}
                  </option>
                ))}
              </datalist>

              {/* Property Type Dropdown */}
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={(e) => {
                  setFilters({ ...filters, propertyType: e.target.value });
                }}
                className="input w-1/4 h-16 py-4 px-6 bg-base-content text-base-300 text-lg placeholder:text-base-300"
              >
                <option value="">What type of property?</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Location Dropdown */}
              <input
                name="location"
                value={filters.location}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    location: e.target.value.toLowerCase(),
                  });
                }}
                className="input w-1/4 h-16 py-4 px-6 bg-base-content text-base-300 text-lg placeholder:text-base-300"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="btn btn-primary w-1/5 h-16 text-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="pt-24 px-10 mb-32">
        <div className="max-w-screen-md flex items-center justify-center flex-col gap-2 mx-auto mb-5">
          <h1 className="text-3xl text-center font-bold uppercase">
            Property Types
          </h1>
          <p className="text-center text-base text-base-content">
            Discover your ideal living space with Flat Finder — your trusted
            companion in locating affordable, verified flats across your desired
            location. Whether you're a student, working professional, or family,
            we make the house-hunting process smooth, reliable, and hassle-free.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {propertyType.map((type, index) => (
            <div
              className="hover:bg-base-200 h-56 flex items-center justify-center rounded-md border border-base-content"
              key={index}
            >
              <a
                className="block text-center rounded p-3"
                href={`/properties?type=${type.name}`}
              >
                <div className="rounded p-4">
                  <div className="mb-3 ">
                    <Image
                      width={80}
                      height={80}
                      src={`/${type.image}`}
                      className="mx-auto rounded-full border border-dotted p-2"
                      alt="Icon"
                    />
                  </div>
                  <p className="text-lg">{type.name}</p>
                  <span className="text-base">{type.count} Properties</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
