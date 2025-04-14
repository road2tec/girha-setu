"use client";

const About = () => {
  return (
    <section className="bg-base-100 max-h-[calc(100vh-6rem)] flex items-center flex-col px-10 overflow-y-hidden">
      <h1 className="text-4xl font-bold text-primary uppercase my-auto mt-6">
        About Us
      </h1>
      <p className="text-lg text-base-content/70 mt-3 mb-12">
        Your trusted platform for finding the perfect rental home.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/001/211/233/datas/original.png"
          alt="About Us"
          className="rounded-lg shadow-lg h-[50%] object-cover mx-auto"
        />

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
    </section>
  );
};

export default About;
