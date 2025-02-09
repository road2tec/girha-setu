"use client";

const services = [
  {
    title: "Verified Listings",
    description: "All properties are verified for authenticity and security.",
    image: "https://source.unsplash.com/600x400/?house,keys",
  },
  {
    title: "Secure Transactions",
    description: "Safe and seamless payment process for all users.",
    image: "https://source.unsplash.com/600x400/?money,security",
  },
  {
    title: "24/7 Customer Support",
    description: "We are available round the clock to assist you.",
    image: "https://source.unsplash.com/600x400/?customer,service",
  },
  {
    title: "Easy Search & Filters",
    description:
      "Find the perfect rental home with advanced filtering options.",
    image: "https://source.unsplash.com/600x400/?search,home",
  },
];

const Services = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Our Services</h1>
        <p className="text-lg text-base-content/70 mt-3">
          We provide a seamless rental experience with our top-notch services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-lg p-4 rounded-lg"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold text-secondary mt-4">
              {service.title}
            </h2>
            <p className="text-base-content/70 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
