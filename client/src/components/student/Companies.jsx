import React from "react";
import { assets } from "../../assets/assets";

const companies = [
  {
    name: "Microsoft",
    logo: assets.microsoft_logo,
  },
  {
    name: "Walmart",
    logo: assets.walmart_logo,
  },
  {
    name: "Accenture",
    logo: assets.accenture_logo,
  },
  {
    name: "Adobe",
    logo: assets.adobe_logo,
  },
  {
    name: "PayPal",
    logo: assets.paypal_logo,
  },
];

const Companies = () => {
  return (
    <section className="pt-16">
      {/* Heading */}
      <p className="text-sm uppercase tracking-wide text-gray-500 text-center">
        Trusted by learners from
      </p>

      {/* Logos */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {companies.map((company, index) => (
          <div
            key={index}
            className="group transition transform hover:scale-105"
          >
            <img
              src={company.logo}
              alt={company.name}
              loading="lazy"
              className="w-20 md:w-28 opacity-70 group-hover:opacity-100 transition duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Companies;
