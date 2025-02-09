"use client";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">About Us</h1>
        <p className="text-lg text-base-content/70 mt-3">
          Your trusted platform for finding the perfect rental home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <img
          src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/001/211/233/datas/original.png"
          alt="About Us"
          className="rounded-lg shadow-lg h-96 object-cover"
        />

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Who We Are</h2>
          <p className="text-base-content/70 mt-3">
            We connect homeowners and renters to make renting hassle-free. Our
            platform offers a seamless experience, verified listings, and secure
            transactions.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mt-6">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-base-content/70 mt-3 space-y-2">
            <li>Wide range of verified properties</li>
            <li>Safe and secure transactions</li>
            <li>24/7 customer support</li>
            <li>Easy search and filtering options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
