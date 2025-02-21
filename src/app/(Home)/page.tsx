"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCircleChevronRight } from "@tabler/icons-react";

const Hero = () => {
  const propertyTypes = ["Apartment", "House", "Villa", "Penthouse", "Studio"];
  const locations = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
  ];
  const router = useRouter();
  const [filters, setFilters] = useState({
    keyword: "",
    propertyType: "",
    location: "",
  });
  const text = [
    "घर की तलाश ? अब हुई आसान ! 🏡",
    "सही घर, सही दाम, सही समय ! ⏳",
    "आपका सपना... हमारी जिम्मेदारी ! ✨",
    "खोजें, पसंद करें, और बस जाएँ ! 🚪",
    "GrihaSetu - घर खोजने का नया तरीका ! 🔍",
  ];
  const propertyType = [
    {
      name: "Apartment",
      image: "img/icon-apartment.png",
      count: 123,
    },
    {
      name: "Villa",
      image: "img/icon-villa.png",
      count: 123,
    },
    {
      name: "Home",
      image: "img/icon-house.png",
      count: 123,
    },
    {
      name: "Office",
      image: "img/icon-housing.png",
      count: 123,
    },
    {
      name: "Building",
      image: "img/icon-building.png",
      count: 123,
    },
    {
      name: "Townhouse",
      image: "img/icon-neighborhood.png",
    },
    {
      name: "Shop",
      image: "img/icon-condominium.png",
      count: 123,
    },
    {
      name: "Garage",
      image: "img/icon-luxury.png",
      count: 123,
    },
  ];
  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
              href="#"
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Register to Get Started
              <IconCircleChevronRight />
            </a>
            <a
              href="#"
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
              {/* Search Keyword */}
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                className="input w-1/4 h-16 py-4 px-6 bg-base-content text-base-300 text-lg placeholder:text-base-300"
                placeholder="Search Keyword"
              />

              {/* Property Type Dropdown */}
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
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
              <select
                name="location"
                value={filters.location}
                onChange={handleChange}
                className="input w-1/4 h-16 py-4 px-6 bg-base-content text-base-300 text-lg placeholder:text-base-300"
              >
                <option value="">Where do you want?</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

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
      <section className="pt-24 px-10">
        <div className="max-w-screen-md flex items-center justify-center flex-col gap-2 mx-auto mb-5">
          <h1 className="text-3xl text-center font-bold">Property Types</h1>
          <p className="text-center text-base text-base-content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
            similique commodi consectetur repellat, eos iure soluta veniam non.
            Atque nihil expedita possimus earum est aliquid veritatis esse
            delectus obcaecati omnis.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {propertyType.map((type, index) => (
            <div
              className="hover:bg-base-200 h-56 flex items-center justify-center rounded-md border border-base-content"
              key={index}
            >
              <a className="block text-center rounded p-3" href="">
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
