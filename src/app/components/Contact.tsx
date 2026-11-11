"use client";
import { useState, useEffect } from "react";
import CircuitGrid from "./CircuitGrid";

interface ContactProps {
  buttonTextColor: string;
  talkToSalesTextColor: string;
  talkToSalesBorderColor: string;
}

const Contact = ({
  buttonTextColor,
  talkToSalesTextColor,
  talkToSalesBorderColor,
}: ContactProps) => {
  const [visibility, setVisibility] = useState({
    title: false,
    paragraph: false,
    buttons: false,
    contactInfo1: false,
    contactInfo2: false,
    contactInfo3: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisibility((v) => ({ ...v, title: true })), 0);
            setTimeout(() => setVisibility((v) => ({ ...v, paragraph: true })), 400);
            setTimeout(() => setVisibility((v) => ({ ...v, buttons: true })), 800);
            setTimeout(() => setVisibility((v) => ({ ...v, contactInfo1: true })), 1200);
            setTimeout(() => setVisibility((v) => ({ ...v, contactInfo2: true })), 1600);
            setTimeout(() => setVisibility((v) => ({ ...v, contactInfo3: true })), 2000);
          } else {
            setVisibility({
              title: false,
              paragraph: false,
              buttons: false,
              contactInfo1: false,
              contactInfo2: false,
              contactInfo3: false,
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const contactSection = document.getElementById("contacts");
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => {
      if (contactSection) {
        observer.unobserve(contactSection);
      }
    };
  }, []);

  return (
    <section
      id="contacts"
      className="aurora-bg bg-linear-to-b from-white to-blue-50 py-20 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white p-8 shadow-lg dark:border-gray-700/20 dark:bg-gray-900 md:p-12">
          <CircuitGrid />
          <div className="relative z-10">
            <div className="relative rounded-2xl border border-white/20 p-8 dark:border-gray-700/20">
              <div className="relative z-10 text-center">
                <h2
                  className={`mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl transition-all duration-1500 ease-in-out text-stroke ${
                    visibility.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                >
                  Ready to get started?
                </h2>
                <p
                  className={`mb-8 text-xl text-gray-600 dark:text-gray-300 transition-all duration-1500 ease-in-out text-stroke ${
                    visibility.paragraph ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                >
                  Join thousands of satisfied customers transforming their workflow
                  with Bridgeach.
                </p>
                <div
                  className={`flex flex-col justify-center gap-4 sm:flex-row transition-all duration-1500 ease-in-out ${
                    visibility.buttons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                >
                  <button
                    className="transform rounded-lg bg-accent-500 px-8 py-4 font-semibold shadow-lg transition duration-300 hover:scale-110 hover:bg-accent-600"
                    style={{ color: buttonTextColor }}
                  >
                    Start Free Trial
                  </button>
                  <button
                    className="transform rounded-lg border bg-transparent px-8 py-4 font-semibold text-gray-800 shadow-lg transition duration-300 hover:scale-110 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    style={{
                      color: talkToSalesTextColor,
                      borderColor: talkToSalesBorderColor,
                    }}
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-white/20 p-6 dark:border-gray-700/20">
              <div
                className={`flex flex-col items-center text-center transition-all duration-1500 ease-in-out ${
                  visibility.contactInfo1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 transition-all hover:scale-110 dark:bg-accent-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-accent-600 dark:text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white text-stroke">
                  Contact Support
                </h3>
                <p className="mb-3 text-gray-600 dark:text-gray-300 text-stroke">
                  Our team is ready to help you
                </p>
                <a
                  href="mailto:support@bridgeach.com"
                  className="text-accent-600 hover:underline dark:text-accent-400 text-stroke"
                >
                  support@bridgeach.com
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 p-6 dark:border-gray-700/20">
              <div
                className={`flex flex-col items-center text-center transition-all duration-1500 ease-in-out ${
                  visibility.contactInfo2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 transition-all hover:scale-110 dark:bg-accent-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-accent-600 dark:text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white text-stroke">
                  Our Location
                </h3>
                <p className="mb-3 text-gray-600 dark:text-gray-300 text-stroke">
                  Visit us in our virtual office
                </p>
                <a
                  href="#"
                  className="text-accent-600 hover:underline dark:text-accent-400 text-stroke"
                >
                  hq.bridgeach.com
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 p-6 dark:border-gray-700/20">
              <div
                className={`flex flex-col items-center text-center transition-all duration-1500 ease-in-out ${
                  visibility.contactInfo3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 transition-all hover:scale-110 dark:bg-accent-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-accent-600 dark:text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white text-stroke">
                  Business Hours
                </h3>
                <p className="mb-3 text-gray-600 dark:text-gray-300 text-stroke">
                  We&apos;re here to assist you
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-stroke">
                  Mon-Fri: 9AM - 5PM (UTC +7)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
