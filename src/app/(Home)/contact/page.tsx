"use client";

import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = axios.post("/api/contact/addContact", { formData });
    toast.promise(res, {
      loading: "Sending...",
      success: "Message sent successfully!",
      error: "Something went wrong!",
    });
  };
  return (
    <div className="bg-base-100 max-h-[calc(100vh-6rem)] flex items-center flex-col px-10 overflow-y-hidden">
      <h1 className="text-4xl font-bold text-primary uppercase my-auto mt-6">
        Contact Us
      </h1>
      <p className="text-lg text-base-content/70 mt-3 mb-12">
        Have questions? Reach out to us, and we’ll be happy to help.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-primary input-bordered w-full mb-4"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input input-primary input-bordered w-full mb-4"
              required
            />
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="textarea textarea-primary textarea-bordered w-full mb-4"
              rows={4}
              required
            ></textarea>
            <button className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <img
            src="/contact.png"
            alt="Contact Us"
            className="rounded-lg shadow-lg mb-6 h-80"
          />
          <div className="text-base-content/70">
            <p className="flex items-center gap-2">
              <IconPhone size={18} /> +91 9876543210
            </p>
            <p className="flex items-center gap-2 mt-2">
              <IconMail size={18} /> support@flatfinder.com
            </p>
            <p className="flex items-center gap-2 mt-2">
              <IconMapPin size={18} /> 123, Green Street, New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
